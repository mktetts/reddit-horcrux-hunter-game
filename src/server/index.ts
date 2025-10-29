import express from 'express';
import {
  InitResponse,
  IncrementResponse,
  DecrementResponse,
  CreatePuzzleRequest,
  CreatePuzzleResponse,
  GetPuzzleResponse,
  SubmitGuessRequest,
  SubmitGuessResponse,
  GetSolutionResponse,
  UpdateScoreRequest,
  UpdateScoreResponse,
  GetPlayerStatsResponse,
  GetLeaderboardResponse,
} from '../shared/types/api';
import { redis, reddit, createServer, context, getServerPort } from '@devvit/web/server';
import { createPost } from './core/post';

const app = express();

// Middleware for JSON body parsing
app.use(express.json());
// Middleware for URL-encoded body parsing
app.use(express.urlencoded({ extended: true }));
// Middleware for plain text body parsing
app.use(express.text());

const router = express.Router();

// Game API endpoints

// Create a new puzzle post
router.post<{}, CreatePuzzleResponse, CreatePuzzleRequest>(
  '/api/create-puzzle-post',
  async (req, res): Promise<void> => {
    const { subredditName } = context;

    if (!subredditName) {
      res.status(400).json({
        status: 'error',
        message: 'subredditName is required but missing from context',
      });
      return;
    }

    try {
      const { gameData } = req.body;

      if (!gameData) {
        res.status(400).json({
          status: 'error',
          message: 'gameData is required',
        });
        return;
      }

      const headings = [
        `${gameData.word_length}-letter dark magic`,
        `${gameData.word_length}-letter spell challenge`,
        `${gameData.word_length}-letter cursed puzzle`,
        `${gameData.word_length}-letter enchanted word`,
        `${gameData.word_length}-letter wizard’s test`,
        `${gameData.word_length}-letter mystic riddle`,
        `${gameData.word_length}-letter forbidden charm`,
        `${gameData.word_length}-letter arcane trial`,
        `${gameData.word_length}-letter prophecy quest`,
        `${gameData.word_length}-letter magical cipher`,
        `${gameData.word_length}-letter shadow incantation`,
        `${gameData.word_length}-letter occult enigma`,
        `${gameData.word_length}-letter sorcery puzzle`,
        `${gameData.word_length}-letter cryptic spell`,
        `${gameData.word_length}-letter ancient magic`,
      ];

      const descriptions = [
        `A dark wizard has hidden their soul in magical objects! Can you destroy this Horcrux using only ${gameData.minimal_emoji_count} objects? 💀⚡`,
        `Your magical knowledge will be tested. Use ${gameData.minimal_emoji_count} objects to uncover the hidden word! 🧙‍♂️✨`,
        `Dark forces have cast a word curse! Break it with ${gameData.minimal_emoji_count} enchanted symbols. 🔮`,
        `Only a true wizard can solve this ${gameData.word_length}-letter mystery using ${gameData.minimal_emoji_count} clues. 🪄`,
        `The fate of magic rests with you. Use ${gameData.minimal_emoji_count} relics to uncover the truth. 🧩`,
        `Ancient runes hide a secret. Reveal it with ${gameData.minimal_emoji_count} mystical signs. 🕯️`,
        `A shadowy force sealed a word in the void. You hold ${gameData.minimal_emoji_count} keys to unlock it. 🌑`,
        `Whispers of dark magic echo through time. Solve the ${gameData.word_length}-letter code before it consumes you. ⏳`,
        `Use your ${gameData.minimal_emoji_count} magical artifacts to reveal the hidden incantation. 🔥`,
        `Every Horcrux hides a riddle. Use ${gameData.minimal_emoji_count} enchanted clues to destroy it. ⚔️`,
        `The spell is woven in mystery. Break it using ${gameData.minimal_emoji_count} clues of power. 🌌`,
        `An ancient curse binds the word in darkness. Only ${gameData.minimal_emoji_count} relics can free it. 🧿`,
        `Dark energies twist the letters together. Use your ${gameData.minimal_emoji_count} sacred symbols to restore balance. ⚖️`,
        `The prophecy speaks of a ${gameData.word_length}-letter word of power. Reveal it before the night falls. 🌒`,
        `With ${gameData.minimal_emoji_count} mystical tools, uncover the truth behind the forbidden spell. 🕸️`,
      ];

      // Create a new Reddit post with the puzzle
      const post = await reddit.submitCustomPost({
        splash: {
          appDisplayName: 'Horcrux Hunt', // Required field
          backgroundUri: 'wizards.png',
          appIconUri: 'wand.gif',
          buttonLabel: descriptions[Math.floor(Math.random() * descriptions.length)],
          // heading: headings[Math.floor(Math.random() * headings.length)],
          // description: descriptions[Math.floor(Math.random() * descriptions.length)],
        },
        subredditName: subredditName,
        title: `🪄 Horcrux Hunt:` + headings[Math.floor(Math.random() * headings.length)],
        userGeneratedContent: {
          text: `A dark wizard has hidden their soul in magical objects! Can you destroy this Horcrux using only ${gameData.minimal_emoji_count} objects? 💀⚡`,
        },
        postData: gameData as any,
      });

      // Store puzzle data in Redis with the new post ID
      const puzzleKey = `puzzle:${post.id}`;
      await redis.set(puzzleKey, JSON.stringify(gameData));

      // Track puzzle creation for the user
      const userId = await reddit.getCurrentUsername();
      if (userId) {
        // Store puzzle ownership
        const puzzleOwnerKey = `puzzle_owner:${post.id}`;
        await redis.set(puzzleOwnerKey, userId);

        // Store creation timestamp
        const puzzleCreatedAtKey = `puzzle_created_at:${post.id}`;
        await redis.set(puzzleCreatedAtKey, Date.now().toString());

        const puzzlesCreatedKey = `puzzles_created:${userId}`;
        const currentCount = await redis.get(puzzlesCreatedKey);
        const newCount = (parseInt(currentCount || '0') + 1).toString();
        await redis.set(puzzlesCreatedKey, newCount);

        // Track last action for alternating gameplay
        const lastActionKey = `last_action:${userId}`;
        await redis.set(lastActionKey, 'hide');
      }

      res.json({
        status: 'success',
        puzzleId: post.id,
        message: 'Puzzle post created successfully',
        postUrl: `https://reddit.com/r/${subredditName}/comments/${post.id}`,
      });
    } catch (error) {
      console.error(`Error creating puzzle post:`, error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to create puzzle post',
      });
    }
  }
);

// Create a new puzzle (legacy endpoint for existing puzzles)
router.post<{}, CreatePuzzleResponse, CreatePuzzleRequest>(
  '/api/create-puzzle',
  async (req, res): Promise<void> => {
    const { postId } = context;

    if (!postId) {
      res.status(400).json({
        status: 'error',
        message: 'postId is required but missing from context',
      });
      return;
    }

    try {
      const { gameData } = req.body;

      if (!gameData) {
        res.status(400).json({
          status: 'error',
          message: 'gameData is required',
        });
        return;
      }

      // Store puzzle data in Redis
      const puzzleKey = `puzzle:${postId}`;
      await redis.set(puzzleKey, JSON.stringify(gameData));

      // Track puzzle ownership for legacy endpoint
      const userId = await reddit.getCurrentUsername();
      if (userId) {
        const puzzleOwnerKey = `puzzle_owner:${postId}`;
        await redis.set(puzzleOwnerKey, userId);

        const puzzleCreatedAtKey = `puzzle_created_at:${postId}`;
        await redis.set(puzzleCreatedAtKey, Date.now().toString());
      }

      res.json({
        status: 'success',
        puzzleId: postId,
        message: 'Puzzle created successfully',
      });
    } catch (error) {
      console.error(`Error creating puzzle for post ${postId}:`, error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to create puzzle',
      });
    }
  }
);

// Get puzzle data
router.get<{ postId: string }, GetPuzzleResponse>(
  '/api/get-puzzle/:postId',
  async (req, res): Promise<void> => {
    try {
      const { postId } = req.params;

      if (!postId) {
        res.status(400).json({
          status: 'error',
          message: 'postId is required',
        });
        return;
      }

      const userId = await reddit.getCurrentUsername();

      if (!userId) {
        res.status(401).json({
          status: 'error',
          message: 'User not authenticated',
        });
        return;
      }

      // Check puzzle ownership (handle cases where ownership data doesn't exist)
      const puzzleOwnerKey = `puzzle_owner:${postId}`;
      const ownerId = await redis.get(puzzleOwnerKey);
      const isOwner = ownerId ? userId === ownerId : false;

      if (isOwner) {
        res.json({
          status: 'error',
          message: 'You cannot solve your own puzzle! Create new puzzles or find others to solve.',
          alreadySolved: false,
          isOwner: true,
        });
        return;
      }

      // Check if user already solved this puzzle
      const solvedKey = `solved:${postId}:${userId}`;
      const alreadySolved = await redis.get(solvedKey);

      if (alreadySolved) {
        res.json({
          status: 'error',
          message: 'You have already destroyed this Horcrux! The dark magic has been vanquished.',
          alreadySolved: true,
          isOwner: false,
        });
        return;
      }

      const puzzleKey = `puzzle:${postId}`;
      const puzzleData = await redis.get(puzzleKey);

      if (!puzzleData) {
        res.status(404).json({
          status: 'error',
          message: 'Puzzle not found',
        });
        return;
      }

      res.json({
        status: 'success',
        gameData: JSON.parse(puzzleData),
        alreadySolved: false,
        isOwner: false,
      });
    } catch (error) {
      console.error(`Error getting puzzle:`, error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to get puzzle',
      });
    }
  }
);

// Submit a guess
router.post<{ postId: string }, SubmitGuessResponse, SubmitGuessRequest>(
  '/api/submit-guess/:postId',
  async (req, res): Promise<void> => {
    try {
      const { postId } = req.params;
      const { guess, timeSpent } = req.body;

      if (!postId || !guess) {
        res.status(400).json({
          status: 'error',
          message: 'postId and guess are required',
        });
        return;
      }

      const userId = await reddit.getCurrentUsername();
      if (!userId) {
        res.status(401).json({
          status: 'error',
          message: 'User not authenticated',
        });
        return;
      }

      // Check puzzle ownership - prevent creators from solving their own puzzles
      const puzzleOwnerKey = `puzzle_owner:${postId}`;
      const ownerId = await redis.get(puzzleOwnerKey);
      const isOwner = userId === ownerId;

      if (isOwner) {
        res.json({
          status: 'error',
          message: 'You cannot solve your own puzzle! Create new puzzles or find others to solve.',
          isCorrect: false,
        });
        return;
      }

      // Check if user already solved this puzzle
      const solvedKey = `solved:${postId}:${userId}`;
      const alreadySolved = await redis.get(solvedKey);

      if (alreadySolved) {
        res.json({
          status: 'error',
          message: 'You have already solved this Horcrux! Seek other dark magic to destroy.',
          isCorrect: false,
        });
        return;
      }

      // Check cooldown for failed attempts
      const failedKey = `failed:${postId}:${userId}`;
      const lastFailedStr = await redis.get(failedKey);

      if (lastFailedStr) {
        const lastFailed = parseInt(lastFailedStr);
        const cooldownTime = 5 * 60 * 1000; // 5 minutes in milliseconds
        const timeRemaining = cooldownTime - (Date.now() - lastFailed);

        if (timeRemaining > 0) {
          const minutesLeft = Math.ceil(timeRemaining / (60 * 1000));
          res.json({
            status: 'error',
            message: `The dark magic protects this Horcrux! You must wait ${minutesLeft} more minutes before attempting again.`,
            isCorrect: false,
            cooldownRemaining: timeRemaining,
          });
          return;
        }
      }

      // Get puzzle data
      const puzzleKey = `puzzle:${postId}`;
      const puzzleData = await redis.get(puzzleKey);

      if (!puzzleData) {
        res.status(404).json({
          status: 'error',
          message: 'Puzzle not found',
        });
        return;
      }

      const gameData = JSON.parse(puzzleData);
      const isCorrect = guess.toLowerCase().trim() === gameData.word.toLowerCase();

      // Track attempt
      const attemptKey = `attempt:${postId}:${userId}`;
      const attemptData = {
        userId,
        postId,
        guess,
        isCorrect,
        timeSpent,
        attemptedAt: Date.now(),
      };
      await redis.set(attemptKey, JSON.stringify(attemptData));

      // Add to puzzle attempts list (using hash instead of set)
      const puzzleAttemptsKey = `puzzle_attempts:${postId}`;
      await redis.hSet(puzzleAttemptsKey, { [userId]: Date.now().toString() });

      if (isCorrect) {
        // Mark as solved with timestamp
        const solveTimestamp = Date.now().toString();
        await redis.set(solvedKey, solveTimestamp);

        // Add to user's solve history (using hash instead of set for Devvit compatibility)
        const solveHistoryKey = `solve_history:${userId}`;
        await redis.hSet(solveHistoryKey, { [postId]: Date.now().toString() });

        // Store game result
        const gameStateKey = `gamestate:${postId}:${userId}`;
        await redis.set(
          gameStateKey,
          JSON.stringify({
            completed: true,
            timeSpent,
            word: gameData.word,
            completedAt: Date.now(),
          })
        );

        // Clear any failed attempt cooldown
        await redis.del(failedKey);

        // Check if this is the first person to solve this puzzle
        const firstSolverKey = `first_solver:${postId}`;
        const existingFirstSolver = await redis.get(firstSolverKey);

        if (!existingFirstSolver) {
          // This is the first solver! Mark them and post a comment
          await redis.set(firstSolverKey, userId);

          try {
            // Post a comment announcing the first solver
            await reddit.submitComment({
              id: postId,
              text: `🎉 Congratulations u/${userId}! You are the first wizard to destroy this Horcrux! ⚡✨`,
            });
          } catch (commentError) {
            console.error('Error posting first solver comment:', commentError);
            // Don't fail the request if comment posting fails
          }
        }
      } else {
        // Set failed attempt cooldown
        await redis.set(failedKey, Date.now().toString());
        // Set expiration for 5 minutes
        await redis.expire(failedKey, 300); // 300 seconds = 5 minutes
      }

      res.json({
        status: 'success',
        isCorrect,
        correctWord: isCorrect ? gameData.word : undefined,
      });
    } catch (error) {
      console.error(`Error submitting guess:`, error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to submit guess',
      });
    }
  }
);

// Get solution
router.get<{ postId: string }, GetSolutionResponse>(
  '/api/get-solution/:postId',
  async (req, res): Promise<void> => {
    try {
      const { postId } = req.params;

      if (!postId) {
        res.status(400).json({
          status: 'error',
          message: 'postId is required',
        });
        return;
      }

      const puzzleKey = `puzzle:${postId}`;
      const puzzleData = await redis.get(puzzleKey);

      if (!puzzleData) {
        res.status(404).json({
          status: 'error',
          message: 'Puzzle not found',
        });
        return;
      }

      const gameData = JSON.parse(puzzleData);

      res.json({
        status: 'success',
        solution: {
          word: gameData.word,
          minimalCombinations: gameData.minimal_combinations,
        },
      });
    } catch (error) {
      console.error(`Error getting solution:`, error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to get solution',
      });
    }
  }
);

// Update player score
router.post<{}, UpdateScoreResponse, UpdateScoreRequest>(
  '/api/update-score',
  async (req, res): Promise<void> => {
    try {
      const userId = await reddit.getCurrentUsername();

      if (!userId) {
        res.status(401).json({
          status: 'error',
          message: 'User not authenticated',
        });
        return;
      }

      // Validate username (should be proper Reddit username, not just numbers)
      if (userId.length < 3 || /^\d+$/.test(userId)) {
        res.status(400).json({
          status: 'error',
          message: 'Invalid username format',
        });
        return;
      }

      const { action } = req.body;

      // Simple scoring: 1 point for solving a puzzle
      let pointsToAdd = 0;
      if (action === 'puzzle_solved') {
        pointsToAdd = 1;
      }

      if (pointsToAdd > 0) {
        // Get current score
        const currentScoreStr = await redis.get(`player_score:${userId}`);
        const currentScore = parseInt(currentScoreStr || '0');
        const newScore = currentScore + pointsToAdd;

        // Update score
        await redis.set(`player_score:${userId}`, newScore.toString());

        // Update leaderboard using simple hash
        await redis.hSet('leaderboard', { [userId]: newScore.toString() });

        // Track last action for alternating gameplay
        if (action === 'puzzle_solved') {
          const lastActionKey = `last_action:${userId}`;
          await redis.set(lastActionKey, 'find');
        }
      }

      res.json({
        status: 'success',
        message: 'Score updated successfully',
      });
    } catch (error) {
      console.error(`Error updating score:`, error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to update score',
      });
    }
  }
);

// Get player statistics
router.get<{ userId: string }, GetPlayerStatsResponse>(
  '/api/player-stats/:userId',
  async (req, res): Promise<void> => {
    try {
      const { userId } = req.params;

      if (!userId) {
        res.status(400).json({
          status: 'error',
          message: 'userId is required',
        });
        return;
      }

      const playerStatsKey = `playerstats:${userId}`;
      const statsData = await redis.get(playerStatsKey);

      if (!statsData) {
        res.status(404).json({
          status: 'error',
          message: 'Player stats not found',
        });
        return;
      }

      const stats = JSON.parse(statsData);
      // Get rank from leaderboard data
      const leaderboardData = await redis.hGetAll('leaderboard');
      const players = Object.entries(leaderboardData || {})
        .map(([username, score]) => ({ username, totalScore: parseInt(score) || 0 }))
        .sort((a, b) => b.totalScore - a.totalScore);
      const rank = players.findIndex((p) => p.username === userId);

      res.json({
        status: 'success',
        stats: {
          ...stats,
          username: userId,
          rank: rank !== null ? rank + 1 : 0,
        },
      });
    } catch (error) {
      console.error(`Error getting player stats:`, error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to get player stats',
      });
    }
  }
);

// Set last action for testing (debug endpoint)
router.post('/api/set-last-action', async (req, res): Promise<void> => {
  try {
    const userId = await reddit.getCurrentUsername();
    if (!userId) {
      res.status(401).json({
        status: 'error',
        message: 'User not authenticated',
      });
      return;
    }

    const { action } = req.body;
    if (!action || !['hide', 'find'].includes(action)) {
      res.status(400).json({
        status: 'error',
        message: 'Invalid action. Must be "hide" or "find"',
      });
      return;
    }

    const lastActionKey = `last_action:${userId}`;
    await redis.set(lastActionKey, action);

    res.json({
      status: 'success',
      message: `Last action set to "${action}" for user ${userId}`,
    });
  } catch (error) {
    console.error('Error setting last action:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to set last action',
    });
  }
});

// Clean up leaderboard (remove invalid usernames)
router.post('/api/cleanup-leaderboard', async (_req, res): Promise<void> => {
  try {
    const leaderboardData = await redis.hGetAll('leaderboard');

    // Filter out invalid usernames (should be proper Reddit usernames, not just numbers)
    const validEntries: Record<string, string> = {};

    for (const [username, score] of Object.entries(leaderboardData || {})) {
      // Valid Reddit usernames should be at least 3 characters and not just numbers
      if (username.length >= 3 && !/^\d+$/.test(username)) {
        validEntries[username] = score;
      }
    }

    // Clear the old leaderboard and set only valid entries
    await redis.del('leaderboard');
    if (Object.keys(validEntries).length > 0) {
      await redis.hSet('leaderboard', validEntries);
    }

    res.json({
      status: 'success',
      message: `Cleaned up leaderboard. Kept ${Object.keys(validEntries).length} valid entries.`,
      validEntries: Object.keys(validEntries).length,
    });
  } catch (error) {
    console.error('Error cleaning up leaderboard:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to clean up leaderboard',
    });
  }
});

// Get puzzle attempts for a specific puzzle
router.get<{ postId: string }>('/api/puzzle-attempts/:postId', async (req, res): Promise<void> => {
  try {
    const { postId } = req.params;

    if (!postId) {
      res.status(400).json({
        status: 'error',
        message: 'postId is required',
      });
      return;
    }

    // Get all users who attempted this puzzle (using hash instead of set)
    const puzzleAttemptsKey = `puzzle_attempts:${postId}`;
    const attemptData = await redis.hGetAll(puzzleAttemptsKey);
    const userIds = Object.keys(attemptData || {});

    // Get attempt details for each user
    const attempts = await Promise.all(
      userIds.map(async (userId) => {
        const attemptKey = `attempt:${postId}:${userId}`;
        const solvedKey = `solved:${postId}:${userId}`;

        const attemptDataStr = await redis.get(attemptKey);
        const solvedTime = await redis.get(solvedKey);

        if (attemptDataStr) {
          const attemptData = JSON.parse(attemptDataStr);
          return {
            userId,
            username: userId,
            isCorrect: attemptData.isCorrect,
            timeSpent: attemptData.timeSpent,
            attemptedAt: attemptData.attemptedAt,
            solved: !!solvedTime,
          };
        }
        return null;
      })
    );

    // Filter out null attempts and sort by attempt time
    const validAttempts = attempts
      .filter((attempt) => attempt !== null)
      .sort((a, b) => a!.attemptedAt - b!.attemptedAt);

    res.json({
      status: 'success',
      postId,
      attempts: validAttempts,
      totalAttempts: validAttempts.length,
      successfulAttempts: validAttempts.filter((a) => a!.solved).length,
    });
  } catch (error) {
    console.error(`Error getting puzzle attempts:`, error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to get puzzle attempts',
    });
  }
});

// Get leaderboard
router.get<{}, GetLeaderboardResponse>('/api/leaderboard', async (_req, res): Promise<void> => {
  try {
    // Get all players and scores from simple hash
    const leaderboardData = await redis.hGetAll('leaderboard');

    // Convert to array, filter out users with 0 points, and sort by score
    const players = Object.entries(leaderboardData || {})
      .map(([username, score]) => ({
        username,
        totalScore: parseInt(score) || 0,
      }))
      .filter((player) => player.totalScore > 0) // Only show users who have destroyed at least 1 Horcrux
      .sort((a, b) => b.totalScore - a.totalScore)
      .slice(0, 20); // Top 20 players

    // Create leaderboard with ranks and get puzzlesCreated for each player
    const leaderboard = await Promise.all(
      players.map(async (player, index) => {
        const puzzlesCreatedKey = `puzzles_created:${player.username}`;
        const puzzlesCreatedStr = await redis.get(puzzlesCreatedKey);
        const puzzlesCreated = parseInt(puzzlesCreatedStr || '0');

        return {
          rank: index + 1,
          userId: player.username,
          username: player.username,
          puzzlesCreated: puzzlesCreated,
          puzzlesSolved: player.totalScore, // Points = puzzles solved
          puzzlesFailed: 0,
          averageTime: 0,
          totalScore: player.totalScore,
        };
      })
    );

    // Get current user's rank
    const currentUserId = await reddit.getCurrentUsername();
    let currentUserRank;
    let currentUserStats;

    if (currentUserId) {
      const userScore = parseInt(leaderboardData[currentUserId] || '0');

      // Only show rank if user has destroyed at least 1 Horcrux
      if (userScore > 0) {
        const userIndex = players.findIndex((p) => p.username === currentUserId);
        currentUserRank = userIndex >= 0 ? userIndex + 1 : undefined;
      }

      // Get puzzles created count and last action for current user
      const puzzlesCreatedKey = `puzzles_created:${currentUserId}`;
      const lastActionKey = `last_action:${currentUserId}`;
      const puzzlesCreatedStr = await redis.get(puzzlesCreatedKey);
      const lastActionStr = await redis.get(lastActionKey);
      const puzzlesCreated = parseInt(puzzlesCreatedStr || '0');

      // Always show current user stats (even if 0 points) for their own reference
      currentUserStats = {
        userId: currentUserId,
        username: currentUserId,
        puzzlesCreated: puzzlesCreated,
        puzzlesSolved: userScore,
        puzzlesFailed: 0,
        averageTime: 0,
        totalScore: userScore,
        rank: currentUserRank || 0,
        lastActive: Date.now(),
        lastAction: (lastActionStr as 'hide' | 'find' | null) || null,
      };
    }

    const response: GetLeaderboardResponse = {
      status: 'success',
      leaderboard,
      currentUserRank,
      currentUserStats,
    };
    res.json(response);
  } catch (error) {
    console.error(`Error getting leaderboard:`, error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to get leaderboard',
    });
  }
});

// Puzzle ownership and solve status validation endpoints

// Check puzzle ownership
router.get<{ postId: string }>('/api/puzzle-ownership/:postId', async (req, res): Promise<void> => {
  try {
    const { postId } = req.params;

    if (!postId) {
      res.status(400).json({
        status: 'error',
        message: 'postId is required',
      });
      return;
    }

    const puzzleOwnerKey = `puzzle_owner:${postId}`;
    const ownerId = await redis.get(puzzleOwnerKey);

    const currentUserId = await reddit.getCurrentUsername();

    // If no ownership data exists, assume it's an older puzzle (not owned by current user)
    if (!ownerId) {
      res.json({
        status: 'success',
        postId,
        ownerId: null,
        isOwner: false,
        currentUserId,
      });
      return;
    }

    const isOwner = currentUserId === ownerId;

    res.json({
      status: 'success',
      postId,
      ownerId,
      isOwner,
      currentUserId,
    });
  } catch (error) {
    console.error(`Error checking puzzle ownership:`, error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to check puzzle ownership',
    });
  }
});

// Check if user has already solved a specific puzzle
router.get<{ postId: string }>(
  '/api/check-already-solved/:postId',
  async (req, res): Promise<void> => {
    try {
      const { postId } = req.params;

      if (!postId) {
        res.status(400).json({
          status: 'error',
          message: 'postId is required',
          alreadySolved: false,
        });
        return;
      }

      const userId = await reddit.getCurrentUsername();

      if (!userId) {
        res.status(401).json({
          status: 'error',
          message: 'User not authenticated',
          alreadySolved: false,
        });
        return;
      }

      // Check the solved key in Redis
      const solvedKey = `solved:${postId}:${userId}`;
      const solvedTimestamp = await redis.get(solvedKey);
      const alreadySolved = !!solvedTimestamp;

      res.json({
        status: 'success',
        postId,
        userId,
        alreadySolved,
        solvedAt: solvedTimestamp ? parseInt(solvedTimestamp) : null,
      });
    } catch (error) {
      console.error(`[CHECK-SOLVED ERROR]`, error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to check solve status',
        alreadySolved: false,
      });
    }
  }
);

// Existing counter API endpoints
router.get<{ postId: string }, InitResponse | { status: string; message: string }>(
  '/api/init',
  async (_req, res): Promise<void> => {
    const { postId, postData } = context;

    if (!postId) {
      console.error('API Init Error: postId not found in devvit context');
      res.status(400).json({
        status: 'error',
        message: 'postId is required but missing from context',
      });
      return;
    }

    try {
      const [count, username] = await Promise.all([
        redis.get('count'),
        reddit.getCurrentUsername(),
      ]);

      res.json({
        type: 'init',
        postId: postId,
        count: count ? parseInt(count) : 0,
        username: username ?? 'anonymous',
        postData: postData || null,
      });
    } catch (error) {
      console.error(`API Init Error for post ${postId}:`, error);
      let errorMessage = 'Unknown error during initialization';
      if (error instanceof Error) {
        errorMessage = `Initialization failed: ${error.message}`;
      }
      res.status(400).json({ status: 'error', message: errorMessage });
    }
  }
);

router.post<{ postId: string }, IncrementResponse | { status: string; message: string }, unknown>(
  '/api/increment',
  async (_req, res): Promise<void> => {
    const { postId } = context;
    if (!postId) {
      res.status(400).json({
        status: 'error',
        message: 'postId is required',
      });
      return;
    }

    res.json({
      count: await redis.incrBy('count', 1),
      postId,
      type: 'increment',
    });
  }
);

router.post<{ postId: string }, DecrementResponse | { status: string; message: string }, unknown>(
  '/api/decrement',
  async (_req, res): Promise<void> => {
    const { postId } = context;
    if (!postId) {
      res.status(400).json({
        status: 'error',
        message: 'postId is required',
      });
      return;
    }

    res.json({
      count: await redis.incrBy('count', -1),
      postId,
      type: 'decrement',
    });
  }
);

router.post('/internal/on-app-install', async (_req, res): Promise<void> => {
  try {
    const post = await createPost();

    res.json({
      status: 'success',
      message: `Post created in subreddit ${context.subredditName} with id ${post.id}`,
    });
  } catch (error) {
    console.error(`Error creating post: ${error}`);
    res.status(400).json({
      status: 'error',
      message: 'Failed to create post',
    });
  }
});

router.post('/internal/menu/post-create', async (_req, res): Promise<void> => {
  try {
    const post = await createPost();

    res.json({
      navigateTo: `https://reddit.com/r/${context.subredditName}/comments/${post.id}`,
    });
  } catch (error) {
    console.error(`Error creating post: ${error}`);
    res.status(400).json({
      status: 'error',
      message: 'Failed to create post',
    });
  }
});

// Use router middleware
app.use(router);

// Get port from environment variable with fallback
const port = getServerPort();

const server = createServer(app);
server.on('error', (err) => console.error(`server error; ${err.stack}`));
server.listen(port);
