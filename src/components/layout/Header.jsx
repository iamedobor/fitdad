import { Settings } from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';

export function Header({ onSettingsOpen }) {
  const { streak, profile } = useApp();
  const name = profile?.name ? `, ${profile.name}` : '';

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '14px 16px 10px',
        borderBottom: '1px solid var(--border)',
        position: 'sticky',
        top: 0,
        background: 'rgba(13,13,15,0.97)',
        backdropFilter: 'blur(12px)',
        zIndex: 10,
      }}
    >
      <div>
        <span style={{ fontSize: 18, fontWeight: 700, letterSpacing: -0.5 }}>FitDad</span>
        <span style={{ fontSize: 9, color: 'var(--text3)', marginLeft: 8 }}>16:8 · Upper/Lower · Low Carb</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {streak > 0 && (
          <div
            style={{
              background: 'rgba(245,166,35,0.12)',
              border: '1px solid rgba(245,166,35,0.25)',
              borderRadius: 20,
              padding: '3px 10px',
              fontSize: 12,
              fontWeight: 600,
              color: 'var(--amber)',
            }}
          >
            {streak}d streak
          </div>
        )}
        <button
          onClick={onSettingsOpen}
          aria-label="Open settings"
          style={{
            background: 'var(--bg3)',
            border: '1px solid var(--border2)',
            borderRadius: 'var(--r3)',
            width: 32,
            height: 32,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text2)',
          }}
        >
          <Settings size={15} />
        </button>
      </div>
    </div>
  );
}
