import CaseStudyImage from "@/components/CaseStudyImage";
import type { CaseStudyProcessInsight } from "@/lib/case-studies";

export default function ProcessInsights({
  items,
}: {
  items: CaseStudyProcessInsight[];
}) {
  return (
    <ul className="flex max-w-[971px] flex-col gap-4">
      {items.map((item, index) => (
        <li key={`${item.text}-${index}`} className="flex flex-col gap-4">
          <div className="flex items-start gap-3 font-body text-[18px] font-medium leading-[1.6] tracking-[-0.18px] text-ink/50 md:text-[24px] md:tracking-[-0.24px]">
            <span
              className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-ink/30"
              aria-hidden="true"
            />
            <span>{item.text}</span>
          </div>
          {item.image && (
            <CaseStudyImage
              src={item.image}
              alt={item.text}
              label="Process insight image — 800×600"
              className="ml-[18px] h-[220px] w-full max-w-[600px] md:h-[280px]"
            />
          )}
        </li>
      ))}
    </ul>
  );
}
