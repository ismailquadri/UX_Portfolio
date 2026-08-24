# Case Study Content System — Design Spec

## Problem

The case study detail page (`app/case-studies/[slug]/page.tsx`) currently has two problems:

1. **Layout doesn't match a winning case study structure.** It's a flat Header → About Project → five identically-styled narrative sections (Problem/Solution/Concepting/Design/Result) → More Works → FAQ. There's no compact context/role strip, no compressed process-insights section, no room for the obstacles/constraints a project actually involved, and — most importantly — no quantified outcomes section. Research across strong case studies (see prior conversation research: Miro, Zenuity, Bookify, Air Miles, WhatsApp Polls) shows a consistent winning shape: Hero → Context strip → Problem → Process insights → Solution → Outcome (quantified) → Close. The current page is missing the context strip and outcome section entirely, which are the two things that most separate strong case studies from generic ones.

    A revision to this pattern: a scannable Problem → Process → Solution → Outcome shape optimizes for skimmability, but it can flatten out the part of a case study that actually demonstrates senior-level judgment — navigating stakeholder misalignment, legacy-system constraints, and competing business/technical pressures. Those obstacles aren't noise to be trimmed for brevity; they're the design problem the visible solution doesn't show on its own. A case study that strips them out shows what got made, not how the designer thinks. The schema below adds an explicit, optional **Obstacles** section between Process and Solution so that story has a place to live as real prose — not a compressed bullet list — without forcing every case study to include one.

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
team: "1 PM, 3 engineers, 1 QA"         # optional
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
- ![Affinity map photo](/images/case-studies/ryno-finance/affinity-map.png)

  Insight two, with a supporting image above it
- Insight three

## Obstacles
Prose — the stakeholder misalignment, legacy-system constraint, or competing
priority that had to be navigated, and how. Written as narrative, not bullets.

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

- `## Problem`, `## Process`, `## Obstacles`, `## Solution`, `## Outcome`, `## Close` are the only recognized top-level headings. Any of them may be omitted.
- `## Process` content is a markdown bullet list; each top-level list item becomes one insight in the existing insight-list visual style. An insight may optionally start with its own leading image, written as its own paragraph inside the list item followed by a blank line and then the insight text (as shown above) — the image is extracted the same way a Solution item's leading image is (see below). Unlike Solution, an insight with no leading image renders no image slot at all (not a placeholder box) — the image slot only appears when the insight was actually written with one. This stays optional per-insight, on purpose: Process is still meant to be scannable by default (plain text bullets), with an image only where a research artifact (affinity map, journey map, workshop photo) genuinely adds evidence — it does not become a repeatable heading+image+prose structure like Solution, which would undercut the "compressed insights" point of this section.
- `## Obstacles` content is prose (like `## Problem`/`## Outcome`/`## Close`), not a bullet list — deliberately, so a stakeholder-pivot or legacy-constraint story reads as a narrative rather than a compressed list item. It can run longer than the other prose sections; there's no length ceiling.
- `## Solution` contains a repeatable list of `###` sub-headings (unlimited — 2, 3, 5, whatever the case study needs). Each `###` sub-section may start with one or more leading markdown images, each written as its own standalone paragraph (`![alt](path)` on its own line, consecutive image lines allowed, one blank line between them is fine but not required); all of the consecutive leading images are extracted as the item's supporting image set, and the remaining text becomes that item's body prose. If no leading image is present, the item just has no images (renders a single placeholder, per the Images section below). When an item has more than one image, they render in a grid of at most 2 per row (3 images means a 2-then-1 layout, not 3 across) — this is for cases like a country-config walkthrough or a partner-portal flow that's genuinely shown across multiple screens, not a reason to pad every item with extra images.
- Any other heading text, or content outside a recognized section, is ignored (not an error — keeps authoring forgiving).

### Parsing and data layer

New dependencies: `gray-matter` (frontmatter/body split), `unified` + `remark-parse` + `remark-gfm` (body → mdast), `remark-rehype` + `rehype-stringify` (per-section mdast subtree → HTML string for rendering).

`lib/case-studies.ts` is rewritten as a loader:

- `getAllCaseStudySlugs(): string[]` — reads filenames from `content/case-studies/`.
- `getAllCaseStudies(): CaseStudy[]` — parses every file, returns full parsed objects (used by the list page for cards/filtering and by `[slug]/page.tsx` for "More Works").
- `getCaseStudyBySlug(slug: string): CaseStudy | undefined` — parses one file.

`CaseStudy` type shape (as implemented — flat optional fields rather than a discriminated union, since every section's "kind" is already implied by its field name and this reads more simply at every call site):

```typescript
type CaseStudySolutionItem = { heading: string; images: string[]; html: string };
type CaseStudyProcessInsight = { text: string; image?: string };

type CaseStudy = {
  slug: string;
  title: string;
  category: "FinTech" | "AI-native" | "GovTech";
  summary: string;
  role?: string;
  team?: string;
  client?: string;
  duration?: string;
  location?: string;
  liveUrl?: string;
  heroImage?: string;
  metrics?: { value: string; label: string }[];
  problemHtml?: string;
  processInsights?: CaseStudyProcessInsight[];
  obstaclesHtml?: string;
  solutionItems?: CaseStudySolutionItem[];
  outcomeHtml?: string;
  closeHtml?: string;
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
2. **Context strip** — a compact row of the available facts among `role`, `team`, `client`, `duration`, `location`, `category` (category always present), styled like today's existing label/value rows in "About Project." The `liveUrl` button renders only if present. Replaces today's "About Project" section.
3. **Problem** — renders `problemHtml` if present; section omitted entirely if not.
4. **Process** — renders `processInsights` as the existing insight-list style; an insight only shows an image slot at all if one was written in the markdown (same real-image-or-broken-until-the-file-exists behavior as a Solution item's leading image — see Images section); an insight with no image written shows no image slot whatsoever, not a placeholder box. Omitted entirely if the section itself isn't present.
5. **Obstacles** — renders `obstaclesHtml` as prose (same treatment as Problem/Outcome/Close — full paragraphs, not the compressed insight-list style used for Process); omitted if not present. Sits between Process and Solution: the reader has just seen what was learned, then sees what stood in the way of acting on it, before seeing what was actually shipped.
6. **Solution** — renders `solutionItems`, each as a heading + one or more images (or a single placeholder if none) + prose, in the repeatable style already used for the current narrative sections; images render in a grid of at most 2 per row. Omitted if not present.
7. **Outcome** — renders the `metrics` stat row (if present) above `outcomeHtml` (if present); the whole section is omitted only if both are absent.
8. **Close** — renders `closeHtml` if present; omitted if not.
9. **Fallback note** — if none of Problem/Process/Obstacles/Solution/Outcome/Close are present (the interim state for today's 3 case studies), a single small note renders in their place: "Full case study coming soon."

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
- Add one temporary/manual test fixture case study `.md` file (or manually edit one of the 3) with every optional field and section filled in, including an `## Obstacles` section, a 3-item Solution list, and 2 metrics, to confirm: context strip shows all rows, Process renders as a bullet insight list, Obstacles renders as prose (not a bullet list) between Process and Solution, Solution renders all 3 items with images, Outcome shows the stat row + prose, Close renders, and no fallback note appears. Revert the manual edit after verifying (or keep the fixture out of `content/case-studies/` and use it in a unit test for the parser instead).
- Confirm a case study with every other section present but `## Obstacles` omitted renders correctly with no gap or stray heading where Obstacles would have been.
- Confirm a solution `###` item with no leading image renders the placeholder box instead of a broken image.
- Confirm a Process bullet with a leading image renders that image (same as a Solution item's image path), a Process bullet without one renders no image slot at all (not even a placeholder box), and both can appear in the same list without breaking each other's parsing.
- Confirm `liveUrl` omitted hides the button, and present shows it linking correctly.
