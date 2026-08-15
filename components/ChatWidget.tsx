"use client";

import Image from "next/image";
import { useState, type FormEvent } from "react";
import { SEED_MESSAGES, type ChatMessage } from "@/lib/chat-seed";

export default function ChatWidget() {
  const [messages, setMessages] = useState<ChatMessage[]>(SEED_MESSAGES);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isSending) return;

    setMessages((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        role: "user",
        content: trimmed,
        timestamp: "Just Now",
      },
    ]);
    setInput("");
    // network call added in Task 23 (Task 22 builds the /api/chat route)
  }

  return (
    <div
      id="chat"
      className="absolute left-1/2 top-[53px] flex h-[641px] w-[420px] -translate-x-1/2 items-center gap-2.5 rounded-lg bg-paper/40 p-3 backdrop-blur-md"
    >
      <div className="flex h-full w-full flex-col items-center justify-end gap-4 overflow-hidden rounded-md border border-paper bg-paper/[0.79] p-2.5">
        {/* Header */}
        <div className="flex shrink-0 flex-col items-center justify-center gap-2.5">
          <span className="relative block size-[50px] shrink-0 overflow-hidden rounded-full bg-border-subtle">
            <Image
              src="/images/avatar.png"
              alt="Milke Helper avatar"
              fill
              sizes="50px"
              className="object-cover"
            />
          </span>
          <p className="font-body text-[16px] tracking-[-0.16px] text-ink">
            Milke Helper
          </p>
        </div>

        {/* Message list */}
        <div className="flex w-full flex-1 flex-col justify-end gap-2 overflow-y-auto py-3">
          {messages.map((message) => {
            const isUser = message.role === "user";
            return (
              <div
                key={message.id}
                className={`flex w-full flex-col gap-1 ${
                  isUser ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-md px-4 py-3 font-body text-[16px] leading-[1.4] tracking-[-0.16px] ${
                    isUser
                      ? "bg-gradient-to-b from-[#454545] to-[#1d1d1d] text-paper/90"
                      : "bg-paper text-ink/90"
                  }`}
                >
                  <p>{message.content}</p>
                </div>
                <p
                  className={`font-body text-[12px] font-medium tracking-[-0.24px] text-ink/50 ${
                    isUser ? "text-right" : "text-left"
                  }`}
                >
                  {message.timestamp}
                </p>
              </div>
            );
          })}
        </div>

        {/* Input row */}
        <form
          onSubmit={handleSubmit}
          className="flex h-10 w-full shrink-0 items-center gap-2.5 rounded-full border border-paper bg-paper py-1 pl-3 pr-1 shadow-button"
        >
          <input
            type="text"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Send us message"
            className="min-w-0 flex-1 bg-transparent font-body text-[16px] tracking-[-0.16px] text-ink outline-none placeholder:text-ink/40"
          />
          <button
            type="submit"
            aria-label="Send message"
            className="flex size-8 shrink-0 items-center justify-center rounded-full border border-[#353535] bg-gradient-to-b from-black to-[#666]"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              className="rotate-180 scale-y-[-1]"
              aria-hidden="true"
            >
              <path
                d="M4.5 4.5H13.5V13.5"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M13.5 4.5L4.5 13.5"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}
