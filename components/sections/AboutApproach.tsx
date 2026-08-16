import SidebarSpacer from "@/components/SidebarSpacer";

const STEPS = [
  {
    number: "01",
    title: "Understand",
    description:
      "Get a clear picture of your product, users, and goals. No assumptions just real context.",
  },
  {
    number: "02",
    title: "Analyze",
    description:
      "Identify friction, gaps, and missed opportunities. Where users struggle is where design starts.",
  },
  {
    number: "03",
    title: "Design",
    description:
      "Create solutions that are clear, usable, and scalable. Not just visually good but practical.",
  },
  {
    number: "04",
    title: "Deliver",
    description:
      "Provide outputs that are ready to implement. No confusion, no extra translation needed.",
  },
];

export default function AboutApproach() {
  return (
    <section className="flex w-full items-start justify-between">
      <SidebarSpacer />

      <div className="flex w-full flex-1 flex-col items-start gap-12 py-14">
        <div className="flex w-full items-end justify-between px-6">
          <div className="relative flex items-center gap-2.5">
            <h2 className="relative font-heading text-[32px] leading-tight tracking-[-0.32px] text-ink md:text-[56px] md:leading-none md:tracking-[-0.56px]">
              <span className="block">My approach is simple —</span>
              <span className="relative z-10 block">
                <span className="absolute -left-2.5 top-1/2 -z-10 hidden h-[67px] w-[531px] -translate-y-1/2 rounded-full bg-gradient-to-r from-black/10 to-black/0 md:block" />
                understand first, design second.
              </span>
            </h2>
          </div>
          <p className="hidden shrink-0 whitespace-nowrap font-body text-[18px] tracking-[-0.18px] text-ink md:block">
            [ APPROACH ]
          </p>
        </div>

        <div className="flex w-full flex-col items-center gap-4 px-6">
          <p className="w-full font-body text-[16px] leading-[1.4] tracking-[-0.16px] text-muted">
            I start by getting a clear picture of your product, your users, and what
            you&rsquo;re trying to achieve.
            <br className="hidden md:block" />
            From there, I look for where things break, where users get stuck, and where
            opportunities are being missed.
          </p>
        </div>

        <div className="flex w-full flex-col gap-4 px-6">
          <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
            {STEPS.map((step) => (
              <div
                key={step.number}
                className="flex flex-col items-start justify-end gap-3.5 rounded-[24px] border border-border-subtle bg-white/70 p-6 shadow-[0px_4px_5px_0px_rgba(0,0,0,0.02),0px_2px_0px_0px_rgba(0,0,0,0.05)] backdrop-blur-[22px]"
              >
                <p className="w-full font-body text-[24px] font-medium leading-[1.6] tracking-[-0.24px] text-[#112527]">
                  [ {step.number} ] {step.title}
                </p>
                <p className="w-full font-body text-[16px] leading-[1.4] tracking-[-0.16px] text-muted">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
