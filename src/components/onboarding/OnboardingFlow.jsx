import { useState } from 'react';
import { ChevronRight, ChevronLeft, Check } from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';

const DIET_OPTIONS = [
  { id: 'low-carb', label: 'Low Carb', description: 'High protein, moderate fat, minimal starchy carbs. The default plan.' },
  { id: 'keto', label: 'Ketogenic', description: 'Very low carb, high fat. Targets nutritional ketosis.' },
  { id: 'mediterranean', label: 'Mediterranean', description: 'Whole grains, lean protein, olive oil, vegetables.' },
  { id: 'balanced', label: 'Balanced', description: 'Standard macros split across all food groups.' },
];

const FASTING_OPTIONS = [
  { id: '16:8', label: '16:8', start: 12, end: 20, description: 'Fast 16 hours. Eat noon to 8pm. Most effective for fat loss.' },
  { id: '14:10', label: '14:10', start: 10, end: 20, description: 'Fast 14 hours. Eat 10am to 8pm. Good starting point.' },
  { id: 'custom', label: 'Custom', start: null, end: null, description: 'Set your own eating window in Settings after setup.' },
];

function StepIndicator({ current, total }) {
  return (
    <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginBottom: 28 }}>
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          style={{
            height: 3,
            borderRadius: 2,
            flex: 1,
            maxWidth: 40,
            background: i <= current ? 'var(--accent)' : 'var(--bg4)',
            transition: 'background 0.3s',
          }}
        />
      ))}
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ fontSize: 11, color: 'var(--text3)', display: 'block', marginBottom: 5, fontWeight: 500 }}>{label}</label>
      {children}
    </div>
  );
}

export function OnboardingFlow() {
  const { setProfile, setSettings, settings } = useApp();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    name: '', age: '', gender: 'male', heightCm: '', startWeight: '', startWaist: '',
    goalWeight: '', dietType: 'low-carb', fastingPreset: '16:8',
    windowStart: 12, windowEnd: 20,
  });

  const upd = (k, v) => setForm((p) => ({ ...p, [k]: v }));
  const TOTAL_STEPS = 5;

  const finish = () => {
    const profile = {
      name: form.name.trim(),
      age: form.age ? parseInt(form.age) : null,
      gender: form.gender,
      heightCm: form.heightCm ? parseFloat(form.heightCm) : null,
      startWeight: form.startWeight ? parseFloat(form.startWeight) : null,
      startWaist: form.startWaist ? parseFloat(form.startWaist) : null,
      goalWeight: form.goalWeight ? parseFloat(form.goalWeight) : null,
      dietType: form.dietType,
      onboardedAt: new Date().toISOString(),
    };
    setProfile(profile);
    setSettings({
      ...settings,
      windowStart: form.windowStart,
      windowEnd: form.windowEnd,
      goalWeight: profile.goalWeight,
    });
  };

  const steps = [
    // Step 0: Welcome
    <div key="welcome" className="fade-up" style={{ textAlign: 'center', padding: '20px 0' }}>
      <div style={{ width: 64, height: 64, borderRadius: 18, background: 'rgba(230,57,70,0.15)', border: '1px solid rgba(230,57,70,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: 28, fontWeight: 700, color: 'var(--accent)' }}>F</div>
      <h1 style={{ fontSize: 26, fontWeight: 700, marginBottom: 10, letterSpacing: -0.5 }}>Welcome to FitDad</h1>
      <p style={{ color: 'var(--text2)', lineHeight: 1.65, fontSize: 14, maxWidth: 300, margin: '0 auto 28px' }}>
        A structured system for losing fat, building strength, and staying consistent. Takes two minutes to set up.
      </p>
      <button onClick={() => setStep(1)} style={btnStyle('var(--accent)')}>
        Get started <ChevronRight size={16} style={{ marginLeft: 4 }} />
      </button>
    </div>,

    // Step 1: Personal info
    <div key="personal" className="fade-up">
      <h2 style={headStyle}>About you</h2>
      <p style={subStyle}>Used to personalise goals and calorie targets.</p>
      <Field label="First name">
        <input value={form.name} onChange={(e) => upd('name', e.target.value)} placeholder="e.g. Marcus" />
      </Field>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <Field label="Age">
          <input type="number" value={form.age} onChange={(e) => upd('age', e.target.value)} placeholder="e.g. 38" />
        </Field>
        <Field label="Gender">
          <select value={form.gender} onChange={(e) => upd('gender', e.target.value)}>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </Field>
      </div>
      <Field label="Height (cm)">
        <input type="number" value={form.heightCm} onChange={(e) => upd('heightCm', e.target.value)} placeholder="e.g. 178" />
      </Field>
    </div>,

    // Step 2: Starting stats
    <div key="stats" className="fade-up">
      <h2 style={headStyle}>Your starting point</h2>
      <p style={subStyle}>Logged as your first measurement entry.</p>
      <Field label="Current weight (kg)">
        <input type="number" step="0.1" value={form.startWeight} onChange={(e) => upd('startWeight', e.target.value)} placeholder="e.g. 94.5" />
      </Field>
      <Field label="Waist circumference (cm) - optional">
        <input type="number" step="0.5" value={form.startWaist} onChange={(e) => upd('startWaist', e.target.value)} placeholder="e.g. 102" />
      </Field>
      <Field label="Target weight (kg)">
        <input type="number" step="0.5" value={form.goalWeight} onChange={(e) => upd('goalWeight', e.target.value)} placeholder="e.g. 82" />
      </Field>
    </div>,

    // Step 3: Diet type
    <div key="diet" className="fade-up">
      <h2 style={headStyle}>Diet approach</h2>
      <p style={subStyle}>This shapes your meal plan and macros.</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {DIET_OPTIONS.map((opt) => (
          <button
            key={opt.id}
            onClick={() => upd('dietType', opt.id)}
            style={{
              padding: '12px 14px',
              borderRadius: 'var(--r2)',
              border: `1px solid ${form.dietType === opt.id ? 'rgba(230,57,70,0.5)' : 'var(--border)'}`,
              background: form.dietType === opt.id ? 'rgba(230,57,70,0.1)' : 'var(--bg2)',
              cursor: 'pointer',
              textAlign: 'left',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)', marginBottom: 2 }}>{opt.label}</div>
              <div style={{ fontSize: 11, color: 'var(--text3)' }}>{opt.description}</div>
            </div>
            {form.dietType === opt.id && <Check size={14} color="var(--accent)" style={{ flexShrink: 0, marginLeft: 10 }} />}
          </button>
        ))}
      </div>
    </div>,

    // Step 4: Fasting window
    <div key="fasting" className="fade-up">
      <h2 style={headStyle}>Fasting window</h2>
      <p style={subStyle}>How many hours will you fast each day?</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
        {FASTING_OPTIONS.map((opt) => (
          <button
            key={opt.id}
            onClick={() => {
              upd('fastingPreset', opt.id);
              if (opt.start) { upd('windowStart', opt.start); upd('windowEnd', opt.end); }
            }}
            style={{
              padding: '12px 14px',
              borderRadius: 'var(--r2)',
              border: `1px solid ${form.fastingPreset === opt.id ? 'rgba(230,57,70,0.5)' : 'var(--border)'}`,
              background: form.fastingPreset === opt.id ? 'rgba(230,57,70,0.1)' : 'var(--bg2)',
              cursor: 'pointer',
              textAlign: 'left',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)', marginBottom: 2 }}>{opt.label}</div>
              <div style={{ fontSize: 11, color: 'var(--text3)' }}>{opt.description}</div>
            </div>
            {form.fastingPreset === opt.id && <Check size={14} color="var(--accent)" style={{ flexShrink: 0, marginLeft: 10 }} />}
          </button>
        ))}
      </div>
      <div style={{ background: 'rgba(230,57,70,0.07)', border: '1px solid rgba(230,57,70,0.18)', borderRadius: 'var(--r2)', padding: '10px 13px', fontSize: 12, color: 'var(--text2)', lineHeight: 1.6 }}>
        16:8 is recommended for most people. Fasting for 16 hours keeps insulin low and accelerates fat burning without sacrificing muscle.
      </div>
    </div>,
  ];

  const isLast = step === TOTAL_STEPS - 1;
  const canProceed = step === 0 ? false : true;

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', minHeight: '100vh', background: 'var(--bg)', padding: '24px 20px 40px', display: 'flex', flexDirection: 'column' }}>
      {step > 0 && <StepIndicator current={step - 1} total={TOTAL_STEPS - 1} />}
      <div style={{ flex: 1 }}>
        {steps[step]}
      </div>
      {step > 0 && (
        <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
          <button onClick={() => setStep((s) => s - 1)} style={btnStyle('var(--bg3)', 'var(--text2)', '1px solid var(--border2)')}>
            <ChevronLeft size={16} style={{ marginRight: 4 }} /> Back
          </button>
          <button
            onClick={() => isLast ? finish() : setStep((s) => s + 1)}
            style={{ ...btnStyle('var(--accent)'), flex: 2 }}
          >
            {isLast ? 'Launch FitDad' : 'Continue'} {!isLast && <ChevronRight size={16} style={{ marginLeft: 4 }} />}
          </button>
        </div>
      )}
    </div>
  );
}

const headStyle = { fontSize: 20, fontWeight: 600, marginBottom: 6, letterSpacing: -0.3 };
const subStyle = { fontSize: 13, color: 'var(--text2)', marginBottom: 18, lineHeight: 1.5 };
const btnStyle = (bg, color = 'white', border = 'none') => ({
  padding: '12px 20px',
  borderRadius: 'var(--r2)',
  background: bg,
  color,
  border,
  fontSize: 13,
  fontWeight: 600,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flex: 1,
});
