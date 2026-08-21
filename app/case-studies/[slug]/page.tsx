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
