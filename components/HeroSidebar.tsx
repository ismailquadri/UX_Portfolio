"use client";

import Image from "next/image";

import { useScrollSpy } from "@/hooks/useScrollSpy";

const SIDEBAR_LINKS = [
  { label: "Send me Messages", href: "#chat" },
  { label: "Capability", href: "#capabilities" },
  { label: "Process", href: "#process" },
  { label: "The Result", href: "#result" },
  { label: "What They Said", href: "#tech-stack" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

const SECTION_IDS = SIDEBAR_LINKS.map((link) => link.href.slice(1));

export default function HeroSidebar() {
  const activeId = useScrollSpy(SECTION_IDS);
  const activeHref = activeId ? `#${activeId}` : SIDEBAR_LINKS[0].href;

  return (
    <div className="hidden md:flex h-[900px] w-[269px] shrink-0 flex-col items-start justify-center overflow-clip border-r border-border-subtle bg-surface">
      <div className="flex w-full flex-col items-start justify-center gap-8 py-10 pl-10 pr-4">
        <span className="relative block size-[30px] shrink-0">
          <Image src="/images/hero-logo.svg" alt="" fill sizes="30px" />
        </span>
        <nav className="flex w-full flex-col items-start">
          {SIDEBAR_LINKS.map((link) => {
            const isActive = link.href === activeHref;
            return (
              <a
                key={link.href}
                href={link.href}
                className={`relative flex w-full items-start gap-2.5 whitespace-nowrap p-2.5 font-body text-[16px] tracking-[-0.16px] text-ink ${
                  isActive ? "font-medium" : "font-medium opacity-30"
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute inset-x-0 bottom-0 h-px w-[213px] bg-border-subtle" />
                )}
              </a>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
