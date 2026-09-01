"use client";

import { useId, useState } from "react";

export function AccordionItem({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  return (
    <div className="w-full rounded-lg border border-border-subtle bg-paper p-5 shadow-button">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full items-center justify-between gap-4 text-left"
        aria-expanded={open}
        aria-controls={panelId}
      >
        <span className="font-body text-[24px] font-medium leading-[1.6] tracking-[-0.24px] text-ink">
          {question}
        </span>
        <span
          className={`shrink-0 text-ink transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
          aria-hidden="true"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3 6L8 11L13 6"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </button>
      {open && (
        <p
          id={panelId}
          className="mt-3.5 font-body text-[24px] leading-[1.6] tracking-[-0.24px] text-ink/50"
        >
          {answer}
        </p>
      )}
    </div>
  );
}
