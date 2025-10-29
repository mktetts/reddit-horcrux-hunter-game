import React, { useState } from 'react';
import { Emoji } from '../../shared/types/game';
import { EMOJI_LIST } from '../../shared/constants';
import EmojiItem from './EmojiItem';

interface HiderScreenProps {
  onStart: (selectedEmojis: Emoji[], wordLength: number) => void;
  error?: string | null;
}

const MIN_SELECTION = 5;
const MAX_SELECTION = 15;

const HiderScreen: React.FC<HiderScreenProps> = ({ onStart, error }) => {
  const [selected, setSelected] = useState<Map<string, Emoji>>(new Map());
  const [wordLength, setWordLength] = useState(7);
  const [isMobile, setIsMobile] = useState(false);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 500);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleSelect = (emoji: Emoji) => {
    setSelected(prev => {
      const newSelection = new Map(prev);
      if (newSelection.has(emoji.id)) {
        newSelection.delete(emoji.id);
      } else {
        if (newSelection.size < MAX_SELECTION) {
          newSelection.set(emoji.id, emoji);
        }
      }
      return newSelection;
    });
  };
  
  const handleSubmit = () => {
    if (selected.size >= MIN_SELECTION) {
      onStart(Array.from(selected.values()), wordLength);
    }
  };

  return (
    <div className="container" style={{ 
      height: '100vh',
      overflow: isMobile ? 'auto' : 'hidden'
    }}>
      <div style={{ 
        maxWidth: '900px', 
        width: '100%', 
        height: isMobile ? 'auto' : '100%', 
        display: 'flex', 
        flexDirection: 'column', 
        padding: isMobile ? '12px' : '20px' 
      }}>
        <div style={{ marginBottom: isMobile ? '12px' : '20px' }}>
          <h2 className="card-title font-ancient" style={{ 
            textAlign: 'center',
            fontSize: isMobile ? '20px' : '28px',
            textShadow: '0 0 15px rgba(107, 70, 193, 0.6)',
            background: 'linear-gradient(135deg, var(--soul-purple) 0%, var(--text-primary) 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '2px'
          }}>
            🌑 SOUL CONCEALER 🌑
          </h2>
          <p className="font-magical" style={{ 
            textAlign: 'center', 
            fontSize: isMobile ? '12px' : '13px', 
            color: 'var(--text-muted)', 
            marginTop: '8px' 
          }}>
            Hide your soul fragment within magical symbols
          </p>
        </div>

        <div style={{ 
          display: 'flex', 
          flexDirection: isMobile ? 'column' : 'row',
          gap: isMobile ? '12px' : '16px', 
          flex: isMobile ? 'none' : 1, 
          minHeight: 0 
        }}>
          {/* Controls Section */}
          <div style={{ 
            flex: isMobile ? 'none' : '1', 
            display: 'flex', 
            flexDirection: 'column', 
            gap: isMobile ? '12px' : '16px' 
          }}>
            {/* Word Length Dropdown */}
            <div>
              <label className="font-magical" style={{ 
                display: 'block', 
                marginBottom: '8px', 
                fontSize: isMobile ? '14px' : '15px', 
                fontWeight: '600', 
                color: 'var(--text-secondary)' 
              }}>
                🔮 Soul Rune Length
              </label>
              <select 
                value={wordLength} 
                onChange={(e) => setWordLength(Number(e.target.value))}
                style={{ 
                  width: '100%',
                  padding: isMobile ? '8px' : '10px',
                  fontSize: isMobile ? '14px' : '15px'
                }}
              >
                {[5, 6, 7, 8, 9].map(len => (
                  <option key={len} value={len}>{len} runes</option>
                ))}
              </select>
            </div>

            {/* Instructions */}
            <div style={{ 
              flex: isMobile ? 'none' : '1', 
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'center' 
            }}>
              <p className="font-magical" style={{ 
                fontSize: isMobile ? '14px' : '15px', 
                color: 'var(--text-secondary)', 
                textAlign: 'center', 
                lineHeight: '1.6' 
              }}>
                Select magical symbols to conceal your soul fragment
              </p>
              <p className="font-magical" style={{ 
                fontSize: isMobile ? '13px' : '14px', 
                color: selected.size >= MIN_SELECTION ? 'var(--horcrux-glow)' : 'var(--text-muted)', 
                textAlign: 'center', 
                marginTop: '12px',
                fontWeight: 600
              }}>
                ✨ Selected: {selected.size} / {MAX_SELECTION}
              </p>
            </div>

            {/* Generate Button - Desktop only (mobile at bottom) */}
            {!isMobile && (
              <>
                <button
                  onClick={handleSubmit}
                  disabled={selected.size < MIN_SELECTION}
                  className="btn-success"
                  style={{ padding: '16px 24px', fontSize: '18px' }}
                >
                  🌑 CONCEAL SOUL 🌑
                </button>

                {/* Error Message */}
                {error && (
                  <div className="p-3 dark-pulse" style={{ 
                    background: 'linear-gradient(135deg, rgba(139, 0, 0, 0.4) 0%, rgba(139, 0, 0, 0.2) 100%)', 
                    borderRadius: '8px',
                    border: '2px solid var(--error-color)'
                  }}>
                    <p className="font-magical" style={{ 
                      color: 'var(--text-primary)', 
                      fontSize: '15px', 
                      margin: 0, 
                      textAlign: 'center', 
                      fontWeight: 600 
                    }}>
                      ⚠️ {error}
                    </p>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Available Emojis Section */}
          <div style={{ 
            flex: isMobile ? 'none' : '1', 
            borderLeft: isMobile ? 'none' : '2px solid var(--border-color)',
            borderTop: isMobile ? '2px solid var(--border-color)' : 'none',
            paddingLeft: isMobile ? '0' : '16px',
            paddingTop: isMobile ? '12px' : '0',
            display: 'flex', 
            flexDirection: 'column', 
            minHeight: isMobile ? '300px' : 0 
          }}>
            <h3 className="font-magical" style={{ 
              margin: '0 0 8px 0', 
              fontSize: isMobile ? '14px' : '16px', 
              fontWeight: '600', 
              color: 'var(--text-secondary)' 
            }}>
              🔮 MAGICAL SYMBOLS
            </h3>
            <div 
              className="scrollable" 
              style={{ 
                flex: isMobile ? 'none' : 1,
                height: isMobile ? '200px' : 'auto',
                overflowY: 'scroll',
                padding: isMobile ? '8px' : '12px',
                background: 'linear-gradient(135deg, var(--dark-magic) 0%, var(--bg-tertiary) 100%)',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                boxShadow: 'inset 0 2px 10px rgba(0, 0, 0, 0.4)'
              }}
            >
              <div style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? 'repeat(6, 1fr)' : 'repeat(6, 1fr)',
                gap: isMobile ? '6px' : '8px'
              }}>
                {EMOJI_LIST.map(emoji => (
                  <div 
                    key={emoji.id} 
                    onClick={() => handleSelect(emoji)} 
                    style={{
                      cursor: 'pointer',
                      padding: isMobile ? '4px' : '6px',
                      borderRadius: '8px',
                      border: selected.has(emoji.id) ? '3px solid var(--horcrux-glow)' : '2px solid transparent',
                      background: selected.has(emoji.id) 
                        ? 'linear-gradient(135deg, rgba(212, 175, 55, 0.3) 0%, rgba(212, 175, 55, 0.1) 100%)'
                        : 'transparent',
                      transition: 'all 0.3s ease',
                      boxShadow: selected.has(emoji.id) 
                        ? '0 0 20px rgba(212, 175, 55, 0.4), inset 0 0 10px rgba(212, 175, 55, 0.2)'
                        : 'none',
                      transform: selected.has(emoji.id) ? 'scale(1.05)' : 'scale(1)'
                    }}
                    onMouseEnter={(e) => {
                      if (!selected.has(emoji.id)) {
                        e.currentTarget.style.background = 'rgba(107, 70, 193, 0.2)';
                        e.currentTarget.style.borderColor = 'var(--soul-purple)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!selected.has(emoji.id)) {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.borderColor = 'transparent';
                      }
                    }}
                  >
                     <EmojiItem emoji={emoji} isSelectable={true} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Generate Button and Error - Mobile only (at bottom) */}
        {isMobile && (
          <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button
              onClick={handleSubmit}
              disabled={selected.size < MIN_SELECTION}
              className="btn-success"
              style={{ padding: '14px 20px', fontSize: '16px', width: '100%' }}
            >
              🌑 CONCEAL SOUL 🌑
            </button>

            {/* Error Message */}
            {error && (
              <div className="p-3 dark-pulse" style={{ 
                background: 'linear-gradient(135deg, rgba(139, 0, 0, 0.4) 0%, rgba(139, 0, 0, 0.2) 100%)', 
                borderRadius: '8px',
                border: '2px solid var(--error-color)'
              }}>
                <p className="font-magical" style={{ 
                  color: 'var(--text-primary)', 
                  fontSize: '14px', 
                  margin: 0, 
                  textAlign: 'center', 
                  fontWeight: 600 
                }}>
                  ⚠️ {error}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default HiderScreen;