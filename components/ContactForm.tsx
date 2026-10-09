"use client";

import { useId, useRef, useState, type FormEvent } from "react";
import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";

const INTEREST_OPTIONS = [
  "Full-time product design role",
  "Contract or fractional role",
  "Product design project",
  "Other",
] as const;

type SubmitState = "idle" | "sending" | "success" | "error";

export default function ContactForm() {
  const verification = useRef<TurnstileInstance>(null);
  const submitting = useRef(false);
  const [verifying, setVerifying] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [interest, setInterest] = useState("");
  const [message, setMessage] = useState("");
  const [state, setState] = useState<SubmitState>("idle");
  const [turnstileToken, setTurnstileToken] = useState("");
  const [turnstileResetKey, setTurnstileResetKey] = useState(0);

  const nameId = useId();
  const emailId = useId();
  const interestId = useId();
  const messageId = useId();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting.current) return;
    submitting.current = true;
    setState("sending");
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 45_000);
    try {
      let token = turnstileToken;
      if (process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && !token) {
        setVerifying(true);
        if (!verification.current) throw new Error("verification_not_ready");
        token = await verification.current.getResponsePromise(30_000);
      }
      setVerifying(false);
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, interest, message, turnstileToken: token }),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error("contact_request_failed");
      }

      setState("success");
      setName("");
      setEmail("");
      setInterest("");
      setMessage("");
      setTurnstileToken("");
    } catch {
      setState("error");
    } finally {
      clearTimeout(timer);
      submitting.current = false;
      setVerifying(false);
      setTurnstileToken("");
      setTurnstileResetKey((key) => key + 1);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-[576px] flex-col gap-10">
      <div className="flex w-full flex-col gap-6">
        <div className="grid w-full gap-6 sm:grid-cols-2">
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
              autoComplete="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
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
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="h-[58px] w-full rounded-sm border-[0.6px] border-border-subtle bg-surface px-4 py-3 font-body text-[16px] tracking-[-0.16px] text-ink outline-none placeholder:text-ink/50"
            />
          </div>
        </div>
        <div className="flex w-full flex-col gap-3">
          <label
            htmlFor={interestId}
            className="font-body text-[16px] font-medium tracking-[-0.16px] text-ink"
          >
            I&rsquo;m reaching out about *
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
            placeholder="Share a little about the role, project, or question."
            className="h-[180px] w-full resize-none rounded-sm border-[0.6px] border-border-subtle bg-surface px-4 py-3 font-body text-[16px] tracking-[-0.16px] text-ink outline-none placeholder:text-ink/50"
          />
        </div>
      </div>
      {process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && (
        <div>
          <Turnstile
            ref={verification}
            options={{ appearance: "interaction-only", size: "flexible" }}
            key={turnstileResetKey}
            siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
            onSuccess={setTurnstileToken}
            onExpire={() => setTurnstileToken("")}
            onError={() => setTurnstileToken("")}
          />
          {!turnstileToken && state === "error" && (
            <p className="mt-2 font-body text-[14px] text-ink" role="alert">
              Please complete the security check and try again.
            </p>
          )}
        </div>
      )}
      <button
        type="submit"
        disabled={state === "sending"}
        className="flex h-[41px] w-full items-center justify-center rounded-sm bg-ink font-body text-[14px] font-medium tracking-[-0.28px] text-paper disabled:opacity-60"
      >
        {verifying ? "Checking..." : state === "sending" ? "Sending..." : "Send message"}
      </button>
      {state === "success" && (
        <p role="status" className="font-body text-[14px] text-ink">
          Thanks, your message has been sent. I&rsquo;ll usually reply within 24 hours.
        </p>
      )}
      {state === "error" && (
        <p role="status" className="font-body text-[14px] text-ink">
          Your message didn&rsquo;t go through. Try again in a moment, or email
          hello@quadriismail.com directly.
        </p>
      )}
    </form>
  );
}
