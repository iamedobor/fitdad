import { useState, useRef, useEffect } from 'react';
import { Info } from 'lucide-react';

export function InfoTooltip({ text, size = 13 }) {
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!visible) return;
    const close = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setVisible(false);
    };
    document.addEventListener('mousedown', close);
    document.addEventListener('touchstart', close);
    return () => {
      document.removeEventListener('mousedown', close);
      document.removeEventListener('touchstart', close);
    };
  }, [visible]);

  return (
    <span
      ref={ref}
      style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', verticalAlign: 'middle' }}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onClick={(e) => { e.stopPropagation(); setVisible((v) => !v); }}
    >
      <Info size={size} color="var(--text3)" style={{ cursor: 'pointer', flexShrink: 0 }} />
      {visible && (
        <span
          style={{
            position: 'absolute',
            bottom: 'calc(100% + 6px)',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'var(--bg4)',
            border: '1px solid var(--border2)',
            borderRadius: 'var(--r2)',
            padding: '9px 12px',
            fontSize: 11,
            color: 'var(--text2)',
            lineHeight: 1.55,
            width: 220,
            zIndex: 100,
            boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
            pointerEvents: 'none',
          }}
        >
          {text}
          <span style={{
            position: 'absolute',
            top: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            borderWidth: '5px 5px 0',
            borderStyle: 'solid',
            borderColor: 'var(--border2) transparent transparent',
          }} />
        </span>
      )}
    </span>
  );
}
