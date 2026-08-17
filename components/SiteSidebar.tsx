"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const SITE_LINKS = [
  { label: "About", href: "/about" },
  { label: "Case Studies", href: "/case-studies" },
  { label: "Contact", href: "/contact" },
];

export default function SiteSidebar() {
  const pathname = usePathname();

  return (
    <div className="sticky top-[84px] hidden h-[calc(100vh-84px)] w-[269px] shrink-0 flex-col items-start justify-center overflow-clip border-r border-border-subtle bg-surface md:flex">
      <div className="flex w-full flex-col items-start justify-center gap-8 py-10 pl-10 pr-4">
        <Link
          href="/"
          aria-label="Home"
          className="relative block size-[30px] shrink-0"
        >
          <Image src="/images/hero-logo.svg" alt="" fill sizes="30px" />
        </Link>
        <nav className="flex w-full flex-col items-start">
          {SITE_LINKS.map((link) => {
            const isActive = pathname.startsWith(link.href);
            return (
              <Link
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
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
