# FitDad

**Live demo: [iamedobor.github.io/fitdad](https://iamedobor.github.io/fitdad/)**

**An open-source fitness and nutrition system built for people who are serious about losing weight for good.**

I built this because I struggled with my own weight for years. I tried the apps. I tried the meal plans. Most of them are either too complicated, too generic, or locked behind a subscription. I wanted something that actually worked for my life: structured, science-backed, no noise. So I built it myself, and now I am sharing it.

FitDad is a mobile-first progressive web app that combines intermittent fasting tracking, structured meal planning, progressive resistance training, and daily habit logging into one place. It runs entirely in the browser. Your data never leaves your device.

---

## Features

**Fasting tracker**
Real-time countdown with a circular progress ring. Fully customisable eating window with common presets (16:8, 14:10, 18:6, 20:4) or your own custom hours. Fasting science explained in plain language.

**Meal planning**
A 7-day low-carb meal plan included by default. Every meal, snack, and macro is visible at a glance. Edit any meal to match your own food preferences. Sunday batch prep guide and an interactive weekly shopping list.

**Workout programming**
An upper/lower split designed around 4 sessions per week, roughly one hour each. Every exercise includes a home gym alternative and a coaching tip. Edit any session, add or remove exercises, and mark sessions complete.

**Daily log**
One-tap checklist for your fasting window, each meal, your workout, and water intake. Streak counter to keep you accountable.

**Progress tracking**
Log weight and waist measurements each week. SVG weight trend chart visualises your progress from the moment you have three or more entries. Mood, energy, and sleep journal. Progress photos stored locally on your device.

**Onboarding**
A 5-step setup wizard collects your name, stats, goal weight, diet preference, and fasting window. The app then uses this to personalise your experience from day one.

**PWA ready**
Install it on your phone from a mobile browser using "Add to Home Screen". Works offline. No app store required.

**Data ownership**
Everything is stored in your browser's local storage. Export a full JSON backup at any time from Settings. Import it back on any device.

---

## Getting started

### Prerequisites

- Node.js 18 or higher
- npm 9 or higher

### Local development

```bash
git clone https://github.com/iamedobor/fitdad.git
cd fitdad
npm install
npm run dev
```

Open `http://localhost:5173/fitdad/` in your browser.

### Production build

```bash
npm run build
npm run preview
```

The `dist/` folder is fully self-contained and ready to deploy.

---

## Deployment

### GitHub Pages

1. Fork this repository
2. Go to your fork's Settings > Pages
3. Set source to GitHub Actions
4. Copy the workflow below into `.github/workflows/deploy.yml`

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      pages: write
      id-token: write
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist
      - uses: actions/deploy-pages@v4
```

Your app will be live at `https://your-username.github.io/fitdad/`.

### Vercel or Netlify

Both work with zero configuration. Connect your forked repository and set the build command to `npm run build` and the output directory to `dist`.

---

## Project structure

```
fitdad/
├── src/
│   ├── components/
│   │   ├── layout/       # Header, BottomNav
│   │   ├── onboarding/   # Multi-step setup wizard
│   │   ├── settings/     # SettingsModal, MealEditor, WorkoutEditor
│   │   ├── tabs/         # Home, Fast, Meals, Train, Log, Track
│   │   ├── track/        # ProgressView, JournalView, PhotosView
│   │   └── ui/           # Card, SubNav, Toggle, ProgressBar
│   ├── context/          # AppContext - global state management
│   ├── data/             # Default meals, workouts, shopping list, prep steps
│   ├── hooks/            # useTick, useLocalStorage
│   └── utils/            # storage, fasting, image, exportImport, notifications
├── public/
│   └── icons/            # PWA app icons
├── index.html
└── vite.config.js
```

---

## Contributing

Contributions are welcome and appreciated. Please read [CONTRIBUTING.md](CONTRIBUTING.md) before opening a pull request.

Areas where contributions would have the most impact:

- Additional meal plan templates (keto, Mediterranean, balanced)
- BMI and TDEE calculator
- Calorie deficit tracking
- Barcode food scanner integration
- Step counter integration (Web Pedometer API)
- Dark/light theme toggle
- Additional language translations
- Accessibility improvements

---

## License

MIT. See [LICENSE](LICENSE).

---

## A note on the name

"FitDad" started as a personal joke. I am a dad. I needed to get fit. The name stuck. The code works for anyone regardless of parental status, age, or gender. Everyone is welcome here.
