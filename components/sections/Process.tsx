"use client";

import Image from "next/image";
import { useState } from "react";

type ProcessTab = {
  label: string;
  steps: { title: string; description: string }[];
  feedback: { issue: string; suggestion: string }[];
  mockup: {
    src: string;
    alt: string;
    width: number;
    height: number;
    variant: "device" | "sticky";
  };
};

const TABS: ProcessTab[] = [
  {
    label: "Product Discovery",
    steps: [
      {
        title: "Set the goal",
        description:
          "Agree on the product outcome and the decision this audit should support.",
      },
      {
        title: "Heuristic Evaluation",
        description:
          "Review key screens and journeys for usability issues, edge cases, and unclear feedback.",
      },
      {
        title: "User Flow Analysis",
        description:
          "Use research, analytics, or support patterns when available to understand where people struggle.",
      },
      {
        title: "Behavioral Data Analysis",
        description:
          "Prioritize issues by user impact and severity, then recommend specific next steps.",
      },
    ],
    feedback: [
      {
        issue: "The map action is unclear",
        suggestion: "Label it “Open map” or pair the arrow with descriptive text.",
      },
      {
        issue: "The current tab is hard to identify",
        suggestion: "Give the active tab a clear visual state and an accessible label.",
      },
      {
        issue: "Profile photo placement",
        suggestion: "Add a name or role so visitors understand whose profile they are viewing.",
      },
      {
        issue: "Confusing notification icons",
        suggestion: "Use familiar icons and labels that explain what each notification means.",
      },
      {
        issue: "The filter control looks like navigation",
        suggestion: "Use a filter icon and make the applied state visible.",
      },
      {
        issue: "Typographic contrast",
        suggestion: "Check text contrast in context and adjust it so the content remains readable.",
      },
    ],
    mockup: {
      src: "/images/process-device-mockup.png",
      alt: "Device mockup showing a UX audit interface",
      width: 208,
      height: 446,
      variant: "device",
    },
  },
  {
    label: "Research & Insights",
    steps: [
      {
        title: "Frame the research question",
        description:
          "Decide what the team needs to learn and which people can help answer it.",
      },
      {
        title: "User Research",
        description:
          "Use interviews, observation, surveys, or product data to learn how people work today.",
      },
      {
        title: "Find meaningful patterns",
        description:
          "Group people by relevant needs and behavior, using evidence rather than assumptions.",
      },
      {
        title: "Map User Journeys",
        description:
          "Map key journeys and validate the differences that matter to the product decision.",
      },
    ],
    feedback: [
      {
        issue: "The audience is too broad",
        suggestion: "Define the groups by the goals and behaviors relevant to this decision.",
      },
      {
        issue: "Personas are based on assumptions",
        suggestion: "Use research evidence and label any remaining assumptions clearly.",
      },
      {
        issue: "Needs are not connected to evidence",
        suggestion: "Trace each finding to an observation, interview, or product signal.",
      },
      {
        issue: "Overlapping segments",
        suggestion: "Write down the criteria and test whether each group behaves differently.",
      },
      {
        issue: "The journey ends at the interface",
        suggestion: "Include the surrounding steps, handoffs, and offline work where relevant.",
      },
      {
        issue: "Research findings are not prioritized",
        suggestion: "Connect the findings to user impact and the decision the team needs to make.",
      },
    ],
    mockup: {
      src: "/images/process-tab2-sticky.png",
      alt: "Sticky note describing a primary user segment",
      width: 222,
      height: 361,
      variant: "sticky",
    },
  },
  {
    label: "Product Design",
    steps: [
      {
        title: "Map the experience",
        description:
          "Set the content hierarchy and key steps before adding visual detail.",
      },
      {
        title: "Resolve the interface",
        description:
          "Use clear visual hierarchy, consistent components, and useful system states.",
      },
      {
        title: "Prototype key interactions",
        description:
          "Make the important paths and decisions concrete enough for the team to review.",
      },
      {
        title: "Usability Testing",
        description:
          "Test the riskiest assumptions with users, then refine the design based on what you learn.",
      },
    ],
    feedback: [
      {
        issue: "People lose their place",
        suggestion: "Clarify the hierarchy and show where each action leads.",
      },
      {
        issue: "Similar controls behave differently",
        suggestion: "Align patterns and document the exceptions the team needs to support.",
      },
      {
        issue: "Important information is easy to miss",
        suggestion: "Give the primary task and its status a clearer visual hierarchy.",
      },
      {
        issue: "Actions give little feedback",
        suggestion: "Show clear loading, success, error, and disabled states.",
      },
      {
        issue: "The prototype does not answer the key question",
        suggestion: "Test the decision or workflow that carries the most risk.",
      },
      {
        issue: "Handoff leaves interaction details open",
        suggestion: "Document behavior, edge cases, and component states for implementation.",
      },
    ],
    mockup: {
      src: "/images/process-tab3-mockup.png",
      alt: "Device mockup showing a wireframed ticket booking interface",
      width: 184,
      height: 451,
      variant: "device",
    },
  },
  {
    label: "MVP Definition",
    steps: [
      {
        title: "Define the first outcome",
        description:
          "Name the user need and the smallest useful outcome the first release should support.",
      },
      {
        title: "Set the first scope",
        description:
          "Choose what belongs in the first release and what can wait, based on impact and constraints.",
      },
      {
        title: "Prototype the riskiest part",
        description:
          "Explore the key flow before the team commits to a full implementation.",
      },
      {
        title: "Plan what to learn",
        description:
          "Define the signals and feedback that will show whether the first release solves the right problem.",
      },
    ],
    feedback: [
      {
        issue: "The first release has too many features",
        suggestion:
          "Keep the scope focused on the user outcome the team needs to validate.",
      },
      {
        issue: "Priorities are not clear",
        suggestion: "Make the user need, business goal, and constraints visible together.",
      },
      {
        issue: "The team is committing before testing the idea",
        suggestion: "Prototype the riskiest assumption before investing in the full build.",
      },
      {
        issue: "The team has no learning plan",
        suggestion: "Decide what feedback or product signal will guide the next iteration.",
      },
      {
        issue: "Success is defined only by delivery",
        suggestion: "Agree on a user or business outcome to review after release.",
      },
      {
        issue: "Future needs are shaping the first release",
        suggestion: "Separate what must work now from the flexibility the product may need later.",
      },
    ],
    mockup: {
      src: "/images/process-tab4-mockup.png",
      alt: "Device mockup showing an MVP event-discovery app",
      width: 207,
      height: 463,
      variant: "device",
    },
  },
];

export default function Process() {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = TABS[activeIndex];

  return (
    <section id="process" className="flex w-full items-start justify-between">
      <div className="flex w-full flex-1 flex-col items-start gap-12 py-14">
        <div className="flex w-full items-end justify-between px-6">
          <div className="relative flex items-center gap-2.5">
            <h2 className="relative font-heading text-[32px] leading-tight tracking-[-0.32px] text-ink md:text-[56px] md:leading-none md:tracking-[-0.56px]">
              <span className="block">How I Approach Product Work</span>
              <span className="relative z-10 block">
                <span className="absolute -left-2.5 top-1/2 -z-10 hidden h-[67px] w-[383px] -translate-y-1/2 rounded-full bg-gradient-to-r from-black/10 to-black/0 md:block" />
                Understand, focus, design, learn.
              </span>
            </h2>
          </div>
          <p className="hidden shrink-0 whitespace-nowrap font-body text-[18px] tracking-[-0.18px] text-ink md:block">
            [ WORK PROCESS ]
          </p>
        </div>

        <div className="flex w-full px-6">
          <p className="max-w-[640px] font-body text-[16px] leading-[1.4] tracking-[-0.16px] text-muted">
            I start with the people and constraints around the problem, then focus on the workflow that matters most. The methods change with the work; the aim is a clear decision and a useful next step.
          </p>
        </div>

        <div className="flex w-full items-center px-6">
          <div className="relative w-full overflow-hidden rounded-md border border-border-subtle bg-[rgba(245,245,245,0.2)] px-6 py-8 shadow-button">
            <div className="mx-auto mb-8 flex w-full max-w-[420px] flex-col gap-1 rounded-[8px] border border-border-subtle bg-border-subtle p-1 shadow-button sm:w-fit sm:max-w-none sm:flex-row sm:flex-nowrap sm:items-center sm:justify-center">
              {TABS.map((tab, index) => (
                <button
                  key={tab.label}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  className={`flex h-[28px] w-full items-center justify-center whitespace-nowrap rounded-2xl px-2 py-1.5 font-body text-[14px] tracking-[-0.28px] text-ink transition-colors sm:w-auto ${
                    index === activeIndex
                      ? "border border-[#f5f5f5] bg-paper shadow-button"
                      : "border border-transparent"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="flex flex-col items-center gap-10 lg:flex-row lg:items-center lg:justify-center">
              <div className="flex items-center gap-5">
                <div className="flex w-full max-w-[274px] flex-col items-start pr-4">
                  {active.steps.map((step, index) => (
                    <div
                      key={step.title}
                      className={`flex w-full flex-col items-start gap-2 py-5 ${
                        index !== active.steps.length - 1
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
                            className="h-[18px] w-[25px] object-contain"
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

                {active.mockup.variant === "device" ? (
                  <div
                    className="relative shrink-0 shadow-[10px_14px_54px_-11px_rgba(0,0,0,0.13),0px_2px_4px_0px_rgba(0,0,0,0.04),0px_1px_0px_0px_rgba(0,0,0,0.06)]"
                    style={{
                      height: active.mockup.height,
                      width: active.mockup.width,
                    }}
                  >
                    <Image
                      src={active.mockup.src}
                      alt={active.mockup.alt}
                      fill
                      sizes={`${active.mockup.width}px`}
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div
                    className="relative shrink-0 overflow-hidden shadow-[7.72px_14.153px_45.419px_0px_rgba(0,0,0,0.1)]"
                    style={{
                      height: active.mockup.height,
                      width: active.mockup.width,
                    }}
                  >
                    <Image
                      src={active.mockup.src}
                      alt={active.mockup.alt}
                      fill
                      sizes={`${active.mockup.width}px`}
                      className="object-cover"
                    />
                  </div>
                )}
              </div>

              <div className="relative flex w-full max-w-[480px] flex-col items-start">
                <div className="flex w-full flex-col items-start overflow-hidden rounded-sm border border-border-subtle bg-paper shadow-button">
                  <div className="hidden w-full items-center bg-surface sm:flex">
                    <div className="w-[175px] px-3 py-2 font-body text-[14px] tracking-[-0.28px] text-ink opacity-80">
                      Issue
                    </div>
                    <div className="flex-1 px-3 py-2 font-body text-[14px] tracking-[-0.28px] text-ink opacity-80">
                      Suggestions
                    </div>
                  </div>
                  {active.feedback.map((item) => (
                    <div
                      key={item.issue}
                      className="flex w-full flex-col items-start gap-1 border-t border-border-subtle p-3 sm:flex-row sm:items-start sm:gap-0 sm:p-0"
                    >
                      <p className="font-body text-[11px] font-medium uppercase tracking-[0.06em] text-ink/40 sm:hidden">
                        Issue
                      </p>
                      <p className="font-body text-[14px] leading-normal tracking-[-0.14px] text-ink opacity-60 sm:w-[175px] sm:p-3">
                        {item.issue}
                      </p>
                      <p className="mt-2 font-body text-[11px] font-medium uppercase tracking-[0.06em] text-ink/40 sm:hidden">
                        Suggestion
                      </p>
                      <p className="font-body text-[14px] font-medium leading-normal tracking-[-0.28px] text-ink sm:flex-1 sm:p-3">
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
