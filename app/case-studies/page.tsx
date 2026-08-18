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
