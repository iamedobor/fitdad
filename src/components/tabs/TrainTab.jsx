import { useState } from 'react';
import { ChevronDown, ChevronUp, Pencil } from 'lucide-react';
import { Card } from '../ui/Card.jsx';
import { useApp } from '../../context/AppContext.jsx';

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const DAYS_ORDER = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export function TrainTab({ onEditWorkout }) {
  const [open, setOpen] = useState(null);
  const { log, setLog, getWorkouts, todayKey } = useApp();
  const todayName = DAY_NAMES[new Date().getDay()];
  const today = log[todayKey] || {};
  const workouts = getWorkouts();

  const toggleDone = () => {
    const u = { ...log, [todayKey]: { ...today, workout: !today.workout } };
    setLog(u);
  };

  const schedule = DAYS_ORDER.map((day) => ({
    day,
    workout: workouts.find((w) => w.day === day) || null,
  }));

  const restDays = schedule.filter((s) => !s.workout).map((s) => s.day);

  return (
    <div className="fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div>
        <div style={{ fontSize: 20, fontWeight: 600 }}>Workout plan</div>
        <div style={{ fontSize: 12, color: 'var(--text2)', marginTop: 2 }}>
          {workouts.length} training {workouts.length === 1 ? 'day' : 'days'} per week - tap a day to expand
        </div>
      </div>

      {schedule.map(({ day, workout: w }) => {
        const isToday = day === todayName;
        const isOpen = open === day;

        if (!w) {
          return (
            <div
              key={day}
              style={{
                background: 'var(--bg2)',
                border: `1px solid ${isToday ? 'rgba(255,255,255,0.12)' : 'var(--border)'}`,
                borderRadius: 'var(--r)',
                padding: '12px 15px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                opacity: 0.6,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
                <div style={{ width: 4, height: 36, borderRadius: 2, background: 'var(--bg4)', flexShrink: 0 }} />
                <div>
                  <div style={{ fontWeight: 500, fontSize: 14, color: isToday ? 'var(--text)' : 'var(--text2)' }}>{day}</div>
                  <div style={{ fontSize: 11, color: 'var(--text2)', marginTop: 2 }}>Rest day</div>
                </div>
              </div>
              {isToday && <span style={{ fontSize: 10, background: 'var(--bg3)', color: 'var(--text2)', padding: '2px 8px', borderRadius: 20, border: '1px solid var(--border)' }}>Today</span>}
            </div>
          );
        }

        return (
          <div
            key={day}
            style={{ background: 'var(--bg2)', border: `1px solid ${isToday ? w.accent + '55' : 'var(--border)'}`, borderRadius: 'var(--r)', overflow: 'hidden' }}
          >
            <button
              onClick={() => setOpen(isOpen ? null : day)}
              style={{ width: '100%', padding: '13px 15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
                <div style={{ width: 4, height: 36, borderRadius: 2, background: w.accent, flexShrink: 0 }} />
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                    <span style={{ fontWeight: 500, fontSize: 14, color: 'var(--text)' }}>{day}</span>
                    {isToday && <span style={{ fontSize: 10, background: w.accent + '22', color: w.accent, padding: '2px 8px', borderRadius: 20 }}>Today</span>}
                    {isToday && today.workout && <span style={{ fontSize: 10, background: 'rgba(34,201,122,0.15)', color: 'var(--green)', padding: '2px 8px', borderRadius: 20 }}>Done</span>}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text2)', marginTop: 2 }}>{w.type} - {w.exercises.length} exercises</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {onEditWorkout && (
                  <span
                    onClick={(e) => { e.stopPropagation(); onEditWorkout(w); }}
                    role="button"
                    aria-label={`Edit ${day} workout`}
                    style={{ padding: 4, borderRadius: 6, background: 'var(--bg3)', border: '1px solid var(--border2)', display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                  >
                    <Pencil size={11} color="var(--text2)" />
                  </span>
                )}
                {isOpen ? <ChevronUp size={14} color="var(--text2)" /> : <ChevronDown size={14} color="var(--text2)" />}
              </div>
            </button>

            {isOpen && (
              <div style={{ borderTop: '1px solid var(--border)', padding: '4px 15px 14px' }}>
                {w.exercises.map((ex, i) => (
                  <div key={i} style={{ padding: '9px 0', borderTop: i > 0 ? '1px solid var(--border)' : 'none' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 3 }}>
                      <span style={{ fontWeight: 500, fontSize: 13 }}>{ex.name}</span>
                      <span style={{ fontSize: 11, color: 'var(--text2)', fontFamily: 'DM Mono, monospace' }}>
                        {ex.sets}x{ex.reps} - {ex.rest}
                      </span>
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text2)', marginBottom: 2 }}>Home: {ex.homeAlt}</div>
                    <div style={{ fontSize: 11, color: w.accent + 'bb', fontStyle: 'italic' }}>{ex.tip}</div>
                  </div>
                ))}
                {isToday && (
                  <button
                    onClick={toggleDone}
                    style={{ width: '100%', marginTop: 12, padding: '10px', borderRadius: 'var(--r2)', cursor: 'pointer', fontWeight: 500, fontSize: 13, background: today.workout ? 'rgba(34,201,122,0.1)' : 'rgba(230,57,70,0.1)', border: `1px solid ${today.workout ? 'rgba(34,201,122,0.35)' : 'rgba(230,57,70,0.35)'}`, color: today.workout ? 'var(--green)' : 'var(--accent)' }}
                  >
                    {today.workout ? 'Session complete' : 'Mark session as done'}
                  </button>
                )}
              </div>
            )}
          </div>
        );
      })}

      <Card style={{ textAlign: 'center', padding: '12px 14px' }}>
        <div style={{ fontSize: 12, fontWeight: 500, marginBottom: 3 }}>
          Rest {restDays.length === 1 ? 'day' : 'days'}: {restDays.join(', ')}
        </div>
        <div style={{ fontSize: 11, color: 'var(--text2)', marginTop: 2 }}>Light walks encouraged - 7,000+ steps</div>
        <div style={{ fontSize: 11, color: 'var(--text2)', marginTop: 3 }}>Use the edit button on any workout to move it to a different day.</div>
      </Card>
    </div>
  );
}
