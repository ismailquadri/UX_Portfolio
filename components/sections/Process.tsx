import Image from "next/image";

const TABS = [
  "UX Audit",
  "User Segmentation",
  "UI/UX Design & Prototyping",
  "MVP Product Development",
];

const STEPS = [
  {
    title: "Define Objective",
    description:
      "Identify goal of the audit what business or user problem you want to solve.",
  },
  {
    title: "Heuristic Evaluation",
    description:
      "Review the interface using standard UX principles (e.g. Nielsen's 10 heuristics).",
  },
  {
    title: "User Flow Analysis",
    description:
      "Check how users move through the product and where they might get stuck.",
  },
  {
    title: "Behavioral Data Analysis",
    description:
      "Use analytics or heatmaps to validate friction points with real user data.",
  },
];

const FEEDBACK_ITEMS = [
  {
    issue: "Ambiguous “arrow” button (send icon)",
    suggestion:
      "“open map”, or “send ticket”.Replace with a location pin icon or a “Map” label.",
  },
  {
    issue: "Bottom bar affordance",
    suggestion: "Add color highlight or glowing effect to current tab.",
  },
  {
    issue: "Profile photo placement",
    suggestion:
      "Add label (e.g. “by Chef Renatta”) or move avatar into metadata row.",
  },
  {
    issue: "Confusing notification icons",
    suggestion:
      "Redesign icons to be more intuitive and provide tooltips for clarification.",
  },
  {
    issue: "Filter icon (hamburger)",
    suggestion: "Use rounded background or filter-funnel icon for better clarity.",
  },
  {
    issue: "Typographic contrast",
    suggestion: "Slightly darken to improve readability under sunlight.",
  },
];

export default function Process() {
  return (
    <section id="process" className="flex w-full items-start justify-between">
      <div
        aria-hidden
        className="hidden w-[269px] shrink-0 self-stretch border-r border-border-subtle bg-surface md:block"
      />

      <div className="flex w-full flex-1 flex-col items-start gap-12 py-14">
        <div className="flex w-full items-end justify-between px-6">
          <div className="relative flex items-center gap-2.5">
            <h2 className="relative font-heading text-[56px] leading-none tracking-[-0.56px] text-ink">
              <span className="block">A Process Rooted in</span>
              <span className="relative z-10 block">
                <span className="absolute -left-2.5 top-1/2 -z-10 h-[67px] w-[383px] -translate-y-1/2 rounded-full bg-gradient-to-r from-black/10 to-black/0" />
                Clarity &amp; Insight.
              </span>
            </h2>
          </div>
          <p className="hidden shrink-0 whitespace-nowrap font-body text-[18px] tracking-[-0.18px] text-ink md:block">
            [ WORK PROCESS ]
          </p>
        </div>

        <div className="flex w-full items-center px-6">
          <div className="relative w-full overflow-hidden rounded-md border border-border-subtle bg-[rgba(245,245,245,0.2)] px-6 py-8 shadow-button">
            <div className="mx-auto mb-8 flex w-fit items-center gap-1 rounded-[8px] border border-border-subtle bg-border-subtle p-1 shadow-button">
              {TABS.map((tab, index) => (
                <div
                  key={tab}
                  className={`flex h-[28px] items-center whitespace-nowrap rounded-2xl px-2 py-1.5 font-body text-[14px] tracking-[-0.28px] text-ink ${
                    index === 0
                      ? "border border-[#f5f5f5] bg-paper shadow-button"
                      : ""
                  }`}
                >
                  {tab}
                </div>
              ))}
            </div>

            <div className="flex flex-col items-center gap-10 lg:flex-row lg:items-center lg:justify-center">
              <div className="flex items-center gap-5">
                <div className="flex w-full max-w-[274px] flex-col items-start pr-4">
                  {STEPS.map((step, index) => (
                    <div
                      key={step.title}
                      className={`flex w-full flex-col items-start gap-2 py-5 ${
                        index !== STEPS.length - 1
                          ? "border-b border-border-subtle"
                          : ""
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {index === 0 && (
                          <Image
                            src="/images/process-step-icon.png"
                            alt=""
                            width={25}
                            height={18}
                            className="h-[18px] w-[25px] object-cover"
                            aria-hidden="true"
                          />
                        )}
                        <h3 className="font-body text-[16px] font-medium tracking-[-0.16px] text-ink">
                          {step.title}
                        </h3>
                      </div>
                      <p className="font-body text-[16px] leading-[1.4] tracking-[-0.16px] text-muted">
                        {step.description}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="relative h-[446px] w-[208px] shrink-0 shadow-[10px_14px_54px_-11px_rgba(0,0,0,0.13),0px_2px_4px_0px_rgba(0,0,0,0.04),0px_1px_0px_0px_rgba(0,0,0,0.06)]">
                  <Image
                    src="/images/process-device-mockup.png"
                    alt="Device mockup showing a UX audit interface"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              <div className="relative flex w-full max-w-[480px] flex-col items-start">
                <div className="flex w-full flex-col items-start overflow-hidden rounded-sm border border-border-subtle bg-paper shadow-button">
                  <div className="flex w-full items-center bg-surface">
                    <div className="w-[175px] px-3 py-2 font-body text-[14px] tracking-[-0.28px] text-ink opacity-80">
                      Issue
                    </div>
                    <div className="flex-1 px-3 py-2 font-body text-[14px] tracking-[-0.28px] text-ink opacity-80">
                      Suggestions
                    </div>
                  </div>
                  {FEEDBACK_ITEMS.map((item) => (
                    <div
                      key={item.issue}
                      className="flex w-full items-start border-t border-border-subtle"
                    >
                      <p className="w-[175px] p-3 font-body text-[14px] leading-normal tracking-[-0.14px] text-ink opacity-60">
                        {item.issue}
                      </p>
                      <p className="flex-1 p-3 font-body text-[14px] font-medium leading-normal tracking-[-0.28px] text-ink">
                        {item.suggestion}
                      </p>
                    </div>
                  ))}
                </div>

                <Image
                  src="/images/process-badge.png"
                  alt=""
                  width={56}
                  height={56}
                  className="absolute -right-2.5 -top-8 h-14 w-14 object-cover"
                  aria-hidden="true"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
