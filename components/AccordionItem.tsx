"use client";

import { useState } from "react";

export function AccordionItem({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="w-full rounded-lg border border-border-subtle bg-white/70 p-5 backdrop-blur-[22px] shadow-[0px_4px_5px_0px_rgba(0,0,0,0.02),0px_2px_0px_0px_rgba(0,0,0,0.05)]">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full items-center justify-between gap-4 text-left"
        aria-expanded={open}
      >
        <span className="font-body text-[24px] font-medium leading-[1.6] tracking-[-0.24px] text-accent">
          {question}
        </span>
        <span
          className={`shrink-0 text-accent transition-transform duration-200 ${
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
        <p className="mt-3.5 font-body text-[24px] leading-[1.6] tracking-[-0.24px] text-accent opacity-50">
          {answer}
        </p>
      )}
    </div>
  );
}
