import { context, reddit } from '@devvit/web/server';

export const createPost = async () => {
  const { subredditName } = context;
  if (!subredditName) {
    throw new Error('subredditName is required');
  }

  return await reddit.submitCustomPost({
    splash: {
      // Splash Screen Configuration
      appDisplayName: 'idle-post-rpg',
      backgroundUri: 'default-splash.png',
      buttonLabel: 'Begin Farming',
      description: 'Your idle karma farming adventures begin here.',
      heading: 'Idle Post RPG!',
      appIconUri: 'default-icon.png',
    },
    postData: {
      gameState: 'initial',
      score: 0,
    },
    subredditName: subredditName,
    title: 'idle-post-rpg',
  });
};
