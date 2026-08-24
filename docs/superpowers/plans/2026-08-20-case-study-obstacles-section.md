# Case Study Obstacles Section Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Wire the `## Obstacles` markdown section (added to the design spec) into the loader and detail page, so a case study can narrate stakeholder misalignment, legacy-system constraints, or competing priorities as prose between Process and Solution.

**Architecture:** Follows the exact pattern already used for `## Problem`/`## Outcome`/`## Close` (all plain prose sections rendered via the existing `ProseHtml` component) — no new component needed. `lib/case-studies.ts` gains one more optional field (`obstaclesHtml`) parsed the same way as `problemHtml`; `app/case-studies/[slug]/page.tsx` gains one more conditional block between Process and Solution, and `hasNarrative` gains one more OR clause.

**Tech Stack:** Same as the existing content system — no new dependencies.

---

### Task 1: Add `obstaclesHtml` to the case studies loader

**Files:**
- Modify: `lib/case-studies.ts`

- [ ] **Step 1: Add the field to the `CaseStudy` type**

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
  problemHtml?: string;
  processInsights?: string[];
  solutionItems?: CaseStudySolutionItem[];
  outcomeHtml?: string;
  closeHtml?: string;
};
```

Replace with:
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
  problemHtml?: string;
  processInsights?: string[];
  obstaclesHtml?: string;
  solutionItems?: CaseStudySolutionItem[];
  outcomeHtml?: string;
  closeHtml?: string;
};
```

- [ ] **Step 2: Parse the `## Obstacles` section in `getCaseStudyBySlug`**

Find:
```typescript
  const problem = getSection("Problem");
  const processSection = getSection("Process");
  const solution = getSection("Solution");
  const outcome = getSection("Outcome");
  const close = getSection("Close");
```

Replace with:
```typescript
  const problem = getSection("Problem");
  const processSection = getSection("Process");
  const obstacles = getSection("Obstacles");
  const solution = getSection("Solution");
  const outcome = getSection("Outcome");
  const close = getSection("Close");
```

Find:
```typescript
    problemHtml: problem ? nodesToHtml(problem.nodes) : undefined,
    processInsights: processSection ? nodesToPlainText(processSection.nodes) : undefined,
    solutionItems,
```

Replace with:
```typescript
    problemHtml: problem ? nodesToHtml(problem.nodes) : undefined,
    processInsights: processSection ? nodesToPlainText(processSection.nodes) : undefined,
    obstaclesHtml: obstacles ? nodesToHtml(obstacles.nodes) : undefined,
    solutionItems,
```

- [ ] **Step 3: Verify it builds**

Run: `npm run build`
Expected: Build succeeds — 12/12 pages, no type errors. `obstaclesHtml` isn't rendered anywhere yet (Task 2 does that), but it's a valid optional field so nothing should break.

- [ ] **Step 4: Commit**

```bash
git add lib/case-studies.ts
git commit -m "feat: parse Obstacles section in case studies loader"
```

---

### Task 2: Render the Obstacles section on the detail page

**Files:**
- Modify: `app/case-studies/[slug]/page.tsx`

- [ ] **Step 1: Add `obstaclesHtml` to the `hasNarrative` check**

Find:
```tsx
  const hasNarrative = Boolean(
    caseStudy.problemHtml ||
      (caseStudy.processInsights && caseStudy.processInsights.length > 0) ||
      (caseStudy.solutionItems && caseStudy.solutionItems.length > 0) ||
      (caseStudy.metrics && caseStudy.metrics.length > 0) ||
      caseStudy.outcomeHtml ||
      caseStudy.closeHtml
  );
```

Replace with:
```tsx
  const hasNarrative = Boolean(
    caseStudy.problemHtml ||
      (caseStudy.processInsights && caseStudy.processInsights.length > 0) ||
      caseStudy.obstaclesHtml ||
      (caseStudy.solutionItems && caseStudy.solutionItems.length > 0) ||
      (caseStudy.metrics && caseStudy.metrics.length > 0) ||
      caseStudy.outcomeHtml ||
      caseStudy.closeHtml
  );
```

- [ ] **Step 2: Add the Obstacles block between the Process block and the Solution block**

Find:
```tsx
            {caseStudy.processInsights && caseStudy.processInsights.length > 0 && (
              <div className="flex flex-col gap-8 px-6">
                <h2 className="font-heading text-[32px] tracking-[-0.32px] text-ink md:text-[48px]">
                  Process
                </h2>
                <ProcessInsights items={caseStudy.processInsights} />
              </div>
            )}

            {caseStudy.solutionItems && caseStudy.solutionItems.length > 0 && (
```

Replace with:
```tsx
            {caseStudy.processInsights && caseStudy.processInsights.length > 0 && (
              <div className="flex flex-col gap-8 px-6">
                <h2 className="font-heading text-[32px] tracking-[-0.32px] text-ink md:text-[48px]">
                  Process
                </h2>
                <ProcessInsights items={caseStudy.processInsights} />
              </div>
            )}

            {caseStudy.obstaclesHtml && (
              <div className="flex flex-col gap-8 px-6">
                <h2 className="font-heading text-[32px] tracking-[-0.32px] text-ink md:text-[48px]">
                  Obstacles
                </h2>
                <ProseHtml html={caseStudy.obstaclesHtml} />
              </div>
            )}

            {caseStudy.solutionItems && caseStudy.solutionItems.length > 0 && (
```

- [ ] **Step 3: Verify it builds**

Run: `npm run build`
Expected: Build succeeds — 12/12 pages, no type errors.

- [ ] **Step 4: Commit**

```bash
git add "app/case-studies/[slug]/page.tsx"
git commit -m "feat: render Obstacles section between Process and Solution"
```

---

### Task 3: Manual verification with a fixture

**Files:**
- Temporarily modify: `content/case-studies/ryno-finance.md` (reverted at the end of this task)

- [ ] **Step 1: Temporarily add an `## Obstacles` section to `content/case-studies/ryno-finance.md`**

Replace its contents with:

```markdown
---
slug: ryno-finance
title: "Ryno Finance - Compliance State Machine"
category: FinTech
summary: "Designing the queue where one click blocks or clears real money"
---

## Problem
Compliance reviewers were clearing or blocking real transactions from a queue with no risk context, leading to slow, inconsistent decisions.

## Process
- Interviewed 6 reviewers to map decision fatigue points
- Found that risk signals were scattered across 4 separate tools

## Obstacles
Engineering had already committed to a legacy risk-scoring API that couldn't return signal confidence, only a pass/fail flag — which meant the "progressive disclosure" concept the research pointed to wasn't achievable as originally scoped. Rather than dropping the idea, we renegotiated the API contract with the platform team to add a confidence band, in exchange for shipping the UI in two phases instead of one. That tradeoff is why the rollout below is split into two distinct releases.

## Solution
### Progressive risk disclosure
Redesigned the queue to surface the top 3 risk signals inline, with detail on demand instead of upfront.
```

- [ ] **Step 2: Verify via build + curl**

Run: `npm run build && npm run start &`, wait for it to be ready on port 3000 (or use `PORT=3100` if 3000 is occupied by another worktree's server — check with `lsof -i :3000` first), then:

```bash
curl -s http://localhost:3000/case-studies/ryno-finance | grep -o "Obstacles"
```

Expected: At least one match (the `<h2>Obstacles</h2>` heading).

```bash
curl -s http://localhost:3000/case-studies/ryno-finance | grep -o "legacy risk-scoring API"
```

Expected: At least one match (the Obstacles prose).

Also visually confirm via the HTML that the Obstacles `<h2>` appears after the Process section's content and before the Solution `<h2>` — not before Process or after Solution.

Kill the server when done (`kill %1` or find and kill the `next-server`/`next start` process on the port you used).

- [ ] **Step 3: Revert the fixture**

```bash
git checkout -- content/case-studies/ryno-finance.md
```

Run: `git status`
Expected: Clean working tree.
