# 🐱 Paws & Preferences: Find Your Favourite Kitty

A fun, interactive web application that helps you discover what kind of cats you prefer through a Tinder-like swipe interface!

## Features

- ✨ **Swipe Gestures**: Swipe right to like, swipe left to pass
- 📱 **Mobile-First Design**: Optimized for touch interactions on mobile devices
- 🎨 **Smooth Animations**: Beautiful card transitions and visual feedback
- 📊 **Summary View**: See all your liked cats at the end
- 🐾 **Cataas Integration**: Real cat images from the Cataas API

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd cat-swipe
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Building for Production

To build the app for production:

```bash
npm run build
```

The built files will be in the `dist` directory.

## Deploying to GitHub Pages

### Step 1: Update Vite Config

1. Open `vite.config.js`
2. Uncomment and update the `base` property with your repository name:
```js
export default defineConfig({
  plugins: [react()],
  base: '/cat-swipe/', // Replace 'cat-swipe' with your repo name
})
```

### Step 2: Install gh-pages (Optional but Recommended)

```bash
npm install --save-dev gh-pages
```

### Step 3: Add Deploy Scripts to package.json

Add these scripts to your `package.json`:

```json
{
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

### Step 4: Deploy

```bash
npm run deploy
```

This will:
1. Build your app
2. Deploy the `dist` folder to the `gh-pages` branch
3. Make your site available at `https://<username>.github.io/<repo-name>/`

### Alternative: Manual GitHub Pages Setup

1. Build the project: `npm run build`
2. Go to your repository on GitHub
3. Navigate to Settings → Pages
4. Under "Source", select "Deploy from a branch"
5. Choose the `gh-pages` branch and `/` (root) folder
6. Click Save

## How to Use

1. **Swipe Right** (or click ❤️): Like the cat
2. **Swipe Left** (or click ❌): Pass on the cat
3. **View Summary**: After swiping through all cats, see your favorites!

## Technologies Used

- React 19
- Vite
- Cataas API (https://cataas.com/)
- CSS3 (with animations and gradients)

## Project Structure

```
cat-swipe/
├── src/
│   ├── components/
│   │   ├── CatCard.jsx      # Individual cat card with swipe functionality
│   │   ├── CatCard.css
│   │   ├── Summary.jsx      # Summary view showing liked cats
│   │   └── Summary.css
│   ├── App.jsx              # Main app component
│   ├── App.css
│   ├── index.css            # Global styles
│   └── main.jsx             # Entry point
├── public/
├── index.html
└── package.json
```

## Notes

- The app fetches 15 cat images from the Cataas API
- All swipe gestures work on both desktop (mouse) and mobile (touch)
- The app is fully responsive and optimized for mobile devices

## License

This project is created for educational purposes.
