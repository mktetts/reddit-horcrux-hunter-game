import { Emoji, GameData } from '../types';
import { WORD_LIST } from '../constants';

// --- Helper functions (imitating lodash) ---

const _countBy = (arr: string[]): { [key: string]: number } => {
  return arr.reduce((acc, char) => {
    acc[char] = (acc[char] || 0) + 1;
    return acc;
  }, {} as { [key: string]: number });
};

const _shuffle = (arr: string[]): string[] => {
  const newArray = [...arr];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

const _sample = <T>(arr: T[]): T | undefined => {
  if (arr.length === 0) return undefined;
  return arr[Math.floor(Math.random() * arr.length)];
};


// --- Core Algorithm ---

const getLetterCount = (str: string): { [key: string]: number } => {
  return _countBy(str.toLowerCase().replace(/[^a-z]/g, '').split(''));
};

const canFormWord = (word: string, selectedEmojis: Emoji[]): boolean => {
  const wordCount = getLetterCount(word);
  const combinedLetters = selectedEmojis.map(e => e.name).join('');
  const combinedCount = getLetterCount(combinedLetters);
  return Object.keys(wordCount).every(
    char => (combinedCount[char] || 0) >= wordCount[char]
  );
};

const generateCombinations = <T>(arr: T[], k: number): T[][] => {
  if (k === 0) return [[]];
  if (k > arr.length) return [];
  if (k === 1) return arr.map(a => [a]);

  const result: T[][] = [];
  arr.forEach((current, index) => {
    const rest = arr.slice(index + 1);
    generateCombinations(rest, k - 1).forEach(c => result.push([current, ...c]));
  });
  return result;
};

const findMinimalCombinations = (word: string, emojiList: Emoji[], maxSets: number = 3) => {
  let minimalSize: number | null = null;
  const found: { sig: string; combo: Emoji[] }[] = [];

  // Find the smallest size `k` that can form the word
  for (let k = 1; k <= emojiList.length; k++) {
    const combos = generateCombinations(emojiList, k);
    for (const combo of combos) {
      if (canFormWord(word, combo)) {
        minimalSize = k;
        break;
      }
    }
    if (minimalSize !== null) break;
  }

  if (minimalSize === null) return [];

  // Find all combinations of that minimal size
  const minimalCombos = generateCombinations(emojiList, minimalSize);
  for (const combo of minimalCombos) {
    if (canFormWord(word, combo)) {
      const signature = combo.map(e => e.id).sort().join(',');
      if (!found.some(f => f.sig === signature)) {
        found.push({ sig: signature, combo });
      }
      if (found.length >= maxSets) break;
    }
  }

  return found.map(f => ({
    count: f.combo.length,
    emojis: f.combo,
  }));
};

const scrambleWord = (word: string): string => {
  let scrambled = _shuffle(word.split('')).join('');
  // Ensure it's not the same as the original word
  while (scrambled === word && word.length > 1) {
    scrambled = _shuffle(word.split('')).join('');
  }
  return scrambled;
};

// --- Main Exported Function ---

export const generateGame = (selectedEmojis: Emoji[], wordLength: number = 7): GameData | null => {
  const validWords = WORD_LIST.filter(
    w => w.length === wordLength && canFormWord(w, selectedEmojis)
  );

  if (validWords.length === 0) {
    return null; // No word can be formed from the selected emojis
  }

  const word = _sample(validWords);
  if (!word) return null;

  const combos = findMinimalCombinations(word, selectedEmojis, 3);

  if (combos.length === 0) {
    return null; // Should not happen if a word was found, but as a safeguard
  }

  return {
    emojiPalette: selectedEmojis,
    word,
    scrambled: scrambleWord(word),
    word_length: word.length,
    minimal_emoji_count: combos[0].count,
    minimal_combinations: combos,
  };
};
