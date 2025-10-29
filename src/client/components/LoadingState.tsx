import React from 'react';
import SpinnerIcon from './icons/SpinnerIcon';

type LoadingOperation = 'fetching' | 'creating' | 'submitting' | 'processing' | 'loading';

interface LoadingStateProps {
  message?: string;
  operation?: LoadingOperation;
  progress?: number; // 0-100
  showProgress?: boolean;
}

const getOperationMessage = (operation: LoadingOperation): string => {
  switch (operation) {
    case 'fetching':
      return 'Fetching data...';
    case 'creating':
      return 'Creating puzzle...';
    case 'submitting':
      return 'Submitting guess...';
    case 'processing':
      return 'Processing...';
    case 'loading':
    default:
      return 'Loading...';
  }
};

const LoadingState: React.FC<LoadingStateProps> = ({ 
  message, 
  operation = 'loading',
  progress,
  showProgress = false 
}) => {
  const displayMessage = message || getOperationMessage(operation);
  return (
    <div className="flex flex-col items-center justify-center gap-4 text-center p-8">
      <SpinnerIcon />
      
      <div className="space-y-2">
        <p className="text-lg text-gray-300">{displayMessage}</p>
        
        {showProgress && progress !== undefined && (
          <div className="w-64 bg-white/10 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
            />
          </div>
        )}
        
        {showProgress && progress !== undefined && (
          <p className="text-sm text-gray-400">{Math.round(progress)}%</p>
        )}
      </div>
    </div>
  );
};

export default LoadingState;