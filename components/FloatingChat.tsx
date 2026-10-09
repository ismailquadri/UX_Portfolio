"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { ChatBubbleIcon, Cross2Icon } from "@radix-ui/react-icons";

const ChatWidget = dynamic(() => import("./ChatWidget"), { loading: () => <p className="p-6 text-sm" role="status">Opening the portfolio assistant...</p> });

export default function FloatingChat() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const launcher = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);
  const pathname = usePathname();
  const show = useCallback(() => {
    previousFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setMounted(true);
    setOpen(true);
  }, []);
  const close = useCallback(() => {
    setOpen(false);
    const target = previousFocus.current?.isConnected ? previousFocus.current : launcher.current;
    target?.focus();
  }, []);
  useEffect(() => {
    window.addEventListener("portfolio:open-chat", show);
    return () => window.removeEventListener("portfolio:open-chat", show);
  }, [show]);
  useEffect(() => {
    if (!open) return;
    panel.current?.focus();
    const handleKey = (event: KeyboardEvent) => { if (event.key === "Escape") close(); };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, close]);

  if (pathname.startsWith("/admin")) return null;
  return <aside className="chat-dock" aria-label="Portfolio assistant">
    {mounted && <div id="portfolio-chat" ref={panel} hidden={!open} tabIndex={-1} role="dialog" aria-label="Ask about Quadri" className="chat-panel" data-lenis-prevent>
      <div className="flex shrink-0 items-center justify-between border-b border-border-subtle px-5 py-4">
        <div><p className="font-medium text-ink">Ask about Quadri</p><p className="mt-0.5 text-xs text-muted">AI assistant for my work and experience</p></div>
        <button type="button" onClick={close} aria-label="Close chat" className="icon-button"><Cross2Icon className="size-5" /></button>
      </div>
      <ChatWidget />
    </div>}
    <button ref={launcher} type="button" onClick={open ? close : show} aria-expanded={open} aria-controls="portfolio-chat" aria-label={open ? "Close portfolio assistant" : "Open portfolio assistant"} className="chat-launcher">
      {open ? <Cross2Icon className="size-5" aria-hidden="true" /> : <ChatBubbleIcon className="size-5" aria-hidden="true" />}
      <span>{open ? "Close" : "Ask Quadri AI"}</span>
    </button>
  </aside>;
}
