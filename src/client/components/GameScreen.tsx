import React, { useState, useEffect, useRef } from 'react';
import { Emoji, PlacedEmoji, GameData } from '../../shared/types/game';
import EmojiItem from './EmojiItem';
import VennEmoji from './VennEmoji';

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
  return distanceSquared < EMOJI_DIAMETER * EMOJI_DIAMETER;
};

const getOverlappingEmojis = (emojis: PlacedEmoji[]): Set<PlacedEmoji> => {
  const overlappingSet = new Set<PlacedEmoji>();
  for (let i = 0; i < emojis.length; i++) {
    for (let j = i + 1; j < emojis.length; j++) {
      const emoji1 = emojis[i];
      const emoji2 = emojis[j];
      if (emoji1 && emoji2 && doEmojisOverlap(emoji1, emoji2)) {
        overlappingSet.add(emoji1);
        overlappingSet.add(emoji2);
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isCombinationCorrect, setIsCombinationCorrect] = useState(false);
  const [allLettersRevealed, setAllLettersRevealed] = useState(false);

  const canvasRef = useRef<HTMLDivElement>(null);
  const draggingEmojiRef = useRef<{ id: string; offsetX: number; offsetY: number } | null>(null);

  useEffect(() => {
    if (isGameOver) return;

    // --- Letter Reveal Logic ---
    let combinedLetters: Set<string>;

    if (minimal_emoji_count === 1) {
      // If minimal combination is 1, reveal letters from ALL placed emojis (no overlap needed)
      combinedLetters = new Set(placedEmojis.flatMap((e) => e.name.split('')));
    } else {
      // If minimal combination > 1, only reveal letters from OVERLAPPING emojis
      const overlappingEmojis = Array.from(getOverlappingEmojis(placedEmojis));
      combinedLetters = new Set(overlappingEmojis.flatMap((e) => e.name.split('')));
    }

    // Reveal all letter instances (including duplicates) from the secret word
    const newlyRevealedChars: string[] = [];
    secretWord.split('').forEach((char) => {
      if (combinedLetters.has(char)) {
        newlyRevealedChars.push(char);
      }
    });

    // Sort revealed letters to maintain consistent display order
    const newRevealedArray = newlyRevealedChars.sort();
    if (
      newRevealedArray.length !== revealedLetters.length ||
      !newRevealedArray.every((l, i) => l === revealedLetters[i])
    ) {
      setRevealedLetters(newRevealedArray);
    }

    // Check if all letters of the secret word are revealed
    const secretWordLetters = secretWord.split('').sort();
    const allRevealed =
      secretWordLetters.length === newRevealedArray.length &&
      secretWordLetters.every((letter, index) => letter === newRevealedArray[index]);
    setAllLettersRevealed(allRevealed);

    // --- Minimal Combination Check (based on ALL placed emojis) ---
    if (placedEmojis.length > 0) {
      const placedSignature = placedEmojis
        .map((e) => e.id)
        .sort()
        .join(',');
      const minimalSignatures = minimal_combinations.map((c) =>
        c.emojis
          .map((e) => e.id)
          .sort()
          .join(',')
      );
      const isCorrect = minimalSignatures.includes(placedSignature);
      setIsCombinationCorrect(isCorrect);
    } else {
      setIsCombinationCorrect(false);
    }
  }, [
    placedEmojis,
    secretWord,
    minimal_combinations,
    minimal_emoji_count,
    isGameOver,
    revealedLetters,
  ]);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (isGameOver || !canvasRef.current) return;

    // If minimal combination is 1, only allow 1 emoji to be placed
    if (minimal_emoji_count === 1 && placedEmojis.length >= 1) {
      return;
    }

    const emojiId = e.dataTransfer.getData('emojiId');
    const droppedEmoji = availableEmojis.find((em) => em.id === emojiId);

    if (droppedEmoji && !placedEmojis.some((em) => em.id === droppedEmoji.id)) {
      const canvasRect = canvasRef.current.getBoundingClientRect();
      const x = e.clientX - canvasRect.left - EMOJI_RADIUS;
      const y = e.clientY - canvasRect.top - EMOJI_RADIUS;

      setPlacedEmojis((prev) => [...prev, { ...droppedEmoji, x, y }]);
      setAvailableEmojis((prev) => prev.filter((em) => em.id !== droppedEmoji.id));
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => e.preventDefault();

  const handleEmojiReturn = (emojiToReturn: PlacedEmoji) => {
    if (isGameOver) return;
    setPlacedEmojis((prev) => prev.filter((em) => em.id !== emojiToReturn.id));
    setAvailableEmojis((prev) =>
      [
        ...prev,
        { id: emojiToReturn.id, emoji: emojiToReturn.emoji, name: emojiToReturn.name },
      ].sort((a, b) => parseInt(a.id) - parseInt(b.id))
    );
  };

  const handleClear = () => {
    if (isGameOver) return;
    setAvailableEmojis(emojiPalette);
    setPlacedEmojis([]);
  };

  const handleSubmitGuess = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerGuess.trim() || isGameOver || guessesLeft <= 0 || isSubmitting) return;

    setIsSubmitting(true);

    try {
      // Get the current post ID
      const response = await fetch('/api/init');
      const initData = await response.json();

      if (initData.postId) {
        // Submit guess to server
        const submitResponse = await fetch(`/api/submit-guess/${initData.postId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            guess: playerGuess.trim(),
            timeSpent: 0, // You can track actual time if needed
          }),
        });

        const result = await submitResponse.json();

        if (result.status === 'success') {
          if (result.isCorrect) {
            onGameEnd('won');
          } else {
            const newGuessesLeft = guessesLeft - 1;
            setGuessesLeft(newGuessesLeft);
            setPlayerGuess('');
            if (newGuessesLeft <= 0) onGameEnd('lost');
          }
        } else {
          // Handle server error
          console.error('Server error:', result.message);
          // Fall back to client-side validation
          if (playerGuess.trim().toLowerCase() === secretWord) {
            onGameEnd('won');
          } else {
            const newGuessesLeft = guessesLeft - 1;
            setGuessesLeft(newGuessesLeft);
            setPlayerGuess('');
            if (newGuessesLeft <= 0) onGameEnd('lost');
          }
        }
      }
    } catch (error) {
      console.error('Error submitting guess:', error);
      // Fall back to client-side validation
      if (playerGuess.trim().toLowerCase() === secretWord) {
        onGameEnd('won');
      } else {
        const newGuessesLeft = guessesLeft - 1;
        setGuessesLeft(newGuessesLeft);
        setPlayerGuess('');
        if (newGuessesLeft <= 0) onGameEnd('lost');
      }
    } finally {
      setIsSubmitting(false);
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
    setPlacedEmojis((prev) => prev.map((em) => (em.id === id ? { ...em, x, y } : em)));
  };

  const handleMouseUp = () => (draggingEmojiRef.current = null);

  // Detect if mobile (width < 500px)
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 500);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        padding: isMobile ? '12px' : '16px',
        overflow: isMobile ? 'auto' : 'hidden',
      }}
    >
      <div
        style={{
          maxWidth: '1000px',
          margin: '0 auto',
          width: '100%',
          height: isMobile ? 'auto' : '100%',
          display: 'flex',
          flexDirection: 'column',
          background: 'var(--bg-secondary)',
          borderRadius: '8px',
          padding: isMobile ? '12px' : '16px',
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: isMobile ? '12px' : '16px', textAlign: 'center' }}>
          <h2
            className="font-ancient"
            style={{
              margin: 0,
              fontSize: isMobile ? '20px' : '28px',
              fontWeight: 'bold',
              textShadow: '0 0 15px rgba(212, 175, 55, 0.5)',
              background:
                'linear-gradient(135deg, var(--horcrux-glow) 0%, var(--text-primary) 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '2px',
            }}
          >
            ⚡ HORCRUX DESTROYER ⚡
          </h2>
          <p
            className="font-magical"
            style={{ fontSize: isMobile ? '12px' : '14px', color: 'var(--text-muted)', marginTop: '4px' }}
          >
            {allLettersRevealed
              ? '⚡ All soul runes revealed! Speak the word to destroy the Horcrux!'
              : isCombinationCorrect
                ? `✨ Soul combination found! ${minimal_emoji_count === 1 ? 'Place the symbol to reveal runes.' : 'Overlap symbols to reveal more runes.'}`
                : `🔮 Find the minimal combination of ${minimal_emoji_count} magical symbol${minimal_emoji_count === 1 ? '' : 's'}.`}
          </p>
        </div>

        {/* Revealed Word Letters */}
        <div className="mb-4">
          <h3
            className="font-magical"
            style={{
              margin: '0 0 8px 0',
              fontSize: isMobile ? '14px' : '16px',
              fontWeight: '600',
              textAlign: 'center',
              color: 'var(--text-secondary)',
            }}
          >
            🔮 REVEALED SOUL RUNES 🔮
          </h3>
          <div
            style={{
              display: 'flex',
              gap: isMobile ? '6px' : '10px',
              justifyContent: 'center',
              minHeight: isMobile ? '40px' : '50px',
              alignItems: 'center',
              flexWrap: 'wrap',
            }}
          >
            {revealedLetters.map((letter, index) => (
              <div
                key={`${letter}-${index}`}
                className="horcrux-glow"
                style={{
                  width: isMobile ? '32px' : '40px',
                  height: isMobile ? '32px' : '40px',
                  background:
                    'linear-gradient(135deg, var(--dark-magic) 0%, var(--bg-tertiary) 100%)',
                  border: '2px solid var(--horcrux-glow)',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: isMobile ? '16px' : '20px',
                  fontWeight: 'bold',
                  fontFamily: 'Cinzel, serif',
                  color: 'var(--horcrux-glow)',
                  textShadow: '0 0 10px rgba(212, 175, 55, 0.8)',
                  animation: 'magical-entrance 0.5s ease-out',
                }}
              >
                {letter.toUpperCase()}
              </div>
            ))}
          </div>
        </div>

        {/* Main Content - Different layout for mobile vs desktop */}
        <div style={{ 
          display: 'flex', 
          flexDirection: isMobile ? 'column' : 'row',
          gap: isMobile ? '12px' : '16px', 
          flex: isMobile ? 'none' : 1, 
          minHeight: 0 
        }}>
          {/* Venn Canvas Section */}
          <div style={{ 
            flex: isMobile ? 'none' : '2', 
            display: 'flex', 
            flexDirection: 'column',
            minHeight: isMobile ? '250px' : 'auto'
          }}>
            {/* Controls at Top */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '8px',
                fontSize: isMobile ? '13px' : '15px',
                fontFamily: 'Cinzel, serif',
              }}
            >
              <span
                style={{
                  color: guessesLeft <= 2 ? 'var(--error-color)' : 'var(--text-secondary)',
                  fontWeight: 600,
                }}
              >
                ⚡ Attempts: {guessesLeft}
              </span>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={handleClear}
                  disabled={isGameOver || placedEmojis.length === 0}
                  className="btn-secondary"
                  style={{ padding: isMobile ? '4px 10px' : '6px 12px', fontSize: isMobile ? '12px' : '13px' }}
                >
                  🌀 Clear
                </button>
              </div>
            </div>

            <div
              ref={canvasRef}
              style={{
                position: 'relative',
                width: '100%',
                flex: isMobile ? 'none' : 1,
                height: isMobile ? '250px' : 'auto',
                minHeight: isMobile ? '250px' : '200px',
                background: isCombinationCorrect
                  ? 'radial-gradient(ellipse at center, rgba(212, 175, 55, 0.15) 0%, var(--bg-tertiary) 100%)'
                  : 'radial-gradient(ellipse at center, rgba(107, 70, 193, 0.1) 0%, var(--bg-tertiary) 100%)',
                border: `3px solid ${isCombinationCorrect ? 'var(--horcrux-glow)' : 'var(--border-color)'}`,
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: isCombinationCorrect
                  ? '0 0 30px rgba(212, 175, 55, 0.3), inset 0 0 50px rgba(212, 175, 55, 0.1)'
                  : 'inset 0 0 50px rgba(0, 0, 0, 0.5)',
                transition: 'all 0.5s ease',
              }}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              <div
                className="font-magical"
                style={{
                  position: 'absolute',
                  top: '8px',
                  left: '8px',
                  fontSize: isMobile ? '11px' : '13px',
                  color: 'var(--text-secondary)',
                  background: 'rgba(26, 10, 46, 0.8)',
                  padding: isMobile ? '4px 8px' : '6px 12px',
                  borderRadius: '6px',
                  border: '1px solid var(--border-color)',
                }}
              >
                🌑 SOUL CHAMBER
              </div>
              {placedEmojis.map((emoji) => (
                <VennEmoji
                  key={emoji.id}
                  emoji={emoji}
                  onMouseDown={(e) => handleMouseDownOnEmoji(e, emoji)}
                  onDoubleClick={() => handleEmojiReturn(emoji)}
                />
              ))}
            </div>

            {/* Input and Submit - Desktop only (mobile at bottom) */}
            {!isMobile && (
              <form onSubmit={handleSubmitGuess} style={{ marginTop: '16px' }}>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <input
                    type="text"
                    value={playerGuess}
                    onChange={(e) => setPlayerGuess(e.target.value)}
                    placeholder={
                      allLettersRevealed ? '⚡ SPEAK THE WORD ⚡' : 'Reveal all runes first...'
                    }
                    disabled={isGameOver || guessesLeft <= 0 || !allLettersRevealed || isSubmitting}
                    autoFocus
                    style={{ flex: '1', textTransform: 'uppercase' }}
                  />
                  <button
                    type="submit"
                    disabled={
                      isGameOver || !playerGuess.trim() || guessesLeft <= 0 || !allLettersRevealed || isSubmitting
                    }
                    className="btn-success"
                    style={{ padding: '12px 20px', fontSize: '14px', minWidth: '140px' }}
                  >
                    {isSubmitting ? '⏳ CASTING...' : '⚡ CAST SPELL'}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Emojis List Section */}
          <div
            style={{
              flex: isMobile ? 'none' : '1',
              borderLeft: isMobile ? 'none' : '2px solid var(--border-color)',
              borderTop: isMobile ? '2px solid var(--border-color)' : 'none',
              paddingLeft: isMobile ? '0' : '16px',
              paddingTop: isMobile ? '12px' : '0',
              display: 'flex',
              flexDirection: 'column',
              minHeight: isMobile ? '200px' : 0,
            }}
          >
            <h3
              className="font-magical"
              style={{
                margin: '0 0 8px 0',
                fontSize: isMobile ? '14px' : '16px',
                fontWeight: '600',
                color: 'var(--text-secondary)',
              }}
            >
              🔮 MAGICAL SYMBOLS
            </h3>
            <div
              className="scrollable"
              style={{
                flex: isMobile ? 'none' : 1,
                height: isMobile ? '200px' : 'auto',
                overflowY: 'scroll',
                padding: isMobile ? '8px' : '12px',
                background:
                  'linear-gradient(135deg, var(--dark-magic) 0%, var(--bg-tertiary) 100%)',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                boxShadow: 'inset 0 2px 10px rgba(0, 0, 0, 0.4)',
              }}
            >
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: isMobile ? 'repeat(5, 1fr)' : 'repeat(4, 1fr)',
                  gap: isMobile ? '6px' : '8px',
                }}
              >
                {availableEmojis.map((emoji) => (
                  <EmojiItem key={emoji.id} emoji={emoji} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Input and Submit - Mobile only (at bottom) */}
        {isMobile && (
          <form onSubmit={handleSubmitGuess} style={{ marginTop: '12px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <input
                type="text"
                value={playerGuess}
                onChange={(e) => setPlayerGuess(e.target.value)}
                placeholder={
                  allLettersRevealed ? '⚡ SPEAK THE WORD ⚡' : 'Reveal all runes first...'
                }
                disabled={isGameOver || guessesLeft <= 0 || !allLettersRevealed || isSubmitting}
                autoFocus
                style={{ 
                  flex: '1', 
                  textTransform: 'uppercase',
                  padding: '10px',
                  fontSize: '14px'
                }}
              />
              <button
                type="submit"
                disabled={
                  isGameOver || !playerGuess.trim() || guessesLeft <= 0 || !allLettersRevealed || isSubmitting
                }
                className="btn-success"
                style={{ padding: '12px 16px', fontSize: '14px', width: '100%' }}
              >
                {isSubmitting ? '⏳ CASTING...' : '⚡ CAST SPELL'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default GameScreen;
