import { useState } from 'react';
import { UPGRADES, getCost, getInfiniteCost } from './useUpgrades';

export interface GameState {
  karma: number;
  lifetimeKarma: number;
  awards: number;
  upgrades: {
    reply: number;
    comment: number;
    post: number;
    shitpost: number;
    pc: number;
    chair: number;
  };
  infinite: {
    altAccounts: number;
    influencer: number;
  };
  theme: 'light' | 'dark' | 'oldschool';
}

export default function useGameState() {
  const [state, setState] = useState<GameState>({
    karma: 0,
    lifetimeKarma: 0,
    awards: 0,
    upgrades: {
      reply: 0,
      comment: 0,
      post: 0,
      shitpost: 0,
      pc: 0,
      chair: 0,
    },
    infinite: {
      altAccounts: 0,
      influencer: 0,
    },
    theme: 'light',
  });

  // === Core game logic ===

  function addKarma(amount: number) {
    setState(s => ({
      ...s,
      karma: s.karma + amount,
      lifetimeKarma: s.lifetimeKarma + amount,
    }));
  }

  function spendKarma(amount: number) {
    setState(s => ({
      ...s,
      karma: Math.max(0, s.karma - amount),
    }));
  }

  // === Upgrades ===

  function buyUpgrade(key: keyof GameState['upgrades'], baseCost: number, multiplier: number) {
    setState(s => {
      const level = s.upgrades[key] ?? 0;
      const upgrade = UPGRADES.find(u => u.key === key);
      const cost = getCost(baseCost, level, multiplier);

      if (s.karma < cost) return s;
      if (upgrade?.maxLevel && level >= upgrade.maxLevel) return s;

      return {
        ...s,
        karma: s.karma - cost,
        upgrades: {
          ...s.upgrades,
          [key]: level + 1,
        },
      };
    });
  }

  function buyInfinite(key: keyof GameState['infinite'], baseCost: number, multiplier: number) {
    setState(s => {
      const level = s.infinite[key] ?? 0;
      const cost = getInfiniteCost(baseCost, level, multiplier);

      if (s.karma < cost) return s;

      return {
        ...s,
        karma: s.karma - cost,
        infinite: {
          ...s.infinite,
          [key]: level + 1,
        },
      };
    });
  }

  return {
    state,
    setState,
    addKarma,
    spendKarma,
    buyUpgrade,
    buyInfinite,
  };
}
