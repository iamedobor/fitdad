import { createContext, useContext, useState, useEffect } from 'react';
import { storage, KEYS } from '../utils/storage.js';
import { DEFAULT_MEALS } from '../data/defaultMeals.js';
import { DEFAULT_WORKOUTS } from '../data/defaultWorkouts.js';

const AppContext = createContext(null);

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
export const todayKey = new Date().toISOString().split('T')[0];
export const todayName = DAY_NAMES[new Date().getDay()];

export function AppProvider({ children }) {
  const [profile, setProfileState] = useState(() => storage.get(KEYS.PROFILE));
  const [settings, setSettingsState] = useState(
    () => storage.get(KEYS.SETTINGS) || { windowStart: 12, windowEnd: 20, notifsEnabled: false }
  );
  const [log, setLogState] = useState(() => storage.get(KEYS.LOG) || {});
  const [progress, setProgressState] = useState(() => storage.get(KEYS.PROGRESS) || []);
  const [journal, setJournalState] = useState(() => storage.get(KEYS.JOURNAL) || {});
  const [photos, setPhotosState] = useState(() => storage.get(KEYS.PHOTOS) || []);
  const [customMeals, setCustomMealsState] = useState(() => storage.get(KEYS.CUSTOM_MEALS) || {});
  const [customWorkouts, setCustomWorkoutsState] = useState(() => storage.get(KEYS.CUSTOM_WORKOUTS) || {});
  const [streak, setStreak] = useState(() => storage.get(KEYS.STREAK) || 0);

  const persist = (key, setter) => (value) => {
    const next = typeof value === 'function' ? value(null) : value;
    setter(value);
    storage.set(key, next);
  };

  const setProfile = (value) => { setProfileState(value); storage.set(KEYS.PROFILE, value); };
  const setSettings = (value) => { setSettingsState(value); storage.set(KEYS.SETTINGS, value); };
  const setLog = (value) => { setLogState(value); storage.set(KEYS.LOG, value); };
  const setProgress = (value) => { setProgressState(value); storage.set(KEYS.PROGRESS, value); };
  const setJournal = (value) => { setJournalState(value); storage.set(KEYS.JOURNAL, value); };
  const setPhotos = (value) => { setPhotosState(value); storage.set(KEYS.PHOTOS, value); };
  const setCustomMeals = (value) => { setCustomMealsState(value); storage.set(KEYS.CUSTOM_MEALS, value); };
  const setCustomWorkouts = (value) => { setCustomWorkoutsState(value); storage.set(KEYS.CUSTOM_WORKOUTS, value); };

  useEffect(() => {
    let count = 0;
    const d = new Date();
    for (let i = 0; i < 120; i++) {
      const k = d.toISOString().split('T')[0];
      const entry = log[k] || {};
      const tracked = ['meal1', 'snack', 'meal2', 'fasting'].filter((f) => entry[f]).length;
      if (tracked >= 3) { count++; d.setDate(d.getDate() - 1); }
      else break;
    }
    setStreak(count);
    storage.set(KEYS.STREAK, count);
  }, [log]);

  const getMealsForDay = (day) => {
    const defaults = DEFAULT_MEALS[day] || {};
    const overrides = customMeals[day] || {};
    return {
      meal1: overrides.meal1 || defaults.meal1,
      snack: overrides.snack || defaults.snack,
      meal2: overrides.meal2 || defaults.meal2,
    };
  };

  const getWorkouts = () => {
    return DEFAULT_WORKOUTS.map((w) => {
      const override = customWorkouts[w.id];
      if (!override) return w;
      return { ...w, exercises: override.exercises ?? w.exercises };
    });
  };

  const resetAllData = () => {
    Object.values(KEYS).forEach((k) => storage.del(k));
    window.location.reload();
  };

  return (
    <AppContext.Provider value={{
      profile, setProfile,
      settings, setSettings,
      log, setLog,
      progress, setProgress,
      journal, setJournal,
      photos, setPhotos,
      customMeals, setCustomMeals,
      customWorkouts, setCustomWorkouts,
      streak,
      getMealsForDay,
      getWorkouts,
      resetAllData,
      todayKey,
      todayName,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}
