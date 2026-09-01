import { AccordionItem } from "@/components/AccordionItem";
import { FAQ_ITEMS, type FaqAudience, type FaqItem } from "@/lib/faq-data";

type FaqProps = {
  items?: FaqItem[];
  heading?: string;
  className?: string;
};

// "general" renders with no group label (it's the default, always-relevant
// set). "client" and "recruiter" get a small label so they read as a
// labeled subset rather than blending into the default FAQ.
const GROUP_ORDER: FaqAudience[] = ["general", "client", "recruiter"];
const GROUP_LABELS: Record<FaqAudience, string | null> = {
  general: null,
  client: "For Clients",
  recruiter: "For Recruiters & Hiring Managers",
};

export default function Faq({
  items = FAQ_ITEMS,
  heading = "Things You Might Want to Know",
  className = "px-6 py-14",
}: FaqProps) {
  const groups = GROUP_ORDER.map((audience) => ({
    audience,
    label: GROUP_LABELS[audience],
    items: items.filter((item) => (item.audience ?? "general") === audience),
  })).filter((group) => group.items.length > 0);

  return (
    <section id="faq" className="flex w-full items-start justify-between">
      <div className={`flex w-full flex-1 flex-col items-start gap-12 ${className}`}>
        <div className="flex w-full items-end justify-between gap-6">
          <div className="flex flex-1 items-center justify-between gap-6">
            <h2 className="font-heading text-[32px] leading-tight tracking-[-0.32px] text-ink md:text-[56px] md:leading-[normal] md:tracking-[-0.56px]">
              {heading}
            </h2>
            <p className="hidden whitespace-nowrap font-body text-[18px] font-medium tracking-[-0.18px] text-ink md:block">
              [ FREQUENTLY ASKED QUESTIONS ]
            </p>
          </div>
        </div>

        <div className="flex w-full flex-col items-start gap-8">
          {groups.map((group) => (
            <div key={group.audience} className="flex w-full flex-col items-start gap-4">
              {group.label && (
                <p className="font-body text-[12px] font-medium uppercase tracking-[0.06em] text-ink/40">
                  {group.label}
                </p>
              )}
              {group.items.map((faq) => (
                <AccordionItem
                  key={faq.question}
                  question={faq.question}
                  answer={faq.answer}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
