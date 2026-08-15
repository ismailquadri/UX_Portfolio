const ENGAGEMENT_MODES = [
  {
    title: "Full-Time Roles",
    description:
      "Embedded product designer shipping daily alongside your engineering team. Best for teams building complex systems that need sustained design thinking.",
  },
  {
    title: "Contract / Fractional",
    description:
      "Scoped sprints or ongoing part-time partnership. Design systems, critical flows, or zero-to-one product definition - without a full headcount.",
  },
  {
    title: "Advisory & Mentorship",
    description:
      "Design reviews, portfolio coaching, or hands-on pairing for junior designers leveling up. Structured or ad-hoc.",
  },
];

export default function WaysToWork() {
  return (
    <section id="pricing" className="flex w-full items-start justify-between">
      <div
        aria-hidden
        className="hidden w-[269px] shrink-0 self-stretch border-r border-border-subtle bg-surface md:block"
      />

      <div className="flex w-full flex-1 flex-col items-center gap-16 px-6 py-20 md:px-[120px]">
        <div className="flex w-full flex-col items-center">
          <h2 className="font-heading text-[40px] leading-normal text-ink">
            Ways to Work Together
          </h2>
        </div>

        <div className="flex w-full flex-col items-start gap-6 md:flex-row">
          {ENGAGEMENT_MODES.map((mode) => (
            <div
              key={mode.title}
              className="flex w-full flex-1 flex-col items-start gap-3 self-stretch rounded-md bg-surface p-4"
            >
              <p className="w-full font-body text-[18px] font-semibold text-ink">
                {mode.title}
              </p>
              <p className="w-full font-body text-[15px] text-muted">
                {mode.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
