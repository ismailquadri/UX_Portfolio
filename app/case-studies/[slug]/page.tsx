import { notFound } from "next/navigation";
import { Link } from "next-view-transitions";
import type { Metadata } from "next";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SiteSidebar from "@/components/SiteSidebar";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import Faq from "@/components/sections/Faq";
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
          <section className="flex w-full flex-col gap-6 border-b border-border-subtle pt-14 shadow-[0_4px_4px_0_rgba(0,0,0,0.25)]">
            <div className="flex flex-col items-center gap-4 px-[6%] text-center md:px-[10%]">
              <span className="whitespace-nowrap font-body text-[14px] font-medium tracking-[-0.14px] text-ink/50 md:text-[18px] md:tracking-[-0.18px]">
                [&nbsp;&nbsp;CASE STUDY&nbsp;&nbsp;]
              </span>
              <h1 className="relative font-heading text-[32px] tracking-[-0.32px] text-ink md:text-[56px] md:tracking-[-0.56px]">
                {caseStudy.title}
              </h1>
              <p className="max-w-[720px] font-body text-[18px] font-medium leading-[1.6] tracking-[-0.18px] text-ink/50 md:text-[24px] md:tracking-[-0.24px]">
                {caseStudy.summary}
              </p>
            </div>
            <div className="px-[6%] md:px-[10%]">
              <CaseStudyImage
                src={caseStudy.heroImage}
                alt={caseStudy.title}
                label="Hero image — 1200×675"
                aspect="video"
                parallax
                className="mx-auto w-full"
                sizes="(min-width: 768px) calc((100vw - 269px) * 0.9), 90vw"
              />
            </div>
            <div className="h-px w-full bg-border-subtle" />
          </section>

          {/* Context strip */}
          <RevealOnScroll>
            <section className="flex w-full flex-col gap-8 px-[6%] py-14 shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] md:px-[10%]">
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
          </RevealOnScroll>

          {/* Narrative */}
          <section className="flex w-full flex-col gap-12 py-14 shadow-button">
            {caseStudy.problemHtml && (
              <RevealOnScroll>
                <div className="flex flex-col gap-8 px-[6%] md:px-[10%]">
                  <h2 className="font-heading text-[32px] tracking-[-0.32px] text-ink md:text-[48px]">
                    Problem
                  </h2>
                  <ProseHtml html={caseStudy.problemHtml} />
                </div>
              </RevealOnScroll>
            )}

            {caseStudy.processInsights && caseStudy.processInsights.length > 0 && (
              <RevealOnScroll>
                <div className="flex flex-col gap-8 px-[6%] md:px-[10%]">
                  <h2 className="font-heading text-[32px] tracking-[-0.32px] text-ink md:text-[48px]">
                    Process
                  </h2>
                  <ProcessInsights items={caseStudy.processInsights} />
                </div>
              </RevealOnScroll>
            )}

            {caseStudy.obstaclesHtml && (
              <RevealOnScroll>
                <div className="flex flex-col gap-8 px-[6%] md:px-[10%]">
                  <h2 className="font-heading text-[32px] tracking-[-0.32px] text-ink md:text-[48px]">
                    Obstacles
                  </h2>
                  <ProseHtml html={caseStudy.obstaclesHtml} />
                </div>
              </RevealOnScroll>
            )}

            {caseStudy.solutionItems && caseStudy.solutionItems.length > 0 && (
              <RevealOnScroll>
                <div className="flex flex-col gap-8 px-[6%] md:px-[10%]">
                  <h2 className="font-heading text-[32px] tracking-[-0.32px] text-ink md:text-[48px]">
                    Solution
                  </h2>
                  <SolutionSection items={caseStudy.solutionItems} />
                </div>
              </RevealOnScroll>
            )}

            {((caseStudy.metrics && caseStudy.metrics.length > 0) ||
              caseStudy.outcomeHtml) && (
              <RevealOnScroll>
                <div className="flex flex-col gap-8 px-[6%] md:px-[10%]">
                  <h2 className="font-heading text-[32px] tracking-[-0.32px] text-ink md:text-[48px]">
                    Outcome
                  </h2>
                  <OutcomeSection metrics={caseStudy.metrics} html={caseStudy.outcomeHtml} />
                </div>
              </RevealOnScroll>
            )}

            {caseStudy.closeHtml && (
              <RevealOnScroll>
                <div className="flex flex-col gap-8 px-[6%] md:px-[10%]">
                  <h2 className="font-heading text-[32px] tracking-[-0.32px] text-ink md:text-[48px]">
                    Close
                  </h2>
                  <ProseHtml html={caseStudy.closeHtml} />
                </div>
              </RevealOnScroll>
            )}

            {!hasNarrative && (
              <div className="flex flex-col gap-2 px-[6%] md:px-[10%]">
                <p className="font-body text-[16px] tracking-[-0.16px] text-ink/50">
                  Full case study coming soon.
                </p>
              </div>
            )}
          </section>

          {/* More Works */}
          <RevealOnScroll>
          <section
            id="more-works"
            className="flex w-full flex-col gap-12 py-14 shadow-[0_4px_4px_0_rgba(0,0,0,0.25)]"
          >
            <div className="flex items-end justify-between px-[6%] md:px-[10%]">
              <h2 className="relative font-heading text-[32px] tracking-[-0.32px] text-ink md:text-[56px] md:tracking-[-0.56px]">
                More Works
              </h2>
            </div>

            <div className="flex flex-col items-center justify-center gap-8 px-[6%] py-10 md:px-[10%]">
              <div className="flex w-full flex-col items-center gap-4 md:flex-row">
                {otherCaseStudies.map((cs) => (
                  <Link
                    key={cs.slug}
                    href={`/case-studies/${cs.slug}`}
                    className="group relative flex h-[280px] w-full flex-1 items-end justify-center overflow-clip rounded-md border border-border-subtle bg-surface shadow-button md:h-[526px]"
                  >
                    {cs.heroImage && (
                      <>
                        <CaseStudyImage
                          src={cs.heroImage}
                          alt={cs.title}
                          label={`Preview — ${cs.title}`}
                          radius="sm"
                          className="absolute inset-0 h-full w-full transition-transform duration-300 group-hover:scale-105"
                          sizes="(min-width: 768px) 45vw, calc(100vw - 48px)"
                        />
                        {/* Gradient so the title and CTA stay legible over any preview shot */}
                        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-ink/40" />
                      </>
                    )}
                    <span
                      className={`absolute left-1/2 top-6 -translate-x-1/2 text-center font-body text-[16px] font-medium tracking-[-0.16px] md:top-8 ${cs.heroImage ? "text-paper" : "text-ink"}`}
                    >
                      {cs.title}
                    </span>
                    <span className="relative mb-6 inline-flex items-center justify-center gap-2 rounded-sm border border-white/10 bg-white/20 px-3 py-2 font-body text-[14px] font-medium tracking-[-0.14px] text-paper opacity-0 backdrop-blur transition-opacity group-hover:opacity-100">
                      See Study Case
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </section>
          </RevealOnScroll>

          {/* FAQ */}
          <RevealOnScroll>
            <Faq className="px-[6%] py-14 shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] md:px-[10%]" />
          </RevealOnScroll>
        </main>
      </div>
      <Footer />
    </div>
  );
}
