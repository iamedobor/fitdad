import { useState } from 'react';
import { useApp } from '../../context/AppContext.jsx';
import { Card } from '../ui/Card.jsx';

const MOOD_LABELS = ['Low', 'Below average', 'Okay', 'Good', 'Great'];
const MOOD_COLORS = ['var(--red)', 'var(--amber)', 'var(--text2)', 'var(--blue)', 'var(--green)'];

export function JournalView() {
  const { journal, setJournal, todayKey } = useApp();
  const entry = journal[todayKey] || {};
  const [note, setNote] = useState(entry.note || '');

  const update = (field, value) => {
    const updated = {
      ...journal,
      [todayKey]: {
        ...(journal[todayKey] || {}),
        date: todayKey,
        label: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
        [field]: value,
      },
    };
    setJournal(updated);
  };

  const history = Object.entries(journal)
    .sort(([a], [b]) => b.localeCompare(a))
    .filter(([k]) => k !== todayKey)
    .slice(0, 7);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Card>
        <div style={{ fontSize: 11, color: 'var(--text3)', marginBottom: 12, fontWeight: 500 }}>TODAY</div>

        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 12, fontWeight: 500, marginBottom: 8 }}>How are you feeling?</div>
          <div style={{ display: 'flex', gap: 6 }}>
            {MOOD_LABELS.map((label, i) => (
              <button
                key={i}
                onClick={() => update('mood', i)}
                aria-label={label}
                style={{
                  flex: 1,
                  height: 32,
                  borderRadius: 'var(--r2)',
                  cursor: 'pointer',
                  background: entry.mood === i ? MOOD_COLORS[i] + '22' : 'var(--bg3)',
                  border: `1px solid ${entry.mood === i ? MOOD_COLORS[i] + '66' : 'var(--border)'}`,
                  fontSize: 11,
                  fontWeight: entry.mood === i ? 600 : 400,
                  color: entry.mood === i ? MOOD_COLORS[i] : 'var(--text3)',
                  transition: 'all 0.15s',
                }}
              >
                {i + 1}
              </button>
            ))}
          </div>
          {entry.mood !== undefined && (
            <div style={{ fontSize: 11, color: MOOD_COLORS[entry.mood], marginTop: 6 }}>{MOOD_LABELS[entry.mood]}</div>
          )}
        </div>

        <div style={{ marginBottom: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <div style={{ fontSize: 12, fontWeight: 500 }}>Energy level</div>
            <div style={{ fontSize: 12, color: 'var(--text3)' }}>{entry.energy ? `${entry.energy}/5` : 'Not set'}</div>
          </div>
          <div style={{ display: 'flex', gap: 5 }}>
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                onClick={() => update('energy', n)}
                aria-label={`Energy ${n}/5`}
                style={{ flex: 1, height: 30, borderRadius: 'var(--r3)', cursor: 'pointer', fontSize: 11, fontWeight: 600, background: (entry.energy || 0) >= n ? 'rgba(245,166,35,0.2)' : 'var(--bg3)', border: `1px solid ${(entry.energy || 0) >= n ? 'rgba(245,166,35,0.5)' : 'var(--border)'}`, color: (entry.energy || 0) >= n ? 'var(--amber)' : 'var(--text3)' }}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <div style={{ fontSize: 12, fontWeight: 500 }}>Sleep last night</div>
            <div style={{ fontSize: 12, color: 'var(--blue)' }}>{entry.sleep ? `${entry.sleep}h` : 'Not set'}</div>
          </div>
          <input
            type="range" min={3} max={11} step={0.5}
            value={entry.sleep || 7}
            onChange={(e) => update('sleep', parseFloat(e.target.value))}
            style={{ width: '100%' }}
            aria-label="Sleep hours"
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, color: 'var(--text3)', marginTop: 3 }}>
            <span>3h</span><span>7h (ideal)</span><span>11h</span>
          </div>
        </div>

        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          onBlur={() => update('note', note)}
          placeholder="How was today? Any wins? Anything worth noting..."
          rows={3}
          style={{ width: '100%', resize: 'none', lineHeight: 1.6 }}
        />
        <button
          onClick={() => update('note', note)}
          style={{ width: '100%', marginTop: 8, padding: '9px', borderRadius: 'var(--r2)', background: 'var(--bg3)', color: 'var(--text)', border: '1px solid var(--border2)', fontSize: 13, cursor: 'pointer' }}
        >
          Save note
        </button>
      </Card>

      {history.length > 0 && (
        <div>
          <div style={{ fontSize: 10, color: 'var(--text3)', marginBottom: 8, fontWeight: 500, letterSpacing: 0.5 }}>RECENT ENTRIES</div>
          {history.map(([date, e]) => (
            <div key={date} style={{ padding: '10px 0', borderTop: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <div style={{ fontSize: 13, fontWeight: 500 }}>{e.label || date}</div>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center', fontSize: 11 }}>
                  {e.mood !== undefined && <span style={{ color: MOOD_COLORS[e.mood] }}>{MOOD_LABELS[e.mood]}</span>}
                  {e.energy && <span style={{ color: 'var(--amber)' }}>Energy {e.energy}/5</span>}
                  {e.sleep && <span style={{ color: 'var(--blue)' }}>{e.sleep}h sleep</span>}
                </div>
              </div>
              {e.note && <div style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.55 }}>{e.note}</div>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
