# Site Navigation Rework Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the three inconsistent left-sidebar components (`HeroSidebar`, `PageSidebar`, `SidebarSpacer`) with one shared, genuinely sticky `SiteSidebar` that serves as persistent page-to-page navigation on every page, plus a new mobile nav menu, per `docs/superpowers/specs/2026-08-17-site-navigation-rework-design.md`.

**Architecture:** One new client component (`SiteSidebar`) renders once per page inside a page-level flex row (`<SiteSidebar /><main>...</main>`), replacing every per-section spacer/sidebar call. A second new component (`MobileNav`) adds a hamburger-triggered dropdown to the existing `Navbar` for viewports below `md`. The three old components and the now-unused `useScrollSpy` hook are deleted once nothing references them.

**Tech Stack:** Next.js App Router, TypeScript, Tailwind CSS v4 (existing project conventions — no new dependencies).

**Prerequisite:** Run from the repo root `~/Projects/my-portfolio` on `master` (or a feature branch/worktree per the execution skill's own setup step — this plan doesn't prescribe worktree setup, that's handled by whichever execution skill runs it).

---

### Task 1: Create the `SiteSidebar` component

**Files:**
- Create: `components/SiteSidebar.tsx`

- [ ] **Step 1: Write the component**

Create `components/SiteSidebar.tsx`:

```tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const SITE_LINKS = [
  { label: "About", href: "/about" },
  { label: "Case Studies", href: "/case-studies" },
  { label: "Contact", href: "/contact" },
];

export default function SiteSidebar() {
  const pathname = usePathname();

  return (
    <div className="sticky top-[84px] hidden h-[calc(100vh-84px)] w-[269px] shrink-0 flex-col items-start justify-center overflow-clip border-r border-border-subtle bg-surface md:flex">
      <div className="flex w-full flex-col items-start justify-center gap-8 py-10 pl-10 pr-4">
        <Link
          href="/"
          aria-label="Home"
          className="relative block size-[30px] shrink-0"
        >
          <Image src="/images/hero-logo.svg" alt="" fill sizes="30px" />
        </Link>
        <nav className="flex w-full flex-col items-start">
          {SITE_LINKS.map((link) => {
            const isActive = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative flex w-full items-start gap-2.5 whitespace-nowrap p-2.5 font-body text-[16px] tracking-[-0.16px] text-ink ${
                  isActive ? "font-medium" : "font-medium opacity-30"
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute inset-x-0 bottom-0 h-px w-[213px] bg-border-subtle" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
```

`top-[84px]` matches the Navbar's rendered height (`h-[84px]` on its left column, `h-[83px]` on its header row — 84px is the tallest, so the sidebar pins directly beneath it with no gap or overlap). `pathname.startsWith(link.href)` keeps "Case Studies" bolded on `/case-studies/[slug]` detail pages, not just the exact list page.

- [ ] **Step 2: Verify it type-checks**

```bash
npx tsc --noEmit
```

Expected: no errors (the component isn't wired into any page yet, but it must still compile standalone).

- [ ] **Step 3: Commit**

```bash
git add components/SiteSidebar.tsx
git commit -m "feat: add shared SiteSidebar component"
```

---

### Task 2: Create `MobileNav` and wire it into `Navbar`

**Files:**
- Create: `components/MobileNav.tsx`
- Modify: `components/Navbar.tsx`

- [ ] **Step 1: Write the mobile nav component**

Create `components/MobileNav.tsx`:

```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const MOBILE_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Case Studies", href: "/case-studies" },
  { label: "Contact", href: "/contact" },
];

export default function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="relative md:hidden">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-label={open ? "Close menu" : "Open menu"}
        className="flex size-9 shrink-0 items-center justify-center rounded-sm border border-border-subtle bg-paper shadow-button"
      >
        <span className="flex flex-col items-center gap-[3px]">
          <span className="block h-[1.5px] w-4 bg-ink" />
          <span className="block h-[1.5px] w-4 bg-ink" />
          <span className="block h-[1.5px] w-4 bg-ink" />
        </span>
      </button>

      {open && (
        <div className="absolute right-0 top-[calc(100%+8px)] z-50 flex w-[220px] flex-col gap-1 rounded-sm border border-border-subtle bg-paper p-2 shadow-button">
          {MOBILE_LINKS.map((link) => {
            const isActive =
              link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`rounded-sm px-3 py-2 font-body text-[16px] tracking-[-0.16px] text-ink ${
                  isActive ? "bg-surface font-medium" : "font-medium opacity-50"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Wire it into Navbar**

Open `components/Navbar.tsx`. Add the import:

```tsx
import MobileNav from "@/components/MobileNav";
```

Find the buttons row (the `<div className="flex shrink-0 items-center gap-3">` containing the "Book 15 Mins Call" button and the "About Me" link) and add `<MobileNav />` as its first child:

```tsx
<div className="flex shrink-0 items-center gap-3">
  <MobileNav />
  <button
    type="button"
    className="hidden h-9 shrink-0 items-center justify-center gap-2 rounded-sm border border-border-subtle bg-paper px-3 py-2 font-body text-[14px] font-medium tracking-[-0.28px] text-ink shadow-button sm:flex"
  >
    Book 15 Mins Call
    <Image
      src="/images/call-icon.png"
      alt=""
      width={17}
      height={14}
      className="h-[14px] w-[17px] object-cover"
    />
  </button>
  <Link
    href="/about"
    className="flex h-9 shrink-0 items-center justify-center gap-2 rounded-sm border border-white bg-black px-3 py-2 font-body text-[14px] font-medium tracking-[-0.28px] text-paper shadow-[0px_6px_6px_-3px_rgba(0,0,0,0.25),0px_0px_0px_2px_rgba(0,0,0,0.15)]"
    style={{
      backgroundImage:
        "radial-gradient(ellipse 8.3px 3.6px at 50% 0%, rgba(255,255,255,0.3) 11.881%, rgba(255,255,255,0) 100%)",
    }}
  >
    About Me
  </Link>
</div>
```

- [ ] **Step 3: Verify**

```bash
npx tsc --noEmit
npm run build
```

Both should succeed. Then manually verify in a browser: run `npm run dev`, resize below the `md` breakpoint (or use device toolbar at e.g. 390px width), confirm the hamburger button appears, clicking it opens a dropdown with Home/About/Case Studies/Contact, clicking a link navigates and closes the dropdown, clicking the hamburger again while open closes it.

- [ ] **Step 4: Commit**

```bash
git add components/MobileNav.tsx components/Navbar.tsx
git commit -m "feat: add mobile navigation menu to Navbar"
```

---

### Task 3: Migrate the homepage to `SiteSidebar`

**Files:**
- Modify: `app/page.tsx`
- Modify: `components/sections/Hero.tsx`
- Modify: `components/sections/AiFluencyCallout.tsx`
- Modify: `components/sections/Capabilities.tsx`
- Modify: `components/sections/Process.tsx`
- Modify: `components/sections/Result.tsx`
- Modify: `components/sections/TechStack.tsx`
- Modify: `components/sections/WaysToWork.tsx`
- Modify: `components/sections/Cta.tsx`
- Modify: `components/sections/Faq.tsx`

- [ ] **Step 1: Remove `HeroSidebar` from `Hero.tsx`**

Open `components/sections/Hero.tsx`. Remove the import `import HeroSidebar from "@/components/HeroSidebar";` and remove the `<HeroSidebar />` line. The file should read:

```tsx
import Image from "next/image";
import ChatWidget from "@/components/ChatWidget";

export default function Hero() {
  return (
    <section className="flex w-full items-start justify-between">
      <div className="flex w-full flex-1 flex-col items-end">
        <div className="flex h-[814px] w-full items-center justify-center overflow-clip px-6 py-3">
          <div className="relative h-full w-full overflow-clip rounded-lg bg-gradient-to-b from-[#efefef] to-[#898989]">
            <Image
              src="/images/hero-bg.png"
              alt="Illustrated garden landscape at sunrise"
              fill
              priority
              sizes="(min-width: 768px) 80vw, 100vw"
              className="object-cover"
            />

            <ChatWidget />

            <div className="absolute left-1/2 top-[714px] w-[337px] -translate-x-1/2 text-center font-body text-[16px] leading-[1.4] tracking-[-0.16px] text-paper">
              <p>
                You can send me a message via this popup with the tag{" "}
                <span className="rounded-[8px] border border-white/10 bg-white/20 px-1.5 py-0.5 text-[14px] tracking-[-0.14px] opacity-70">
                  @quadri
                </span>{" "}
                or ask anything about my service.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Remove `SidebarSpacer` from the 7 remaining homepage sections**

For each of these files, remove the line `import SidebarSpacer from "@/components/SidebarSpacer";` and remove the `<SidebarSpacer />` line (leaving the rest of each file untouched — the section's single remaining child div still renders at full width once its sibling spacer column is gone):

- `components/sections/Capabilities.tsx`
- `components/sections/Process.tsx`
- `components/sections/Result.tsx`
- `components/sections/TechStack.tsx`
- `components/sections/WaysToWork.tsx`
- `components/sections/Cta.tsx`
- `components/sections/Faq.tsx`

For example, in `components/sections/Result.tsx`, this:

```tsx
import Image from "next/image";
import Link from "next/link";

import SidebarSpacer from "@/components/SidebarSpacer";

export default function Result() {
  return (
    <section
      id="result"
      className="flex w-full items-start justify-between"
    >
      <SidebarSpacer />

      <div className="flex w-full flex-1 flex-col items-start gap-12 py-14">
```

becomes:

```tsx
import Image from "next/image";
import Link from "next/link";

export default function Result() {
  return (
    <section
      id="result"
      className="flex w-full items-start justify-between"
    >
      <div className="flex w-full flex-1 flex-col items-start gap-12 py-14">
```

Apply the same import-removal + single-line-removal to the other 6 files (the exact surrounding code differs per file, but the pattern — delete the `SidebarSpacer` import line and delete the `<SidebarSpacer />` line — is identical in each).

- [ ] **Step 3: Fix `AiFluencyCallout`'s hardcoded left padding**

`AiFluencyCallout.tsx` doesn't use `SidebarSpacer`, but hardcodes `md:pl-[269px]` to visually fake the same left-indent everywhere else got from a real sidebar column. Now that a real `SiteSidebar` will sit to its left at the page level, this padding would double the indent. Open `components/sections/AiFluencyCallout.tsx` and change:

```tsx
<section className="flex w-full items-center bg-accent py-6 pl-6 pr-6 md:py-12 md:pl-[269px] md:pr-20">
```

to:

```tsx
<section className="flex w-full items-center bg-accent px-6 py-6 md:py-12 md:pr-20">
```

(`pl-6 pr-6` merged into `px-6`; `md:pl-[269px]` removed entirely since the real sidebar now occupies that space; `md:pr-20` kept unchanged.)

- [ ] **Step 4: Update `app/page.tsx` to compose `SiteSidebar` once**

Open `app/page.tsx`. Add the import:

```tsx
import SiteSidebar from "@/components/SiteSidebar";
```

Wrap the existing `<main>` in a new flex row alongside `<SiteSidebar />`:

```tsx
export default function Home() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-paper">
      <Navbar />
      <div className="flex w-full flex-1">
        <SiteSidebar />
        <main className="flex w-full flex-1 flex-col">
          <Hero />
          <RevealOnScroll>
            <AiFluencyCallout />
          </RevealOnScroll>
          <RevealOnScroll>
            <Capabilities />
          </RevealOnScroll>
          <RevealOnScroll>
            <DomainStrip />
          </RevealOnScroll>
          <RevealOnScroll>
            <Process />
          </RevealOnScroll>
          <RevealOnScroll>
            <Result />
          </RevealOnScroll>
          <RevealOnScroll>
            <TechStack />
          </RevealOnScroll>
          <RevealOnScroll>
            <WaysToWork />
          </RevealOnScroll>
          <RevealOnScroll>
            <Faq />
          </RevealOnScroll>
          <RevealOnScroll>
            <Cta />
          </RevealOnScroll>
        </main>
      </div>
      <Footer />
    </div>
  );
}
```

(Only the `<main>`'s wrapping changed — it's now nested inside a new `<div className="flex w-full flex-1">` alongside `<SiteSidebar />`, instead of being a direct child of the outer page `<div>`. All the section contents inside `<main>` are unchanged.)

- [ ] **Step 5: Verify**

```bash
npx tsc --noEmit
npm run build
```

Then run `npm run dev` and visually check the homepage at both desktop (≥1280px) and mobile (390px) widths: confirm the sidebar renders once, stays pinned while scrolling the whole page (not just through the Hero), correctly bolds nothing (you're on `/`), and no section's content looks double-indented or misaligned compared to before.

- [ ] **Step 6: Commit**

```bash
git add app/page.tsx components/sections/Hero.tsx components/sections/AiFluencyCallout.tsx components/sections/Capabilities.tsx components/sections/Process.tsx components/sections/Result.tsx components/sections/TechStack.tsx components/sections/WaysToWork.tsx components/sections/Cta.tsx components/sections/Faq.tsx
git commit -m "feat: migrate homepage to shared sticky SiteSidebar"
```

---

### Task 4: Migrate the About page to `SiteSidebar`

**Files:**
- Modify: `app/about/page.tsx`
- Modify: `components/sections/AboutIntro.tsx`
- Modify: `components/sections/AboutApproach.tsx`
- Modify: `components/sections/AboutSkills.tsx`
- Modify: `components/sections/AboutClients.tsx`

- [ ] **Step 1: Remove `SidebarSpacer` from the 4 About section components**

Each of these currently renders its own `<SidebarSpacer />` internally, on top of the page also rendering a top-level `PageSidebar` — meaning About page content is currently double-indented (269px for the real sidebar + another 269px for each section's own decorative spacer). Removing these both matches the new architecture and fixes that pre-existing double-indent bug.

For each of `components/sections/AboutIntro.tsx`, `components/sections/AboutApproach.tsx`, `components/sections/AboutSkills.tsx`, `components/sections/AboutClients.tsx`: remove the line `import SidebarSpacer from "@/components/SidebarSpacer";` and remove the `<SidebarSpacer />` line, same mechanical pattern as Task 3 Step 2.

- [ ] **Step 2: Update `app/about/page.tsx`**

Replace the file's contents:

```tsx
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SiteSidebar from "@/components/SiteSidebar";
import ContactForm from "@/components/ContactForm";
import AboutIntro from "@/components/sections/AboutIntro";
import AboutApproach from "@/components/sections/AboutApproach";
import AboutSkills from "@/components/sections/AboutSkills";
import AboutClients from "@/components/sections/AboutClients";
import { RevealOnScroll } from "@/components/RevealOnScroll";

export default function AboutPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-paper">
      <Navbar />
      <div className="flex w-full flex-1">
        <SiteSidebar />
        <main className="flex w-full flex-1 flex-col">
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
        </main>
      </div>
      <Footer />
    </div>
  );
}
```

(The `ABOUT_LINKS` array and `PageSidebar` import are gone; `SiteSidebar` replaces `PageSidebar` and takes no props. The existing `id="intro"`/`"approach"`/`"skills"`/`"clients"`/`"contact"` wrapper divs are left in place — harmless, nothing currently links to them, no need to remove them as part of this change.)

- [ ] **Step 3: Verify**

```bash
npx tsc --noEmit
npm run build
```

Run `npm run dev`, visually check `/about` at desktop and mobile widths: sidebar renders once, stays pinned through the whole page, "About" is bolded in the sidebar, no section looks double-indented (this is the specific bug this task fixes — compare against the pre-change screenshot if unsure).

- [ ] **Step 4: Commit**

```bash
git add app/about/page.tsx components/sections/AboutIntro.tsx components/sections/AboutApproach.tsx components/sections/AboutSkills.tsx components/sections/AboutClients.tsx
git commit -m "feat: migrate About page to shared sticky SiteSidebar"
```

---

### Task 5: Migrate the Contact page to `SiteSidebar`

**Files:**
- Modify: `app/contact/page.tsx`

- [ ] **Step 1: Restructure the page**

Replace the file's contents:

```tsx
import Image from "next/image";
import Navbar from "@/components/Navbar";
import SiteSidebar from "@/components/SiteSidebar";
import ContactForm from "@/components/ContactForm";
import { AccordionItem } from "@/components/AccordionItem";
import Footer from "@/components/Footer";
import { FAQ_ITEMS } from "@/lib/faq-data";

export default function ContactPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-paper">
      <Navbar />
      <div className="flex w-full flex-1">
        <SiteSidebar />
        <main className="flex w-full flex-1 flex-col">
          <section className="flex w-full items-end justify-between gap-6 border-b border-border-subtle px-6 py-14">
            <h1 className="font-heading text-[32px] leading-tight tracking-[-0.32px] text-ink md:text-[56px] md:leading-[normal] md:tracking-[-0.56px]">
              Let&rsquo;s start a
              <br />
              conversation
            </h1>
            <p className="hidden whitespace-nowrap font-body text-[18px] font-medium tracking-[-0.18px] text-ink md:block">
              [ CONTACT ]
            </p>
          </section>

          <section id="message-form" className="flex w-full flex-col items-start gap-12 px-6 py-14">
            <div className="flex w-full flex-col gap-0.5">
              <p className="font-body text-[14px] tracking-[-0.14px] text-ink/50">
                GET IN TOUCH
              </p>
              <h2 className="font-heading text-[32px] leading-tight tracking-[-0.32px] text-ink md:text-[56px] md:leading-[normal] md:tracking-[-0.56px]">
                Send me a Message
              </h2>
            </div>

            <div className="flex w-full flex-col items-center gap-10 lg:flex-row lg:items-start">
              <div className="flex w-full flex-1 flex-col items-start gap-12">
                <ContactForm />

                <div className="flex w-full max-w-[576px] items-center justify-between border-t border-border-subtle pt-8">
                  <div className="flex flex-col gap-2">
                    <p className="font-body text-[16px] font-medium tracking-[-0.16px] text-ink/50">
                      Email
                    </p>
                    <p className="font-body text-[16px] leading-[1.4] tracking-[-0.16px] text-ink">
                      hello@quadriismail.com
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <p className="font-body text-[16px] font-medium tracking-[-0.16px] text-ink/50">
                      Response time
                    </p>
                    <p className="font-body text-[16px] leading-[1.4] tracking-[-0.16px] text-ink">
                      24 hours
                    </p>
                  </div>
                </div>
              </div>

              <div className="relative h-[320px] w-full shrink-0 overflow-hidden rounded-2xl sm:h-[420px] lg:h-[518px] lg:w-[507px]">
                <Image
                  src="/images/contact-portrait.png"
                  alt="Portrait of Quadri, available for new projects"
                  fill
                  sizes="(min-width: 1024px) 507px, 100vw"
                  className="object-cover"
                />
              </div>
            </div>
          </section>

          <section id="faq" className="flex w-full flex-col items-start gap-12 px-6 py-14">
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

Compared to the original: `PageSidebar`/`SIDEBAR_LINKS` are gone, `SiteSidebar` is hoisted to wrap the whole `<main>` once via the new outer flex row, and the two sections that used to each render their own `<PageSidebar links={SIDEBAR_LINKS} />` now just render their content directly (className simplified from `flex w-full items-start justify-between` + inner `flex-1` wrapper div down to a single `flex w-full flex-col gap-12 px-6 py-14` on the `<section>` itself, since there's no longer a sidebar sibling to lay out against). The header section (previously full-width with no sidebar at all) now consistently sits beside the persistent sidebar like every other section on the page.

- [ ] **Step 2: Verify**

```bash
npx tsc --noEmit
npm run build
```

Run `npm run dev`, visually check `/contact` at desktop and mobile widths: one sidebar, pinned through the whole page including the header, "Contact" bolded in the sidebar, form and FAQ sections render correctly.

- [ ] **Step 3: Commit**

```bash
git add app/contact/page.tsx
git commit -m "feat: migrate Contact page to shared sticky SiteSidebar"
```

---

### Task 6: Migrate the Case Studies list page to `SiteSidebar`

**Files:**
- Modify: `app/case-studies/page.tsx`

- [ ] **Step 1: Swap `PageSidebar` for `SiteSidebar`**

Open `app/case-studies/page.tsx`. Change the import:

```tsx
import PageSidebar from "@/components/PageSidebar";
```

to:

```tsx
import SiteSidebar from "@/components/SiteSidebar";
```

Remove the now-unused `SIDEBAR_LINKS` constant:

```tsx
const SIDEBAR_LINKS = [{ label: "Case Studies", href: "#list" }];
```

Change the render call from:

```tsx
<PageSidebar links={SIDEBAR_LINKS} />
```

to:

```tsx
<SiteSidebar />
```

The full file should read:

```tsx
"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SiteSidebar from "@/components/SiteSidebar";
import CaseStudyCard from "@/components/CaseStudyCard";
import { CASE_STUDIES, type CaseStudy } from "@/lib/case-studies";

const FILTERS = ["All", "FinTech", "AI-native", "GovTech"] as const;
type Filter = (typeof FILTERS)[number];

export default function CaseStudiesPage() {
  const [filter, setFilter] = useState<Filter>("All");

  const visible: CaseStudy[] =
    filter === "All" ? CASE_STUDIES : CASE_STUDIES.filter((cs) => cs.category === filter);

  return (
    <div className="flex min-h-screen w-full flex-col bg-paper">
      <Navbar />
      <main className="flex w-full flex-1">
        <SiteSidebar />
        <div id="list" className="flex w-full flex-1 flex-col gap-12 px-6 py-14 md:px-6 md:py-14">
          <div className="flex items-end justify-between whitespace-nowrap px-6 text-ink">
            <h1 className="font-heading text-[32px] tracking-[-0.32px] md:text-[56px] md:tracking-[-0.56px]">
              Case Studies
            </h1>
            <span className="font-body text-[18px] font-medium tracking-[-0.18px]">
              [ WORK ]
            </span>
          </div>
          <div className="h-px w-full bg-border-subtle" />
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
        </div>
      </main>
      <Footer />
    </div>
  );
}
```

Note this page already composed its sidebar once at the top of `<main>` (not per-section), so this change is a straight swap — no double-indent bug here to fix, unlike About.

- [ ] **Step 2: Verify**

```bash
npx tsc --noEmit
npm run build
```

Run `npm run dev`, visually check `/case-studies`: sidebar pinned, "Case Studies" bolded, category filter pills still work (All/FinTech/AI-native/GovTech clicking still filters the list — this is unrelated client-side state, unaffected by the sidebar change, just confirm it still works).

- [ ] **Step 3: Commit**

```bash
git add app/case-studies/page.tsx
git commit -m "feat: migrate Case Studies list page to shared sticky SiteSidebar"
```

---

### Task 7: Migrate the Case Study Detail page to `SiteSidebar`

**Files:**
- Modify: `app/case-studies/[slug]/page.tsx`

- [ ] **Step 1: Restructure the page**

Replace the file's contents:

```tsx
import { notFound } from "next/navigation";
import Link from "next/link";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SiteSidebar from "@/components/SiteSidebar";
import { AccordionItem } from "@/components/AccordionItem";
import { CASE_STUDIES, getCaseStudyBySlug } from "@/lib/case-studies";
import { FAQ_ITEMS } from "@/lib/faq-data";

const NARRATIVE_SECTIONS = [
  { heading: "Problem", id: "problem" },
  { heading: "Solution", id: "solution" },
  { heading: "Concepting", id: "concepting" },
  { heading: "Design", id: "design" },
  { heading: "Result", id: "result-narrative" },
] as const;

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
      <div className="flex w-full flex-1">
        <SiteSidebar />
        <main className="flex w-full flex-1 flex-col">
          {/* Header */}
          <section className="flex w-full flex-col gap-12 border-b border-border-subtle pt-14 shadow-[0_4px_4px_0_rgba(0,0,0,0.25)]">
            <div className="flex items-end justify-between px-6">
              <h1 className="relative font-heading text-[32px] tracking-[-0.32px] text-ink md:text-[56px] md:tracking-[-0.56px]">
                {caseStudy.title}
              </h1>
              <span className="hidden whitespace-nowrap font-body text-[18px] font-medium tracking-[-0.18px] text-ink md:block">
                [&nbsp;&nbsp;CASE STUDY&nbsp;&nbsp;]
              </span>
            </div>
            <div className="h-px w-full bg-border-subtle" />
          </section>

          {/* About Project */}
          <section className="flex w-full flex-col gap-12 py-14 shadow-[0_4px_4px_0_rgba(0,0,0,0.25)]">
            <div className="flex flex-col items-start gap-10 px-6 md:flex-row md:justify-center">
              <div className="flex w-full flex-1 flex-col gap-8">
                <div className="flex flex-col gap-3.5">
                  <div className="relative flex flex-col gap-2 border-b border-border-subtle pb-6">
                    <h2 className="font-heading text-[32px] tracking-[-0.32px] text-ink md:text-[48px]">
                      About Project
                    </h2>
                    <p className="max-w-[541px] whitespace-pre-line font-body text-[16px] leading-[1.4] tracking-[-0.16px] text-ink/50">
                      {/* TODO: replace with real about-project copy for {caseStudy.slug} — Figma
                      only designed narrative content for an unrelated example project */}
                      Project overview coming soon.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 border-b border-border-subtle pb-3.5 font-body text-[16px] tracking-[-0.16px]">
                    <span className="font-medium text-ink">Category:</span>
                    <span className="text-ink/50">{caseStudy.category}</span>
                  </div>
                  {/* TODO: replace with real client/duration once available */}
                  <div className="flex items-center gap-2 border-b border-border-subtle pb-3.5 font-body text-[16px] tracking-[-0.16px]">
                    <span className="font-medium text-ink">Client:</span>
                    <span className="text-ink/50">Confidential</span>
                  </div>
                  <div className="flex items-center gap-2 border-b border-border-subtle pb-3.5 font-body text-[16px] tracking-[-0.16px]">
                    <span className="font-medium text-ink">Duration:</span>
                    <span className="text-ink/50">Coming soon</span>
                  </div>
                  <div className="flex items-center gap-2 border-b border-border-subtle pb-3.5 font-body text-[16px] tracking-[-0.16px]">
                    <span className="font-medium text-ink">Location:</span>
                    <span className="text-ink/50">Remote</span>
                  </div>
                </div>

                {/* TODO: link to real live project URL once available */}
                <a
                  href="#"
                  className="inline-flex w-fit items-center justify-center gap-2 rounded-sm border border-paper bg-ink px-3 py-2 font-body text-[14px] font-medium tracking-[-0.14px] text-paper shadow-button"
                >
                  Live Website
                </a>
              </div>

              <div className="h-[280px] w-full flex-1 shrink-0 overflow-clip rounded-md border border-border-subtle bg-surface shadow-button md:h-auto md:self-stretch">
                {/* TODO: replace with real project screenshot for {caseStudy.slug} */}
              </div>
            </div>
          </section>

          {/* Narrative sections */}
          <section className="flex w-full flex-col gap-12 py-14 shadow-button">
            {NARRATIVE_SECTIONS.map(({ heading, id }) => (
              <div key={id} id={id} className="flex flex-col gap-8 px-6">
                <h2 className="font-heading text-[32px] tracking-[-0.32px] text-ink md:text-[48px]">
                  {heading}
                </h2>
                <p className="max-w-[971px] font-body text-[18px] font-medium leading-[1.6] tracking-[-0.18px] text-ink/50 md:text-[24px] md:tracking-[-0.24px]">
                  {/* TODO: replace with real case study writeup for {caseStudy.slug} — Figma
                  only designed narrative content for an unrelated example project */}
                  Case study details coming soon.
                </p>
              </div>
            ))}
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

Compared to the original: `PageSidebar`/`SidebarSpacer`/`SIDEBAR_LINKS` are all gone; `SiteSidebar` wraps the entire `<main>` once via the new outer flex row; each of the 5 `<section>`s drops its per-section sidebar/spacer sibling and simplifies from `flex w-full items-start justify-between` + inner wrapper div down to the content styling directly on the `<section>` (e.g. `flex w-full flex-col gap-12 py-14 ...`). All existing `id` attributes (`problem`, `solution`, `concepting`, `design`, `result-narrative`, `more-works`, `faq`), copy, TODO comments, and placeholder content are unchanged.

- [ ] **Step 2: Verify**

```bash
npx tsc --noEmit
npm run build
```

Expected: build succeeds and still lists 3 static pages under `/case-studies/[slug]` (ryno-finance, linqart, federal-pms) via `generateStaticParams`. Run `npm run dev`, visually check `/case-studies/ryno-finance`: sidebar pinned through the whole page, "Case Studies" bolded, all 5 sections (header, about project, narrative, more works, FAQ) render with correct content, "More Works" links to the other 2 case studies still work.

- [ ] **Step 3: Commit**

```bash
git add "app/case-studies/[slug]/page.tsx"
git commit -m "feat: migrate Case Study Detail page to shared sticky SiteSidebar"
```

---

### Task 8: Delete the old sidebar components and the scroll-spy hook

**Files:**
- Delete: `components/HeroSidebar.tsx`
- Delete: `components/PageSidebar.tsx`
- Delete: `components/SidebarSpacer.tsx`
- Delete: `hooks/useScrollSpy.ts`

- [ ] **Step 1: Confirm nothing still references them**

```bash
grep -rn "HeroSidebar\|PageSidebar\|SidebarSpacer\|useScrollSpy" app/ components/ hooks/ --include="*.tsx" --include="*.ts"
```

Expected: no output (every consumer was migrated in Tasks 3–7). If this prints any matches, stop and fix that file before proceeding — do not delete a component that's still imported somewhere.

- [ ] **Step 2: Delete the files**

```bash
rm components/HeroSidebar.tsx components/PageSidebar.tsx components/SidebarSpacer.tsx hooks/useScrollSpy.ts
```

- [ ] **Step 3: Verify**

```bash
npx tsc --noEmit
npm run build
```

Both must succeed with the files gone — this proves nothing was still depending on them.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "chore: remove HeroSidebar, PageSidebar, SidebarSpacer, and useScrollSpy"
```

---

### Task 9: Full-site QA pass

**Files:**
- None (verification task; fix discrepancies found in the relevant page/component files from earlier tasks)

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

For each of the 6 pages with a sidebar (`/`, `/about`, `/case-studies`, `/case-studies/ryno-finance`, `/case-studies/linqart`, `/case-studies/federal-pms`, `/contact`), verify at both widths:

- Desktop: `SiteSidebar` renders exactly once per page, visibly stays pinned in place while scrolling the entire page (not just part of it), correctly bolds the current page's link (or no link, on the homepage), no content looks double-indented or misaligned.
- Mobile: no sidebar column shown (correctly hidden below `md`), the `MobileNav` hamburger appears in the Navbar, opens/closes correctly, and all four links (Home, About, Case Studies, Contact) navigate correctly.

- [ ] **Step 3: Fix any discrepancies found**

If a page's spacing, alignment, or sidebar behavior doesn't match what earlier tasks intended, fix it in the relevant file from that task.

- [ ] **Step 4: Update the README**

Modify `README.md`'s project structure section (if it references `HeroSidebar`, `PageSidebar`, or `SidebarSpacer` by name) to reflect the new `SiteSidebar/MobileNav` components instead.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "fix: site navigation rework QA pass and README update"
```

(Skip the commit if no discrepancies were found and the README needed no changes.)
