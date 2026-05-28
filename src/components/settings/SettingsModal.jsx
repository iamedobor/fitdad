import { useState } from 'react';
import { X, Download, Upload } from 'lucide-react';
import { Toggle } from '../ui/Toggle.jsx';
import { useApp } from '../../context/AppContext.jsx';
import { scheduleNotifications } from '../../utils/notifications.js';
import { exportData, importData } from '../../utils/exportImport.js';

const FASTING_PRESETS = [
  { label: '16:8', start: 12, end: 20 },
  { label: '14:10', start: 10, end: 20 },
  { label: '18:6', start: 14, end: 20 },
  { label: '20:4', start: 16, end: 20 },
];

export function SettingsModal({ onClose }) {
  const { settings, setSettings, getWorkouts, profile, setProfile, resetAllData } = useApp();
  const [s, setS] = useState({ ...settings });
  const upd = (k, v) => setS((p) => ({ ...p, [k]: v }));

  const save = () => {
    setSettings(s);
    scheduleNotifications(s, getWorkouts());
    onClose();
  };

  const requestNotifs = async () => {
    if (!('Notification' in window)) { alert('Notifications are not supported in this browser.'); return; }
    const perm = await Notification.requestPermission();
    if (perm === 'granted') {
      upd('notifsEnabled', true);
      new Notification('FitDad reminders enabled', { body: 'You will receive meal and workout reminders each day.' });
    } else {
      alert('Permission denied. You can enable notifications in your browser settings.');
    }
  };

  const fastH = 24 - ((s.windowEnd ?? 20) - (s.windowStart ?? 12));

  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      await importData(file);
      alert('Data restored successfully. The app will reload.');
      window.location.reload();
    } catch (err) {
      alert(`Import failed: ${err.message}`);
    }
    e.target.value = '';
  };

  return (
    <div style={overlayStyle} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={sheetStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div style={{ fontSize: 18, fontWeight: 600 }}>Settings</div>
          <button onClick={onClose} aria-label="Close settings" style={closeBtnStyle}><X size={16} /></button>
        </div>

        {/* Fasting window */}
        <Section title="Fasting window">
          <div style={{ display: 'flex', gap: 6, marginBottom: 10, flexWrap: 'wrap' }}>
            {FASTING_PRESETS.map((preset) => {
              const active = s.windowStart === preset.start && s.windowEnd === preset.end;
              return (
                <button
                  key={preset.label}
                  onClick={() => { upd('windowStart', preset.start); upd('windowEnd', preset.end); }}
                  style={{ padding: '5px 12px', borderRadius: 20, fontSize: 12, fontWeight: 500, background: active ? 'var(--accent)' : 'var(--bg3)', color: active ? 'white' : 'var(--text2)', border: `1px solid ${active ? 'var(--accent)' : 'var(--border)'}`, cursor: 'pointer' }}
                >
                  {preset.label}
                </button>
              );
            })}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 6 }}>
            <div>
              <label style={labelStyle}>Window opens (24h)</label>
              <input type="number" min={6} max={16} value={s.windowStart ?? 12} onChange={(e) => upd('windowStart', parseInt(e.target.value))} />
            </div>
            <div>
              <label style={labelStyle}>Window closes (24h)</label>
              <input type="number" min={14} max={23} value={s.windowEnd ?? 20} onChange={(e) => upd('windowEnd', parseInt(e.target.value))} />
            </div>
          </div>
          <div style={{ fontSize: 11, color: 'var(--text3)' }}>
            Fast duration: {fastH}h - Eating window: {24 - fastH}h
          </div>
        </Section>

        {/* Goals */}
        <Section title="Goals">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 8 }}>
            <div>
              <label style={labelStyle}>Target weight (kg)</label>
              <input type="number" step="0.5" value={s.goalWeight || ''} onChange={(e) => upd('goalWeight', e.target.value ? parseFloat(e.target.value) : null)} placeholder="e.g. 80" />
            </div>
            <div>
              <label style={labelStyle}>Target waist (cm)</label>
              <input type="number" step="0.5" value={s.goalWaist || ''} onChange={(e) => upd('goalWaist', e.target.value ? parseFloat(e.target.value) : null)} placeholder="e.g. 85" />
            </div>
          </div>
          <div>
            <label style={labelStyle}>Daily calorie target (kcal) — optional override</label>
            <input
              type="number"
              step="50"
              value={s.customCalorieTarget || ''}
              onChange={(e) => upd('customCalorieTarget', e.target.value ? parseInt(e.target.value) : null)}
              placeholder="Leave blank to use calculated target"
            />
            <div style={{ fontSize: 10, color: 'var(--text2)', marginTop: 5 }}>
              Set a fixed daily target if you prefer not to use the TDEE calculation.
            </div>
          </div>
        </Section>

        {/* Reminders */}
        <Section title="Reminders">
          <div style={{ fontSize: 11, color: 'var(--text3)', marginBottom: 10, lineHeight: 1.5 }}>
            Reminders fire while the app is open. For background reminders, open in a mobile browser and use &quot;Add to Home Screen&quot;.
          </div>
          {'Notification' in window && Notification.permission === 'granted' ? (
            <Toggle
              on={s.notifsEnabled ?? false}
              onChange={(v) => upd('notifsEnabled', v)}
              label="Daily reminders"
              sub="Meals, workout, and window open/close alerts"
            />
          ) : (
            <button onClick={requestNotifs} style={{ width: '100%', padding: '10px', borderRadius: 'var(--r2)', background: 'rgba(230,57,70,0.12)', border: '1px solid rgba(230,57,70,0.35)', color: 'var(--accent)', fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>
              Enable reminders
            </button>
          )}
        </Section>

        {/* Data */}
        <Section title="Data">
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={exportData}
              style={{ flex: 1, padding: '10px', borderRadius: 'var(--r2)', background: 'var(--bg3)', border: '1px solid var(--border2)', color: 'var(--text)', fontSize: 12, fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
            >
              <Download size={13} /> Export backup
            </button>
            <label style={{ flex: 1, padding: '10px', borderRadius: 'var(--r2)', background: 'var(--bg3)', border: '1px solid var(--border2)', color: 'var(--text)', fontSize: 12, fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
              <Upload size={13} /> Import backup
              <input type="file" accept=".json" onChange={handleImport} style={{ display: 'none' }} />
            </label>
          </div>
        </Section>

        <button onClick={save} style={{ width: '100%', padding: '12px', borderRadius: 'var(--r2)', background: 'var(--accent)', color: 'white', border: 'none', fontSize: 14, fontWeight: 600, cursor: 'pointer', marginBottom: 10 }}>
          Save settings
        </button>
        <button onClick={resetAllData} style={{ width: '100%', padding: '10px', borderRadius: 'var(--r2)', background: 'transparent', border: '1px solid rgba(240,80,80,0.3)', color: 'var(--red)', fontSize: 12, cursor: 'pointer' }}>
          Reset all data
        </button>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 22 }}>
      <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 12, paddingBottom: 8, borderBottom: '1px solid var(--border)' }}>{title}</div>
      {children}
    </div>
  );
}

const overlayStyle = { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 100, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' };
const sheetStyle = { background: 'var(--bg2)', borderRadius: '20px 20px 0 0', width: '100%', maxWidth: 480, padding: '20px 20px 40px', maxHeight: '90vh', overflowY: 'auto', border: '1px solid var(--border2)' };
const closeBtnStyle = { width: 30, height: 30, borderRadius: '50%', background: 'var(--bg3)', border: '1px solid var(--border2)', color: 'var(--text)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' };
const labelStyle = { fontSize: 10, color: 'var(--text)', display: 'block', marginBottom: 4, fontWeight: 500 };
