import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";

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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const caseStudy = getCaseStudyBySlug(slug);
  if (!caseStudy) {
    return {};
  }
  return {
    title: `${caseStudy.title} — Quadri Ismail`,
    description: caseStudy.summary,
  };
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
      caseStudy.obstaclesHtml ||
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
              <p className="w-full font-body text-[18px] font-medium leading-[1.6] tracking-[-0.18px] text-ink/50 md:text-[24px] md:tracking-[-0.24px]">
                {caseStudy.summary}
              </p>
            </div>
            <CaseStudyImage
              src={caseStudy.heroImage}
              alt={caseStudy.title}
              label="Hero image — 1200×675"
              className="mx-auto aspect-video w-[80%]"
              sizes="(min-width: 768px) calc((100vw - 269px) * 0.8), 80vw"
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
              team={caseStudy.team}
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

            {caseStudy.obstaclesHtml && (
              <div className="flex flex-col gap-8 px-6">
                <h2 className="font-heading text-[32px] tracking-[-0.32px] text-ink md:text-[48px]">
                  Obstacles
                </h2>
                <ProseHtml html={caseStudy.obstaclesHtml} />
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
