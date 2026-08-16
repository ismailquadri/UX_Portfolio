"use client";

import { useId, useState, type FormEvent } from "react";

const INTEREST_OPTIONS = [
  "UX Audit",
  "User Segmentation & Insights",
  "UI/UX Design & Prototyping",
  "MVP Product Development",
] as const;

type SubmitState = "idle" | "sending" | "success" | "error";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [interest, setInterest] = useState("");
  const [message, setMessage] = useState("");
  const [state, setState] = useState<SubmitState>("idle");

  const nameId = useId();
  const emailId = useId();
  const interestId = useId();
  const messageId = useId();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // network call added in a later task (a separate task builds the /api/contact route)
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-[576px] flex-col gap-10">
      <div className="flex w-full flex-col gap-6">
        <div className="flex w-full items-start gap-6">
          <div className="flex flex-1 flex-col gap-3">
            <label
              htmlFor={nameId}
              className="font-body text-[16px] font-medium tracking-[-0.16px] text-ink"
            >
              Name *
            </label>
            <input
              id={nameId}
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              className="h-[58px] w-full rounded-sm border-[0.6px] border-border-subtle bg-surface px-4 py-3 font-body text-[16px] tracking-[-0.16px] text-ink outline-none placeholder:text-ink/50"
            />
          </div>
          <div className="flex flex-1 flex-col gap-3">
            <label
              htmlFor={emailId}
              className="font-body text-[16px] font-medium tracking-[-0.16px] text-ink"
            >
              E-mail *
            </label>
            <input
              id={emailId}
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="hello@site.com"
              className="h-[58px] w-full rounded-sm border-[0.6px] border-border-subtle bg-surface px-4 py-3 font-body text-[16px] tracking-[-0.16px] text-ink outline-none placeholder:text-ink/50"
            />
          </div>
        </div>
        <div className="flex w-full flex-col gap-3">
          <label
            htmlFor={interestId}
            className="font-body text-[16px] font-medium tracking-[-0.16px] text-ink"
          >
            I&rsquo;m interested in *
          </label>
          <select
            id={interestId}
            required
            value={interest}
            onChange={(e) => setInterest(e.target.value)}
            className="h-[58px] w-full rounded-sm border-[0.6px] border-border-subtle bg-surface px-4 py-3 font-body text-[16px] tracking-[-0.16px] text-ink outline-none"
          >
            <option value="" disabled>
              Select
            </option>
            {INTEREST_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <div className="flex w-full flex-col gap-3">
          <label
            htmlFor={messageId}
            className="font-body text-[16px] font-medium tracking-[-0.16px] text-ink"
          >
            Message *
          </label>
          <textarea
            id={messageId}
            required
            rows={5}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Tell me about your ideas"
            className="h-[180px] w-full resize-none rounded-sm border-[0.6px] border-border-subtle bg-surface px-4 py-3 font-body text-[16px] tracking-[-0.16px] text-ink outline-none placeholder:text-ink/50"
          />
        </div>
      </div>
      <button
        type="submit"
        disabled={state === "sending"}
        className="flex h-[41px] w-full items-center justify-center rounded-sm bg-ink font-body text-[14px] font-medium tracking-[-0.28px] text-paper disabled:opacity-60"
      >
        {state === "sending" ? "Sending..." : "Submit"}
      </button>
      {state === "success" && (
        <p className="font-body text-[14px] text-ink">
          Thanks — your message is on its way. I&rsquo;ll get back to you within 24 hours.
        </p>
      )}
      {state === "error" && (
        <p className="font-body text-[14px] text-ink">
          Something went wrong sending your message — try again in a moment, or email
          hello@mike.com directly.
        </p>
      )}
    </form>
  );
}
