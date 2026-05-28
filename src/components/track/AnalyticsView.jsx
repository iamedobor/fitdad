import { useApp } from '../../context/AppContext.jsx';
import { Card } from '../ui/Card.jsx';

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const DAY_SHORT = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

function getLast7Days() {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push({
      key: d.toISOString().split('T')[0],
      dayName: DAY_NAMES[d.getDay()],
      shortName: DAY_SHORT[d.getDay()],
    });
  }
  return days;
}

export function AnalyticsView() {
  const { log, getMealsForDay, getWorkouts } = useApp();

  const days7 = getLast7Days();
  const workouts = getWorkouts();
  const workoutDays = new Set(workouts.map((w) => w.day));

  const dailyData = days7.map(({ key, dayName, shortName }) => {
    const entry = log[key] || {};
    const meals = getMealsForDay(dayName);

    const protein = (entry.meal1 ? meals.meal1?.protein || 0 : 0)
      + (entry.snack ? meals.snack?.protein || 0 : 0)
      + (entry.meal2 ? meals.meal2?.protein || 0 : 0);

    const carbs = (entry.meal1 ? meals.meal1?.carbs || 0 : 0)
      + (entry.snack ? meals.snack?.carbs || 0 : 0)
      + (entry.meal2 ? meals.meal2?.carbs || 0 : 0);

    const kcal = (entry.meal1 ? meals.meal1?.kcal || 0 : 0)
      + (entry.snack ? meals.snack?.kcal || 0 : 0)
      + (entry.meal2 ? meals.meal2?.kcal || 0 : 0);

    const isWorkoutDay = workoutDays.has(dayName);
    const tasksTotal = isWorkoutDay ? 5 : 4;
    const tasksDone = ['meal1', 'snack', 'meal2', 'fasting'].filter((k) => entry[k]).length
      + (isWorkoutDay && entry.workout ? 1 : 0);

    return {
      key, shortName, dayName,
      protein, carbs, kcal,
      water: entry.water || 0,
      workout: entry.workout || false,
      fasting: entry.fasting || false,
      tasksDone,
      tasksTotal,
      compliance: tasksDone / tasksTotal,
    };
  });

  const maxProtein = Math.max(...dailyData.map((d) => d.protein), 10);
  const fastingDays = dailyData.filter((d) => d.fasting).length;
  const workoutScheduledDays = dailyData.filter((d) => workoutDays.has(d.dayName)).length;
  const workoutDoneDays = dailyData.filter((d) => workoutDays.has(d.dayName) && d.workout).length;
  const avgWater = dailyData.reduce((a, d) => a + d.water, 0) / 7;
  const avgProtein = Math.round(dailyData.reduce((a, d) => a + d.protein, 0) / 7);
  const avgKcal = Math.round(dailyData.reduce((a, d) => a + d.kcal, 0) / 7);
  const hasAnyData = dailyData.some((d) => d.tasksDone > 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

      {/* 7-day compliance bars */}
      <Card>
        <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 12 }}>7-day habit compliance</div>
        <div style={{ display: 'flex', gap: 4, alignItems: 'flex-end', height: 64 }}>
          {dailyData.map((d) => {
            const color = d.compliance >= 1 ? 'var(--green)' : d.compliance >= 0.6 ? 'var(--amber)' : d.compliance > 0 ? 'var(--accent)' : 'var(--bg4)';
            const barH = d.compliance > 0 ? Math.max(d.compliance * 48, 5) : 2;
            return (
              <div key={d.key} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
                <div style={{ width: '100%', height: barH, background: color, borderRadius: 3, alignSelf: 'flex-end', transition: 'height 0.4s' }} />
                <div style={{ fontSize: 9, color: 'var(--text2)' }}>{d.shortName}</div>
              </div>
            );
          })}
        </div>
        <div style={{ display: 'flex', gap: 12, marginTop: 10, fontSize: 10, color: 'var(--text2)' }}>
          {[['var(--green)', 'All done'], ['var(--amber)', 'Partial'], ['var(--accent)', 'Low']].map(([c, l]) => (
            <span key={l} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: 2, background: c }} />{l}
            </span>
          ))}
        </div>
      </Card>

      {/* Weekly averages */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
        {[
          { value: `${avgProtein}g`, label: 'avg protein/day', color: 'var(--blue)' },
          { value: avgWater.toFixed(1), label: 'avg glasses/day', color: 'var(--blue)' },
          { value: `${fastingDays}/7`, label: 'fasting days', color: fastingDays >= 5 ? 'var(--green)' : 'var(--amber)' },
        ].map((s) => (
          <Card key={s.label} style={{ textAlign: 'center', padding: '10px 6px' }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 9, color: 'var(--text2)', marginTop: 3 }}>{s.label}</div>
          </Card>
        ))}
      </div>

      {/* Protein trend */}
      <Card>
        <div style={{ fontSize: 11, color: 'var(--text2)', marginBottom: 10, fontWeight: 500 }}>PROTEIN INTAKE (7 days)</div>
        <svg width="100%" viewBox="0 0 280 64" style={{ overflow: 'visible' }}>
          <defs>
            <linearGradient id="pg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--blue)" stopOpacity={0.3} />
              <stop offset="100%" stopColor="var(--blue)" stopOpacity={0} />
            </linearGradient>
          </defs>
          {(() => {
            const W = 280, H = 50;
            const pts = dailyData.map((d, i) => ({
              x: (i / 6) * W,
              y: H - (d.protein / maxProtein) * H,
              protein: d.protein,
              label: d.shortName,
            }));
            const pathD = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
            const areaD = `${pathD} L${W},${H} L0,${H} Z`;
            return (
              <>
                <path d={areaD} fill="url(#pg)" />
                <path d={pathD} fill="none" stroke="var(--blue)" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                {pts.map((p, i) => (
                  <g key={i}>
                    <circle cx={p.x} cy={p.y} r={3} fill="var(--blue)" />
                    <text x={p.x} y={H + 14} textAnchor="middle" fontSize={9} fill="rgba(255,255,255,0.45)" fontFamily="DM Sans">{p.label}</text>
                  </g>
                ))}
              </>
            );
          })()}
        </svg>
      </Card>

      {/* Water intake */}
      <Card>
        <div style={{ fontSize: 11, color: 'var(--text2)', marginBottom: 10, fontWeight: 500 }}>WATER INTAKE (7 days)</div>
        <div style={{ display: 'flex', gap: 4, alignItems: 'flex-end', height: 56 }}>
          {dailyData.map((d) => (
            <div key={d.key} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              {d.water > 0 && <div style={{ fontSize: 9, color: 'var(--blue)', fontWeight: 600 }}>{d.water}</div>}
              <div style={{
                width: '100%',
                height: Math.max((d.water / 8) * 36, d.water > 0 ? 4 : 2),
                background: d.water >= 8 ? 'var(--green)' : 'rgba(77,166,255,0.7)',
                borderRadius: 3,
                alignSelf: 'flex-end',
              }} />
              <div style={{ fontSize: 9, color: 'var(--text2)' }}>{d.shortName}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* Workout + fasting stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        <Card style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 10, color: 'var(--text2)', marginBottom: 6, fontWeight: 500 }}>WORKOUTS</div>
          <div style={{ fontSize: 28, fontWeight: 700, color: workoutDoneDays === workoutScheduledDays && workoutScheduledDays > 0 ? 'var(--green)' : 'var(--text)' }}>
            {workoutDoneDays}
            <span style={{ fontSize: 14, color: 'var(--text3)', fontWeight: 400 }}>/{workoutScheduledDays}</span>
          </div>
          <div style={{ fontSize: 10, color: 'var(--text2)', marginTop: 3 }}>sessions this week</div>
        </Card>
        <Card style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 10, color: 'var(--text2)', marginBottom: 6, fontWeight: 500 }}>CALORIES</div>
          <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--accent)' }}>{avgKcal > 0 ? avgKcal.toLocaleString() : '—'}</div>
          <div style={{ fontSize: 10, color: 'var(--text2)', marginTop: 3 }}>avg kcal/day</div>
        </Card>
      </div>

      {!hasAnyData && (
        <div style={{ textAlign: 'center', padding: '2rem 0', color: 'var(--text3)' }}>
          <div style={{ fontSize: 13 }}>Start ticking off daily habits to see your analytics here.</div>
        </div>
      )}
    </div>
  );
}
