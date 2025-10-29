// src/client/components/Leaderboard.tsx

import { useState, useEffect } from 'react';
import type { Screen } from '../App';
import { getLeaderboard, getCurrentUserRank } from '../api-client';

interface LeaderboardEntry {
  username: string;
  score: number;
  rank: number;
  isCurrentUser?: boolean;
}

import type { GameStateHook } from '../App';
export default function Leaderboard({
  goTo,
  gameState,
}: {
  goTo: (s: Screen) => void;
  gameState?: GameStateHook;
}) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [currentUserRank, setCurrentUserRank] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);

        // Fetch leaderboard from Redis
        const data = await getLeaderboard(25);
        setLeaderboard(data);

        // Fetch user rank if not anonymous
        if (gameState && !gameState.state.settings.anonymous) {
          const rank = await getCurrentUserRank();
          setCurrentUserRank(rank);
        }

        setLoading(false);
      } catch (error) {
        console.error('Failed to load leaderboard:', error);
        setLoading(false);
      }
    };

    void fetchLeaderboard();
  }, [gameState]);

  if (loading) {
    return (
      <div className="screen leaderboard-screen">
        <div className="header">
          <h2>🏆 Leaderboard</h2>
          <button className="back-btn" onClick={() => goTo('game')}>
            ← Back
          </button>
        </div>
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <p>Loading leaderboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="screen leaderboard-screen">
      <div className="header">
        <h2>🏆 Leaderboard</h2>
        <button className="back-btn" onClick={() => goTo('game')}>
          ← Back
        </button>
      </div>

      {/* Current User Rank */}
      {!gameState?.state.settings.anonymous && currentUserRank && (
        <div className="current-user-rank">
          <h3>Your Rank</h3>
          <div className="rank-display">
            <span className="rank-number">#{currentUserRank.toLocaleString()}</span>
            <span className="rank-score">{gameState?.state.score.toLocaleString()} score</span>
          </div>
        </div>
      )}

      {gameState?.state.settings.anonymous && (
        <div className="anonymous-notice">
          <p>🔒 You are anonymous. Disable in Settings to appear on the leaderboard.</p>
        </div>
      )}

      {/* Top Players */}
      <div className="leaderboard-list">
        <h3>Top 25 Players</h3>
        <div className="leaderboard-table">
          <div className="table-header">
            <span>Rank</span>
            <span>Player</span>
            <span>Score</span>
          </div>
          {leaderboard.map((entry) => (
            <div
              key={entry.rank}
              className={`table-row ${entry.isCurrentUser ? 'current-user' : ''}`}
            >
              <span className="rank">
                {entry.rank === 1 && '🥇'}
                {entry.rank === 2 && '🥈'}
                {entry.rank === 3 && '🥉'}
                {entry.rank > 3 && `#${entry.rank}`}
              </span>
              <span className="username">{entry.username}</span>
              <span className="score">{entry.score.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
