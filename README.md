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

The landing page features a hero header, "Why Choose Us" highlights, a call-to-action section that scrolls to the booking area, and a collapsible FAQ accordion with working download and contact links.
An inline Calendly widget in the booking section lets visitors schedule a call without leaving the site.

## SEO

The site is pre-rendered for fast load times. Key meta tags (description, keywords and Open Graph) are included in `index.html` for better search engine visibility. When adding images, remember to include descriptive `alt` text. Use concise, keyword-rich headings and keep copy focused on how AutoLink Global benefits resellers.
Meta tags now include robots, canonical, Open Graph (with locale and site name) and Twitter data.
