"use client";

import { useEffect, useRef } from "react";

const CALENDLY_URL =
  "https://calendly.com/quadri_ismail/call-with-quadri?hide_gdpr_banner=1";

export default function BookingModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    document.addEventListener("keydown", handleKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8"
      role="dialog"
      aria-modal="true"
      aria-label="Book a 15 minute call"
    >
      <button
        type="button"
        aria-label="Close booking dialog"
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-ink/60 backdrop-blur-sm"
      />
      <div className="relative flex h-full max-h-[760px] w-full max-w-[920px] flex-col overflow-hidden rounded-md border border-border-subtle bg-paper shadow-button">
        <div className="flex shrink-0 items-center justify-between gap-4 border-b border-border-subtle px-4 py-3">
          <p className="whitespace-nowrap font-body text-[14px] font-medium tracking-[-0.28px] text-ink">
            [ BOOK 15 MINS CALL ]
          </p>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex size-8 shrink-0 items-center justify-center rounded-sm border border-border-subtle bg-paper shadow-button transition-colors hover:bg-surface"
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M2 2L10 10M10 2L2 10"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
        <iframe
          src={CALENDLY_URL}
          title="Calendly scheduling calendar"
          className="h-full w-full flex-1 bg-white"
        />
      </div>
    </div>
  );
}
