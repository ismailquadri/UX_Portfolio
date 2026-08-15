import { AccordionItem } from "@/components/AccordionItem";

const FAQS = [
  {
    question:
      "How do you usually approach a new design project from start to finish?",
    answer:
      "Every project begins with clarity understanding your goals, target users, and the problem you’re solving. From there, I move into UX flow mapping, wireframing, and high-fidelity UI design. Once the concept feels right, I prototype interactions and collaborate with your team until everything aligns perfectly.",
  },
];

export default function Faq() {
  return (
    <section id="faq" className="flex w-full items-start justify-between">
      <div className="hidden self-stretch w-[269px] shrink-0 border-r border-border-subtle bg-surface md:block" />

      <div className="flex w-full flex-1 flex-col items-start gap-12 px-6 py-14">
        <div className="flex w-full items-end justify-between gap-6">
          <div className="flex flex-1 items-center justify-between gap-6">
            <h2 className="font-heading text-[56px] leading-[normal] tracking-[-0.56px] text-ink">
              Things You Might Want to Know
            </h2>
            <p className="whitespace-nowrap font-body text-[18px] font-medium tracking-[-0.18px] text-ink">
              [ FREQUENTLY ASKED QUESTIONS ]
            </p>
          </div>
        </div>

        <div className="flex w-full flex-col items-start gap-4">
          {FAQS.map((faq) => (
            <AccordionItem
              key={faq.question}
              question={faq.question}
              answer={faq.answer}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
