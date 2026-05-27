const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export function scheduleNotifications(settings, workouts) {
  if (!('Notification' in window) || Notification.permission !== 'granted') return;
  if (!settings.notifsEnabled) return;

  const { windowStart = 12, windowEnd = 20 } = settings;
  const todayName = DAY_NAMES[new Date().getDay()];
  const todayWorkout = workouts.find((w) => w.day === todayName);

  const reminders = [
    { h: windowStart - 1, m: 45, title: 'Eating window opens soon', body: `Window opens at ${windowStart}:00. Prepare your first meal.` },
    { h: windowStart, m: 0, title: 'Eating window open', body: 'Time for your first meal. Stay on plan.' },
    { h: 15, m: 30, title: 'Snack time', body: 'Greek yoghurt and nuts. Keep protein high.' },
    { h: windowEnd - 1, m: 0, title: 'Final meal time', body: `Eat your last meal before ${windowEnd}:00.` },
    { h: windowEnd - 1, m: 45, title: 'Window closes in 15 minutes', body: `Finish up. No food after ${windowEnd}:00.` },
  ];

  if (todayWorkout) {
    reminders.push({ h: 9, m: 0, title: 'Training day', body: `Today: ${todayWorkout.type}. Get it done.` });
  }

  const now = new Date();
  reminders.forEach(({ h, m, title, body }) => {
    const t = new Date();
    t.setHours(h, m, 0, 0);
    const delay = t - now;
    if (delay > 0 && delay < 86400000) {
      setTimeout(() => {
        if (Notification.permission === 'granted') {
          new Notification('FitDad: ' + title, { body });
        }
      }, delay);
    }
  });
}
