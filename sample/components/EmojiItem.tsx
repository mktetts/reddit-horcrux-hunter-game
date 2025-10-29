import React from 'react';
import { Emoji } from '../types';

interface EmojiItemProps {
  emoji: Emoji;
  isDraggable?: boolean;
  isSelectable?: boolean;
}

const EmojiItem: React.FC<EmojiItemProps> = ({ emoji, isDraggable = true, isSelectable = false }) => {

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    if (!isDraggable) return;
    e.dataTransfer.setData('emojiId', emoji.id);
  };

  const cursorClass = isSelectable ? 'cursor-pointer' : (isDraggable ? 'cursor-grab' : '');
  const hoverClass = isSelectable || isDraggable ? 'hover:scale-110 hover:shadow-lg' : '';

  return (
    <div
      draggable={isDraggable}
      onDragStart={handleDragStart}
      className={`flex items-center justify-center w-12 h-12 text-3xl bg-white/10 backdrop-blur-md rounded-xl border border-white/20 shadow-md transition-transform duration-200 ${cursorClass} ${hoverClass}`}
      title={emoji.name}
    >
      {emoji.emoji}
    </div>
  );
};

export default EmojiItem;