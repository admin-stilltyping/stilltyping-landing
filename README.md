# stilltyping landing page

Standalone React + TypeScript + Vite project for the public stilltyping website.
All source, styles, assets and build configuration live here; this project does
not depend on the business portal source directory.

Netlify deployment: https://stilltyping-landing.netlify.app/

Canonical domain: https://stilltyping.in/.

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

## Deploy to Netlify through GitHub

Connect `admin-stilltyping/stilltyping-landing` to the Stilltyping Netlify team
(`admin-stilltyping`) and use `main` as the production branch. Deploy from GitHub;
do not upload build archives manually. The root `netlify.toml` configures:

- Build command: `npm run build:netlify`
- Publish directory: `dist`
- Node version: `22.12.0`
- Domains: `stilltyping.in` and `www.stilltyping.in`, with the apex primary

Run `npm ci`, `npm run build:netlify`, and `npm test` before publishing changes.
The build contains prerendered public pages, assets, `_redirects`, and `_headers`.
Netlify deploy previews and branch deployments are marked `noindex`.
Production retains the `https://stilltyping.in` canonical domain.

`/privacy` is served directly by this project and lists `support@stilltyping.in`.
`/login` and `/signup` redirect to `https://app.stilltyping.in`. The business
portal and API are separate deployments; publishing this landing page does not
restore an unavailable API.

GoDaddy is the registrar. Preserve MX, SPF, DKIM, DMARC, autodiscovery,
domain-connect, Google verification, and CAA records when changing DNS providers
or Netlify teams. The old manual projects in Muthuram05's team were deleted on
2026-10-10 at the owner's request. The DNS zone was retained to preserve email;
its ownership must be handled when adding domains in the Stilltyping team.

## Existing Vercel integration

The repository also has a Vercel integration under `admin-stilltyping`.
Vercel builds are separate from Netlify deployments. The source still supports
`npm run build` for the Vercel artifact and local HTTP tests, but the production
Netlify project must use `npm run build:netlify`.

## SEO and public pages

The public routes are `/`, `/ai-customer-support`, `/website-chatbot`,
`/appointment-booking`, and `/privacy`. Each has its own title, description, canonical URL,
Open Graph and Twitter metadata, and Organization/WebSite/WebPage JSON-LD.
Guide pages also include breadcrumbs. The existing square logo is used for
social previews; no customer ratings, prices or performance claims are invented.

`sitemap.xml` includes only these canonical public URLs. `robots.txt` points to
the sitemap and allows crawling. Missing URLs return the 404 document with an
HTTP 404 status and `noindex`, instead of returning the homepage. `/login`,
and `/signup` redirect to the business portal. `/privacy` stays on this site.

The `www.stilltyping.in` and `stilltyping-landing.vercel.app` hosts redirect
permanently to `https://stilltyping.in`. Preview deployment hostnames are left
available for review. Builds with
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
