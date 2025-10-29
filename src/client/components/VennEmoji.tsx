import React from 'react';
import { PlacedEmoji } from '../../shared/types/game';

interface VennEmojiProps {
  emoji: PlacedEmoji;
  onMouseDown: (e: React.MouseEvent<HTMLDivElement>) => void;
  onDoubleClick: () => void;
}

const SOUL_COLORS = [
  { bg: 'rgba(107, 70, 193, 0.4)', border: 'rgba(107, 70, 193, 0.8)', glow: 'rgba(107, 70, 193, 0.6)' },
  { bg: 'rgba(74, 144, 226, 0.4)', border: 'rgba(74, 144, 226, 0.8)', glow: 'rgba(74, 144, 226, 0.6)' },
  { bg: 'rgba(139, 0, 139, 0.4)', border: 'rgba(139, 0, 139, 0.8)', glow: 'rgba(139, 0, 139, 0.6)' },
  { bg: 'rgba(75, 0, 130, 0.4)', border: 'rgba(75, 0, 130, 0.8)', glow: 'rgba(75, 0, 130, 0.6)' },
  { bg: 'rgba(138, 43, 226, 0.4)', border: 'rgba(138, 43, 226, 0.8)', glow: 'rgba(138, 43, 226, 0.6)' },
];

const VennEmoji: React.FC<VennEmojiProps> = ({ emoji, onMouseDown, onDoubleClick }) => {
  // Assign a consistent color based on the emoji's ID
  const colors = SOUL_COLORS[parseInt(emoji.id) % SOUL_COLORS.length];

  return (
    <div
      style={{
        position: 'absolute',
        left: `${emoji.x}px`,
        top: `${emoji.y}px`,
        touchAction: 'none',
        width: '48px',
        height: '48px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '32px',
        borderRadius: '50%',
        background: `radial-gradient(circle at 30% 30%, ${colors.bg}, rgba(26, 10, 46, 0.6))`,
        border: `3px solid ${colors.border}`,
        boxShadow: `
          0 0 20px ${colors.glow},
          0 0 40px ${colors.glow},
          inset 0 0 15px rgba(255, 255, 255, 0.1),
          0 8px 20px rgba(0, 0, 0, 0.5)
        `,
        cursor: 'grab',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)',
        animation: 'soul-shimmer 3s ease-in-out infinite',
      }}
      className="touch-target no-select"
      title={`Double-click to return ${emoji.name}`}
      onMouseDown={(e) => {
        e.currentTarget.style.cursor = 'grabbing';
        e.currentTarget.style.transform = 'perspective(1000px) rotateX(5deg) rotateY(5deg) scale(1.1)';
        onMouseDown(e);
      }}
      onMouseUp={(e) => {
        e.currentTarget.style.cursor = 'grab';
        e.currentTarget.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
      }}
      onDoubleClick={onDoubleClick}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'perspective(1000px) rotateX(-5deg) rotateY(5deg) scale(1.15)';
        e.currentTarget.style.boxShadow = `
          0 0 30px ${colors.glow},
          0 0 60px ${colors.glow},
          inset 0 0 20px rgba(255, 255, 255, 0.2),
          0 12px 30px rgba(0, 0, 0, 0.6)
        `;
      }}
      onMouseLeave={(e) => {
        if (e.currentTarget.style.cursor !== 'grabbing') {
          e.currentTarget.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
          e.currentTarget.style.boxShadow = `
            0 0 20px ${colors.glow},
            0 0 40px ${colors.glow},
            inset 0 0 15px rgba(255, 255, 255, 0.1),
            0 8px 20px rgba(0, 0, 0, 0.5)
          `;
        }
      }}
    >
      <span style={{ 
        filter: 'drop-shadow(0 2px 6px rgba(0, 0, 0, 0.8))',
        animation: 'emoji-float 2.5s ease-in-out infinite'
      }}>
        {emoji.emoji}
      </span>
    </div>
  );
};

export default VennEmoji;