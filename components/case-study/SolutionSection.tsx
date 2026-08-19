import CaseStudyImage from "@/components/CaseStudyImage";
import ProseHtml from "@/components/case-study/ProseHtml";
import type { CaseStudySolutionItem } from "@/lib/case-studies";

export default function SolutionSection({
  items,
}: {
  items: CaseStudySolutionItem[];
}) {
  return (
    <div className="flex flex-col gap-12">
      {items.map((item) => (
        <div key={item.heading} className="flex flex-col gap-6">
          <h3 className="font-heading text-[24px] tracking-[-0.24px] text-ink md:text-[32px]">
            {item.heading}
          </h3>
          <CaseStudyImage
            src={item.image}
            alt={item.heading}
            label={`Solution screenshot — 800×600 (${item.heading})`}
            className="h-[280px] w-full md:h-[400px]"
          />
          <ProseHtml html={item.html} />
        </div>
      ))}
    </div>
  );
}
