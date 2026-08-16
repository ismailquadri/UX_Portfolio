import Link from "next/link";
import type { CaseStudy } from "@/lib/case-studies";

export default function CaseStudyCard({ caseStudy }: { caseStudy: CaseStudy }) {
  return (
    <article className="flex w-full flex-col items-center gap-6 md:flex-row md:gap-8">
      {/* TODO: replace with real case study thumbnail image */}
      <div className="flex h-[240px] w-full shrink-0 items-center justify-center rounded-sm border border-border-subtle bg-border-subtle md:h-[360px] md:w-[560px]">
        <p className="font-body text-[14px] text-[#555]">Thumbnail</p>
      </div>
      <div className="flex flex-1 flex-col items-start gap-4">
        <span className="w-fit rounded-full bg-ink px-3 py-1.5 font-body text-[12px] font-semibold tracking-[-0.12px] text-paper">
          {caseStudy.category}
        </span>
        <h3 className="w-full font-body text-[24px] font-semibold text-ink">
          {caseStudy.title}
        </h3>
        <p className="w-full font-body text-[16px] text-[#555]">{caseStudy.summary}</p>
        <Link
          href={`/case-studies/${caseStudy.slug}`}
          className="font-body text-[14px] font-medium text-ink underline decoration-solid [text-underline-position:from-font]"
        >
          {caseStudy.readLink} &rarr;
        </Link>
      </div>
    </article>
  );
}
