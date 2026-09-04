import type { ReactElement } from "react";

// Small monochrome-shape line icons, recolored per node via the badge
// background rather than baked-in fills — lets one icon set work across
// every tone in the palette below.
function DashboardIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={className} aria-hidden="true">
      <rect x="1.75" y="1.75" width="12.5" height="12.5" rx="1.5" stroke="currentColor" strokeWidth="1.15" />
      <rect x="3.5" y="3.5" width="4.5" height="4.5" rx="0.8" stroke="currentColor" strokeWidth="1" />
      <path d="M3.5 10.5H12.5M3.5 12.2H9" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}

function BranchIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={className} aria-hidden="true">
      <path
        d="M8 2.2V6.5M8 6.5C8 8 6.5 8 6.5 9.5V12.8M8 6.5C8 8 9.5 8 9.5 9.5V12.8"
        stroke="currentColor"
        strokeWidth="1.15"
        strokeLinecap="round"
      />
      <circle cx="8" cy="2.2" r="1" fill="currentColor" />
      <circle cx="6.5" cy="13.4" r="1" fill="currentColor" />
      <circle cx="9.5" cy="13.4" r="1" fill="currentColor" />
    </svg>
  );
}

function ShieldCheckIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={className} aria-hidden="true">
      <path
        d="M8 1.5L14 3.7V7.5C14 11.1 11.4 13.6 8 14.5C4.6 13.6 2 11.1 2 7.5V3.7L8 1.5Z"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinejoin="round"
      />
      <path d="M5.4 8L7.1 9.7L10.6 6.1" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PartnersIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={className} aria-hidden="true">
      <circle cx="6" cy="6.5" r="2.75" stroke="currentColor" strokeWidth="1.05" />
      <circle cx="10.5" cy="7.6" r="2.75" stroke="currentColor" strokeWidth="1.05" />
    </svg>
  );
}

function WalletIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={className} aria-hidden="true">
      <rect x="1.75" y="4" width="12.5" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.1" />
      <path d="M1.75 6.6H14.25" stroke="currentColor" strokeWidth="1.1" />
      <circle cx="11" cy="9.6" r="0.95" fill="currentColor" />
    </svg>
  );
}

function DocumentIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={className} aria-hidden="true">
      <path
        d="M4.25 1.75H9.5L12.25 4.5V13.25C12.25 13.66 11.91 14 11.5 14H4.25C3.84 14 3.5 13.66 3.5 13.25V2.5C3.5 2.09 3.84 1.75 4.25 1.75Z"
        stroke="currentColor"
        strokeWidth="1.05"
        strokeLinejoin="round"
      />
      <path d="M5.5 8H10M5.5 10.4H10" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}

function SlidersIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={className} aria-hidden="true">
      <path d="M3 4.2H13M3 8H13M3 11.8H13" stroke="currentColor" strokeWidth="1.05" strokeLinecap="round" />
      <circle cx="6.2" cy="4.2" r="1.25" fill="currentColor" />
      <circle cx="10.2" cy="8" r="1.25" fill="currentColor" />
      <circle cx="5.2" cy="11.8" r="1.25" fill="currentColor" />
    </svg>
  );
}

// Colors lifted directly from the Figma flow-diagram source (one tone per
// node "type"), not the site's usual monochrome palette — this diagram is
// intentionally the one spot on the page that borrows a flow-builder-tool
// visual language instead of the flat black/white system used elsewhere.
const PALETTE = {
  purple: { bg: "#f4f1fe", border: "#dbd3fc", badge: "#9278f7" },
  teal: { bg: "#ecf9f7", border: "#c5ede6", badge: "#45c6ad" },
  magenta: { bg: "#f9ecf7", border: "#edc5e6", badge: "#d500bb" },
  blue: { bg: "#ecf3f9", border: "#c5d9ed", badge: "#2a93fc" },
  orange: { bg: "#fdf1ed", border: "#fad2c8", badge: "#ef6e4c" },
  green: { bg: "#ecf9f0", border: "#c5edd2", badge: "#00d547" },
} as const;

type Tone = keyof typeof PALETTE;
const CONNECTOR_COLOR = "#d9d9d9";
const REJECTED_COLOR = "#ef6e4c";

function FlowNode({
  icon,
  title,
  subtitle,
  tone,
  rejected = false,
  compact = false,
}: {
  icon: ReactElement;
  title: string;
  subtitle: string;
  tone: Tone;
  rejected?: boolean;
  compact?: boolean;
}) {
  const c = PALETTE[tone];
  return (
    <div
      className={`relative flex w-full items-center gap-3 rounded-2xl border ${compact ? "px-3.5 py-3" : "px-4 py-4"}`}
      style={{ backgroundColor: c.bg, borderColor: c.border }}
    >
      <span
        className={`flex shrink-0 items-center justify-center rounded-full text-white ${compact ? "size-8" : "size-9"}`}
        style={{ backgroundColor: c.badge }}
      >
        <span className={compact ? "size-4" : "size-[18px]"}>{icon}</span>
      </span>
      <div className="flex min-w-0 flex-col gap-0.5">
        <span className={`font-body font-medium tracking-[-0.14px] text-ink ${compact ? "text-[13px]" : "text-[14px]"}`}>
          {title}
        </span>
        <span className="font-body text-[12px] tracking-[-0.12px] text-ink/50">{subtitle}</span>
      </div>
      {rejected && (
        <span className="absolute right-3 top-3 rounded-md border border-[#ebe5e5] bg-[#faeded] px-1.5 py-0.5 font-body text-[9px] font-semibold uppercase tracking-[0.05em] text-[#ff595c]">
          Rejected
        </span>
      )}
    </div>
  );
}

function Connector({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center justify-center" style={{ height: compact ? 18 : 22 }}>
      <div className="h-full w-px" style={{ backgroundColor: CONNECTOR_COLOR }} aria-hidden="true" />
    </div>
  );
}

function ArrowConnector({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center gap-2 py-2">
      <svg width="14" height="34" viewBox="0 0 14 34" fill="none" aria-hidden="true">
        <line x1="7" y1="0" x2="7" y2="24" stroke={REJECTED_COLOR} strokeWidth="1.4" />
        <path d="M2.5 21L7 27L11.5 21" stroke={REJECTED_COLOR} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </svg>
      <span className="max-w-[230px] text-balance text-center font-body text-[11px] leading-snug tracking-[-0.11px] text-ink/40">
        {label}
      </span>
    </div>
  );
}

// Smooth bracket that splits one incoming line into two outgoing branches —
// desktop only; mobile collapses the whole tree to a single stacked column.
function BracketConnector() {
  return (
    <div className="hidden w-full max-w-[560px] flex-col items-center md:flex">
      <div className="h-5 w-px" style={{ backgroundColor: CONNECTOR_COLOR }} aria-hidden="true" />
      <svg viewBox="0 0 100 26" preserveAspectRatio="none" className="h-[26px] w-full max-w-[420px]" aria-hidden="true">
        <path d="M50 0 C50 14, 25 12, 25 26" stroke={CONNECTOR_COLOR} strokeWidth="1" fill="none" />
        <path d="M50 0 C50 14, 75 12, 75 26" stroke={CONNECTOR_COLOR} strokeWidth="1" fill="none" />
      </svg>
    </div>
  );
}

/**
 * Visualizes the reframing decision from the Obstacles section: the first
 * instinct (one shared dashboard) was rejected, which led to splitting the
 * product by role, and further splitting the compliance side into three
 * focused workspaces. Colors and node styling are pulled from the Figma
 * flow-diagram source; the exact micro-topology inside the Compliance
 * branch is simplified to three parallel children (rather than Wallet
 * Screening individually branching to two separate nodes) to stay
 * responsive without hand-tuned bezier paths per breakpoint.
 */
export default function DecisionFlow() {
  return (
    <div className="ml-[18px] w-full overflow-hidden rounded-md border border-border-subtle shadow-button">
      <div
        className="flex w-full flex-col items-center bg-gradient-to-b from-[#f9f9f9] to-white px-6 py-10 md:px-10 md:py-12"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(to bottom, #f9f9f9, #ffffff)",
          backgroundSize: "16px 16px, 100% 100%",
        }}
      >
        <div className="w-full max-w-[300px]">
          <FlowNode
            icon={<DashboardIcon className="size-full" />}
            title="One dashboard, everything in it"
            subtitle="First instinct"
            tone="purple"
            rejected
          />
        </div>

        <ArrowConnector label="She said no in under a minute — too much at once" />

        <div className="w-full max-w-[300px]">
          <FlowNode
            icon={<BranchIcon className="size-full" />}
            title="Split the product by role"
            subtitle="The reframe"
            tone="teal"
          />
        </div>

        <Connector />
        <BracketConnector />

        <div className="grid w-full max-w-[640px] grid-cols-1 gap-8 md:grid-cols-2 md:gap-10">
          {/* Compliance portal branch */}
          <div className="flex flex-col items-center gap-0">
            <div className="w-full">
              <FlowNode
                icon={<ShieldCheckIcon className="size-full" />}
                title="Compliance Portal"
                subtitle="Built for focus, one queue at a time"
                tone="magenta"
              />
            </div>

            <Connector />

            <div className="flex w-full flex-col gap-3">
              <FlowNode
                icon={<WalletIcon className="size-full" />}
                title="Wallet Screening"
                subtitle="High-risk first, side-panel review"
                tone="orange"
                compact
              />
              <FlowNode
                icon={<SlidersIcon className="size-full" />}
                title="Country Configuration"
                subtitle="Structured template, no blank canvas"
                tone="green"
                compact
              />
              <FlowNode
                icon={<DocumentIcon className="size-full" />}
                title="Document Review"
                subtitle="Evidence and audit trail"
                tone="teal"
                compact
              />
            </div>
          </div>

          {/* Treasury partner branch (leaf) */}
          <div className="flex flex-col items-center">
            <div className="w-full">
              <FlowNode
                icon={<PartnersIcon className="size-full" />}
                title="Treasury Partner Portal"
                subtitle="Scoped to one partner's own data"
                tone="blue"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
