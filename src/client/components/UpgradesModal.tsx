// src/client/components/UpgradesModal.tsx

import type { GameState } from '../../shared/types/game';
import { UPGRADES, PASSIVE_UPGRADES, INFINITE_UPGRADES } from '../../shared/constants/game';
import { calculateUpgradeCost } from '../../shared/helpers/calculations';

interface Props {
  state: GameState;
  buyUpgrade: (key: keyof GameState['upgrades']) => void;
  buyPassive: (key: keyof GameState['passives']) => void;
  buyInfinite: (key: keyof GameState['infinite']) => void;
  onClose: () => void;
}

export default function UpgradesModal({
  state,
  buyUpgrade,
  buyPassive,
  buyInfinite,
  onClose,
}: Props) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>
          ✕
        </button>
        <h2>Upgrades</h2>

        {/* Standard Upgrades */}
        <section className="upgrade-section">
          <h3>Core Upgrades</h3>
          <div className="upgrade-grid">
            {UPGRADES.map((upgrade) => {
              const level = state.upgrades[upgrade.key as keyof GameState['upgrades']];
              const cost = calculateUpgradeCost(upgrade.baseCost, level, upgrade.costMultiplier);
              const maxed = upgrade.maxLevel ? level >= upgrade.maxLevel : false; // ← CHANGE THIS LINE
              const canAfford = state.karma >= cost;

              return (
                <div
                  key={upgrade.key}
                  className={`upgrade-card ${canAfford && !maxed ? 'affordable' : ''}`}
                >
                  <div className="upgrade-header">
                    <h4>{upgrade.label}</h4>
                    <span className="level">
                      Lvl {level}
                      {upgrade.maxLevel ? `/${upgrade.maxLevel}` : ''}
                    </span>
                  </div>
                  <p className="description">{upgrade.description}</p>
                  <p className="effect">{upgrade.effect}</p>
                  <button
                    onClick={() => buyUpgrade(upgrade.key as keyof GameState['upgrades'])}
                    disabled={!canAfford || maxed}
                    className="buy-btn"
                  >
                    {maxed ? 'MAXED' : `Buy (${cost.toLocaleString()} karma)`}
                  </button>
                </div>
              );
            })}
          </div>
        </section>

        {/* Passive Generators */}
        <section className="upgrade-section">
          <h3>Passive Income</h3>
          <div className="upgrade-grid">
            {PASSIVE_UPGRADES.map((upgrade) => {
              const level = state.passives[upgrade.key as keyof GameState['passives']];
              const cost = calculateUpgradeCost(upgrade.baseCost, level, upgrade.costMultiplier);
              const canAfford = state.karma >= cost;

              return (
                <div key={upgrade.key} className={`upgrade-card ${canAfford ? 'affordable' : ''}`}>
                  <div className="upgrade-header">
                    <h4>{upgrade.label}</h4>
                    <span className="level">Lvl {level}</span>
                  </div>
                  <p className="description">{upgrade.description}</p>
                  <p className="effect">{upgrade.effect}</p>
                  <button
                    onClick={() => buyPassive(upgrade.key as keyof GameState['passives'])}
                    disabled={!canAfford}
                    className="buy-btn"
                  >
                    Buy ({cost.toLocaleString()} karma)
                  </button>
                </div>
              );
            })}
          </div>
        </section>

        {/* Infinite Multipliers */}
        <section className="upgrade-section">
          <h3>Power Multipliers</h3>
          <div className="upgrade-grid">
            {INFINITE_UPGRADES.map((upgrade) => {
              const level = state.infinite[upgrade.key as keyof GameState['infinite']];
              const cost = calculateUpgradeCost(upgrade.baseCost, level, upgrade.costMultiplier);
              const canAfford = state.karma >= cost;

              return (
                <div key={upgrade.key} className={`upgrade-card ${canAfford ? 'affordable' : ''}`}>
                  <div className="upgrade-header">
                    <h4>{upgrade.label}</h4>
                    <span className="level">Lvl {level}</span>
                  </div>
                  <p className="description">{upgrade.description}</p>
                  <p className="effect">{upgrade.effect}</p>
                  <button
                    onClick={() => buyInfinite(upgrade.key as keyof GameState['infinite'])}
                    disabled={!canAfford}
                    className="buy-btn"
                  >
                    Buy ({cost.toLocaleString()} karma)
                  </button>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
