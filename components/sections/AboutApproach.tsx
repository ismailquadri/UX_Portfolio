import SidebarSpacer from "@/components/SidebarSpacer";

const STEPS = [
  {
    title: "UX Audit",
    description:
      "Identify what's holding your product back. I analyze usability, flow, and interaction patterns to uncover friction points and turn them into opportunities for better user experience.",
  },
  {
    title: "User Segmentation & Insights",
    description:
      "Define who your users truly are. I help you develop clear user segments and behavioral insights to make every design decision data-driven and human-centered.",
  },
  {
    title: "UI/UX Design & Prototyping",
    description:
      "From concept to clickable prototype — I design interfaces that don't just look good but feel intuitive, efficient, and on-brand.",
  },
  {
    title: "MVP Product Development",
    description:
      "Turn your idea into a working product fast. I help you design, build, and launch your MVP with just the right features to validate your vision and attract early users.",
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
                <span className="absolute -left-2.5 top-1/2 -z-10 hidden h-[67px] w-[349px] -translate-y-1/2 rounded-full bg-gradient-to-r from-black/10 to-black/0 md:block" />
                I bring solutions.
              </span>
            </h2>
          </div>
          <p className="hidden shrink-0 whitespace-nowrap font-body text-[18px] tracking-[-0.18px] text-ink md:block">
            [ CAPABILITIES ]
          </p>
        </div>

        <div className="flex w-full flex-col items-start px-6">
          {STEPS.map((step, index) => (
            <div
              key={step.title}
              className={`flex w-full flex-col gap-2 py-6 ${
                index !== STEPS.length - 1
                  ? "border-b border-border-subtle"
                  : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="font-body text-[14px] tracking-[-0.14px] text-ink/40">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="font-body text-[16px] font-medium tracking-[-0.16px] text-ink">
                  {step.title}
                </h3>
              </div>
              <p className="max-w-2xl font-body text-[16px] leading-[1.4] tracking-[-0.16px] text-muted">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        <div className="flex w-full px-6">
          <a
            href="/case-studies"
            className="relative inline-flex items-center gap-2 overflow-hidden rounded-[8px] border border-white bg-black px-3 py-3 shadow-[0px_6px_6px_-3px_rgba(0,0,0,0.25),0px_0px_0px_2px_rgba(0,0,0,0.15)]"
          >
            {/* TODO: confirm /case-studies route once merged from parallel work */}
            <span className="font-body text-[14px] tracking-[-0.28px] text-white">
              See Works
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
