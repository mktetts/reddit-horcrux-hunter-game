import React, { useState, useEffect } from 'react';
import { apiClient } from '../services/apiClient';
import RestartIcon from './icons/RestartIcon';

interface ResultOverlayProps {
  status: 'won' | 'lost';
  secretWord: string;
  onPlayAgain: () => void;
  onViewLeaderboard?: () => void;
}

const ResultOverlay: React.FC<ResultOverlayProps> = ({ status, secretWord, onPlayAgain, onViewLeaderboard }) => {
  const isWin = status === 'won';
  const [rankInfo, setRankInfo] = useState<{ newRank?: number; totalPlayers?: number } | null>(null);

  useEffect(() => {
    // Fetch updated rank information after game completion
    if (isWin) {
      fetchRankInfo();
    }
  }, [isWin]);

  const fetchRankInfo = async () => {
    try {
      const data = await apiClient.getLeaderboard();
      
      if (data.status === 'success' && data.currentUserRank) {
        setRankInfo({
          newRank: data.currentUserRank,
          totalPlayers: data.leaderboard?.length || 0,
        });
      }
    } catch (error) {
      console.error('Error fetching rank info:', error);
    }
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center z-20" style={{
      background: 'radial-gradient(ellipse at center, rgba(0, 0, 0, 0.9) 0%, rgba(10, 0, 21, 0.95) 100%)',
      backdropFilter: 'blur(8px)'
    }}>
      <div className="animate-magical-entrance" style={{ maxWidth: '450px', margin: '20px', padding: '30px' }}>
        <div className="text-center mb-4 magical-particles" style={{ position: 'relative' }}>
          <h2 className="card-title font-ancient" style={{ 
            fontSize: '36px', 
            marginBottom: '12px',
            textShadow: isWin 
              ? '0 0 30px rgba(212, 175, 55, 0.8), 0 0 60px rgba(212, 175, 55, 0.4)'
              : '0 0 30px rgba(139, 0, 0, 0.8)',
            background: isWin
              ? 'linear-gradient(135deg, var(--horcrux-glow) 0%, var(--text-primary) 100%)'
              : 'linear-gradient(135deg, var(--error-color) 0%, var(--text-primary) 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '3px'
          }}>
            {isWin ? '⚡ HORCRUX DESTROYED ⚡' : '💀 DARK MAGIC PREVAILS 💀'}
          </h2>
          <p className="font-magical" style={{ 
            color: isWin ? 'var(--horcrux-glow)' : 'var(--error-color)', 
            fontSize: '18px',
            fontWeight: 600
          }}>
            {isWin ? 'The soul fragment has been vanquished!' : 'The Horcrux remains intact...'}
          </p>
        </div>
        
        <div className="mb-4 p-4 horcrux-glow" style={{ 
          background: 'linear-gradient(135deg, var(--dark-magic) 0%, var(--bg-tertiary) 100%)', 
          borderRadius: '8px', 
          textAlign: 'center',
          border: '2px solid var(--horcrux-glow)'
        }}>
          <p className="font-magical" style={{ marginBottom: '8px', fontSize: '15px', color: 'var(--text-secondary)' }}>
            🔮 The hidden soul word was:
          </p>
          <p className="font-ancient" style={{ 
            fontSize: '28px', 
            fontWeight: 'bold', 
            color: 'var(--horcrux-glow)',
            textShadow: '0 0 15px rgba(212, 175, 55, 0.8)',
            letterSpacing: '4px'
          }}>
            {secretWord.toUpperCase()}
          </p>
        </div>
        
        {/* Rank Information */}
        {isWin && rankInfo && (
          <div className="mb-4 p-3 horcrux-glow" style={{ 
            background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.3) 0%, rgba(212, 175, 55, 0.1) 100%)', 
            borderRadius: '8px',
            border: '2px solid var(--horcrux-glow)'
          }}>
            <p className="text-center font-magical" style={{ margin: 0, fontSize: '16px', color: 'var(--horcrux-glow)', fontWeight: 600 }}>
              👑 Your Wizard Rank: #{rankInfo.newRank}
              {rankInfo.totalPlayers && (
                <span> of {rankInfo.totalPlayers} wizards</span>
              )}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <button
            onClick={onPlayAgain}
            className="btn-primary"
            style={{ padding: '16px 24px', fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
          >
            <span style={{ display: 'inline-flex' }}><RestartIcon /></span>
            🌙 RETURN TO CHAMBER
          </button>
          
          {onViewLeaderboard && (
            <button
              onClick={onViewLeaderboard}
              className="btn-secondary"
              style={{ padding: '14px 24px', fontSize: '16px' }}
            >
              👑 VIEW WIZARD RANKINGS
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResultOverlay;