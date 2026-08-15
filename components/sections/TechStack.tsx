import Image from "next/image";

type GridCell = {
  key: string;
  icon?: {
    src: string;
    alt: string;
    size?: number;
  };
  variant?: "elevated" | "flat-shadow" | "flat" | "fade";
  className?: string;
};

// 5x5 grid (24 cells), read left-to-right, top-to-bottom, matching the Figma "Icons Grid" layout.
// Row 1 col 4 is intentionally empty in the design; Slack is pinned to col 5 so the gap stays open.
const GRID_CELLS: GridCell[] = [
  // Row 1
  { key: "google-drive", icon: { src: "/images/tools/google-drive.svg", alt: "Google Drive" }, variant: "elevated" },
  { key: "row1-col2", variant: "flat" },
  { key: "row1-col3", variant: "flat-shadow" },
  { key: "slack", icon: { src: "/images/tools/slack.svg", alt: "Slack" }, variant: "elevated", className: "lg:col-start-5" },

  // Row 2
  { key: "row2-col1", variant: "flat" },
  { key: "loom", icon: { src: "/images/tools/loom.svg", alt: "Loom" }, variant: "elevated" },
  { key: "row2-col3", variant: "flat" },
  { key: "google-meet", icon: { src: "/images/tools/google-meet.svg", alt: "Google Meet" }, variant: "elevated" },
  { key: "row2-col5", variant: "flat" },

  // Row 3
  { key: "gitlab", icon: { src: "/images/tools/gitlab.svg", alt: "GitLab" }, variant: "elevated" },
  { key: "row3-col2", variant: "fade" },
  { key: "vs-code", icon: { src: "/images/tools/vs-code.svg", alt: "VS Code" }, variant: "elevated" },
  { key: "row3-col4", variant: "flat" },
  { key: "row3-col5", variant: "flat-shadow" },

  // Row 4
  { key: "row4-col1", variant: "flat" },
  { key: "imessage", icon: { src: "/images/tools/imessage.svg", alt: "Messages" }, variant: "elevated" },
  { key: "row4-col3", variant: "flat" },
  { key: "figma", icon: { src: "/images/tools/figma.svg", alt: "Figma" }, variant: "elevated" },
  { key: "row4-col5", variant: "flat" },

  // Row 5
  { key: "row5-col1", variant: "flat-shadow" },
  { key: "row5-col2", variant: "flat" },
  { key: "trello", icon: { src: "/images/tools/trello.svg", alt: "Trello" }, variant: "elevated" },
  { key: "row5-col4", variant: "fade" },
  { key: "git", icon: { src: "/images/tools/git.svg", alt: "Git" }, variant: "elevated" },
];

const CELL_VARIANT_CLASSES: Record<NonNullable<GridCell["variant"]>, string> = {
  elevated:
    "border border-surface bg-surface shadow-[10px_14px_54px_-11px_rgba(0,0,0,0.13),0px_2px_4px_0px_rgba(0,0,0,0.04),0px_1px_0px_0px_rgba(0,0,0,0.06)]",
  "flat-shadow": "bg-surface shadow-[0px_2px_4px_0px_rgba(0,0,0,0.04),0px_1px_0px_0px_rgba(0,0,0,0.06)]",
  flat: "bg-surface",
  fade: "bg-gradient-to-b from-[#f5f5f5] to-[rgba(245,245,245,0)]",
};

export default function TechStack() {
  return (
    <section id="tech-stack" className="flex w-full items-start justify-between shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]">
      <div
        aria-hidden
        className="hidden w-[269px] shrink-0 self-stretch border-r border-border-subtle bg-surface md:block"
      />

      <div className="flex w-full flex-1 flex-col items-start gap-10 px-6 py-14 md:flex-row">
        <div className="flex w-full max-w-[431px] flex-col items-start justify-between gap-12 self-stretch">
          <div className="relative flex w-full items-center justify-between">
            <h2 className="relative font-heading text-[56px] leading-none tracking-[-0.56px] text-ink">
              <span className="block">Connected Weapons for</span>
              <span className="relative z-10 block">
                <span className="absolute -left-2.5 top-1/2 -z-10 h-[67px] w-[301px] -translate-y-1/2 rounded-full bg-gradient-to-r from-black/10 to-black/0" />
                Modern Design
              </span>
            </h2>
          </div>

          <div className="flex flex-col items-start gap-8">
            <div className="flex h-[30px] w-[27.5px] items-center justify-center">
              <Image
                src="/images/tools/asterisk.svg"
                alt=""
                aria-hidden="true"
                width={30}
                height={27.5}
                className="-rotate-90"
              />
            </div>
            <p className="w-full max-w-[366px] font-body text-[16px] leading-[1.4] tracking-[-0.16px] text-ink">
              Each tool plays a role, from research and wireframing to prototyping and launch. Together, they make my
              process fast, precise, and scalable.
            </p>
            <p className="w-full max-w-[366px] font-body text-[16px] leading-[1.4] tracking-[-0.16px] text-ink/50">
              From design to development, these are the apps that power my workflow and bring clarity to complex
              ideas.
            </p>
          </div>
        </div>

        <div className="grid flex-1 grid-cols-3 gap-3 px-0 sm:grid-cols-4 md:px-8 lg:grid-cols-5">
          {GRID_CELLS.map((cell) => (
            <div
              key={cell.key}
              className={`relative size-[108px] shrink-0 overflow-hidden rounded-md ${CELL_VARIANT_CLASSES[cell.variant ?? "flat"]}${cell.className ? ` ${cell.className}` : ""}`}
            >
              {cell.icon && (
                <Image
                  src={cell.icon.src}
                  alt={cell.icon.alt}
                  width={cell.icon.size ?? 58}
                  height={cell.icon.size ?? 58}
                  className="absolute left-1/2 top-1/2 size-[58px] -translate-x-1/2 -translate-y-1/2"
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
