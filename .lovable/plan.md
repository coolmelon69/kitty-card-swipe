

# Paws & Preferences — Cat Swiping App

## Overview
A mobile-first single-page app where users swipe through 15 cat photos (Tinder-style), then see a summary of their liked cats.

## Flow
1. **Loading Screen** — Playful animation while fetching 15 cats from Cataas API
2. **Swipe Interface** — Stack of draggable photo cards with like/dislike gestures + buttons
3. **Summary Screen** — Shows liked cats in a grid with "Play Again" button

## Key Implementation Details

### Data & API
- Fetch from `https://cataas.com/api/cats?limit=15`, construct image URLs as `https://cataas.com/cat/[id]`
- Store swipe results (liked/disliked) in React state

### Swipe Cards (Framer Motion)
- Install `framer-motion` package
- Draggable top card with rotation based on drag direction
- Cards stacked with slight scale/offset so the next card peeks through
- Swipe right = like, swipe left = dislike (threshold-based)
- Spring animations for snap-back and fly-off
- Like/Dislike overlay indicators appear while dragging

### Action Buttons
- Heart button (like) and X button (dislike) below the card stack
- Trigger the same animated swipe-off as manual dragging

### Loading Screen
- Cat paw icon with bounce/pulse animation
- Fun text like "Herding cats..."

### Summary Screen
- Title: "You liked X kitties!" with emoji
- Grid of liked cat images (rounded corners, shadows)
- "Play Again" button that re-fetches and resets state

### UI/UX
- Warm color palette: soft coral/pink primary, warm cream background, dark text
- `overflow: hidden` on body to prevent scroll during swipes
- Rounded cards with soft shadows for tactile feel
- Mobile-first layout, centered content, max-width container
- Smooth transitions between views using Framer Motion's AnimatePresence

### Pages & Routing
- Single page app, no routing needed — state-driven view switching (loading → swiping → summary)

