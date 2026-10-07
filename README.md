# stilltyping landing page

Standalone React + TypeScript + Vite project for the public stilltyping website.
All source, styles, assets and build configuration live here; this project does
not depend on the nivaso-frontend directory.

Live site and canonical domain: https://stilltyping.in/

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
npm test
npm run preview
```

The build runs TypeScript checks, builds the browser and rendering bundles, and
prerenders each public page into HTML in `.vercel/output/static`. React hydrates
that HTML to enable the homepage demos and mobile menu. Page text, navigation,
metadata and FAQs are available without JavaScript. `npm run typecheck` runs
just the TypeScript checks. `npm test` checks the built artifact over HTTP,
including metadata, redirects, sitemap, asset links and real 404 responses.
The production preview is available at http://127.0.0.1:5176/.

## Project files

- `src/LandingPage.tsx`: homepage and interactive demos
- `src/content.ts`: product guide content, page titles and descriptions
- `src/Site.tsx`: product guide and 404 page rendering
- `src/landing.css`, `src/guides.css`: colors, layout and animation
- `src/main.tsx`, `src/entry-server.tsx`: hydration and build-time rendering
- `public/stilltyping.png`: existing logo, favicon and social sharing image
- `config.mjs`: canonical domain, legacy domain redirects and business portal URL
- `scripts/seo.mjs`: canonical, social metadata and JSON-LD generation
- `package-output.mjs`: prerendered HTML, sitemap, robots and Vercel routing
- `scripts/preview.mjs`: local preview of the generated Vercel route order

## Deploy to the existing Vercel project

Sign in to a Vercel account with access to the `admin-stilltyping` team, then
link this checkout to the existing project:

```sh
npx vercel@59.17.0 login
npx vercel@59.17.0 link --project stilltyping-landing --scope admin-stilltyping
```

The project link is saved in `.vercel/project.json`, which is ignored by Git.
It contains project identifiers only; authentication is managed by Vercel CLI.
Build and check the production artifact before publishing:

```sh
VERCEL_ENV=production npm run build
npm test
npx vercel@59.17.0 deploy --prebuilt --prod --scope admin-stilltyping
```

Account actions continue to the business portal at
https://nivaso-frontend.vercel.app. Changing the local project location does
not change the current production deployment.

## SEO and public pages

The public routes are `/`, `/ai-customer-support`, `/website-chatbot`, and
`/appointment-booking`. Each has its own title, description, canonical URL,
Open Graph and Twitter metadata, and Organization/WebSite/WebPage JSON-LD.
Guide pages also include breadcrumbs. The existing square logo is used for
social previews; no customer ratings, prices or performance claims are invented.

`sitemap.xml` includes only these canonical public URLs. `robots.txt` points to
the sitemap and allows crawling. Missing URLs return the 404 document with an
HTTP 404 status and `noindex`, instead of returning the homepage. `/login`,
`/signup`, and `/privacy` continue to redirect to the business portal.

The known `www.stilltyping.in`, `stilltyping-landing.vercel.app`, and
`nivaso-landing.vercel.app` hosts redirect permanently to `https://stilltyping.in`.
Preview deployment hostnames are left available for review. Builds with
`VERCEL_ENV=preview` emit `noindex` metadata and an `X-Robots-Tag: noindex` header;
build production artifacts with `VERCEL_ENV=production` (or unset locally).
The canonical domain remains `stilltyping.in` in both cases.

### Product evidence behind the copy

The product pages describe implemented behavior in the companion repositories:

- Backend `src/public_chat/routes.py` and frontend
  `web/src/features/public-chat/WebChatSetup.tsx`: a public chat link and widget.
- Backend `src/context_agent/agent.py`, `src/knowledge_base/routes.py`, and
  `src/context_agent/tools.py`: business knowledge, instructions and support tickets.
- Backend `src/crm/service.py`: optional enquiry capture and customer conversion.
- Backend `src/appointments/agent_tools.py`: appointment requests with active
  services, required contact details and staff confirmation. The copy explicitly
  states that booking does not check live staff availability or reserve a slot.
- Frontend `web/src/pages/auth/SignupPage.tsx`: approval and requested modules.

Examples are labelled as illustrative. Review these claims against the product
whenever booking, support or onboarding behavior changes.

### Search Console and measurement

Search Console setup is separate from deployment. When ready, verify the
`stilltyping.in` domain property using Google's DNS record, or verify the
`https://stilltyping.in/` URL-prefix property. The build supports an optional
`GOOGLE_SITE_VERIFICATION` environment variable for Google's HTML-tag token;
it is omitted when unset. Do not put account credentials in this repository.

After verification, submit `https://stilltyping.in/sitemap.xml`, inspect the
homepage and guide URLs, and check Google's rendered HTML and chosen canonical.
Monitor indexing, search queries and clicks over time. Search Console does not
measure completed portal signups. Conversion analytics requires a separate
analytics property and instrumentation in the signup flow; this change does
not add tracking or claim to measure conversions.

Run PageSpeed Insights against the production URLs after release to collect
mobile lab measurements and available Core Web Vitals field data. Static
rendering removes the dependency on JavaScript for initial page content, but
does not by itself establish a performance score or guarantee search rankings.
