// src/server/index.ts
// Main server entry point - Express app for Devvit Web

import express, { Request, Response } from 'express';
import type { GameState } from '../shared/types/game';

// === EXPRESS SERVER FOR HTTP ENDPOINTS ===

interface DevvitContext {
  userId?: string;
  redis?: any;
  reddit?: any;
}

const app = express();
app.use(express.json());

// === POST /api/save-game ===
app.post('/api/save-game', async (req: Request, res: Response) => {
  try {
    const context = res.locals as DevvitContext;
    const { gameState } = req.body as { gameState: GameState };
    const userId = context.userId;

    if (!userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    // Save to Redis
    if (context.redis) {
      await context.redis.set(
        `player:${userId}:save`,
        JSON.stringify(gameState)
      );

      // Update leaderboard if not anonymous
      if (!gameState.settings.anonymous && gameState.score > 0) {
        await context.redis.zAdd('leaderboard:global', {
          member: userId,
          score: gameState.score,
        });

        // Get username and store
        let username = 'Player';
        try {
          if (context.reddit) {
            const fullUserId = userId.startsWith('t2_') ? (userId as `t2_${string}`) : (`t2_${userId}` as `t2_${string}`);
            const user = await context.reddit.getUserById(fullUserId);
            username = user?.username || 'Player';
          }
        } catch (err) {
          console.warn('Could not fetch username:', err);
        }

        await context.redis.hSet(`player:${userId}:info`, {
          username,
          score: gameState.score.toString(),
          lastUpdated: Date.now().toString(),
        });
      } else if (gameState.settings.anonymous) {
        await context.redis.zRem('leaderboard:global', [userId]);
      }
    }

    console.log(`Game saved for user ${userId}`);
    return res.json({ success: true });
  } catch (error) {
    console.error('Error saving game:', error);
    return res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

// === POST /api/load-game ===
app.post('/api/load-game', async (_req: Request, res: Response) => {
  try {
    const context = res.locals as DevvitContext;
    const userId = context.userId;

    if (!userId || !context.redis) {
      return res.json(null);
    }

    const data = await context.redis.get(`player:${userId}:save`);
    if (data) {
      return res.json(JSON.parse(data));
    }
    
    return res.json(null);
  } catch (error) {
    console.error('Error loading game:', error);
    return res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

// === POST /api/get-leaderboard ===
app.post('/api/get-leaderboard', async (req: Request, res: Response) => {
  try {
    const context = res.locals as DevvitContext;
    const { limit: _limit = 25 } = req.body as { limit?: number };
    const limitValue = _limit || 25;

    if (!context.redis) {
      return res.json([]);
    }

    // Get top scores from Redis
    const entries = await context.redis.zRange('leaderboard:global', 0, limitValue - 1, {
      reverse: true,
    } as any);

    const leaderboard = await Promise.all(
      entries.map(async (entry: any, index: number) => {
        try {
          const info = await context.redis.hGetAll(`player:${entry.member}:info`);
          return {
            userId: entry.member,
            username: (info?.username as string) || 'Anonymous',
            score: entry.score,
            rank: index + 1,
          };
        } catch (err) {
          console.error(`Error fetching leaderboard entry:`, err);
          return {
            userId: entry.member,
            username: 'Anonymous',
            score: entry.score,
            rank: index + 1,
          };
        }
      })
    );

    return res.json(leaderboard);
  } catch (error) {
    console.error('Get leaderboard error:', error);
    return res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

// === POST /api/get-rank ===
app.post('/api/get-rank', async (_req: Request, res: Response) => {
  try {
    const context = res.locals as DevvitContext;
    const userId = context.userId;

    if (!userId || !context.redis) {
      return res.json({ rank: null });
    }

    const rank = await context.redis.zRank('leaderboard:global', userId);
    
    if (rank === undefined || rank === null) {
      return res.json({ rank: null });
    }
    
    return res.json({ rank: rank + 1 });
  } catch (error) {
    console.error('Get user rank error:', error);
    return res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

// === Menu handler for creating posts ===
app.post('/internal/menu/post-create', async (_req: Request, res: Response) => {
  try {
    const context = res.locals as DevvitContext;
    
    if (!context.reddit) {
      return res.status(500).json({ error: 'Reddit API not available' });
    }

    // In Devvit Web, we'd use context.reddit to submit the post
    // For now, return success
    console.log('Menu handler called for post creation');
    return res.json({ success: true });
  } catch (error) {
    console.error('Error in menu handler:', error);
    return res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

// === Health check ===
app.get('/health', (_req: Request, res: Response) => {
  return res.json({ status: 'ok' });
});

// Export Express app as default for Devvit Web
export default app;