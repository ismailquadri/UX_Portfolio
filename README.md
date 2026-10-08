# My Portfolio

Personal portfolio site built from a Figma design, with an AI-backed chat widget in the hero.

## Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS v4 (CSS-first `@theme` tokens in `app/globals.css`)
- Framer Motion (scroll-reveal animations)
- Anthropic API (server-side, for the hero chat widget)
- Source-backed RAG retrieval over case studies, FAQ content, and selected public professional profiles

## Setup

1. `npm install`
2. Copy `.env.local.example` to `.env.local` and set the keys needed for the features you are running:
   - `ANTHROPIC_API_KEY` for the server-side chat endpoint
   - `NEXT_PUBLIC_TURNSTILE_SITE_KEY` and `TURNSTILE_SECRET_KEY` to enable bot checks on chat and contact forms
   - `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, and `CONTACT_TO_EMAIL` for contact form email delivery
3. `npm run dev` and open http://localhost:3000

Keep private keys in `.env.local` or your deployment provider's encrypted environment settings. Never add them to client code or commit them. Production chat and contact requests fail closed when Turnstile configuration is missing.

## Scripts

- `npm run dev` — start the dev server
- `npm run build` — production build
- `npm run start` — serve the production build
- `npm run lint` — run ESLint

GitHub Actions runs lint and a production build for pushes and pull requests to `master`.

## Project structure

- `app/page.tsx` — the homepage, composing all sections in order
- `app/api/chat/route.ts` — server-side streaming endpoint for the chat widget (calls Anthropic)
- `components/` — Navbar, Footer, ChatWidget, SiteSidebar, MobileNav, and reusable pieces
- `components/SiteSidebar.tsx` — shared sticky left-hand page navigation shown on every page at desktop widths
- `components/MobileNav.tsx` — hamburger-triggered dropdown menu in the Navbar for mobile widths
- `components/sections/` — one component per homepage section (Hero, Capabilities, Process, Result, TechStack, WaysToWork, Faq, Cta, etc.)
- `lib/` — chat prompt, request safeguards, and knowledge retrieval
- `content/public-knowledge.json` — curated public-profile records with source links and freshness notes
- `docs/superpowers/` — the design spec and implementation plan this build followed

## Scope

The portfolio includes the homepage, case studies, and contact page. The FAQ answers are maintained in `lib/faq-data.ts` and are also available to the chat knowledge retrieval layer.

## Chat knowledge sources

The chat retrieves relevant evidence from the published case studies and FAQ, plus curated records from Quadri's public LinkedIn, Behance, and GitHub profiles. Public-profile records keep the source URL and a freshness note; profile listings and older availability indicators must not be treated as verified or current facts. Add or update curated records in `content/public-knowledge.json` when a public source changes. The chat uses lightweight BM25 keyword retrieval over these version-controlled documents, so it does not require an additional database account or embedding key for this small portfolio corpus.
