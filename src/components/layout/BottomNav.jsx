import { Home, Timer, UtensilsCrossed, Dumbbell, CheckSquare, BarChart2 } from 'lucide-react';

const TABS = [
  { id: 'home', label: 'Home', Icon: Home },
  { id: 'fasting', label: 'Fast', Icon: Timer },
  { id: 'meals', label: 'Meals', Icon: UtensilsCrossed },
  { id: 'train', label: 'Train', Icon: Dumbbell },
  { id: 'log', label: 'Log', Icon: CheckSquare },
  { id: 'track', label: 'Track', Icon: BarChart2 },
];

export function BottomNav({ active, onChange }) {
  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: 480,
        background: 'rgba(13,13,15,0.97)',
        backdropFilter: 'blur(16px)',
        borderTop: '1px solid var(--border)',
        display: 'flex',
        zIndex: 10,
      }}
    >
      {TABS.map(({ id, label, Icon }) => {
        const isActive = active === id;
        return (
          <button
            key={id}
            onClick={() => onChange(id)}
            aria-label={label}
            style={{
              flex: 1,
              padding: '8px 2px 10px',
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 3,
              borderTop: `2px solid ${isActive ? 'var(--accent)' : 'transparent'}`,
              transition: 'border 0.2s',
            }}
          >
            <Icon size={16} color={isActive ? 'var(--accent)' : 'var(--text)'} strokeWidth={isActive ? 2.5 : 1.8} />
            <span style={{ fontSize: 9, color: isActive ? 'var(--accent)' : 'var(--text)', fontWeight: isActive ? 600 : 400 }}>
              {label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
