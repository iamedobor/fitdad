export const storage = {
  get: (key) => {
    try {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    } catch {
      return null;
    }
  },
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn('Storage write failed:', e);
    }
  },
  del: (key) => {
    try {
      localStorage.removeItem(key);
    } catch {}
  },
};

export const KEYS = {
  LOG: 'fd-log',
  PROGRESS: 'fd-progress',
  JOURNAL: 'fd-journal',
  PHOTOS: 'fd-photos',
  SHOPPING: 'fd-shopping',
  STREAK: 'fd-streak',
  SETTINGS: 'fd-settings',
  PROFILE: 'fd-profile',
  CUSTOM_MEALS: 'fd-custom-meals',
  CUSTOM_WORKOUTS: 'fd-custom-workouts',
};
