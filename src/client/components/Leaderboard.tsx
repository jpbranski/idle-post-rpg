// src/client/components/Leaderboard.tsx

import { useState, useEffect } from 'react';
import type { Screen } from '../App';
import useGameState from '../hooks/useGameState';

interface LeaderboardEntry {
  username: string;
  score: number;
  rank: number;
  isCurrentUser?: boolean;
}

export default function Leaderboard({ goTo }: { goTo: (s: Screen) => void }) {
  const { state } = useGameState();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [currentUserRank, setCurrentUserRank] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch from Devvit Redis
    // For now, simulate leaderboard
    const mockLeaderboard: LeaderboardEntry[] = Array.from({ length: 100 }, (_, i) => ({
      username: `Player${i + 1}`,
      score: Math.floor(Math.random() * 10000000),
      rank: i + 1,
    })).sort((a, b) => b.score - a.score);

    // Add current user if not anonymous
    if (!state.settings.anonymous) {
      const userEntry: LeaderboardEntry = {
        username: 'You',
        score: state.score,
        rank: mockLeaderboard.filter((e) => e.score > state.score).length + 1,
        isCurrentUser: true,
      };
      setCurrentUserRank(userEntry.rank);
    }

    setLeaderboard(mockLeaderboard.slice(0, 25));
    setLoading(false);
  }, [state.score, state.settings.anonymous]);

  if (loading) {
    return (
      <div className="screen leaderboard-screen">
        <h2>Loading Leaderboard...</h2>
        <button onClick={() => goTo('start')}>Back</button>
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
      {!state.settings.anonymous && currentUserRank && (
        <div className="current-user-rank">
          <h3>Your Rank</h3>
          <div className="rank-display">
            <span className="rank-number">#{currentUserRank.toLocaleString()}</span>
            <span className="rank-score">{state.score.toLocaleString()} score</span>
          </div>
        </div>
      )}

      {state.settings.anonymous && (
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
