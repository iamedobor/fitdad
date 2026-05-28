import { useState } from 'react';
import { useApp } from '../../context/AppContext.jsx';
import { Card } from '../ui/Card.jsx';
import { calcBMI, calcTDEE, calcDailyTarget, calcWeeksToGoal } from '../../utils/tdee.js';

const PACE_OPTIONS = [
  { id: 'gradual', label: 'Gradual', deficit: 250, sub: '~0.25 kg/week' },
  { id: 'moderate', label: 'Moderate', deficit: 500, sub: '~0.5 kg/week' },
  { id: 'aggressive', label: 'Aggressive', deficit: 750, sub: '~0.75 kg/week' },
];

export function ProgressView() {
  const { progress, setProgress, settings, profile, todayKey } = useApp();
  const [w, setW] = useState('');
  const [c, setC] = useState('');
  const [note, setNote] = useState('');
  const [pace, setPace] = useState('moderate');

  const save = () => {
    if (!w && !c) return;
    const entry = {
      date: todayKey,
      label: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
      weight: w ? parseFloat(w) : null,
      waist: c ? parseFloat(c) : null,
      note,
    };
    setProgress([...progress, entry]);
    setW(''); setC(''); setNote('');
  };

  const latest = progress[progress.length - 1];
  const first = progress[0];
  const weightDelta = latest && first && latest !== first && latest.weight && first.weight
    ? +(latest.weight - first.weight).toFixed(1) : null;
  const waistDelta = latest && first && latest !== first && latest.waist && first.waist
    ? +(latest.waist - first.waist).toFixed(1) : null;
  const gw = settings?.goalWeight;
  const gc = settings?.goalWaist;

  const currentWeight = latest?.weight || profile?.startWeight;
  const bmi = calcBMI(currentWeight, profile?.heightCm);
  const tdee = calcTDEE(profile);
  const dailyTarget = calcDailyTarget(tdee, pace);
  const weeksToGoal = calcWeeksToGoal(currentWeight, gw, dailyTarget ? tdee - dailyTarget : null);
  const weightPts = progress.filter((p) => p.weight);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

      {/* BMI + TDEE cards */}
      {(bmi || tdee) && (
        <div style={{ display: 'grid', gridTemplateColumns: bmi && tdee ? '1fr 1fr' : '1fr', gap: 10 }}>
          {bmi && (
            <Card style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 10, color: 'var(--text3)', marginBottom: 4, fontWeight: 500 }}>BMI</div>
              <div style={{ fontSize: 26, fontWeight: 700, color: bmi.color }}>{bmi.value}</div>
              <div style={{ fontSize: 11, color: bmi.color, marginTop: 3, fontWeight: 500 }}>{bmi.category}</div>
            </Card>
          )}
          {tdee && (
            <Card style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 10, color: 'var(--text3)', marginBottom: 4, fontWeight: 500 }}>TDEE</div>
              <div style={{ fontSize: 26, fontWeight: 700 }}>{tdee.toLocaleString()}</div>
              <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 3 }}>kcal/day to maintain</div>
            </Card>
          )}
        </div>
      )}

      {/* Daily calorie target */}
      {tdee && (
        <Card>
          <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 10 }}>Daily calorie target</div>
          <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
            {PACE_OPTIONS.map((p) => (
              <button
                key={p.id}
                onClick={() => setPace(p.id)}
                style={{ flex: 1, padding: '7px 4px', borderRadius: 'var(--r2)', fontSize: 11, fontWeight: 500, cursor: 'pointer', background: pace === p.id ? 'var(--accent)' : 'var(--bg3)', color: pace === p.id ? 'white' : 'var(--text2)', border: `1px solid ${pace === p.id ? 'var(--accent)' : 'var(--border)'}` }}
              >
                {p.label}
              </button>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div style={{ background: 'var(--bg3)', borderRadius: 'var(--r2)', padding: '10px', textAlign: 'center' }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--accent)' }}>{dailyTarget?.toLocaleString()}</div>
              <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 2 }}>kcal target/day</div>
            </div>
            <div style={{ background: 'var(--bg3)', borderRadius: 'var(--r2)', padding: '10px', textAlign: 'center' }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--green)' }}>{weeksToGoal ?? '—'}</div>
              <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 2 }}>weeks to goal</div>
            </div>
          </div>
          <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 10, lineHeight: 1.5 }}>
            {PACE_OPTIONS.find((p) => p.id === pace)?.sub} deficit. Based on your profile and Mifflin-St Jeor formula.
          </div>
        </Card>
      )}

      {!profile?.heightCm && (
        <div style={{ background: 'rgba(230,57,70,0.07)', border: '1px solid rgba(230,57,70,0.2)', borderRadius: 'var(--r)', padding: '12px 14px', fontSize: 13, color: 'var(--text2)' }}>
          Complete your profile in Settings to see BMI and calorie targets.
        </div>
      )}

      {/* Weight and waist current readings */}
      {progress.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {latest?.weight && (
            <Card style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 10, color: 'var(--text3)', marginBottom: 4, fontWeight: 500 }}>WEIGHT</div>
              <div style={{ fontSize: 26, fontWeight: 700 }}>{latest.weight}<span style={{ fontSize: 13, color: 'var(--text3)', fontWeight: 400 }}> kg</span></div>
              {weightDelta !== null && (
                <div style={{ fontSize: 12, color: weightDelta < 0 ? 'var(--green)' : 'var(--red)', marginTop: 3, fontWeight: 500 }}>
                  {weightDelta < 0 ? '-' : '+'}{Math.abs(weightDelta)} kg since start
                </div>
              )}
              {gw && (
                <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 5 }}>
                  {latest.weight > gw ? `${(latest.weight - gw).toFixed(1)} kg to goal` : 'Goal reached'}
                </div>
              )}
            </Card>
          )}
          {latest?.waist && (
            <Card style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 10, color: 'var(--text3)', marginBottom: 4, fontWeight: 500 }}>WAIST</div>
              <div style={{ fontSize: 26, fontWeight: 700 }}>{latest.waist}<span style={{ fontSize: 13, color: 'var(--text3)', fontWeight: 400 }}> cm</span></div>
              {waistDelta !== null && (
                <div style={{ fontSize: 12, color: waistDelta < 0 ? 'var(--green)' : 'var(--red)', marginTop: 3, fontWeight: 500 }}>
                  {waistDelta < 0 ? '-' : '+'}{Math.abs(waistDelta)} cm since start
                </div>
              )}
              {gc && (
                <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 5 }}>
                  {latest.waist > gc ? `${(latest.waist - gc).toFixed(1)} cm to goal` : 'Goal reached'}
                </div>
              )}
            </Card>
          )}
        </div>
      )}

      {/* Weight trend chart */}
      {weightPts.length >= 3 && (() => {
        const minV = Math.min(...weightPts.map((p) => p.weight)) - 0.5;
        const maxV = Math.max(...weightPts.map((p) => p.weight)) + 0.5;
        const W = 280, H = 60;
        const px = (i) => i / (weightPts.length - 1) * W;
        const py = (v) => H - (v - minV) / (maxV - minV) * H;
        const pathD = weightPts.map((p, i) => `${i === 0 ? 'M' : 'L'}${px(i).toFixed(1)},${py(p.weight).toFixed(1)}`).join(' ');
        const areaD = pathD + ` L${W},${H} L0,${H} Z`;
        return (
          <Card>
            <div style={{ fontSize: 10, color: 'var(--text3)', marginBottom: 10, fontWeight: 500 }}>WEIGHT TREND</div>
            <svg width="100%" viewBox={`0 0 ${W} ${H + 4}`} style={{ overflow: 'visible' }}>
              <defs>
                <linearGradient id="wg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--accent)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="var(--accent)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <path d={areaD} fill="url(#wg)" />
              <path d={pathD} fill="none" stroke="var(--accent)" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
              {weightPts.map((p, i) => <circle key={i} cx={px(i)} cy={py(p.weight)} r={3} fill="var(--accent)" />)}
              <text x={px(0)} y={H + 14} textAnchor="middle" fontSize={9} fill="rgba(255,255,255,0.4)" fontFamily="DM Sans">{weightPts[0].label}</text>
              {weightPts.length > 1 && (
                <text x={px(weightPts.length - 1)} y={H + 14} textAnchor="middle" fontSize={9} fill="rgba(255,255,255,0.4)" fontFamily="DM Sans">{weightPts[weightPts.length - 1].label}</text>
              )}
            </svg>
          </Card>
        );
      })()}

      {/* Log entry form */}
      <Card>
        <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 10 }}>Log this week</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 8 }}>
          <div>
            <label style={{ fontSize: 10, color: 'var(--text3)', display: 'block', marginBottom: 4 }}>Weight (kg)</label>
            <input type="number" step="0.1" value={w} onChange={(e) => setW(e.target.value)} placeholder="e.g. 88.5" />
          </div>
          <div>
            <label style={{ fontSize: 10, color: 'var(--text3)', display: 'block', marginBottom: 4 }}>Waist (cm)</label>
            <input type="number" step="0.5" value={c} onChange={(e) => setC(e.target.value)} placeholder="e.g. 96" />
          </div>
        </div>
        <input type="text" value={note} onChange={(e) => setNote(e.target.value)} placeholder="How are you feeling this week?" style={{ marginBottom: 8 }} />
        <button onClick={save} style={{ width: '100%', padding: '10px', borderRadius: 'var(--r2)', background: 'var(--accent)', color: 'white', border: 'none', fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>
          Save entry
        </button>
      </Card>

      {/* History */}
      {progress.length > 0 && (
        <div>
          <div style={{ fontSize: 10, color: 'var(--text3)', marginBottom: 8, fontWeight: 500, letterSpacing: 0.5 }}>HISTORY</div>
          {[...progress].reverse().map((e, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 0', borderTop: '1px solid var(--border)' }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 500 }}>{e.label}</div>
                {e.note && <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 1 }}>{e.note}</div>}
              </div>
              <div style={{ fontSize: 12, color: 'var(--text2)', textAlign: 'right' }}>
                {e.weight && <span style={{ marginRight: 10 }}>{e.weight} kg</span>}
                {e.waist && <span>{e.waist} cm</span>}
              </div>
            </div>
          ))}
        </div>
      )}

      {progress.length === 0 && (
        <div style={{ textAlign: 'center', padding: '2rem 0', color: 'var(--text3)' }}>
          <div style={{ fontSize: 13 }}>Log your first measurements above to start tracking progress.</div>
        </div>
      )}
    </div>
  );
}
