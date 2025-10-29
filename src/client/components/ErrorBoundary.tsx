import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-pink-900 flex items-center justify-center p-4">
          <div className="w-full max-w-md mx-auto p-8 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-2xl text-center">
            <div className="text-6xl mb-4">😵</div>
            <h2 className="text-2xl font-bold text-white mb-4">
              Oops! Something went wrong
            </h2>
            <p className="text-gray-300 mb-6">
              The game encountered an unexpected error. Don't worry, your progress is safe!
            </p>
            
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mb-6 text-left">
                <summary className="cursor-pointer text-sm text-gray-400 mb-2">
                  Error Details (Development)
                </summary>
                <div className="bg-black/20 p-3 rounded text-xs text-red-300 font-mono overflow-auto max-h-32">
                  <div className="mb-2">
                    <strong>Error:</strong> {this.state.error.message}
                  </div>
                  {this.state.error.stack && (
                    <div>
                      <strong>Stack:</strong>
                      <pre className="whitespace-pre-wrap text-xs">
                        {this.state.error.stack}
                      </pre>
                    </div>
                  )}
                </div>
              </details>
            )}

            <div className="flex flex-col gap-3">
              <button
                onClick={this.handleRetry}
                className="w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-lg font-semibold transition-colors"
              >
                🔄 Try Again
              </button>
              
              <button
                onClick={() => window.location.reload()}
                className="w-full px-6 py-3 bg-white/10 hover:bg-white/20 rounded-lg font-semibold transition-colors border border-white/20"
              >
                🔃 Reload Page
              </button>
            </div>

            <p className="text-xs text-gray-400 mt-4">
              If the problem persists, try refreshing the page or contact support.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;