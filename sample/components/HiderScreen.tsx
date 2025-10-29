import React, { useState } from 'react';
import { Emoji } from '../types';
import { EMOJI_LIST } from '../constants';
import EmojiItem from './EmojiItem';

interface HiderScreenProps {
  onStart: (selectedEmojis: Emoji[], wordLength: number) => void;
  error?: string | null;
}

const MIN_SELECTION = 5;
const MAX_SELECTION = 15;

const HiderScreen: React.FC<HiderScreenProps> = ({ onStart, error }) => {
  const [selected, setSelected] = useState<Map<string, Emoji>>(new Map());
  const [wordLength, setWordLength] = useState(7);

  const handleSelect = (emoji: Emoji) => {
    setSelected(prev => {
      const newSelection = new Map(prev);
      if (newSelection.has(emoji.id)) {
        newSelection.delete(emoji.id);
      } else {
        if (newSelection.size < MAX_SELECTION) {
          newSelection.set(emoji.id, emoji);
        }
      }
      return newSelection;
    });
  };
  
  const handleSubmit = () => {
    if (selected.size >= MIN_SELECTION) {
      onStart(Array.from(selected.values()), wordLength);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-8 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-2xl flex flex-col">
      <h1 className="text-4xl font-bold text-center mb-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
        Emoji Venn
      </h1>
      <p className="text-center text-gray-300 mb-4">Player 1: Create a puzzle.</p>
      
      <p className="text-center font-semibold text-gray-300 mb-2">Step 1: Select {MIN_SELECTION} to {MAX_SELECTION} emojis.</p>
      <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-2 p-4 bg-black/20 rounded-lg border border-white/10 mb-4 h-48 overflow-y-auto">
        {EMOJI_LIST.map(emoji => (
          <div key={emoji.id} onClick={() => handleSelect(emoji)} className={`${selected.has(emoji.id) ? 'ring-2 ring-purple-400 rounded-xl' : ''}`}>
             <EmojiItem emoji={emoji} isSelectable={true} />
          </div>
        ))}
      </div>
      
      <p className="text-center font-semibold text-gray-300 mb-2">Step 2: Choose the word length.</p>
      <div className="flex justify-center gap-2 mb-4">
        {[5, 6, 7, 8, 9].map(len => (
          <button
            key={len}
            onClick={() => setWordLength(len)}
            className={`w-12 h-12 font-bold rounded-lg transition-all text-lg ${wordLength === len ? 'bg-purple-500 text-white ring-2 ring-purple-300 scale-110' : 'bg-white/10 hover:bg-white/20'}`}
          >
            {len}
          </button>
        ))}
      </div>
      
      {error && (
        <p className="text-center text-red-400 mb-4 animate-shake">{error}</p>
      )}

      <div className="flex flex-col items-center mt-2">
        <p className="text-gray-300 mb-4">
          {selected.size} / {MAX_SELECTION} emojis selected
        </p>
        <button
          onClick={handleSubmit}
          disabled={selected.size < MIN_SELECTION}
          className="w-full max-w-xs px-4 py-3 font-bold bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity shadow-lg"
        >
          Generate Puzzle
        </button>
      </div>
    </div>
  );
};

export default HiderScreen;
