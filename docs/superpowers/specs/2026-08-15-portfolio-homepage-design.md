# Portfolio Homepage — Design Spec

## Source

Figma file: `Personal Portfolio` (fileKey `0IyCORj0osd1Dzx8Q7S7Eh`), page "⚙️ ・ Workspace".
This spec covers only the desktop homepage frame (node `7001:1391`, "Personal Portofolio").
The file also contains About, Case Study List/Detail, Contact, Privacy Policy, Terms & Conditions,
and 404 pages with responsive variants — those are out of scope for this spec and will get their
own specs in a later phase.

## Goal

Build a fully interactive, pixel-accurate implementation of the homepage, including a working
AI-backed chat widget in the hero, as a real Next.js site (not a static mockup).

## Stack

- Next.js 15 (App Router) + TypeScript
- Tailwind CSS, theme extended with tokens pulled from Figma (see Design Tokens below)
- Framer Motion for scroll-reveal and micro-interactions
- Anthropic API (server-side) for the chat widget
- Repo: `~/Projects/my-portfolio`, deploy target: Vercel (not set up in this phase)

## Design Tokens (from Figma variables)

- Fonts: `Inter Tight` (body — weights Regular/Medium), `Instrument Serif` (headings)
- Colors: `#000000` (Black), `#FFFFFF` (White), `#EFEFEF` (Bright Gray / borders),
  `#FAFAFA` (Lotion / subtle bg), `#112527` (Dark Jungle Green / accent text),
  `#707070` (Text/Normal), `#505050`
- Spacing scale: 2, 4, 6, 8, 10, 12, 14, 16, 20, 24, 32, 40, 48, 56, 80 (px)
- Radius scale: 8, 16, 24, full (9999)
- Typography scale examples: Body1 Medium 18px, Body2 Regular/Medium 16px, Body3 12/14px,
  Heading2 (Instrument Serif) 56px, Heading3 32px, Heading4 24px
- Button shadow: two stacked drop shadows (`#0000000F` 0/1/0/0, `#0000000A` 0/2/4/0)

Exact values will be pulled per-component via `get_design_context` during implementation rather
than hardcoded from this list alone — this section is a reference, not the source of truth.

## Page Structure (top to bottom)

1. **Navbar** — logo, nav links, CTA button, sticky on scroll
2. **Hero** — full-bleed illustrated background, left scroll-spy sidebar nav
   (Send me Messages / Capability / Process / The Result / What They Said / Pricing / FAQ),
   and the AI chat widget (see below)
3. **Capabilities** — "I don't bring dreams, I bring solutions for your Business" — 4 service
   cards (AI Audit, User Segmentation & Insights, Web/UI Design & Prototyping, MVP/Product
   Development) + skill tags (Fullstack, Airaday, PixelFlow, Compass Staff)
4. **Process** — "A Process Rooted in Clarity & Insight" — numbered steps
   (Define Objectives, Heuristic Evaluation, User Flow Analysis, Estimated Data Analysis)
   with a device mockup illustration
5. **Proof/Results** — "Every product starts as an idea, but not every idea becomes a
   product." — two case-study image tiles side by side + "View It Live" / "Get My Prototype"
   CTAs
6. **Tech Stack grid** — "Connected Weapons for Modern Design" — icon grid (Figma, Sketch,
   VS Code, Slack, Notion, etc.)
7. **Ways to Work Together** — 3 engagement-model cards: Full-Time Roles, Contract / Freelance,
   Advisory & Mentorship
8. **FAQ** — accordion, 5 questions (project approach, tools/platforms, timelines, redesign
   vs new, starting small)
9. **CTA banner** — "Let's Turn Your Idea Into a Product That Works." over illustrated
   background
10. **Footer** — name/tagline, "Get in touch with me" (hello@mike.com), copyright, socials

Each section is its own component under `components/sections/*.tsx`, built against the actual
Figma node via `get_design_context` so spacing/type/color match exactly rather than being
eyeballed from screenshots.

### Interactions

- Left sidebar in the hero is a scroll-spy nav: highlights the current section using
  `IntersectionObserver` as the user scrolls; clicking a link smooth-scrolls to that section.
- Sections fade/slide in on scroll via Framer Motion (`whileInView`, animate once).
- FAQ accordion expands/collapses one item at a time (or independently — implementation detail,
  match Figma interaction if specified in the node's prototype data).
- Navbar becomes sticky/condensed after scrolling past the hero.

## AI Chat Widget ("Milke Helper")

The hero contains a chat "popup" card: a photo + name ("Milke Helper"), a scrollable message
list, and a text input ("Send us message") with a send button.

- Client component (`components/ChatWidget.tsx`) holds conversation state:
  `{ role: 'user' | 'assistant'; content: string }[]`
- On mount, pre-seeded with the scripted exchange shown in the Figma design (visitor asks about
  services → Mike's answer → visitor asks about process), so the widget never looks empty and
  matches the design screenshot by default.
- The input is fully functional. On submit:
  1. Append the user's message to state
  2. `POST /api/chat` with the full message history
  3. Stream the assistant's reply back and render it with a typing effect
- `/api/chat` (Next.js Route Handler, `app/api/chat/route.ts`) calls the Anthropic API
  server-side using the Claude Agent SDK/Anthropic SDK, with a system prompt describing Mike's
  services, process, and pricing (sourced from this same page's copy) so answers stay on-topic.
- `ANTHROPIC_API_KEY` is read from `process.env` and is **not** committed; `.env.local` is
  gitignored and left for the user to populate before running the app.
- **Error handling**: if the API key is missing, the request fails, or a rate limit is hit, the
  widget appends a friendly fallback assistant message ("Having trouble connecting right now —
  try again in a moment.") instead of throwing or freezing the UI.
- No persistence — conversation resets on page reload. No database needed for this phase.

## Content

Use the Figma copy as-is (name "Mike Lee", bio, services, case studies, FAQ text) rather than
inventing new content. Extract exact text via `get_design_context` per section. Real content can
be swapped in later without restructuring components.

## Out of Scope (this spec)

- About, Case Study List/Detail, Contact, Privacy Policy, Terms & Conditions, 404 pages
- Responsive/mobile layouts (the Figma file has separate responsive frames — follow-up spec)
- Deployment/hosting setup
- Conversation persistence / chat history
- CMS or dynamic case-study data source

## Testing

- Run the dev server and manually verify each section against the Figma screenshots
- Test the chat widget golden path (send a message, get a real streamed reply) and the error
  path (temporarily unset/break the API key, confirm the fallback message appears cleanly)
- Verify scroll-spy highlighting and scroll-reveal animations at normal scroll speed
