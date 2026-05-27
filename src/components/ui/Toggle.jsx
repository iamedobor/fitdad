export function Toggle({ on, onChange, label, sub }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0' }}>
      <div>
        <div style={{ fontSize: 13, fontWeight: 500 }}>{label}</div>
        {sub && <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 2 }}>{sub}</div>}
      </div>
      <button
        onClick={() => onChange(!on)}
        aria-pressed={on}
        aria-label={label}
        style={{
          width: 44,
          height: 24,
          borderRadius: 12,
          border: 'none',
          cursor: 'pointer',
          position: 'relative',
          flexShrink: 0,
          background: on ? 'var(--accent)' : 'var(--bg4)',
          transition: 'background 0.2s',
        }}
      >
        <span
          style={{
            position: 'absolute',
            top: 3,
            width: 18,
            height: 18,
            borderRadius: '50%',
            background: 'white',
            left: on ? 23 : 3,
            transition: 'left 0.2s',
            display: 'block',
          }}
        />
      </button>
    </div>
  );
}
