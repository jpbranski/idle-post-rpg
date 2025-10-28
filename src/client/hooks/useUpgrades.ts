import type { GameState } from './useGameState';

export interface Upgrade {
  key: keyof GameState['upgrades'];
  label: string;
  baseCost: number;
  multiplier: number;
  maxLevel?: number;
  effectDesc: string;
}

// Static tiers with clear unlock costs
export const UPGRADES: Upgrade[] = [
  { key: 'reply', label: 'Replies', baseCost: 10, multiplier: 1.5, maxLevel: 6, effectDesc: 'Manual reply gain increases' },
  { key: 'comment', label: 'Comments', baseCost: 25, multiplier: 2, maxLevel: 6, effectDesc: 'Unlocks automatic Comment generation' },
  { key: 'post', label: 'Posts', baseCost: 250, multiplier: 2, maxLevel: 6, effectDesc: 'Unlocks automatic Post generation' },
  { key: 'shitpost', label: 'Shitposts', baseCost: 500, multiplier: 2, maxLevel: 5, effectDesc: 'Unlocks automatic Shitpost generation' },
  { key: 'pc', label: 'PC', baseCost: 150, multiplier: 1.75, maxLevel: 5, effectDesc: '+10% global karma gain per level' },
  { key: 'chair', label: 'Gaming Chair', baseCost: 400, multiplier: 2, maxLevel: 5, effectDesc: '+1% Award chance per level (max 5%)' },
];

export const INFINITE_UPGRADES = [
  {
    key: 'altAccounts',
    label: 'Alt Accounts',
    baseCost: 5000,
    multiplier: 1.25,
    effectDesc: '+5% global karma gain per purchase (no cap)',
  },
  {
    key: 'influencer',
    label: 'Influencer Status',
    baseCost: 20000,
    multiplier: 1.3,
    effectDesc: '+3% global karma gain per purchase (no cap)',
  },
];

export function getCost(base: number, level: number, mult: number): number {
  return Math.floor(base * Math.pow(mult, level));
}

export function getInfiniteCost(base: number, level: number, mult: number): number {
  return Math.floor(base * Math.pow(mult, level));
}
