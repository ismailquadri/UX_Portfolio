import ProseHtml from "@/components/case-study/ProseHtml";
import type { CaseStudyMetric } from "@/lib/case-studies";

export default function OutcomeSection({
  metrics,
  html,
}: {
  metrics?: CaseStudyMetric[];
  html?: string;
}) {
  return (
    <div className="flex flex-col gap-8">
      {metrics && metrics.length > 0 && (
        <div className="flex flex-wrap gap-8 border-b border-border-subtle pb-8">
          {metrics.map((metric) => (
            <div key={metric.label} className="flex flex-col gap-1">
              <span className="font-heading text-[40px] tracking-[-0.4px] text-ink md:text-[56px]">
                {metric.value}
              </span>
              <span className="max-w-[220px] font-body text-[14px] tracking-[-0.14px] text-ink/50">
                {metric.label}
              </span>
            </div>
          ))}
        </div>
      )}
      {html && <ProseHtml html={html} />}
    </div>
  );
}
