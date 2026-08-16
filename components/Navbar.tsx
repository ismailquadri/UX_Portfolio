"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const SCROLL_THRESHOLD = 80;

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > SCROLL_THRESHOLD);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`sticky top-0 z-50 flex w-full items-start bg-paper transition-[border-color] duration-200 ${
        scrolled ? "border-b border-border-subtle" : "border-b border-transparent"
      }`}
    >
      <div className="hidden md:flex h-[84px] w-[269px] shrink-0 items-center justify-center gap-3 border-r border-border-subtle px-10 py-4">
        <span className="relative block size-4 shrink-0 -m-1">
          <Image
            src="/images/button-notification.svg"
            alt=""
            fill
            sizes="16px"
          />
        </span>
        <p className="whitespace-nowrap font-body text-[16px] leading-[1.4] tracking-[-0.16px] text-ink">
          2 Project Slots Available
        </p>
      </div>

      <div className="flex h-[83px] flex-1 min-w-px items-center gap-3 px-6 py-4">
        <div className="flex w-full flex-1 min-w-0 flex-col items-start justify-center gap-1 overflow-hidden">
          <div className="flex items-center gap-2.5">
            <p className="whitespace-nowrap font-body text-[16px] leading-[1.4] tracking-[-0.16px] text-ink">
              Hello,
            </p>
            <div className="flex items-center gap-2">
              <span className="relative block size-7 shrink-0 overflow-hidden rounded-sm bg-surface">
                <Image
                  src="/images/avatar.png"
                  alt="Mike's avatar"
                  fill
                  sizes="28px"
                  className="object-cover"
                />
              </span>
              <p className="whitespace-nowrap font-body text-[16px] leading-[1.4] tracking-[-0.16px] text-ink">
                Mike&rsquo;s here!
              </p>
            </div>
          </div>
          <p className="w-full max-w-full truncate font-body text-[16px] leading-[1.4] tracking-[-0.16px] text-ink opacity-40">
            A Product Designer with a focus on B2B
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <button
            type="button"
            className="hidden h-9 shrink-0 items-center justify-center gap-2 rounded-sm border border-border-subtle bg-paper px-3 py-2 font-body text-[14px] font-medium tracking-[-0.28px] text-ink shadow-button sm:flex"
          >
            Book 15 Mins Call
            <Image
              src="/images/call-icon.png"
              alt=""
              width={17}
              height={14}
              className="h-[14px] w-[17px] object-cover"
            />
          </button>
          <button
            type="button"
            className="flex h-9 shrink-0 items-center justify-center gap-2 rounded-sm border border-white bg-black px-3 py-2 font-body text-[14px] font-medium tracking-[-0.28px] text-paper shadow-[0px_6px_6px_-3px_rgba(0,0,0,0.25),0px_0px_0px_2px_rgba(0,0,0,0.15)]"
            style={{
              backgroundImage:
                "radial-gradient(ellipse 8.3px 3.6px at 50% 0%, rgba(255,255,255,0.3) 11.881%, rgba(255,255,255,0) 100%)",
            }}
          >
            About Me
          </button>
        </div>
      </div>
    </div>
  );
}
