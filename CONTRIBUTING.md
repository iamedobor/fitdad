# Contributing to FitDad

Thank you for taking the time to contribute. This project exists because I wanted a tool that actually worked for real people, not a polished product built around a business model. Every improvement made here has the potential to help someone lose weight and feel better about themselves. That matters.

This document explains how to get set up, what the conventions are, and how to get your contribution merged.

---

## Getting started

1. Fork the repository on GitHub
2. Clone your fork locally

```bash
git clone https://github.com/your-username/fitdad.git
cd fitdad
npm install
npm run dev
```

3. Create a branch for your change

```bash
git checkout -b feat/your-feature-name
```

4. Make your changes, test them in the browser, and open a pull request against `main`

---

## What we need most

The following areas have the highest impact and are actively looked for:

**New meal plan templates**
The default plan is low-carb. Adding a keto, Mediterranean, or balanced plan would make the app useful to many more people. See `src/data/defaultMeals.js` for the expected shape.

**TDEE and calorie calculator**
Based on age, gender, height, weight, and activity level. Would plug into onboarding and the goals system.

**Calorie deficit tracking**
Compare eaten calories against a daily target. Progress bar in the home tab.

**Accessibility improvements**
Focus management, screen reader support, keyboard navigation for all interactive elements.

**Translations**
The app is currently English only. All user-facing strings live in the component files directly. A translation system would unlock a much wider audience.

**Additional fasting protocols**
5:2, OMAD, and alternate-day fasting are popular. The timer already supports custom windows; protocol-specific guidance would add real value.

---

## Code conventions

**React components**
Functional components only. No class components.

**State management**
Global app state lives in `src/context/AppContext.jsx`. Local UI state stays in the component. If you are adding a new persistent data type, add its key to `KEYS` in `src/utils/storage.js` and wire it up in the context.

**Styling**
Inline styles using CSS variables defined in `src/index.css`. We deliberately avoid build-time CSS solutions to keep the contributor surface small. Do not introduce Tailwind, CSS Modules, or styled-components without a discussion first.

**Icons**
All icons use [Lucide React](https://lucide.dev/). Do not use emoji as UI elements. Decorative emoji in user-facing body text is fine but keep it minimal and professional.

**No comments**
Only add a code comment if the reason for a choice would be non-obvious to another developer. A comment explaining what the code does is not useful. Comments explaining why are occasionally necessary.

**Commit messages**
Follow [Conventional Commits](https://www.conventionalcommits.org/). Examples:

```
feat: add TDEE calculator to onboarding
fix: fasting timer drifting by 1 second over long sessions
docs: add deployment guide for Netlify
chore: bump lucide-react to 0.410.0
```

---

## Pull request checklist

Before submitting a PR, please confirm:

- [ ] The app builds without errors (`npm run build`)
- [ ] The change works correctly in a mobile viewport (375px wide)
- [ ] No new emoji have been introduced as UI elements
- [ ] No console errors or warnings introduced
- [ ] The PR description explains what changed and why

---

## Reporting bugs

Open a GitHub Issue using the Bug Report template. Include the browser, device, and steps to reproduce. Screenshots are always appreciated.

## Requesting features

Open a GitHub Issue using the Feature Request template. Describe the problem you are trying to solve, not just the solution. Good feature requests explain the user need first.

---

## Code of conduct

Please read [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md). The short version: be respectful, be constructive, assume good intent.
