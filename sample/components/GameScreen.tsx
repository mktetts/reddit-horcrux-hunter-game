import React, { useState, useEffect, useRef } from 'react';
import { Emoji, PlacedEmoji, GameData } from '../types';
import EmojiItem from './EmojiItem';
import VennEmoji from './VennEmoji';
import HintIcon from './icons/HintIcon';

interface GameScreenProps {
  gameData: GameData;
  onGameEnd: (result: 'won' | 'lost') => void;
  isGameOver?: boolean;
}

const MAX_GUESSES = 5;
const EMOJI_DIAMETER = 64; // Corresponds to w-16, h-16 in VennEmoji
const EMOJI_RADIUS = EMOJI_DIAMETER / 2;

// --- Overlap Detection Logic ---
const doEmojisOverlap = (e1: PlacedEmoji, e2: PlacedEmoji): boolean => {
    const center1 = { x: e1.x + EMOJI_RADIUS, y: e1.y + EMOJI_RADIUS };
    const center2 = { x: e2.x + EMOJI_RADIUS, y: e2.y + EMOJI_RADIUS };
    const dx = center1.x - center2.x;
    const dy = center1.y - center2.y;
    const distanceSquared = dx * dx + dy * dy;
    // Overlap if distance is less than the diameter (sum of two radii)
    return distanceSquared < (EMOJI_DIAMETER * EMOJI_DIAMETER);
};

const getOverlappingEmojis = (emojis: PlacedEmoji[]): Set<PlacedEmoji> => {
    const overlappingSet = new Set<PlacedEmoji>();
    for (let i = 0; i < emojis.length; i++) {
        for (let j = i + 1; j < emojis.length; j++) {
            if (doEmojisOverlap(emojis[i], emojis[j])) {
                overlappingSet.add(emojis[i]);
                overlappingSet.add(emojis[j]);
            }
        }
    }
    return overlappingSet;
};


const GameScreen: React.FC<GameScreenProps> = ({ gameData, onGameEnd, isGameOver = false }) => {
  const { emojiPalette, word: secretWord, minimal_emoji_count, minimal_combinations } = gameData;

  const [availableEmojis, setAvailableEmojis] = useState<Emoji[]>(emojiPalette);
  const [placedEmojis, setPlacedEmojis] = useState<PlacedEmoji[]>([]);
  
  const [revealedLetters, setRevealedLetters] = useState<string[]>([]);
  const [playerGuess, setPlayerGuess] = useState('');
  const [guessesLeft, setGuessesLeft] = useState(MAX_GUESSES);
  const [shake, setShake] = useState(false);
  const [isCombinationCorrect, setIsCombinationCorrect] = useState(false);
  const [hintUsed, setHintUsed] = useState(false);

  const canvasRef = useRef<HTMLDivElement>(null);
  const draggingEmojiRef = useRef<{ id: string; offsetX: number; offsetY: number } | null>(null);

  useEffect(() => {
    if (isGameOver) return;

    // --- Letter Reveal Logic (based on OVERLAPPING emojis) ---
    const overlappingEmojis = Array.from(getOverlappingEmojis(placedEmojis));
    const combinedLetters = new Set(overlappingEmojis.flatMap(e => e.name.split('')));
    
    const newlyRevealedChars = new Set<string>();
    secretWord.split('').forEach(char => {
        if (combinedLetters.has(char)) {
            newlyRevealedChars.add(char);
        }
    });

    const newRevealedArray = Array.from(newlyRevealedChars).sort();
    if (newRevealedArray.length !== revealedLetters.length || !newRevealedArray.every((l, i) => l === revealedLetters[i])) {
        setRevealedLetters(newRevealedArray);
    }
    
    // --- Minimal Combination Check (based on ALL placed emojis) ---
    if (placedEmojis.length > 0) {
      const placedSignature = placedEmojis.map(e => e.id).sort().join(',');
      const minimalSignatures = minimal_combinations.map(c => c.emojis.map(e => e.id).sort().join(','));
      const isCorrect = minimalSignatures.includes(placedSignature);
      setIsCombinationCorrect(isCorrect);
    } else {
      setIsCombinationCorrect(false);
    }

  }, [placedEmojis, secretWord, minimal_combinations, isGameOver, revealedLetters]);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (isGameOver || !canvasRef.current) return;
    const emojiId = e.dataTransfer.getData('emojiId');
    const droppedEmoji = availableEmojis.find(em => em.id === emojiId);
    
    if (droppedEmoji && !placedEmojis.some(em => em.id === droppedEmoji.id)) {
      const canvasRect = canvasRef.current.getBoundingClientRect();
      const x = e.clientX - canvasRect.left - EMOJI_RADIUS;
      const y = e.clientY - canvasRect.top - EMOJI_RADIUS;

      setPlacedEmojis(prev => [...prev, { ...droppedEmoji, x, y }]);
      setAvailableEmojis(prev => prev.filter(em => em.id !== droppedEmoji.id));
    }
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => e.preventDefault();
  
  const handleEmojiReturn = (emojiToReturn: PlacedEmoji) => {
    if (isGameOver) return;
    setPlacedEmojis(prev => prev.filter(em => em.id !== emojiToReturn.id));
    setAvailableEmojis(prev => [...prev, {id: emojiToReturn.id, emoji: emojiToReturn.emoji, name: emojiToReturn.name}].sort((a,b) => parseInt(a.id) - parseInt(b.id)));
  };

  const handleClear = () => {
    if (isGameOver) return;
    setAvailableEmojis(emojiPalette);
    setPlacedEmojis([]);
  };
  
  const handleSubmitGuess = (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerGuess.trim() || isGameOver || guessesLeft <= 0) return;

    if (playerGuess.trim().toLowerCase() === secretWord) {
      onGameEnd('won');
    } else {
      const newGuessesLeft = guessesLeft - 1;
      setGuessesLeft(newGuessesLeft);
      setPlayerGuess('');
      setShake(true);
      setTimeout(() => setShake(false), 500);
      if (newGuessesLeft <= 0) onGameEnd('lost');
    }
  };

  const handleMouseDownOnEmoji = (e: React.MouseEvent<HTMLDivElement>, emoji: PlacedEmoji) => {
    e.preventDefault();
    e.stopPropagation();
    draggingEmojiRef.current = {
      id: emoji.id,
      offsetX: e.clientX - emoji.x,
      offsetY: e.clientY - emoji.y,
    };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!draggingEmojiRef.current || !canvasRef.current) return;
    const { id, offsetX, offsetY } = draggingEmojiRef.current;
    const canvasRect = canvasRef.current.getBoundingClientRect();
    let x = e.clientX - offsetX;
    let y = e.clientY - offsetY;
    x = Math.max(0, Math.min(x, canvasRect.width - EMOJI_DIAMETER));
    y = Math.max(0, Math.min(y, canvasRect.height - EMOJI_DIAMETER));
    setPlacedEmojis(prev => prev.map(em => em.id === id ? { ...em, x, y } : em));
  };

  const handleMouseUp = () => draggingEmojiRef.current = null;
  
  const handleHintClick = () => {
    if (isGameOver || hintUsed || guessesLeft <= 1 || !canvasRef.current) return;

    setGuessesLeft(prev => prev - 1);
    setHintUsed(true);

    const hintCombination = minimal_combinations[0];
    const hintEmojis = hintCombination.emojis;

    const canvasRect = canvasRef.current.getBoundingClientRect();
    const newPlacedFromHint: PlacedEmoji[] = hintEmojis.map(emoji => {
        const x = Math.random() * (canvasRect.width - EMOJI_DIAMETER);
        const y = Math.random() * (canvasRect.height - EMOJI_DIAMETER);
        return { ...emoji, x, y };
    });

    const hintEmojiIds = new Set(hintEmojis.map(e => e.id));
    setPlacedEmojis(newPlacedFromHint);
    setAvailableEmojis(emojiPalette.filter(e => !hintEmojiIds.has(e.id)));
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-between p-4 md:p-8 relative">
      <div className={`w-full max-w-3xl p-4 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-lg ${isGameOver ? 'opacity-50 pointer-events-none' : ''}`}>
        <div className="flex flex-wrap justify-center gap-2">
          {availableEmojis.map(emoji => (
            <EmojiItem key={emoji.id} emoji={emoji} />
          ))}
        </div>
      </div>

       <div className="w-full max-w-3xl text-center my-2">
        <p className="text-lg font-semibold text-gray-300 transition-colors duration-300">
          {isCombinationCorrect
            ? '✅ Combination Found! Now guess the word.'
            : `Find the minimal combination of ${minimal_emoji_count} emojis.`
          }
        </p>
      </div>

      <div 
        ref={canvasRef}
        className={`relative w-full max-w-4xl h-64 md:h-80 bg-black/20 rounded-2xl border overflow-hidden transition-all duration-500 ${isCombinationCorrect ? 'shadow-[0_0_25px_8px] shadow-purple-500/50 border-purple-400' : 'border-white/10'} ${isGameOver ? 'opacity-50 pointer-events-none' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {placedEmojis.map(emoji => (
          <VennEmoji
            key={emoji.id}
            emoji={emoji}
            onMouseDown={(e) => handleMouseDownOnEmoji(e, emoji)}
            onDoubleClick={() => handleEmojiReturn(emoji)}
          />
        ))}
      </div>
      
      <div className={`w-full max-w-md text-center mt-2 ${isGameOver ? 'opacity-50' : ''}`}>
        <div className="h-16 flex items-center justify-center gap-2 mb-4">
          {revealedLetters.map((letter, index) => (
            <div key={`${letter}-${index}`} className="w-10 h-12 bg-white/10 flex items-center justify-center text-2xl font-bold rounded-lg border border-white/20 animate-fade-in">
              {letter.toUpperCase()}
            </div>
          ))}
        </div>
        
        <form onSubmit={handleSubmitGuess} className={`relative ${shake ? 'animate-shake' : ''}`}>
           <div className="flex gap-2 mb-2">
            <input
                type="text"
                value={playerGuess}
                onChange={(e) => setPlayerGuess(e.target.value)}
                placeholder="Guess the word..."
                className="w-full px-4 py-3 bg-white/10 rounded-lg border border-white/20 focus:ring-2 focus:ring-purple-500 focus:outline-none transition-shadow"
                disabled={isGameOver || guessesLeft <= 0}
                autoFocus
              />
            <button type="submit" disabled={isGameOver || !playerGuess.trim() || guessesLeft <= 0} className="px-6 py-3 font-bold bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg hover:opacity-90 disabled:opacity-50 transition shadow-lg">
              Submit
            </button>
           </div>
        </form>

        <div className="flex justify-between items-center px-1">
            <p className="text-gray-300">Guesses left: <span className="font-bold text-white">{guessesLeft}</span></p>
            <div className="flex items-center gap-2">
              <button 
                  onClick={handleHintClick} 
                  disabled={isGameOver || hintUsed || guessesLeft <= 1} 
                  className="inline-flex items-center px-4 py-2 font-semibold text-sm text-yellow-300 bg-yellow-900/40 rounded-lg hover:bg-yellow-900/60 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  title="Use a hint (costs 1 guess)"
              >
                  <HintIcon />
                  Hint
              </button>
              <button onClick={handleClear} disabled={isGameOver || placedEmojis.length === 0} className="px-4 py-2 font-semibold text-sm text-gray-300 bg-white/5 rounded-lg hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition">
                Clear Canvas
              </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default GameScreen;
