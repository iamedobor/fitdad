export function Card({ children, style, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        background: 'var(--bg2)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--r)',
        padding: '13px 15px',
        ...style,
      }}
    >
      {children}
    </div>
  );
}
