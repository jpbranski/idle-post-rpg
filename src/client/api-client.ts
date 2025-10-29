// src/client/api-client.ts
// Wrapper around devvit-bridge for easy importing

import type { GameState } from '../shared/types/game';
import {
  saveGameToRedis,
  loadGameFromRedis,
  getLeaderboardFromRedis,
  getUserRankFromRedis,
} from './devvit-bridge';

const SAVE_KEY = 'idle-post-rpg-save';

/**
 * Save game state
 * Uses Redis in production, localStorage as fallback
 */
export async function saveGameState(gameState: GameState): Promise<void> {
  try {
    await saveGameToRedis(gameState);
  } catch (error) {
    console.error('Failed to save game state:', error);
  }
}

/**
 * Load game state
 * Uses Redis in production, localStorage as fallback
 */
export async function loadGameState(): Promise<GameState | null> {
  try {
    return await loadGameFromRedis();
  } catch (error) {
    console.error('Failed to load game state:', error);
    return null;
  }
}

/**
 * Get leaderboard
 * Real data from Redis
 */
export async function getLeaderboard(
  limit: number = 25
): Promise<Array<{ userId: string; username: string; score: number; rank: number }>> {
  try {
    return await getLeaderboardFromRedis(limit);
  } catch (error) {
    console.error('Failed to fetch leaderboard:', error);
    return [];
  }
}

/**
 * Get current user rank
 * Real rank from Redis
 */
export async function getCurrentUserRank(): Promise<number | null> {
  try {
    return await getUserRankFromRedis();
  } catch (error) {
    console.error('Failed to fetch user rank:', error);
    return null;
  }
}

/**
 * Delete save data
 */
export function deleteSave(): void {
  if (typeof localStorage !== 'undefined') {
    localStorage.removeItem(SAVE_KEY);
  }
  // TODO: Also delete from Redis via API call
}
