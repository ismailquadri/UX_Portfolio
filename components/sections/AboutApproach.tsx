const STEPS = [
  {
    number: "01",
    title: "Understand",
    description:
      "Learn what the product needs to do, who relies on it, and what constraints shape the work.",
  },
  {
    number: "02",
    title: "Focus",
    description:
      "Find the part of the workflow causing the most friction and agree where to focus.",
  },
  {
    number: "03",
    title: "Design",
    description:
      "Explore focused options, test the important interactions, and make the trade-offs visible.",
  },
  {
    number: "04",
    title: "Learn",
    description:
      "Use feedback from testing or early use to improve the experience and guide the next decision.",
  },
];

export default function AboutApproach() {
  return (
    <section className="flex w-full items-start justify-between">
      <div className="flex w-full flex-1 flex-col items-start gap-12 py-14">
        <div className="flex w-full items-end justify-between px-6">
          <div className="relative flex items-center gap-2.5">
            <h2 className="relative font-heading text-[32px] leading-tight tracking-[-0.32px] text-ink md:text-[56px] md:leading-none md:tracking-[-0.56px]">
              <span className="block">I understand the work first,</span>
              <span className="relative z-10 block">
                <span className="absolute -left-2.5 top-1/2 -z-10 hidden h-[67px] w-[531px] -translate-y-1/2 rounded-full bg-gradient-to-r from-black/10 to-black/0 md:block" />
                then design for it.
              </span>
            </h2>
          </div>
          <p className="hidden shrink-0 whitespace-nowrap font-body text-[18px] tracking-[-0.18px] text-ink md:block">
            [ APPROACH ]
          </p>
        </div>

        <div className="flex w-full flex-col items-center gap-4 px-6">
          <p className="w-full font-body text-[16px] leading-[1.4] tracking-[-0.16px] text-muted">
            I learn how the product is used, what the team is trying to change, and where the current workflow breaks down.
            <br className="hidden md:block" />
            Then I use that context to focus the problem, explore solutions, and make the next step easier for users and the team.
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
