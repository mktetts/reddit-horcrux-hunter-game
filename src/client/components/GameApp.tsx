import React, { useState, useEffect } from 'react';
import SplashScreen from './SplashScreen';
import HiderScreen from './HiderScreen';
import ConfirmationScreen from './ConfirmationScreen';
import GameScreen from './GameScreen';
import ResultOverlay from './ResultOverlay';
import LeaderboardScreen from './LeaderboardScreen';
import LoadingState from './LoadingState';
import PuzzleCreatedScreen from './PuzzleCreatedScreen';
import { Emoji, GameData, GameState } from '../../shared/types/game';

type ExtendedGameState = GameState | 'puzzle-created' | 'main-menu';
type PlayerProgress = {
  hasHiddenSoul: boolean;
  hasFoundHorcrux: boolean;
  totalHorcruxesFound: number;
  totalSoulsHidden: number;
  lastAction: 'hide' | 'find' | null; // Track the last action to enforce alternating
};

import { generateGame } from '../../shared/services/gameLogic';
import { GameMode } from '../../shared/services/gameModeService';
import { apiClient } from '../services/apiClient';

const GameApp: React.FC = () => {
  const [gameState, setGameState] = useState<ExtendedGameState>('main-menu');
  const [gameData, setGameData] = useState<GameData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [gameResult, setGameResult] = useState<'won' | 'lost' | null>(null);
  const [gameMode, setGameMode] = useState<GameMode>('create');
  const [isLoading, setIsLoading] = useState(true);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [hasStartedPlaying, setHasStartedPlaying] = useState(false);
  const [createdPostUrl, setCreatedPostUrl] = useState<string | undefined>();
  const [isOwner, setIsOwner] = useState<boolean>(false);
  const [alreadySolved, setAlreadySolved] = useState<boolean>(false);
  const [playerProgress, setPlayerProgress] = useState<PlayerProgress>({
    hasHiddenSoul: false,
    hasFoundHorcrux: false,
    totalHorcruxesFound: 0,
    totalSoulsHidden: 0,
    lastAction: null,
  });

  // Initialize game mode and player progress on component mount
  useEffect(() => {
    const initializeGameMode = async () => {
      try {
        // Get initial data including postData
        const response = await fetch('/api/init');
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const initData = await response.json();

        // Load player progress from leaderboard
        try {
          const leaderboardData = await apiClient.getLeaderboard();
          if (leaderboardData.status === 'success' && leaderboardData.currentUserStats) {
            const stats = leaderboardData.currentUserStats;

            setPlayerProgress({
              hasHiddenSoul: stats.puzzlesCreated > 0,
              hasFoundHorcrux: stats.totalScore > 0,
              totalHorcruxesFound: stats.totalScore,
              totalSoulsHidden: stats.puzzlesCreated,
              lastAction: stats.lastAction || null,
            });
          }
        } catch (error) {
          console.error('Error loading player progress:', error);
        }

        // Check if this post has puzzle data (meaning it's a puzzle post to solve)
        if (initData.postData && initData.postData.word) {
          // This is a puzzle post - set up solve mode
          setGameData(initData.postData);
          setGameMode('solve');

          // Check if user already solved this puzzle using dedicated endpoint
          try {
            const solvedResponse = await apiClient.checkAlreadySolved(initData.postId);
            setAlreadySolved(solvedResponse.alreadySolved || false);
          } catch (error) {
            console.error('[INIT] Error checking if already solved:', error);
            setAlreadySolved(false);
          }

          // Check puzzle ownership
          try {
            const ownershipResponse = await apiClient.checkPuzzleOwnership(initData.postId);
            setIsOwner(ownershipResponse.isOwner || false);
          } catch (error) {
            console.error('[INIT] Error checking ownership:', error);
            setIsOwner(false);
          }

          setGameState('main-menu'); // Show menu first
        } else {
          // This is a new post or creation mode
          setGameMode('create');
          setGameState('main-menu');
        }
      } catch (error) {
        console.error('Error initializing game mode:', error);
        setGameMode('create');
        setGameState('main-menu');
      } finally {
        setIsLoading(false);
      }
    };

    initializeGameMode();
  }, []);

  const refreshPlayerProgress = async () => {
    setIsLoading(true);
    try {
      const leaderboardData = await apiClient.getLeaderboard();
      if (leaderboardData.status === 'success' && leaderboardData.currentUserStats) {
        const stats = leaderboardData.currentUserStats;

        const newProgress = {
          hasHiddenSoul: stats.puzzlesCreated > 0,
          hasFoundHorcrux: stats.totalScore > 0,
          totalHorcruxesFound: stats.totalScore,
          totalSoulsHidden: stats.puzzlesCreated,
          lastAction: stats.lastAction || null,
        };
        setPlayerProgress(newProgress);
      }
    } catch (error) {
      console.error('Error refreshing player progress:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMenuAction = (action: 'hide-soul' | 'find-horcrux' | 'leaderboard' | 'refresh') => {
    setError(null);
    setHasStartedPlaying(true);

    switch (action) {
      case 'hide-soul':
        // New players: Can hide their first soul
        const isNewPlayer = playerProgress.totalHorcruxesFound === 0 && playerProgress.totalSoulsHidden === 0;
        
        if (!isNewPlayer) {
          // Experienced players: Must alternate - can only hide if last action was 'find'
          if (playerProgress.lastAction === 'hide') {
            setError(
              '⚡ You just hid your soul! Now you must find and destroy a Horcrux before hiding another piece of your soul.'
            );
            return;
          }
        }

        setGameMode('create');
        setGameState('hiding');
        break;

      case 'find-horcrux':
        // New players: Must hide a soul first
        if (playerProgress.totalHorcruxesFound === 0 && playerProgress.totalSoulsHidden === 0) {
          setError(
            '🌑 New to the Dark Arts? You must first hide your soul to learn the forbidden magic before you can seek Horcruxes!'
          );
          return;
        }

        // Must have hidden at least one soul
        if (playerProgress.totalSoulsHidden === 0 && playerProgress.totalHorcruxesFound > 0) {
          setError(
            '💀 You have found Horcruxes but never hidden your soul! You must hide your soul before seeking more Horcruxes.'
          );
          return;
        }

        // Alternating rule: Can only find if last action was 'hide'
        if (playerProgress.lastAction === 'find' && playerProgress.totalSoulsHidden > 0) {
          setError(
            '🌑 You just found a Horcrux! Now you must hide a piece of your soul before seeking another Horcrux.'
          );
          return;
        }

        if (gameMode === 'solve' && gameData && !isOwner && !alreadySolved) {
          setGameState('guessing');
        } else {
          setError('No Horcrux available to find in this location.');
        }
        break;

      case 'leaderboard':
        setShowLeaderboard(true);
        break;

      case 'refresh':
        refreshPlayerProgress();
        break;
    }
  };

  const handlePuzzleCreation = async (selectedEmojis: Emoji[], wordLength: number) => {
    setGameState('generating');
    setError(null);

    try {
      // Generate game locally first
      const generatedGame = generateGame(selectedEmojis, wordLength);

      if (!generatedGame) {
        setError(
          'No valid words can be formed with the selected emojis. Please try a different combination.'
        );
        setGameState('hiding');
        return;
      }

      setGameData(generatedGame);
      setGameState('confirming');
    } catch (error) {
      console.error('Error generating puzzle:', error);
      setError('Failed to generate puzzle. Please try again.');
      setGameState('hiding');
    }
  };

  const handleConfirmPuzzle = async () => {
    if (!gameData) return;

    try {
      setGameState('generating');

      // Create a new Reddit post with the puzzle
      const result = await apiClient.createPuzzlePost({ gameData });

      if (result.status === 'success') {
        // No points awarded for puzzle creation in simplified system

        // Show success state
        setCreatedPostUrl(result.postUrl);
        setGameState('puzzle-created');

        // Update player progress for soul hiding
        setPlayerProgress((prev) => ({
          ...prev,
          hasHiddenSoul: true,
          totalSoulsHidden: prev.totalSoulsHidden + 1,
          lastAction: 'hide',
        }));

        // After a delay, automatically return to main screen
        setTimeout(() => {
          handleReturnToMain();
        }, 5000);
      } else {
        setError(result.message || 'Failed to create puzzle post');
        setGameState('confirming');
      }
    } catch (error) {
      console.error('Error creating puzzle post:', error);
      setError('Failed to create puzzle post. Please try again.');
      setGameState('confirming');
    }
  };

  const handleReturnToMain = () => {
    setGameState('main-menu');
    setGameData(null);
    setGameResult(null);
    setError(null);
    setHasStartedPlaying(false);
    setCreatedPostUrl(undefined);
    setShowLeaderboard(false);
  };

  const handleGameEnd = async (result: 'won' | 'lost', timeSpent?: number) => {
    setGameResult(result);
    setGameState(result);

    // Update player statistics
    try {
      if (result === 'won') {
        await apiClient.updateScore({
          action: 'puzzle_solved',
          timeSpent: timeSpent || 0,
        });

        // Update player progress
        setPlayerProgress((prev) => ({
          ...prev,
          hasFoundHorcrux: true,
          totalHorcruxesFound: prev.totalHorcruxesFound + 1,
          lastAction: 'find',
        }));
      } else {
        await apiClient.updateScore({
          action: 'puzzle_failed',
        });
      }
    } catch (error) {
      console.error('Error updating score:', error);
    }
  };

  const handlePlayAgain = () => {
    setGameData(null);
    setGameResult(null);
    setError(null);
    setShowLeaderboard(false);
    setHasStartedPlaying(false);
    setGameState('main-menu'); // Return to main menu
  };

  const handleViewLeaderboard = () => {
    setShowLeaderboard(true);
  };

  const handleCloseLeaderboard = () => {
    setShowLeaderboard(false);
  };

  const renderGameContent = () => {
    switch (gameState) {
      case 'hiding':
        return <HiderScreen onStart={handlePuzzleCreation} error={error} />;

      case 'generating':
        return (
          <div className="container">
            <div className="card" style={{ maxWidth: '400px', margin: '20px auto' }}>
              <LoadingState operation="creating" />
            </div>
          </div>
        );

      case 'confirming':
        return gameData ? (
          <ConfirmationScreen 
            word={gameData.word} 
            onConfirm={handleConfirmPuzzle}
            onBack={() => setGameState('hiding')}
          />
        ) : null;

      case 'puzzle-created':
        return gameData ? (
          <PuzzleCreatedScreen
            word={gameData.word}
            postUrl={createdPostUrl}
            onReturnToMain={handleReturnToMain}
          />
        ) : null;

      case 'guessing':
        return gameData ? (
          <div className="relative w-full h-full">
            <GameScreen
              gameData={gameData}
              onGameEnd={handleGameEnd}
              isGameOver={gameResult !== null}
            />
            {gameResult && (
              <ResultOverlay
                status={gameResult}
                secretWord={gameData.word}
                onPlayAgain={handlePlayAgain}
                onViewLeaderboard={handleViewLeaderboard}
              />
            )}
          </div>
        ) : null;

      case 'won':
      case 'lost':
        return gameData ? (
          <div className="relative w-full h-full">
            <GameScreen gameData={gameData} onGameEnd={handleGameEnd} isGameOver={true} />
            <ResultOverlay
              status={gameResult!}
              secretWord={gameData.word}
              onPlayAgain={handlePlayAgain}
              onViewLeaderboard={handleViewLeaderboard}
            />
          </div>
        ) : null;

      default:
        return (
          <SplashScreen
            onMenuAction={handleMenuAction}
            playerProgress={playerProgress}
            gameMode={gameMode}
            error={error}
            isOwner={isOwner}
            alreadySolved={alreadySolved}
          />
        );
    }
  };

  // Show loading screen while initializing
  if (isLoading) {
    return (
      <div
        style={{
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px',
          background: 'var(--bg-primary)',
        }}
      >
        <div className="card" style={{ maxWidth: '400px' }}>
          <LoadingState operation="fetching" />
        </div>
      </div>
    );
  }

  // Show leaderboard if requested (check this first!)
  if (showLeaderboard) {
    return (
      <div style={{ height: '100vh', overflow: 'hidden', background: 'var(--bg-primary)' }}>
        <LeaderboardScreen onClose={handleCloseLeaderboard} />
      </div>
    );
  }

  // Show main menu
  if (gameState === 'main-menu') {
    return (
      <div
        style={{
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--bg-primary)',
        }}
      >
        <SplashScreen
          onMenuAction={handleMenuAction}
          playerProgress={playerProgress}
          gameMode={gameMode}
          error={error}
          isOwner={isOwner}
          alreadySolved={alreadySolved}
        />
      </div>
    );
  }

  return (
    <div
      className="game-container"
      style={{
        height: '100vh',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--bg-primary)',
      }}
    >
      <div className="game-content" style={{ flex: 1, overflow: 'hidden' }}>
        {renderGameContent()}
      </div>
    </div>
  );
};

export default GameApp;
