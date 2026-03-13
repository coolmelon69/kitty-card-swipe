# 🐾 Paws & Preferences

A Tinder-style cat swiping app built as an interview project. Swipe through random cat photos, like or nope them, and see a summary of your favorites at the end.

## Features

- Swipe cards left/right with drag gestures or button controls
- Fetches 20 random cats from the [CATAAS](https://cataas.com) API
- LIKE / NOPE stamp overlays with spring animations
- Summary screen displaying all liked cats
- Dark / light mode toggle
- Fully responsive

## Tech Stack

- **React 18** + **TypeScript**
- **Vite** — dev server & bundler
- **Framer Motion** — card drag, spring animations
- **Tailwind CSS** + **shadcn/ui** — styling & components
- **CATAAS API** — cat image source

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Run unit tests
npm test

# Build for production
npm run build
```

## How It Works

1. On load, 20 cat images are fetched from `cataas.com/api/cats`
2. Cards are stacked; the top card is draggable
3. Drag past the threshold (80px) or flick quickly to swipe — right = like, left = nope
4. After all cards are judged, a summary screen shows your liked cats
5. Hit **Play Again** to fetch a fresh batch
