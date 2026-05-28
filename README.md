<div align="center">

# FitDad

### A structured system for losing fat, building strength, and staying consistent.

[![License: MIT](https://img.shields.io/badge/License-MIT-red.svg?style=flat-square&color=e63946)](LICENSE)
[![React](https://img.shields.io/badge/React-18-blue.svg?style=flat-square&logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF.svg?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![PWA](https://img.shields.io/badge/PWA-Ready-5A0FC8.svg?style=flat-square&logo=pwa&logoColor=white)](https://web.dev/progressive-web-apps/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](CONTRIBUTING.md)
[![Stars](https://img.shields.io/github/stars/iamedobor/fitdad?style=flat-square&color=e63946)](https://github.com/iamedobor/fitdad/stargazers)
[![Live Demo](https://img.shields.io/badge/Live-Demo-e63946.svg?style=flat-square)](https://iamedobor.github.io/fitdad/)

<br/>

**[Live Demo](https://iamedobor.github.io/fitdad/) · [Report a Bug](https://github.com/iamedobor/fitdad/issues/new?template=bug_report.md) · [Request a Feature](https://github.com/iamedobor/fitdad/issues/new?template=feature_request.md)**

</div>

---

## Why I built this

I struggled with my weight for years. I tried the apps, the meal plans, the subscriptions. Most of them were too complicated, too generic, or hiding the useful parts behind a paywall. I wanted something structured, science-backed, no noise, no upsells. Something that actually worked for my life.

So I built it myself. And then I open-sourced it so anyone can use it, fork it, and make it better.

FitDad combines intermittent fasting tracking, structured meal planning, progressive resistance training, and daily habit logging into one mobile-first app. It runs entirely in the browser. Your data never leaves your device.

---

## Features

| Feature | Description |
|---|---|
| **Fasting tracker** | Real-time countdown with circular SVG ring. Fully customisable window with presets (16:8, 14:10, 18:6, 20:4) or your own hours. |
| **Meal planning** | 7-day meal plan with full macros. Edit any meal to match your own preferences. Sunday prep guide and interactive shopping list. |
| **Workout programming** | Upper/lower split, 4 sessions per week. Home gym alternatives for every exercise. Full edit support: add, remove, or swap exercises. |
| **BMI calculator** | Computed from your profile. Colour-coded category (underweight / healthy / overweight / obese). |
| **TDEE + calorie target** | Mifflin-St Jeor formula with your activity multiplier. Choose gradual, moderate, or aggressive deficit. Weeks-to-goal countdown. |
| **Daily calorie tracking** | Ticking a meal on the Home tab adds its kcal to a live progress bar against your daily target. |
| **Habit log** | One-tap checklist for fasting window, each meal, workout, and water. Streak counter. |
| **Progress tracking** | Weight and waist log with SVG trend chart. Mood, energy, and sleep journal. Progress photos stored locally. |
| **Onboarding** | 6-step setup wizard: name, stats, activity level, diet type, fasting window. App personalises from day one. |
| **PWA** | Install from mobile browser. Works offline. No app store needed. |
| **Data ownership** | Everything in localStorage. Export a full JSON backup and restore it on any device. |

---

## Tech stack

<div align="center">

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)](https://vitejs.dev/)
[![JavaScript](https://img.shields.io/badge/JavaScript-323330?style=for-the-badge&logo=javascript&logoColor=F7DF1E)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![PWA](https://img.shields.io/badge/PWA-5A0FC8?style=for-the-badge&logo=pwa&logoColor=white)](https://web.dev/progressive-web-apps/)

</div>

- **React 18** - functional components, hooks, context API
- **Vite 5** - fast dev server, optimised production builds
- **Lucide React** - clean, consistent icon set
- **vite-plugin-pwa** - service worker, offline support, install prompt
- **localStorage** - all data stored client-side, zero backend

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

---

## Deployment

### GitHub Pages (recommended)

The repo ships with a GitHub Actions workflow at `.github/workflows/deploy.yml`. Every push to `main` automatically builds and deploys.

1. Fork this repository
2. Go to your fork's **Settings > Pages**
3. Set source to **GitHub Actions**
4. Push any change to `main` and the action handles the rest

Your app will be live at `https://your-username.github.io/fitdad/`.

### Vercel or Netlify

Connect your fork and set:
- Build command: `npm run build`
- Output directory: `dist`

Zero additional configuration required.

---

## Project structure

```
fitdad/
├── src/
│   ├── components/
│   │   ├── layout/       # Header, BottomNav
│   │   ├── onboarding/   # 6-step setup wizard
│   │   ├── settings/     # SettingsModal, MealEditor, WorkoutEditor
│   │   ├── tabs/         # Home, Fast, Meals, Train, Log, Track
│   │   ├── track/        # ProgressView, JournalView, PhotosView
│   │   └── ui/           # Card, SubNav, Toggle, ProgressBar
│   ├── context/          # AppContext - global state
│   ├── data/             # Default meals, workouts, shopping, prep steps
│   ├── hooks/            # useTick, useLocalStorage
│   └── utils/            # storage, fasting, tdee, image, exportImport, notifications
├── public/
│   └── icons/            # PWA app icons
├── .github/
│   ├── workflows/        # GitHub Pages deploy
│   └── ISSUE_TEMPLATE/   # Bug report, feature request
├── index.html
└── vite.config.js
```

---

## Roadmap

- [x] Fasting timer with customisable window
- [x] 7-day meal plan with macro breakdown
- [x] Upper/lower workout split with home alternatives
- [x] Custom meal and exercise editor
- [x] BMI calculator
- [x] TDEE and daily calorie target
- [x] Data export and import
- [x] PWA - install on mobile, works offline
- [ ] Keto meal plan template
- [ ] Mediterranean meal plan template
- [ ] Barcode food scanner
- [ ] Step counter integration
- [ ] Dark/light theme toggle
- [ ] Translations (i18n)
- [ ] 5:2 and OMAD fasting protocols

---

## Contributing

Contributions are welcome and genuinely appreciated. Read [CONTRIBUTING.md](CONTRIBUTING.md) first.

The highest-impact areas right now:

- **New meal plan templates** - keto, Mediterranean, balanced ([#1](https://github.com/iamedobor/fitdad/issues/1), [#2](https://github.com/iamedobor/fitdad/issues/2))
- **Accessibility improvements** - keyboard nav, focus management, ARIA ([#4](https://github.com/iamedobor/fitdad/issues/4))
- **Light/dark theme toggle** - CSS variable swap ([#5](https://github.com/iamedobor/fitdad/issues/5))

**[See all open issues →](https://github.com/iamedobor/fitdad/issues?q=label%3A%22good+first+issue%22)**

---

## License

MIT. Use it, fork it, build on it. See [LICENSE](LICENSE).

---

<div align="center">

**If FitDad helped you or someone you know, a star means a lot. It helps more people find it.**

---

### Built by

**Osasere Edobor**

[![Website](https://img.shields.io/badge/Website-e63946?style=flat-square&logo=google-chrome&logoColor=white)](https://edoborosasere.com)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=flat-square&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/osasere-edobor)
[![Twitter](https://img.shields.io/badge/Twitter-1DA1F2?style=flat-square&logo=twitter&logoColor=white)](https://twitter.com/sere_edobor)
[![Instagram](https://img.shields.io/badge/Instagram-E4405F?style=flat-square&logo=instagram&logoColor=white)](https://www.instagram.com/sere_edobor)
[![Facebook](https://img.shields.io/badge/Facebook-1877F2?style=flat-square&logo=facebook&logoColor=white)](https://www.facebook.com/edobor.osasere1)
[![Email](https://img.shields.io/badge/Email-e63946?style=flat-square&logo=gmail&logoColor=white)](mailto:projects@edoborosasere.com)

Open to collabs, contributors, and ideas. Reach out.

</div>
