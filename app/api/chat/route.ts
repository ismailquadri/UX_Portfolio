import Anthropic from "@anthropic-ai/sdk";
import { SYSTEM_PROMPT } from "@/lib/chat-system-prompt";

export const runtime = "nodejs";

const MAX_HISTORY = 20;

type IncomingMessage = { role: "user" | "assistant"; content: string };

function jsonError(error: string, status: number): Response {
  return new Response(JSON.stringify({ error }), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function isIncomingMessage(value: unknown): value is IncomingMessage {
  if (typeof value !== "object" || value === null) return false;
  const { role, content } = value as Record<string, unknown>;
  return (
    (role === "user" || role === "assistant") && typeof content === "string"
  );
}

export async function POST(request: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return jsonError("missing_api_key", 500);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError("invalid_json", 400);
  }

  const messages = (body as { messages?: unknown } | null)?.messages;
  if (
    !Array.isArray(messages) ||
    messages.length === 0 ||
    !messages.every(isIncomingMessage)
  ) {
    return jsonError("invalid_messages", 400);
  }

  const history = messages.slice(-MAX_HISTORY);

  const client = new Anthropic({ apiKey });

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      try {
        const anthropicStream = client.messages.stream({
          model: "claude-sonnet-4-5",
          max_tokens: 512,
          system: SYSTEM_PROMPT,
          messages: history.map((m) => ({ role: m.role, content: m.content })),
        });

        anthropicStream.on("text", (text) => {
          controller.enqueue(encoder.encode(text));
        });

        await anthropicStream.finalMessage();
        controller.close();
      } catch (error) {
        controller.error(error);
      }
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
