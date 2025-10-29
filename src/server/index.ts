// src/server/index.ts

import { Devvit, Context } from '@devvit/public-api';
import { reddit } from '@devvit/web/server';
import type { GameState } from '../shared/types/game';

Devvit.configure({
  redditAPI: true,
  redis: true,
});

// === CREATE POST WITH SPLASH SCREEN ===
Devvit.addMenuItem({
  label: 'Create Idle Post RPG',
  location: 'subreddit',
  forUserType: 'moderator',
  onPress: async (_event, context) => {
    const { ui } = context;

    try {
      const post = await reddit.submitCustomPost({
        subredditName: context.subredditName!,
        title: 'Idle Post RPG - Farm Karma, Unlock Upgrades!',
        splash: {
          appDisplayName: 'Idle Post RPG',
          backgroundUri: 'default-splash.png',
          buttonLabel: 'Start Farming',
          description:
            'Farm karma through clicks and upgrades! Unlock themes, compete globally, and prestige for permanent bonuses.',
          heading: 'Welcome to Idle Post RPG!',
        },
      });

      ui.showToast({ text: 'Game post created!' });
      ui.navigateTo(post);
    } catch (error) {
      console.error('Error creating post:', error);
    }
  },
});

// === CUSTOM POST WITH MESSAGE HANDLER ===
Devvit.addCustomPostType({
  name: 'idle-post-rpg',
  height: 'tall',
  onAction: async (action, _data, context) => {
    const { action: actionType, payload, id } = _data;

    try {
      let result: any;

      switch (actionType) {
        case 'save_game':
          result = await handleSaveGame(payload, context);
          break;

        case 'load_game':
          result = await handleLoadGame(payload, context);
          break;

        case 'get_leaderboard':
          result = await handleGetLeaderboard(payload, context);
          break;

        case 'get_rank':
          result = await handleGetRank(payload, context);
          break;

        default:
          throw new Error(`Unknown action: ${actionType}`);
      }

      // Send success response
      context.ui.webView.postMessage('devvit-response', {
        id,
        data: result,
      });
    } catch (error: any) {
      console.error(`Error handling ${actionType}:`, error);

      // Send error response
      context.ui.webView.postMessage('devvit-response', {
        id,
        error: error.message || 'Unknown error',
      });
    }
  },
  render: () => {
    return null;
  },
});

// === HANDLER FUNCTIONS ===

async function handleSaveGame(
  payload: { gameState: GameState },
  context: Context
): Promise<void> {
  const { gameState } = payload;
  const userId = context.userId!;
  
  // Get username safely
  let username = 'Player';
  try {
    // Convert userId to t2_${string} format if needed
    const fullUserId = userId.startsWith('t2_') ? (userId as `t2_${string}`) : (`t2_${userId}` as `t2_${string}`);
    const user = await reddit.getUserById(fullUserId);
    username = user?.username || 'Player';
  } catch (err) {
    console.warn('Could not fetch username, using default');
  }

  // Save player data with expiration
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

    // Store username for display
    await context.redis.hSet(`player:${userId}:info`, {
      username,
      score: gameState.score.toString(),
      lastUpdated: Date.now().toString(),
    });
  } else if (gameState.settings.anonymous) {
    // Remove from leaderboard if anonymous
    await context.redis.zRem('leaderboard:global', [userId]);
  }

  console.log(`Game state saved for user ${userId}`);
}

async function handleLoadGame(
  _payload: any,
  context: Context
): Promise<GameState | null> {
  const userId = context.userId;

  if (!userId) {
    return null;
  }

  try {
    const data = await context.redis.get(`player:${userId}:save`);
    if (data) {
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error loading game:', error);
  }

  return null;
}

async function handleGetLeaderboard(
  payload: { limit: number },
  context: Context
): Promise<any[]> {
  const { limit = 25 } = payload;

  try {
    // Get top scores (highest first, descending)
    const entries = await context.redis.zRange('leaderboard:global', 0, limit - 1, {
      reverse: true,
    } as any); // Cast to any to handle version differences

    // Fetch usernames for each player
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
          console.error(`Error fetching leaderboard entry for ${entry.member}:`, err);
          return {
            userId: entry.member,
            username: 'Anonymous',
            score: entry.score,
            rank: index + 1,
          };
        }
      })
    );

    return leaderboard;
  } catch (error) {
    console.error('Get leaderboard error:', error);
    return [];
  }
}

async function handleGetRank(
  _payload: any,
  context: Context
): Promise<{ rank: number | null }> {
  const userId = context.userId;

  if (!userId) {
    return { rank: null };
  }

  try {
    // Get user's rank (0-indexed, from highest)
    const rank = await context.redis.zRank('leaderboard:global', userId);

    if (rank === undefined || rank === null) {
      return { rank: null };
    }

    // Convert to 1-indexed rank
    return { rank: rank + 1 };
  } catch (error) {
    console.error('Get user rank error:', error);
    return { rank: null };
  }
}

export default Devvit;