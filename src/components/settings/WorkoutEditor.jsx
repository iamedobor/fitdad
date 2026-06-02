import { useState } from 'react';
import { X, Plus, Trash2, Search } from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';
import { EXERCISE_LIBRARY } from '../../data/exerciseLibrary.js';

const ALL_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const MUSCLE_GROUPS = Object.entries(EXERCISE_LIBRARY).map(([key, val]) => ({ key, label: val.label }));

function ExercisePicker({ onAdd, onClose }) {
  const [group, setGroup] = useState('chest');
  const [query, setQuery] = useState('');

  const allExercises = Object.values(EXERCISE_LIBRARY).flatMap((g) => g.exercises);
  const filtered = query.trim()
    ? allExercises.filter((ex) => ex.name.toLowerCase().includes(query.toLowerCase()))
    : EXERCISE_LIBRARY[group].exercises;

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 300, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
      <div style={{ background: 'var(--bg2)', borderRadius: '20px 20px 0 0', width: '100%', maxWidth: 480, padding: '20px 20px 40px', maxHeight: '85vh', display: 'flex', flexDirection: 'column', border: '1px solid var(--border2)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div style={{ fontSize: 16, fontWeight: 600 }}>Exercise library</div>
          <button onClick={onClose} aria-label="Close" style={closeBtnStyle}><X size={16} /></button>
        </div>

        <div style={{ position: 'relative', marginBottom: 12 }}>
          <Search size={13} color="var(--text3)" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search exercises..."
            style={{ paddingLeft: 30, width: '100%', boxSizing: 'border-box' }}
            autoFocus
          />
        </div>

        {!query.trim() && (
          <div style={{ display: 'flex', gap: 5, overflowX: 'auto', paddingBottom: 8, marginBottom: 4, flexShrink: 0 }}>
            {MUSCLE_GROUPS.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setGroup(key)}
                style={{ padding: '5px 12px', borderRadius: 20, whiteSpace: 'nowrap', fontSize: 11, fontWeight: 500, background: group === key ? 'var(--accent)' : 'var(--bg3)', color: group === key ? 'white' : 'var(--text2)', border: `1px solid ${group === key ? 'var(--accent)' : 'var(--border)'}`, cursor: 'pointer', flexShrink: 0 }}
              >
                {label}
              </button>
            ))}
          </div>
        )}

        <div style={{ overflowY: 'auto', flex: 1 }}>
          {filtered.map((ex, i) => (
            <div
              key={i}
              onClick={() => { onAdd({ ...ex }); onClose(); }}
              style={{ padding: '11px 0', borderTop: i > 0 ? '1px solid var(--border)' : 'none', cursor: 'pointer' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontWeight: 500, fontSize: 13 }}>{ex.name}</div>
                <span style={{ fontSize: 11, color: 'var(--text2)', fontFamily: 'DM Mono, monospace', flexShrink: 0, marginLeft: 8 }}>
                  {ex.sets}x{ex.reps}
                </span>
              </div>
              <div style={{ fontSize: 11, color: 'var(--text2)', marginTop: 2 }}>{ex.tip}</div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '2rem 0', fontSize: 13, color: 'var(--text2)' }}>
              No exercises found for "{query}"
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ExerciseRow({ ex, onChange, onDelete }) {
  return (
    <div style={{ background: 'var(--bg3)', borderRadius: 'var(--r2)', padding: '10px 12px', marginBottom: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <input
          value={ex.name}
          onChange={(e) => onChange('name', e.target.value)}
          placeholder="Exercise name"
          style={{ flex: 1, marginRight: 8, fontSize: 13, fontWeight: 500 }}
        />
        <button onClick={onDelete} aria-label="Delete exercise" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: 'var(--red)', display: 'flex' }}>
          <Trash2 size={14} />
        </button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6, marginBottom: 6 }}>
        {[
          { k: 'sets', label: 'Sets', ph: '3' },
          { k: 'reps', label: 'Reps', ph: '10-12' },
          { k: 'rest', label: 'Rest', ph: '60s' },
        ].map(({ k, label, ph }) => (
          <div key={k}>
            <label style={labelStyle}>{label}</label>
            <input value={ex[k] || ''} onChange={(e) => onChange(k, e.target.value)} placeholder={ph} />
          </div>
        ))}
      </div>
      <div style={{ marginBottom: 6 }}>
        <label style={labelStyle}>Home alternative</label>
        <input value={ex.homeAlt || ''} onChange={(e) => onChange('homeAlt', e.target.value)} placeholder="e.g. Push-ups 3x15" />
      </div>
      <div>
        <label style={labelStyle}>Coaching tip</label>
        <input value={ex.tip || ''} onChange={(e) => onChange('tip', e.target.value)} placeholder="Form cue or key point" />
      </div>
    </div>
  );
}

export function WorkoutEditor({ workout, onClose }) {
  const { customWorkouts, setCustomWorkouts } = useApp();
  const [exercises, setExercises] = useState(workout.exercises.map((ex) => ({ ...ex })));
  const [day, setDay] = useState(workout.day);
  const [showPicker, setShowPicker] = useState(false);

  const updateExercise = (idx, field, value) => {
    setExercises((prev) => prev.map((ex, i) => i === idx ? { ...ex, [field]: value } : ex));
  };

  const deleteExercise = (idx) => {
    setExercises((prev) => prev.filter((_, i) => i !== idx));
  };

  const addFromLibrary = (ex) => {
    setExercises((prev) => [...prev, { ...ex }]);
  };

  const addBlank = () => {
    setExercises((prev) => [...prev, { name: '', sets: 3, reps: '10', rest: '60s', homeAlt: '', tip: '' }]);
  };

  const save = () => {
    const valid = exercises.filter((ex) => ex.name.trim());
    setCustomWorkouts({ ...customWorkouts, [workout.id]: { day, exercises: valid } });
    onClose();
  };

  const reset = () => {
    const updated = { ...customWorkouts };
    delete updated[workout.id];
    setCustomWorkouts(updated);
    onClose();
  };

  return (
    <>
      {showPicker && <ExercisePicker onAdd={addFromLibrary} onClose={() => setShowPicker(false)} />}

      <div style={overlayStyle} onClick={(e) => e.target === e.currentTarget && onClose()}>
        <div style={sheetStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
            <div style={{ fontSize: 16, fontWeight: 600 }}>{workout.type}</div>
            <button onClick={onClose} aria-label="Close" style={closeBtnStyle}><X size={16} /></button>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 10, color: 'var(--text)', display: 'block', marginBottom: 8, fontWeight: 500 }}>Training day</label>
            <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
              {ALL_DAYS.map((d) => (
                <button
                  key={d}
                  onClick={() => setDay(d)}
                  style={{ padding: '5px 10px', borderRadius: 20, fontSize: 11, fontWeight: 500, cursor: 'pointer', background: day === d ? 'var(--accent)' : 'var(--bg3)', color: day === d ? 'white' : 'var(--text2)', border: `1px solid ${day === d ? 'var(--accent)' : 'var(--border)'}` }}
                >
                  {d.slice(0, 3)}
                </button>
              ))}
            </div>
          </div>

          {exercises.map((ex, i) => (
            <ExerciseRow key={i} ex={ex} onChange={(field, value) => updateExercise(i, field, value)} onDelete={() => deleteExercise(i)} />
          ))}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 }}>
            <button
              onClick={() => setShowPicker(true)}
              style={{ padding: '9px', borderRadius: 'var(--r2)', background: 'rgba(230,57,70,0.1)', border: '1px solid rgba(230,57,70,0.3)', color: 'var(--accent)', fontSize: 12, fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}
            >
              <Search size={13} /> Browse library
            </button>
            <button
              onClick={addBlank}
              style={{ padding: '9px', borderRadius: 'var(--r2)', background: 'var(--bg3)', border: '1px dashed var(--border2)', color: 'var(--text2)', fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}
            >
              <Plus size={13} /> Add blank
            </button>
          </div>

          <button onClick={save} style={{ width: '100%', padding: '11px', borderRadius: 'var(--r2)', background: 'var(--accent)', color: 'white', border: 'none', fontSize: 13, fontWeight: 600, cursor: 'pointer', marginBottom: 8 }}>
            Save workout
          </button>
          <button onClick={reset} style={{ width: '100%', padding: '9px', borderRadius: 'var(--r2)', background: 'transparent', border: '1px solid rgba(240,80,80,0.3)', color: 'var(--red)', fontSize: 12, cursor: 'pointer' }}>
            Reset to default
          </button>
        </div>
      </div>
    </>
  );
}

const overlayStyle = { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 200, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' };
const sheetStyle = { background: 'var(--bg2)', borderRadius: '20px 20px 0 0', width: '100%', maxWidth: 480, padding: '20px 20px 40px', maxHeight: '90vh', overflowY: 'auto', border: '1px solid var(--border2)' };
const closeBtnStyle = { width: 30, height: 30, borderRadius: '50%', background: 'var(--bg3)', border: '1px solid var(--border2)', color: 'var(--text)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' };
const labelStyle = { fontSize: 10, color: 'var(--text3)', display: 'block', marginBottom: 4, fontWeight: 500 };
