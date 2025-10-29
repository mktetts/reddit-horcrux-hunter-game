import React from 'react';

interface RestartIconProps {
  style?: React.CSSProperties;
}

const RestartIcon: React.FC<RestartIconProps> = ({ style }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    className="h-6 w-6" 
    fill="none" 
    viewBox="0 0 24 24" 
    stroke="currentColor" 
    strokeWidth={2}
    style={style}
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      d="M4 4v5h5M20 20v-5h-5M4 4l1.5 1.5A9 9 0 0120.5 10.5M20 20l-1.5-1.5A9 9 0 003.5 13.5" 
    />
  </svg>
);

export default RestartIcon;