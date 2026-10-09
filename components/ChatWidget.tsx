"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { usePathname } from "next/navigation";
import { Link } from "next-view-transitions";
import { ArrowUpIcon, ResetIcon, StopIcon } from "@radix-ui/react-icons";
import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";
import ReactMarkdown from "react-markdown";
import type { ChatMessage } from "@/lib/chat-seed";

const HISTORY_KEY = "quadri-chat-history";
const MAX_HISTORY = 20;

export default function ChatWidget() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [hydrated, setHydrated] = useState(false);
  const turnstile = useRef<TurnstileInstance>(null);
  const scroll = useRef<HTMLDivElement>(null);
  const follow = useRef(true);
  const busy = useRef(false);
  const controller = useRef<AbortController | null>(null);
  const cancelled = useRef(false);
  const pathname = usePathname();
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const prompts = pathname.startsWith("/case-studies/")
    ? ["What decisions shaped this project?", "What was your role?", "Which project is most relevant to my team?"]
    : pathname.startsWith("/blog")
      ? ["What have you written about design?", "How do you measure growth as a designer?", "How do you approach research?"]
      : ["Give me a quick introduction", "What kind of role are you looking for?", "Which project should I look at first?"];

  useEffect(() => {
    let saved: ChatMessage[] = [];
    try {
      const value: unknown = JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
      if (Array.isArray(value)) saved = value.filter((item): item is ChatMessage => item && (item.role === "user" || item.role === "assistant") && typeof item.content === "string" && typeof item.created_at === "string" && item.content.trim()).slice(-MAX_HISTORY);
    } catch { /* Chat remains usable when browser storage is unavailable. */ }
    const frame = requestAnimationFrame(() => { setMessages(saved); setHydrated(true); });
    return () => { cancelAnimationFrame(frame); controller.current?.abort(); };
  }, []);
  useEffect(() => {
    if (!hydrated || sending) return;
    try { localStorage.setItem(HISTORY_KEY, JSON.stringify(messages.slice(-MAX_HISTORY))); } catch { /* Storage is optional. */ }
  }, [messages, hydrated, sending]);
  useEffect(() => {
    if (follow.current && scroll.current) scroll.current.scrollTop = scroll.current.scrollHeight;
  }, [messages, status]);

  async function send(question: string) {
    if (busy.current || !question.trim()) return;
    busy.current = true;
    cancelled.current = false;
    follow.current = true;
    const history = [...messages, { role: "user" as const, content: question.trim(), created_at: new Date().toISOString() }].slice(-(MAX_HISTORY - 1));
    if (history[0]?.role === "assistant") history.shift();
    const reply: ChatMessage = { role: "assistant", content: "", created_at: new Date().toISOString() };
    setMessages([...history, reply]);
    setInput("");
    setError("");
    setSending(true);
    setStatus(siteKey ? "Checking connection..." : "Thinking...");
    let responseText = "";
    let timedOut = false;
    const abort = new AbortController();
    controller.current = abort;
    const timer = setTimeout(() => { timedOut = true; abort.abort(); }, 60_000);
    try {
      let token: string | undefined;
      if (siteKey) {
        if (!turnstile.current) throw new Error("Verification is loading. Please try again in a moment.");
        token = await turnstile.current.getResponsePromise(30_000);
      }
      if (abort.signal.aborted) throw new Error("Request stopped.");
      setStatus("Thinking...");
      const result = await fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, signal: abort.signal, body: JSON.stringify({ messages: history.map(({ role, content }) => ({ role, content })), turnstileToken: token, pagePath: pathname }) });
      if (!result.ok || !result.body) throw new Error("I couldn't get a reply. Please try again, or email hello@quadriismail.com.");
      const reader = result.body.getReader();
      const decoder = new TextDecoder();
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        responseText += decoder.decode(value, { stream: true });
        setMessages([...history, { ...reply, content: responseText }]);
      }
      responseText += decoder.decode();
      if (!responseText.trim()) throw new Error("The reply was empty. Please try again.");
      setMessages([...history, { ...reply, content: responseText }]);
    } catch (caught) {
      setMessages(responseText ? [...history, { ...reply, content: responseText }] : history.slice(0, -1));
      if (!responseText) setInput(question);
      if (!cancelled.current) setError(timedOut ? "This is taking longer than expected. Please try again." : caught instanceof Error ? caught.message : "Something went wrong. Please try again.");
    } finally {
      clearTimeout(timer);
      controller.current = null;
      turnstile.current?.reset();
      busy.current = false;
      setSending(false);
      setStatus("");
    }
  }
  function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); void send(input); }

  return <div className="flex min-h-0 flex-1 flex-col">
    <div ref={scroll} onScroll={() => { if (scroll.current) follow.current = scroll.current.scrollHeight - scroll.current.scrollTop - scroll.current.clientHeight < 64; }} className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-5" data-lenis-prevent>
      {messages.length === 0 && <div className="py-4">
        <p className="eyebrow">A quicker way to get to know my work</p>
        <h2 className="mt-3 font-heading text-3xl leading-tight">What would you like to know?</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted">Ask about my projects, experience, or the roles I’m looking for. Answers draw on my portfolio and public writing.</p>
        <div className="mt-6 flex flex-col gap-2">{prompts.map(prompt => <button key={prompt} type="button" disabled={sending || !hydrated} onClick={() => void send(prompt)} className="rounded-xl border border-border-subtle bg-surface px-4 py-3 text-left text-sm transition-colors hover:border-accent/40 hover:bg-white disabled:opacity-50">{prompt}</button>)}</div>
      </div>}
      <div role="log" aria-label="Conversation" aria-live="polite" aria-relevant="additions" aria-busy={sending} className="space-y-4">
        {messages.map((message, index) => <div key={`${message.created_at}-${index}`} className={message.role === "user" ? "ml-8 rounded-2xl rounded-br-sm bg-accent px-4 py-3 text-sm leading-relaxed text-white" : "chat-prose mr-2 text-sm leading-relaxed text-ink"}>
          <span className="sr-only">{message.role === "user" ? "You: " : "Portfolio assistant: "}</span>
          {message.role === "user" ? message.content : message.content ? <ReactMarkdown components={{ a: ({ href, children }) => {
            const internal = href?.startsWith("/") || href?.startsWith("https://quadriismail.com/");
            return internal ? <Link href={href!.replace("https://quadriismail.com", "")}>{children}</Link> : <a href={href} target="_blank" rel="noopener noreferrer">{children}</a>;
          } }}>{message.content}</ReactMarkdown> : <p role="status" className="text-muted">{status || "Thinking..."}</p>}
        </div>)}
      </div>
    </div>
    <div className="shrink-0 border-t border-border-subtle bg-paper p-4">
      {error && <p role="alert" className="mb-3 text-sm text-red-700">{error}</p>}
      {siteKey && <Turnstile siteKey={siteKey} ref={turnstile} options={{ appearance: "interaction-only", size: "flexible" }} />}
      <form onSubmit={submit} className="flex items-center gap-2 rounded-xl border border-border-subtle bg-surface p-2 focus-within:border-accent">
        <label htmlFor="portfolio-question" className="sr-only">Your question</label>
        <input id="portfolio-question" value={input} onChange={event => setInput(event.target.value)} maxLength={2000} placeholder="Ask about my work..." disabled={sending} className="min-w-0 flex-1 bg-transparent px-2 py-2 text-base outline-none" />
        {sending ? <button type="button" aria-label="Stop response" className="icon-button" onClick={() => { cancelled.current = true; controller.current?.abort(); }}><StopIcon /></button> : <button type="submit" aria-label="Send message" disabled={!input.trim() || !hydrated} className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent text-white disabled:opacity-40"><ArrowUpIcon className="size-5" /></button>}
      </form>
      <div className="mt-3 flex items-center justify-between gap-3 text-xs text-muted"><span>AI can make mistakes. <a href="/contact" className="underline underline-offset-2">Contact me</a></span><button type="button" disabled={sending || !messages.length} className="flex shrink-0 items-center gap-1 py-1 disabled:opacity-40" onClick={() => { setMessages([]); setError(""); setInput(""); }}><ResetIcon />New chat</button></div>
    </div>
  </div>;
}
