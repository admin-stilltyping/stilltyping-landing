# stilltyping landing page

Standalone React + TypeScript + Vite project for the public stilltyping website.
All source, styles, assets and build configuration live here; this project does
not depend on the nivaso-frontend directory.

Live site: https://nivaso-landing.vercel.app/

## Local development

Use Node.js 22.12 or newer.

```sh
npm ci
npm run dev
```

Open http://127.0.0.1:5175/.

## Build and preview

```sh
npm run build
npm run preview
```

The build runs TypeScript checks and writes the static site and redirects to
`.vercel/output` using Vercel's Build Output API. `npm run typecheck` runs
just the TypeScript checks.

## Project files

- `src/LandingPage.tsx`: landing page and interactive demos
- `src/landing.css`: colors, layout and animation
- `src/main.tsx`: application entry point
- `public/stilltyping.svg`: favicon
- `config.mjs`: business portal URL for login, signup and privacy links
- `package-output.mjs`: production routing and portal redirects

## Deploy to the existing Vercel project

Sign in to Vercel with `mr032495@gmail.com`, then run:

```sh
npm run build
npx vercel@59.17.0 deploy --prebuilt --prod --scope muthuram05s-projects
```

This local project includes the existing Vercel project link in
`.vercel/project.json`. It contains project identifiers only; authentication
is managed by Vercel CLI. Because `.vercel` is ignored by Git, on a fresh
checkout restore the link first:

```sh
npx vercel@59.17.0 login
npx vercel@59.17.0 link --project nivaso-landing --scope muthuram05s-projects
```

Account actions continue to the business portal at
https://nivaso-frontend.vercel.app. Changing the local project location does
not change the current production deployment.
