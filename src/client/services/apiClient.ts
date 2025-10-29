import {
  CreatePuzzleRequest,
  CreatePuzzleResponse,
  GetPuzzleResponse,
  SubmitGuessRequest,
  SubmitGuessResponse,
  GetSolutionResponse,
  UpdateScoreRequest,
  UpdateScoreResponse,
  GetPlayerStatsResponse,
  GetLeaderboardResponse,
} from '../../shared/types/api';

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public response?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

class ApiClient {
  private baseUrl = '';

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    let response: Response | undefined;
    let retryCount = 0;
    const maxRetries = 2;

    while (retryCount <= maxRetries) {
      try {
        response = await fetch(url, config);
        break;
      } catch (error) {
        retryCount++;
        if (retryCount > maxRetries) {
          throw new ApiError(
            `Network error after ${maxRetries} retries: ${error instanceof Error ? error.message : 'Unknown error'}`,
            0
          );
        }
        // Wait before retrying (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, retryCount) * 1000));
      }
    }

    if (!response) {
      throw new ApiError('Failed to get response after retries', 0);
    }

    let data: any;
    try {
      data = await response.json();
    } catch (error) {
      throw new ApiError(
        'Invalid JSON response from server',
        response.status,
        response
      );
    }

    if (!response.ok) {
      throw new ApiError(
        data.message || `HTTP ${response.status}: ${response.statusText}`,
        response.status,
        data
      );
    }

    return data;
  }

  // Puzzle management
  async createPuzzle(request: CreatePuzzleRequest): Promise<CreatePuzzleResponse> {
    return this.request<CreatePuzzleResponse>('/api/create-puzzle', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async createPuzzlePost(request: CreatePuzzleRequest): Promise<CreatePuzzleResponse> {
    return this.request<CreatePuzzleResponse>('/api/create-puzzle-post', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async getPuzzle(postId: string): Promise<GetPuzzleResponse> {
    return this.request<GetPuzzleResponse>(`/api/get-puzzle/${postId}`);
  }

  async submitGuess(postId: string, request: SubmitGuessRequest): Promise<SubmitGuessResponse> {
    return this.request<SubmitGuessResponse>(`/api/submit-guess/${postId}`, {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async getSolution(postId: string): Promise<GetSolutionResponse> {
    return this.request<GetSolutionResponse>(`/api/get-solution/${postId}`);
  }

  // Player statistics
  async updateScore(request: UpdateScoreRequest): Promise<UpdateScoreResponse> {
    return this.request<UpdateScoreResponse>('/api/update-score', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async getPlayerStats(userId: string): Promise<GetPlayerStatsResponse> {
    return this.request<GetPlayerStatsResponse>(`/api/player-stats/${userId}`);
  }

  async getLeaderboard(): Promise<GetLeaderboardResponse> {
    return this.request<GetLeaderboardResponse>('/api/leaderboard');
  }

  async cleanupLeaderboard(): Promise<{ status: string; message: string; validEntries: number }> {
    return this.request<{ status: string; message: string; validEntries: number }>('/api/cleanup-leaderboard', {
      method: 'POST'
    });
  }

  async getPuzzleAttempts(postId: string): Promise<{
    status: string;
    message?: string;
    postId: string;
    attempts: Array<{
      userId: string;
      username: string;
      isCorrect: boolean;
      timeSpent: number;
      attemptedAt: number;
      solved: boolean;
    }>;
    totalAttempts: number;
    successfulAttempts: number;
  }> {
    return this.request(`/api/puzzle-attempts/${postId}`);
  }

  // Ownership and solve status validation
  async checkPuzzleOwnership(postId: string): Promise<{
    status: string;
    message?: string;
    postId: string;
    ownerId?: string;
    isOwner?: boolean;
    currentUserId?: string;
  }> {
    return this.request(`/api/puzzle-ownership/${postId}`);
  }

  async checkAlreadySolved(postId: string): Promise<{
    status: string;
    message?: string;
    postId: string;
    userId?: string;
    alreadySolved: boolean;
    solvedAt?: number | null;
  }> {
    return this.request(`/api/check-already-solved/${postId}`);
  }

  // Utility methods
  async withRetry<T>(
    operation: () => Promise<T>,
    maxRetries: number = 2,
    delay: number = 1000
  ): Promise<T> {
    let lastError: Error;
    
    for (let i = 0; i <= maxRetries; i++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error');
        
        if (i === maxRetries) {
          throw lastError;
        }
        
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
      }
    }
    
    throw lastError!;
  }

  // Check if error is retryable
  isRetryableError(error: ApiError): boolean {
    // Retry on network errors or server errors (5xx)
    return error.status === 0 || (error.status >= 500 && error.status < 600);
  }
}

// Export singleton instance
export const apiClient = new ApiClient();