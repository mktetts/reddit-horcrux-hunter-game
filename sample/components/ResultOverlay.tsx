import React from 'react';
import RestartIcon from './icons/RestartIcon';

interface ResultOverlayProps {
  status: 'won' | 'lost';
  secretWord: string;
  onPlayAgain: () => void;
}

const ResultOverlay: React.FC<ResultOverlayProps> = ({ status, secretWord, onPlayAgain }) => {
  const isWin = status === 'won';

  return (
    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-20">
      <div className="w-full max-w-md mx-auto p-8 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl text-center">
        <h2 className={`text-5xl font-black mb-4 text-transparent bg-clip-text ${isWin ? 'bg-gradient-to-r from-green-400 to-teal-400' : 'bg-gradient-to-r from-red-500 to-orange-500'}`}>
          {isWin ? 'You Won!' : 'Out of Guesses!'}
        </h2>
        <p className="text-gray-200 text-lg mb-6">
          The secret word was: <span className="font-bold text-xl text-white">{secretWord}</span>
        </p>
        <button
          onClick={onPlayAgain}
          className="inline-flex items-center gap-2 px-6 py-3 font-bold bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg hover:opacity-90 transition-opacity shadow-lg"
        >
          <RestartIcon />
          Play Again
        </button>
      </div>
    </div>
  );
};

export default ResultOverlay;