import { useState } from 'react';
import { RotateCcw, Pencil } from 'lucide-react';
import { InfoTooltip } from '../ui/InfoTooltip.jsx';
import { Card } from '../ui/Card.jsx';
import { SubNav } from '../ui/SubNav.jsx';
import { ProgressBar } from '../ui/ProgressBar.jsx';
import { useApp } from '../../context/AppContext.jsx';
import { DEFAULT_SHOPPING, CATEGORY_LABELS } from '../../data/defaultShopping.js';
import { PREP_STEPS } from '../../data/prepSteps.js';
import { useLocalStorage } from '../../hooks/useLocalStorage.js';
import { KEYS } from '../../utils/storage.js';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const MACROS = [
  { key: 'protein', label: 'Protein', color: 'var(--blue)' },
  { key: 'carbs', label: 'Carbs', color: 'var(--amber)' },
  { key: 'fat', label: 'Fat', color: 'var(--green)' },
];

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const todayName = DAY_NAMES[new Date().getDay()];

export function MealsTab({ onEditMeal }) {
  const { settings, getMealsForDay } = useApp();
  const [view, setView] = useState('plan');
  const [day, setDay] = useState(todayName || 'Monday');
  const [checked, setChecked] = useLocalStorage(KEYS.SHOPPING, {});

  const meals = getMealsForDay(day);
  const tot = meals ? meals.meal1.kcal + meals.snack.kcal + meals.meal2.kcal : 0;
  const totp = meals ? meals.meal1.protein + meals.snack.protein + meals.meal2.protein : 0;
  const totalItems = Object.values(DEFAULT_SHOPPING).reduce((a, arr) => a + arr.length, 0);
  const totalChecked = Object.values(checked).filter(Boolean).length;

  const toggleCheck = (cat, idx) => {
    const key = `${cat}-${idx}`;
    setChecked({ ...checked, [key]: !checked[key] });
  };

  const sh = settings?.windowStart ?? 12;
  const eh = settings?.windowEnd ?? 20;

  const navOptions = [
    { id: 'plan', label: 'Meal Plan' },
    { id: 'prep', label: 'Prep Guide' },
    { id: 'shopping', label: totalChecked > 0 ? `Shopping (${totalChecked})` : 'Shopping' },
  ];

  return (
    <div className="fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ fontSize: 20, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 7 }}>
        Meals
        <InfoTooltip text="Macros are the three main nutrients: Protein builds and preserves muscle. Carbs provide energy. Fat supports hormones and satiety. On a fat loss plan, high protein (2g per kg of bodyweight) is the priority." />
      </div>
      <SubNav options={navOptions} value={view} onChange={setView} />

      {view === 'plan' && (
        <>
          <div style={{ display: 'flex', gap: 5, overflowX: 'auto', paddingBottom: 4 }}>
            {DAYS.map((d) => (
              <button
                key={d}
                onClick={() => setDay(d)}
                style={{ padding: '5px 12px', borderRadius: 20, whiteSpace: 'nowrap', fontSize: 12, background: day === d ? 'var(--accent)' : 'var(--bg3)', color: day === d ? 'white' : 'var(--text2)', border: `1px solid ${day === d ? 'var(--accent)' : 'var(--border)'}`, cursor: 'pointer', flexShrink: 0 }}
              >
                {d.slice(0, 3)}
              </button>
            ))}
          </div>

          {meals && (
            <>
              {[
                { t: `${sh}:00`, l: 'Meal 1', m: meals.meal1, slot: 'meal1' },
                { t: '3:30pm', l: 'Snack', m: meals.snack, slot: 'snack' },
                { t: `${eh - 1}:00pm`, l: 'Meal 2', m: meals.meal2, slot: 'meal2' },
              ].map((item) => (
                <Card key={item.l}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 9 }}>
                    <div style={{ flex: 1, minWidth: 0, paddingRight: 10 }}>
                      <div style={{ fontSize: 10, color: 'var(--text2)', marginBottom: 3 }}>{item.l} - {item.t}</div>
                      <div style={{ fontSize: 13, fontWeight: 500, lineHeight: 1.4 }}>{item.m.name}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: 19, fontWeight: 600 }}>{item.m.kcal}</div>
                        <div style={{ fontSize: 9, color: 'var(--text2)' }}>kcal</div>
                      </div>
                      {onEditMeal && (
                        <button
                          onClick={() => onEditMeal(day, item.slot, item.m)}
                          aria-label={`Edit ${item.l}`}
                          style={{ padding: 6, borderRadius: 6, background: 'var(--bg3)', border: '1px solid var(--border2)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                        >
                          <Pencil size={11} color="var(--text2)" />
                        </button>
                      )}
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 5 }}>
                    {MACROS.map((mac) => (
                      <div key={mac.key} style={{ background: mac.color + '18', border: `1px solid ${mac.color}28`, borderRadius: 'var(--r2)', padding: '5px', textAlign: 'center' }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: mac.color }}>{item.m[mac.key]}g</div>
                        <div style={{ fontSize: 9, color: mac.color + '99' }}>{mac.label}</div>
                      </div>
                    ))}
                  </div>
                </Card>
              ))}
              <div style={{ background: 'var(--bg3)', borderRadius: 'var(--r2)', padding: '10px 13px', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 12, color: 'var(--text2)' }}>Day total</span>
                <div style={{ display: 'flex', gap: 14, fontSize: 12, fontWeight: 600 }}>
                  <span>{tot} kcal</span>
                  <span style={{ color: 'var(--blue)' }}>{totp}g protein</span>
                </div>
              </div>
            </>
          )}
        </>
      )}

      {view === 'prep' && (
        <div>
          <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 4 }}>Sunday batch prep</div>
          <div style={{ fontSize: 12, color: 'var(--text2)', marginBottom: 14 }}>Around 60 minutes on Sunday sets you up for the whole week.</div>
          {PREP_STEPS.map((s, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, padding: '11px 0', borderTop: i > 0 ? '1px solid var(--border)' : 'none' }}>
              <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'rgba(230,57,70,0.12)', border: '1px solid rgba(230,57,70,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 600, color: 'var(--accent)', flexShrink: 0 }}>{s.n}</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 3 }}>{s.title}</div>
                <div style={{ fontSize: 11, color: 'var(--text2)', lineHeight: 1.55 }}>{s.detail}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {view === 'shopping' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 500 }}>Weekly shopping list</div>
              <div style={{ fontSize: 11, color: 'var(--text2)', marginTop: 2 }}>{totalChecked}/{totalItems} items ticked</div>
            </div>
            {totalChecked > 0 && (
              <button
                onClick={() => setChecked({})}
                aria-label="Reset shopping list"
                style={{ fontSize: 11, color: 'var(--text3)', background: 'none', border: '1px solid var(--border2)', borderRadius: 'var(--r3)', padding: '5px 10px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
              >
                <RotateCcw size={10} /> Reset
              </button>
            )}
          </div>
          <ProgressBar value={totalChecked / totalItems} color="var(--green)" style={{ marginBottom: 16 }} />
          {Object.entries(DEFAULT_SHOPPING).map(([cat, items]) => (
            <div key={cat} style={{ marginBottom: 18 }}>
              <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text2)', marginBottom: 8, paddingBottom: 6, borderBottom: '1px solid var(--border)' }}>
                {CATEGORY_LABELS[cat]}
              </div>
              {items.map((item, idx) => {
                const key = `${cat}-${idx}`;
                const done = checked[key];
                return (
                  <div
                    key={idx}
                    onClick={() => toggleCheck(cat, idx)}
                    style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '7px 0', cursor: 'pointer', borderTop: idx > 0 ? '1px solid var(--border)' : 'none', opacity: done ? 0.45 : 1, transition: 'opacity 0.2s' }}
                  >
                    <div style={{ width: 18, height: 18, borderRadius: 4, flexShrink: 0, background: done ? 'var(--accent)' : 'var(--bg3)', border: `1px solid ${done ? 'var(--accent)' : 'var(--border2)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: 'white', fontWeight: 700 }}>
                      {done ? '✓' : ''}
                    </div>
                    <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 13, textDecoration: done ? 'line-through' : 'none' }}>{item.item}</span>
                      <span style={{ fontSize: 11, color: 'var(--text2)', marginLeft: 8, flexShrink: 0 }}>{item.qty}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
