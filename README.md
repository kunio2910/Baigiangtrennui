# Kito

## SEO and local verification

The Vercel handlers render homepage cards, category pagination and article content into
HTML before JavaScript runs. Existing CSS and client interactions are retained.

- `node tests/seo.cjs`: offline checks for HTML, sitemap, redirects, outages and admin URL stability.
- `node scripts/seo-preview.cjs --fixture`: preview the handlers at http://127.0.0.1:4175 using test data.
- `node --use-system-ca scripts/seo-preview.cjs`: preview with read-only public Firestore data.
- `node tests/seo-browser.cjs`: starts its own fixture server and checks desktop/mobile, search,
  pagination and JavaScript-disabled navigation. Requires Playwright and Edge; set
  `PLAYWRIGHT_MODULE` to its module path if it is not installed locally.
- `node --use-system-ca scripts/seo-live-check.cjs`: read-only verification with current public
  data, including comparison of content URLs against the deployed sitemap.

The shared source cache refreshes after 60 seconds. On a source error, a warm instance
can reuse verified data for up to one hour. A cold instance or expired cache returns
503 with `Retry-After` and `no-store`; no sample URLs are returned. This is an in-memory
cache per serverless instance, not persistent storage.

Before an admin saves/deletes a content record, legacy slugs are pinned in Firestore
without changing their current URLs or modification dates. New articles get unique,
fixed slugs. Explicit slug changes preserve `previousSlugs` for permanent redirects.
This migration runs through the existing admin permissions; no database migration is
performed merely by deploying or viewing the site. Source imports should preserve
`seoSlug`, `previousSlugs` and `contentUpdatedAt`.

`contentUpdatedAt` tracks editorial changes; ratings and ordering update only
`updatedAt`. Sitemap and article schema use the editorial timestamp, falling back
to the creation date for older records.
