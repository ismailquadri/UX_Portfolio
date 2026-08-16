import { AccordionItem } from "@/components/AccordionItem";
import SidebarSpacer from "@/components/SidebarSpacer";
import { FAQ_ITEMS } from "@/lib/faq-data";

export default function Faq() {
  return (
    <section id="faq" className="flex w-full items-start justify-between">
      <SidebarSpacer />

      <div className="flex w-full flex-1 flex-col items-start gap-12 px-6 py-14">
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
      </div>
    </section>
  );
}
