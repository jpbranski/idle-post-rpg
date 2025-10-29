// src/server/index.ts

import { Devvit } from '@devvit/public-api';
import { reddit } from '@devvit/web/server';
import type { GameState } from '../shared/types/game.js';

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
          description: 'Farm karma through clicks and upgrades! Unlock themes, compete globally, and prestige for permanent bonuses.',
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
 
// === SAVE GAME STATE ===
Devvit.addSchedulerJob({
  name: 'save_game_state',
  onRun: async (event, context) => {
    const data = event.data as any;
    const { userId, gameState, username } = data;
    
    try {
      // Save player data
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
          username: username || 'Player',
          score: gameState.score.toString(),
        });
      } else if (gameState.settings.anonymous) {
        // Remove from leaderboard if anonymous
        await context.redis.zRem('leaderboard:global', [userId]);
      }
      
      console.log('Game state saved successfully for user:', userId);
    } catch (error) {
      console.error('Save game state error:', error);
    }
  },
});

// === LOAD GAME STATE ===
Devvit.addSchedulerJob({
  name: 'load_game_state',
  onRun: async (event, context) => {
    const { userId } = event.data as any;
    
    try {
      const data = await context.redis.get(`player:${userId}:save`);
      console.log('Game state loaded for user:', userId, data ? 'found' : 'not found');
    } catch (error) {
      console.error('Load game state error:', error);
    }
  },
});

// === GET LEADERBOARD ===
Devvit.addSchedulerJob({
  name: 'get_leaderboard',
  onRun: async (event, context) => {
    const { limit = 25 } = event.data as any;
    
    try {
      // Get top scores (highest first)
      const entries = await context.redis.zRange(
        'leaderboard:global',
        -limit,
        -1
      );
      
      // Reverse to get highest scores first
      const topPlayers = entries.reverse();
      
      // Fetch usernames for each player
      const leaderboard = await Promise.all(
        topPlayers.map(async (entry, index) => {
          const info = await context.redis.hGetAll(`player:${entry.member}:info`);
          return {
            userId: entry.member,
            username: info.username || 'Anonymous',
            score: entry.score,
            rank: index + 1,
          };
        })
      );
      
      console.log('Leaderboard fetched:', leaderboard.length, 'entries');
    } catch (error) {
      console.error('Get leaderboard error:', error);
    }
  },
});

// === GET USER RANK ===
Devvit.addSchedulerJob({
  name: 'get_user_rank',
  onRun: async (event, context) => {
    const { userId } = event.data as any;
    
    try {
      // Get total count
      const totalPlayers = await context.redis.zCard('leaderboard:global');
      
      // Get user's rank (0-indexed)
      const rank = await context.redis.zRank('leaderboard:global', userId);
      
      if (rank === undefined) {
        console.log('User not found in leaderboard:', userId);
        return;
      }
      
      // Convert to 1-indexed rank (counting from top)
      const actualRank = totalPlayers - rank;
      
      console.log('User rank:', userId, actualRank);
    } catch (error) {
      console.error('Get user rank error:', error);
    }
  },
});

export default Devvit;