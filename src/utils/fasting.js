const pad = (n) => String(n).padStart(2, '0');

export function getFastingState(settings = {}) {
  const windowStart = settings.windowStart ?? 12;
  const windowEnd = settings.windowEnd ?? 20;
  const now = new Date();
  const seconds = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
  const start = windowStart * 3600;
  const end = windowEnd * 3600;
  const fastDuration = (24 - (windowEnd - windowStart)) * 3600;
  const isOpen = seconds >= start && seconds < end;

  let remaining, progress;
  if (isOpen) {
    remaining = end - seconds;
    progress = (seconds - start) / (end - start);
  } else if (seconds < start) {
    remaining = start - seconds;
    progress = (seconds + 86400 - end) / fastDuration;
  } else {
    remaining = 86400 - seconds + start;
    progress = (seconds - end) / fastDuration;
  }

  return {
    isOpen,
    h: Math.floor(remaining / 3600),
    m: Math.floor((remaining % 3600) / 60),
    s: remaining % 60,
    progress: Math.min(Math.max(progress, 0), 1),
    windowStart,
    windowEnd,
    fastHours: Math.round(fastDuration / 3600),
    display: `${pad(Math.floor(remaining / 3600))}:${pad(Math.floor((remaining % 3600) / 60))}:${pad(remaining % 60)}`,
  };
}
