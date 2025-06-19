# Autolink Global Landing

This repo contains the marketing landing page for **AutoLink Global** resellers. It's a React 18 single-page site built with Vite, Tailwind CSS and Framer Motion.

## Requirements
- Node.js 18+
- [pnpm](https://pnpm.io/) package manager

## Development
Install dependencies and start the Vite dev server:

```bash
pnpm install
pnpm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Scripts
- `pnpm run dev` – run a local dev server
- `pnpm run build` – generate a production build in `dist/`
- `pnpm run preview` – locally preview the production build
- `pnpm run lint` – run ESLint over `src`

## CI
A simple GitHub Actions workflow installs dependencies and verifies the build on every push.

## File structure
```
├─ .github/workflows/ci.yml     # build workflow
├─ public/catalog.pdf           # placeholder catalog file
├─ index.html                   # entry html
├─ src/
│  ├─ App.jsx                   # renders LandingPageReseller
│  ├─ main.jsx                  # bootstraps React app
│  ├─ components/
│  │  └─ LandingPageReseller.jsx
│  └─ assets/                   # place logo.png here
```

The landing page includes a FAQ accordion, download link to `catalog.pdf`, contact links and animated CTAs.
