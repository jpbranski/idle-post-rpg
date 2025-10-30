// src/client/devvit-bridge.ts
// Bridge between React client and Devvit backend using HTTP endpoints

import type { GameState } from '../shared/types/game';

// Devvit Web uses standard HTTP fetch API
const API_BASE = '/api';

// Helper to make server requests
async function callServerAPI<T>(endpoint: string, payload?: any): Promise<T> {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload || {}),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    if (data.error) {
      throw new Error(data.error);
    }
    return data;
  } catch (error) {
    console.error(`API call to ${endpoint} failed:`, error);
    throw error;
  }
}

// === API Functions ===

export async function saveGameToRedis(gameState: GameState): Promise<void> {
  try {
    await callServerAPI('/save-game', { gameState });
  } catch (error) {
    console.error('Failed to save to server:', error);
    // Fallback to localStorage
    localStorage.setItem('idle-post-rpg-save', JSON.stringify(gameState));
  }
}

export async function loadGameFromRedis(): Promise<GameState | null> {
  try {
    const data = await callServerAPI<GameState | null>('/load-game');
    return data || null;
  } catch (error) {
    console.error('Failed to load from server:', error);
    // Fallback to localStorage
    const saved = localStorage.getItem('idle-post-rpg-save');
    return saved ? JSON.parse(saved) : null;
  }
}

export async function getLeaderboardFromRedis(limit: number = 25): Promise<any[]> {
  try {
    const data = await callServerAPI<any[]>('/get-leaderboard', { limit });
    return data || [];
  } catch (error) {
    console.error('Failed to get leaderboard:', error);
    return [];
  }
}

export async function getUserRankFromRedis(): Promise<number | null> {
  try {
    const data = await callServerAPI<{ rank: number | null }>('/get-rank');
    return data?.rank || null;
  } catch (error) {
    console.error('Failed to get rank:', error);
    return null;
  }
}