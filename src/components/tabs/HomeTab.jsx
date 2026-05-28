import { ChevronRight, Droplets, CheckCircle2, Flame } from 'lucide-react';
import { Card } from '../ui/Card.jsx';
import { ProgressBar } from '../ui/ProgressBar.jsx';
import { useApp } from '../../context/AppContext.jsx';
import { useTick } from '../../hooks/useTick.js';
import { getFastingState } from '../../utils/fasting.js';
import { calcTDEE, calcDailyTarget } from '../../utils/tdee.js';

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export function HomeTab({ setTab }) {
  useTick();
  const { log, setLog, settings, streak, getMealsForDay, getWorkouts, todayKey, profile } = useApp();
  const todayName = DAY_NAMES[new Date().getDay()];
  const f = getFastingState(settings);
  const today = log[todayKey] || {};
  const meals = getMealsForDay(todayName);
  const workouts = getWorkouts();
  const workout = workouts.find((w) => w.day === todayName);
  const done = ['meal1', 'snack', 'meal2', 'workout', 'fasting'].filter((k) => today[k]).length;

  const tdee = calcTDEE(profile);
  const dailyTarget = settings?.customCalorieTarget || calcDailyTarget(tdee, 'moderate');
  const eatenKcal = meals
    ? (today.meal1 ? meals.meal1?.kcal || 0 : 0) +
      (today.snack ? meals.snack?.kcal || 0 : 0) +
      (today.meal2 ? meals.meal2?.kcal || 0 : 0)
    : 0;
  const calorieProgress = dailyTarget ? Math.min(eatenKcal / dailyTarget, 1) : 0;
  const hr = new Date().getHours();
  const greeting = hr < 12 ? 'Good morning' : hr < 17 ? 'Good afternoon' : 'Good evening';
  const namePart = profile?.name ? `, ${profile.name}` : '';

  const toggle = (field) => {
    const u = { ...log, [todayKey]: { ...today, [field]: !today[field] } };
    setLog(u);
  };

  const setWater = (n) => {
    const u = { ...log, [todayKey]: { ...today, water: n === today.water ? n - 1 : n } };
    setLog(u);
  };

  return (
    <div className="fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 600 }}>{greeting}{namePart}</div>
          <div style={{ fontSize: 12, color: 'var(--text2)', marginTop: 2 }}>
            {new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}
          </div>
        </div>
        {streak > 0 && (
          <div style={{ background: 'rgba(245,166,35,0.15)', border: '1px solid rgba(245,166,35,0.3)', borderRadius: 20, padding: '4px 10px', fontSize: 13, fontWeight: 500, color: 'var(--amber)' }}>
            {streak} day{streak > 1 ? 's' : ''} streak
          </div>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
        {[
          { label: 'Today', value: `${done}/5` },
          { label: 'Window', value: f.isOpen ? 'Open' : 'Fasting' },
          { label: 'Streak', value: `${streak}d` },
        ].map((s) => (
          <div key={s.label} style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 'var(--r2)', padding: '10px 6px', textAlign: 'center' }}>
            <div style={{ fontSize: 18, fontWeight: 600, color: 'var(--text)', margin: '4px 0 2px' }}>{s.value}</div>
            <div style={{ fontSize: 10, color: 'var(--text3)' }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div
        onClick={() => setTab('fasting')}
        style={{
          background: f.isOpen ? 'rgba(34,201,122,0.07)' : 'rgba(230,57,70,0.07)',
          border: `1px solid ${f.isOpen ? 'rgba(34,201,122,0.2)' : 'rgba(230,57,70,0.2)'}`,
          borderRadius: 'var(--r)',
          padding: '13px 15px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          cursor: 'pointer',
        }}
      >
        <div>
          <div style={{ fontSize: 13, fontWeight: 500, color: f.isOpen ? 'var(--green)' : 'var(--accent)' }}>
            {f.isOpen ? 'Eating window open' : 'Fasting'}
          </div>
          <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 2 }}>
            {f.isOpen ? `Closes at ${f.windowEnd}:00` : `Opens at ${f.windowStart}:00`} - tap for timer
          </div>
        </div>
        <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 22, fontWeight: 600, letterSpacing: 1, color: f.isOpen ? 'var(--green)' : 'var(--accent)' }}>
          {f.display}
        </div>
      </div>

      {workout ? (
        <Card style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }} onClick={() => setTab('train')}>
          <div>
            <div style={{ fontSize: 11, color: 'var(--text3)', marginBottom: 3, fontWeight: 500 }}>TODAY</div>
            <div style={{ fontWeight: 500, fontSize: 14 }}>{workout.type}</div>
            <div style={{ fontSize: 11, color: 'var(--text2)', marginTop: 2 }}>{workout.exercises.length} exercises</div>
          </div>
          <div style={{ display: 'flex', gap: 7, alignItems: 'center' }}>
            {today.workout && (
              <span style={{ fontSize: 11, background: 'rgba(34,201,122,0.15)', color: 'var(--green)', padding: '3px 9px', borderRadius: 20, fontWeight: 500 }}>
                Done
              </span>
            )}
            <ChevronRight size={16} color="var(--text3)" />
          </div>
        </Card>
      ) : (
        <Card style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 13, fontWeight: 500 }}>Rest day</div>
          <div style={{ fontSize: 11, color: 'var(--text2)', marginTop: 4 }}>Aim for 7,000+ steps and a light stretch.</div>
        </Card>
      )}

      {meals && (
        <Card>
          <div style={{ fontSize: 11, color: 'var(--text2)', marginBottom: 8, fontWeight: 500 }}>TODAY&apos;S MEALS</div>
          {[
            { t: `${f.windowStart}:00`, l: 'Meal 1', d: meals.meal1, f: 'meal1' },
            { t: '3:30pm', l: 'Snack', d: meals.snack, f: 'snack' },
            { t: `${f.windowEnd - 1}:00pm`, l: 'Meal 2', d: meals.meal2, f: 'meal2' },
          ].map((m, i) => (
            <div
              key={m.f}
              onClick={() => toggle(m.f)}
              style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '8px 0', cursor: 'pointer', borderTop: i > 0 ? '1px solid var(--border)' : 'none' }}
            >
              <CheckCircle2 size={18} color={today[m.f] ? 'var(--green)' : 'var(--text2)'} strokeWidth={today[m.f] ? 2.5 : 1.5} style={{ flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, color: today[m.f] ? 'var(--text3)' : 'var(--text)', textDecoration: today[m.f] ? 'line-through' : 'none', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {m.d?.name}
                </div>
                <div style={{ fontSize: 10, color: 'var(--text3)' }}>{m.l} - {m.t}</div>
              </div>
            </div>
          ))}
        </Card>
      )}

      {dailyTarget && (
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 500 }}>
              <Flame size={14} color="var(--accent)" /> Calories
            </div>
            <div style={{ fontSize: 12, color: 'var(--text2)' }}>
              {eatenKcal} <span style={{ color: 'var(--text3)' }}>/ {dailyTarget} kcal</span>
            </div>
          </div>
          <ProgressBar
            value={calorieProgress}
            color={calorieProgress >= 1 ? 'var(--amber)' : 'var(--accent)'}
          />
          <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 6 }}>
            {dailyTarget - eatenKcal > 0
              ? `${dailyTarget - eatenKcal} kcal remaining`
              : 'Daily target reached'}
          </div>
        </Card>
      )}

      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 500 }}>
            <Droplets size={14} color="var(--accent)" /> Water
          </div>
          <div style={{ fontSize: 12, color: 'var(--text2)' }}>{today.water || 0}/8 glasses</div>
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <button
              key={n}
              onClick={() => setWater(n)}
              aria-label={`${n} glass${n > 1 ? 'es' : ''}`}
              style={{ flex: 1, height: 26, borderRadius: 'var(--r3)', background: (today.water || 0) >= n ? 'rgba(230,57,70,0.2)' : 'var(--bg3)', border: `1px solid ${(today.water || 0) >= n ? 'rgba(230,57,70,0.4)' : 'var(--border)'}`, cursor: 'pointer' }}
            />
          ))}
        </div>
      </Card>

      {done === 5 && (
        <div style={{ background: 'rgba(34,201,122,0.08)', border: '1px solid rgba(34,201,122,0.25)', borderRadius: 'var(--r)', padding: '14px', textAlign: 'center' }}>
          <div style={{ fontWeight: 600, color: 'var(--green)', fontSize: 15, marginBottom: 4 }}>Perfect day. Every task complete.</div>
          <div style={{ fontSize: 12, color: 'var(--text3)' }}>Your streak keeps growing.</div>
        </div>
      )}
    </div>
  );
}
