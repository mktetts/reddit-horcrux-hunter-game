import { context, reddit } from '@devvit/web/server';

export const createPost = async () => {
  const { subredditName } = context;
  if (!subredditName) {
    throw new Error('subredditName is required');
  }

  return await reddit.submitCustomPost({
    splash: {
      // Splash Screen Configuration
      appDisplayName: 'Horcrux Hunt',
      backgroundUri: 'wizards.png',
      appIconUri: 'wand.gif',
      buttonLabel: 'Start Hunt',
      description: 'Hide your Soul.. Hunt others Horcrux',
      heading: 'Welcome to the Horcrux Hunt Game!',
    },
    postData: {
      gameState: 'initial',
      puzzleId: null,
    },
    subredditName: subredditName,
    title: 'Welcome to the Horcrux Hunt Game!',
  });
};
