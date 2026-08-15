# My Portfolio

Personal portfolio site built from a Figma design, with an AI-backed chat widget in the hero.

## Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS v4 (CSS-first `@theme` tokens in `app/globals.css`)
- Framer Motion (scroll-reveal animations)
- Anthropic API (server-side, for the hero chat widget)

## Setup

1. `npm install`
2. Copy `.env.local.example` to `.env.local` and set `ANTHROPIC_API_KEY` to a real key from https://console.anthropic.com/settings/keys
3. `npm run dev` and open http://localhost:3000

Without an API key set, the site runs fine but the hero chat widget will show a friendly "having trouble connecting" fallback instead of real AI replies.

## Scripts

- `npm run dev` — start the dev server
- `npm run build` — production build
- `npm run start` — serve the production build
- `npm run lint` — run ESLint

## Project structure

- `app/page.tsx` — the homepage, composing all sections in order
- `app/api/chat/route.ts` — server-side streaming endpoint for the chat widget (calls Anthropic)
- `components/` — Navbar, Footer, ChatWidget, and reusable pieces
- `components/sections/` — one component per homepage section (Hero, Capabilities, Process, Result, TechStack, WaysToWork, Faq, Cta, etc.)
- `hooks/useScrollSpy.ts` — highlights the active section in the hero sidebar nav
- `lib/` — chat seed data and the chat system prompt
- `docs/superpowers/` — the design spec and implementation plan this build followed

## Scope

This build covers the **homepage** only. The Figma file also contains About, Case Study List/Detail, Contact, Privacy Policy, Terms & Conditions, and a 404 page (plus responsive variants) — see `docs/superpowers/specs/2026-08-15-portfolio-homepage-design.md` for what's in and out of scope. The FAQ section currently shows a single question, because that is the only FAQ item with authored answer text in the Figma source; the remaining questions can be added once their answers are written.
