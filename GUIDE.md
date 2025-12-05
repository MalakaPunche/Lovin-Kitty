# 🐱 Cat Swipe App - Complete Guide

## ✅ What's Been Built

The app meets the assignment requirements with extra resilience and polish.



### Core Features

1. ✅ Single-page swipe deck of 15 cats from Cataas

2. ✅ Swipe gestures **and** button controls (right = like, left = pass)

3. ✅ Summary view with liked grid, counts, and match rate

4. ✅ Mobile-friendly via `react-tinder-card`

5. ✅ Progress counter showing cards viewed

6. ✅ Loading + error handling with fallbacks and retry



### Polish

- LIKE/NOPE visual indicators during swipes

- Buttons trigger the same swipe logic as gestures

- Per-image loading state and fallback URLs (deck + summary)

- Summary retry button for failed images and a Start Over reset



## 🚀 Quick Start

```bash

cd cat-swipe

npm install

npm run dev

```

Open `http://localhost:5173`.



### Interaction tips

- Desktop: drag cards or click 👍 / 👎

- Mobile: swipe horizontally

- Finish all 15 cards to view the summary; use **Start Over** to reset.



## 📦 Build & Preview

```bash

npm run build    # outputs to dist/

npm run preview  # serve the production build locally

```



## 🌐 Deploying to GitHub Pages

`vite.config.js` already uses `base: '/Lovin-Kitty/'` and `package.json` sets `homepage` to `https://malakapunche.github.io/Lovin-Kitty` for GitHub Pages.



If you fork/rename the repo, update both to your repo slug and Pages URL, then run:

```bash

npm run deploy

```

This builds and publishes `dist` to the `gh-pages` branch using `gh-pages`.




## 🎨 Customization

- **Number of cats**: change `TOTAL_CATS` in `src/App.jsx`.

- **Branding/colors**: adjust gradients and buttons in `src/App.css`.

- **Repo base/URL**: keep `base` and `homepage` in sync with your GitHub Pages URL.



## 🐛 Troubleshooting

- **Images not loading**: ensure internet/Cataas availability. Cards and summary auto-try fallback URLs; summary has a Retry button.

- **Gestures not triggering**: on desktop, drag horizontally or use the buttons; on mobile, swipe sideways.

- **Build errors**: confirm Node 16+ (prefer 18) and reinstall deps (`npm install`).



## 💡 Tips

- Use the summary Retry button for any failed images.

- Keep `base`/`homepage` aligned with your repo name before deploying.

- Buttons mirror swipes—handy for quick desktop testing.




