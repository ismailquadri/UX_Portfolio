# Case Study Process Insight Images Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let a `## Process` insight optionally carry its own leading image (research artifact, affinity map, journey map, workshop photo), without turning Process into a repeatable heading+image+prose structure like Solution — insights without an image keep rendering as plain scannable bullets.

**Architecture:** Reuses the exact same leading-image extraction already built for Solution items (`extractLeadingImage`), applied per list item instead of per `###` sub-section. `processInsights` changes from `string[]` to `CaseStudyProcessInsight[]` (`{ text, image? }`). `ProcessInsights.tsx` renders an image slot only for insights that actually have one — an insight with no image gets no image slot at all (not a placeholder box), which is the one behavioral difference from how Solution images work.

**Tech Stack:** Same as the existing content system — no new dependencies.

---

### Task 1: Add the `listItemsWithLeadingImage` parsing utility

**Files:**
- Modify: `lib/markdown-sections.ts`

- [ ] **Step 1: Add the new function and export `collectText`**

Find:
```typescript
export function nodesToPlainText(nodes: RootContent[]): string[] {
  const list = nodes.find((node) => node.type === "list");
  if (!list || list.type !== "list") return [];
  return list.children.map((item) => collectText(item.children as RootContent[]).trim());
}

// Note: nested lists (a list item containing another list) are concatenated
// with no separator between the parent item's text and the nested list's
// text. This is intentional — the content schema only produces flat bullet
// lists under `## Process`-style sections, so nested-list flattening with
// proper delimiters is out of scope here.
function collectText(nodes: RootContent[]): string {
```

Replace with:
```typescript
export function nodesToPlainText(nodes: RootContent[]): string[] {
  const list = nodes.find((node) => node.type === "list");
  if (!list || list.type !== "list") return [];
  return list.children.map((item) => collectText(item.children as RootContent[]).trim());
}

export function listItemsWithLeadingImage(
  nodes: RootContent[]
): { text: string; image?: string }[] {
  const list = nodes.find((node) => node.type === "list");
  if (!list || list.type !== "list") return [];
  return list.children.map((item) => {
    const { image, rest } = extractLeadingImage(item.children as RootContent[]);
    return { text: collectText(rest).trim(), image };
  });
}

// Note: nested lists (a list item containing another list) are concatenated
// with no separator between the parent item's text and the nested list's
// text. This is intentional — the content schema only produces flat bullet
// lists under `## Process`-style sections, so nested-list flattening with
// proper delimiters is out of scope here.
export function collectText(nodes: RootContent[]): string {
```

This reuses `extractLeadingImage` (defined later in the same file — fine, `function` declarations are hoisted) exactly the way Solution items already use it, just applied to a single list item's children instead of a whole section's nodes. `nodesToPlainText` is left in place for now; Task 2 replaces its one remaining caller and removes it.

- [ ] **Step 2: Verify it builds**

Run: `npm run build`
Expected: Build succeeds — 12/12 pages, no type errors. `listItemsWithLeadingImage` isn't called anywhere yet (Task 2 wires it in), and an unused exported function is not a TypeScript or build error.

- [ ] **Step 3: Commit**

```bash
git add lib/markdown-sections.ts
git commit -m "feat: add listItemsWithLeadingImage parsing utility for per-insight images"
```

---

### Task 2: Wire the new parsing into the case studies loader

**Files:**
- Modify: `lib/case-studies.ts`
- Modify: `lib/markdown-sections.ts`

- [ ] **Step 1: Add the `CaseStudyProcessInsight` type**

Find:
```typescript
export type CaseStudySolutionItem = {
  heading: string;
  image?: string;
  html: string;
};
```

Replace with:
```typescript
export type CaseStudySolutionItem = {
  heading: string;
  image?: string;
  html: string;
};

export type CaseStudyProcessInsight = {
  text: string;
  image?: string;
};
```

- [ ] **Step 2: Change the `CaseStudy.processInsights` field type**

Find:
```typescript
  problemHtml?: string;
  processInsights?: string[];
  obstaclesHtml?: string;
```

Replace with:
```typescript
  problemHtml?: string;
  processInsights?: CaseStudyProcessInsight[];
  obstaclesHtml?: string;
```

- [ ] **Step 3: Swap the import and parsing call**

Find:
```typescript
import {
  parseMarkdownBody,
  splitByHeadingText,
  nodesToHtml,
  nodesToPlainText,
  extractLeadingImage,
} from "./markdown-sections";
```

Replace with:
```typescript
import {
  parseMarkdownBody,
  splitByHeadingText,
  nodesToHtml,
  listItemsWithLeadingImage,
  extractLeadingImage,
} from "./markdown-sections";
```

Find:
```typescript
    processInsights: processSection ? nodesToPlainText(processSection.nodes) : undefined,
```

Replace with:
```typescript
    processInsights: processSection
      ? listItemsWithLeadingImage(processSection.nodes)
      : undefined,
```

- [ ] **Step 4: Remove the now-unused `nodesToPlainText` from `lib/markdown-sections.ts`**

Find:
```typescript
export function nodesToPlainText(nodes: RootContent[]): string[] {
  const list = nodes.find((node) => node.type === "list");
  if (!list || list.type !== "list") return [];
  return list.children.map((item) => collectText(item.children as RootContent[]).trim());
}

export function listItemsWithLeadingImage(
```

Replace with:
```typescript
export function listItemsWithLeadingImage(
```

- [ ] **Step 5: Verify the build (expected to fail — this is normal)**

Run: `npm run build`
Expected: This WILL fail. `components/case-study/ProcessInsights.tsx` still declares `items: string[]` and `app/case-studies/[slug]/page.tsx` passes `caseStudy.processInsights` (now `CaseStudyProcessInsight[] | undefined`) into it — a type mismatch. Confirm the error is scoped to exactly that: a type error involving `ProcessInsights`'s `items` prop, nothing else. Task 3 (not yours to worry about beyond this confirmation) fixes it.

- [ ] **Step 6: Commit**

```bash
git add lib/case-studies.ts lib/markdown-sections.ts
git commit -m "feat: parse per-insight leading images in case studies loader"
```

---

### Task 3: Render the optional image in `ProcessInsights`

**Files:**
- Modify: `components/case-study/ProcessInsights.tsx`

- [ ] **Step 1: Replace the entire contents of `components/case-study/ProcessInsights.tsx`**

```tsx
import CaseStudyImage from "@/components/CaseStudyImage";
import type { CaseStudyProcessInsight } from "@/lib/case-studies";

export default function ProcessInsights({
  items,
}: {
  items: CaseStudyProcessInsight[];
}) {
  return (
    <ul className="flex max-w-[971px] flex-col gap-4">
      {items.map((item) => (
        <li key={item.text} className="flex flex-col gap-4">
          <div className="flex items-start gap-3 font-body text-[18px] font-medium leading-[1.6] tracking-[-0.18px] text-ink/50 md:text-[24px] md:tracking-[-0.24px]">
            <span
              className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-ink/30"
              aria-hidden="true"
            />
            <span>{item.text}</span>
          </div>
          {item.image && (
            <CaseStudyImage
              src={item.image}
              alt={item.text}
              label="Process insight image — 800×600"
              className="ml-6 h-[220px] w-full max-w-[600px] md:h-[280px]"
            />
          )}
        </li>
      ))}
    </ul>
  );
}
```

The `label` prop is only ever used by `CaseStudyImage`'s placeholder branch (when `src` is falsy). Since this component only renders `<CaseStudyImage>` at all when `item.image` is truthy, `src` is always defined here — `CaseStudyImage` will always take its "real image" branch, never its placeholder branch, for Process insights. That's intentional: an insight with no image gets no image slot in the DOM at all (the `{item.image && (...)}` guard), not a placeholder box.

- [ ] **Step 2: Verify it builds**

Run: `npm run build`
Expected: Build succeeds fully — 12/12 pages, zero type errors.

- [ ] **Step 3: Commit**

```bash
git add components/case-study/ProcessInsights.tsx
git commit -m "feat: render optional per-insight image in ProcessInsights"
```

---

### Task 4: Manual verification with a fixture

**Files:**
- Temporarily modify: `content/case-studies/ryno-finance.md` (reverted at the end of this task)

- [ ] **Step 1: Temporarily add a mixed Process list to `content/case-studies/ryno-finance.md`**

Replace its contents with:

```markdown
---
slug: ryno-finance
title: "Ryno Finance - Compliance State Machine"
category: FinTech
summary: "Designing the queue where one click blocks or clears real money"
---

## Process
- Interviewed 6 reviewers to map decision fatigue points
- ![Affinity map photo](/images/case-studies/ryno-finance/affinity-map.png)

  Found that risk signals were scattered across 4 separate tools
- Learned that batch actions were the single biggest time sink
```

This has one insight with no image (first), one with a leading image (second), and one with no image again (third) — deliberately not-first-or-last, to catch an off-by-one error in the parsing.

- [ ] **Step 2: Verify via build + curl**

Run: `npm run build && npm run start &` (use `PORT=3100 npm run build && PORT=3100 npm run start &` if port 3000 is already in use — check with `lsof -i :3000` first). Wait for it to be ready, then:

```bash
curl -s http://localhost:3000/case-studies/ryno-finance | grep -o "Interviewed 6 reviewers to map decision fatigue points"
```
Expected: One match — first insight (no image) still renders its full text correctly.

```bash
curl -s http://localhost:3000/case-studies/ryno-finance | grep -o "Found that risk signals were scattered across 4 separate tools"
```
Expected: One match — second insight's text is extracted correctly, with the leading image markdown NOT leaking into the text (no stray "Affinity map photo" or markdown syntax mixed into this string).

```bash
curl -s http://localhost:3000/case-studies/ryno-finance | grep -o 'src="/images/case-studies/ryno-finance/affinity-map.png"'
```
Expected: One match — the second insight's image renders as a real `<img>` element (the file doesn't exist on disk, so it'll be a broken image icon in an actual browser — that's expected and matches how Solution images already behave with a not-yet-uploaded file; the point here is confirming the `src` attribute is correct).

```bash
curl -s http://localhost:3000/case-studies/ryno-finance | grep -o "Learned that batch actions were the single biggest time sink"
```
Expected: One match — third insight (no image) also renders correctly, confirming the mixed list didn't break parsing for insights after an image-bearing one.

Also fetch the full HTML and read the raw markup around the three Process `<li>` elements directly (e.g. `curl -s http://localhost:3000/case-studies/ryno-finance | grep -A 5 "Interviewed 6 reviewers"` and similar for the other two) to visually confirm: insights 1 and 3 have no `<img>` and no "Process insight image" placeholder text anywhere near them, while insight 2 has exactly one `<img>` tag.

Kill the server when done (`kill %1` or find and kill the process on the port you used).

- [ ] **Step 3: Revert the fixture**

```bash
git checkout -- content/case-studies/ryno-finance.md
```

Run: `git status`
Expected: Clean working tree.
