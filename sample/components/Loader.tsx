import React from 'react';
import SpinnerIcon from './icons/SpinnerIcon';

interface LoaderProps {
  message: string;
}

const Loader: React.FC<LoaderProps> = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 text-center">
        <SpinnerIcon />
        <p className="text-lg text-gray-300">{message}</p>
    </div>
  );
};

export default Loader;
