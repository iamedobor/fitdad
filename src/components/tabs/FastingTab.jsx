import { Card } from '../ui/Card.jsx';
import { useApp } from '../../context/AppContext.jsx';
import { useTick } from '../../hooks/useTick.js';
import { getFastingState } from '../../utils/fasting.js';

const TIPS = [
  'Black coffee and plain tea are completely fine during the fast.',
  'Sparkling water helps suppress hunger spikes quickly.',
  'Hunger waves pass within 20 minutes. Ride them out.',
  'Stay busy. Distraction beats cravings every time.',
  'No snacks. Not even a small one.',
  'Supplements and medication with water are fine.',
];

const SCIENCE = [
  {
    title: 'Insulin drops to baseline',
    body: 'No food means no insulin spike. Your body switches to burning stored fat, especially the visceral fat around your midsection.',
  },
  {
    title: 'Calorie control becomes automatic',
    body: 'Fewer eating hours means naturally fewer total calories consumed, without tracking a single number.',
  },
  {
    title: 'Growth hormone increases',
    body: 'Fasting significantly boosts growth hormone in men, helping you preserve and build muscle while losing fat simultaneously.',
  },
];

export function FastingTab() {
  useTick();
  const { settings } = useApp();
  const f = getFastingState(settings);
  const r = 72;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - f.progress);

  return (
    <div className="fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div>
        <div style={{ fontSize: 20, fontWeight: 600 }}>Fasting timer</div>
        <div style={{ fontSize: 12, color: 'var(--text2)', marginTop: 2 }}>
          {f.fastHours}:8 protocol - {f.windowStart}:00 to {f.windowEnd}:00
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', padding: '6px 0' }}>
        <svg width={184} height={184} viewBox="0 0 184 184">
          <circle cx={92} cy={92} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={10} />
          <circle
            cx={92} cy={92} r={r} fill="none"
            stroke={f.isOpen ? 'var(--green)' : 'var(--accent)'}
            strokeWidth={10}
            strokeDasharray={circ}
            strokeDashoffset={offset}
            strokeLinecap="round"
            transform="rotate(-90 92 92)"
            style={{ transition: 'stroke-dashoffset 0.8s ease' }}
          />
          <text x={92} y={80} textAnchor="middle" fontSize={11} fill="rgba(255,255,255,0.35)" fontFamily="DM Sans,sans-serif">
            {f.isOpen ? 'Eating window' : 'Fasting'}
          </text>
          <text x={92} y={107} textAnchor="middle" fontSize={28} fontWeight={600} fill="white" fontFamily="DM Mono,monospace">
            {String(f.h).padStart(2, '0')}:{String(f.m).padStart(2, '0')}
          </text>
          <text x={92} y={122} textAnchor="middle" fontSize={10} fill="rgba(255,255,255,0.3)" fontFamily="DM Sans,sans-serif">
            {f.isOpen ? 'closes in' : 'opens in'}
          </text>
        </svg>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <Card style={{ textAlign: 'center', padding: '12px' }}>
          <div style={{ fontSize: 10, color: 'var(--text2)', marginBottom: 4, fontWeight: 500 }}>WINDOW OPENS</div>
          <div style={{ fontSize: 20, fontWeight: 600, color: 'var(--green)' }}>{f.windowStart}:00</div>
        </Card>
        <Card style={{ textAlign: 'center', padding: '12px' }}>
          <div style={{ fontSize: 10, color: 'var(--text2)', marginBottom: 4, fontWeight: 500 }}>WINDOW CLOSES</div>
          <div style={{ fontSize: 20, fontWeight: 600, color: 'var(--red)' }}>{f.windowEnd}:00</div>
        </Card>
      </div>

      <Card>
        <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 8 }}>During the fast</div>
        {TIPS.map((t, i) => (
          <div key={i} style={{ fontSize: 12, color: 'var(--text2)', padding: '7px 0', borderTop: i > 0 ? '1px solid var(--border)' : 'none' }}>
            {t}
          </div>
        ))}
      </Card>

      <Card>
        <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 10 }}>Why intermittent fasting works for fat loss</div>
        {SCIENCE.map((x, i) => (
          <div key={i} style={{ padding: '9px 0', borderTop: i > 0 ? '1px solid var(--border)' : 'none' }}>
            <div style={{ fontSize: 12, fontWeight: 500, marginBottom: 3 }}>{x.title}</div>
            <div style={{ fontSize: 11, color: 'var(--text2)', lineHeight: 1.6 }}>{x.body}</div>
          </div>
        ))}
      </Card>
    </div>
  );
}
