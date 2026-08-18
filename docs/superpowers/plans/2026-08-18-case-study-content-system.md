# Case Study Content System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the hardcoded, TODO-riddled case study narrative with a markdown-file-driven content system, and redesign the case study detail page around the winning pattern (Hero → Context strip → Problem → Process → Solution → Outcome → Close).

**Architecture:** One `.md` file per case study in `content/case-studies/` holds frontmatter (structured facts: role, client, metrics, images) and a markdown body (prose under fixed, optional `##`/`###` headings). A parsing layer (`lib/markdown-sections.ts` + rewritten `lib/case-studies.ts`) turns each file into a typed `CaseStudy` object at request time. Both `app/case-studies/page.tsx` (list) and `app/case-studies/[slug]/page.tsx` (detail) read from this loader as the single source of truth — the old hardcoded `CASE_STUDIES` array is deleted.

**Tech Stack:** Next.js 16 App Router (Server Components + `fs` access), TypeScript, Tailwind v4, `gray-matter` (frontmatter), `unified`/`remark-parse`/`remark-gfm`/`remark-rehype`/`rehype-stringify` (markdown → HTML per section).

**Note on testing approach:** This project has no unit test framework installed (verification elsewhere in the codebase is done via `npm run build` + manual/browser inspection — see `docs/superpowers/specs/2026-08-17-site-navigation-rework-design.md`'s Testing section for precedent). This plan follows the same convention: every task verifies via `npm run build` (catches type errors) and, where behavior needs checking, a temporary fixture + dev server inspection (Task 8) rather than introducing a new test runner just for this feature.

---

### Task 1: Install markdown parsing dependencies

**Files:**
- Modify: `package.json` (via `npm install`)

- [ ] **Step 1: Install runtime dependencies**

Run:
```bash
npm install gray-matter unified remark-parse remark-gfm remark-rehype rehype-stringify
```

- [ ] **Step 2: Install mdast type declarations (dev dependency)**

Run:
```bash
npm install -D mdast
```

- [ ] **Step 3: Verify the install didn't break the build**

Run: `npm run build`
Expected: Build succeeds exactly as it did on the clean baseline (12/12 pages, no new errors) — these packages aren't used anywhere yet, so this just confirms nothing broke.

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add markdown parsing dependencies for case study content"
```

---

### Task 2: Markdown section-splitting utilities

**Files:**
- Create: `lib/markdown-sections.ts`

This is the generic, case-study-agnostic parsing layer: turn a markdown string into mdast nodes, split those nodes by heading depth, convert a slice of nodes to an HTML string, extract plain-text list items, and pull a leading standalone image out of a node slice.

- [ ] **Step 1: Write `lib/markdown-sections.ts`**

```typescript
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import type { Root, RootContent, Heading, Paragraph, Image as MdastImage } from "mdast";

export function parseMarkdownBody(markdown: string): RootContent[] {
  const tree = unified().use(remarkParse).use(remarkGfm).parse(markdown) as Root;
  return tree.children;
}

export function splitByHeadingText(
  nodes: RootContent[],
  depth: number
): { heading: string; nodes: RootContent[] }[] {
  const sections: { heading: string; nodes: RootContent[] }[] = [];
  let current: { heading: string; nodes: RootContent[] } | null = null;

  for (const node of nodes) {
    if (node.type === "heading" && (node as Heading).depth === depth) {
      current = { heading: headingText(node as Heading), nodes: [] };
      sections.push(current);
    } else if (current) {
      current.nodes.push(node);
    }
  }

  return sections;
}

function headingText(node: Heading): string {
  return node.children
    .map((child) => ("value" in child ? String(child.value) : ""))
    .join("");
}

export function nodesToHtml(nodes: RootContent[]): string {
  const root: Root = { type: "root", children: nodes };
  const processor = unified().use(remarkRehype).use(rehypeStringify);
  const hastTree = processor.runSync(root);
  return processor.stringify(hastTree) as string;
}

export function nodesToPlainText(nodes: RootContent[]): string[] {
  const list = nodes.find((node) => node.type === "list");
  if (!list || list.type !== "list") return [];
  return list.children.map((item) => collectText(item.children as RootContent[]).trim());
}

function collectText(nodes: RootContent[]): string {
  let text = "";
  for (const node of nodes) {
    if (node.type === "text") {
      text += node.value;
    } else if ("children" in node && Array.isArray(node.children)) {
      text += collectText(node.children as RootContent[]);
    }
  }
  return text;
}

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

- [ ] **Step 2: Verify it type-checks**

Run: `npm run build`
Expected: Build succeeds (this file isn't imported anywhere yet, but `tsc` still checks every `.ts` file in the project — confirm no type errors).

- [ ] **Step 3: Commit**

```bash
git add lib/markdown-sections.ts
git commit -m "feat: add markdown section-splitting utilities"
```

---

### Task 3: Rewrite the case studies data loader and add content files

**Files:**
- Modify: `lib/case-studies.ts` (full rewrite)
- Create: `content/case-studies/ryno-finance.md`
- Create: `content/case-studies/linqart.md`
- Create: `content/case-studies/federal-pms.md`

- [ ] **Step 1: Create the content directory and files**

Create `content/case-studies/ryno-finance.md`:

```markdown
---
slug: ryno-finance
title: "Ryno Finance - Compliance State Machine"
category: FinTech
summary: "Designing the queue where one click blocks or clears real money"
---
```

Create `content/case-studies/linqart.md`:

```markdown
---
slug: linqart
title: "Linqart - AI Dependency Graph"
category: AI-native
summary: "Mapping a multi-merchant matching system nobody had visualized before"
---
```

Create `content/case-studies/federal-pms.md`:

```markdown
---
slug: federal-pms
title: "Federal PMS - Org-Scale Role System"
category: GovTech
summary: "A national civil-service platform managing 800+ federal agencies"
---
```

These carry over exactly the fields that exist today in the hardcoded array — nothing invented. Every other frontmatter field (`role`, `client`, `duration`, `location`, `liveUrl`, `heroImage`, `metrics`) and every body section (`## Problem`, `## Process`, `## Solution`, `## Outcome`, `## Close`) is intentionally omitted; that's real content that comes later per case study.

- [ ] **Step 2: Rewrite `lib/case-studies.ts`**

```typescript
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { RootContent } from "mdast";
import {
  parseMarkdownBody,
  splitByHeadingText,
  nodesToHtml,
  nodesToPlainText,
  extractLeadingImage,
} from "./markdown-sections";

const CONTENT_DIR = path.join(process.cwd(), "content", "case-studies");

export type CaseStudyCategory = "FinTech" | "AI-native" | "GovTech";

export type CaseStudyMetric = {
  value: string;
  label: string;
};

export type CaseStudySolutionItem = {
  heading: string;
  image?: string;
  html: string;
};

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
  problemHtml?: string;
  processInsights?: string[];
  solutionItems?: CaseStudySolutionItem[];
  outcomeHtml?: string;
  closeHtml?: string;
};

type CaseStudyFrontmatter = {
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
};

export function getAllCaseStudySlugs(): string[] {
  return fs
    .readdirSync(CONTENT_DIR)
    .filter((filename) => filename.endsWith(".md"))
    .map((filename) => filename.replace(/\.md$/, ""));
}

export function getCaseStudyBySlug(slug: string): CaseStudy | undefined {
  const filePath = path.join(CONTENT_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) return undefined;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  const frontmatter = data as CaseStudyFrontmatter;

  const nodes = parseMarkdownBody(content);
  const sections = splitByHeadingText(nodes, 2);
  const getSection = (name: string) => sections.find((s) => s.heading === name);

  const problem = getSection("Problem");
  const processSection = getSection("Process");
  const solution = getSection("Solution");
  const outcome = getSection("Outcome");
  const close = getSection("Close");

  let solutionItems: CaseStudySolutionItem[] | undefined;
  if (solution) {
    const items = splitByHeadingText(solution.nodes as RootContent[], 3);
    solutionItems = items.map((item) => {
      const { image, rest } = extractLeadingImage(item.nodes);
      return { heading: item.heading, image, html: nodesToHtml(rest) };
    });
  }

  return {
    slug: frontmatter.slug,
    title: frontmatter.title,
    category: frontmatter.category,
    summary: frontmatter.summary,
    role: frontmatter.role,
    client: frontmatter.client,
    duration: frontmatter.duration,
    location: frontmatter.location,
    liveUrl: frontmatter.liveUrl,
    heroImage: frontmatter.heroImage,
    metrics: frontmatter.metrics,
    problemHtml: problem ? nodesToHtml(problem.nodes) : undefined,
    processInsights: processSection ? nodesToPlainText(processSection.nodes) : undefined,
    solutionItems,
    outcomeHtml: outcome ? nodesToHtml(outcome.nodes) : undefined,
    closeHtml: close ? nodesToHtml(close.nodes) : undefined,
  };
}

export function getAllCaseStudies(): CaseStudy[] {
  return getAllCaseStudySlugs()
    .map((slug) => getCaseStudyBySlug(slug))
    .filter((cs): cs is CaseStudy => cs !== undefined);
}
```

- [ ] **Step 3: Verify it builds**

Run: `npm run build`
Expected: This will now FAIL — `app/case-studies/page.tsx`, `app/case-studies/[slug]/page.tsx`, and `components/CaseStudyCard.tsx` still reference the old `CASE_STUDIES` array and `readLink` field that no longer exist. That's expected at this point in the plan; confirm the errors are exactly about those three files (missing `CASE_STUDIES` export / missing `readLink` property) and nothing else. Later tasks fix each.

- [ ] **Step 4: Commit**

```bash
git add lib/case-studies.ts content/case-studies/
git commit -m "feat: rewrite case studies loader to read from markdown content files"
```

---

### Task 4: Shared image-or-placeholder component

**Files:**
- Create: `components/CaseStudyImage.tsx`

- [ ] **Step 1: Write the component**

```tsx
import Image from "next/image";

type CaseStudyImageProps = {
  src?: string;
  alt: string;
  label: string;
  className?: string;
};

export default function CaseStudyImage({
  src,
  alt,
  label,
  className = "",
}: CaseStudyImageProps) {
  if (!src) {
    return (
      <div
        className={`flex items-center justify-center rounded-md border border-dashed border-border-subtle bg-surface ${className}`}
      >
        <p className="px-4 text-center font-body text-[14px] text-[#555]">{label}</p>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden rounded-md ${className}`}>
      <Image src={src} alt={alt} fill className="object-cover" />
    </div>
  );
}
```

Callers control sizing via `className` (must include a height and width, e.g. `"h-[280px] w-full"`), matching the sizing pattern already used for the "About Project" screenshot placeholder box in the current `[slug]/page.tsx`.

- [ ] **Step 2: Verify it builds**

Run: `npm run build`
Expected: Same pre-existing failures as end of Task 3 (this component isn't wired in yet), no new errors introduced by this file itself. Confirm by checking the error list only mentions `CASE_STUDIES`/`readLink`, not `CaseStudyImage`.

- [ ] **Step 3: Commit**

```bash
git add components/CaseStudyImage.tsx
git commit -m "feat: add CaseStudyImage placeholder component"
```

---

### Task 5: Case study section components

**Files:**
- Create: `components/case-study/ProseHtml.tsx`
- Create: `components/case-study/ProcessInsights.tsx`
- Create: `components/case-study/ContextStrip.tsx`
- Create: `components/case-study/OutcomeSection.tsx`
- Create: `components/case-study/SolutionSection.tsx`

- [ ] **Step 1: Write `components/case-study/ProseHtml.tsx`**

Renders a parsed markdown section's HTML using the same typography classes as today's narrative paragraphs.

```tsx
export default function ProseHtml({
  html,
  className = "",
}: {
  html: string;
  className?: string;
}) {
  return (
    <div
      className={`max-w-[971px] font-body text-[18px] font-medium leading-[1.6] tracking-[-0.18px] text-ink/50 md:text-[24px] md:tracking-[-0.24px] [&_a]:underline [&_strong]:font-semibold [&_strong]:text-ink ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
```

(The HTML rendered here comes only from markdown files authored in this repo — never from user input — so `dangerouslySetInnerHTML` carries no injection risk.)

- [ ] **Step 2: Write `components/case-study/ProcessInsights.tsx`**

```tsx
export default function ProcessInsights({ items }: { items: string[] }) {
  return (
    <ul className="flex max-w-[971px] flex-col gap-4">
      {items.map((item) => (
        <li
          key={item}
          className="flex items-start gap-3 font-body text-[18px] font-medium leading-[1.6] tracking-[-0.18px] text-ink/50 md:text-[24px] md:tracking-[-0.24px]"
        >
          <span
            className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-ink/30"
            aria-hidden="true"
          />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
```

- [ ] **Step 3: Write `components/case-study/ContextStrip.tsx`**

Reuses the exact row styling from today's "About Project" section, but only renders rows that have data, plus a conditional "Live Website" button (identical markup to today's).

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

  return (
    <div className="flex flex-col gap-3.5">
      {rows
        .filter((row) => row.value)
        .map((row) => (
          <div
            key={row.label}
            className="flex items-center gap-2 border-b border-border-subtle pb-3.5 font-body text-[16px] tracking-[-0.16px]"
          >
            <span className="font-medium text-ink">{row.label}:</span>
            <span className="text-ink/50">{row.value}</span>
          </div>
        ))}
      {liveUrl && (
        <a
          href={liveUrl}
          className="inline-flex w-fit items-center justify-center gap-2 rounded-sm border border-paper bg-ink px-3 py-2 font-body text-[14px] font-medium tracking-[-0.14px] text-paper shadow-button"
        >
          Live Website
        </a>
      )}
    </div>
  );
}
```

- [ ] **Step 4: Write `components/case-study/OutcomeSection.tsx`**

```tsx
import ProseHtml from "@/components/case-study/ProseHtml";
import type { CaseStudyMetric } from "@/lib/case-studies";

export default function OutcomeSection({
  metrics,
  html,
}: {
  metrics?: CaseStudyMetric[];
  html?: string;
}) {
  return (
    <div className="flex flex-col gap-8">
      {metrics && metrics.length > 0 && (
        <div className="flex flex-wrap gap-8 border-b border-border-subtle pb-8">
          {metrics.map((metric) => (
            <div key={metric.label} className="flex flex-col gap-1">
              <span className="font-heading text-[40px] tracking-[-0.4px] text-ink md:text-[56px]">
                {metric.value}
              </span>
              <span className="max-w-[220px] font-body text-[14px] tracking-[-0.14px] text-ink/50">
                {metric.label}
              </span>
            </div>
          ))}
        </div>
      )}
      {html && <ProseHtml html={html} />}
    </div>
  );
}
```

- [ ] **Step 5: Write `components/case-study/SolutionSection.tsx`**

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
          <h3 className="font-heading text-[24px] tracking-[-0.24px] text-ink md:text-[32px]">
            {item.heading}
          </h3>
          <CaseStudyImage
            src={item.image}
            alt={item.heading}
            label={`Solution screenshot — 800×600 (${item.heading})`}
            className="h-[280px] w-full md:h-[400px]"
          />
          <ProseHtml html={item.html} />
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 6: Verify it builds**

Run: `npm run build`
Expected: Same pre-existing failures as end of Task 3 (`CASE_STUDIES`/`readLink` in the two page files and `CaseStudyCard`), no new errors from these five new files.

- [ ] **Step 7: Commit**

```bash
git add components/case-study/
git commit -m "feat: add case study section components (context strip, process, solution, outcome, prose)"
```

---

### Task 6: Rewrite the case study detail page and fix CaseStudyCard

**Files:**
- Modify: `app/case-studies/[slug]/page.tsx` (full rewrite)
- Modify: `components/CaseStudyCard.tsx`

- [ ] **Step 1: Replace `components/CaseStudyCard.tsx`'s read-link**

Find:
```tsx
        <Link
          href={`/case-studies/${caseStudy.slug}`}
          className="font-body text-[14px] font-medium text-ink underline decoration-solid [text-underline-position:from-font]"
        >
          {caseStudy.readLink} &rarr;
        </Link>
```

Replace with:
```tsx
        <Link
          href={`/case-studies/${caseStudy.slug}`}
          className="font-body text-[14px] font-medium text-ink underline decoration-solid [text-underline-position:from-font]"
        >
          Read case study &rarr;
        </Link>
```

- [ ] **Step 2: Replace the entire contents of `app/case-studies/[slug]/page.tsx`**

```tsx
import { notFound } from "next/navigation";
import Link from "next/link";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SiteSidebar from "@/components/SiteSidebar";
import { AccordionItem } from "@/components/AccordionItem";
import CaseStudyImage from "@/components/CaseStudyImage";
import ContextStrip from "@/components/case-study/ContextStrip";
import ProcessInsights from "@/components/case-study/ProcessInsights";
import SolutionSection from "@/components/case-study/SolutionSection";
import OutcomeSection from "@/components/case-study/OutcomeSection";
import ProseHtml from "@/components/case-study/ProseHtml";
import {
  getAllCaseStudies,
  getAllCaseStudySlugs,
  getCaseStudyBySlug,
} from "@/lib/case-studies";
import { FAQ_ITEMS } from "@/lib/faq-data";

export function generateStaticParams() {
  return getAllCaseStudySlugs().map((slug) => ({ slug }));
}

export default async function CaseStudyDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const caseStudy = getCaseStudyBySlug(slug);
  if (!caseStudy) {
    notFound();
  }

  const otherCaseStudies = getAllCaseStudies().filter((cs) => cs.slug !== slug);

  const hasNarrative = Boolean(
    caseStudy.problemHtml ||
      (caseStudy.processInsights && caseStudy.processInsights.length > 0) ||
      (caseStudy.solutionItems && caseStudy.solutionItems.length > 0) ||
      (caseStudy.metrics && caseStudy.metrics.length > 0) ||
      caseStudy.outcomeHtml ||
      caseStudy.closeHtml
  );

  return (
    <div className="flex min-h-screen w-full flex-col bg-paper">
      <Navbar />
      <div className="flex w-full flex-1">
        <SiteSidebar />
        <main className="flex w-full flex-1 flex-col">
          {/* Hero */}
          <section className="flex w-full flex-col gap-12 border-b border-border-subtle pt-14 shadow-[0_4px_4px_0_rgba(0,0,0,0.25)]">
            <div className="flex flex-col gap-6 px-6">
              <div className="flex items-end justify-between">
                <h1 className="relative font-heading text-[32px] tracking-[-0.32px] text-ink md:text-[56px] md:tracking-[-0.56px]">
                  {caseStudy.title}
                </h1>
                <span className="hidden whitespace-nowrap font-body text-[18px] font-medium tracking-[-0.18px] text-ink md:block">
                  [&nbsp;&nbsp;CASE STUDY&nbsp;&nbsp;]
                </span>
              </div>
              <p className="max-w-[720px] font-body text-[18px] font-medium leading-[1.6] tracking-[-0.18px] text-ink/50 md:text-[24px] md:tracking-[-0.24px]">
                {caseStudy.summary}
              </p>
            </div>
            <CaseStudyImage
              src={caseStudy.heroImage}
              alt={caseStudy.title}
              label="Hero image — 1200×675"
              className="mx-6 h-[280px] md:h-[480px]"
            />
            <div className="h-px w-full bg-border-subtle" />
          </section>

          {/* Context strip */}
          <section className="flex w-full flex-col gap-8 px-6 py-14 shadow-[0_4px_4px_0_rgba(0,0,0,0.25)]">
            <h2 className="font-heading text-[32px] tracking-[-0.32px] text-ink md:text-[48px]">
              About Project
            </h2>
            <ContextStrip
              category={caseStudy.category}
              role={caseStudy.role}
              client={caseStudy.client}
              duration={caseStudy.duration}
              location={caseStudy.location}
              liveUrl={caseStudy.liveUrl}
            />
          </section>

          {/* Narrative */}
          <section className="flex w-full flex-col gap-12 py-14 shadow-button">
            {caseStudy.problemHtml && (
              <div className="flex flex-col gap-8 px-6">
                <h2 className="font-heading text-[32px] tracking-[-0.32px] text-ink md:text-[48px]">
                  Problem
                </h2>
                <ProseHtml html={caseStudy.problemHtml} />
              </div>
            )}

            {caseStudy.processInsights && caseStudy.processInsights.length > 0 && (
              <div className="flex flex-col gap-8 px-6">
                <h2 className="font-heading text-[32px] tracking-[-0.32px] text-ink md:text-[48px]">
                  Process
                </h2>
                <ProcessInsights items={caseStudy.processInsights} />
              </div>
            )}

            {caseStudy.solutionItems && caseStudy.solutionItems.length > 0 && (
              <div className="flex flex-col gap-8 px-6">
                <h2 className="font-heading text-[32px] tracking-[-0.32px] text-ink md:text-[48px]">
                  Solution
                </h2>
                <SolutionSection items={caseStudy.solutionItems} />
              </div>
            )}

            {((caseStudy.metrics && caseStudy.metrics.length > 0) ||
              caseStudy.outcomeHtml) && (
              <div className="flex flex-col gap-8 px-6">
                <h2 className="font-heading text-[32px] tracking-[-0.32px] text-ink md:text-[48px]">
                  Outcome
                </h2>
                <OutcomeSection metrics={caseStudy.metrics} html={caseStudy.outcomeHtml} />
              </div>
            )}

            {caseStudy.closeHtml && (
              <div className="flex flex-col gap-8 px-6">
                <h2 className="font-heading text-[32px] tracking-[-0.32px] text-ink md:text-[48px]">
                  Close
                </h2>
                <ProseHtml html={caseStudy.closeHtml} />
              </div>
            )}

            {!hasNarrative && (
              <div className="flex flex-col gap-2 px-6">
                <p className="font-body text-[16px] tracking-[-0.16px] text-ink/50">
                  Full case study coming soon.
                </p>
              </div>
            )}
          </section>

          {/* More Works */}
          <section
            id="more-works"
            className="flex w-full flex-col gap-12 py-14 shadow-[0_4px_4px_0_rgba(0,0,0,0.25)]"
          >
            <div className="flex items-end justify-between px-6">
              <h2 className="relative font-heading text-[32px] tracking-[-0.32px] text-ink md:text-[56px] md:tracking-[-0.56px]">
                More Works
              </h2>
            </div>

            <div className="flex flex-col items-center justify-center gap-8 px-6 py-10">
              <div className="flex w-full flex-col items-center gap-4 md:flex-row">
                {otherCaseStudies.map((cs) => (
                  <Link
                    key={cs.slug}
                    href={`/case-studies/${cs.slug}`}
                    className="group relative flex h-[280px] w-full flex-1 items-end justify-center overflow-clip rounded-md border border-border-subtle bg-surface p-6 shadow-button md:h-[526px]"
                  >
                    <span className="absolute left-1/2 top-6 -translate-x-1/2 text-center font-body text-[16px] font-medium tracking-[-0.16px] text-ink md:top-8">
                      {cs.title}
                    </span>
                    <span className="inline-flex items-center justify-center gap-2 rounded-sm border border-white/10 bg-white/20 px-3 py-2 font-body text-[14px] font-medium tracking-[-0.14px] text-paper opacity-0 backdrop-blur transition-opacity group-hover:opacity-100">
                      See Study Case
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section
            id="faq"
            className="flex w-full flex-col items-start gap-12 px-6 py-14 shadow-[0_4px_4px_0_rgba(0,0,0,0.25)]"
          >
            <div className="flex w-full items-end justify-between gap-6">
              <div className="flex flex-1 items-center justify-between gap-6">
                <h2 className="font-heading text-[32px] leading-tight tracking-[-0.32px] text-ink md:text-[56px] md:leading-[normal] md:tracking-[-0.56px]">
                  Things You Might Want to Know
                </h2>
                <p className="hidden whitespace-nowrap font-body text-[18px] font-medium tracking-[-0.18px] text-ink md:block">
                  [ FREQUENTLY ASKED QUESTIONS ]
                </p>
              </div>
            </div>

            <div className="flex w-full flex-col items-start gap-4">
              {FAQ_ITEMS.map((faq) => (
                <AccordionItem
                  key={faq.question}
                  question={faq.question}
                  answer={faq.answer}
                />
              ))}
            </div>
          </section>
        </main>
      </div>
      <Footer />
    </div>
  );
}
```

- [ ] **Step 3: Verify it builds**

Run: `npm run build`
Expected: Build succeeds — the only remaining reference to the old data shape (`CASE_STUDIES`/`readLink`) was in `app/case-studies/page.tsx`, which Task 7 fixes next. Confirm the error list (if any) only mentions that file.

- [ ] **Step 4: Commit**

```bash
git add app/case-studies/\[slug\]/page.tsx components/CaseStudyCard.tsx
git commit -m "feat: redesign case study detail page around the winning content pattern"
```

---

### Task 7: Split the case studies list page into server + client components

**Files:**
- Create: `components/CaseStudyListClient.tsx`
- Modify: `app/case-studies/page.tsx` (full rewrite)

The list page needs `fs` access (via `getAllCaseStudies()`), which requires a Server Component, but the category-filter interaction needs `useState`, which requires a Client Component. Split the existing single client component into a server page that fetches data and a client component that owns just the filter UI — the filter behavior itself is unchanged.

- [ ] **Step 1: Create `components/CaseStudyListClient.tsx`**

```tsx
"use client";

import { useState } from "react";
import CaseStudyCard from "@/components/CaseStudyCard";
import type { CaseStudy } from "@/lib/case-studies";

const FILTERS = ["All", "FinTech", "AI-native", "GovTech"] as const;
type Filter = (typeof FILTERS)[number];

export default function CaseStudyListClient({
  caseStudies,
}: {
  caseStudies: CaseStudy[];
}) {
  const [filter, setFilter] = useState<Filter>("All");

  const visible: CaseStudy[] =
    filter === "All" ? caseStudies : caseStudies.filter((cs) => cs.category === filter);

  return (
    <>
      <div className="flex flex-wrap items-start gap-3 px-6">
        {FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`rounded-full px-3 py-2 font-body text-[14px] font-semibold ${
              filter === f
                ? "bg-ink text-paper"
                : "border border-border-subtle bg-paper text-ink"
            }`}
          >
            {f}
          </button>
        ))}
      </div>
      <div className="flex w-full flex-col gap-8 px-6">
        {visible.map((cs) => (
          <CaseStudyCard key={cs.slug} caseStudy={cs} />
        ))}
      </div>
    </>
  );
}
```

- [ ] **Step 2: Replace the entire contents of `app/case-studies/page.tsx`**

```tsx
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SiteSidebar from "@/components/SiteSidebar";
import CaseStudyListClient from "@/components/CaseStudyListClient";
import { getAllCaseStudies } from "@/lib/case-studies";

export default function CaseStudiesPage() {
  const caseStudies = getAllCaseStudies();

  return (
    <div className="flex min-h-screen w-full flex-col bg-paper">
      <Navbar />
      <div className="flex w-full flex-1">
        <SiteSidebar />
        <main
          id="list"
          className="flex w-full flex-1 flex-col gap-12 px-6 py-14 md:px-6 md:py-14"
        >
          <div className="flex items-end justify-between whitespace-nowrap px-6 text-ink">
            <h1 className="font-heading text-[32px] tracking-[-0.32px] md:text-[56px] md:tracking-[-0.56px]">
              Case Studies
            </h1>
            <span className="font-body text-[18px] font-medium tracking-[-0.18px]">
              [ WORK ]
            </span>
          </div>
          <div className="h-px w-full bg-border-subtle" />
          <CaseStudyListClient caseStudies={caseStudies} />
        </main>
      </div>
      <Footer />
    </div>
  );
}
```

- [ ] **Step 3: Verify it builds**

Run: `npm run build`
Expected: Build succeeds fully — 12/12 pages, no type errors, no remaining references to the deleted `CASE_STUDIES` array or `readLink` field anywhere.

Also run: `grep -rn "CASE_STUDIES\|readLink" app/ components/ lib/`
Expected: No matches.

- [ ] **Step 4: Commit**

```bash
git add app/case-studies/page.tsx components/CaseStudyListClient.tsx
git commit -m "feat: split case studies list page into server data-fetch + client filter"
```

---

### Task 8: Manual verification with a fully-filled fixture

**Files:**
- Temporarily modify: `content/case-studies/ryno-finance.md` (reverted at the end of this task)

This task proves every rendering path works — every optional field present, every optional field absent — before calling the feature done. Nothing here is committed; the fixture edit is reverted in the last step.

- [ ] **Step 1: Temporarily fill `content/case-studies/ryno-finance.md` with every field and section**

Replace its contents with:

```markdown
---
slug: ryno-finance
title: "Ryno Finance - Compliance State Machine"
category: FinTech
summary: "Designing the queue where one click blocks or clears real money"
role: "Lead Product Designer"
client: "Ryno Finance"
duration: "14 weeks"
location: "Remote"
liveUrl: "https://example.com"
metrics:
  - value: "40%"
    label: "Reduction in manual review time"
  - value: "3x"
    label: "Faster fraud queue triage"
---

## Problem
Compliance reviewers were clearing or blocking real transactions from a queue with no risk context, leading to slow, inconsistent decisions.

## Process
- Interviewed 6 reviewers to map decision fatigue points
- Found that risk signals were scattered across 4 separate tools
- Learned that batch actions were the single biggest time sink

## Solution
### Progressive risk disclosure
Redesigned the queue to surface the top 3 risk signals inline, with detail on demand instead of upfront.

### Bulk action queue
![Bulk queue mock](/images/case-studies/ryno-finance/solution-2.png)
Added multi-select so reviewers could clear or flag entire batches of low-risk transactions at once.

## Outcome
Reviewers now clear routine transactions in a fraction of the time, with fewer escalations overall.

## Close
This project reinforced how much of "compliance UX" is really about trustworthy defaults, not more controls.
```

Note this fixture intentionally has one Solution item with an image and one without, to verify both `CaseStudyImage` code paths.

- [ ] **Step 2: Start the dev server and load the page**

Run: `npm run dev`

Open `http://localhost:3000/case-studies/ryno-finance` in a browser and confirm:
- Hero shows the real title and summary, with a dashed "Hero image — 1200×675" placeholder (no `heroImage` was set)
- Context strip shows all five rows (Role, Client, Duration, Location, Category) plus a working "Live Website" button linking to `https://example.com`
- Problem section renders the paragraph
- Process section renders 3 bullet insights
- Solution section renders both items: "Progressive risk disclosure" with a dashed placeholder image (no leading image in that item), and "Bulk action queue" with the actual placeholder-path image (broken image icon is fine — the file doesn't exist on disk yet — confirm it's attempting to render an `<img>`, not the dashed placeholder box, since a path was provided)
- Outcome section renders both stat pairs (40% / 3x) above the wrap-up paragraph
- Close section renders the reflection paragraph
- No "Full case study coming soon" note appears (since narrative content is present)

Then open `http://localhost:3000/case-studies/linqart` (still untouched, minimal frontmatter only) and confirm:
- Hero shows title/summary with the hero placeholder
- Context strip shows only the Category row, and no "Live Website" button renders (no `liveUrl` set)
- No Problem/Process/Solution/Outcome/Close sections render
- The single "Full case study coming soon." note appears once

Then open `http://localhost:3000/case-studies` and confirm the category filter (All/FinTech/AI-native/GovTech) still works identically to before, and each card's "Read case study" link still navigates correctly.

- [ ] **Step 3: Stop the dev server and revert the fixture**

Stop the dev server (Ctrl-C), then revert the fixture file back to the minimal version:

```bash
git checkout -- content/case-studies/ryno-finance.md
```

Run: `git status`
Expected: Clean working tree (the fixture edit is fully reverted, nothing to commit from this task).

---

### Task 9: Final full-project verification

**Files:** None (verification only)

- [ ] **Step 1: Full production build**

Run: `npm run build`
Expected: Succeeds, 12/12 pages generated (`/`, `/_not-found`, `/about`, `/api/chat`, `/api/contact`, `/case-studies`, `/case-studies/ryno-finance`, `/case-studies/linqart`, `/case-studies/federal-pms`, `/contact`), no type errors.

- [ ] **Step 2: Lint**

Run: `npm run lint`
Expected: No errors.

- [ ] **Step 3: Confirm no orphaned references**

Run: `grep -rn "CASE_STUDIES\|readLink\|NARRATIVE_SECTIONS\|About Project" app/ components/ lib/ --include="*.tsx" --include="*.ts"`
Expected: No matches for `CASE_STUDIES`, `readLink`, or `NARRATIVE_SECTIONS` (all removed by earlier tasks). A match for `About Project` is expected and correct — it's the still-used context strip section heading in `[slug]/page.tsx`.

- [ ] **Step 4: Confirm working tree is clean and every task's commit is present**

Run: `git log --oneline nav-rework..HEAD` (or `git log --oneline -10`)
Expected: One commit per task (9 commits: deps, markdown-sections, case-studies loader + content, CaseStudyImage, section components, detail page rewrite, list page split), working tree clean.
