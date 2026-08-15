import { AccordionItem } from "@/components/AccordionItem";

const FAQS = [
  {
    question:
      "How do you usually approach a new design project from start to finish?",
    answer:
      "Every project begins with clarity understanding your goals, target users, and the problem you're solving. From there, I move into UX flow mapping, wireframing, and high-fidelity UI design. Once the concept feels right, I prototype interactions and collaborate with your team until everything aligns perfectly.",
  },
  {
    question:
      "What design tools and platforms do you typically use in your workflow?",
    answer:
      "I work primarily in Figma for design and prototyping, paired with Claude Code and Cursor for design-to-engineering handoff. This lets me move from concept to a working, production-ready build without losing fidelity along the way.",
  },
  {
    question:
      "How long does it usually take to complete a project or deliver an MVP?",
    answer:
      "Timelines depend on scope, but most MVPs take a few weeks from kickoff to launch. I work in focused sprints with regular check-ins so you always know where things stand and can adjust priorities as we go.",
  },
  {
    question: "Do you also handle development, or just design?",
    answer:
      "Both. I design and build, so what you see in Figma is what ships to production. That end-to-end ownership removes handoff friction and keeps the final product true to the original design intent.",
  },
  {
    question: "How does the payment process work for your services?",
    answer:
      "I typically work with a deposit upfront followed by milestone-based payments tied to project phases. For ongoing work, a simple monthly subscription covers continuous design and development support.",
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
