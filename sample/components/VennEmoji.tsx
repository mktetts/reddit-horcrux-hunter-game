import React from 'react';
import { PlacedEmoji } from '../types';

interface VennEmojiProps {
  emoji: PlacedEmoji;
  onMouseDown: (e: React.MouseEvent<HTMLDivElement>) => void;
  onDoubleClick: () => void;
}

const COLORS = [
  'bg-purple-500/30 border-purple-400/80',
  'bg-blue-500/30 border-blue-400/80',
  'bg-pink-500/30 border-pink-400/80',
  'bg-teal-500/30 border-teal-400/80',
  'bg-yellow-500/30 border-yellow-400/80',
];

const VennEmoji: React.FC<VennEmojiProps> = ({ emoji, onMouseDown, onDoubleClick }) => {
  // Assign a consistent color based on the emoji's ID
  const colorClass = COLORS[parseInt(emoji.id) % COLORS.length];

  return (
    <div
      style={{
        position: 'absolute',
        left: `${emoji.x}px`,
        top: `${emoji.y}px`,
        touchAction: 'none', // Prevent default touch behaviors
      }}
      className={`flex items-center justify-center w-16 h-16 text-4xl rounded-full border-2 cursor-grab active:cursor-grabbing shadow-lg transition-colors ${colorClass}`}
      title={`Double-click to return ${emoji.name}`}
      onMouseDown={onMouseDown}
      onDoubleClick={onDoubleClick}
    >
      {emoji.emoji}
    </div>
  );
};

export default VennEmoji;
