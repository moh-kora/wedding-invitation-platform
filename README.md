# Everly — Luxury Wedding Invitation Platform

A mobile-first digital wedding invitation platform with elegant templates, bilingual support, RSVP-ready invitation pages, and one-link sharing.

## Current platform
- React + Vite
- Responsive luxury landing page
- English / Arabic language toggle
- Invitation builder with live preview
- Three invitation templates
- Persistent invitation publishing with Supabase
- Owner authentication and dashboard
- Wedding schedule management
- Dress code, story and custom invitation colors
- Cover and gallery media uploads through Supabase Storage
- Public invitation pages with countdown, sharing and Google Calendar support
- Guest RSVP form with Supabase persistence
- WhatsApp RSVP shortcut
- Responsive image gallery with lightbox
- GitHub Pages deployment via GitHub Actions
- Supabase Row Level Security and storage policies

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Supabase setup

The repository includes [`supabase/schema.sql`](./supabase/schema.sql), which creates the invitation, gallery, event and RSVP tables with Row Level Security policies.

Create a Supabase project, run the SQL, create a public Storage bucket named `invitation-media`, and configure:

```env
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Use `.env.example` as the template. Never commit service-role keys or other private credentials.

The app also contains a browser-safe fallback configuration for the connected demo environment, while environment variables remain the recommended deployment configuration.

## Deployment

The production site is deployed to GitHub Pages using the workflow in `.github/workflows/deploy.yml`.

Invitation links use hash routing for GitHub Pages compatibility:

```text
https://moh-kora.github.io/wedding-invitation-platform/#invite/<slug>
```

For clean URLs such as `/invite/jasmine-omar`, a host with SPA rewrite support such as Vercel or Netlify can be used later.

## Product roadmap
1. Premium template library
2. Advanced guest management and RSVP analytics
3. Custom domains
4. Subscription and payment plans
5. Admin and franchise management
