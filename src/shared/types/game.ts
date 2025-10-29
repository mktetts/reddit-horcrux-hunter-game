export interface Emoji {
  id: string;
  emoji: string;
  name: string; // clean, lowercase name for logic
}

export interface PlacedEmoji extends Emoji {
  x: number;
  y: number;
}

export interface MinimalCombination {
  count: number;
  emojis: Emoji[];
}

export interface GameData {
  emojiPalette: Emoji[];
  word: string;
  scrambled: string;
  word_length: number;
  minimal_emoji_count: number;
  minimal_combinations: MinimalCombination[];
}

export type GameState = 'hiding' | 'generating' | 'confirming' | 'guessing' | 'won' | 'lost';