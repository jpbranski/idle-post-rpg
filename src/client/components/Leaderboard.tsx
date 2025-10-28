import type { Screen } from '../App';

export default function Leaderboard({ goTo }: { goTo: (s: Screen) => void }) {
  return (
    <div className="screen">
      <h2>Leaderboards Coming Soon</h2>
      <button onClick={() => goTo('start')}>Back</button>
    </div>
  );
}
