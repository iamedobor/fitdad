export const DEFAULT_WORKOUTS = [
  {
    id: 'mon',
    day: 'Monday',
    type: 'Upper - Push',
    accent: '#7c6af7',
    exercises: [
      { name: 'Bench Press', sets: 4, reps: '8-10', rest: '90s', homeAlt: 'Push-ups 4x15', tip: 'Shoulder blades retracted, lower bar to chest' },
      { name: 'Overhead Press', sets: 3, reps: '10', rest: '90s', homeAlt: 'Pike Push-ups 3x12', tip: 'Brace core, do not arch lower back' },
      { name: 'Incline Dumbbell Press', sets: 3, reps: '12', rest: '60s', homeAlt: 'Elevated Push-ups 3x12', tip: '30-45 degree incline, full range of motion' },
      { name: 'Lateral Raises', sets: 3, reps: '15', rest: '60s', homeAlt: 'Band Lateral Raises', tip: 'Light weight, lead with elbows not wrists' },
      { name: 'Tricep Pushdown', sets: 3, reps: '12', rest: '60s', homeAlt: 'Tricep Dips 3x12', tip: 'Elbows glued to sides, full extension at bottom' },
      { name: 'Plank', sets: 3, reps: '45s hold', rest: '45s', homeAlt: 'Plank', tip: 'Neutral spine, squeeze glutes and abs hard' },
    ],
  },
  {
    id: 'tue',
    day: 'Tuesday',
    type: 'Lower',
    accent: '#22c97a',
    exercises: [
      { name: 'Barbell Squat', sets: 4, reps: '8-10', rest: '2min', homeAlt: 'Goblet Squat', tip: 'Chest up, knees tracking over toes' },
      { name: 'Romanian Deadlift', sets: 3, reps: '10', rest: '90s', homeAlt: 'Single-leg RDL', tip: 'Hinge at hips, soft knees, bar close to legs' },
      { name: 'Leg Press', sets: 3, reps: '12', rest: '90s', homeAlt: 'Step-ups 3x12 each', tip: 'Feet shoulder-width, do not lock knees out' },
      { name: 'Walking Lunges', sets: 3, reps: '12 each', rest: '60s', homeAlt: 'Walking Lunges', tip: 'Long stride, back knee nearly touches floor' },
      { name: 'Calf Raises', sets: 4, reps: '15', rest: '45s', homeAlt: 'Calf Raises on step', tip: 'Full stretch at bottom, pause and squeeze at top' },
      { name: 'Hanging Leg Raises', sets: 3, reps: '12', rest: '60s', homeAlt: 'Lying Leg Raises', tip: 'Control the descent, no swinging' },
    ],
  },
  {
    id: 'thu',
    day: 'Thursday',
    type: 'Upper - Pull',
    accent: '#4da6ff',
    exercises: [
      { name: 'Deadlift', sets: 4, reps: '6-8', rest: '2min', homeAlt: 'Dumbbell Deadlift 4x10', tip: 'Neutral spine, drive the floor away with your feet' },
      { name: 'Barbell Row', sets: 4, reps: '8-10', rest: '90s', homeAlt: 'Dumbbell Bent-over Row', tip: 'Hinge 45 degrees, pull bar to lower chest' },
      { name: 'Lat Pulldown', sets: 3, reps: '10', rest: '90s', homeAlt: 'Resistance Band Pull', tip: 'Lean back slightly, pull to upper chest' },
      { name: 'Dumbbell Curls', sets: 3, reps: '12', rest: '60s', homeAlt: 'Band Curls', tip: 'No swinging, supinate at the top' },
      { name: 'Face Pulls', sets: 3, reps: '15', rest: '60s', homeAlt: 'Band Pull-aparts', tip: 'Pull to eye level, elbows high and wide' },
      { name: 'Ab Wheel Rollout', sets: 3, reps: '10', rest: '60s', homeAlt: 'Dead Bug 3x10 each', tip: 'Hollow body position, do not let hips drop' },
    ],
  },
  {
    id: 'fri',
    day: 'Friday',
    type: 'Lower + Core',
    accent: '#f5a623',
    exercises: [
      { name: 'Goblet Squat', sets: 4, reps: '10', rest: '90s', homeAlt: 'Goblet Squat with Dumbbell', tip: 'Elbows inside knees at bottom, upright torso' },
      { name: 'Hip Thrust', sets: 4, reps: '12', rest: '90s', homeAlt: 'Glute Bridge 4x15', tip: 'Bar on hip crease, chin tucked, full glute extension' },
      { name: 'Bulgarian Split Squat', sets: 3, reps: '10 each', rest: '90s', homeAlt: 'Reverse Lunge', tip: 'Rear foot elevated, lean slightly forward' },
      { name: 'Leg Curl', sets: 3, reps: '12', rest: '60s', homeAlt: 'Swiss Ball Curl', tip: 'Control the negative phase' },
      { name: 'Box Jump', sets: 3, reps: '8', rest: '60s', homeAlt: 'Broad Jump 3x8', tip: 'Land softly with bent knees, always step down' },
      { name: 'Russian Twists', sets: 3, reps: '20 total', rest: '45s', homeAlt: 'Russian Twists', tip: 'Feet off floor for more challenge, twist fully' },
    ],
  },
];

export const REST_DAYS = ['Wednesday', 'Saturday', 'Sunday'];
