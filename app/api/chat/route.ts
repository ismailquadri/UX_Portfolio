import Anthropic from "@anthropic-ai/sdk";
import { SYSTEM_PROMPT } from "@/lib/chat-system-prompt";
import { formatRetrievedKnowledge, retrieveKnowledge } from "@/lib/knowledge-base";
import { verifyTurnstile } from "@/lib/turnstile";

export const runtime = "nodejs";
export const maxDuration = 60;

const MAX_HISTORY = 20;
const MAX_MESSAGE_LENGTH = 2_000;
const MAX_REQUEST_BYTES = 48_000;

type IncomingMessage = { role: "user" | "assistant"; content: string };
type ChatPayload = { messages: IncomingMessage[]; turnstileToken?: string };

function jsonError(error: string, status: number): Response {
  return Response.json({ error }, { status });
}

function isChatPayload(value: unknown): value is ChatPayload {
  if (typeof value !== "object" || value === null) return false;
  const candidate = value as Record<string, unknown>;
  return (
    Array.isArray(candidate.messages) &&
    candidate.messages.length > 0 &&
    candidate.messages.length <= MAX_HISTORY &&
    candidate.messages.every((message) => {
      if (typeof message !== "object" || message === null) return false;
      const item = message as Record<string, unknown>;
      return (
        (item.role === "user" || item.role === "assistant") &&
        typeof item.content === "string" &&
        item.content.length > 0 &&
        item.content.length <= MAX_MESSAGE_LENGTH
      );
    }) &&
    (candidate.turnstileToken === undefined ||
      typeof candidate.turnstileToken === "string")
  );
}

export async function POST(request: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return jsonError("chat_unavailable", 503);
  const contentLength = Number(request.headers.get("content-length"));
  if (Number.isFinite(contentLength) && contentLength > MAX_REQUEST_BYTES) {
    return jsonError("request_too_large", 413);
  }

  let body: unknown;
  try {
    const rawBody = await request.text();
    if (new TextEncoder().encode(rawBody).byteLength > MAX_REQUEST_BYTES) {
      return jsonError("request_too_large", 413);
    }
    body = JSON.parse(rawBody);
  } catch {
    return jsonError("invalid_json", 400);
  }

  if (!isChatPayload(body)) return jsonError("invalid_messages", 400);

  const secret = process.env.TURNSTILE_SECRET_KEY;
  const token = body.turnstileToken?.trim();
  if (
    process.env.NODE_ENV === "production" &&
    (!secret || !process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY)
  ) {
    return jsonError("security_check_unavailable", 503);
  }
  if (secret) {
    if (!token) return jsonError("security_check_required", 400);
    try {
      if (!(await verifyTurnstile(token, secret, new URL(request.url).hostname))) {
        return jsonError("security_check_failed", 400);
      }
    } catch {
      return jsonError("security_check_unavailable", 503);
    }
  }

  const client = new Anthropic({ apiKey });
  const messages = body.messages.slice(-MAX_HISTORY).map((message) => ({
    role: message.role,
    content: message.content,
  }));
  const userQuestions = body.messages.filter((message) => message.role === "user");
  const latestQuestion = userQuestions.at(-1)?.content ?? "";
  const retrievalQuestions = latestQuestion.trim().split(/\s+/).length < 6
    ? userQuestions.slice(-2)
    : [userQuestions.at(-1)!];
  const retrievalQuery = retrievalQuestions
    .map((message) => message.content)
    .join("\n")
    .slice(-3_000);
  const retrievedKnowledge = retrieveKnowledge(retrievalQuery);
  const systemPrompt = `${SYSTEM_PROMPT}\n\nRETRIEVED SOURCE MATERIAL\n${formatRetrievedKnowledge(retrievedKnowledge)}`;
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const encoder = new TextEncoder();
      try {
        const anthropicStream = client.messages.stream({
          model: process.env.ANTHROPIC_MODEL || "claude-sonnet-4-5",
          max_tokens: 512,
          system: systemPrompt,
          messages,
        });

        anthropicStream.on("text", (text) => {
          controller.enqueue(encoder.encode(text));
        });

        await anthropicStream.finalMessage();
        controller.close();
      } catch (error) {
        const details =
          typeof error === "object" && error !== null
            ? (error as { name?: unknown; status?: unknown; request_id?: unknown })
            : undefined;
        console.error("Chat completion stream failed", {
          name: typeof details?.name === "string" ? details.name : "UnknownError",
          status: typeof details?.status === "number" ? details.status : undefined,
          requestId:
            typeof details?.request_id === "string" ? details.request_id : undefined,
        });
        controller.error(new Error("chat_request_failed"));
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
