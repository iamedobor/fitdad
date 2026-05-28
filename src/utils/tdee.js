export function calcBMI(weightKg, heightCm) {
  if (!weightKg || !heightCm) return null;
  const heightM = heightCm / 100;
  const bmi = weightKg / (heightM * heightM);
  return {
    value: Math.round(bmi * 10) / 10,
    category: bmi < 18.5 ? 'Underweight' : bmi < 25 ? 'Healthy weight' : bmi < 30 ? 'Overweight' : 'Obese',
    color: bmi < 18.5 ? 'var(--blue)' : bmi < 25 ? 'var(--green)' : bmi < 30 ? 'var(--amber)' : 'var(--red)',
  };
}

export function calcTDEE(profile) {
  const { age, gender, heightCm, startWeight, activityMultiplier } = profile || {};
  if (!age || !heightCm || !startWeight) return null;

  const weight = startWeight;
  let bmr;
  if (gender === 'female') {
    bmr = 10 * weight + 6.25 * heightCm - 5 * age - 161;
  } else {
    bmr = 10 * weight + 6.25 * heightCm - 5 * age + 5;
  }

  const multiplier = activityMultiplier ?? 1.55;
  return Math.round(bmr * multiplier);
}

export function calcDailyTarget(tdee, pace = 'moderate') {
  if (!tdee) return null;
  const deficits = { gradual: 250, moderate: 500, aggressive: 750 };
  return tdee - (deficits[pace] ?? 500);
}

export function calcWeeksToGoal(currentWeight, goalWeight, dailyDeficit) {
  if (!currentWeight || !goalWeight || !dailyDeficit || currentWeight <= goalWeight) return null;
  const kgToLose = currentWeight - goalWeight;
  const weeklyLoss = (dailyDeficit * 7) / 7700;
  return Math.ceil(kgToLose / weeklyLoss);
}
