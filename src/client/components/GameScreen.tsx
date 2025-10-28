import useGameState from '../hooks/useGameState';
import { useTicker } from '../hooks/useTicker';
import type { Screen } from '../App';
import type { GameState } from '../hooks/useGameState';
import '../styles/GameScreen.css';

const REPLY_TIERS = [1, 2, 3, 5, 7, 10];

export default function GameScreen({ goTo }: { goTo: (s: Screen) => void }) {
  const { state, setState, addKarma } = useGameState();
  useTicker(state, addKarma);

  const getReplyGain = (lvl: number | undefined): number => {
    const safeLvl = lvl ?? 0;
    return REPLY_TIERS[Math.min(safeLvl, REPLY_TIERS.length - 1)] ?? 0;
  };

  const handleReply = () => {
    const gain = getReplyGain(state.upgrades?.reply);
    addKarma(gain);

    // Award chance (1–5%)
    const chance = Math.min(state.upgrades?.chair ?? 0, 5) * 0.01;
    if (Math.random() < chance) {
      setState(s => ({ ...s, awards: (s.awards ?? 0) + 1 }));
    }
  };

  const totalPCBonus = (state.upgrades.pc ?? 0) * 10; // %
  const awardChance = Math.min(state.upgrades.chair ?? 0, 5); // %

  return (
    <div className="screen game-screen">
      <h1 className="title">Idle Post RPG</h1>

      <div className="stats">
        <p>Karma: <strong>{state.karma}</strong></p>
        <p>Lifetime Karma: {state.lifetimeKarma}</p>
        <p>Awards: {state.awards}</p>
        <p>Passive Karma/sec: {estimatePassive(state)}</p>
        <p>PC Bonus: +{totalPCBonus}%</p>
        <p>Award Chance: {awardChance}%</p>
      </div>

      <div className="actions">
        <button className="main" onClick={handleReply}>
          Reply (+{getReplyGain(state.upgrades.reply)})
        </button>
        {state.upgrades.comment > 0 && (
          <button>Comment (+3)</button>
        )}
        {state.upgrades.post > 0 && (
          <button>Post (+8)</button>
        )}
        {state.upgrades.shitpost > 0 && (
          <button>Shitpost (+15)</button>
        )}
      </div>

      <div className="nav">
        <button onClick={() => goTo('upgrades')}>Upgrades</button>
        <button onClick={() => goTo('settings')}>Settings</button>
        <button onClick={() => goTo('start')}>Main Menu</button>
      </div>
    </div>
  );
}

function estimatePassive(state: GameState): number {
  const COMMENT_TIERS: number[] = [3, 5, 7, 10, 15, 20];
  const POST_TIERS: number[] = [10, 15, 25, 50, 75, 100];
  const SHITPOST_TIERS: number[] = [25, 50, 100, 150, 250];

  const upgrades = state.upgrades ?? {};
  const commentLvl = upgrades.comment ?? 0;
  const postLvl = upgrades.post ?? 0;
  const shitpostLvl = upgrades.shitpost ?? 0;

  // Safe helper for tier lookup
  const getTierValue = (tiers: number[], level: number): number => {
    if (level <= 0) return 0;
    const index = Math.min(level - 1, tiers.length - 1);
    return tiers[index] ?? 0; // ✅ guarantees a number
  };

  const total =
    getTierValue(COMMENT_TIERS, commentLvl) +
    getTierValue(POST_TIERS, postLvl) +
    getTierValue(SHITPOST_TIERS, shitpostLvl);

  return total;
}


