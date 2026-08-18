# Case Study Content System — Design Spec

## Problem

The case study detail page (`app/case-studies/[slug]/page.tsx`) currently has two problems:

1. **Layout doesn't match a winning case study structure.** It's a flat Header → About Project → five identically-styled narrative sections (Problem/Solution/Concepting/Design/Result) → More Works → FAQ. There's no compact context/role strip, no compressed process-insights section, and — most importantly — no quantified outcomes section. Research across strong case studies (see prior conversation research: Miro, Zenuity, Bookify, Air Miles, WhatsApp Polls) shows a consistent winning shape: Hero → Context strip → Problem → Process insights → Solution → Outcome (quantified) → Close. The current page is missing the context strip and outcome section entirely, which are the two things that most separate strong case studies from generic ones.

2. **All narrative content is hardcoded JSX with TODO comments.** `NARRATIVE_SECTIONS` in `[slug]/page.tsx` maps a fixed heading list to a single hardcoded "Case study details coming soon" string for every case study. There's no per-case-study content source, and no way to add real content without editing this component's JSX directly for each case study.

## Goal

Replace the hardcoded narrative section with a markdown-file-driven content system: one `.md` file per case study, following the winning-pattern structure, that both the list page and detail page read from as the single source of truth. Redesign the detail page layout to match the winning pattern. Support missing images with labeled placeholders, and missing narrative content with a graceful partial-content state (not per-section "coming soon" placeholders).

## Design

### Content schema

One file per case study: `content/case-studies/<slug>.md`.

**Frontmatter** (YAML) holds short, structured facts:

```yaml
---
slug: ryno-finance
title: "Ryno Finance — Compliance State Machine"
category: FinTech
summary: "Designing the queue where one click blocks or clears real money"
role: "Lead Product Designer"           # optional
client: "Ryno Finance"                  # optional
duration: "14 weeks"                    # optional
location: "Remote"                      # optional
liveUrl: "https://ryno.finance"         # optional — omit to hide the "Live Website" button
heroImage: /images/case-studies/ryno-finance/hero.png   # optional
metrics:                                # optional
  - value: "40%"
    label: "Reduction in manual review time"
  - value: "3x"
    label: "Faster fraud queue triage"
---
```

`slug`, `title`, `category`, `summary` are required (they drive the list page card and hero). Every other frontmatter field is optional; an omitted field simply causes its consumer (context strip row, Live Website button, hero image) to not render.

**Body** (Markdown) holds prose, organized under fixed, all-optional headings, in this order:

```markdown
## Problem
Prose.

## Process
- Insight one
- Insight two
- Insight three

## Solution
### Progressive risk disclosure
![Risk queue screenshot](/images/case-studies/ryno-finance/solution-1.png)
Prose describing this decision.

### Bulk action queue
![Bulk queue screenshot](/images/case-studies/ryno-finance/solution-2.png)
Prose.

## Outcome
Narrative wrap-up, rendered alongside the frontmatter `metrics` stat row.

## Close
Optional reflection paragraph.
```

- `## Problem`, `## Process`, `## Solution`, `## Outcome`, `## Close` are the only recognized top-level headings. Any of them may be omitted.
- `## Process` content is a markdown bullet list; each top-level list item becomes one insight in the existing insight-list visual style.
- `## Solution` contains a repeatable list of `###` sub-headings (unlimited — 2, 3, 5, whatever the case study needs). Each `###` sub-section may start with a single markdown image (`![alt](path)`); if present, that image is extracted as the item's supporting image and the remaining text becomes that item's body prose. If no leading image is present, the item just has no image (renders a placeholder, per the Images section below).
- Any other heading text, or content outside a recognized section, is ignored (not an error — keeps authoring forgiving).

### Parsing and data layer

New dependencies: `gray-matter` (frontmatter/body split), `unified` + `remark-parse` + `remark-gfm` (body → mdast), `remark-rehype` + `rehype-stringify` (per-section mdast subtree → HTML string for rendering).

`lib/case-studies.ts` is rewritten as a loader:

- `getAllCaseStudySlugs(): string[]` — reads filenames from `content/case-studies/`.
- `getAllCaseStudies(): CaseStudy[]` — parses every file, returns full parsed objects (used by the list page for cards/filtering and by `[slug]/page.tsx` for "More Works").
- `getCaseStudyBySlug(slug: string): CaseStudy | undefined` — parses one file.

`CaseStudy` type shape:

```typescript
type CaseStudySection =
  | { kind: "prose"; html: string }
  | { kind: "insights"; items: string[] }
  | { kind: "solution"; items: { heading: string; image?: string; html: string }[] };

type CaseStudy = {
  slug: string;
  title: string;
  category: "FinTech" | "AI-native" | "GovTech";
  summary: string;
  role?: string;
  client?: string;
  duration?: string;
  location?: string;
  liveUrl?: string;
  heroImage?: string;
  metrics?: { value: string; label: string }[];
  problem?: CaseStudySection & { kind: "prose" };
  process?: CaseStudySection & { kind: "insights" };
  solution?: CaseStudySection & { kind: "solution" };
  outcome?: CaseStudySection & { kind: "prose" };
  close?: CaseStudySection & { kind: "prose" };
};
```

Parsing happens at request time in the (already async) Server Component `[slug]/page.tsx`, and in a new server component wrapper for the list page — both are Node.js-runtime server components, so `fs` access is fine. No new build step or MDX compilation pipeline is introduced.

Because reading `content/case-studies/` requires `fs`, `app/case-studies/page.tsx` splits into:
- `app/case-studies/page.tsx` — server component, calls `getAllCaseStudies()`, passes the array to...
- `components/CaseStudyListClient.tsx` (new) — client component owning the existing `useState` category-filter interaction and rendering `CaseStudyCard`s. This is a mechanical extraction; the filter UI and behavior are unchanged.

`generateStaticParams` in `[slug]/page.tsx` switches from mapping over a hardcoded array to `getAllCaseStudySlugs().map((slug) => ({ slug }))`.

### Detail page layout (winning pattern)

`app/case-studies/[slug]/page.tsx` is restructured to render, in order:

1. **Hero** — existing header treatment (title, "[ CASE STUDY ]" tag), plus `summary` as a subhead and `heroImage` (or placeholder) as a supporting visual. Replaces today's plain title-only header.
2. **Context strip** — a compact row of the available facts among `role`, `client`, `duration`, `location`, `category` (category always present), styled like today's existing label/value rows in "About Project." The `liveUrl` button renders only if present. Replaces today's "About Project" section.
3. **Problem** — renders `problem.html` if present; section omitted entirely if not.
4. **Process** — renders `process.items` as the existing insight-list style; omitted if not present.
5. **Solution** — renders `solution.items`, each as a heading + image (or placeholder) + prose, in the repeatable style already used for the current narrative sections; omitted if not present.
6. **Outcome** — renders the `metrics` stat row (if present) above `outcome.html` (if present); the whole section is omitted only if both are absent.
7. **Close** — renders `close.html` if present; omitted if not.
8. **Fallback note** — if none of Problem/Process/Solution/Outcome/Close are present (the interim state for today's 3 case studies), a single small note renders in their place: "Full case study coming soon."

"More Works" and FAQ sections below stay exactly as they are today — they're not case-study-content-driven.

### Images

Any image reference (`heroImage`, a solution item's image, or absence thereof) is rendered through a shared `<CaseStudyImage>` component: if a path is provided, it renders the image normally; if omitted, it renders a dashed-border placeholder box labeled with what's expected and at what size (e.g. "Hero image — 1200×675", "Solution screenshot — 800×600"), so it's visually obvious what still needs to be dropped into `public/images/case-studies/<slug>/`.

### Migration of existing 3 case studies

`content/case-studies/ryno-finance.md`, `linqart.md`, `federal-pms.md` are created with `slug`/`title`/`category`/`summary` copied from today's hardcoded array (nothing invented). No `role`/`client`/`duration`/`heroImage`/body sections are filled in yet — that's a follow-up step once real content is provided per case study. This means, immediately after this change ships, each detail page shows: hero (title + summary, placeholder hero image), a context strip with only `category` filled in, and the single "Full case study coming soon" fallback note in place of the narrative sections.

The old hardcoded `CASE_STUDIES` array and `readLink` field are removed — `CaseStudyCard` already only needs `slug`/`title`/`category`/`summary`, which the new loader provides identically.

## Testing

- `npm run build` succeeds with the new `content/case-studies/*.md` files present, `generateStaticParams` produces the same 3 slugs as today.
- List page: filtering by category still works identically (visually and behaviorally unchanged), now backed by the parsed loader instead of the hardcoded array.
- Detail page, for each of the 3 existing (content-empty) case studies: hero renders with real title/summary and a hero-image placeholder, context strip shows only category, no per-section "coming soon" blocks appear, the single fallback note appears once, More Works and FAQ render unchanged.
- Add one temporary/manual test fixture case study `.md` file (or manually edit one of the 3) with every optional field and section filled in, including a 3-item Solution list and 2 metrics, to confirm: context strip shows all rows, Process renders as a bullet insight list, Solution renders all 3 items with images, Outcome shows the stat row + prose, Close renders, and no fallback note appears. Revert the manual edit after verifying (or keep the fixture out of `content/case-studies/` and use it in a unit test for the parser instead).
- Confirm a solution `###` item with no leading image renders the placeholder box instead of a broken image.
- Confirm `liveUrl` omitted hides the button, and present shows it linking correctly.
