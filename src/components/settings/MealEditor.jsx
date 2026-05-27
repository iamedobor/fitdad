import { useState } from 'react';
import { X } from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';

export function MealEditor({ day, slot, meal, onClose }) {
  const { customMeals, setCustomMeals } = useApp();
  const [form, setForm] = useState({
    name: meal?.name || '',
    protein: meal?.protein ?? '',
    carbs: meal?.carbs ?? '',
    fat: meal?.fat ?? '',
    kcal: meal?.kcal ?? '',
  });

  const upd = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const save = () => {
    if (!form.name.trim()) return;
    const entry = {
      name: form.name.trim(),
      protein: parseFloat(form.protein) || 0,
      carbs: parseFloat(form.carbs) || 0,
      fat: parseFloat(form.fat) || 0,
      kcal: parseFloat(form.kcal) || 0,
    };
    setCustomMeals({
      ...customMeals,
      [day]: { ...(customMeals[day] || {}), [slot]: entry },
    });
    onClose();
  };

  const reset = () => {
    const updated = { ...customMeals };
    if (updated[day]) {
      delete updated[day][slot];
      if (Object.keys(updated[day]).length === 0) delete updated[day];
    }
    setCustomMeals(updated);
    onClose();
  };

  const slotLabel = slot === 'meal1' ? 'Meal 1' : slot === 'snack' ? 'Snack' : 'Meal 2';

  return (
    <div style={overlayStyle} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={sheetStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div style={{ fontSize: 16, fontWeight: 600 }}>Edit {slotLabel} - {day}</div>
          <button onClick={onClose} aria-label="Close" style={closeBtnStyle}><X size={16} /></button>
        </div>

        <div style={{ marginBottom: 10 }}>
          <label style={labelStyle}>Meal description</label>
          <input value={form.name} onChange={(e) => upd('name', e.target.value)} placeholder="e.g. Grilled salmon with asparagus" />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 10 }}>
          {[
            { k: 'protein', label: 'Protein (g)' },
            { k: 'carbs', label: 'Carbs (g)' },
            { k: 'fat', label: 'Fat (g)' },
            { k: 'kcal', label: 'Calories (kcal)' },
          ].map(({ k, label }) => (
            <div key={k}>
              <label style={labelStyle}>{label}</label>
              <input type="number" min="0" value={form[k]} onChange={(e) => upd(k, e.target.value)} placeholder="0" />
            </div>
          ))}
        </div>

        <button onClick={save} style={{ width: '100%', padding: '11px', borderRadius: 'var(--r2)', background: 'var(--accent)', color: 'white', border: 'none', fontSize: 13, fontWeight: 600, cursor: 'pointer', marginBottom: 8 }}>
          Save meal
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
