# Birendra Mishra frontend

Next.js App Router frontend. The original HTML templates and stylesheet are kept under `templates/` and `public/css/` so the existing page design remains intact. Content is read from the read-only Strapi endpoints; when Strapi is unavailable, the original template copy supplies the page text.

## Run locally

Use Node.js 20.9 or newer.

```sh
npm install
Copy-Item .env.example .env.local
npm run dev
```

The site runs at `http://localhost:3000`. Set `STRAPI_API_URL` to the backend origin (default `http://localhost:1337`) and `NEXT_PUBLIC_SITE_URL` to the canonical public domain. The Strapi public endpoints are `/api/site-content/homepage` and `/api/site-content/pages/:slug`.

Routes keep the existing `.html` URLs for booking, privacy, terms and booking management. Page metadata comes from each published Strapi page SEO component with template defaults as fallback. `robots.txt` excludes booking management, and `sitemap.xml` contains public pages.
