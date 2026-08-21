const SKILL_GROUPS = [
  {
    title: "Product Design",
    bullets: [
      "End-to-end UX for complex systems (state machines, role hierarchies, multi-entity flows)",
      "Design systems & component architecture",
      "Information architecture for dense operational tools",
      "Prototyping & interaction design",
      "Usability testing & heuristic evaluation",
    ],
  },
  {
    title: "Tools & Workflows",
    bullets: [
      "Figma (components, variables, auto-layout, prototyping)",
      "Claude Code + Cursor (AI-augmented design-to-engineering)",
      "FigJam, Miro (systems mapping & workshop facilitation)",
      "Notion, Linear (documentation & async collaboration)",
    ],
  },
  {
    title: "Domains",
    bullets: [
      "FinTech - compliance workflows, transaction monitoring, KYC",
      "AI-native - multi-model orchestration, marketplace matching, dependency mapping",
      "GovTech - civil-service platforms, org-scale role systems, national registries",
      "Enterprise SaaS - B2B dashboards, admin consoles, data-dense interfaces",
    ],
  },
];

export default function AboutSkills() {
  return (
    <section className="flex w-full items-start justify-between">
      <div className="flex w-full flex-1 flex-col items-start gap-12 py-14">
        <div className="flex w-full flex-col gap-3 px-6">
          <p className="font-body text-[14px] tracking-[-0.14px] text-ink">
            [ ABOUT ME ]
          </p>
          <h2 className="font-heading text-[28px] tracking-[-0.28px] text-ink md:text-[40px] md:tracking-[-0.4px]">
            Skills &amp; Domains
          </h2>
        </div>

        <div className="flex w-full flex-col items-start px-6">
          {SKILL_GROUPS.map((group, index) => (
            <div
              key={group.title}
              className={`flex w-full flex-col gap-3 py-4 ${
                index !== SKILL_GROUPS.length - 1
                  ? "border-b border-border-subtle"
                  : ""
              }`}
            >
              <h3 className="font-body text-[18px] font-semibold leading-[1.6] tracking-[-0.18px] text-ink">
                {group.title}
              </h3>
              <ul className="flex flex-col gap-2">
                {group.bullets.map((bullet) => (
                  <li
                    key={bullet}
                    className="font-body text-[15px] leading-normal tracking-[-0.15px] text-ink/50"
                  >
                    - {bullet}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex w-full px-6">
          <a
            href="#"
            className="font-body text-[14px] tracking-[-0.14px] text-ink underline decoration-solid underline-offset-2"
          >
            {/* TODO: link to real CV file */}
            Download CV ↓
          </a>
        </div>
      </div>
    </section>
  );
}
