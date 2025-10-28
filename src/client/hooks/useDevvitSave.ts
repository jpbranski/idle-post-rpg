import { useEffect, useRef } from 'react';
import type { HandlerContext } from '@devvit/public-api';

export interface SaveData {
  username: string | null;
  isAnonymous: boolean;
  totalScore: number;
  karma: number;
  tick: number;
  upgrades: Record<string, number>;
  unlocks: string[];
  awards: string[];
  lastSave: string;
}

export function useDevvitSave(context: HandlerContext, gameState: SaveData) {
  const saveInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const loadData = async () => {
      const userId = context.user?.id;
      if (!userId) return;

      try {
        const stored = await context.userStorage.get<string>(`player:${userId}`);
        if (stored) {
          const parsed = JSON.parse(stored);
          Object.assign(gameState, parsed);
          console.log('Loaded player save:', parsed);
        }
      } catch (err) {
        console.error('Error loading save:', err);
      }
    };

    void loadData();
  }, [context, gameState]);

  useEffect(() => {
    const saveNow = async () => {
      const userId = context.user?.id;
      if (!userId) return;

      try {
        const payload = { ...gameState, lastSave: new Date().toISOString() };
        await context.userStorage.set(`player:${userId}`, JSON.stringify(payload));
        console.log('Auto-saved game for', userId);
      } catch (err) {
        console.error('Error saving game:', err);
      }
    };

    void saveNow();
    saveInterval.current = setInterval(() => void saveNow(), 30_000);
    return () => clearInterval(saveInterval.current!);
  }, [context, gameState]);
}
