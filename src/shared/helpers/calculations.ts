// src/shared/helpers/calculations.ts

import type { GameState } from '../types/game';
import {
  REPLY_BASE,
  REPLY_PER_LEVEL,
  COMMENT_BASE,
  POST_BASE,
  SHITPOST_BASE,
  BASE_AWARD_CHANCE,
  CHAIR_BONUS_PER_LEVEL,
  PRESTIGE_BONUS_PER_LEVEL,
  MAX_OFFLINE_HOURS,
} from '../constants/game';

// === UPGRADE COSTS ===
export function calculateUpgradeCost(baseCost: number, level: number, multiplier: number): number {
  return Math.floor(baseCost * Math.pow(multiplier, level));
}

// === CLICK VALUE ===
export function getClickValue(state: GameState): number {
  const baseValue = REPLY_BASE + state.upgrades.reply * REPLY_PER_LEVEL;
  return Math.floor(baseValue * getGlobalMultiplier(state));
}

// === PASSIVE GENERATION (per second) ===
export function getPassivePerSecond(state: GameState): number {
  const comment = state.passives.comment * COMMENT_BASE;
  const post = state.passives.post * POST_BASE;
  const shitpost = state.passives.shitpost * SHITPOST_BASE;

  // Check for spam effects
  const hasCommentSpam = state.activeEffects.some(
    (e) => e.type === 'spam' && e.target === 'comment'
  );
  const hasPostSpam = state.activeEffects.some((e) => e.type === 'spam' && e.target === 'post');
  const hasShitpostSpam = state.activeEffects.some(
    (e) => e.type === 'spam' && e.target === 'shitpost'
  );

  const total =
    (hasCommentSpam ? 0 : comment) + (hasPostSpam ? 0 : post) + (hasShitpostSpam ? 0 : shitpost);

  return Math.floor(total * getGlobalMultiplier(state));
}

// === GLOBAL MULTIPLIER ===
export function getGlobalMultiplier(state: GameState): number {
  let multiplier = 1;

  // PC bonus (+20% per level)
  multiplier *= 1 + state.upgrades.pc * 0.2;

  // Popular bonus (+5% per level)
  multiplier *= 1 + state.infinite.popular * 0.05;

  // Influencer bonus (+10% per level)
  multiplier *= 1 + state.infinite.influencer * 0.1;

  // Prestige bonus (+10% per level)
  multiplier *= 1 + state.prestige.level * PRESTIGE_BONUS_PER_LEVEL;

  // Check for trending/ban effects
  const trendingEffect = state.activeEffects.find((e) => e.type === 'trending');
  if (trendingEffect && trendingEffect.multiplier) {
    multiplier *= trendingEffect.multiplier;
  }

  const banEffect = state.activeEffects.find((e) => e.type === 'ban');
  if (banEffect && banEffect.multiplier) {
    multiplier *= banEffect.multiplier;
  }

  return multiplier;
}

// === AWARD CHANCE ===
export function getAwardChance(state: GameState): number {
  return BASE_AWARD_CHANCE + state.upgrades.chair * CHAIR_BONUS_PER_LEVEL;
}

// === OFFLINE PROGRESS ===
export function calculateOfflineProgress(state: GameState): number {
  const now = Date.now();
  const lastOnline = state.stats.lastOnline;
  const offlineMs = now - lastOnline;
  const offlineSeconds = Math.min(offlineMs / 1000, MAX_OFFLINE_HOURS * 3600);

  const passivePerSecond = getPassivePerSecond(state);
  return Math.floor(passivePerSecond * offlineSeconds);
}

// === PRESTIGE REQUIREMENTS ===
export function canPrestige(state: GameState): boolean {
  // Require at least 1M lifetime karma to prestige
  return state.score >= 1000000;
}

export function getPrestigeReward(state: GameState): number {
  // Returns the multiplier gained from prestiging (e.g., 1.1 for 10%)
  return 1 + (state.prestige.level + 1) * PRESTIGE_BONUS_PER_LEVEL;
}

// === AUTOCLICKER ===
export function hasActiveAutoclicker(state: GameState): boolean {
  return state.activeEffects.some((e) => e.type === 'autoclicker');
}

export function getAutoclickerCPS(state: GameState): number {
  const effect = state.activeEffects.find((e) => e.type === 'autoclicker');
  return effect?.clicksPerSecond ?? 0;
}
