import React from 'react';

interface SplashScreenProps {
  onMenuAction: (action: 'hide-soul' | 'find-horcrux' | 'leaderboard' | 'refresh') => void;
  playerProgress: {
    hasHiddenSoul: boolean;
    hasFoundHorcrux: boolean;
    totalHorcruxesFound: number;
    totalSoulsHidden: number;
    lastAction: 'hide' | 'find' | null;
  };
  gameMode: 'create' | 'solve' | 'view';
  error?: string | null;
  isOwner?: boolean;
  alreadySolved?: boolean;
}

const SplashScreen: React.FC<SplashScreenProps> = ({
  onMenuAction,
  playerProgress,
  gameMode,
  error,
  isOwner = false,
  alreadySolved = false,
}) => {
  // Alternating gameplay logic
  const isNewPlayer =
    playerProgress.totalHorcruxesFound === 0 && playerProgress.totalSoulsHidden === 0;
  const canHideSoul = isNewPlayer ? true : playerProgress.lastAction !== 'hide';
  const canFindHorcrux = isNewPlayer ? false : playerProgress.lastAction !== 'find';
  const hasHorcruxToFind = gameMode === 'solve' && !isOwner && !alreadySolved;

  return (
    <div className="container">
      <div style={{ maxWidth: '500px', width: '100%', padding: '20px' }}>
        <div className="text-center mb-4 magical-particles" style={{ position: 'relative' }}>
          <h1
            className="card-title font-ancient"
            style={{
              fontSize: '32px',
              marginBottom: '12px',
              textShadow: '0 0 20px rgba(212, 175, 55, 0.6), 0 0 40px rgba(107, 70, 193, 0.4)',
              background:
                'linear-gradient(135deg, var(--horcrux-glow) 0%, var(--text-primary) 50%, var(--horcrux-glow) 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '3px',
            }}
          >
            ⚡ HORCRUX HUNT ⚡
          </h1>
          <div
            style={{
              display: 'flex',
              gap: '12px',
              justifyContent: 'center',
              alignItems: 'center',
              fontSize: '24px',
              opacity: 0.7,
            }}
          >
            <span style={{ animation: 'float-particles 3s ease-in-out infinite' }}>🌙</span>
            <span style={{ animation: 'float-particles 3.5s ease-in-out infinite 0.5s' }}>✨</span>
            <span style={{ animation: 'float-particles 4s ease-in-out infinite 1s' }}>🔮</span>
          </div>
        </div>

        {/* Owner Message */}
        {isOwner && (
          <div
            className="mb-3 p-3 horcrux-glow"
            style={{
              background:
                'linear-gradient(135deg, rgba(212, 175, 55, 0.3) 0%, rgba(212, 175, 55, 0.1) 100%)',
              borderRadius: '8px',
              border: '2px solid var(--horcrux-glow)',
            }}
          >
            <p
              className="text-center font-magical"
              style={{ color: 'var(--horcrux-glow)', fontSize: '15px', margin: 0, fontWeight: 600 }}
            >
              🪄 This Soul Fragment is yours! You cannot destroy your own Horcrux. Share it with
              fellow wizards or create a new one!
            </p>
          </div>
        )}

        {/* Already Solved Message */}
        {alreadySolved && !isOwner && (
          <div
            className="mb-3 p-3 horcrux-glow"
            style={{
              background:
                'linear-gradient(135deg, rgba(212, 175, 55, 0.3) 0%, rgba(212, 175, 55, 0.1) 100%)',
              borderRadius: '8px',
              border: '2px solid var(--horcrux-glow)',
            }}
          >
            <p
              className="text-center font-magical"
              style={{ color: 'var(--horcrux-glow)', fontSize: '15px', margin: 0, fontWeight: 600 }}
            >
              ⚡ You have already destroyed this Horcrux! The dark magic has been vanquished. Seek
              other Soul Fragments to continue your quest!
            </p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div
            className="mb-3 p-3 dark-pulse"
            style={{
              background:
                'linear-gradient(135deg, rgba(139, 0, 0, 0.4) 0%, rgba(139, 0, 0, 0.2) 100%)',
              borderRadius: '8px',
              border: '2px solid var(--error-color)',
            }}
          >
            <p
              className="text-center font-magical"
              style={{ color: 'var(--text-primary)', fontSize: '15px', margin: 0, fontWeight: 600 }}
            >
              ⚠️ {error}
            </p>
          </div>
        )}

        {/* Menu Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <button
            onClick={() => onMenuAction('find-horcrux')}
            disabled={!canFindHorcrux || !hasHorcruxToFind}
            className="btn-primary"
            style={{
              padding: '16px 24px',
              fontSize: '18px',
              opacity: !canFindHorcrux || !hasHorcruxToFind ? 0.5 : 1,
              position: 'relative',
            }}
          >
            <span style={{ marginRight: '8px' }}>🔍</span>
            DESTROY HORCRUX
            <span style={{ marginLeft: '8px' }}>⚡</span>
          </button>

          <button
            onClick={() => onMenuAction('hide-soul')}
            disabled={!canHideSoul}
            className="btn-primary"
            style={{
              padding: '16px 24px',
              fontSize: '18px',
              opacity: !canHideSoul ? 0.5 : 1,
            }}
          >
            <span style={{ marginRight: '8px' }}>🌑</span>
            HIDE SOUL FRAGMENT
            <span style={{ marginLeft: '8px' }}>🔮</span>
          </button>

          <button
            onClick={() => onMenuAction('leaderboard')}
            className="btn-secondary"
            style={{ padding: '14px 24px', fontSize: '16px' }}
          >
            <span style={{ marginRight: '8px' }}>👑</span>
            WIZARD RANKINGS
          </button>
        </div>

        {/* Progress Info */}
        <div
          className="mt-4 p-3"
          style={{
            background: 'linear-gradient(135deg, var(--bg-tertiary) 0%, var(--dark-magic) 100%)',
            borderRadius: '8px',
            border: '1px solid var(--border-color)',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '15px',
              fontFamily: 'Cinzel, serif',
            }}
          >
            <span>
              <span style={{ color: 'var(--horcrux-glow)' }}>⚡</span> Destroyed:{' '}
              {playerProgress.totalHorcruxesFound}
            </span>
            <span>
              <span style={{ color: 'var(--soul-purple)' }}>🌑</span> Hidden:{' '}
              {playerProgress.totalSoulsHidden}
            </span>
          </div>
        </div>

        {/* Debug Info */}
        <div
          className="mt-2"
          style={{
            fontSize: '11px',
            color: 'var(--text-muted)',
            textAlign: 'center',
            fontFamily: 'monospace',
            opacity: 0.5,
          }}
        >
          Quest: {gameMode} | Last Action: {playerProgress.lastAction || 'None'}
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
