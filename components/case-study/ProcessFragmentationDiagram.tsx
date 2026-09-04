import type { ReactElement } from "react";

import type { CaseStudyProcessDiagram } from "@/lib/case-studies";

// Fixed slots around the center node. Purpose-built for this one finding
// (four tools -> one decision), not a generic N-point layout.
const CHIP_POSITIONS = [
  { left: 24, top: 22 },
  { left: 76, top: 26 },
  { left: 22, top: 80 },
  { left: 78, top: 76 },
];

// Hand-drawn, single-color line icons in the site's existing stroke-icon
// style — not literal brand marks. Only "Slack" is an actual named product
// in the case study; "a spreadsheet," "a block explorer," and "a risk tool"
// are described generically, so a specific third-party logo would overstate
// which exact tool was used. A consistent custom icon set reads cleaner
// than mixing one real logo with three guessed ones anyway.
function SpreadsheetIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={className} aria-hidden="true">
      <rect x="1.75" y="1.75" width="12.5" height="12.5" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
      <path d="M1.75 6.1H14.25M1.75 10.5H14.25M6.1 1.75V14.25M10.5 1.75V14.25" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}

function BlockExplorerIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={className} aria-hidden="true">
      <circle cx="6.7" cy="6.7" r="4.2" stroke="currentColor" strokeWidth="1.2" />
      <path d="M9.8 9.8L14 14" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <rect x="4.7" y="5.4" width="1.9" height="1.9" rx="0.35" stroke="currentColor" strokeWidth="0.85" />
      <rect x="7.2" y="5.4" width="1.9" height="1.9" rx="0.35" stroke="currentColor" strokeWidth="0.85" />
    </svg>
  );
}

function RiskToolIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={className} aria-hidden="true">
      <path
        d="M8 1.5L14 3.7V7.5C14 11.1 11.4 13.6 8 14.5C4.6 13.6 2 11.1 2 7.5V3.7L8 1.5Z"
        stroke="currentColor"
        strokeWidth="1.15"
        strokeLinejoin="round"
      />
      <path d="M8 5.6V8.6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="8" cy="10.8" r="0.65" fill="currentColor" />
    </svg>
  );
}

function MessagingIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={className} aria-hidden="true">
      <path
        d="M3.5 2.25H12.5C13.19 2.25 13.75 2.81 13.75 3.5V9.25C13.75 9.94 13.19 10.5 12.5 10.5H6.6L3.25 13V10.5C2.56 10.5 2 9.94 2 9.25V3.5C2 2.81 2.56 2.25 3.25 2.25"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinejoin="round"
      />
      <circle cx="5.4" cy="6.35" r="0.65" fill="currentColor" />
      <circle cx="8" cy="6.35" r="0.65" fill="currentColor" />
      <circle cx="10.6" cy="6.35" r="0.65" fill="currentColor" />
    </svg>
  );
}

function GenericToolIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={className} aria-hidden="true">
      <circle cx="8" cy="8" r="5.5" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="8" cy="8" r="1.6" fill="currentColor" />
    </svg>
  );
}

const TOOL_ICONS: Record<string, (props: { className?: string }) => ReactElement> = {
  spreadsheet: SpreadsheetIcon,
  "block explorer": BlockExplorerIcon,
  "risk tool": RiskToolIcon,
  slack: MessagingIcon,
};

function iconForTool(tool: string) {
  return TOOL_ICONS[tool.trim().toLowerCase()] ?? GenericToolIcon;
}

/**
 * Visualizes a single research finding: several disconnected tools feeding
 * into one decision, and how much of that decision-maker's time actually
 * went to gathering context vs. deciding. Purpose-built for this specific
 * finding rather than a generic "diagram" schema — the shape (N tools ->
 * one decision, context% vs decide%) isn't a pattern other case studies
 * necessarily share.
 */
export default function ProcessFragmentationDiagram({
  tools,
  contextPercent,
  decidePercent,
}: CaseStudyProcessDiagram) {
  return (
    <div className="ml-[18px] flex w-full flex-col gap-10 rounded-md border border-border-subtle bg-surface p-6 shadow-button md:flex-row md:items-center md:gap-12 md:p-10">
      {/* Tools converging into one decision */}
      <div className="relative mx-auto aspect-square w-full max-w-[300px] shrink-0">
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="absolute inset-0 h-full w-full text-ink/20"
          aria-hidden="true"
        >
          {tools.map((tool, index) => {
            const pos = CHIP_POSITIONS[index % CHIP_POSITIONS.length];
            return (
              <line
                key={tool}
                x1="50"
                y1="50"
                x2={pos.left}
                y2={pos.top}
                stroke="currentColor"
                strokeWidth="0.6"
                strokeDasharray="2 3"
                strokeLinecap="round"
              />
            );
          })}
        </svg>

        {tools.map((tool, index) => {
          const pos = CHIP_POSITIONS[index % CHIP_POSITIONS.length];
          const Icon = iconForTool(tool);
          return (
            <div
              key={tool}
              style={{ left: `${pos.left}%`, top: `${pos.top}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 flex items-center gap-1.5 whitespace-nowrap rounded-full border border-border-subtle bg-paper py-1.5 pl-1.5 pr-3 font-body text-[11px] font-medium tracking-[-0.11px] text-ink shadow-button"
            >
              <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-surface text-ink/70">
                <Icon className="size-3" />
              </span>
              {tool}
            </div>
          );
        })}

        <div className="absolute left-1/2 top-1/2 flex size-[76px] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full bg-ink text-center shadow-[0_10px_24px_-8px_rgba(0,0,0,0.45)]">
          <span className="font-body text-[11px] font-medium leading-tight tracking-[-0.11px] text-paper">
            One
          </span>
          <span className="font-body text-[11px] font-medium leading-tight tracking-[-0.11px] text-paper">
            decision
          </span>
        </div>
      </div>

      <div className="hidden h-40 w-px shrink-0 bg-border-subtle md:block" aria-hidden="true" />
      <div className="h-px w-full bg-border-subtle md:hidden" aria-hidden="true" />

      {/* Where the time actually went */}
      <div className="flex flex-1 flex-col gap-5">
        <div className="flex flex-col gap-1">
          <span className="font-heading text-[56px] leading-none tracking-[-0.56px] text-ink md:text-[72px] md:tracking-[-0.72px]">
            {contextPercent}%
          </span>
          <span className="max-w-[320px] font-body text-[16px] leading-[1.4] tracking-[-0.16px] text-ink/50">
            of her time went to gathering context across four disconnected
            tools, not deciding.
          </span>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex h-2 w-full overflow-hidden rounded-full bg-border-subtle">
            <div
              className="h-full rounded-full bg-ink"
              style={{ width: `${contextPercent}%` }}
            />
          </div>
          <div className="flex w-full justify-between font-body text-[12px] tracking-[-0.12px] text-ink/40">
            <span>Gathering context</span>
            <span>{decidePercent}% deciding</span>
          </div>
        </div>
      </div>
    </div>
  );
}
