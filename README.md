# SEO Writing System

This repository now contains a runnable **Next.js + Netlify** starter for the multi-brand AI SEO content system.

## Quick start

```bash
npm install
npm run dev
```

Open:
- `http://localhost:3000/` → landing page
- `http://localhost:3000/dashboard` → dashboard scaffold
- `http://localhost:3000/api/health` → health check

## Deploy on Netlify

1. Connect the repo in Netlify.
2. Build command: `npm run build`.
3. Publish directory: managed by `@netlify/plugin-nextjs`.
4. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `ANTHROPIC_API_KEY`

## Included starter pieces
- App Router pages (root + dashboard).
- Netlify config (`netlify.toml`).
- Supabase migration starter in `supabase/migrations/001_initial_schema.sql`.
- Typed Supabase browser client utility.
- Anthropic client utility.
- Architecture blueprint doc in `docs/ai-seo-content-system-blueprint.md`.
