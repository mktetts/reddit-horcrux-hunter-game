import React, { useState } from 'react';

interface SetupScreenProps {
  onStart: (word: string) => void;
}

const SetupScreen: React.FC<SetupScreenProps> = ({ onStart }) => {
  const [word, setWord] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (word.trim()) {
      onStart(word);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-8 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-2xl">
      <h1 className="text-4xl font-bold text-center mb-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
        Emoji Venn
      </h1>
      <p className="text-center text-gray-300 mb-6">Player 1: Hide a word.</p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          value={word}
          onChange={(e) => setWord(e.target.value)}
          placeholder="Enter secret word..."
          className="w-full px-4 py-3 bg-white/10 rounded-lg border border-white/20 focus:ring-2 focus:ring-purple-500 focus:outline-none transition-shadow"
          autoFocus
        />
        <button
          type="submit"
          disabled={!word.trim()}
          className="w-full px-4 py-3 font-bold bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity shadow-lg"
        >
          Start Game
        </button>
      </form>
    </div>
  );
};

export default SetupScreen;