# Everly — Luxury Wedding Invitation Platform

A mobile-first digital wedding invitation platform with elegant templates, bilingual support, RSVP-ready invitation pages, and one-link sharing.

## Current foundation
- React + Vite
- Responsive luxury landing page
- English / Arabic language toggle
- Invitation builder and live preview
- Public invitation experience with countdown, sharing, calendar, gallery and RSVP
- GitHub Pages deployment workflow
- Production-ready Supabase schema and persistence abstraction

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Production backend

The repository now includes [`supabase/schema.sql`](./supabase/schema.sql), which creates invitations, galleries and RSVPs with Row Level Security.

Create a Supabase project, run that SQL, create a Storage bucket named `invitation-media`, then configure:

```env
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Use `.env.example` as the template. Never commit real credentials.

The browser-only MVP remains functional when these values are absent. Once Supabase credentials are supplied, the next integration step is to connect authentication, persistent invitation publishing, RSVP storage, media uploads and the owner dashboard.

## Deployment note

GitHub Pages works for the current static MVP using hash invitation URLs. For clean permanent URLs such as `/invite/jasmine-omar`, use a host that supports SPA rewrites (such as Vercel or Netlify) when the production backend is connected.

## Roadmap
1. Authentication
2. Persistent invitation publishing
3. Guest RSVP dashboard
4. Image/media uploads
5. Admin dashboard
6. Premium template library
7. Custom domains and subscriptions
