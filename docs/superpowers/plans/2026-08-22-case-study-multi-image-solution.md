# Case Study Multi-Image Solution Items Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let a `## Solution` `###` item carry one or more leading images (not just one), rendered in a grid capped at 2 images per row, so a flow that's genuinely shown across multiple screens (e.g. a country-config walkthrough or a partner-portal detail + list view) can present them together.

**Architecture:** Generalizes the existing single-leading-image extraction (`extractLeadingImage`) into a new `extractLeadingImages` that repeatedly consumes consecutive leading standalone-image paragraphs. `CaseStudySolutionItem.image?: string` becomes `images: string[]` (always an array, possibly empty). `SolutionSection` renders 0 images as today's single placeholder, and 1+ images in a `grid-cols-2` layout where a trailing odd-one-out image spans both columns (so 1 image = full width, 2 = side by side, 3 = two-then-one).

**Tech Stack:** Same as the existing content system — no new dependencies.

---

### Task 1: Add `extractLeadingImages` and wire it into the loader

**Files:**
- Modify: `lib/markdown-sections.ts`
- Modify: `lib/case-studies.ts`

- [ ] **Step 1: Add `extractLeadingImages` to `lib/markdown-sections.ts`**

Find:
```typescript
export function extractLeadingImage(
  nodes: RootContent[]
): { image?: string; alt?: string; rest: RootContent[] } {
  if (nodes.length === 0) return { rest: nodes };
  const [first, ...rest] = nodes;
  if (first.type === "paragraph") {
    const paragraph = first as Paragraph;
    if (paragraph.children.length === 1 && paragraph.children[0].type === "image") {
      const image = paragraph.children[0] as MdastImage;
      return { image: image.url, alt: image.alt ?? undefined, rest };
    }
  }
  return { rest: nodes };
}
```

Replace with:
```typescript
export function extractLeadingImage(
  nodes: RootContent[]
): { image?: string; alt?: string; rest: RootContent[] } {
  if (nodes.length === 0) return { rest: nodes };
  const [first, ...rest] = nodes;
  if (first.type === "paragraph") {
    const paragraph = first as Paragraph;
    if (paragraph.children.length === 1 && paragraph.children[0].type === "image") {
      const image = paragraph.children[0] as MdastImage;
      return { image: image.url, alt: image.alt ?? undefined, rest };
    }
  }
  return { rest: nodes };
}

export function extractLeadingImages(
  nodes: RootContent[]
): { images: string[]; rest: RootContent[] } {
  const images: string[] = [];
  let rest = nodes;
  while (true) {
    const result = extractLeadingImage(rest);
    if (!result.image) break;
    images.push(result.image);
    rest = result.rest;
  }
  return { images, rest };
}
```

`extractLeadingImages` repeatedly calls the existing `extractLeadingImage` on whatever's left, collecting images until a call finds none. For a `###` item with two consecutive standalone image lines followed by prose, this correctly pulls both images out and leaves only the prose in `rest`.

- [ ] **Step 2: Change `CaseStudySolutionItem` to hold an array**

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
  images: string[];
  html: string;
};
```

- [ ] **Step 3: Swap the import and the solution-items parsing**

Find:
```typescript
import {
  parseMarkdownBody,
  splitByHeadingText,
  nodesToHtml,
  listItemsWithLeadingImage,
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
  extractLeadingImages,
} from "./markdown-sections";
```

(`extractLeadingImage`, singular, is still needed — `listItemsWithLeadingImage` for Process insights uses it directly and is unaffected by this change.)

Find:
```typescript
  let solutionItems: CaseStudySolutionItem[] | undefined;
  if (solution) {
    const items = splitByHeadingText(solution.nodes as RootContent[], 3);
    solutionItems = items.map((item) => {
      const { image, rest } = extractLeadingImage(item.nodes);
      return { heading: item.heading, image, html: nodesToHtml(rest) };
    });
  }
```

Replace with:
```typescript
  let solutionItems: CaseStudySolutionItem[] | undefined;
  if (solution) {
    const items = splitByHeadingText(solution.nodes as RootContent[], 3);
    solutionItems = items.map((item) => {
      const { images, rest } = extractLeadingImages(item.nodes);
      return { heading: item.heading, images, html: nodesToHtml(rest) };
    });
  }
```

- [ ] **Step 4: Verify the build (expected to fail — this is normal)**

Run: `npm run build`
Expected: FAILS. `components/case-study/SolutionSection.tsx` still reads `item.image` (singular, now removed from the type) and passes it to `<CaseStudyImage src={item.image} />`. Confirm the error is a type error scoped to `SolutionSection.tsx` referencing a missing `image` property, nothing else. Task 2 fixes it.

- [ ] **Step 5: Commit**

```bash
git add lib/markdown-sections.ts lib/case-studies.ts
git commit -m "feat: extract multiple leading images per Solution item"
```

---

### Task 2: Render the image grid in `SolutionSection`

**Files:**
- Modify: `components/case-study/SolutionSection.tsx`

- [ ] **Step 1: Replace the entire contents of `components/case-study/SolutionSection.tsx`**

```tsx
import CaseStudyImage from "@/components/CaseStudyImage";
import ProseHtml from "@/components/case-study/ProseHtml";
import type { CaseStudySolutionItem } from "@/lib/case-studies";

export default function SolutionSection({
  items,
}: {
  items: CaseStudySolutionItem[];
}) {
  return (
    <div className="flex flex-col gap-12">
      {items.map((item) => (
        <div key={item.heading} className="flex flex-col gap-6">
          <h3 className="font-body text-[24px] font-semibold text-ink">
            {item.heading}
          </h3>
          {item.images.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {item.images.map((image, index) => {
                const isTrailingOdd =
                  item.images.length % 2 === 1 && index === item.images.length - 1;
                return (
                  <CaseStudyImage
                    key={image}
                    src={image}
                    alt={`${item.heading} (${index + 1})`}
                    label={`Solution screenshot — 800×600 (${item.heading} ${index + 1})`}
                    className={`h-[280px] w-full md:h-[400px] ${
                      isTrailingOdd ? "sm:col-span-2" : ""
                    }`}
                  />
                );
              })}
            </div>
          ) : (
            <CaseStudyImage
              alt={item.heading}
              label={`Solution screenshot — 800×600 (${item.heading})`}
              className="h-[280px] w-full md:h-[400px]"
            />
          )}
          <ProseHtml html={item.html} />
        </div>
      ))}
    </div>
  );
}
```

This handles every count correctly: 0 images renders today's single placeholder unchanged. 1 image renders inside the grid but `isTrailingOdd` is true for it (length 1 is odd, index 0 is the last index), so it spans both columns and looks identical to a single full-width image. 2 images: length is even, neither spans, so they sit side by side. 3 images: the first two render one-per-column (row one, side by side), the third is odd-trailing and spans both columns (row two, full width) — a 2-then-1 layout.

- [ ] **Step 2: Verify it builds**

Run: `npm run build`
Expected: Build succeeds fully — 12/12 pages, zero type errors.

- [ ] **Step 3: Commit**

```bash
git add components/case-study/SolutionSection.tsx
git commit -m "feat: render Solution item images in a max-2-per-row grid"
```

---

### Task 3: Manual verification with a fixture

**Files:**
- Temporarily modify: `content/case-studies/ryno-finance.md` (reverted at the end of this task)

- [ ] **Step 1: Temporarily add a Solution section with 0, 1, 2, and 3-image items**

Append this to the end of `content/case-studies/ryno-finance.md` (keep whatever is already in the file — this task only needs a `## Solution` section to exist for the fixture; if one already exists, temporarily replace just that section, and note its original content so you can restore it exactly):

```markdown

## Solution
### No image item
Prose with no leading image at all.

### One image item
![Single screenshot](/images/case-studies/ryno-finance/fixture-a.png)
Prose after a single leading image.

### Two image item
![First screenshot](/images/case-studies/ryno-finance/fixture-a.png)
![Second screenshot](/images/case-studies/ryno-finance/fixture-b.png)
Prose after two leading images.

### Three image item
![First screenshot](/images/case-studies/ryno-finance/fixture-a.png)
![Second screenshot](/images/case-studies/ryno-finance/fixture-b.png)
![Third screenshot](/images/case-studies/ryno-finance/fixture-c.png)
Prose after three leading images.
```

- [ ] **Step 2: Verify via build + curl**

Run: `PORT=3100 npm run build && PORT=3100 npm run start &` (check `lsof -i :3100` first and pick a free port if it's taken). Then:

```bash
curl -s http://localhost:3100/case-studies/ryno-finance | grep -o "No image item"
curl -s http://localhost:3100/case-studies/ryno-finance | grep -o "One image item"
curl -s http://localhost:3100/case-studies/ryno-finance | grep -o "Two image item"
curl -s http://localhost:3100/case-studies/ryno-finance | grep -o "Three image item"
```
Expected: one match each, confirming all four headings render (the section didn't break partway through).

```bash
curl -s http://localhost:3100/case-studies/ryno-finance | grep -o 'src="/images/case-studies/ryno-finance/fixture-[abc]\.png"'
```
Expected: `fixture-a.png` appears 3 times total (once in "One image item", once in "Two image item", once in "Three image item"), `fixture-b.png` appears 2 times (Two and Three image items), `fixture-c.png` appears once (Three image item only). This confirms each item extracted exactly the right number of leading images, not too many or too few.

Also fetch the section around "Two image item" and "Three image item" (`curl -s ... | grep -A 20 "Two image item"`) and visually confirm the grid classes (`grid-cols-1`, `sm:grid-cols-2`, `sm:col-span-2` on the odd trailing image of the 3-image item) are present in the markup.

Kill the server when done.

- [ ] **Step 3: Revert the fixture**

```bash
git checkout -- content/case-studies/ryno-finance.md
```

Run: `git status`
Expected: Clean working tree.
