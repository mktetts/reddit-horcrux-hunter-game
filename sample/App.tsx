import React, { useState } from 'react';
import { GameState, GameData, Emoji } from './types';
import { generateGame } from './services/gameLogic';
import HiderScreen from './components/HiderScreen';
import GameScreen from './components/GameScreen';
import ResultOverlay from './components/ResultOverlay';
import Loader from './components/Loader';
import ConfirmationScreen from './components/ConfirmationScreen';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>('hiding');
  const [gameData, setGameData] = useState<GameData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handlePuzzleGenerate = (selectedEmojis: Emoji[], wordLength: number) => {
    setError(null);
    setGameState('generating');
    
    // Use a short timeout to allow the loader to render before the (potentially) blocking logic runs.
    setTimeout(() => {
        const result = generateGame(selectedEmojis, wordLength);
        if (result) {
            setGameData(result);
            setGameState('confirming');
        } else {
            setError(`Could not generate a ${wordLength}-letter word with the selected emojis. Please try a different combination or word length.`);
            setGameState('hiding');
        }
    }, 100);
  };
  
  const handleGameStart = () => {
    if (gameData) {
      setGameState('guessing');
    }
  };

  const handleGameEnd = (result: 'won' | 'lost') => {
    setGameState(result);
  };
  
  const handlePlayAgain = () => {
    setGameData(null);
    setError(null);
    setGameState('hiding');
  };

  const renderContent = () => {
    switch (gameState) {
      case 'hiding':
        return <HiderScreen onStart={handlePuzzleGenerate} error={error} />;
      case 'generating':
        return <Loader message="Generating your puzzle..." />;
      case 'confirming':
        if (!gameData) return <HiderScreen onStart={handlePuzzleGenerate} error="An unexpected error occurred." />;
        return <ConfirmationScreen word={gameData.word} onConfirm={handleGameStart} />;
      case 'guessing':
        if (!gameData) return <HiderScreen onStart={handlePuzzleGenerate} error="An unexpected error occurred." />;
        return <GameScreen gameData={gameData} onGameEnd={handleGameEnd} />;
      case 'won':
      case 'lost':
        if (!gameData) return <HiderScreen onStart={handlePuzzleGenerate} error="An unexpected error occurred." />;
        return (
          <>
            <GameScreen gameData={gameData} onGameEnd={handleGameEnd} isGameOver={true} />
            <ResultOverlay 
              status={gameState} 
              secretWord={gameData.word} 
              onPlayAgain={handlePlayAgain} 
            />
          </>
        );
      default:
        return <HiderScreen onStart={handlePuzzleGenerate} />;
    }
  };

  return (
    <main className="relative w-full h-screen overflow-hidden bg-gray-900 font-sans text-white flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/50 via-gray-900 to-purple-900/50"></div>
      <div className="absolute top-[-10%] left-[5%] w-72 h-72 lg:w-96 lg:h-96 bg-purple-600 rounded-full filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-[10%] right-[5%] w-72 h-72 lg:w-96 lg:h-96 bg-blue-600 rounded-full filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-[-10%] left-[20%] w-72 h-72 lg:w-96 lg:h-96 bg-pink-600 rounded-full filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      
      <div className="z-10 w-full h-full flex items-center justify-center">
        {renderContent()}
      </div>
    </main>
  );
};

export default App;
