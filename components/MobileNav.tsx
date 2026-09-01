"use client";

import { Link } from "next-view-transitions";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import BookCallButton from "@/components/BookCallButton";

const MOBILE_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Case Studies", href: "/case-studies" },
  { label: "Contact", href: "/contact" },
];

export default function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const containerRef = useRef<HTMLDivElement>(null);

  // Close the menu when the route changes (covers back/forward navigation;
  // in-app link clicks close it via onClick). Adjusting state during render is
  // the pattern recommended over an effect for derived resets.
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <div ref={containerRef} className="relative md:hidden">
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
        <nav
          aria-label="Mobile"
          className="absolute right-0 top-[calc(100%+8px)] z-50 flex w-[220px] flex-col gap-1 rounded-sm border border-border-subtle bg-paper p-2 shadow-button"
        >
          {MOBILE_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={`rounded-sm px-3 py-2 font-body text-[16px] tracking-[-0.16px] text-ink ${
                isActive(link.href) ? "bg-surface font-medium" : "font-medium opacity-50"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <BookCallButton
            onClick={() => setOpen(false)}
            showIcon={false}
            className="mt-1 rounded-sm border-t border-border-subtle px-3 pt-3 text-left font-body text-[16px] font-medium tracking-[-0.16px] text-ink"
          />
        </nav>
      )}
    </div>
  );
}
