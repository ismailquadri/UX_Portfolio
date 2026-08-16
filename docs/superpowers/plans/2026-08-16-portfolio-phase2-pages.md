# Portfolio Phase 2 Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add About, Case Study List/Detail, Contact, and 404 pages to the existing Next.js portfolio site (homepage already built and merged to `master`), reusing established components and conventions.

**Architecture:** Five new routes under `app/`, backed by two new shared components (`PageSidebar`, `ContactForm`) and one new data file (`lib/case-studies.ts`). A new `/api/contact` route sends form submissions via Resend, following the same "server-side key, graceful fallback" pattern as the existing `/api/chat` route.

**Tech Stack:** Next.js App Router, TypeScript, Tailwind CSS v4, Framer Motion, `resend` (new dependency).

**Figma reference:** fileKey = `0IyCORj0osd1Dzx8Q7S7Eh` for every `get_design_context` / `get_screenshot` call below.

**Prerequisite:** Run from the repo root `~/Projects/my-portfolio` (homepage work is already merged into `master`; no worktree setup needed beyond what this plan's tasks create).

---

### Task 1: Case study data model

**Files:**
- Create: `lib/case-studies.ts`

- [ ] **Step 1: Fetch the real case study list content**

Call `mcp__figma__get_design_context` with `nodeId="12215:1245"` (the "Case Study List" frame on the Case Study List Page, node `7238:321`). Load Figma MCP tools via ToolSearch "select:mcp__figma__get_design_context,mcp__figma__get_screenshot" if needed.

- [ ] **Step 2: Create the data file**

```ts
export type CaseStudy = {
  slug: string;
  title: string;
  category: "FinTech" | "AI-native" | "GovTech";
  summary: string;
  readLink: string;
};

export const CASE_STUDIES: CaseStudy[] = [
  {
    slug: "ryno-finance",
    title: "Ryno Finance - Compliance State Machine",
    category: "FinTech",
    summary: "Designing the queue where one click blocks or clears real money",
    readLink: "Read case study",
  },
  {
    slug: "linqart",
    title: "Linqart - AI Dependency Graph",
    category: "AI-native",
    summary: "Mapping a multi-merchant matching system nobody had visualized before",
    readLink: "Read case study",
  },
  {
    slug: "federal-pms",
    title: "Federal PMS - Org-Scale Role System",
    category: "GovTech",
    summary: "A national civil-service platform managing 800+ federal agencies",
    readLink: "Read case study",
  },
];

export function getCaseStudyBySlug(slug: string): CaseStudy | undefined {
  return CASE_STUDIES.find((cs) => cs.slug === slug);
}
```

Verify the `title`/`summary`/`category` values against the real `get_design_context` output from Step 1 — the values above were captured during design/planning and should match, but the live Figma response is the source of truth. Correct any discrepancy before committing.

- [ ] **Step 3: Verify**

```bash
npx tsc --noEmit
```

Expected: no errors (this is a pure data file, should type-check trivially).

- [ ] **Step 4: Commit**

```bash
git add lib/case-studies.ts
git commit -m "feat: add case study data model"
```

---

### Task 2: PageSidebar shared component

**Files:**
- Create: `components/PageSidebar.tsx`

- [ ] **Step 1: Fetch design context**

Call `mcp__figma__get_design_context` with `nodeId="7215:363"` (the About page's sidebar, which shares the visual pattern used on Contact too).

- [ ] **Step 2: Implement**

Create `components/PageSidebar.tsx` — a server component (no scroll-spy needed; these are static per-page links, unlike the homepage's `HeroSidebar`):

```tsx
import Image from "next/image";

type PageSidebarLink = {
  label: string;
  href: string;
};

export default function PageSidebar({ links }: { links: PageSidebarLink[] }) {
  return (
    <div className="hidden md:flex h-full w-[269px] shrink-0 flex-col items-start justify-center overflow-clip border-r border-border-subtle bg-surface">
      <div className="flex w-full flex-col items-start justify-center gap-8 py-10 pl-10 pr-4">
        <span className="relative block size-[30px] shrink-0">
          <Image src="/images/hero-logo.svg" alt="" fill sizes="30px" />
        </span>
        <nav className="flex w-full flex-col items-start">
          {links.map((link, index) => (
            <a
              key={link.href}
              href={link.href}
              className={`relative flex w-full items-start gap-2.5 whitespace-nowrap p-2.5 font-body text-[16px] tracking-[-0.16px] text-ink ${
                index === 0 ? "font-medium" : "font-medium opacity-30"
              }`}
            >
              {link.label}
              {index === 0 && (
                <span className="absolute inset-x-0 bottom-0 h-px w-[213px] bg-border-subtle" />
              )}
            </a>
          ))}
        </nav>
      </div>
    </div>
  );
}
```

This takes `links` as a prop (unlike `HeroSidebar`, which hardcodes homepage anchors) since About and Contact each need their own link set. Reuses the existing `/images/hero-logo.svg` asset from Phase 1 — don't re-download it.

- [ ] **Step 3: Verify**

```bash
npx tsc --noEmit
```

- [ ] **Step 4: Commit**

```bash
git add components/PageSidebar.tsx
git commit -m "feat: add reusable PageSidebar component"
```

---

### Task 3: ContactForm component (static UI, no submit yet)

**Files:**
- Create: `components/ContactForm.tsx`

- [ ] **Step 1: Fetch design context**

Call `mcp__figma__get_design_context` with `nodeId="7211:289"` (the Contact page's form — same layout used on the About page's "Send me a Message" section, node `7247:1815`, which is visually identical per Figma).

- [ ] **Step 2: Implement the static form**

Create `components/ContactForm.tsx` as a client component (`"use client"` — it will need state in Task-level follow-up, but build the controlled-input skeleton now since it's one component, not two passes like the homepage chat widget):

```tsx
"use client";

import { useState, type FormEvent } from "react";

const INTEREST_OPTIONS = [
  "UX Audit",
  "User Segmentation & Insights",
  "UI/UX Design & Prototyping",
  "MVP Product Development",
] as const;

type SubmitState = "idle" | "sending" | "success" | "error";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [interest, setInterest] = useState("");
  const [message, setMessage] = useState("");
  const [state, setState] = useState<SubmitState>("idle");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // network call added in Task 5 (Task 4 builds the /api/contact route)
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-[576px] flex-col gap-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <label className="flex flex-col gap-2">
          <span className="font-body text-[14px] font-medium text-ink">Name</span>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Doe"
            className="rounded-sm border border-border-subtle bg-paper px-4 py-3 font-body text-[16px] text-ink outline-none placeholder:text-ink/40"
          />
        </label>
        <label className="flex flex-col gap-2">
          <span className="font-body text-[14px] font-medium text-ink">E-mail</span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="hello@site.com"
            className="rounded-sm border border-border-subtle bg-paper px-4 py-3 font-body text-[16px] text-ink outline-none placeholder:text-ink/40"
          />
        </label>
      </div>
      <label className="flex flex-col gap-2">
        <span className="font-body text-[14px] font-medium text-ink">I&rsquo;m interested in</span>
        <select
          required
          value={interest}
          onChange={(e) => setInterest(e.target.value)}
          className="rounded-sm border border-border-subtle bg-paper px-4 py-3 font-body text-[16px] text-ink outline-none"
        >
          <option value="" disabled>
            Select
          </option>
          {INTEREST_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>
      <label className="flex flex-col gap-2">
        <span className="font-body text-[14px] font-medium text-ink">Message</span>
        <textarea
          required
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Tell me about your ideas"
          className="resize-none rounded-sm border border-border-subtle bg-paper px-4 py-3 font-body text-[16px] text-ink outline-none placeholder:text-ink/40"
        />
      </label>
      <button
        type="submit"
        disabled={state === "sending"}
        className="flex h-[41px] w-full items-center justify-center rounded-sm bg-ink font-body text-[14px] font-medium text-paper disabled:opacity-60"
      >
        {state === "sending" ? "Sending..." : "Submit"}
      </button>
      {state === "success" && (
        <p className="font-body text-[14px] text-ink">
          Thanks — your message is on its way. I&rsquo;ll get back to you within 24 hours.
        </p>
      )}
      {state === "error" && (
        <p className="font-body text-[14px] text-ink">
          Something went wrong sending your message — try again in a moment, or email
          hello@mike.com directly.
        </p>
      )}
    </form>
  );
}
```

Verify field labels/placeholders/select options against the real `get_design_context` output from Step 1 and correct any text mismatch before committing (the "I'm interested in" options should match Figma's actual dropdown values — if Figma shows generic placeholder options, use the 4 real service names from the homepage `Capabilities` section instead, as shown above).

- [ ] **Step 3: Verify**

```bash
npx tsc --noEmit
```

- [ ] **Step 4: Commit**

```bash
git add components/ContactForm.tsx
git commit -m "feat: add static ContactForm component"
```

---

### Task 4: /api/contact route (Resend)

**Files:**
- Create: `app/api/contact/route.ts`
- Modify: `.env.local.example`

- [ ] **Step 1: Install Resend**

```bash
npm install resend
```

- [ ] **Step 2: Implement the route handler**

Create `app/api/contact/route.ts`:

```ts
import { Resend } from "resend";

export const runtime = "nodejs";

type ContactPayload = {
  name: string;
  email: string;
  interest: string;
  message: string;
};

function isContactPayload(value: unknown): value is ContactPayload {
  if (typeof value !== "object" || value === null) return false;
  const { name, email, interest, message } = value as Record<string, unknown>;
  return (
    typeof name === "string" &&
    name.trim().length > 0 &&
    typeof email === "string" &&
    email.includes("@") &&
    typeof interest === "string" &&
    interest.trim().length > 0 &&
    typeof message === "string" &&
    message.trim().length > 0
  );
}

function jsonError(error: string, status: number): Response {
  return new Response(JSON.stringify({ error }), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST(request: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return jsonError("missing_api_key", 500);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError("invalid_json", 400);
  }

  if (!isContactPayload(body)) {
    return jsonError("invalid_payload", 400);
  }

  const resend = new Resend(apiKey);

  try {
    await resend.emails.send({
      from: "Portfolio Contact Form <onboarding@resend.dev>",
      to: "hello@mike.com",
      replyTo: body.email,
      subject: `New message from ${body.name} (${body.interest})`,
      text: `Name: ${body.name}\nEmail: ${body.email}\nInterested in: ${body.interest}\n\n${body.message}`,
    });
  } catch {
    return jsonError("send_failed", 502);
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
```

(The `from` address uses Resend's shared sandbox sender `onboarding@resend.dev`, which works without domain verification — appropriate for a personal portfolio without a configured sending domain. Note this as a follow-up if the user later verifies their own domain with Resend.)

- [ ] **Step 3: Add the env var to the example file**

Modify `.env.local.example` to append:

```bash
cat >> .env.local.example <<'EOF'

# Get a key at https://resend.com/api-keys
RESEND_API_KEY=
EOF
```

- [ ] **Step 4: Verify (no real key needed — expected to fail gracefully)**

```bash
npm run dev &
sleep 3
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","interest":"UX Audit","message":"Hello"}'
kill %1
```

Expected: `{"error":"missing_api_key"}` with a 500 status (no key set — correct behavior; the user adds a real key later, same as `ANTHROPIC_API_KEY`).

- [ ] **Step 5: Commit**

```bash
git add app/api/contact/route.ts .env.local.example package.json package-lock.json
git commit -m "feat: add /api/contact route backed by Resend"
```

---

### Task 5: Wire ContactForm submit to /api/contact

**Files:**
- Modify: `components/ContactForm.tsx`

- [ ] **Step 1: Extend handleSubmit**

Replace the `handleSubmit` stub from Task 3 with:

```tsx
async function handleSubmit(event: FormEvent<HTMLFormElement>) {
  event.preventDefault();
  setState("sending");

  try {
    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, interest, message }),
    });

    if (!response.ok) {
      throw new Error("contact_request_failed");
    }

    setState("success");
    setName("");
    setEmail("");
    setInterest("");
    setMessage("");
  } catch {
    setState("error");
  }
}
```

- [ ] **Step 2: Verify the error path**

```bash
npm run dev &
sleep 3
```

Since no `RESEND_API_KEY` is set, submitting the form should hit the `missing_api_key` 500 response. Use a scratch Playwright install to render a page containing `<ContactForm />` (or test it once wired into `/contact` in a later task — if this task runs before Task 9, create a temporary throwaway route to mount it, verify, then delete the throwaway route before committing), fill the 4 fields, submit, and confirm the error message ("Something went wrong sending your message...") appears instead of a silent failure or crash.

```bash
kill %1
```

- [ ] **Step 3:** `npx tsc --noEmit` clean.

- [ ] **Step 4: Commit**

```bash
git add components/ContactForm.tsx
git commit -m "feat: wire ContactForm to /api/contact with error handling"
```

---

### Task 6: About page

**Files:**
- Create: `app/about/page.tsx`
- Create: `components/sections/AboutIntro.tsx`
- Create: `components/sections/AboutApproach.tsx`
- Create: `components/sections/AboutSkills.tsx`
- Create: `components/sections/AboutClients.tsx`

- [ ] **Step 1: Fetch design context**

Call `mcp__figma__get_design_context` with `nodeId="7215:333"` (the full About Us Page). If the response is too large, fetch section-by-section using the child node IDs from the spec: intro/photo (`7215:362`), approach (`7264:807`), skills (`7215:698`), clients (`7215:825`).

- [ ] **Step 2: Implement each section component**

- `components/sections/AboutIntro.tsx`: header "About Me" + full-bleed photo + intro paragraph, verbatim from Figma.
- `components/sections/AboutApproach.tsx`: "My approach is simple — understand first, design second." heading + 4 numbered steps (data-driven `.map()`, following the `Process.tsx` pattern from Phase 1).
- `components/sections/AboutSkills.tsx`: "Skills & Domains" — 3 grouped bullet lists (Product Design / Tools & Workflows / Domains) + "Download CV" link (verify the real link target in Figma; if it points to an external file not available in this build, use `href="#"` with a `{/* TODO: link to real CV file */}` comment, matching the Phase 1 convention for unresolved link targets).
- `components/sections/AboutClients.tsx`: "Who I Work With" — 2×4 grid of client/tool logos + names, data-driven `.map()`. Download logo assets into `public/images/clients/`.

Reuse `<SidebarSpacer />` for the left rail on sections that have one, `<PageSidebar links={[...]} />` (from Task 2) once per page for the persistent nav, and `<ContactForm />` (from Task 5) for the "Send me a Message" section instead of building a new form.

- [ ] **Step 3: Assemble the page**

Create `app/about/page.tsx`:

```tsx
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageSidebar from "@/components/PageSidebar";
import ContactForm from "@/components/ContactForm";
import AboutIntro from "@/components/sections/AboutIntro";
import AboutApproach from "@/components/sections/AboutApproach";
import AboutSkills from "@/components/sections/AboutSkills";
import AboutClients from "@/components/sections/AboutClients";
import { RevealOnScroll } from "@/components/RevealOnScroll";

const ABOUT_LINKS = [
  { label: "About Me", href: "#intro" },
  { label: "Capability", href: "#approach" },
  { label: "Skills & Domains", href: "#skills" },
  { label: "Who I Work With", href: "#clients" },
  { label: "Send me Messages", href: "#contact" },
];

export default function AboutPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-paper">
      <Navbar />
      <main className="flex w-full flex-1">
        <PageSidebar links={ABOUT_LINKS} />
        <div className="flex w-full flex-1 flex-col">
          <div id="intro">
            <AboutIntro />
          </div>
          <RevealOnScroll>
            <div id="approach">
              <AboutApproach />
            </div>
          </RevealOnScroll>
          <RevealOnScroll>
            <div id="skills">
              <AboutSkills />
            </div>
          </RevealOnScroll>
          <RevealOnScroll>
            <div id="clients">
              <AboutClients />
            </div>
          </RevealOnScroll>
          <RevealOnScroll>
            <div id="contact" className="flex flex-col gap-6 px-6 py-16 md:px-20">
              <h2 className="font-heading text-[32px] text-ink md:text-[56px]">
                Send me a Message
              </h2>
              <ContactForm />
            </div>
          </RevealOnScroll>
        </div>
      </main>
      <Footer />
    </div>
  );
}
```

Adjust the `ABOUT_LINKS` labels/anchors and section wrapper ids to match whatever section structure you actually build in Step 2 — the important thing is every link has a real corresponding `id` target on the page (same discipline as the Phase 1 homepage sidebar).

- [ ] **Step 4: Verify**

```bash
npm run dev &
sleep 3
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/about
kill %1
```

Expected: `200`. Visually compare against `mcp__figma__get_screenshot` for node `7215:333` using a scratch Playwright install.

- [ ] **Step 5: Commit**

```bash
git add app/about/page.tsx components/sections/AboutIntro.tsx components/sections/AboutApproach.tsx components/sections/AboutSkills.tsx components/sections/AboutClients.tsx public/images
git commit -m "feat: add About page"
```

---

### Task 7: Case Study List page

**Files:**
- Create: `app/case-studies/page.tsx`
- Create: `components/CaseStudyCard.tsx`

- [ ] **Step 1: Fetch design context**

Call `mcp__figma__get_design_context` with `nodeId="7238:321"`.

- [ ] **Step 2: Implement the card component**

Create `components/CaseStudyCard.tsx`:

```tsx
import Link from "next/link";
import type { CaseStudy } from "@/lib/case-studies";

export default function CaseStudyCard({ caseStudy }: { caseStudy: CaseStudy }) {
  return (
    <article className="flex w-full flex-col gap-6 border-b border-border-subtle py-10 md:flex-row md:gap-8">
      <div className="flex h-[240px] w-full items-center justify-center rounded-md border border-border-subtle bg-surface text-muted md:h-[360px] md:w-[560px]">
        Thumbnail
      </div>
      <div className="flex flex-1 flex-col justify-center gap-4">
        <span className="w-fit rounded-full bg-ink px-3 py-1 font-body text-[12px] font-medium text-paper">
          {caseStudy.category}
        </span>
        <h3 className="font-heading text-[24px] text-ink">{caseStudy.title}</h3>
        <p className="font-body text-[16px] text-muted">{caseStudy.summary}</p>
        <Link
          href={`/case-studies/${caseStudy.slug}`}
          className="font-body text-[14px] font-medium text-ink underline underline-offset-4"
        >
          {caseStudy.readLink} &rarr;
        </Link>
      </div>
    </article>
  );
}
```

Verify thumbnail sizing, tag styling, and typography against the real Figma design context and adjust classNames accordingly — the above is a starting structure, not a pixel-final spec (unlike Phase 1 tasks, this task doesn't have pre-verified exact values since it's new; treat it the same rigor as any Phase 1 section: pull real values from `get_design_context`, don't eyeball).

- [ ] **Step 3: Implement the page with client-side filtering**

Create `app/case-studies/page.tsx`:

```tsx
"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageSidebar from "@/components/PageSidebar";
import CaseStudyCard from "@/components/CaseStudyCard";
import { CASE_STUDIES, type CaseStudy } from "@/lib/case-studies";

const FILTERS = ["All", "FinTech", "AI-native", "GovTech"] as const;
type Filter = (typeof FILTERS)[number];

const SIDEBAR_LINKS = [
  { label: "Case Studies", href: "#list" },
  { label: "FinTech", href: "#list" },
  { label: "AI-native", href: "#list" },
  { label: "GovTech", href: "#list" },
];

export default function CaseStudiesPage() {
  const [filter, setFilter] = useState<Filter>("All");

  const visible: CaseStudy[] =
    filter === "All" ? CASE_STUDIES : CASE_STUDIES.filter((cs) => cs.category === filter);

  return (
    <div className="flex min-h-screen w-full flex-col bg-paper">
      <Navbar />
      <main className="flex w-full flex-1">
        <PageSidebar links={SIDEBAR_LINKS} />
        <div id="list" className="flex w-full flex-1 flex-col gap-8 px-6 py-16 md:px-20">
          <div className="flex items-center justify-between">
            <h1 className="font-heading text-[32px] text-ink md:text-[56px]">Case Studies</h1>
            <span className="font-body text-[14px] tracking-[2px] text-muted">[ WORK ]</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {FILTERS.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={`rounded-full px-4 py-2 font-body text-[14px] font-medium ${
                  filter === f ? "bg-ink text-paper" : "border border-border-subtle text-ink"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          <div className="flex flex-col">
            {visible.map((cs) => (
              <CaseStudyCard key={cs.slug} caseStudy={cs} />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
```

Adjust header/label copy and spacing to match the real Figma design context from Step 1.

- [ ] **Step 4: Verify**

```bash
npm run dev &
sleep 3
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/case-studies
kill %1
```

Expected `200`. Visually verify: initial load shows all 3 cards; clicking each filter tag shows only matching cards (FinTech → 1 card, AI-native → 1 card, GovTech → 1 card, All → 3 cards) using a scratch Playwright install. Compare styling against `mcp__figma__get_screenshot` for node `7238:321`.

- [ ] **Step 5: Commit**

```bash
git add app/case-studies/page.tsx components/CaseStudyCard.tsx
git commit -m "feat: add Case Study List page with client-side filtering"
```

---

### Task 8: Case Study Detail page

**Files:**
- Create: `app/case-studies/[slug]/page.tsx`
- Create: `app/case-studies/[slug]/not-found.tsx`

- [ ] **Step 1: Fetch design context**

Call `mcp__figma__get_design_context` with `nodeId="7238:673"` (the "Nutor AI" example detail page — this is a layout/styling template only; its specific project content does not correspond to any of the 3 real case studies).

- [ ] **Step 2: Implement the dynamic page**

Create `app/case-studies/[slug]/page.tsx`:

```tsx
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CASE_STUDIES, getCaseStudyBySlug } from "@/lib/case-studies";

export function generateStaticParams() {
  return CASE_STUDIES.map((cs) => ({ slug: cs.slug }));
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

  const otherCaseStudies = CASE_STUDIES.filter((cs) => cs.slug !== slug);

  return (
    <div className="flex min-h-screen w-full flex-col bg-paper">
      <Navbar />
      <main className="flex w-full flex-1 flex-col gap-16 px-6 py-16 md:px-20">
        <section className="flex flex-col gap-6">
          <span className="w-fit rounded-full bg-ink px-3 py-1 font-body text-[12px] font-medium text-paper">
            {caseStudy.category}
          </span>
          <h1 className="font-heading text-[32px] text-ink md:text-[56px]">
            {caseStudy.title}
          </h1>
          <p className="max-w-[600px] font-body text-[16px] text-muted">{caseStudy.summary}</p>
        </section>

        {(
          [
            ["Problem", "problem"],
            ["Solution", "solution"],
            ["Concepting", "concepting"],
            ["Design", "design"],
            ["Result", "result"],
          ] as const
        ).map(([heading, key]) => (
          <section key={key} className="flex flex-col gap-4 border-t border-border-subtle pt-8">
            <h2 className="font-heading text-[24px] text-ink">{heading}</h2>
            <p className="font-body text-[16px] text-muted">
              {/* TODO: replace with real case study writeup for {caseStudy.slug} — Figma
              only designed narrative content for an unrelated example project */}
              Case study details coming soon.
            </p>
          </section>
        ))}

        <section className="flex flex-col gap-6 border-t border-border-subtle pt-8">
          <h2 className="font-heading text-[24px] text-ink">More Works</h2>
          <div className="flex flex-col gap-4 sm:flex-row">
            {otherCaseStudies.map((cs) => (
              <a
                key={cs.slug}
                href={`/case-studies/${cs.slug}`}
                className="flex h-[160px] flex-1 items-center justify-center rounded-md border border-border-subtle bg-surface text-muted"
              >
                {cs.title}
              </a>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
```

Refine the header/section styling against the real Figma design context from Step 1 (spacing, typography, the "About Project" metadata row with category/client/duration/location, the device/photo imagery per section) — the structure above is the required content model; pixel-match the presentation to Figma the same way every Phase 1 section did.

- [ ] **Step 3: Add a slug-scoped not-found fallback**

Create `app/case-studies/[slug]/not-found.tsx`:

```tsx
import Link from "next/link";

export default function CaseStudyNotFound() {
  return (
    <div className="flex min-h-[60vh] w-full flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="font-heading text-[32px] text-ink">Case study not found</h1>
      <p className="font-body text-[16px] text-muted">
        That case study doesn&rsquo;t exist yet.
      </p>
      <Link href="/case-studies" className="font-body text-[14px] font-medium text-ink underline">
        Back to all case studies
      </Link>
    </div>
  );
}
```

- [ ] **Step 4: Verify**

```bash
npm run build
```

Expected: build succeeds and the build output lists 3 static pages under `/case-studies/[slug]` (one per `generateStaticParams` entry — check the route summary Next.js prints). Then:

```bash
npm run dev &
sleep 3
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/case-studies/ryno-finance
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/case-studies/does-not-exist
kill %1
```

Expected: `200` for the real slug, `404` for the fake one. Visually verify against `mcp__figma__get_screenshot` for node `7238:673` (layout/styling, not the placeholder narrative text).

- [ ] **Step 5: Commit**

```bash
git add app/case-studies/[slug]/page.tsx app/case-studies/[slug]/not-found.tsx
git commit -m "feat: add Case Study Detail page with generateStaticParams"
```

---

### Task 9: Contact page

**Files:**
- Create: `app/contact/page.tsx`

- [ ] **Step 1: Fetch design context**

Call `mcp__figma__get_design_context` with `nodeId="7211:249"`.

- [ ] **Step 2: Implement**

Create `app/contact/page.tsx`, composing: `Navbar`, a header ("Let's start a conversation" + "[ CONTACT ]" label, verbatim from Figma), `PageSidebar` with the 7-link set (Send me Messages/Capability/Process/The Result/What They Said/Pricing/FAQ — same set as the homepage hero sidebar, since Figma reuses that exact sidebar component here, but as plain non-scroll-spy links pointing at `/#capabilities` etc. back to the homepage, since this page itself doesn't have those sections), `<ContactForm />`, a contact-detail row (Email: hello@mike.com / Response time: 24 hours, verbatim from Figma node `7266:2423`), an FAQ section reusing `AccordionItem` with the same 6 questions / 1 real answer as the homepage FAQ (import from a shared source — see note below), and `Footer`.

**FAQ content reuse**: rather than re-deriving the FAQ content, extract it from the existing `components/sections/Faq.tsx` (built in Phase 1) into a shared `lib/faq-data.ts` if it isn't already separated, and import that data here. If `Faq.tsx`'s data array is currently inline in the component, add `lib/faq-data.ts` exporting the array and update `Faq.tsx` to import from it (small refactor, keep `Faq.tsx`'s own behavior unchanged) — this avoids a second hand-typed copy of the same content drifting from the original.

- [ ] **Step 3: Verify**

```bash
npm run dev &
sleep 3
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/contact
kill %1
```

Expected `200`. Visually verify against `mcp__figma__get_screenshot` for node `7211:249`. Confirm the FAQ accordion on this page shows the same question/answer as the homepage's (both reading from `lib/faq-data.ts`).

- [ ] **Step 4: Commit**

```bash
git add app/contact/page.tsx lib/faq-data.ts components/sections/Faq.tsx
git commit -m "feat: add Contact page"
```

---

### Task 10: 404 page

**Files:**
- Create: `app/not-found.tsx`

- [ ] **Step 1: Fetch design context**

Call `mcp__figma__get_design_context` with `nodeId="7137:254"`.

- [ ] **Step 2: Implement**

Create `app/not-found.tsx` (Next.js's special file, automatically rendered for any unmatched route across the whole app — do not add a route segment for it):

```tsx
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function NotFound() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-paper">
      <Navbar />
      <main className="relative flex w-full flex-1 items-center justify-center overflow-hidden">
        <Image
          src="/images/hero-bg.png"
          alt=""
          aria-hidden
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
        <div className="relative z-10 flex max-w-[660px] flex-col items-center gap-6 rounded-lg border border-border-subtle bg-paper/70 p-16 text-center backdrop-blur">
          <span className="font-body text-[14px] tracking-[2px] text-muted">
            [ Oops! Page Not Found ]
          </span>
          <h1 className="font-heading text-[80px] leading-none text-ink">404</h1>
          <p className="font-heading text-[32px] leading-tight text-ink">
            The page you&rsquo;re looking for doesn&rsquo;t exist
          </p>
          <Link
            href="/"
            className="rounded-sm bg-ink px-6 py-3 font-body text-[14px] font-medium text-paper"
          >
            Back to Homepage
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
```

Note: the heading text is deliberately "doesn't exist" (correcting Figma's typo "doesn't exixst" — a clear typo, not an intentional stylistic choice, unlike previously-preserved Figma quirks such as the Footer's copyright formatting from Phase 1). Reuses `/images/hero-bg.png` (already compressed in Phase 1) rather than downloading a new background asset — confirm via the Figma screenshot that it's visually the same illustrated background family; if Figma's 404 background is a distinctly different image, download and use that specific asset instead.

- [ ] **Step 3: Verify**

```bash
npm run build
npm run dev &
sleep 3
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/this-route-does-not-exist
kill %1
```

Expected: `404` status code, and visually the custom page (not Next's default) renders — confirm via a scratch Playwright screenshot of `/this-route-does-not-exist`. Compare against `mcp__figma__get_screenshot` for node `7137:254`.

- [ ] **Step 4: Commit**

```bash
git add app/not-found.tsx
git commit -m "feat: add custom 404 page"
```

---

### Task 11: Cross-page navigation wiring

**Files:**
- Modify: `components/Navbar.tsx`
- Modify: `app/page.tsx` (homepage — link "See All Finished Product" and case study tile CTAs to the new case-studies pages)

- [ ] **Step 1: Wire the Navbar's "About Me" button**

In `components/Navbar.tsx`, the "About Me" button currently has no `href`/navigation (Phase 1 left it as a static styled element since `/about` didn't exist yet). Convert it to a `next/link`:

```tsx
import Link from "next/link";
// ...
<Link
  href="/about"
  className="[existing About Me button classes, unchanged]"
>
  About Me
</Link>
```

Keep all existing classNames identical — only change the element type from `button`/`div` to `Link` and add the `href`.

- [ ] **Step 2: Wire homepage Result section links**

In `components/sections/Result.tsx` (built in Phase 1), the "See Study Case" links currently point to `href="#"` with a `{/* TODO: link to case-study pages (later phase) */}` comment (added during the Phase 1 cleanup pass). Now that `/case-studies/[slug]` exists, update them to real links:
- First tile → `/case-studies/ryno-finance`
- Second tile → `/case-studies/linqart`
- "See All Finished Product" → `/case-studies`

Use `next/link`'s `Link` component in place of the plain `<a href="#">`, preserving existing classNames.

- [ ] **Step 3: Verify**

```bash
npm run build
```

Expected: build succeeds, no broken internal links. Run `npm run dev`, click through: Navbar "About Me" → `/about`; homepage Result tiles → the two real case study pages; "See All Finished Product" → `/case-studies`.

- [ ] **Step 4: Commit**

```bash
git add components/Navbar.tsx components/sections/Result.tsx
git commit -m "feat: wire cross-page navigation to new pages"
```

---

### Task 12: Full-site QA pass

**Files:**
- None (verification task; fix discrepancies found in the relevant page/component files)

- [ ] **Step 1: Build and smoke-test every route**

```bash
npm run build
npm run dev &
sleep 3
for path in / /about /case-studies /case-studies/ryno-finance /case-studies/linqart /case-studies/federal-pms /contact; do
  echo -n "$path: "
  curl -s -o /dev/null -w "%{http_code}\n" "http://localhost:3000$path"
done
curl -s -o /dev/null -w "404 test: %{http_code}\n" http://localhost:3000/nonexistent
kill %1
```

Expected: `200` for every real route, `404` for the nonexistent one.

- [ ] **Step 2: Visual pass at desktop (1440px) and mobile (390px)**

For each of the 5 new pages, screenshot via a scratch Playwright install and compare against its Figma screenshot. Check specifically: consistent spacing between sections (the class of bug found during the Phase 1 homepage QA pass), no horizontal overflow on mobile, `PageSidebar` correctly hidden below `md` like `HeroSidebar`/`SidebarSpacer` already are.

- [ ] **Step 3: Fix any discrepancies found**

Re-run `get_design_context` on specific sub-nodes as needed and correct the relevant files.

- [ ] **Step 4: Update the README**

Modify `README.md`'s "Scope" section to remove About/Case Studies/Contact/404 from the "not yet built" list, and add a note about `RESEND_API_KEY` alongside the existing `ANTHROPIC_API_KEY` instructions.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "fix: phase 2 full-site QA pass and README update"
```

(Skip the commit if no discrepancies were found and the README is the only change — still commit the README change alone in that case.)
