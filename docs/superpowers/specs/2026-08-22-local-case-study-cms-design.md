# Local Case Study CMS — Design Spec

## Problem

Editing case study content today requires a conversation with Claude: adding a field, placing an image, or fixing a typo means writing directly to `content/case-studies/<slug>.md` and `public/images/case-studies/<slug>/` by hand. There's no way for the site owner to make these changes themselves without editing raw markdown/YAML and running shell commands to resize images.

## Goal

A local-only admin interface, built into the existing Next.js app, that lets the site owner create, edit, and delete case studies through form fields instead of hand-editing markdown — including uploading and auto-resizing images — without ever being reachable from the deployed production site.

## Design

### Safety: dev-only gating

Every admin page and every admin API route starts with:

```typescript
if (process.env.NODE_ENV !== "development") {
  notFound(); // pages
  // or, in API routes:
  return new Response("Not Found", { status: 404 });
}
```

This is the only thing standing between "local tool" and "publicly reachable admin panel," so it is applied at the top of every single admin route handler and page component individually — not just once at a shared layout — so that no new admin route can accidentally ship without the check. `content/case-studies/` and image writes only ever happen when this passes, i.e. only when someone is running `npm run dev` on their own machine.

### Routes

- `app/admin/page.tsx` — Server Component. Lists all case studies (via a new raw-content lookup, not the public `getAllCaseStudies()`, so the list shows raw slugs/titles even if a case study is mid-edit and temporarily has incomplete narrative sections). Each row has "Edit" (links to `/admin/[slug]`) and "Delete" (client-side confirm, then calls the delete API). An "Add new" button links to `/admin/new`.
- `app/admin/new/page.tsx` — A small form collecting only the required fields: `slug`, `title`, `category`, `summary`. On submit, calls the create API, which writes a minimal `.md` file (same shape as today's 3 starter files), then redirects to `/admin/[slug]`.
- `app/admin/[slug]/page.tsx` — Server Component that loads the raw content via `getRawCaseStudyContent(slug)` and renders the full editor (a Client Component, since it's all interactive form state) with that data as initial props. `notFound()` if the slug doesn't exist.

### Data layer: `lib/case-study-admin.ts` (new file)

Kept separate from `lib/case-studies.ts` on purpose: the public loader parses body sections into rendered HTML (`problemHtml`, `solutionItems[].html`, etc.) for display, which is a one-way transformation unsuitable for editing. The admin loader instead works with the source markdown/plain text directly. `CaseStudyCategory` and `CaseStudyMetric` below are the existing types already exported from `lib/case-studies.ts` — reused here, not redefined.

```typescript
export type RawSolutionItem = {
  heading: string;
  images: string[];
  body: string; // raw markdown text, not HTML
};

export type RawProcessInsight = {
  text: string;
  image?: string;
};

export type RawCaseStudyContent = {
  slug: string;
  title: string;
  category: CaseStudyCategory;
  summary: string;
  role?: string;
  team?: string;
  client?: string;
  duration?: string;
  location?: string;
  liveUrl?: string;
  heroImage?: string;
  metrics?: CaseStudyMetric[];
  problem?: string;
  process?: RawProcessInsight[];
  obstacles?: string;
  solution?: RawSolutionItem[];
  outcome?: string;
  close?: string;
};

export function getAllRawCaseStudies(): RawCaseStudyContent[];
export function getRawCaseStudyContent(slug: string): RawCaseStudyContent | undefined;
export function saveCaseStudyContent(slug: string, data: RawCaseStudyContent): void;
export function createCaseStudy(data: {
  slug: string;
  title: string;
  category: CaseStudyCategory;
  summary: string;
}): void;
export function deleteCaseStudy(slug: string): void;
```

`saveCaseStudyContent` is the reverse of the public parsing pipeline: it serializes `RawCaseStudyContent` into YAML frontmatter (via `gray-matter`'s stringify, or hand-built to match existing formatting) followed by `## Heading` sections in the fixed order (Problem, Process, Obstacles, Solution, Outcome, Close), omitting any section whose content is empty/undefined so saved files stay as clean as the hand-authored ones. Process insights serialize back to a markdown bullet list (with each insight's optional image as a leading `![alt](path)` line, blank line, then the insight text — matching the documented authoring format). Solution items serialize back to `###` sub-headings with their leading images and body text.

`createCaseStudy` writes a minimal file with just the 4 required frontmatter fields, matching exactly how the 3 existing case studies started out.

`deleteCaseStudy` removes only the `.md` file. It does not touch `public/images/case-studies/<slug>/` — orphaned images are left for manual cleanup, since deleting a whole image directory automatically is a higher-risk operation than the CMS needs to take on for v1.

### API routes

- `app/api/admin/case-studies/route.ts` — `GET` (list, delegates to `getAllRawCaseStudies()`), `POST` (create, delegates to `createCaseStudy()`)
- `app/api/admin/case-studies/[slug]/route.ts` — `GET` (one), `PUT` (save, delegates to `saveCaseStudyContent()`), `DELETE` (delegates to `deleteCaseStudy()`)
- `app/api/admin/case-studies/[slug]/images/route.ts` — `POST`, accepts a multipart file upload plus a `maxWidth` field (1600 for hero, 1200 for everything else), resizes via `sharp`, writes into `public/images/case-studies/<slug>/` using a sanitized version of the original filename (collision-suffixed with a counter if a file with that name already exists), and returns the resulting `/images/case-studies/<slug>/<filename>` path as JSON.

New dependency: `sharp` (image resizing).

### The editor UI (`components/admin/CaseStudyEditor.tsx` and children)

Plain, utilitarian styling — system font stack, simple bordered inputs, no attempt to reuse the public site's design tokens. Structure:

- **Hero fields**: text inputs for title/summary/role/team/client/duration/liveUrl, a `<select>` for category, a file input + current-image preview for `heroImage`.
- **Metrics**: repeatable rows of `{value, label}` text inputs, with "Add metric," a per-row "Remove," and up/down move buttons.
- **Problem / Obstacles / Outcome / Close**: one `<textarea>` each, all optional — an empty textarea means that section is omitted from the saved file, matching the existing "omitted section just doesn't render" behavior.
- **Process**: repeatable rows, each a text input (the insight) plus an optional image upload slot; add/remove/move controls.
- **Solution**: repeatable blocks, each with a heading text input, a repeatable list of image upload slots (add/remove individual images within the item), and a body textarea; add/remove/move controls for whole items.

A single "Save" button at the bottom PUTs the entire form state to `/api/admin/case-studies/[slug]`. On success, shows an inline confirmation; on failure (e.g. a required field left empty), shows the error inline without losing form state. No auto-navigation away after save, so edits can continue.

### Out of scope for this design

- No authentication/login screen — the `NODE_ENV` gate is the only access control, since this never runs anywhere but the owner's own machine.
- No git integration (commit/push) — saving only writes to disk.
- No drag-and-drop reordering — up/down buttons only.
- No automatic deletion of a case study's image folder when the case study itself is deleted.
- No markdown preview pane — the form fields are the only editing surface (a "view live" link to the actual `/case-studies/[slug]` page in a new tab is sufficient to check results).

## Testing

- `npm run build` succeeds with the new admin routes present; confirm the production build still only exposes the public routes when `NODE_ENV=production` is set for a local build-and-serve check (the admin pages/API routes should all 404).
- With `npm run dev`: create a new case study via `/admin/new`, fill in every field and section including multiple Process/Solution images, save, and confirm the resulting `.md` file matches the documented schema exactly and the public `/case-studies/<slug>` page renders it correctly.
- Edit an existing case study (e.g. `ryno-finance`), change a field, save, and confirm only the intended change appears in `git diff` — no reformatting/reordering of untouched content.
- Upload a large (20MB+) image and confirm the saved file is resized down to the expected max width.
- Delete a case study via `/admin`, confirm the `.md` file is gone and the case study no longer appears on `/case-studies`, and confirm its image folder is untouched.
- Confirm every admin page and API route returns 404 when accessed with `NODE_ENV=production`.
