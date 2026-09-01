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
    label: "UX Audit",
    steps: [
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
    ],
    feedback: [
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
    label: "User Segmentation",
    steps: [
      {
        title: "Define Target Users",
        description:
          "Identify who your product serves by understanding different user groups, their goals, and behaviors.",
      },
      {
        title: "User Research",
        description:
          "Collect insights through interviews, surveys, analytics, and observations to understand real user needs.",
      },
      {
        title: "Create User Personas",
        description:
          "Build representative personas that reflect user motivations, frustrations, and expectations.",
      },
      {
        title: "Map User Journeys",
        description:
          "Visualize how each user segment interacts with your product across every touchpoint.",
      },
    ],
    feedback: [
      {
        issue: "Broad target audience",
        suggestion:
          "Narrow the audience into meaningful user segments based on goals and behaviors.",
      },
      {
        issue: "Generic personas",
        suggestion:
          "Create data-driven personas using real research instead of assumptions.",
      },
      {
        issue: "Unclear user needs",
        suggestion:
          "Identify user motivations, pain points, and desired outcomes through interviews.",
      },
      {
        issue: "Overlapping segments",
        suggestion:
          "Define clear segmentation criteria such as demographics, behaviors, or use cases.",
      },
      {
        issue: "Missing journey insights",
        suggestion:
          "Map complete user journeys to uncover friction points and opportunities.",
      },
      {
        issue: "No prioritization",
        suggestion:
          "Rank user segments by business value, frequency, and customer lifetime potential.",
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
    label: "UI/UX Design & Prototyping",
    steps: [
      {
        title: "Wireframing",
        description:
          "Create low-fidelity layouts to establish structure, content hierarchy, and user flow before visual design.",
      },
      {
        title: "Visual Design",
        description:
          "Design intuitive interfaces with consistent typography, colors, spacing, and reusable components.",
      },
      {
        title: "Interactive Prototyping",
        description:
          "Build clickable prototypes that simulate real user interactions and key user journeys.",
      },
      {
        title: "Usability Testing",
        description:
          "Validate the design with real users to identify friction points and improve the overall experience.",
      },
    ],
    feedback: [
      {
        issue: "Complex navigation",
        suggestion: "Simplify the information architecture and reduce unnecessary steps.",
      },
      {
        issue: "Inconsistent UI components",
        suggestion: "Build a reusable design system with standardized components.",
      },
      {
        issue: "Weak visual hierarchy",
        suggestion:
          "Improve spacing, typography, and color contrast to guide user attention.",
      },
      {
        issue: "Confusing interactions",
        suggestion: "Add clear feedback, transitions, and interaction states.",
      },
      {
        issue: "Prototype not validated",
        suggestion: "Conduct usability testing before development begins.",
      },
      {
        issue: "Missing developer specs",
        suggestion:
          "Include design tokens, component documentation, and interaction details for handoff.",
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
    label: "MVP Product Development",
    steps: [
      {
        title: "Define Core Features",
        description:
          "Identify the essential features that solve the primary user problem and deliver immediate value.",
      },
      {
        title: "Product Roadmap",
        description:
          "Prioritize features into phased releases based on impact, feasibility, and business goals.",
      },
      {
        title: "Rapid Development",
        description:
          "Build the MVP quickly using scalable technologies and an iterative development approach.",
      },
      {
        title: "User Feedback",
        description:
          "Launch early, collect real user feedback, and validate assumptions through continuous testing.",
      },
    ],
    feedback: [
      {
        issue: "Too many initial features",
        suggestion:
          "Focus only on essential features that solve the core user problem.",
      },
      {
        issue: "Unclear product priorities",
        suggestion: "Create a roadmap based on business goals and user impact.",
      },
      {
        issue: "Slow development cycle",
        suggestion: "Use agile sprints and release small, incremental updates.",
      },
      {
        issue: "Limited user validation",
        suggestion: "Gather feedback early through beta testing and analytics.",
      },
      {
        issue: "Low feature adoption",
        suggestion: "Measure user engagement and refine features based on data.",
      },
      {
        issue: "Difficult scalability",
        suggestion: "Build a flexible architecture that supports future growth.",
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
              <span className="block">A Process Rooted in</span>
              <span className="relative z-10 block">
                <span className="absolute -left-2.5 top-1/2 -z-10 hidden h-[67px] w-[383px] -translate-y-1/2 rounded-full bg-gradient-to-r from-black/10 to-black/0 md:block" />
                Clarity &amp; Insight.
              </span>
            </h2>
          </div>
          <p className="hidden shrink-0 whitespace-nowrap font-body text-[18px] tracking-[-0.18px] text-ink md:block">
            [ WORK PROCESS ]
          </p>
        </div>

        <div className="flex w-full px-6">
          <p className="max-w-[640px] font-body text-[16px] leading-[1.4] tracking-[-0.16px] text-muted">
            Every engagement runs through the same four phases —{" "}
            <span className="text-ink">Understand, Analyze, Design, Deliver</span> —
            shaped differently depending on what the work actually needs:
          </p>
        </div>

        <div className="flex w-full items-center px-6">
          <div className="relative w-full overflow-hidden rounded-md border border-border-subtle bg-[rgba(245,245,245,0.2)] px-6 py-8 shadow-button">
            <div className="mx-auto mb-8 flex w-full max-w-[420px] flex-col gap-1 rounded-[8px] border border-border-subtle bg-border-subtle p-1 shadow-button sm:w-fit sm:flex-row sm:flex-wrap sm:items-center sm:justify-center">
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
