import { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext.jsx';
import { Header } from './components/layout/Header.jsx';
import { BottomNav } from './components/layout/BottomNav.jsx';
import { OnboardingFlow } from './components/onboarding/OnboardingFlow.jsx';
import { HomeTab } from './components/tabs/HomeTab.jsx';
import { FastingTab } from './components/tabs/FastingTab.jsx';
import { MealsTab } from './components/tabs/MealsTab.jsx';
import { TrainTab } from './components/tabs/TrainTab.jsx';
import { LogTab } from './components/tabs/LogTab.jsx';
import { TrackTab } from './components/tabs/TrackTab.jsx';
import { SettingsModal } from './components/settings/SettingsModal.jsx';
import { MealEditor } from './components/settings/MealEditor.jsx';
import { WorkoutEditor } from './components/settings/WorkoutEditor.jsx';

function Main() {
  const { profile } = useApp();
  const [tab, setTab] = useState('home');
  const [showSettings, setShowSettings] = useState(false);
  const [mealEdit, setMealEdit] = useState(null);
  const [workoutEdit, setWorkoutEdit] = useState(null);

  if (!profile) {
    return <OnboardingFlow />;
  }

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', minHeight: '100vh', background: 'var(--bg)' }}>
      <Header onSettingsOpen={() => setShowSettings(true)} />

      <div style={{ padding: '14px 16px 90px' }}>
        {tab === 'home' && <HomeTab setTab={setTab} />}
        {tab === 'fasting' && <FastingTab />}
        {tab === 'meals' && <MealsTab onEditMeal={(day, slot, meal) => setMealEdit({ day, slot, meal })} />}
        {tab === 'train' && <TrainTab onEditWorkout={(w) => setWorkoutEdit(w)} />}
        {tab === 'log' && <LogTab />}
        {tab === 'track' && <TrackTab />}
      </div>

      <BottomNav active={tab} onChange={setTab} />

      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
      {mealEdit && <MealEditor day={mealEdit.day} slot={mealEdit.slot} meal={mealEdit.meal} onClose={() => setMealEdit(null)} />}
      {workoutEdit && <WorkoutEditor workout={workoutEdit} onClose={() => setWorkoutEdit(null)} />}
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Main />
    </AppProvider>
  );
}
