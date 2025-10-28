import { useEffect } from 'react';
import type { GameState } from './useGameState';

const REPLY_TIERS = [1, 2, 3, 5, 7, 10];
const COMMENT_TIERS = [3, 5, 7, 10, 15, 20];
const POST_TIERS = [10, 15, 25, 50, 75, 100];
const SHITPOST_TIERS = [25, 50, 100, 150, 250];

export function useTicker(state: GameState, addKarma: (amount: number) => void) {
  useEffect(() => {
    const interval = setInterval(() => {
      const upgrades = state?.upgrades ?? {};
      const infinite = state?.infinite ?? {};
      let passive = 0;

      // Safe lookups with ?? 0 fallback
      if (upgrades.comment && upgrades.comment > 0)
        passive += COMMENT_TIERS[Math.min(upgrades.comment - 1, COMMENT_TIERS.length - 1)] ?? 0;
      if (upgrades.post && upgrades.post > 0)
        passive += POST_TIERS[Math.min(upgrades.post - 1, POST_TIERS.length - 1)] ?? 0;
      if (upgrades.shitpost && upgrades.shitpost > 0)
        passive += SHITPOST_TIERS[Math.min(upgrades.shitpost - 1, SHITPOST_TIERS.length - 1)] ?? 0;

      const altBonus = 1 + (infinite.altAccounts ?? 0) * 0.05;
      const infBonus = 1 + (infinite.influencer ?? 0) * 0.03;
      const globalBonus = 1 + (upgrades.pc ?? 0) * 0.1;

      passive = Math.floor(passive * altBonus * infBonus * globalBonus);
      if (passive > 0) addKarma(passive);
    }, 1000);

    return () => clearInterval(interval);
  }, [state, addKarma]);
}
