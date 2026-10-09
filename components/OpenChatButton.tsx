"use client";

import { ChatBubbleIcon } from "@radix-ui/react-icons";

export default function OpenChatButton({ children = "Ask about my work", className = "button-secondary" }: { children?: React.ReactNode; className?: string }) {
  return <button type="button" className={className} onClick={() => window.dispatchEvent(new Event("portfolio:open-chat"))}><ChatBubbleIcon aria-hidden="true" className="size-4" />{children}</button>;
}
