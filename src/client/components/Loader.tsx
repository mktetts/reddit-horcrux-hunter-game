import React from 'react';
import SpinnerIcon from './icons/SpinnerIcon';

interface LoaderProps {
  message: string;
}

const Loader: React.FC<LoaderProps> = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 text-center">
        <div className="relative">
          <SpinnerIcon />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl animate-pulse">🪄</span>
          </div>
        </div>
        <p className="text-lg font-magical" style={{color: 'var(--hp-ink)'}}>{message}</p>
        <div className="flex gap-1 animate-pulse">
          <span className="text-amber-400">✨</span>
          <span className="text-amber-500">⭐</span>
          <span className="text-amber-400">✨</span>
        </div>
    </div>
  );
};

export default Loader;