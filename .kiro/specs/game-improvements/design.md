# Design Document

## Overview

This design document outlines the technical approach for implementing improvements to the Emoji Venn Word Game. The improvements focus on preventing cheating, enhancing user experience, fixing UI issues, and correcting game logic problems while maintaining the existing game architecture and Reddit integration.

## Architecture

The game follows a client-server architecture with React frontend and Express backend, integrated with Reddit's Devvit platform. The improvements will be implemented across multiple layers:

### Client-Side Architecture
- **React Components**: Enhanced with ownership checks, loading states, and improved UI
- **API Client**: Extended with new endpoints for ownership validation
- **State Management**: Enhanced to track puzzle ownership and solve status
- **UI Components**: Redesigned for viewport optimization and consistent scaling

### Server-Side Architecture  
- **Express Routes**: New endpoints for ownership validation and enhanced puzzle tracking
- **Redis Storage**: Extended data models for tracking ownership and solve history
- **Authentication**: Leveraging existing Reddit user context for ownership checks

## Components and Interfaces

### 1. Puzzle Ownership System

#### New Data Models
```typescript
interface PuzzleOwnership {
  postId: string;
  creatorId: string;
  createdAt: number;
}

interface PuzzleSolveHistory {
  postId: string;
  userId: string;
  solvedAt: number;
  timeSpent: number;
}
```

#### API Extensions
- `GET /api/puzzle-ownership/:postId` - Check puzzle ownership
- `GET /api/solve-status/:postId` - Check if user has solved puzzle
- Enhanced `GET /api/get-puzzle/:postId` - Include ownership and solve status

#### Component Changes
- **GameApp.tsx**: Add ownership validation before allowing puzzle access
- **SplashScreen.tsx**: Show different UI for owned puzzles
- **GameScreen.tsx**: Prevent access for puzzle creators

### 2. Enhanced Loading System

#### Loading State Management
```typescript
interface LoadingState {
  isLoading: boolean;
  message: string;
  operation: 'fetching' | 'creating' | 'submitting' | 'processing';
}
```

#### Component Integration
- **LoadingState.tsx**: Enhanced with operation-specific messaging
- **GameApp.tsx**: Loading states for all async operations
- **LeaderboardScreen.tsx**: Loading indicators for data fetching
- **GameScreen.tsx**: Loading states for puzzle operations

### 3. Letter Revelation Fix

#### Algorithm Enhancement
```typescript
interface LetterRevelationLogic {
  // Current: Only unique letters revealed
  // Fixed: All letter instances revealed including duplicates
  revealAllLetterInstances(targetWord: string, emojiCombination: Emoji[]): string[]
}
```

#### Implementation Changes
- **GameScreen.tsx**: Modified letter revelation logic in useEffect
- Enhanced overlap detection to properly count all letter instances
- Fixed display logic to show all occurrences of revealed letters

### 4. Simplified Leaderboard

#### Data Structure Changes
```typescript
interface SimplifiedLeaderboardData {
  totalPlayers: number;
  totalSolvers: number;
  globalRankings: LeaderboardEntry[];
}
```

#### Component Redesign
- **LeaderboardScreen.tsx**: Single table view with summary statistics
- Remove puzzle-specific tabs and complexity
- Add member count display at the top
- Simplified data fetching and display logic

### 5. Viewport Optimization

#### CSS Architecture
```css
/* Fixed viewport approach */
.game-container {
  height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.game-content {
  flex: 1;
  overflow: hidden;
}
```

#### Component Layout Changes
- **GameApp.tsx**: Fixed height containers
- **GameScreen.tsx**: Responsive layout within viewport constraints
- **LeaderboardScreen.tsx**: Scrollable content within fixed container
- Remove all scroll bars from main interface

## Data Models

### Enhanced Redis Schema

#### Puzzle Ownership Tracking
```
puzzle_owner:{postId} -> userId
puzzle_created_at:{postId} -> timestamp
```

#### Solve History Tracking  
```
solved:{postId}:{userId} -> timestamp
solve_history:{userId} -> Set<postId>
```

#### Enhanced Leaderboard Data
```
leaderboard_stats -> {
  totalPlayers: number,
  totalSolvers: number,
  lastUpdated: timestamp
}
```

### API Response Enhancements

#### Enhanced Puzzle Response
```typescript
interface EnhancedGetPuzzleResponse extends GetPuzzleResponse {
  isOwner?: boolean;
  alreadySolved?: boolean;
  canAccess?: boolean;
  accessMessage?: string;
}
```

#### Leaderboard Statistics
```typescript
interface LeaderboardStatsResponse {
  totalPlayers: number;
  totalSolvers: number;
  globalRankings: LeaderboardEntry[];
}
```

## Error Handling

### Ownership Validation Errors
- **Own Puzzle Access**: "You cannot solve your own puzzle! Create new puzzles or find others to solve."
- **Already Solved**: "You have already solved this puzzle! Find other puzzles to continue your journey."
- **Invalid Access**: "This puzzle is not available for solving."

### Loading Error States
- **Network Errors**: Retry mechanism with exponential backoff
- **Timeout Errors**: Clear error messages with retry options
- **Server Errors**: Graceful degradation with user-friendly messages

### UI Error Handling
- **Viewport Issues**: Responsive fallbacks for different screen sizes
- **Component Failures**: Error boundaries with recovery options
- **Data Loading Failures**: Skeleton states and retry mechanisms

## Testing Strategy

### Unit Testing Focus
- **Ownership Logic**: Test puzzle creator detection and access control
- **Letter Revelation**: Test duplicate letter handling and display
- **Loading States**: Test all loading state transitions
- **Viewport Logic**: Test responsive behavior and fixed heights

### Integration Testing
- **API Endpoints**: Test new ownership and solve status endpoints
- **Component Integration**: Test data flow between components
- **Redis Operations**: Test enhanced data storage and retrieval
- **Error Scenarios**: Test all error conditions and recovery

### User Experience Testing
- **Ownership Prevention**: Verify creators cannot solve own puzzles
- **Duplicate Solve Prevention**: Verify users cannot solve same puzzle twice
- **UI Responsiveness**: Test viewport optimization across devices
- **Loading Experience**: Test all loading states and transitions

## Implementation Approach

### Phase 1: Backend Enhancements
1. Implement puzzle ownership tracking in Redis
2. Add solve history tracking
3. Create new API endpoints for ownership validation
4. Enhance existing endpoints with ownership checks

### Phase 2: Frontend Core Logic
1. Fix letter revelation algorithm for duplicate letters
2. Implement ownership validation in GameApp
3. Add comprehensive loading states
4. Remove hint functionality from GameScreen

### Phase 3: UI/UX Improvements
1. Redesign LeaderboardScreen for simplified view
2. Implement viewport optimization across all components
3. Ensure consistent scaling and alignment
4. Add member count display to leaderboard

### Phase 4: Integration and Polish
1. Integrate all components with enhanced error handling
2. Test ownership prevention flows
3. Verify duplicate solve prevention
4. Final UI polish and responsive testing

## Security Considerations

### Access Control
- Server-side validation of puzzle ownership
- Redis-based tracking prevents client-side manipulation
- Reddit authentication ensures user identity verification

### Data Integrity
- Atomic operations for solve status updates
- Consistent state management across Redis operations
- Validation of all user inputs and API requests

### Performance Optimization
- Efficient Redis queries for ownership checks
- Cached leaderboard data with smart invalidation
- Optimized component rendering with proper React patterns