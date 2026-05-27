export function SubNav({ options, value, onChange }) {
  return (
    <div style={{ display: 'flex', background: 'var(--bg3)', borderRadius: 'var(--r2)', padding: 3, marginBottom: 14, gap: 2 }}>
      {options.map((o) => (
        <button
          key={o.id}
          onClick={() => onChange(o.id)}
          style={{
            flex: 1,
            padding: '7px 4px',
            borderRadius: 7,
            border: value === o.id ? '1px solid var(--border2)' : '1px solid transparent',
            cursor: 'pointer',
            fontSize: 12,
            fontWeight: 500,
            background: value === o.id ? 'var(--bg2)' : 'transparent',
            color: value === o.id ? 'var(--text)' : 'var(--text3)',
            transition: 'all 0.15s',
          }}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
