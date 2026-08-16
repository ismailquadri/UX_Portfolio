# Portfolio Phase 2 — About, Case Studies, Contact, 404 — Design Spec

## Source

Figma file: `Personal Portfolio` (fileKey `0IyCORj0osd1Dzx8Q7S7Eh`), page "⚙️ ・ Workspace".
This spec covers the desktop versions of five pages not covered by the Phase 1 homepage spec:

| Page | Figma node |
|---|---|
| About Me | `7215:333` |
| Case Study List | `7238:321` |
| Case Study Detail (template) | `7238:673` |
| Contact | `7211:249` |
| 404 | `7137:254` |

Privacy Policy and Terms & Conditions pages, and all responsive/mobile variants, are out of scope for this phase — legal pages get their own follow-up spec; mobile layouts follow the same responsive patterns established in the Phase 1 homepage build.

## Goal

Extend the existing Next.js site (built in Phase 1, merged to `master`) with these five pages, reusing established components/tokens/conventions rather than re-deriving them.

## Stack (unchanged from Phase 1)

Next.js App Router, TypeScript, Tailwind CSS v4 (`@theme` tokens in `app/globals.css`), Framer Motion for scroll-reveal, real Figma content pulled per-component via `mcp__figma__get_design_context`.

## Reused components (do not rebuild)

- `components/Navbar.tsx`, `components/Footer.tsx`, `components/SidebarSpacer.tsx`, `components/AccordionItem.tsx`, `components/RevealOnScroll.tsx`
- New shared component: `components/PageSidebar.tsx` — the in-page left nav pattern that repeats on About and Contact (same visual language as `HeroSidebar`, but static — no scroll-spy, since these pages are shorter and the nav targets are page sections, not homepage anchors).

## Page Structure

### About (`app/about/page.tsx`)

Sections in order (node IDs are children of `7215:333`, fetch each via `get_design_context`):
1. Capabilities-style header ("About Me" title + edit-style label) — `7215:356`
2. Full-bleed photo + intro copy — `7215:364`/`7215:370` area
3. "I don't bring dreams..." recap (reuses the homepage's Capabilities framing at a smaller scale) — `7215:661`
4. "My approach is simple" 4-step process — `7264:809`
5. "Skills & Domains" — grouped bullet lists (Product Design / Tools & Workflows / Domains) + "Download CV" link — `7215:700`
6. "Who I Work With" — client/tool logo grid (2 rows × 4) — `7215:827`
7. "Send me a Message" form — `7247:1815` (same form component as Contact, see below)

### Case Study List (`app/case-studies/page.tsx`)

- `PageSidebar` with links: Case Studies, FinTech, AI-native, GovTech (filter by category)
- Header "Case Studies" + "[ WORK ]" label — `12215:1232`
- Tag filter row (All/FinTech/AI-native/GovTech) — `12215:1236`, client-side filter, no page reload
- 3 case study cards (thumbnail, domain tag, title, description, "Read case study →" link) — `12215:1245`, sourced from `lib/case-studies.ts`

### Case Study Detail (`app/case-studies/[slug]/page.tsx`)

One template (from node `7238:673`) instantiated per case study via `generateStaticParams`. Sections: About Project (category/client/duration/location + summary), Problem, Solution, Concepting, Design, Result, More Works (links to other 2 case studies), FAQ (reuse the same 6-question data as the homepage FAQ / Contact FAQ, single accordion item with a real answer, same honesty rule as Phase 1 — no invented answers).

**Data model** (`lib/case-studies.ts`):
```ts
export type CaseStudy = {
  slug: string;
  title: string;
  category: "FinTech" | "AI-native" | "GovTech";
  summary: string;      // from the List page's "Description" text
  readLink: string;     // "Read case study →" — verbatim label
};
```
The 3 real entries (title/category/summary pulled verbatim from Figma node `12215:1245`): Ryno Finance, Linqart, Federal PMS.

The detail page's narrative body (Problem/Solution/Concepting/Design/Result) has no real per-case-study content in Figma — only the unrelated "Nutor AI" example does. Each narrative section renders clearly-marked placeholder copy (e.g. `{/* TODO: replace with real case study writeup for ${slug} */}` plus a visible placeholder sentence like "Case study details coming soon.") rather than inventing fake project narratives. The page layout/styling still matches Figma's `7238:673` template exactly.

### Contact (`app/contact/page.tsx`)

- Header "Let's start a conversation" + "[ CONTACT ]" label — `7211:273`
- `PageSidebar` (same 7-link pattern as About/Homepage hero sidebar, non-scrolling here)
- "Send me a Message" form — `7211:288` — fields: Name, E-mail, "I'm interested in" (select), Message, Submit button
- Contact detail row: Email (hello@mike.com) / Response time (24 hours) — `7266:2423`
- FAQ accordion (6 questions, same content/limitation as homepage FAQ — 1 real answer) — `7244:1217`

**Form component**: `components/ContactForm.tsx`, shared by both `/contact` and `/about` (About's "Send me a Message" section renders the same component). Client component with controlled inputs, submits to `POST /api/contact`.

**`/api/contact` route**: Next.js Route Handler using the Resend API (`resend` npm package) to email the submission to `hello@mike.com`. `RESEND_API_KEY` read from env, unset in the repo (same pattern as `ANTHROPIC_API_KEY` — user adds it to `.env.local` later). Validates required fields server-side; returns a friendly error JSON on missing key or send failure; the form shows a success/error state without a full page reload.

### 404 (`app/not-found.tsx`)

Next.js's special `not-found.tsx` file, automatically rendered for unmatched routes. Full-bleed illustrated background (same visual family as Hero/CTA), "[ Oops! Page Not Found ]" label, "404", "The page you're looking for doesn't exist" (fixing Figma's typo "exixst" — a clear typo, not a stylistic choice, unlike previously-preserved Figma quirks like the Footer's copyright formatting), and a "Back to Homepage" button linking to `/`.

## Content Honesty

Same rule as Phase 1: pull real copy from Figma via `get_design_context` for every section; never invent narrative copy. Where Figma genuinely has no content (case study narratives), placeholders must be visibly marked as such, not disguised as real content.

## Testing

- Each page: dev server + visual comparison against its Figma screenshot (scratch Playwright, consistent with Phase 1)
- Case study filter: verify all 3 filter tags actually filter the list client-side
- Contact form: verify client-side validation, and the error path (no `RESEND_API_KEY` set — confirm a friendly error state, not a crash), the same way Phase 1 verified the chat widget's fallback path
- 404: verify it renders for an arbitrary unmatched route (e.g. `/this-does-not-exist`)
