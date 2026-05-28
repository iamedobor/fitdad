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
      <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
        <div style={{
          width: 30, height: 30, borderRadius: 9,
          background: 'var(--accent)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
          boxShadow: '0 2px 10px rgba(230,57,70,0.45)',
        }}>
          <span style={{ fontSize: 15, fontWeight: 800, color: 'white', letterSpacing: -1, lineHeight: 1 }}>F</span>
        </div>
        <div>
          <div style={{ fontSize: 17, fontWeight: 700, letterSpacing: -0.5, lineHeight: 1.1 }}>
            <span style={{ color: 'var(--accent)' }}>Fit</span><span style={{ color: 'var(--text)' }}>Dad</span>
          </div>
          <div style={{ fontSize: 9, color: 'var(--text2)', marginTop: 2, letterSpacing: 0.2 }}>Lose fat. Build strength. Stay consistent.</div>
        </div>
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
