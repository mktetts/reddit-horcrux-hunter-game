import React from 'react';
import { Emoji } from '../../shared/types/game';

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

  return (
    <div
      draggable={isDraggable}
      onDragStart={handleDragStart}
      className={`flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 text-2xl sm:text-3xl rounded-xl shadow-md transition-all duration-300 touch-target no-select ${cursorClass}`}
      title={emoji.name}
      style={{
        background: 'linear-gradient(135deg, rgba(107, 70, 193, 0.3) 0%, rgba(26, 10, 46, 0.5) 100%)',
        border: '2px solid rgba(107, 70, 193, 0.4)',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'perspective(1000px) rotateX(-10deg) rotateY(10deg) scale(1.15)';
        e.currentTarget.style.boxShadow = '0 8px 25px rgba(107, 70, 193, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.2)';
        e.currentTarget.style.borderColor = 'var(--horcrux-glow)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
        e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)';
        e.currentTarget.style.borderColor = 'rgba(107, 70, 193, 0.4)';
      }}
    >
      <span style={{ 
        filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.5))',
        animation: 'emoji-float 3s ease-in-out infinite'
      }}>
        {emoji.emoji}
      </span>
    </div>
  );
};

export default EmojiItem;