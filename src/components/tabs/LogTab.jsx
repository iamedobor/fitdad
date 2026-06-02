import { CheckCircle2, Droplets } from 'lucide-react';
import { Card } from '../ui/Card.jsx';
import { ProgressBar } from '../ui/ProgressBar.jsx';
import { useApp } from '../../context/AppContext.jsx';

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export function LogTab() {
  const { log, setLog, settings, getWorkouts, todayKey } = useApp();
  const todayName = DAY_NAMES[new Date().getDay()];
  const today = log[todayKey] || {};
  const workouts = getWorkouts();
  const workout = workouts.find((w) => w.day === todayName);
  const sh = settings?.windowStart ?? 12;
  const eh = settings?.windowEnd ?? 20;

  const toggle = (field) => {
    const u = { ...log, [todayKey]: { ...today, [field]: !today[field] } };
    setLog(u);
  };

  const setWater = (n) => {
    const u = { ...log, [todayKey]: { ...today, water: n === today.water ? n - 1 : n } };
    setLog(u);
  };

  const items = [
    { f: 'fasting', l: 'Respected fasting window', s: `No food before ${sh}:00 or after ${eh}:00` },
    { f: 'meal1', l: 'Ate Meal 1', s: `${sh}:00 - first meal of the day` },
    { f: 'snack', l: 'Had snack', s: '3:30pm - protein and healthy fat' },
    { f: 'meal2', l: 'Ate Meal 2', s: `${eh - 1}:00pm - final meal` },
    { f: 'workout', l: workout ? `Completed ${workout.type}` : 'Rest day movement', s: workout ? `${workout.exercises.length} exercises completed` : 'Walk, stretch, or light movement' },
  ];

  const done = items.filter((i) => today[i.f]).length;

  return (
    <div className="fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: 20, fontWeight: 600 }}>Daily log</div>
          <div style={{ fontSize: 12, color: 'var(--text2)', marginTop: 2 }}>
            {new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 28, fontWeight: 700, color: done === 5 ? 'var(--green)' : 'var(--text)' }}>{done}/5</div>
          <div style={{ fontSize: 10, color: 'var(--text2)' }}>complete</div>
        </div>
      </div>

      <ProgressBar value={done / 5} color={done === 5 ? 'var(--green)' : 'var(--accent)'} />

      <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 'var(--r2)', padding: '10px 13px', fontSize: 11, color: 'var(--text2)', lineHeight: 1.6 }}>
        Meals and workout sync automatically from the Home and Train tabs. The fasting window is the one you set manually each day — did you actually stick to it?
      </div>

      {items.map((item) => (
        <div
          key={item.f}
          onClick={() => toggle(item.f)}
          style={{
            display: 'flex',
            gap: 11,
            alignItems: 'center',
            padding: '12px 14px',
            cursor: 'pointer',
            background: today[item.f] ? 'rgba(34,201,122,0.07)' : 'var(--bg2)',
            border: `1px solid ${today[item.f] ? 'rgba(34,201,122,0.22)' : 'var(--border)'}`,
            borderRadius: 'var(--r)',
            transition: 'all 0.2s',
          }}
        >
          <CheckCircle2
            size={22}
            color={today[item.f] ? 'var(--green)' : 'var(--text2)'}
            strokeWidth={today[item.f] ? 2.5 : 1.5}
            style={{ flexShrink: 0 }}
          />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 500, color: today[item.f] ? 'var(--green)' : 'var(--text)' }}>{item.l}</div>
            <div style={{ fontSize: 11, color: 'var(--text2)', marginTop: 1 }}>{item.s}</div>
          </div>
        </div>
      ))}

      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 500 }}>
            <Droplets size={14} color="var(--accent)" /> Water
          </div>
          <div style={{ fontSize: 12, color: 'var(--text2)' }}>{today.water || 0}/8</div>
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <button
              key={n}
              onClick={() => setWater(n)}
              aria-label={`${n} glass${n > 1 ? 'es' : ''}`}
              style={{ flex: 1, height: 30, borderRadius: 'var(--r3)', background: (today.water || 0) >= n ? 'rgba(230,57,70,0.2)' : 'var(--bg3)', border: `1px solid ${(today.water || 0) >= n ? 'rgba(230,57,70,0.4)' : 'var(--border)'}`, cursor: 'pointer' }}
            />
          ))}
        </div>
      </Card>

      {done === 5 && (
        <div style={{ background: 'rgba(34,201,122,0.08)', border: '1px solid rgba(34,201,122,0.25)', borderRadius: 'var(--r)', padding: '16px', textAlign: 'center' }}>
          <div style={{ fontWeight: 600, color: 'var(--green)', fontSize: 15 }}>Perfect day. Every task complete.</div>
          <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 5 }}>Streak keeps growing.</div>
        </div>
      )}
    </div>
  );
}
