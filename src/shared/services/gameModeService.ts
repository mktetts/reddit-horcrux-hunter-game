export type GameMode = 'create' | 'solve' | 'view';

export interface GameModeContext {
  postId?: string;
  userId?: string;
  hasExistingPuzzle: boolean;
  isCreator: boolean;
}

export class GameModeService {
  static determineGameMode(context: GameModeContext): GameMode {
    const { postId, hasExistingPuzzle, isCreator } = context;
    
    // If no postId, we're in creation mode
    if (!postId) {
      return 'create';
    }
    
    // If there's an existing puzzle and user is not the creator, solve mode
    if (hasExistingPuzzle && !isCreator) {
      return 'solve';
    }
    
    // If there's an existing puzzle and user is the creator, view mode
    if (hasExistingPuzzle && isCreator) {
      return 'view';
    }
    
    // Default to create mode for new posts
    return 'create';
  }
  
  static getGameModeTitle(mode: GameMode): string {
    switch (mode) {
      case 'create':
        return 'Create a Puzzle';
      case 'solve':
        return 'Solve the Puzzle';
      case 'view':
        return 'View Your Puzzle';
      default:
        return 'Emoji Venn Game';
    }
  }
  
  static getGameModeDescription(mode: GameMode): string {
    switch (mode) {
      case 'create':
        return 'Select emojis and create a word puzzle for others to solve!';
      case 'solve':
        return 'Find the minimal emoji combination to reveal the hidden word!';
      case 'view':
        return 'View the puzzle you created and see how others are doing!';
      default:
        return 'A fun word puzzle game using emojis!';
    }
  }
}