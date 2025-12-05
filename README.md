# Paws & Preferences: Find Your Favourite Kitty

An interactive swipe-style app that lets you like or pass on cats fetched live from the Cataas API, then shows a summary of your picks.

Try this app here:

https://malakapunche.github.io/Lovin-Kitty

## Features

- Swipe or tap buttons to like/pass (desktop + mobile)
- Progress counter for how many cats you have seen (15 total)
- Loading states on initial fetch and per-image loading
- Resilient image handling with fallback URLs and retry in the summary
- Summary screen with liked/passed counts, match rate, and restart
- GitHub Pages–ready (Vite base and `homepage` already set)

## How to Use

1. Swipe a card (or click the 👍 / 👎 buttons).
2. Keep going until you reach the end of the 15-card stack.
3. On the summary screen, review liked cats (with retry if an image fails) and tap **Start Over** to reset.

## Getting Started

### Prerequisites
- Node.js 18+ (works on 16+, recommended 18)
- npm (bundled with Node)

### Installation & Run
```bash
cd cat-swipe
npm install
npm run dev
```
Open `http://localhost:5173`.

## Scripts
- `npm run dev` – start Vite dev server
- `npm run build` – production build to `dist`
- `npm run preview` – preview the production build
- `npm run deploy` – build and publish `dist` to GitHub Pages (uses `gh-pages`)

## Deployment (GitHub Pages)
Vite `base` is set to `/Lovin-Kitty/` and `homepage` matches `https://malakapunche.github.io/Lovin-Kitty`. 

## Technologies
- React 18
- Vite
- react-tinder-card
- react-icons
- Cataas API (https://cataas.com/)



## Notes
- Fetches 15 random cats, each card uses fallback URLs on failures.
- Buttons trigger the same swipe logic as gestures.
- Fully responsive and touch-friendly.




