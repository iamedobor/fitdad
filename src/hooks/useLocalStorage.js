import { useState } from 'react';
import { storage } from '../utils/storage.js';

export function useLocalStorage(key, defaultValue) {
  const [state, setState] = useState(() => storage.get(key) ?? defaultValue);

  const set = (value) => {
    const next = typeof value === 'function' ? value(state) : value;
    setState(next);
    storage.set(key, next);
  };

  return [state, set];
}
