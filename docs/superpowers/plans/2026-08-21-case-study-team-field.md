# Case Study Team Field Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an optional `team` frontmatter field (e.g. "1 PM, 3 engineers, 1 QA") that renders as another row in the case study Context strip, alongside role/client/duration/location.

**Architecture:** Mechanical addition following the exact pattern of every other optional Context strip field — add to the frontmatter type, thread it through `getCaseStudyBySlug`, add it to `ContextStrip`'s row list, pass it from the detail page. Small enough to be one task.

**Tech Stack:** Same as the existing content system — no new dependencies.

---

### Task 1: Add the `team` field end to end

**Files:**
- Modify: `lib/case-studies.ts`
- Modify: `components/case-study/ContextStrip.tsx`
- Modify: `app/case-studies/[slug]/page.tsx`

- [ ] **Step 1: Add `team` to the `CaseStudy` type and the frontmatter type**

Find:
```typescript
export type CaseStudy = {
  slug: string;
  title: string;
  category: CaseStudyCategory;
  summary: string;
  role?: string;
  client?: string;
  duration?: string;
  location?: string;
  liveUrl?: string;
  heroImage?: string;
  metrics?: CaseStudyMetric[];
```

Replace with:
```typescript
export type CaseStudy = {
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
```

Then find the second, near-identical block a little further down (the `CaseStudyFrontmatter` type):
```typescript
type CaseStudyFrontmatter = {
  slug: string;
  title: string;
  category: CaseStudyCategory;
  summary: string;
  role?: string;
  client?: string;
  duration?: string;
```

Replace with:
```typescript
type CaseStudyFrontmatter = {
  slug: string;
  title: string;
  category: CaseStudyCategory;
  summary: string;
  role?: string;
  team?: string;
  client?: string;
  duration?: string;
```

- [ ] **Step 2: Pass `team` through in `getCaseStudyBySlug`'s return object**

Find:
```typescript
    role: frontmatter.role,
    client: frontmatter.client,
```

Replace with:
```typescript
    role: frontmatter.role,
    team: frontmatter.team,
    client: frontmatter.client,
```

- [ ] **Step 3: Add `team` to `ContextStrip`'s props and row list**

Find:
```tsx
type ContextStripProps = {
  category: string;
  role?: string;
  client?: string;
  duration?: string;
  location?: string;
  liveUrl?: string;
};

export default function ContextStrip({
  category,
  role,
  client,
  duration,
  location,
  liveUrl,
}: ContextStripProps) {
  const rows: { label: string; value?: string }[] = [
    { label: "Role", value: role },
    { label: "Client", value: client },
    { label: "Duration", value: duration },
    { label: "Location", value: location },
    { label: "Category", value: category },
  ];
```

Replace with:
```tsx
type ContextStripProps = {
  category: string;
  role?: string;
  team?: string;
  client?: string;
  duration?: string;
  location?: string;
  liveUrl?: string;
};

export default function ContextStrip({
  category,
  role,
  team,
  client,
  duration,
  location,
  liveUrl,
}: ContextStripProps) {
  const rows: { label: string; value?: string }[] = [
    { label: "Role", value: role },
    { label: "Team", value: team },
    { label: "Client", value: client },
    { label: "Duration", value: duration },
    { label: "Location", value: location },
    { label: "Category", value: category },
  ];
```

`team` is positioned right after `role` since they're both about who worked on it, before the client/timeline facts.

- [ ] **Step 4: Pass `team` from the detail page**

Find:
```tsx
            <ContextStrip
              category={caseStudy.category}
              role={caseStudy.role}
              client={caseStudy.client}
              duration={caseStudy.duration}
              location={caseStudy.location}
              liveUrl={caseStudy.liveUrl}
            />
```

Replace with:
```tsx
            <ContextStrip
              category={caseStudy.category}
              role={caseStudy.role}
              team={caseStudy.team}
              client={caseStudy.client}
              duration={caseStudy.duration}
              location={caseStudy.location}
              liveUrl={caseStudy.liveUrl}
            />
```

- [ ] **Step 5: Verify it builds**

Run: `npm run build`
Expected: Build succeeds fully — 12/12 pages, zero type errors.

- [ ] **Step 6: Verify with a quick fixture check**

Temporarily add `team: "1 PM, 3 engineers, 1 QA"` to `content/case-studies/ryno-finance.md`'s frontmatter (alongside its existing `role`/`client`/etc. if any — check the file's current contents first since it may have been updated with real content since this plan was written), run `PORT=3100 npm run build && PORT=3100 npm run start &`, then:

```bash
curl -s http://localhost:3100/case-studies/ryno-finance | grep -o "1 PM, 3 engineers, 1 QA"
```
Expected: One match.

Kill the server, then revert the fixture edit with `git checkout -- content/case-studies/ryno-finance.md` (or manually undo the one-line addition if the file has other legitimate uncommitted content you need to preserve — check `git diff content/case-studies/ryno-finance.md` before reverting to be sure you're not discarding something real).

- [ ] **Step 7: Commit**

```bash
git add lib/case-studies.ts components/case-study/ContextStrip.tsx "app/case-studies/[slug]/page.tsx"
git commit -m "feat: add optional team field to case study Context strip"
```
