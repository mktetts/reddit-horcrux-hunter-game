import { GameData } from './game';

// Base response types
export interface BaseResponse {
  status: 'success' | 'error';
  message?: string;
}

// Existing counter API types (keeping for compatibility)
export interface InitResponse {
  type: 'init';
  postId: string;
  count: number;
  username: string;
  postData?: any;
}

export interface IncrementResponse {
  type: 'increment';
  postId: string;
  count: number;
}

export interface DecrementResponse {
  type: 'decrement';
  postId: string;
  count: number;
}

// Game API types
export interface CreatePuzzleRequest {
  gameData: GameData;
}

export interface CreatePuzzleResponse extends BaseResponse {
  puzzleId?: string;
  postUrl?: string;
}

export interface GetPuzzleResponse extends BaseResponse {
  gameData?: GameData;
  alreadySolved?: boolean;
  isOwner?: boolean;
}

export interface SubmitGuessRequest {
  guess: string;
  timeSpent: number;
}

export interface SubmitGuessResponse extends BaseResponse {
  isCorrect?: boolean;
  correctWord?: string;
  cooldownRemaining?: number;
}

export interface GetSolutionResponse extends BaseResponse {
  solution?: {
    word: string;
    minimalCombinations: GameData['minimal_combinations'];
  };
}

// Player statistics types
export interface UpdateScoreRequest {
  action: 'puzzle_created' | 'puzzle_solved' | 'puzzle_failed';
  timeSpent?: number;
}

export interface UpdateScoreResponse extends BaseResponse {
  newRank?: number;
  totalPlayers?: number;
}

export interface PlayerStats {
  userId: string;
  username: string;
  puzzlesCreated: number;
  puzzlesSolved: number;
  puzzlesFailed: number;
  averageTime: number;
  totalScore: number;
  rank: number;
  lastActive: number;
  lastAction?: 'hide' | 'find' | null;
}

export interface GetPlayerStatsResponse extends BaseResponse {
  stats?: PlayerStats;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  username: string;
  puzzlesCreated: number;
  puzzlesSolved: number;
  puzzlesFailed: number;
  averageTime: number;
  totalScore: number;
}

export interface GetLeaderboardResponse extends BaseResponse {
  leaderboard?: LeaderboardEntry[];
  currentUserRank?: number | undefined;
  currentUserStats?: PlayerStats | undefined;
}