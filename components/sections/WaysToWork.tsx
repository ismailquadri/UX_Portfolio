const ENGAGEMENT_MODES = [
  {
    title: "Full-time Product Design",
    description:
      "Hands-on individual-contributor work with product and engineering teams, shaping complex workflows from the problem through implementation.",
  },
  {
    title: "Contract & Fractional Work",
    description:
      "Focused support for a product team: clarify a difficult workflow, improve a key journey, or define the first useful release.",
  },
  {
    title: "Advisory & Mentorship",
    description:
      "A thoughtful second perspective on a product decision, design review, or portfolio. Each session ends with clear next steps.",
  },
];

export default function WaysToWork() {
  return (
    <section id="pricing" className="flex w-full items-start justify-between">
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
              className="flex w-full flex-1 flex-col items-start gap-3 self-stretch rounded-sm bg-surface p-4"
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
