import { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';

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

const ALL_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export function WorkoutEditor({ workout, onClose }) {
  const { customWorkouts, setCustomWorkouts } = useApp();
  const [exercises, setExercises] = useState(workout.exercises.map((ex) => ({ ...ex })));
  const [day, setDay] = useState(workout.day);

  const updateExercise = (idx, field, value) => {
    setExercises((prev) => prev.map((ex, i) => i === idx ? { ...ex, [field]: value } : ex));
  };

  const deleteExercise = (idx) => {
    setExercises((prev) => prev.filter((_, i) => i !== idx));
  };

  const addExercise = () => {
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

        <button
          onClick={addExercise}
          style={{ width: '100%', padding: '9px', borderRadius: 'var(--r2)', background: 'var(--bg3)', border: '1px dashed var(--border2)', color: 'var(--text2)', fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: 12 }}
        >
          <Plus size={14} /> Add exercise
        </button>

        <button onClick={save} style={{ width: '100%', padding: '11px', borderRadius: 'var(--r2)', background: 'var(--accent)', color: 'white', border: 'none', fontSize: 13, fontWeight: 600, cursor: 'pointer', marginBottom: 8 }}>
          Save workout
        </button>
        <button onClick={reset} style={{ width: '100%', padding: '9px', borderRadius: 'var(--r2)', background: 'transparent', border: '1px solid rgba(240,80,80,0.3)', color: 'var(--red)', fontSize: 12, cursor: 'pointer' }}>
          Reset to default
        </button>
      </div>
    </div>
  );
}

const overlayStyle = { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 200, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' };
const sheetStyle = { background: 'var(--bg2)', borderRadius: '20px 20px 0 0', width: '100%', maxWidth: 480, padding: '20px 20px 40px', maxHeight: '90vh', overflowY: 'auto', border: '1px solid var(--border2)' };
const closeBtnStyle = { width: 30, height: 30, borderRadius: '50%', background: 'var(--bg3)', border: '1px solid var(--border2)', color: 'var(--text)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' };
const labelStyle = { fontSize: 10, color: 'var(--text3)', display: 'block', marginBottom: 4, fontWeight: 500 };
