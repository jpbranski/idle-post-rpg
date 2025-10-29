/* eslint-disable @typescript-eslint/no-explicit-any */
// src/client/api-client.ts
// For v1.0: Uses localStorage (works immediately)
// For v1.1: Will use Devvit realtime API (add later)

import type { GameState } from '../shared/types/game';

const SAVE_KEY = 'idle-post-rpg-save';

// Declare window type to avoid ESLint errors
declare const window: Window & typeof globalThis;

// Check if running in Devvit environment
// const isDevvit = typeof window !== 'undefined' && 'devvit' in (window as any);

/**
 * Save game state
 * v1.0: localStorage only
 * v1.1: Will use Devvit realtime channels
 */
export async function saveGameState(gameState: GameState): Promise<void> {
  try {
    // Always save to localStorage as backup
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(SAVE_KEY, JSON.stringify(gameState));
    }

    // TODO v1.1: Send to Devvit backend when realtime API is available
    // if (isDevvit) {
    //   await window.devvit.send('save_game_state', {
    //     userId: getUserId(),
    //     gameState,
    //     username: getUsername(),
    //   });
    // }
  } catch (error) {
    console.error('Failed to save game state:', error);
  }
}

/**
 * Load game state
 * v1.0: localStorage only
 * v1.1: Will fetch from Devvit Redis
 */
export async function loadGameState(): Promise<GameState | null> {
  try {
    if (typeof localStorage !== 'undefined') {
      const saved = localStorage.getItem(SAVE_KEY);
      return saved ? JSON.parse(saved) : null;
    }
    return null;

    // TODO v1.1: Fetch from Devvit backend
    // if (isDevvit) {
    //   const data = await window.devvit.fetch('load_game_state', {
    //     userId: getUserId(),
    //   });
    //   return data;
    // }
  } catch (error) {
    console.error('Failed to load game state:', error);
    return null;
  }
}

/**
 * Get leaderboard
 * v1.0: Mock data
 * v1.1: Real data from Redis
 */
export async function getLeaderboard(limit: number = 25): Promise<any[]> {
  try {
    // TODO v1.1: Fetch real leaderboard from Devvit
    // if (isDevvit) {
    //   return await window.devvit.fetch('get_leaderboard', { limit });
    // }

    // Mock data for v1.0
    return generateMockLeaderboard(limit);
  } catch (error) {
    console.error('Failed to fetch leaderboard:', error);
    return [];
  }
}

/**
 * Get current user rank
 * v1.0: Mock data
 * v1.1: Real rank from Redis
 */
export async function getCurrentUserRank(): Promise<number | null> {
  try {
    // TODO v1.1: Fetch real rank from Devvit
    // if (isDevvit) {
    //   return await window.devvit.fetch('get_user_rank', {
    //     userId: getUserId(),
    //   });
    // }

    // Mock for v1.0
    return Math.floor(Math.random() * 1000) + 1;
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
  // TODO v1.1: Also delete from Redis
}

// === HELPERS ===

function generateMockLeaderboard(limit: number): any[] {
  return Array.from({ length: limit }, (_, i) => ({
    userId: `user_${i}`,
    username: `Player${i + 1}`,
    score: Math.floor(Math.random() * 10000000),
    rank: i + 1,
  })).sort((a, b) => b.score - a.score);
}

// TODO v1.1: Get actual user info from Devvit
// function getUserId(): string {
//   return 'local_user';
// }

// function getUsername(): string {
//   return 'LocalPlayer';
// }
