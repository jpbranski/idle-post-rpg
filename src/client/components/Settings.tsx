import type { Screen } from '../App';
import useGameState from '../hooks/useGameState';
import '../styles/GameScreen.css';

export default function Settings({ goTo }: { goTo: (s: Screen) => void }) {
  const { state, setState } = useGameState();

  const changeTheme = (theme: 'light' | 'dark' | 'oldschool') => {
    setState(s => ({ ...s, theme }));
    document.body.setAttribute('data-theme', theme);
  };

  const deleteSave = () => {
    if (confirm('Are you sure you want to delete your save?')) {
      localStorage.removeItem('snooidle-save');
      window.location.reload();
    }
  };

  return (
    <div className="screen">
      <h2>Settings</h2>

      <div style={{ margin: '1rem 0' }}>
        <h4>Theme</h4>
        <button onClick={() => changeTheme('light')}>Light Mode</button>
        <button onClick={() => changeTheme('dark')}>Dark Mode (Unlocked!)</button>
        <button onClick={() => changeTheme('oldschool')}>Old School Mode</button>
      </div>

      <div style={{ margin: '1rem 0' }}>
        <button onClick={deleteSave} style={{ backgroundColor: '#ff4444', color: '#fff' }}>
          Delete Save
        </button>
      </div>

      <button className="back-btn" onClick={() => goTo('start')}>
        Back
      </button>
    </div>
  );
}
