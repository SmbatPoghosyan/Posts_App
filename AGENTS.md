# AGENTS Instructions

This file guides OpenAI Codex and other AI agents working in this repository.

## Project Structure

- `/src` - React application source
  - `/components` - reusable components
  - `/assets` - images and static assets
- `/public` - static files served as-is
- `index.html` - entry HTML file
- `dist/` - generated build output (do not edit)

## Coding Conventions

- Use modern JavaScript (ES2020) with React 18.
- Prefer functional components and hooks.
- Tailwind CSS is the primary styling system. Follow the utility-first approach.
- Keep components small and focused with clear prop names.

## Programmatic Checks

Before committing any changes, ensure dependencies are installed and run:

```bash
pnpm install
pnpm run lint
pnpm run build
```

Both commands must succeed. Fix issues and rerun if needed.

## Repository Checks

Verify the repository is clean and directory layout matches the structure above:

```bash
git status --short
```

If you introduce new folders or files, keep them organized under `src`, `public`
and `dist` as documented in **Project Structure**.

## Localization

Translations live under `src/locales/<lang>/translation.json`. When modifying UI
copy, update every locale file with the new keys. To add a language:
1. Create a new folder under `src/locales` with a `translation.json` file.
2. Import it in `src/i18n.js` and include it in the `resources` object.
3. Ensure `pnpm run build` succeeds with the new language.

## Pull Requests

When creating a PR:

1. Summarize the purpose of the change.
2. Reference code snippets with file citations.
3. Mention lint and build results with terminal citations.
4. If commands cannot run due to environment limits, include the standard disclaimer.
