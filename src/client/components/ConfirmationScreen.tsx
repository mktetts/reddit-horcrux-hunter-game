import React from 'react';

interface ConfirmationScreenProps {
  word: string;
  onConfirm: () => void;
  onBack?: () => void;
}

const ConfirmationScreen: React.FC<ConfirmationScreenProps> = ({ word, onConfirm, onBack }) => {
  return (
    <div className="container">
      <div style={{ maxWidth: '500px', width: '100%', padding: '20px' }}>
        <div className="text-center mb-4 magical-particles" style={{ position: 'relative' }}>
          <h2 className="font-ancient" style={{ 
            fontSize: '32px', 
            marginBottom: '12px',
            textShadow: '0 0 20px rgba(107, 70, 193, 0.8)',
            background: 'linear-gradient(135deg, var(--soul-purple) 0%, var(--text-primary) 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '3px'
          }}>
            🌑 SOUL CONCEALED 🌑
          </h2>
        </div>
        
        <div className="text-center mb-4">
          <p className="font-magical" style={{ fontSize: '17px', marginBottom: '16px', color: 'var(--text-secondary)' }}>
            Your soul fragment has been hidden within the magical symbols
          </p>
        </div>
        
        <div className="mb-4 p-4 horcrux-glow" style={{ 
          background: 'linear-gradient(135deg, var(--dark-magic) 0%, var(--bg-tertiary) 100%)', 
          borderRadius: '8px', 
          textAlign: 'center',
          border: '2px solid var(--soul-purple)'
        }}>
          <p className="font-magical" style={{ marginBottom: '8px', fontSize: '15px', color: 'var(--text-secondary)' }}>
            🔮 Your hidden soul word:
          </p>
          <p className="font-ancient" style={{ 
            fontSize: '32px', 
            fontWeight: 'bold', 
            color: 'var(--horcrux-glow)',
            textShadow: '0 0 15px rgba(212, 175, 55, 0.8)',
            letterSpacing: '4px'
          }}>
            {word.toUpperCase()}
          </p>
        </div>
        
        <div className="mb-4 p-3" style={{ 
          background: 'linear-gradient(135deg, rgba(255, 107, 53, 0.3) 0%, rgba(255, 107, 53, 0.1) 100%)', 
          borderRadius: '8px',
          border: '2px solid var(--warning-color)'
        }}>
          <p className="font-magical" style={{ margin: 0, fontSize: '15px', textAlign: 'center', color: 'var(--text-primary)', fontWeight: 600 }}>
            ⚠️ Remember this word - other wizards will attempt to discover it!
          </p>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <button
            onClick={onConfirm}
            className="btn-success"
            style={{ width: '100%', padding: '16px 24px', fontSize: '18px' }}
          >
            ✨ SEAL THE HORCRUX ✨
          </button>
          
          {onBack && (
            <button
              onClick={onBack}
              className="btn-secondary"
              style={{ width: '100%', padding: '14px 24px', fontSize: '16px' }}
            >
              🌀 RETURN TO CONCEALMENT
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConfirmationScreen;