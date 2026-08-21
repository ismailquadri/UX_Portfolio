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
