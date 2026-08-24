# Local Case Study CMS Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A dev-only `/admin` area (404s outside `npm run dev`) for creating, editing, and deleting case studies through form fields and image uploads, instead of hand-editing markdown files.

**Architecture:** A new `lib/case-study-admin.ts` reads/writes the raw markdown source (separate from `lib/case-studies.ts`, which only ever parses to rendered HTML for the public site). A small `lib/admin-guard.ts` helper gates every admin page and API route to `NODE_ENV === "development"`. Three new API routes (list/create, get/update/delete-one, image-upload) back a set of plain, utilitarian React form components under `components/admin/`.

**Tech Stack:** Next.js 16 App Router, TypeScript, `gray-matter` (already a dependency, used here for both parsing and stringifying frontmatter), `sharp` (new dependency, image resizing).

---

### Task 1: Install `sharp` and add a plain-text section reader

**Files:**
- Modify: `package.json` (via `npm install`)
- Modify: `lib/markdown-sections.ts`

- [ ] **Step 1: Install `sharp`**

Run:
```bash
npm install sharp
```

- [ ] **Step 2: Add `nodesToPlainParagraphs` to `lib/markdown-sections.ts`**

This is the "raw text" counterpart to the existing `nodesToHtml` — instead of converting a section's nodes to an HTML string for display, it extracts each top-level paragraph's plain text and joins them with blank lines, for use in an editable textarea.

Find:
```typescript
export function listItemsWithLeadingImage(
```

Replace with:
```typescript
export function nodesToPlainParagraphs(nodes: RootContent[]): string {
  return nodes
    .filter((node) => node.type === "paragraph")
    .map((node) => collectText((node as Paragraph).children as RootContent[]).trim())
    .join("\n\n");
}

export function listItemsWithLeadingImage(
```

- [ ] **Step 3: Verify it builds**

Run: `npm run build`
Expected: Build succeeds — 12/12 pages, no type errors. `nodesToPlainParagraphs` isn't called anywhere yet.

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json lib/markdown-sections.ts
git commit -m "chore: add sharp dependency and nodesToPlainParagraphs reader"
```

---

### Task 2: Raw case study reader (`lib/case-study-admin.ts`, read side)

**Files:**
- Create: `lib/case-study-admin.ts`

- [ ] **Step 1: Write the read side of `lib/case-study-admin.ts`**

```typescript
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { RootContent } from "mdast";
import {
  parseMarkdownBody,
  splitByHeadingText,
  listItemsWithLeadingImage,
  extractLeadingImages,
  nodesToPlainParagraphs,
} from "./markdown-sections";
import type {
  CaseStudyCategory,
  CaseStudyMetric,
  CaseStudyProcessInsight,
} from "./case-studies";

const CONTENT_DIR = path.join(process.cwd(), "content", "case-studies");

export type RawSolutionItem = {
  heading: string;
  images: string[];
  body: string;
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
  process?: CaseStudyProcessInsight[];
  obstacles?: string;
  solution?: RawSolutionItem[];
  outcome?: string;
  close?: string;
};

type RawFrontmatter = {
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
};

export function getAllRawCaseStudySlugs(): string[] {
  return fs
    .readdirSync(CONTENT_DIR)
    .filter((filename) => filename.endsWith(".md"))
    .map((filename) => filename.replace(/\.md$/, ""));
}

export function getRawCaseStudyContent(slug: string): RawCaseStudyContent | undefined {
  const filePath = path.join(CONTENT_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) return undefined;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  const frontmatter = data as RawFrontmatter;

  const nodes = parseMarkdownBody(content);
  const sections = splitByHeadingText(nodes, 2);
  const getSection = (name: string) => sections.find((s) => s.heading === name);

  const problem = getSection("Problem");
  const processSection = getSection("Process");
  const obstacles = getSection("Obstacles");
  const solution = getSection("Solution");
  const outcome = getSection("Outcome");
  const close = getSection("Close");

  let solutionItems: RawSolutionItem[] | undefined;
  if (solution) {
    const items = splitByHeadingText(solution.nodes as RootContent[], 3);
    solutionItems = items.map((item) => {
      const { images, rest } = extractLeadingImages(item.nodes);
      return { heading: item.heading, images, body: nodesToPlainParagraphs(rest) };
    });
  }

  return {
    slug,
    title: frontmatter.title,
    category: frontmatter.category,
    summary: frontmatter.summary,
    role: frontmatter.role,
    team: frontmatter.team,
    client: frontmatter.client,
    duration: frontmatter.duration,
    location: frontmatter.location,
    liveUrl: frontmatter.liveUrl,
    heroImage: frontmatter.heroImage,
    metrics: frontmatter.metrics,
    problem: problem ? nodesToPlainParagraphs(problem.nodes) : undefined,
    process: processSection ? listItemsWithLeadingImage(processSection.nodes) : undefined,
    obstacles: obstacles ? nodesToPlainParagraphs(obstacles.nodes) : undefined,
    solution: solutionItems,
    outcome: outcome ? nodesToPlainParagraphs(outcome.nodes) : undefined,
    close: close ? nodesToPlainParagraphs(close.nodes) : undefined,
  };
}

export function getAllRawCaseStudies(): RawCaseStudyContent[] {
  return getAllRawCaseStudySlugs()
    .map((slug) => getRawCaseStudyContent(slug))
    .filter((cs): cs is RawCaseStudyContent => cs !== undefined);
}
```

- [ ] **Step 2: Verify it builds**

Run: `npm run build`
Expected: Build succeeds — 12/12 pages, no type errors. Nothing calls this file yet.

- [ ] **Step 3: Commit**

```bash
git add lib/case-study-admin.ts
git commit -m "feat: add raw case study reader for the local CMS"
```

---

### Task 3: Raw case study writer (`lib/case-study-admin.ts`, write side)

**Files:**
- Modify: `lib/case-study-admin.ts`

- [ ] **Step 1: Add the serialization and write functions**

Find:
```typescript
export function getAllRawCaseStudies(): RawCaseStudyContent[] {
  return getAllRawCaseStudySlugs()
    .map((slug) => getRawCaseStudyContent(slug))
    .filter((cs): cs is RawCaseStudyContent => cs !== undefined);
}
```

Replace with:
```typescript
export function getAllRawCaseStudies(): RawCaseStudyContent[] {
  return getAllRawCaseStudySlugs()
    .map((slug) => getRawCaseStudyContent(slug))
    .filter((cs): cs is RawCaseStudyContent => cs !== undefined);
}

function serializeProseSection(heading: string, text?: string): string {
  if (!text || text.trim() === "") return "";
  return `## ${heading}\n${text.trim()}\n`;
}

function serializeProcessSection(insights?: CaseStudyProcessInsight[]): string {
  if (!insights || insights.length === 0) return "";
  const items = insights.map((insight) => {
    if (insight.image) {
      return `- ![Screenshot](${insight.image})\n\n  ${insight.text}`;
    }
    return `- ${insight.text}`;
  });
  return `## Process\n${items.join("\n")}\n`;
}

function serializeSolutionSection(items?: RawSolutionItem[]): string {
  if (!items || items.length === 0) return "";
  const blocks = items.map((item) => {
    const imageLines = item.images
      .filter((src) => src.trim() !== "")
      .map((src) => `![Screenshot](${src})`)
      .join("\n");
    const imagePart = imageLines ? `${imageLines}\n` : "";
    return `### ${item.heading}\n${imagePart}${item.body.trim()}`;
  });
  return `## Solution\n${blocks.join("\n\n")}\n`;
}

function buildBody(data: RawCaseStudyContent): string {
  const sections = [
    serializeProseSection("Problem", data.problem),
    serializeProcessSection(data.process),
    serializeProseSection("Obstacles", data.obstacles),
    serializeSolutionSection(data.solution),
    serializeProseSection("Outcome", data.outcome),
    serializeProseSection("Close", data.close),
  ].filter((section) => section.length > 0);
  return `\n${sections.join("\n")}`;
}

export function saveCaseStudyContent(slug: string, data: RawCaseStudyContent): void {
  const filePath = path.join(CONTENT_DIR, `${slug}.md`);
  const frontmatter: RawFrontmatter = {
    slug: data.slug,
    title: data.title,
    category: data.category,
    summary: data.summary,
  };
  if (data.role) frontmatter.role = data.role;
  if (data.team) frontmatter.team = data.team;
  if (data.client) frontmatter.client = data.client;
  if (data.duration) frontmatter.duration = data.duration;
  if (data.location) frontmatter.location = data.location;
  if (data.liveUrl) frontmatter.liveUrl = data.liveUrl;
  if (data.heroImage) frontmatter.heroImage = data.heroImage;
  if (data.metrics && data.metrics.length > 0) frontmatter.metrics = data.metrics;

  const body = buildBody(data);
  const fileContents = matter.stringify(body, frontmatter);
  fs.writeFileSync(filePath, fileContents, "utf-8");
}

export function createCaseStudy(data: {
  slug: string;
  title: string;
  category: CaseStudyCategory;
  summary: string;
}): void {
  const filePath = path.join(CONTENT_DIR, `${data.slug}.md`);
  if (fs.existsSync(filePath)) {
    throw new Error(`A case study with slug "${data.slug}" already exists`);
  }
  saveCaseStudyContent(data.slug, {
    slug: data.slug,
    title: data.title,
    category: data.category,
    summary: data.summary,
  });
}

export function deleteCaseStudy(slug: string): void {
  const filePath = path.join(CONTENT_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) {
    throw new Error(`No case study found with slug "${slug}"`);
  }
  fs.unlinkSync(filePath);
}
```

- [ ] **Step 2: Verify it builds**

Run: `npm run build`
Expected: Build succeeds — 12/12 pages, no type errors.

Note: there's no test framework in this project and no ts-node/tsx installed to run a standalone script against this TypeScript file, so round-trip correctness (read → edit → save → confirm the file matches the schema) is verified through the actual admin UI once it exists — that full check happens in Task 12, not here. Don't invent a script that can't actually run.

- [ ] **Step 3: Commit**

```bash
git add lib/case-study-admin.ts
git commit -m "feat: add markdown serialization and write functions for the local CMS"
```

---

### Task 4: Dev-only guard and the case studies collection API route

**Files:**
- Create: `lib/admin-guard.ts`
- Create: `app/api/admin/case-studies/route.ts`

- [ ] **Step 1: Write `lib/admin-guard.ts`**

```typescript
export function isDevOnly(): boolean {
  return process.env.NODE_ENV === "development";
}
```

- [ ] **Step 2: Write `app/api/admin/case-studies/route.ts`**

```typescript
import { isDevOnly } from "@/lib/admin-guard";
import { getAllRawCaseStudies, createCaseStudy } from "@/lib/case-study-admin";
import type { CaseStudyCategory } from "@/lib/case-studies";

export const runtime = "nodejs";

function jsonError(error: string, status: number): Response {
  return new Response(JSON.stringify({ error }), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export async function GET() {
  if (!isDevOnly()) return jsonError("not_found", 404);
  const caseStudies = getAllRawCaseStudies();
  return new Response(JSON.stringify({ caseStudies }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

type CreatePayload = {
  slug: string;
  title: string;
  category: CaseStudyCategory;
  summary: string;
};

function isCreatePayload(value: unknown): value is CreatePayload {
  if (typeof value !== "object" || value === null) return false;
  const { slug, title, category, summary } = value as Record<string, unknown>;
  return (
    typeof slug === "string" &&
    /^[a-z0-9-]+$/.test(slug) &&
    typeof title === "string" &&
    title.trim().length > 0 &&
    (category === "FinTech" || category === "AI-native" || category === "GovTech") &&
    typeof summary === "string" &&
    summary.trim().length > 0
  );
}

export async function POST(request: Request) {
  if (!isDevOnly()) return jsonError("not_found", 404);

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError("invalid_json", 400);
  }

  if (!isCreatePayload(body)) {
    return jsonError("invalid_payload", 400);
  }

  try {
    createCaseStudy(body);
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "create_failed", 409);
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 201,
    headers: { "Content-Type": "application/json" },
  });
}
```

- [ ] **Step 3: Verify it builds**

Run: `npm run build`
Expected: Build succeeds — 12/12 pages plus the new `/api/admin/case-studies` route, no type errors.

- [ ] **Step 4: Verify the dev-only gate with curl**

Run: `npm run build && npm run start &`, wait for it to be ready, then:
```bash
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/api/admin/case-studies
```
Expected: `404` (since `npm start` runs a production build, `NODE_ENV` is `"production"`).

Kill the server, then run: `npm run dev &`, wait for it to be ready, then:
```bash
curl -s http://localhost:3000/api/admin/case-studies
```
Expected: `{"caseStudies":[...]}` — a 200 with the 3 existing case studies' raw content. Kill the dev server when done.

- [ ] **Step 5: Commit**

```bash
git add lib/admin-guard.ts app/api/admin/case-studies/route.ts
git commit -m "feat: add dev-only guard and case studies list/create API route"
```

---

### Task 5: Single case study API route (get/update/delete)

**Files:**
- Create: `app/api/admin/case-studies/[slug]/route.ts`

- [ ] **Step 1: Write the route**

```typescript
import { isDevOnly } from "@/lib/admin-guard";
import {
  getRawCaseStudyContent,
  saveCaseStudyContent,
  deleteCaseStudy,
  type RawCaseStudyContent,
} from "@/lib/case-study-admin";

export const runtime = "nodejs";

function jsonError(error: string, status: number): Response {
  return new Response(JSON.stringify({ error }), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  if (!isDevOnly()) return jsonError("not_found", 404);
  const { slug } = await params;
  const caseStudy = getRawCaseStudyContent(slug);
  if (!caseStudy) return jsonError("not_found", 404);
  return new Response(JSON.stringify({ caseStudy }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

function isRawCaseStudyContent(value: unknown): value is RawCaseStudyContent {
  if (typeof value !== "object" || value === null) return false;
  const { slug, title, category, summary } = value as Record<string, unknown>;
  return (
    typeof slug === "string" &&
    typeof title === "string" &&
    (category === "FinTech" || category === "AI-native" || category === "GovTech") &&
    typeof summary === "string"
  );
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  if (!isDevOnly()) return jsonError("not_found", 404);
  const { slug } = await params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError("invalid_json", 400);
  }

  if (!isRawCaseStudyContent(body)) {
    return jsonError("invalid_payload", 400);
  }

  saveCaseStudyContent(slug, body);
  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  if (!isDevOnly()) return jsonError("not_found", 404);
  const { slug } = await params;
  try {
    deleteCaseStudy(slug);
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "delete_failed", 404);
  }
  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
```

- [ ] **Step 2: Verify it builds**

Run: `npm run build`
Expected: Build succeeds, no type errors.

- [ ] **Step 3: Commit**

```bash
git add "app/api/admin/case-studies/[slug]/route.ts"
git commit -m "feat: add single case study get/update/delete API route"
```

---

### Task 6: Image upload API route

**Files:**
- Create: `app/api/admin/case-studies/[slug]/images/route.ts`

- [ ] **Step 1: Write the route**

```typescript
import fs from "fs";
import path from "path";
import sharp from "sharp";
import { isDevOnly } from "@/lib/admin-guard";

export const runtime = "nodejs";

function jsonError(error: string, status: number): Response {
  return new Response(JSON.stringify({ error }), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function sanitizeFilename(name: string): string {
  const ext = path.extname(name).toLowerCase() || ".png";
  const base = path
    .basename(name, path.extname(name))
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  return `${base || "image"}${ext}`;
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  if (!isDevOnly()) return jsonError("not_found", 404);
  const { slug } = await params;

  const formData = await request.formData();
  const file = formData.get("file");
  const maxWidthRaw = formData.get("maxWidth");
  const maxWidth = typeof maxWidthRaw === "string" ? parseInt(maxWidthRaw, 10) : 1200;

  if (!(file instanceof File)) {
    return jsonError("missing_file", 400);
  }

  const dir = path.join(process.cwd(), "public", "images", "case-studies", slug);
  fs.mkdirSync(dir, { recursive: true });

  const sanitized = sanitizeFilename(file.name);
  let filename = sanitized;
  let counter = 1;
  while (fs.existsSync(path.join(dir, filename))) {
    const ext = path.extname(sanitized);
    const base = path.basename(sanitized, ext);
    filename = `${base}-${counter}${ext}`;
    counter += 1;
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const resized = await sharp(buffer)
    .resize({ width: maxWidth, withoutEnlargement: true })
    .toBuffer();

  fs.writeFileSync(path.join(dir, filename), resized);

  return new Response(
    JSON.stringify({ path: `/images/case-studies/${slug}/${filename}` }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
}
```

- [ ] **Step 2: Verify it builds**

Run: `npm run build`
Expected: Build succeeds, no type errors.

- [ ] **Step 3: Verify with a curl upload against the dev server**

Run: `npm run dev &`, wait for it to be ready, then upload any local image file you have (substitute a real path):
```bash
curl -s -X POST http://localhost:3000/api/admin/case-studies/ryno-finance/images \
  -F "file=@/path/to/any/local/image.png" \
  -F "maxWidth=800"
```
Expected: `{"path":"/images/case-studies/ryno-finance/image.png"}` (or `image-1.png` etc. if that name already exists). Confirm the file actually landed on disk at `public/images/case-studies/ryno-finance/` and that `file public/images/case-studies/ryno-finance/image.png` reports a width at or under 800px if the source was wider.

Delete the test-uploaded file afterward if it isn't one you want to keep:
```bash
rm public/images/case-studies/ryno-finance/image.png
```
Kill the dev server when done.

- [ ] **Step 4: Commit**

```bash
git add "app/api/admin/case-studies/[slug]/images/route.ts"
git commit -m "feat: add image upload API route with server-side resizing"
```

---

### Task 7: Admin list page

**Files:**
- Create: `app/admin/page.tsx`
- Create: `components/admin/AdminDeleteButton.tsx`

- [ ] **Step 1: Write `components/admin/AdminDeleteButton.tsx`**

```tsx
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminDeleteButton({ slug }: { slug: string }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    const confirmed = window.confirm(`Delete "${slug}"? This cannot be undone.`);
    if (!confirmed) return;

    setIsDeleting(true);
    const response = await fetch(`/api/admin/case-studies/${slug}`, {
      method: "DELETE",
    });
    setIsDeleting(false);

    if (!response.ok) {
      window.alert("Failed to delete case study.");
      return;
    }

    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isDeleting}
      className="rounded border border-gray-300 px-3 py-1 text-sm hover:bg-gray-100 disabled:opacity-50"
    >
      {isDeleting ? "Deleting…" : "Delete"}
    </button>
  );
}
```

- [ ] **Step 2: Write `app/admin/page.tsx`**

```tsx
import Link from "next/link";
import { notFound } from "next/navigation";
import { isDevOnly } from "@/lib/admin-guard";
import { getAllRawCaseStudies } from "@/lib/case-study-admin";
import AdminDeleteButton from "@/components/admin/AdminDeleteButton";

export default function AdminPage() {
  if (!isDevOnly()) notFound();

  const caseStudies = getAllRawCaseStudies();

  return (
    <main className="mx-auto max-w-3xl p-6 font-sans text-sm">
      <h1 className="text-xl font-semibold">Case Studies</h1>
      <p className="mt-2">
        <Link href="/admin/new" className="underline">
          + Add new case study
        </Link>
      </p>
      <ul className="mt-4 list-none p-0">
        {caseStudies.map((cs) => (
          <li
            key={cs.slug}
            className="flex items-center justify-between border-b border-gray-200 py-3"
          >
            <div>
              <strong>{cs.title}</strong>
              <div className="text-xs text-gray-500">{cs.slug}</div>
            </div>
            <div className="flex gap-3">
              <Link
                href={`/admin/${cs.slug}`}
                className="rounded border border-gray-300 px-3 py-1 hover:bg-gray-100"
              >
                Edit
              </Link>
              <AdminDeleteButton slug={cs.slug} />
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
```

- [ ] **Step 3: Verify it builds**

Run: `npm run build`
Expected: Build succeeds, no type errors.

- [ ] **Step 4: Commit**

```bash
git add app/admin/page.tsx components/admin/AdminDeleteButton.tsx
git commit -m "feat: add admin case studies list page"
```

---

### Task 8: New case study page

**Files:**
- Create: `app/admin/new/page.tsx`
- Create: `components/admin/NewCaseStudyForm.tsx`

- [ ] **Step 1: Write `components/admin/NewCaseStudyForm.tsx`**

```tsx
"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import type { CaseStudyCategory } from "@/lib/case-studies";

const CATEGORIES: CaseStudyCategory[] = ["FinTech", "AI-native", "GovTech"];
const inputClass = "rounded border border-gray-300 px-2 py-1";

export default function NewCaseStudyForm() {
  const router = useRouter();
  const [slug, setSlug] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<CaseStudyCategory>("FinTech");
  const [summary, setSummary] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const response = await fetch("/api/admin/case-studies", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, title, category, summary }),
    });

    setIsSubmitting(false);

    if (!response.ok) {
      const data = await response.json().catch(() => ({ error: "create_failed" }));
      setError(data.error ?? "create_failed");
      return;
    }

    router.push(`/admin/${slug}`);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <label className="flex flex-col gap-1">
        Slug (lowercase, hyphens only)
        <input
          className={inputClass}
          value={slug}
          onChange={(event) => setSlug(event.target.value)}
          pattern="[a-z0-9-]+"
          required
        />
      </label>
      <label className="flex flex-col gap-1">
        Title
        <input
          className={inputClass}
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          required
        />
      </label>
      <label className="flex flex-col gap-1">
        Category
        <select
          className={inputClass}
          value={category}
          onChange={(event) => setCategory(event.target.value as CaseStudyCategory)}
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </label>
      <label className="flex flex-col gap-1">
        Summary
        <textarea
          className={inputClass}
          value={summary}
          onChange={(event) => setSummary(event.target.value)}
          required
        />
      </label>
      {error && <p className="text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded border border-gray-300 px-3 py-1 hover:bg-gray-100 disabled:opacity-50"
      >
        {isSubmitting ? "Creating…" : "Create"}
      </button>
    </form>
  );
}
```

- [ ] **Step 2: Write `app/admin/new/page.tsx`**

```tsx
import { notFound } from "next/navigation";
import { isDevOnly } from "@/lib/admin-guard";
import NewCaseStudyForm from "@/components/admin/NewCaseStudyForm";

export default function NewCaseStudyPage() {
  if (!isDevOnly()) notFound();
  return (
    <main className="mx-auto max-w-xl p-6 font-sans text-sm">
      <h1 className="text-xl font-semibold">New Case Study</h1>
      <div className="mt-4">
        <NewCaseStudyForm />
      </div>
    </main>
  );
}
```

- [ ] **Step 3: Verify it builds**

Run: `npm run build`
Expected: Build succeeds, no type errors.

- [ ] **Step 4: Commit**

```bash
git add app/admin/new/page.tsx components/admin/NewCaseStudyForm.tsx
git commit -m "feat: add new case study creation page"
```

---

### Task 9: Shared image upload field and metrics editor

**Files:**
- Create: `components/admin/ImageUploadField.tsx`
- Create: `components/admin/MetricsEditor.tsx`

- [ ] **Step 1: Write `components/admin/ImageUploadField.tsx`**

```tsx
"use client";

import { useState, type ChangeEvent } from "react";

export default function ImageUploadField({
  slug,
  value,
  maxWidth,
  onChange,
  label,
}: {
  slug: string;
  value?: string;
  maxWidth: number;
  onChange: (path: string) => void;
  label: string;
}) {
  const [isUploading, setIsUploading] = useState(false);

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("maxWidth", String(maxWidth));

    const response = await fetch(`/api/admin/case-studies/${slug}/images`, {
      method: "POST",
      body: formData,
    });
    setIsUploading(false);

    if (!response.ok) {
      window.alert("Image upload failed.");
      return;
    }

    const data = await response.json();
    onChange(data.path);
  }

  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm">{label}</label>
      {value && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={value}
          alt=""
          className="max-h-40 max-w-60 rounded border border-gray-300 object-cover"
        />
      )}
      <input type="file" accept="image/*" onChange={handleFileChange} disabled={isUploading} />
      {isUploading && <span className="text-xs text-gray-500">Uploading…</span>}
      {value && <span className="text-xs text-gray-500">{value}</span>}
    </div>
  );
}
```

- [ ] **Step 2: Write `components/admin/MetricsEditor.tsx`**

```tsx
"use client";

import type { CaseStudyMetric } from "@/lib/case-studies";

const inputClass = "rounded border border-gray-300 px-2 py-1";
const buttonClass = "rounded border border-gray-300 px-3 py-1 text-sm hover:bg-gray-100 disabled:opacity-50";

export default function MetricsEditor({
  metrics,
  onChange,
}: {
  metrics: CaseStudyMetric[];
  onChange: (metrics: CaseStudyMetric[]) => void;
}) {
  function updateMetric(index: number, field: keyof CaseStudyMetric, value: string) {
    const next = metrics.map((metric, i) =>
      i === index ? { ...metric, [field]: value } : metric
    );
    onChange(next);
  }

  function addMetric() {
    onChange([...metrics, { value: "", label: "" }]);
  }

  function removeMetric(index: number) {
    onChange(metrics.filter((_, i) => i !== index));
  }

  function moveMetric(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= metrics.length) return;
    const next = [...metrics];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  }

  return (
    <div className="flex flex-col gap-2 border-t border-gray-200 pt-4">
      <h3 className="text-base font-semibold">Metrics</h3>
      {metrics.map((metric, index) => (
        <div key={index} className="flex items-center gap-2">
          <input
            className={inputClass}
            placeholder="Value (e.g. 79%)"
            value={metric.value}
            onChange={(event) => updateMetric(index, "value", event.target.value)}
          />
          <input
            className={`${inputClass} flex-1`}
            placeholder="Label"
            value={metric.label}
            onChange={(event) => updateMetric(index, "label", event.target.value)}
          />
          <button
            type="button"
            className={buttonClass}
            onClick={() => moveMetric(index, -1)}
            disabled={index === 0}
          >
            ↑
          </button>
          <button
            type="button"
            className={buttonClass}
            onClick={() => moveMetric(index, 1)}
            disabled={index === metrics.length - 1}
          >
            ↓
          </button>
          <button type="button" className={buttonClass} onClick={() => removeMetric(index)}>
            Remove
          </button>
        </div>
      ))}
      <button type="button" className={buttonClass} onClick={addMetric}>
        + Add metric
      </button>
    </div>
  );
}
```

- [ ] **Step 3: Verify it builds**

Run: `npm run build`
Expected: Build succeeds, no type errors. Neither file is imported anywhere yet.

- [ ] **Step 4: Commit**

```bash
git add components/admin/ImageUploadField.tsx components/admin/MetricsEditor.tsx
git commit -m "feat: add image upload field and metrics editor components"
```

---

### Task 10: Process and Solution editors

**Files:**
- Create: `components/admin/ProcessEditor.tsx`
- Create: `components/admin/SolutionEditor.tsx`

- [ ] **Step 1: Write `components/admin/ProcessEditor.tsx`**

```tsx
"use client";

import type { CaseStudyProcessInsight } from "@/lib/case-studies";
import ImageUploadField from "@/components/admin/ImageUploadField";

const inputClass = "rounded border border-gray-300 px-2 py-1";
const buttonClass = "rounded border border-gray-300 px-3 py-1 text-sm hover:bg-gray-100 disabled:opacity-50";
const cardClass = "flex flex-col gap-2 rounded border border-gray-300 p-3";

export default function ProcessEditor({
  slug,
  insights,
  onChange,
}: {
  slug: string;
  insights: CaseStudyProcessInsight[];
  onChange: (insights: CaseStudyProcessInsight[]) => void;
}) {
  function updateInsight(index: number, next: Partial<CaseStudyProcessInsight>) {
    const updated = insights.map((insight, i) =>
      i === index ? { ...insight, ...next } : insight
    );
    onChange(updated);
  }

  function addInsight() {
    onChange([...insights, { text: "" }]);
  }

  function removeInsight(index: number) {
    onChange(insights.filter((_, i) => i !== index));
  }

  function moveInsight(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= insights.length) return;
    const next = [...insights];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  }

  return (
    <div className="flex flex-col gap-3 border-t border-gray-200 pt-4">
      <h3 className="text-base font-semibold">Process</h3>
      {insights.map((insight, index) => (
        <div key={index} className={cardClass}>
          <input
            className={inputClass}
            placeholder="Insight text"
            value={insight.text}
            onChange={(event) => updateInsight(index, { text: event.target.value })}
          />
          <ImageUploadField
            slug={slug}
            value={insight.image}
            maxWidth={1200}
            label="Optional image"
            onChange={(path) => updateInsight(index, { image: path })}
          />
          <div className="flex gap-2">
            <button
              type="button"
              className={buttonClass}
              onClick={() => moveInsight(index, -1)}
              disabled={index === 0}
            >
              ↑
            </button>
            <button
              type="button"
              className={buttonClass}
              onClick={() => moveInsight(index, 1)}
              disabled={index === insights.length - 1}
            >
              ↓
            </button>
            <button type="button" className={buttonClass} onClick={() => removeInsight(index)}>
              Remove
            </button>
          </div>
        </div>
      ))}
      <button type="button" className={buttonClass} onClick={addInsight}>
        + Add insight
      </button>
    </div>
  );
}
```

- [ ] **Step 2: Write `components/admin/SolutionEditor.tsx`**

```tsx
"use client";

import type { RawSolutionItem } from "@/lib/case-study-admin";
import ImageUploadField from "@/components/admin/ImageUploadField";

const inputClass = "rounded border border-gray-300 px-2 py-1";
const buttonClass = "rounded border border-gray-300 px-3 py-1 text-sm hover:bg-gray-100 disabled:opacity-50";
const cardClass = "flex flex-col gap-2 rounded border border-gray-300 p-3";

export default function SolutionEditor({
  slug,
  items,
  onChange,
}: {
  slug: string;
  items: RawSolutionItem[];
  onChange: (items: RawSolutionItem[]) => void;
}) {
  function updateItem(index: number, next: Partial<RawSolutionItem>) {
    const updated = items.map((item, i) => (i === index ? { ...item, ...next } : item));
    onChange(updated);
  }

  function addItem() {
    onChange([...items, { heading: "", images: [], body: "" }]);
  }

  function removeItem(index: number) {
    onChange(items.filter((_, i) => i !== index));
  }

  function moveItem(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  }

  function addImage(index: number) {
    updateItem(index, { images: [...items[index].images, ""] });
  }

  function updateImage(itemIndex: number, imageIndex: number, path: string) {
    const nextImages = items[itemIndex].images.map((img, i) => (i === imageIndex ? path : img));
    updateItem(itemIndex, { images: nextImages });
  }

  function removeLastImage(itemIndex: number) {
    const nextImages = items[itemIndex].images.slice(0, -1);
    updateItem(itemIndex, { images: nextImages });
  }

  return (
    <div className="flex flex-col gap-4 border-t border-gray-200 pt-4">
      <h3 className="text-base font-semibold">Solution</h3>
      {items.map((item, index) => (
        <div key={index} className={cardClass}>
          <input
            className={inputClass}
            placeholder="Heading"
            value={item.heading}
            onChange={(event) => updateItem(index, { heading: event.target.value })}
          />
          {item.images.map((image, imageIndex) => (
            <ImageUploadField
              key={imageIndex}
              slug={slug}
              value={image}
              maxWidth={1200}
              label={`Image ${imageIndex + 1}`}
              onChange={(path) => updateImage(index, imageIndex, path)}
            />
          ))}
          <div className="flex gap-2">
            <button type="button" className={buttonClass} onClick={() => addImage(index)}>
              + Add image
            </button>
            {item.images.length > 0 && (
              <button
                type="button"
                className={buttonClass}
                onClick={() => removeLastImage(index)}
              >
                Remove last image
              </button>
            )}
          </div>
          <textarea
            className={inputClass}
            placeholder="Body text"
            value={item.body}
            onChange={(event) => updateItem(index, { body: event.target.value })}
            rows={4}
          />
          <div className="flex gap-2">
            <button
              type="button"
              className={buttonClass}
              onClick={() => moveItem(index, -1)}
              disabled={index === 0}
            >
              ↑
            </button>
            <button
              type="button"
              className={buttonClass}
              onClick={() => moveItem(index, 1)}
              disabled={index === items.length - 1}
            >
              ↓
            </button>
            <button type="button" className={buttonClass} onClick={() => removeItem(index)}>
              Remove item
            </button>
          </div>
        </div>
      ))}
      <button type="button" className={buttonClass} onClick={addItem}>
        + Add solution item
      </button>
    </div>
  );
}
```

- [ ] **Step 3: Verify it builds**

Run: `npm run build`
Expected: Build succeeds, no type errors. Neither file is imported anywhere yet.

- [ ] **Step 4: Commit**

```bash
git add components/admin/ProcessEditor.tsx components/admin/SolutionEditor.tsx
git commit -m "feat: add Process and Solution editor components"
```

---

### Task 11: The full case study editor page

**Files:**
- Create: `app/admin/[slug]/page.tsx`
- Create: `components/admin/CaseStudyEditor.tsx`

- [ ] **Step 1: Write `components/admin/CaseStudyEditor.tsx`**

```tsx
"use client";

import Link from "next/link";
import { useState } from "react";
import type { RawCaseStudyContent } from "@/lib/case-study-admin";
import type { CaseStudyCategory } from "@/lib/case-studies";
import ImageUploadField from "@/components/admin/ImageUploadField";
import MetricsEditor from "@/components/admin/MetricsEditor";
import ProcessEditor from "@/components/admin/ProcessEditor";
import SolutionEditor from "@/components/admin/SolutionEditor";

const CATEGORIES: CaseStudyCategory[] = ["FinTech", "AI-native", "GovTech"];
const inputClass = "rounded border border-gray-300 px-2 py-1";
const labelClass = "flex flex-col gap-1";

export default function CaseStudyEditor({ initial }: { initial: RawCaseStudyContent }) {
  const [data, setData] = useState<RawCaseStudyContent>(initial);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  function update<K extends keyof RawCaseStudyContent>(key: K, value: RawCaseStudyContent[K]) {
    setData((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave() {
    setStatus("saving");
    const response = await fetch(`/api/admin/case-studies/${data.slug}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setStatus(response.ok ? "saved" : "error");
  }

  return (
    <div className="flex flex-col gap-6 text-sm">
      <div className="flex justify-between">
        <Link href="/admin" className="underline">
          &larr; Back to list
        </Link>
        <Link href={`/case-studies/${data.slug}`} target="_blank" className="underline">
          View live &rarr;
        </Link>
      </div>

      <h1 className="text-xl font-semibold">Edit: {data.title || data.slug}</h1>

      <label className={labelClass}>
        Title
        <input
          className={inputClass}
          value={data.title}
          onChange={(event) => update("title", event.target.value)}
        />
      </label>
      <label className={labelClass}>
        Summary
        <textarea
          className={inputClass}
          value={data.summary}
          onChange={(event) => update("summary", event.target.value)}
        />
      </label>
      <label className={labelClass}>
        Category
        <select
          className={inputClass}
          value={data.category}
          onChange={(event) => update("category", event.target.value as CaseStudyCategory)}
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </label>
      <label className={labelClass}>
        Role
        <input
          className={inputClass}
          value={data.role ?? ""}
          onChange={(event) => update("role", event.target.value)}
        />
      </label>
      <label className={labelClass}>
        Team
        <input
          className={inputClass}
          value={data.team ?? ""}
          onChange={(event) => update("team", event.target.value)}
        />
      </label>
      <label className={labelClass}>
        Client
        <input
          className={inputClass}
          value={data.client ?? ""}
          onChange={(event) => update("client", event.target.value)}
        />
      </label>
      <label className={labelClass}>
        Duration
        <input
          className={inputClass}
          value={data.duration ?? ""}
          onChange={(event) => update("duration", event.target.value)}
        />
      </label>
      <label className={labelClass}>
        Location
        <input
          className={inputClass}
          value={data.location ?? ""}
          onChange={(event) => update("location", event.target.value)}
        />
      </label>
      <label className={labelClass}>
        Live URL
        <input
          className={inputClass}
          value={data.liveUrl ?? ""}
          onChange={(event) => update("liveUrl", event.target.value)}
        />
      </label>

      <ImageUploadField
        slug={data.slug}
        value={data.heroImage}
        maxWidth={1600}
        label="Hero image"
        onChange={(path) => update("heroImage", path)}
      />

      <MetricsEditor
        metrics={data.metrics ?? []}
        onChange={(metrics) => update("metrics", metrics)}
      />

      <label className={`${labelClass} border-t border-gray-200 pt-4`}>
        <span className="text-base font-semibold">Problem</span>
        <textarea
          className={inputClass}
          value={data.problem ?? ""}
          onChange={(event) => update("problem", event.target.value)}
          rows={6}
        />
      </label>

      <ProcessEditor
        slug={data.slug}
        insights={data.process ?? []}
        onChange={(process) => update("process", process)}
      />

      <label className={`${labelClass} border-t border-gray-200 pt-4`}>
        <span className="text-base font-semibold">Obstacles</span>
        <textarea
          className={inputClass}
          value={data.obstacles ?? ""}
          onChange={(event) => update("obstacles", event.target.value)}
          rows={6}
        />
      </label>

      <SolutionEditor
        slug={data.slug}
        items={data.solution ?? []}
        onChange={(solution) => update("solution", solution)}
      />

      <label className={`${labelClass} border-t border-gray-200 pt-4`}>
        <span className="text-base font-semibold">Outcome</span>
        <textarea
          className={inputClass}
          value={data.outcome ?? ""}
          onChange={(event) => update("outcome", event.target.value)}
          rows={6}
        />
      </label>

      <label className={labelClass}>
        <span className="text-base font-semibold">Close</span>
        <textarea
          className={inputClass}
          value={data.close ?? ""}
          onChange={(event) => update("close", event.target.value)}
          rows={6}
        />
      </label>

      <div className="flex items-center gap-3 border-t border-gray-200 pt-4">
        <button
          type="button"
          onClick={handleSave}
          disabled={status === "saving"}
          className="rounded border border-gray-300 px-4 py-2 hover:bg-gray-100 disabled:opacity-50"
        >
          {status === "saving" ? "Saving…" : "Save"}
        </button>
        {status === "saved" && <span className="text-green-600">Saved.</span>}
        {status === "error" && <span className="text-red-600">Failed to save.</span>}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Write `app/admin/[slug]/page.tsx`**

```tsx
import { notFound } from "next/navigation";
import { isDevOnly } from "@/lib/admin-guard";
import { getRawCaseStudyContent } from "@/lib/case-study-admin";
import CaseStudyEditor from "@/components/admin/CaseStudyEditor";

export default async function EditCaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  if (!isDevOnly()) notFound();
  const { slug } = await params;
  const caseStudy = getRawCaseStudyContent(slug);
  if (!caseStudy) notFound();

  return (
    <main className="mx-auto max-w-3xl p-6 font-sans">
      <CaseStudyEditor initial={caseStudy} />
    </main>
  );
}
```

- [ ] **Step 3: Verify it builds**

Run: `npm run build`
Expected: Build succeeds fully — the original 12 public pages, plus `/admin`, `/admin/new`, `/admin/[slug]`, and the 3 admin API routes, no type errors.

- [ ] **Step 4: Commit**

```bash
git add "app/admin/[slug]/page.tsx" components/admin/CaseStudyEditor.tsx
git commit -m "feat: add full case study editor page, wiring all admin components together"
```

---

### Task 12: End-to-end verification

**Files:** None (verification only)

- [ ] **Step 1: Confirm the admin area is invisible in a production build**

Run: `npm run build && npm run start &`, wait for it to be ready, then:
```bash
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/admin
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/admin/new
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/admin/ryno-finance
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/api/admin/case-studies
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/api/admin/case-studies/ryno-finance
curl -s -o /dev/null -w "%{http_code}\n" -X PUT http://localhost:3000/api/admin/case-studies/ryno-finance -H "Content-Type: application/json" -d '{}'
curl -s -o /dev/null -w "%{http_code}\n" -X DELETE http://localhost:3000/api/admin/case-studies/ryno-finance
curl -s -o /dev/null -w "%{http_code}\n" -X POST http://localhost:3000/api/admin/case-studies/ryno-finance/images
```
Expected: `404` for every one of these 8 requests — including confirming that the last three (a PUT, a DELETE, and an image upload POST) are rejected before they'd ever touch the filesystem, since those are the requests that could actually modify or delete real content if the gate had a gap. Kill the server.

- [ ] **Step 2: Full create → edit → verify → delete flow against the dev server**

Run: `npm run dev &`, wait for it to be ready.

Open `http://localhost:3000/admin` in a browser and confirm the 3 existing case studies are listed.

Click "+ Add new case study," fill in slug `cms-verification-test`, title `CMS Verification Test`, category `FinTech`, summary `Testing the local CMS end to end`, submit. Confirm you land on `/admin/cms-verification-test` and that `content/case-studies/cms-verification-test.md` now exists with exactly those 4 frontmatter fields and no body sections.

In the editor, fill in: Role, Team, Client, Duration, a hero image upload, one metric, a Problem paragraph, two Process insights (one with an image, one without), an Obstacles paragraph, two Solution items (one with two images side by side, one with none), an Outcome paragraph, and a Close paragraph. Click Save and confirm the "Saved." message appears.

Open `http://localhost:3000/case-studies/cms-verification-test` (the "View live" link) in a new tab and confirm every field renders correctly on the public page: hero image, context strip rows, Problem, Process (including the image on the right insight), Obstacles, both Solution items (image grid correct for each), Outcome metrics + prose, Close.

Go back to `/admin/cms-verification-test`, change the title, save again, and confirm `git diff content/case-studies/cms-verification-test.md` shows only the title line changed — nothing else in the file reformatted or reordered.

Go back to `http://localhost:3000/admin`, click Delete on `cms-verification-test`, confirm the dialog, and confirm it disappears from the list and `content/case-studies/cms-verification-test.md` no longer exists on disk. Confirm `public/images/case-studies/cms-verification-test/` still exists with the uploaded images (images are intentionally not auto-deleted per the design).

Clean up the leftover image directory since this was just a verification run:
```bash
rm -rf public/images/case-studies/cms-verification-test
```

Kill the dev server when done.

- [ ] **Step 3: Confirm the existing 3 case studies still work unmodified**

With the dev server running again (`npm run dev &`), open `/admin/ryno-finance`, confirm every field loads with the real content (title, team, all 6 sections, all images), make no changes, and just navigate away — confirm `git status` shows no changes to `content/case-studies/ryno-finance.md` (loading into the editor must not itself alter the file). Kill the dev server.

- [ ] **Step 4: Final build and lint check**

Run: `npm run build`
Expected: Succeeds, 12 public pages + admin routes, zero type errors.

Run: `npm run lint`
Expected: Clean except the same pre-existing, unrelated `MobileNav.tsx` error already present on `master` before this feature.
