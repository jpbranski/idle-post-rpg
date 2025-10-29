// src/client/devvit-bridge.ts
// Bridge between React client and Devvit backend

import type { GameState } from '../shared/types/game';

// Check if we're in Devvit environment
const isDevvit = typeof window !== 'undefined' && 'parent' in window && window.parent !== window;

// Generate request ID for tracking
let requestId = 0;
const pendingRequests = new Map<
  number,
  { resolve: (value: any) => void; reject: (error: any) => void }
>();

// Listen for messages from Devvit backend
if (isDevvit) {
  window.addEventListener('message', (event) => {
    const { type, id, data, error } = event.data;

    if (type === 'devvit-response') {
      const pending = pendingRequests.get(id);
      if (pending) {
        if (error) {
          pending.reject(new Error(error));
        } else {
          pending.resolve(data);
        }
        pendingRequests.delete(id);
      }
    }
  });
}

// Send message to Devvit backend
function sendToDevvit(action: string, payload: any): Promise<any> {
  if (!isDevvit) {
    return Promise.reject(new Error('Not in Devvit environment'));
  }

  return new Promise((resolve, reject) => {
    const id = requestId++;
    pendingRequests.set(id, { resolve, reject });

    window.parent.postMessage(
      {
        type: 'devvit-message',
        data: { id, action, payload },
      },
      '*'
    );

    // Timeout after 15 seconds
    setTimeout(() => {
      if (pendingRequests.has(id)) {
        pendingRequests.delete(id);
        reject(new Error('Request timeout (15s)'));
      }
    }, 15000);
  });
}

// === API Functions ===

export async function saveGameToRedis(gameState: GameState): Promise<void> {
  if (!isDevvit) {
    // Fallback to localStorage in dev
    localStorage.setItem('idle-post-rpg-save', JSON.stringify(gameState));
    return;
  }

  try {
    await sendToDevvit('save_game', { gameState });
  } catch (error) {
    console.error('Failed to save to Redis:', error);
    // Fallback to localStorage
    localStorage.setItem('idle-post-rpg-save', JSON.stringify(gameState));
  }
}

export async function loadGameFromRedis(): Promise<GameState | null> {
  if (!isDevvit) {
    // Fallback to localStorage in dev
    const saved = localStorage.getItem('idle-post-rpg-save');
    return saved ? JSON.parse(saved) : null;
  }

  try {
    const data = await sendToDevvit('load_game', {});
    return data || null;
  } catch (error) {
    console.error('Failed to load from Redis:', error);
    // Fallback to localStorage
    const saved = localStorage.getItem('idle-post-rpg-save');
    return saved ? JSON.parse(saved) : null;
  }
}

export async function getLeaderboardFromRedis(limit: number = 25): Promise<any[]> {
  if (!isDevvit) {
    // Return mock data in dev
    return generateMockLeaderboard(limit);
  }

  try {
    const data = await sendToDevvit('get_leaderboard', { limit });
    return data || [];
  } catch (error) {
    console.error('Failed to get leaderboard:', error);
    return [];
  }
}

export async function getUserRankFromRedis(): Promise<number | null> {
  if (!isDevvit) {
    return null;
  }

  try {
    const data = await sendToDevvit('get_rank', {});
    return data?.rank || null;
  } catch (error) {
    console.error('Failed to get rank:', error);
    return null;
  }
}

// Helper
function generateMockLeaderboard(limit: number): any[] {
  return Array.from({ length: limit }, (_, i) => ({
    userId: `user_${i}`,
    username: `Player${i + 1}`,
    score: Math.floor(Math.random() * 10000000),
    rank: i + 1,
  })).sort((a, b) => b.score - a.score);
}

export { isDevvit };