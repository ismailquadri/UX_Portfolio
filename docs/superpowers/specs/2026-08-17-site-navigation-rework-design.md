# Site Navigation Rework — Design Spec

## Problem

The site currently has three different "left sidebar" components that look visually identical (269px column, `bg-surface`, `border-r`) but behave inconsistently, and no real persistent top-level navigation anywhere:

- **`HeroSidebar`** (homepage only): real scroll-spy via `useScrollSpy`/`IntersectionObserver`, but constrained to the Hero section's fixed height (900px). It disappears once the user scrolls past the hero, even though its links point to sections much further down the page (Process, Result, Pricing, FAQ).
- **`PageSidebar`** (About, Contact, Case Studies, Case Study Detail): visually identical to `HeroSidebar` but static — always bolds the first link regardless of actual scroll position — and is re-rendered fresh at every section boundary on multi-section pages (About renders it 5 times, Contact twice), so the same-looking "sidebar" repeatedly reappears down the page.
- **`SidebarSpacer`**: a pure decorative empty column with no links, used by ~13 individual section components purely to keep content visually aligned with wherever a real sidebar might or might not be present.

Additionally, the `Navbar` has no page-to-page navigation at all (only "About Me" and "Book a Call") — there is no way to reach `/case-studies` or `/contact` from the navbar on any page, and the sidebar's in-page anchor links inconsistently point to different targets depending on which page renders them (homepage anchors on `Contact`, in-page anchors on `About`, a broken faux-filter on Case Studies list).

On mobile, the sidebar is hidden entirely (`hidden md:flex`) with no replacement, so mobile visitors have no way to reach Case Studies or Contact at all.

## Goal

Replace all three sidebar variants with one shared, genuinely sticky component that serves as the site's persistent page-to-page navigation, and add an equivalent mobile navigation path. Remove the in-page "jump to section" behavior entirely — navigation becomes page-to-page only.

## Design

### `components/SiteSidebar.tsx` (new, replaces `HeroSidebar` + `PageSidebar` + `SidebarSpacer`)

- Client component (needs `usePathname()` for active-state).
- Visible `md:flex`, hidden below `md` (unchanged breakpoint convention).
- `position: sticky; top: 84px` (84px = Navbar height), `height: calc(100vh - 84px)`, so it stays pinned under the Navbar and fills the remaining viewport as the page scrolls beside it.
- Contents, top to bottom:
  - Logo mark (`/images/hero-logo.svg`), wrapped in a `next/link` to `/`. This is the site's "Home" affordance — no separate "Home" text link.
  - Three text links: **About** (`/about`), **Case Studies** (`/case-studies`), **Contact** (`/contact`).
- Active-page styling: the link matching the current route gets the existing bold/underline treatment (same visual language as today — `font-medium` + bottom-border on the active item, `opacity-30` on inactive items). Matching is prefix-based: `pathname.startsWith(href)` for non-root links, so `/case-studies/ryno-finance` still highlights "Case Studies". The homepage (`/`) has no sidebar link to highlight (logo isn't a "page" in this list) — no active state is shown when on `/`.
- No scroll-spy, no `IntersectionObserver`, no per-page custom link arrays. One component, one link set, rendered identically everywhere it appears.

### Layout composition

Each page that currently composes a sidebar (directly or via per-section spacers) switches to a single top-level flex row: `<SiteSidebar /><main>{page content}</main>`, composed once per page rather than once per section.

**Files losing their own `<SidebarSpacer />` call** (13 section components): `Capabilities.tsx`, `Process.tsx`, `Result.tsx`, `TechStack.tsx`, `WaysToWork.tsx`, `Cta.tsx`, `Faq.tsx`, `AboutIntro.tsx`, `AboutApproach.tsx`, `AboutSkills.tsx`, `AboutClients.tsx`, plus the Case Study Detail page's inline spacer usage. These components keep their content column but stop rendering their own left-rail spacer — the layout-level flex row now reserves that space once.

**`components/sections/Hero.tsx`**: stops rendering `<HeroSidebar />` internally. Its two-column layout (sidebar + chat card) becomes the page-level `<SiteSidebar /> + <main><Hero />...</main>` composition instead, matching every other page.

**Pages updated**: `app/page.tsx`, `app/about/page.tsx`, `app/contact/page.tsx`, `app/case-studies/page.tsx`, `app/case-studies/[slug]/page.tsx`. `app/not-found.tsx` is unchanged (no sidebar, full-bleed layout, as today).

**Deleted files**: `components/HeroSidebar.tsx`, `components/PageSidebar.tsx`, `components/SidebarSpacer.tsx`, `hooks/useScrollSpy.ts` (no longer used by anything once scroll-spy behavior is removed).

**Anchor ids**: existing `id="capabilities"`, `id="process"`, etc. on section elements are left in place (harmless, low-risk to leave for potential future deep-linking) — nothing in the new sidebar targets them, but removing them isn't necessary for this change.

### Mobile navigation (new)

`components/Navbar.tsx` gains a hamburger toggle, visible only below `md` (`md:hidden`), positioned in the existing header-buttons area. Tapping it opens a full-width dropdown panel directly below the Navbar containing the same three links (About, Case Studies, Contact) plus a "Home" entry (since there's no visible logo-as-home affordance on mobile the way the sidebar provides on desktop). The panel uses the same active-page bold/underline treatment as the desktop sidebar. Tapping a link or tapping the hamburger again closes the panel. This is local state in `Navbar` (`useState` for open/closed) — no new routing or global state needed.

## Testing

- Desktop (≥`md`): confirm `SiteSidebar` renders once per page (not once per section), stays visibly pinned while scrolling any multi-section page (About, Contact, Case Studies, homepage), and correctly bolds About/Case Studies/Contact/none-of-the-above depending on route, including on a `/case-studies/[slug]` detail page.
- Mobile (< `md`): confirm the hamburger toggle appears, opens/closes the dropdown, and all four destinations (Home, About, Case Studies, Contact) navigate correctly.
- Confirm no page regresses visually from the spacer-removal — content that previously sat next to a `SidebarSpacer` should now sit next to the real `SiteSidebar` at the same width/alignment.
- Confirm the homepage's chat widget and hero content render correctly now that `Hero.tsx` no longer owns its own sidebar.
- `npm run build` succeeds; no orphaned imports of the deleted components/hook remain anywhere in the codebase.
