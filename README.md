# My Portfolio

Personal portfolio site built from a Figma design, with an AI-backed chat widget in the hero.

## Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS v4 (CSS-first `@theme` tokens in `app/globals.css`)
- Framer Motion (scroll-reveal animations)
- Anthropic API (server-side, for the hero chat widget)

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
- `lib/` — chat seed data and the chat system prompt
- `docs/superpowers/` — the design spec and implementation plan this build followed

## Scope

This build covers the **homepage** only. The Figma file also contains About, Case Study List/Detail, Contact, Privacy Policy, Terms & Conditions, and a 404 page (plus responsive variants) — see `docs/superpowers/specs/2026-08-15-portfolio-homepage-design.md` for what's in and out of scope. The FAQ section currently shows a single question, because that is the only FAQ item with authored answer text in the Figma source; the remaining questions can be added once their answers are written.
