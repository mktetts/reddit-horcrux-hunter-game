import React from 'react';

interface PuzzleCreatedScreenProps {
  word: string;
  postUrl?: string | undefined;
  onReturnToMain: () => void;
}

const PuzzleCreatedScreen: React.FC<PuzzleCreatedScreenProps> = ({ word, onReturnToMain }) => {
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 500);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div
      className="container"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: isMobile ? '12px' : '20px',
      }}
    >
      <div
        style={{
          maxWidth: '500px',
          width: '100%',
          background: 'var(--bg-secondary)',
          borderRadius: '12px',
          padding: isMobile ? '20px' : '32px',
          border: '2px solid var(--horcrux-glow)',
          boxShadow: '0 0 40px rgba(212, 175, 55, 0.3), inset 0 0 30px rgba(212, 175, 55, 0.1)',
        }}
      >
        {/* Success Icon */}
        <div
          style={{
            textAlign: 'center',
            marginBottom: isMobile ? '16px' : '24px',
            animation: 'magical-entrance 0.8s ease-out',
          }}
        >
          <div
            style={{
              fontSize: isMobile ? '48px' : '64px',
              marginBottom: '12px',
              filter: 'drop-shadow(0 0 20px rgba(212, 175, 55, 0.8))',
            }}
          >
            🌑✨
          </div>
          <h2
            className="font-ancient"
            style={{
              margin: 0,
              fontSize: isMobile ? '22px' : '28px',
              fontWeight: 'bold',
              textShadow: '0 0 20px rgba(212, 175, 55, 0.6)',
              background:
                'linear-gradient(135deg, var(--horcrux-glow) 0%, var(--text-primary) 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '2px',
            }}
          >
            SOUL CONCEALED
          </h2>
        </div>

        <div className="text-center mb-4">
          <p
            className="font-magical"
            style={{
              fontSize: isMobile ? '14px' : '16px',
              color: 'var(--horcrux-glow)',
              fontWeight: 600,
              lineHeight: '1.6',
            }}
          >
            Your dark magic has been sealed within the Horcrux!
          </p>
        </div>

        {/* Word Display */}
        <div
          className="mb-4 p-4 horcrux-glow"
          style={{
            background: 'linear-gradient(135deg, var(--dark-magic) 0%, var(--bg-tertiary) 100%)',
            borderRadius: '12px',
            border: '2px solid var(--horcrux-glow)',
            textAlign: 'center',
            boxShadow: '0 0 20px rgba(212, 175, 55, 0.3), inset 0 0 20px rgba(212, 175, 55, 0.1)',
          }}
        >
          <p
            className="font-magical"
            style={{
              marginBottom: '8px',
              fontSize: isMobile ? '13px' : '14px',
              color: 'var(--text-secondary)',
            }}
          >
            🔮 Your Hidden Word
          </p>
          <p
            className="font-ancient"
            style={{
              fontSize: isMobile ? '28px' : '32px',
              fontWeight: 'bold',
              color: 'var(--horcrux-glow)',
              textShadow: '0 0 15px rgba(212, 175, 55, 0.8)',
              letterSpacing: '4px',
              margin: 0,
            }}
          >
            {word.toUpperCase()}
          </p>
        </div>

        {/* Success Message */}
        <div
          className="mb-4 p-3"
          style={{
            background:
              'linear-gradient(135deg, rgba(107, 70, 193, 0.3) 0%, rgba(107, 70, 193, 0.1) 100%)',
            borderRadius: '8px',
            border: '2px solid var(--soul-purple)',
          }}
        >
          <p
            className="font-magical"
            style={{
              margin: 0,
              fontSize: isMobile ? '13px' : '14px',
              textAlign: 'center',
              color: 'var(--text-primary)',
              lineHeight: '1.6',
            }}
          >
            ⚡ Other wizards can now attempt to destroy your Horcrux on Reddit! ⚡
          </p>
        </div>

        {/* Return Button */}
        <button
          onClick={onReturnToMain}
          className="btn-success"
          style={{
            width: '100%',
            padding: isMobile ? '14px 20px' : '16px 24px',
            fontSize: isMobile ? '15px' : '18px',
            fontWeight: 'bold',
          }}
        >
          🌑 HIDE ANOTHER SOUL 🌑
        </button>

        {/* Auto-return message */}
        <p
          className="font-magical"
          style={{
            marginTop: '16px',
            textAlign: 'center',
            fontSize: isMobile ? '11px' : '12px',
            color: 'var(--text-muted)',
            fontStyle: 'italic',
          }}
        >
          Returning to main menu automatically...
        </p>
      </div>
    </div>
  );
};

export default PuzzleCreatedScreen;
