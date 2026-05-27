export function ProgressBar({ value, color = 'var(--accent)', style }) {
  return (
    <div style={{ height: 3, background: 'var(--bg3)', borderRadius: 2, overflow: 'hidden', ...style }}>
      <div
        style={{
          height: '100%',
          borderRadius: 2,
          background: color,
          width: `${Math.min(Math.max(value * 100, 0), 100)}%`,
          transition: 'width 0.4s ease',
        }}
      />
    </div>
  );
}
