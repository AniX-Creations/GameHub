# AniX Creations GameHub

A browser-game collection by AniX Creations, rebuilding the original C/C++ projects as responsive web applications.

## Current games

### 1. Snake Challenge
- Modern and Classic visual themes
- Three difficulty levels and three maze layouts based on the original `SNAKE.C`
- Keyboard controls (arrow keys and WASD), pause/resume, and touch controls
- Scoring and locally saved personal best

### 2. The Letter Illusion
- Recreates the original number-to-letter magic trick from `ILLUSION.C`
- Guided instructions, a 1–99 number/letter board, and a reveal moment
- Modern and Classic visual themes
- Responsive layout

The trick follows the original arithmetic: choose a two-digit number, add its digits, then subtract that sum from the original number. The result is a multiple of nine. The program places the same hidden letter at each multiple-of-nine position on the board.

## Planned game

### 3. Solar System Explorer
A recreation of `OSS.CPP`, including an animated solar-system view, planet details, and the original ten-question quiz. The original quiz content will be reviewed separately so historical inaccuracies are not silently carried forward.

## Technology

- React + TypeScript
- Vite
- HTML5 and CSS
- Browser local storage for local preferences and scores
- Three.js is planned for the Solar System experience

## Run locally

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
npm run preview
```

## Original source preservation

The original C/C++ source files remain preserved separately in [AshishDesk/Personal-Projects](https://github.com/AshishDesk/Personal-Projects/tree/main/College-Projects). This repository contains the modern browser recreations and does not replace those original files.
