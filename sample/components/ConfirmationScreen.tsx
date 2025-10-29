import React from 'react';

interface ConfirmationScreenProps {
  word: string;
  onConfirm: () => void;
}

const ConfirmationScreen: React.FC<ConfirmationScreenProps> = ({ word, onConfirm }) => {
  return (
    <div className="w-full max-w-md mx-auto p-8 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-2xl text-center">
      <h2 className="text-3xl font-bold text-center mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
        Puzzle Generated!
      </h2>
      <p className="text-gray-300 text-lg mb-2">The secret word is:</p>
      <p className="text-4xl font-black tracking-widest text-white bg-black/20 py-3 px-2 rounded-lg mb-8">
        {word.toUpperCase()}
      </p>
      <button
        onClick={onConfirm}
        className="w-full max-w-xs px-4 py-3 font-bold bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg hover:opacity-90 transition-opacity shadow-lg"
      >
        Start Game for Player 2
      </button>
    </div>
  );
};

export default ConfirmationScreen;