// src/client/hooks/useGameState.ts

import { useState, useCallback, useEffect, useRef } from 'react';
import type { GameState, ActiveEffect, ShopItem } from '../../shared/types/game';
import { DEFAULT_STATE } from '../../shared/types/game';
import {
  calculateUpgradeCost,
  getClickValue,
  getPassivePerSecond,
  getAwardChance,
  calculateOfflineProgress,
  getAutoclickerCPS,
} from '../../shared/helpers/calculations';
import {
  UPGRADES,
  PASSIVE_UPGRADES,
  INFINITE_UPGRADES,
  ACHIEVEMENTS,
  RANDOM_EVENTS,
  EVENT_INTERVAL_MIN,
  EVENT_INTERVAL_MAX,
} from '../../shared/constants/game';

const SAVE_KEY = 'idle-post-rpg-save';
const SAVE_INTERVAL = 30000; // 30 seconds

export default function useGameState() {
  const [state, setState] = useState<GameState>(() => {
    try {
      const saved = localStorage.getItem(SAVE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...DEFAULT_STATE, ...parsed };
      }
    } catch (e) {
      console.error('Failed to load save:', e);
    }
    return DEFAULT_STATE;
  });

  const saveTimeoutRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const eventTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tickIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const autoclickerIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // === SAVE GAME ===
  const saveGame = useCallback(() => {
    try {
      const toSave = { ...state, stats: { ...state.stats, lastSave: Date.now() } };
      localStorage.setItem(SAVE_KEY, JSON.stringify(toSave));
    } catch (e) {
      console.error('Failed to save:', e);
    }
  }, [state]);

  // Auto-save every 30 seconds
  useEffect(() => {
    saveTimeoutRef.current = setInterval(saveGame, SAVE_INTERVAL);
    return () => {
      if (saveTimeoutRef.current) clearInterval(saveTimeoutRef.current);
    };
  }, [saveGame]);

  // Save on unmount
  useEffect(() => {
    return () => saveGame();
  }, [saveGame]);

  // === OFFLINE PROGRESS ===
  useEffect(() => {
    const offlineKarma = calculateOfflineProgress(state);
    if (offlineKarma > 0) {
      setState((s) => ({
        ...s,
        karma: s.karma + offlineKarma,
        score: s.score + offlineKarma,
      }));
    }
    setState((s) => ({ ...s, stats: { ...s.stats, lastOnline: Date.now() } }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update lastOnline on visibility change
  useEffect(() => {
    const handler = () => {
      if (!document.hidden) {
        setState((s) => ({ ...s, stats: { ...s.stats, lastOnline: Date.now() } }));
      }
    };
    document.addEventListener('visibilitychange', handler);
    return () => document.removeEventListener('visibilitychange', handler);
  }, []);

  // === PASSIVE TICK ===
  useEffect(() => {
    tickIntervalRef.current = setInterval(() => {
      setState((s) => {
        const passive = getPassivePerSecond(s);
        if (passive <= 0) return s;

        return {
          ...s,
          karma: s.karma + passive,
          score: s.score + passive,
          stats: {
            ...s.stats,
            totalKarmaEarned: s.stats.totalKarmaEarned + passive,
            timePlayed: s.stats.timePlayed + 1,
          },
        };
      });
    }, 1000);

    return () => {
      if (tickIntervalRef.current) clearInterval(tickIntervalRef.current);
    };
  }, []);

  // === AUTOCLICKER TICK ===
  useEffect(() => {
    autoclickerIntervalRef.current = setInterval(() => {
      setState((s) => {
        const cps = getAutoclickerCPS(s);
        if (cps <= 0) return s;

        const gain = getClickValue(s) * cps;
        return {
          ...s,
          karma: s.karma + gain,
          score: s.score + gain,
          stats: {
            ...s.stats,
            totalClicks: s.stats.totalClicks + cps,
            totalKarmaEarned: s.stats.totalKarmaEarned + gain,
          },
        };
      });
    }, 1000);

    return () => {
      if (autoclickerIntervalRef.current) clearInterval(autoclickerIntervalRef.current);
    };
  }, []);

  // === ACTIVE EFFECTS CLEANUP ===
  useEffect(() => {
    const cleanup = setInterval(() => {
      const now = Date.now();
      setState((s) => ({
        ...s,
        activeEffects: s.activeEffects.filter((e) => e.endsAt > now),
      }));
    }, 1000);

    return () => clearInterval(cleanup);
  }, []);

  // === RANDOM EVENTS ===
  const scheduleNextEvent = useCallback(() => {
    const delay = Math.random() * (EVENT_INTERVAL_MAX - EVENT_INTERVAL_MIN) + EVENT_INTERVAL_MIN;

    eventTimeoutRef.current = setTimeout(() => {
      // Pick random event based on weights
      const totalWeight = RANDOM_EVENTS.reduce((sum, e) => sum + e.weight, 0);
      let roll = Math.random() * totalWeight;

      let selectedEvent = RANDOM_EVENTS[0];
      for (const event of RANDOM_EVENTS) {
        roll -= event.weight;
        if (roll <= 0) {
          selectedEvent = event;
          break;
        }
      }

      if (!selectedEvent) return;

      const effect: ActiveEffect = {
        id: selectedEvent.id + '-' + Date.now(),
        type: selectedEvent.effect,
        endsAt: Date.now() + selectedEvent.duration * 1000,
      };

      // Add multiplier if it exists
      if (selectedEvent.multiplier !== undefined) {
        effect.multiplier = selectedEvent.multiplier;
      }

      // For spam events, pick random passive target
      if (selectedEvent.effect === 'spam') {
        const targets: Array<'comment' | 'post' | 'shitpost'> = ['comment', 'post', 'shitpost'];
        const randomTarget = targets[Math.floor(Math.random() * targets.length)];
        if (randomTarget) {
          effect.target = randomTarget;
        }
      }

      setState((s) => ({
        ...s,
        activeEffects: [...s.activeEffects, effect],
      }));

      // Show toast notification
      showToast(selectedEvent.name, selectedEvent.description);

      // Unlock hidden achievements
      if (selectedEvent.effect === 'ban') {
        unlockAchievement('banned');
      } else if (selectedEvent.effect === 'spam') {
        unlockAchievement('spam');
      }

      scheduleNextEvent();
    }, delay);
  }, []);

  useEffect(() => {
    scheduleNextEvent();
    return () => {
      if (eventTimeoutRef.current) clearTimeout(eventTimeoutRef.current);
    };
  }, [scheduleNextEvent]);

  // === ACHIEVEMENT CHECKING ===
  const checkAchievements = useCallback(() => {
    ACHIEVEMENTS.forEach((achievement) => {
      if (!state.achievements.includes(achievement.id) && achievement.condition(state)) {
        setState((s) => ({
          ...s,
          achievements: [...s.achievements, achievement.id],
        }));
        showToast('Achievement Unlocked!', achievement.name);
      }
    });
  }, [state]);

  useEffect(() => {
    checkAchievements();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.stats, state.karma, state.score, state.upgrades, state.passives]);

  const unlockAchievement = useCallback((id: string) => {
    setState((s) => {
      if (s.achievements.includes(id)) return s;
      const achievement = ACHIEVEMENTS.find((a) => a.id === id);
      if (achievement) {
        showToast('Achievement Unlocked!', achievement.name);
      }
      return {
        ...s,
        achievements: [...s.achievements, id],
      };
    });
  }, []);

  // === ACTIONS ===

  const handleClick = useCallback(() => {
    setState((s) => {
      const gain = getClickValue(s);
      const awardRoll = Math.random();
      const awardChance = getAwardChance(s);
      const gotAward = awardRoll < awardChance;

      return {
        ...s,
        karma: s.karma + gain,
        score: s.score + gain,
        awards: gotAward ? s.awards + 1 : s.awards,
        stats: {
          ...s.stats,
          totalClicks: s.stats.totalClicks + 1,
          totalKarmaEarned: s.stats.totalKarmaEarned + gain,
        },
      };
    });
  }, []);

  const buyUpgrade = useCallback((key: keyof GameState['upgrades']) => {
    setState((s) => {
      const upgrade = UPGRADES.find((u) => u.key === key);
      if (!upgrade) return s;

      const currentLevel = s.upgrades[key];
      if (upgrade.maxLevel && currentLevel >= upgrade.maxLevel) return s;

      const cost = calculateUpgradeCost(upgrade.baseCost, currentLevel, upgrade.costMultiplier);
      if (s.karma < cost) return s;

      return {
        ...s,
        karma: s.karma - cost,
        upgrades: {
          ...s.upgrades,
          [key]: currentLevel + 1,
        },
      };
    });
  }, []);

  const buyPassive = useCallback((key: keyof GameState['passives']) => {
    setState((s) => {
      const upgrade = PASSIVE_UPGRADES.find((u) => u.key === key);
      if (!upgrade) return s;

      const currentLevel = s.passives[key];
      const cost = calculateUpgradeCost(upgrade.baseCost, currentLevel, upgrade.costMultiplier);
      if (s.karma < cost) return s;

      return {
        ...s,
        karma: s.karma - cost,
        passives: {
          ...s.passives,
          [key]: currentLevel + 1,
        },
      };
    });
  }, []);

  const buyInfinite = useCallback((key: keyof GameState['infinite']) => {
    setState((s) => {
      const upgrade = INFINITE_UPGRADES.find((u) => u.key === key);
      if (!upgrade) return s;

      const currentLevel = s.infinite[key];
      const cost = calculateUpgradeCost(upgrade.baseCost, currentLevel, upgrade.costMultiplier);
      if (s.karma < cost) return s;

      return {
        ...s,
        karma: s.karma - cost,
        infinite: {
          ...s.infinite,
          [key]: currentLevel + 1,
        },
      };
    });
  }, []);

  const buyShopItem = useCallback((item: ShopItem) => {
    setState((s) => {
      if (s.awards < item.cost) return s;

      let newState = { ...s, awards: s.awards - item.cost };

      if (item.type === 'theme' && item.value) {
        if (!newState.unlocks.themes.includes(item.value)) {
          newState.unlocks.themes = [...newState.unlocks.themes, item.value];
        }
      } else if (item.type === 'autoclicker' && item.duration && item.clicksPerSecond) {
        const effect: ActiveEffect = {
          id: 'autoclicker-' + Date.now(),
          type: 'autoclicker',
          endsAt: Date.now() + item.duration * 1000,
          clicksPerSecond: item.clicksPerSecond,
        };
        newState.activeEffects = [...newState.activeEffects, effect];
      } else if (item.type === 'prestige') {
        // Handle prestige
        newState = {
          ...DEFAULT_STATE,
          prestige: {
            level: newState.prestige.level + 1,
            badges: [...newState.prestige.badges, `prestige-${newState.prestige.level + 1}`],
          },
          unlocks: newState.unlocks, // Keep unlocks
          achievements: newState.achievements, // Keep achievements
          stats: {
            ...DEFAULT_STATE.stats,
            totalKarmaEarned: newState.stats.totalKarmaEarned,
            timePlayed: newState.stats.timePlayed,
          },
          settings: newState.settings,
        };
      }

      return newState;
    });
  }, []);

  const changeTheme = useCallback((theme: string) => {
    setState((s) => ({
      ...s,
      settings: {
        ...s.settings,
        theme,
      },
    }));
  }, []);

  const toggleAnonymous = useCallback(() => {
    setState((s) => ({
      ...s,
      settings: {
        ...s.settings,
        anonymous: !s.settings.anonymous,
      },
    }));
  }, []);

  const resetGame = useCallback(() => {
    localStorage.removeItem(SAVE_KEY);
    setState(DEFAULT_STATE);
  }, []);

  return {
    state,
    setState,
    handleClick,
    buyUpgrade,
    buyPassive,
    buyInfinite,
    buyShopItem,
    changeTheme,
    toggleAnonymous,
    resetGame,
    saveGame,
  };
}

// Toast notification helper (placeholder - implement with proper UI)
function showToast(title: string, message: string) {
  console.log(`[TOAST] ${title}: ${message}`);
  // TODO: Implement actual toast UI
}
