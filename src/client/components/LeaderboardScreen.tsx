import React, { useState, useEffect } from 'react';
import { LeaderboardEntry } from '../../shared/types/api';
import { apiClient, ApiError } from '../services/apiClient';
import LoadingState from './LoadingState';

interface LeaderboardScreenProps {
  onClose: () => void;
}

const LeaderboardScreen: React.FC<LeaderboardScreenProps> = ({ onClose }) => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [currentUserRank, setCurrentUserRank] = useState<number | undefined>();
  const [currentUserStats, setCurrentUserStats] = useState<any>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPlayers, setTotalPlayers] = useState<number>(0);
  const [totalSolvers, setTotalSolvers] = useState<number>(0);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await apiClient.getLeaderboard();

      if (data.status === 'success') {
        const leaderboardData = data.leaderboard || [];
        setLeaderboard(leaderboardData);
        setCurrentUserRank(data.currentUserRank);
        setCurrentUserStats(data.currentUserStats);

        // Calculate total players and solvers
        setTotalSolvers(leaderboardData.length);
        // Total players includes current user stats if they haven't solved any puzzles yet
        const totalPlayersCount =
          leaderboardData.length +
          (data.currentUserStats && data.currentUserStats.totalScore === 0 ? 1 : 0);
        setTotalPlayers(totalPlayersCount);
      } else {
        setError(data.message || 'Failed to load leaderboard');
      }
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      if (error instanceof ApiError) {
        setError(error.message);
      } else {
        setError('Failed to load leaderboard');
      }
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank: number): string => {
    switch (rank) {
      case 1:
        return '🥇';
      case 2:
        return '🥈';
      case 3:
        return '🥉';
      default:
        return '🏅';
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div style={{ maxWidth: '800px', width: '100%' }}>
          <LoadingState operation="fetching" message="Loading leaderboard..." />
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        padding: '20px',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          maxWidth: '900px',
          margin: '0 auto',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          padding: '0',
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2
              className="font-ancient"
              style={{
                fontSize: '28px',
                textShadow: '0 0 15px rgba(212, 175, 55, 0.6)',
                background:
                  'linear-gradient(135deg, var(--horcrux-glow) 0%, var(--text-primary) 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '2px',
              }}
            >
              👑 WIZARD RANKINGS 👑
            </h2>
            <button
              onClick={onClose}
              className="btn-secondary"
              style={{ padding: '10px 16px', fontSize: '14px' }}
            >
              ✕ Close
            </button>
          </div>
        </div>

        {/* Member Statistics */}
        <div
          className="mb-4 p-4"
          style={{
            background: 'linear-gradient(135deg, var(--dark-magic) 0%, var(--bg-tertiary) 100%)',
            borderRadius: '8px',
            border: '2px solid var(--border-color)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-around', textAlign: 'center' }}>
            <div>
              <div
                className="font-ancient"
                style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--text-primary)' }}
              >
                {totalPlayers}
              </div>
              <div
                className="font-magical"
                style={{ fontSize: '13px', color: 'var(--text-secondary)' }}
              >
                🧙 Total Wizards
              </div>
            </div>
            <div>
              <div
                className="font-ancient"
                style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--horcrux-glow)' }}
              >
                {totalSolvers}
              </div>
              <div
                className="font-magical"
                style={{ fontSize: '13px', color: 'var(--text-secondary)' }}
              >
                ⚡ Horcrux Destroyers
              </div>
            </div>
          </div>
        </div>

        {/* Current User Stats */}
        {currentUserStats && (
          <div
            className="mb-4 p-3 horcrux-glow"
            style={{
              background:
                'linear-gradient(135deg, rgba(107, 70, 193, 0.3) 0%, rgba(107, 70, 193, 0.1) 100%)',
              borderRadius: '8px',
              border: '2px solid var(--soul-purple)',
            }}
          >
            <div className="text-center font-magical">
              {currentUserStats.totalScore > 0 ? (
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '16px',
                    fontWeight: 600,
                  }}
                >
                  <span style={{ color: 'var(--horcrux-glow)' }}>
                    👑 Your Rank: #{currentUserRank || 'Unranked'}
                  </span>
                  <span style={{ color: 'var(--horcrux-glow)' }}>
                    ⚡ Power: {currentUserStats.totalScore}
                  </span>
                </div>
              ) : (
                <span style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>
                  🌑 No Horcruxes destroyed yet
                </span>
              )}
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div
            className="mb-4 p-3"
            style={{ background: 'var(--error-color)', borderRadius: '4px' }}
          >
            <p className="text-center" style={{ color: 'white', margin: 0, fontSize: '14px' }}>
              {error}
            </p>
            <button
              onClick={fetchLeaderboard}
              className="btn-secondary mt-2"
              style={{ width: '100%', padding: '8px' }}
            >
              Try Again
            </button>
          </div>
        )}

        {/* Content Area - Table */}
        <div className="scrollable" style={{ flex: 1, overflowY: 'auto', marginBottom: '16px', minHeight: 0 }}>
          {loading ? (
            <div className="text-center py-8">
              <LoadingState operation="fetching" />
            </div>
          ) : leaderboard.length > 0 ? (
            <div style={{ 
              background: 'linear-gradient(135deg, var(--bg-tertiary) 0%, var(--dark-magic) 100%)',
              borderRadius: '8px',
              border: '2px solid var(--border-color)',
              overflow: 'hidden'
            }}>
              <table style={{ 
                width: '100%', 
                borderCollapse: 'collapse',
                fontSize: '15px'
              }}>
                <thead>
                  <tr style={{
                    background: 'linear-gradient(135deg, var(--dark-magic) 0%, var(--bg-tertiary) 100%)',
                    borderBottom: '2px solid var(--horcrux-glow)'
                  }}>
                    <th className="font-ancient" style={{
                      padding: '16px 12px',
                      textAlign: 'center',
                      color: 'var(--horcrux-glow)',
                      fontSize: '16px',
                      fontWeight: 'bold',
                      width: '80px'
                    }}>
                      No
                    </th>
                    <th className="font-ancient" style={{
                      padding: '16px 12px',
                      textAlign: 'left',
                      color: 'var(--horcrux-glow)',
                      fontSize: '16px',
                      fontWeight: 'bold'
                    }}>
                      Username
                    </th>
                    <th className="font-ancient" style={{
                      padding: '16px 12px',
                      textAlign: 'center',
                      color: 'var(--horcrux-glow)',
                      fontSize: '16px',
                      fontWeight: 'bold',
                      width: '180px'
                    }}>
                      Solved Horcruxes
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map((entry, index) => (
                    <tr
                      key={entry.userId}
                      className={entry.rank <= 3 ? 'horcrux-glow' : ''}
                      style={{
                        background: entry.rank <= 3
                          ? 'linear-gradient(135deg, rgba(212, 175, 55, 0.2) 0%, rgba(212, 175, 55, 0.05) 100%)'
                          : index % 2 === 0 
                            ? 'rgba(107, 70, 193, 0.1)' 
                            : 'transparent',
                        borderBottom: '1px solid var(--border-color)',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = entry.rank <= 3
                          ? 'linear-gradient(135deg, rgba(212, 175, 55, 0.3) 0%, rgba(212, 175, 55, 0.1) 100%)'
                          : 'rgba(107, 70, 193, 0.2)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = entry.rank <= 3
                          ? 'linear-gradient(135deg, rgba(212, 175, 55, 0.2) 0%, rgba(212, 175, 55, 0.05) 100%)'
                          : index % 2 === 0 
                            ? 'rgba(107, 70, 193, 0.1)' 
                            : 'transparent';
                      }}
                    >
                      <td className="font-magical" style={{
                        padding: '14px 12px',
                        textAlign: 'center',
                        fontSize: '20px',
                        fontWeight: 'bold'
                      }}>
                        {getRankIcon(entry.rank)}
                      </td>
                      <td className="font-magical" style={{
                        padding: '14px 12px',
                        textAlign: 'left',
                        fontSize: '16px',
                        fontWeight: '600',
                        color: entry.rank <= 3 ? 'var(--horcrux-glow)' : 'var(--text-primary)'
                      }}>
                        {entry.username}
                      </td>
                      <td className="font-ancient" style={{
                        padding: '14px 12px',
                        textAlign: 'center',
                        fontSize: '20px',
                        fontWeight: 'bold',
                        color: entry.rank <= 3 ? 'var(--horcrux-glow)' : 'var(--text-primary)'
                      }}>
                        ⚡ {entry.totalScore}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8" style={{ color: 'var(--text-muted)' }}>
              <p>No players on the leaderboard yet!</p>
              <p style={{ fontSize: '14px', marginTop: '8px' }}>Be the first to solve a puzzle!</p>
            </div>
          )}
        </div>

        {/* Footer */}
        {/* <div className="mt-4" style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
          <button
            onClick={fetchLeaderboard}
            disabled={loading}
            className="btn-primary"
            style={{ padding: '12px 20px', fontSize: '15px' }}
          >
            🔄 Refresh Rankings
          </button>
          <button
            onClick={async () => {
              try {
                setLoading(true);
                const result = await apiClient.cleanupLeaderboard();
                await fetchLeaderboard();
              } catch (error) {
                console.error('Cleanup failed:', error);
              } finally {
                setLoading(false);
              }
            }}
            disabled={loading}
            className="btn-danger"
            style={{ padding: '12px 20px', fontSize: '15px' }}
          >
            🧹 Purge Records
          </button>
        </div> */}

        {/* <div className="mt-3 p-3 font-magical" style={{ 
          background: 'linear-gradient(135deg, var(--dark-magic) 0%, var(--bg-tertiary) 100%)', 
          borderRadius: '8px', 
          textAlign: 'center', 
          fontSize: '14px', 
          color: 'var(--text-secondary)',
          border: '1px solid var(--border-color)'
        }}>
          🔮 Destroy Horcruxes to gain power and ascend the wizard rankings! ⚡
        </div> */}
      </div>
    </div>
  );
};

export default LeaderboardScreen;
