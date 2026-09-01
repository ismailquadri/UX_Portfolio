"use client";

import Image from "next/image";
import { useState } from "react";

import BookingModal from "@/components/BookingModal";

/**
 * Single source of truth for every "Book 15 Mins Call" trigger on the site.
 * Owns its own modal state, so it can be dropped anywhere (nav, hero, CTA
 * sections) without prop-drilling open/close handlers through parents —
 * and it guarantees every instance opens the same Calendly modal instead of
 * some linking to Calendly and others falling back to a mailto link.
 */
export default function BookCallButton({
  className,
  showIcon = true,
  label = "Book 15 Mins Call",
  onClick,
}: {
  className?: string;
  showIcon?: boolean;
  label?: string;
  /** Fires before the modal opens — e.g. to close a mobile menu first. */
  onClick?: () => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => {
          onClick?.();
          setOpen(true);
        }}
        className={className}
      >
        {label}
        {showIcon && (
          <Image
            src="/images/call-icon.png"
            alt=""
            width={17}
            height={14}
            className="h-[14px] w-[17px] object-cover"
          />
        )}
      </button>
      <BookingModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
