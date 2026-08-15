# Portfolio Homepage Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a pixel-accurate, fully interactive Next.js homepage from the Figma file "Personal Portfolio" (fileKey `0IyCORj0osd1Dzx8Q7S7Eh`, desktop homepage node `7001:1391`), including a real AI-backed chat widget in the hero.

**Architecture:** Next.js 15 App Router site with one page (`app/page.tsx`) composed of section components under `components/sections/`. Each section's markup/styling is generated from the actual Figma node via the `mcp__figma__get_design_context` tool (not guessed from screenshots), then adapted to the project's Tailwind token setup. The chat widget is a client component backed by a Next.js Route Handler that streams replies from the Anthropic API.

**Tech Stack:** Next.js 15, TypeScript, Tailwind CSS, Framer Motion, `@anthropic-ai/sdk`.

**Figma reference:** fileKey = `0IyCORj0osd1Dzx8Q7S7Eh` for every `get_design_context` / `get_screenshot` call below.

**Important note on layer names:** two sections in the Figma file have stale/reused instance names ("What They Said Section") that do NOT match their visual content — node `7015:1503` is actually the "Connected Weapons for Modern Design" tech-icon grid, and node `12220:1444` is actually the "Ways to Work Together" cards. Trust the content returned by `get_design_context`/`get_screenshot`, not the layer name, when implementing these two tasks.

---

### Task 1: Scaffold the Next.js project

**Files:**
- Create: `~/Projects/my-portfolio/` (entire scaffold via `create-next-app`)

- [ ] **Step 1: Run create-next-app**

```bash
cd ~/Projects/my-portfolio
npx --yes create-next-app@latest . --typescript --tailwind --eslint --app --src-dir=false --import-alias "@/*" --use-npm --skip-install=false --yes
```

If it prompts about the directory not being empty (it contains `docs/` and `.git`), confirm/continue — it will scaffold alongside the existing `docs/` folder.

- [ ] **Step 2: Verify the dev server boots**

```bash
npm run dev &
sleep 3
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000
kill %1
```

Expected: `200`

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "chore: scaffold Next.js app"
```

---

### Task 2: Configure Tailwind theme tokens

**Files:**
- Modify: `tailwind.config.ts`

- [ ] **Step 1: Replace the theme section with tokens from the design spec**

Open `tailwind.config.ts` and set the `theme.extend` block:

```ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        body: ["var(--font-inter-tight)", "sans-serif"],
        heading: ["var(--font-instrument-serif)", "serif"],
      },
      colors: {
        ink: "#000000",
        paper: "#FFFFFF",
        border: "#EFEFEF",
        surface: "#FAFAFA",
        accent: "#112527",
        muted: "#707070",
        "muted-2": "#505050",
      },
      spacing: {
        "4.5": "18px",
      },
      borderRadius: {
        sm: "8px",
        md: "16px",
        lg: "24px",
      },
      boxShadow: {
        button: "0 1px 0 0 rgba(0,0,0,0.06), 0 2px 4px 0 rgba(0,0,0,0.04)",
      },
    },
  },
  plugins: [],
};

export default config;
```

- [ ] **Step 2: Verify Tailwind builds without errors**

```bash
npm run build
```

Expected: build succeeds (ignore page-content errors at this stage if any — we only care that the Tailwind config itself is valid).

- [ ] **Step 3: Commit**

```bash
git add tailwind.config.ts
git commit -m "feat: configure Tailwind theme tokens from Figma"
```

---

### Task 3: Load fonts and set up the root layout

**Files:**
- Modify: `app/layout.tsx`
- Modify: `app/globals.css`

- [ ] **Step 1: Configure next/font in app/layout.tsx**

```tsx
import type { Metadata } from "next";
import { Inter_Tight, Instrument_Serif } from "next/font/google";
import "./globals.css";

const interTight = Inter_Tight({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-inter-tight",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-instrument-serif",
});

export const metadata: Metadata = {
  title: "Mike Lee — Product Designer",
  description: "A product designer based in Indonesia.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${interTight.variable} ${instrumentSerif.variable}`}>
      <body className="font-body bg-paper text-ink antialiased">{children}</body>
    </html>
  );
}
```

- [ ] **Step 2: Reset globals.css to a minimal base**

Replace the contents of `app/globals.css` with:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

html {
  scroll-behavior: smooth;
}
```

- [ ] **Step 3: Verify fonts render**

```bash
npm run dev &
sleep 3
curl -s http://localhost:3000 | grep -o "font-inter-tight" | head -1
kill %1
```

Expected: prints `font-inter-tight` (confirms the class made it into the rendered HTML).

- [ ] **Step 4: Commit**

```bash
git add app/layout.tsx app/globals.css
git commit -m "feat: set up Inter Tight and Instrument Serif fonts"
```

---

### Task 4: Environment variable scaffolding for the chat API key

**Files:**
- Create: `.env.local.example`
- Modify: `.gitignore` (verify `.env*.local` is present — `create-next-app` adds this by default)

- [ ] **Step 1: Create the example env file**

```bash
cat > .env.local.example <<'EOF'
# Copy this file to .env.local and fill in your real key.
# Get a key at https://console.anthropic.com/settings/keys
ANTHROPIC_API_KEY=
EOF
```

- [ ] **Step 2: Confirm .env.local is gitignored**

```bash
grep -n "env" .gitignore
```

Expected: a line matching `.env*.local` is present (added automatically by `create-next-app`). If missing, append it:

```bash
echo ".env*.local" >> .gitignore
```

- [ ] **Step 3: Commit**

```bash
git add .env.local.example .gitignore
git commit -m "chore: add env var scaffolding for chat API key"
```

---

### Task 5: Navbar component

**Files:**
- Create: `components/Navbar.tsx`

- [ ] **Step 1: Fetch design context for the Navbar**

Call `mcp__figma__get_design_context` with `fileKey="0IyCORj0osd1Dzx8Q7S7Eh"` and `nodeId="7246:1373"` (the Navbar instance on the desktop homepage).

- [ ] **Step 2: Implement the component**

Create `components/Navbar.tsx` as a client component (add `"use client"` if it needs scroll-state for the sticky/condensed behavior). Adapt the returned markup to:
- Use the `ink`/`paper`/`border` color tokens and `font-body`/`font-heading` classes from Task 2 instead of raw hex values
- Use `next/image` for the logo/icon asset — download any asset URLs returned by `get_design_context` into `public/images/` via `curl -L -o public/images/<name>.<ext> "<url>"` and reference them with a leading `/`
- Add `position: sticky` at the top with a subtle bottom border that only appears after scrolling past the hero (use a scroll listener with `useState`/`useEffect`, threshold ~80px)

- [ ] **Step 3: Render it in the page and visually check**

Temporarily render `<Navbar />` in `app/page.tsx`, run `npm run dev`, and compare `http://localhost:3000` against the Figma screenshot fetched via `mcp__figma__get_screenshot` on node `7246:1373`.

- [ ] **Step 4: Commit**

```bash
git add components/Navbar.tsx app/page.tsx
git commit -m "feat: add Navbar component"
```

---

### Task 6: Hero section layout (background + scroll-spy sidebar shell)

**Files:**
- Create: `components/sections/Hero.tsx`
- Create: `components/HeroSidebar.tsx`

- [ ] **Step 1: Fetch design context for the Hero section**

Call `mcp__figma__get_design_context` with `nodeId="7001:1392"` ("Hero Section" on the desktop homepage).

- [ ] **Step 2: Implement the background + layout shell**

Create `components/sections/Hero.tsx`. Adapt the returned markup for:
- The full-bleed illustrated background image (download via the asset URL into `public/images/hero-bg.<ext>`, render with `next/image` using `fill` and `object-cover`, or as a CSS `background-image` if the design uses layered/blended images)
- The two-column layout: left sidebar nav column, right content column containing the chat widget card
- Leave a `<HeroSidebar />` placeholder for the left nav (implemented next) and a `<ChatWidget />` placeholder (implemented in Task 7) inside the layout

- [ ] **Step 3: Implement the static sidebar nav (no scroll-spy yet)**

Create `components/HeroSidebar.tsx` rendering the link list from the design context: "Send me Messages", "Capability", "Process", "The Result", "What They Said", "Pricing", "FAQ". Map each label to the section id it will scroll to (ids are defined when each section component is built in later tasks):

| Sidebar label | Anchor |
|---|---|
| Send me Messages | `#chat` (defined on the chat widget's card in Task 7) |
| Capability | `#capabilities` (Task 9) |
| Process | `#process` (Task 11) |
| The Result | `#result` (Task 12) |
| What They Said | `#tech-stack` (Task 13 — despite the sidebar label, this points at the tech-icon grid; there is no separate testimonials section in this Figma file) |
| Pricing | `#pricing` (Task 14, the "Ways to Work Together" section) |
| FAQ | `#faq` (Task 15) |

No active-state highlighting yet — that's Task 19.

- [ ] **Step 4: Render and visually check**

Add `<Hero />` to `app/page.tsx` below `<Navbar />`. Compare against `mcp__figma__get_screenshot` for node `7001:1392`.

- [ ] **Step 5: Commit**

```bash
git add components/sections/Hero.tsx components/HeroSidebar.tsx app/page.tsx public/images
git commit -m "feat: add Hero section layout and sidebar nav shell"
```

---

### Task 7: Chat widget — static UI with seeded conversation

**Files:**
- Create: `components/ChatWidget.tsx`
- Create: `lib/chat-seed.ts`

- [ ] **Step 1: Fetch design context for the chat card**

Within the Hero section's design context from Task 6, locate the chat card subtree (named "Chat container" per the earlier metadata scan, under node `7001:1392`). If you need it in isolation, call `mcp__figma__get_metadata` with `nodeId="7001:1392"` to find the exact chat-container node id, then `mcp__figma__get_design_context` on that id.

- [ ] **Step 2: Define the seeded conversation**

Create `lib/chat-seed.ts`:

```ts
export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
};

export const SEED_MESSAGES: ChatMessage[] = [
  {
    role: "user",
    content:
      "Hey Quadri, I came across your profile, your design work looks solid! Could you tell me more about the services you offer?",
    timestamp: "2 Mins Ago",
  },
  {
    role: "assistant",
    content:
      "Hey! Thanks a lot, I appreciate that. I focus on product design, mainly UI/UX for web and mobile apps. I also help with user flow optimization, design systems, and clickable prototypes.",
    timestamp: "2 Mins Ago",
  },
  {
    role: "user",
    content: "What's your usual process if we start a project?",
    timestamp: "Just Now",
  },
];
```

- [ ] **Step 3: Implement the static widget**

Create `components/ChatWidget.tsx` as a client component (`"use client"`) with `id="chat"` on the outermost card element (this is the scroll target for the sidebar's "Send me Messages" link). Render the profile header ("Milke Helper" + avatar), the scrollable message list from `SEED_MESSAGES` (user messages styled dark/right-aligned, assistant messages styled light/left-aligned, per the Figma screenshot), and the bottom input row ("Send us message" + send button). No submit behavior yet — that's Task 21.

- [ ] **Step 4: Wire into Hero and visually check**

Replace the `<ChatWidget />` placeholder in `components/sections/Hero.tsx` with the real component. Compare rendered output against the Figma screenshot of the chat card.

- [ ] **Step 5: Commit**

```bash
git add components/ChatWidget.tsx lib/chat-seed.ts components/sections/Hero.tsx
git commit -m "feat: add static chat widget UI with seeded conversation"
```

---

### Task 8: AI-Fluency Callout (dark banner)

**Files:**
- Create: `components/sections/AiFluencyCallout.tsx`

- [ ] **Step 1: Fetch design context**

Call `mcp__figma__get_design_context` with `nodeId="12217:1325"`.

- [ ] **Step 2: Implement**

Create `components/sections/AiFluencyCallout.tsx` — a full-width dark (`bg-accent` or the exact dark color returned) banner containing the single line of copy ("I ship faster with AI — Claude Code + Cursor collapse design-to-engineering from days to hours."). Use the `Typography` values returned by `get_design_context` mapped to Tailwind text utilities.

- [ ] **Step 3: Render and visually check**

Add `<AiFluencyCallout />` to `app/page.tsx` below `<Hero />`. Compare against `mcp__figma__get_screenshot` for node `12217:1325`.

- [ ] **Step 4: Commit**

```bash
git add components/sections/AiFluencyCallout.tsx app/page.tsx
git commit -m "feat: add AI-Fluency callout banner"
```

---

### Task 9: Capabilities section

**Files:**
- Create: `components/sections/Capabilities.tsx`

- [ ] **Step 1: Fetch design context**

Call `mcp__figma__get_design_context` with `nodeId="7001:1480"`.

- [ ] **Step 2: Implement**

Create `components/sections/Capabilities.tsx` with `id="capabilities"` on the root element (so the sidebar's "Capability" link can anchor to it). Render the heading ("I don't bring dreams, I bring solutions for your Business"), the 4 service cards (AI Audit, User Segmentation & Insights, Web/UI Design & Prototyping, MVP/Product Development) and the skill tag pills, adapted from the returned markup.

- [ ] **Step 3: Render and visually check**

Add to `app/page.tsx`. Compare against `mcp__figma__get_screenshot` for node `7001:1480`.

- [ ] **Step 4: Commit**

```bash
git add components/sections/Capabilities.tsx app/page.tsx
git commit -m "feat: add Capabilities section"
```

---

### Task 10: Domain Breadth Strip

**Files:**
- Create: `components/sections/DomainStrip.tsx`

- [ ] **Step 1: Fetch design context**

Call `mcp__figma__get_design_context` with `nodeId="12217:1327"`.

- [ ] **Step 2: Implement**

Create `components/sections/DomainStrip.tsx` rendering the "[ DOMAINS ]" label and the pill row (FinTech, AI-native, GovTech, Enterprise SaaS), adapted from the returned markup.

- [ ] **Step 3: Render and visually check**

Add to `app/page.tsx` between Capabilities and Workprocess. Compare against `mcp__figma__get_screenshot` for node `12217:1327`.

- [ ] **Step 4: Commit**

```bash
git add components/sections/DomainStrip.tsx app/page.tsx
git commit -m "feat: add Domain Breadth Strip"
```

---

### Task 11: Process (Workprocess) section

**Files:**
- Create: `components/sections/Process.tsx`

- [ ] **Step 1: Fetch design context**

Call `mcp__figma__get_design_context` with `nodeId="7001:1740"`.

- [ ] **Step 2: Implement**

Create `components/sections/Process.tsx` with `id="process"`. Render the heading ("A Process Rooted in Clarity & Insight"), the numbered steps (Define Objectives, Heuristic Evaluation, User Flow Analysis, Estimated Data Analysis) and the device mockup image (download the asset via the URL returned by `get_design_context` into `public/images/`).

- [ ] **Step 3: Render and visually check**

Add to `app/page.tsx`. Compare against `mcp__figma__get_screenshot` for node `7001:1740`.

- [ ] **Step 4: Commit**

```bash
git add components/sections/Process.tsx app/page.tsx public/images
git commit -m "feat: add Process section"
```

---

### Task 12: Result (proof) section

**Files:**
- Create: `components/sections/Result.tsx`

- [ ] **Step 1: Fetch design context**

Call `mcp__figma__get_design_context` with `nodeId="7001:1813"`.

- [ ] **Step 2: Implement**

Create `components/sections/Result.tsx` with `id="result"`. Render the heading ("Every product starts as an idea, but not every idea becomes a product."), the two case-study image tiles side by side, and the "View It Live" / "Get My Prototype" CTA buttons. Download tile images into `public/images/`.

- [ ] **Step 3: Render and visually check**

Add to `app/page.tsx`. Compare against `mcp__figma__get_screenshot` for node `7001:1813`.

- [ ] **Step 4: Commit**

```bash
git add components/sections/Result.tsx app/page.tsx public/images
git commit -m "feat: add Result section"
```

---

### Task 13: Tech Stack grid ("Connected Weapons for Modern Design")

**Files:**
- Create: `components/sections/TechStack.tsx`

- [ ] **Step 1: Fetch design context**

Call `mcp__figma__get_design_context` with `nodeId="7015:1503"`. Note: this node is misnamed "What They Said Section" in Figma's layer panel — trust the returned content (it is the tool-icon grid), not the name.

- [ ] **Step 2: Implement**

Create `components/sections/TechStack.tsx` with `id="tech-stack"`. Render the heading ("Connected Weapons for Modern Design"), the description paragraphs, and the icon grid (Google Drive, Figma, VS Code, Slack, GitLab, Google Meet, Trello, Git, iMessage, etc. — use whatever exact icon set `get_design_context` returns). Download each icon asset into `public/images/tools/`.

- [ ] **Step 3: Render and visually check**

Add to `app/page.tsx`. Compare against `mcp__figma__get_screenshot` for node `7015:1503`.

- [ ] **Step 4: Commit**

```bash
git add components/sections/TechStack.tsx app/page.tsx public/images
git commit -m "feat: add Tech Stack grid section"
```

---

### Task 14: Ways to Work Together

**Files:**
- Create: `components/sections/WaysToWork.tsx`

- [ ] **Step 1: Fetch design context**

Call `mcp__figma__get_design_context` with `nodeId="12220:1444"`. Note: also misnamed "What They Said Section" in Figma — this is actually the "Ways to Work Together" cards.

- [ ] **Step 2: Implement**

Create `components/sections/WaysToWork.tsx` with `id="pricing"` on the root element (this is the sidebar's "Pricing" link target, per the mapping in Task 6). Render the heading ("Ways to Work Together") and the 3 cards (Full-Time Roles, Contract / Fractional, Advisory & Mentorship) with their descriptions, adapted from the returned markup.

- [ ] **Step 3: Render and visually check**

Add to `app/page.tsx`. Compare against `mcp__figma__get_screenshot` for node `12220:1444`.

- [ ] **Step 4: Commit**

```bash
git add components/sections/WaysToWork.tsx app/page.tsx
git commit -m "feat: add Ways to Work Together section"
```

---

### Task 15: FAQ section with accordion

**Files:**
- Create: `components/sections/Faq.tsx`
- Create: `components/AccordionItem.tsx`

- [ ] **Step 1: Fetch design context**

Call `mcp__figma__get_design_context` with `nodeId="7001:2131"`.

- [ ] **Step 2: Implement the accordion primitive**

Create `components/AccordionItem.tsx` as a client component:

```tsx
"use client";

import { useState } from "react";

export function AccordionItem({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-border py-6">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full items-center justify-between text-left"
        aria-expanded={open}
      >
        <span className="font-body font-medium text-ink">{question}</span>
        <span className="ml-4 shrink-0 text-muted">{open ? "−" : "+"}</span>
      </button>
      {open && <p className="mt-3 text-muted">{answer}</p>}
    </div>
  );
}
```

- [ ] **Step 3: Implement the section**

Create `components/sections/Faq.tsx` with `id="faq"`, importing `AccordionItem` and rendering the 5 questions/answers from the design context content (project approach, tools/platforms, timelines, redesign vs new, starting small). Each `AccordionItem` manages its own open state independently (matches simplest correct behavior; only change this if `get_design_context`'s interaction data shows a single-open-at-a-time prototype behavior).

- [ ] **Step 4: Render and visually check**

Add to `app/page.tsx`. Click through all 5 questions in the browser and confirm each expands/collapses independently. Compare styling against `mcp__figma__get_screenshot` for node `7001:2131`.

- [ ] **Step 5: Commit**

```bash
git add components/AccordionItem.tsx components/sections/Faq.tsx app/page.tsx
git commit -m "feat: add FAQ section with accordion"
```

---

### Task 16: CTA section

**Files:**
- Create: `components/sections/Cta.tsx`

- [ ] **Step 1: Fetch design context**

Call `mcp__figma__get_design_context` with `nodeId="7019:1772"`.

- [ ] **Step 2: Implement**

Create `components/sections/Cta.tsx`. Render the illustrated background, the heading ("Let's Turn Your Idea Into a Product That Works.") and the CTA button, adapted from the returned markup. Download the background asset into `public/images/`.

- [ ] **Step 3: Render and visually check**

Add to `app/page.tsx`. Compare against `mcp__figma__get_screenshot` for node `7019:1772`.

- [ ] **Step 4: Commit**

```bash
git add components/sections/Cta.tsx app/page.tsx public/images
git commit -m "feat: add CTA section"
```

---

### Task 17: Footer

**Files:**
- Create: `components/Footer.tsx`

- [ ] **Step 1: Fetch design context**

Call `mcp__figma__get_design_context` with `nodeId="7244:883"` (the Footer Section instance).

- [ ] **Step 2: Implement**

Create `components/Footer.tsx`. Render the name/tagline, "Get in touch with me" (`hello@mike.com`) link, copyright line, and any social links, adapted from the returned markup.

- [ ] **Step 3: Render and visually check**

Add `<Footer />` at the bottom of `app/page.tsx`. Compare against `mcp__figma__get_screenshot` for node `7244:883`.

- [ ] **Step 4: Commit**

```bash
git add components/Footer.tsx app/page.tsx
git commit -m "feat: add Footer"
```

---

### Task 18: Full-page visual pass

**Files:**
- None (verification task)

- [ ] **Step 1: Assemble and screenshot**

Ensure `app/page.tsx` renders, in order: `Navbar`, `Hero`, `AiFluencyCallout`, `Capabilities`, `DomainStrip`, `Process`, `Result`, `TechStack`, `WaysToWork`, `Faq`, `Cta`, `Footer`.

```bash
npm run dev &
sleep 3
```

Use the claude-in-chrome tools (or manual browser check) to load `http://localhost:3000` and scroll through the full page.

- [ ] **Step 2: Compare against the full Figma homepage**

Call `mcp__figma__get_screenshot` with `nodeId="7001:1391"` and compare section-by-section against the running site. Note any spacing/copy/color mismatches.

- [ ] **Step 3: Fix any discrepancies found**

For each mismatch, re-run `get_design_context` on the specific sub-node and correct the relevant component file.

- [ ] **Step 4: Commit**

```bash
kill %1
git add -A
git commit -m "fix: address visual discrepancies from full-page QA pass"
```

(Skip the commit if there were no discrepancies to fix.)

---

### Task 19: Scroll-spy sidebar navigation

**Files:**
- Create: `hooks/useScrollSpy.ts`
- Modify: `components/HeroSidebar.tsx`

- [ ] **Step 1: Implement the scroll-spy hook**

Create `hooks/useScrollSpy.ts`:

```ts
"use client";

import { useEffect, useState } from "react";

export function useScrollSpy(sectionIds: string[]): string | null {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "-20% 0px -70% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] }
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [sectionIds]);

  return activeId;
}
```

- [ ] **Step 2: Wire it into the sidebar**

Modify `components/HeroSidebar.tsx` to call:

```ts
const activeId = useScrollSpy([
  "chat",
  "capabilities",
  "process",
  "result",
  "tech-stack",
  "pricing",
  "faq",
]);
```

Apply an active style (e.g. `font-medium text-ink` vs `text-muted`) to the link whose `href` matches `#${activeId}`. Add `"use client"` at the top of the file if not already present.

- [ ] **Step 3: Verify in the browser**

Run `npm run dev`, scroll through the page, and confirm the sidebar link highlight updates as each section enters the viewport.

- [ ] **Step 4: Commit**

```bash
git add hooks/useScrollSpy.ts components/HeroSidebar.tsx
git commit -m "feat: add scroll-spy highlighting to hero sidebar nav"
```

---

### Task 20: Scroll-reveal animations

**Files:**
- Create: `components/RevealOnScroll.tsx`
- Modify: `app/page.tsx`

- [ ] **Step 1: Install Framer Motion**

```bash
npm install framer-motion
```

- [ ] **Step 2: Implement the reveal wrapper**

Create `components/RevealOnScroll.tsx`:

```tsx
"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

export function RevealOnScroll({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
```

- [ ] **Step 3: Wrap each section in app/page.tsx**

Wrap every section component (except `Hero`, which should be visible immediately on load) in `<RevealOnScroll>`:

```tsx
<RevealOnScroll>
  <Capabilities />
</RevealOnScroll>
```

Repeat for `AiFluencyCallout`, `DomainStrip`, `Process`, `Result`, `TechStack`, `WaysToWork`, `Faq`, `Cta`.

- [ ] **Step 4: Verify in the browser**

Run `npm run dev`, scroll down the page, and confirm each section fades/slides in once as it enters the viewport (and does not re-animate on scrolling back up).

- [ ] **Step 5: Commit**

```bash
git add components/RevealOnScroll.tsx app/page.tsx package.json package-lock.json
git commit -m "feat: add scroll-reveal animations to sections"
```

---

### Task 21: Chat widget submit handler (local state only)

**Files:**
- Modify: `components/ChatWidget.tsx`

- [ ] **Step 1: Add form state and submit handler (no network call yet)**

Modify `components/ChatWidget.tsx` to manage messages as state seeded from `SEED_MESSAGES`, and wire the input form:

```tsx
"use client";

import { useState, type FormEvent } from "react";
import { SEED_MESSAGES, type ChatMessage } from "@/lib/chat-seed";

export function ChatWidget() {
  const [messages, setMessages] = useState<ChatMessage[]>(SEED_MESSAGES);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isSending) return;

    setMessages((prev) => [
      ...prev,
      { role: "user", content: trimmed, timestamp: "Just Now" },
    ]);
    setInput("");
    // network call added in Task 23 (Task 22 builds the /api/chat route this will call)
  }

  // ... existing render logic from Task 7, using `messages` state instead of
  // the static SEED_MESSAGES import directly, and binding the input:
  // <input value={input} onChange={(e) => setInput(e.target.value)} />
  // <form onSubmit={handleSubmit}>...</form>
}
```

Keep the JSX structure/styling built in Task 7 — this step only adds the `useState` calls and the `handleSubmit`/`onChange` wiring around the existing markup.

- [ ] **Step 2: Verify in the browser**

Type a message and submit. Confirm it appears in the message list immediately and the input clears.

- [ ] **Step 3: Commit**

```bash
git add components/ChatWidget.tsx
git commit -m "feat: add local state and submit handling to chat widget"
```

---

### Task 22: Anthropic-backed /api/chat route

**Files:**
- Create: `app/api/chat/route.ts`
- Create: `lib/chat-system-prompt.ts`

- [ ] **Step 1: Install the Anthropic SDK**

```bash
npm install @anthropic-ai/sdk
```

- [ ] **Step 2: Write the system prompt**

Create `lib/chat-system-prompt.ts`:

```ts
export const SYSTEM_PROMPT = `You are "Milke Helper", a friendly assistant answering on behalf of Mike Lee, a product designer based in Indonesia.

Mike's services: AI Audit, User Segmentation & Insights, Web/UI Design & Prototyping, and MVP/Product Development. He works UI/UX for web and mobile apps, user flow optimization, design systems, and clickable prototypes.

Mike's process: Define Objectives, Heuristic Evaluation, User Flow Analysis, Estimated Data Analysis — a process rooted in clarity and insight.

Engagement models: Full-Time Roles (embedded product designer), Contract/Fractional (scoped sprints or ongoing part-time partnership), and Advisory & Mentorship (design reviews, portfolio coaching, hands-on pairing).

Answer questions about Mike's services, process, pricing approach, and availability in a warm, concise, first-person voice ("I focus on...", "My usual process..."). Keep replies to 2-4 sentences unless the visitor asks for more detail. If asked something unrelated to Mike's design work, gently steer back to how you can help with their product/design needs.`;
```

- [ ] **Step 3: Implement the route handler with streaming**

Create `app/api/chat/route.ts`:

```ts
import Anthropic from "@anthropic-ai/sdk";
import { SYSTEM_PROMPT } from "@/lib/chat-system-prompt";

export const runtime = "nodejs";

type IncomingMessage = { role: "user" | "assistant"; content: string };

export async function POST(request: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: "missing_api_key" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { messages }: { messages: IncomingMessage[] } = await request.json();

  const client = new Anthropic({ apiKey });

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      try {
        const anthropicStream = client.messages.stream({
          model: "claude-sonnet-4-5",
          max_tokens: 512,
          system: SYSTEM_PROMPT,
          messages: messages.map((m) => ({ role: m.role, content: m.content })),
        });

        anthropicStream.on("text", (text) => {
          controller.enqueue(encoder.encode(text));
        });

        await anthropicStream.finalMessage();
        controller.close();
      } catch (error) {
        controller.error(error);
      }
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
```

- [ ] **Step 4: Verify with a manual curl (requires a real key in .env.local)**

```bash
cp .env.local.example .env.local
# manually edit .env.local and paste a real ANTHROPIC_API_KEY before running this
npm run dev &
sleep 3
curl -N -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"What services do you offer?"}]}'
kill %1
```

Expected: streamed plain-text response describing Mike's services (or a `missing_api_key` JSON error if `.env.local` has no key set — expected/acceptable at this stage since Task 4 intentionally leaves the real key for the user to add).

- [ ] **Step 5: Commit**

```bash
git add app/api/chat/route.ts lib/chat-system-prompt.ts package.json package-lock.json
git commit -m "feat: add streaming /api/chat route backed by Anthropic"
```

---

### Task 23: Wire streaming replies and error fallback into the chat widget

**Files:**
- Modify: `components/ChatWidget.tsx`

- [ ] **Step 1: Call the API and stream the response into state**

Extend `handleSubmit` from Task 21:

```tsx
async function handleSubmit(event: FormEvent<HTMLFormElement>) {
  event.preventDefault();
  const trimmed = input.trim();
  if (!trimmed || isSending) return;

  const nextMessages: ChatMessage[] = [
    ...messages,
    { role: "user", content: trimmed, timestamp: "Just Now" },
  ];
  setMessages(nextMessages);
  setInput("");
  setIsSending(true);

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: nextMessages.map(({ role, content }) => ({ role, content })),
      }),
    });

    if (!response.ok || !response.body) {
      throw new Error("chat_request_failed");
    }

    setMessages((prev) => [
      ...prev,
      { role: "assistant", content: "", timestamp: "Just Now" },
    ]);

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let accumulated = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      accumulated += decoder.decode(value, { stream: true });
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          ...updated[updated.length - 1],
          content: accumulated,
        };
        return updated;
      });
    }
  } catch {
    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        content: "Having trouble connecting right now — try again in a moment.",
        timestamp: "Just Now",
      },
    ]);
  } finally {
    setIsSending(false);
  }
}
```

- [ ] **Step 2: Verify the golden path**

With a real `ANTHROPIC_API_KEY` set in `.env.local`, run `npm run dev`, type a question in the chat widget, and confirm the reply streams in visibly (text growing incrementally, not appearing all at once).

- [ ] **Step 3: Verify the error path**

Temporarily rename `.env.local` (`mv .env.local .env.local.bak`), restart the dev server, submit a message, and confirm the widget shows the fallback message instead of hanging or crashing. Then restore it (`mv .env.local.bak .env.local`).

- [ ] **Step 4: Commit**

```bash
git add components/ChatWidget.tsx
git commit -m "feat: stream real chat replies with error fallback"
```

---

### Task 24: README

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Write setup instructions**

Replace `README.md` with:

```markdown
# My Portfolio

Personal portfolio site built from a Figma design, with an AI-backed chat widget in the hero.

## Setup

1. `npm install`
2. Copy `.env.local.example` to `.env.local` and set `ANTHROPIC_API_KEY` to a real key from https://console.anthropic.com/settings/keys
3. `npm run dev`

## Scope

This build covers the homepage only. The Figma file also contains About, Case Study List/Detail,
Contact, Privacy Policy, Terms & Conditions, and 404 pages — see
`docs/superpowers/specs/2026-08-15-portfolio-homepage-design.md` for what's in/out of scope.
```

- [ ] **Step 2: Commit**

```bash
git add README.md
git commit -m "docs: add setup README"
```
