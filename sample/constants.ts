import { Emoji } from './types';

// Expanded list for better puzzle generation
export const EMOJI_LIST: Emoji[] = [
  { id: '1', emoji: '👑', name: 'king' }, { id: '2', emoji: '🦁', name: 'lion' },
  { id: '3', emoji: '☀️', name: 'sun' }, { id: '4', emoji: '🌙', name: 'moon' },
  { id: '5', emoji: '🚗', name: 'car' }, { id: '6', emoji: '⚡️', name: 'electric' },
  { id: '7', emoji: '📚', name: 'book' }, { id: '8', emoji: '🪄', name: 'magic' },
  { id: '9', emoji: '🍎', name: 'apple' }, { id: '10', emoji: '💻', name: 'computer' },
  { id: '11', emoji: '❄️', name: 'cold' }, { id: '12', emoji: '🔥', name: 'hot' },
  { id: '13', emoji: '👻', name: 'ghost' }, { id: '14', emoji: '⛓️', name: 'chain' },
  { id: '15', emoji: '🌲', name: 'tree' }, { id: '16', emoji: '🏠', name: 'house' },
  { id: '17', emoji: '🔑', name: 'key' }, { id: '18', emoji: '❤️', name: 'love' },
  { id: '19', emoji: '💔', name: 'heartbreak' }, { id: '20', emoji: '⏳', name: 'time' },
  { id: '21', emoji: '💸', name: 'money' }, { id: '22', emoji: '🚀', name: 'rocket' },
  { id: '23', emoji: '🌍', name: 'earth' }, { id: '24', emoji: '🎵', name: 'music' },
  { id: '25', emoji: '🎤', name: 'microphone' }, { id: '26', emoji: '💧', name: 'water' },
  { id: '27', emoji: '🏝️', name: 'island' }, { id: '28', emoji: '🤖', name: 'robot' },
  { id: '29', emoji: '🧠', name: 'brain' }, { id: '30', emoji: '🍕', name: 'pizza' },
  { id: '31', emoji: '⚽', name: 'soccer' }, { id: '32', emoji: '🏀', name: 'basketball' },
  { id: '33', emoji: '⚓', name: 'anchor' }, { id: '34', emoji: '✈️', name: 'airplane' },
  { id: '35', emoji: '⏰', name: 'alarm' }, { id: '36', emoji: '👽', name: 'alien' },
  { id: '37', emoji: '😇', name: 'angel' }, { id: '38', emoji: '🎨', name: 'art' },
  { id: '39', emoji: '🍌', name: 'banana' }, { id: '40', emoji: '🔔', name: 'bell' },
  { id: '41', emoji: '🎂', name: 'cake' }, { id: '42', emoji: '📷', name: 'camera' },
  { id: '43', emoji: '🕯️', name: 'candle' }, { id: '44', emoji: '🧀', name: 'cheese' },
  { id: '45', emoji: '🤡', name: 'clown' }, { id: '46', emoji: '☕', name: 'coffee' },
  { id: '47', emoji: '👑', name: 'crown' }, { id: '48', emoji: '💎', name: 'diamond' },
  { id: '49', emoji: '🚪', name: 'door' }, { id: '50', emoji: '🐉', name: 'dragon' },
  { id: '51', emoji: '🐸', name: 'frog' }, { id: '52', emoji: '🎸', name: 'guitar' },
  { id: '53', emoji: '🔨', name: 'hammer' }, { id: '54', emoji: '🚁', name: 'helicopter' },
  { id: '55', emoji: '🐴', name: 'horse' }, { id: '56', emoji: '💡', name: 'idea' },
  { id: '57', emoji: '🎃', name: 'jackolantern' }, { id: '58', emoji: '😂', name: 'laugh' },
  { id: '59', emoji: '🍃', name: 'leaf' }, { id: '60', emoji: '✉️', name: 'letter' },
];

// A sample of words of various lengths for the game
export const WORD_LIST: string[] = [
  // 5 letters
  "apple", "brain", "chain", "earth", "ghost", "heart", "house", "key", "light", "magic", 
  "money", "music", "pizza", "power", "queen", "robot", "stone", "storm", "time", "water",
  
  // 6 letters
  "anchor", "banana", "camera", "danger", "dragon", "energy", "future", "galaxy", "spirit", 
  "health", "island", "jungle", "letter", "memory", "nature", "orange", "planet", "rocket", 
  "shadow", "silver",

  // 7 letters
  "mystery", "quality", "journey", "example", "history", "perfect",
  "victory", "silence", "diamond", "another", "believe", "central",
  "digital", "explore", "gallery", "hundred", "imagine", "library",
  "morning", "nothing", "outside", "picture", "problem", "quarter",
  "request", "science", "teacher", "upgrade", "village", "weather",
  "account", "balance", "capture", "deliver", "enhance", "feature",
  "general", "herself", "install", "kitchen", "logical", "maximum",
  "network", "observe", "package", "radical", "satisfy", "trouble",
  "uniform", "virtual", "welcome",

  // 8 letters
  "computer", "electric", "mountain", "discover", "language", "question", "solution",
  "strength", "sunshine", "treasure", "violence", "champion", "creature", "darkness",
  "dinosaur", "elephant", "festival", "guardian", "hospital", "infinity",

  // 9 letters
  "adventure", "beautiful", "challenge", "delicious", "education", "fantastic", "happiness",
  "important", "knowledge", "wonderful", "celebrate", "community", "different", "everybody",
  "expensive", "geography", "household", "invisible", "legendary"
];
