"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const MOBILE_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Case Studies", href: "/case-studies" },
  { label: "Contact", href: "/contact" },
];

export default function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="relative md:hidden">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-label={open ? "Close menu" : "Open menu"}
        className="flex size-9 shrink-0 items-center justify-center rounded-sm border border-border-subtle bg-paper shadow-button"
      >
        <span className="flex flex-col items-center gap-[3px]">
          <span className="block h-[1.5px] w-4 bg-ink" />
          <span className="block h-[1.5px] w-4 bg-ink" />
          <span className="block h-[1.5px] w-4 bg-ink" />
        </span>
      </button>

      {open && (
        <div className="absolute right-0 top-[calc(100%+8px)] z-50 flex w-[220px] flex-col gap-1 rounded-sm border border-border-subtle bg-paper p-2 shadow-button">
          {MOBILE_LINKS.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`rounded-sm px-3 py-2 font-body text-[16px] tracking-[-0.16px] text-ink ${
                  isActive ? "bg-surface font-medium" : "font-medium opacity-50"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
