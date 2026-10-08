import { Resend } from "resend";
import { verifyTurnstile } from "@/lib/turnstile";

export const runtime = "nodejs";
const MAX_REQUEST_BYTES = 12_000;
const MAX_FIELD_LENGTH = 4_000;

type ContactPayload = {
  name: string;
  email: string;
  interest: string;
  message: string;
  turnstileToken?: string;
};

function isContactPayload(value: unknown): value is ContactPayload {
  if (typeof value !== "object" || value === null) return false;
  const { name, email, interest, message, turnstileToken } =
    value as Record<string, unknown>;
  return (
    typeof name === "string" &&
    name.trim().length > 0 && name.length <= 120 &&
    typeof email === "string" &&
    email.includes("@") && email.length <= 254 &&
    typeof interest === "string" &&
    interest.trim().length > 0 && interest.length <= 120 &&
    typeof message === "string" &&
    message.trim().length > 0 && message.length <= MAX_FIELD_LENGTH &&
    (turnstileToken === undefined || typeof turnstileToken === "string")
  );
}

function jsonError(error: string, status: number): Response {
  return new Response(JSON.stringify({ error }), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST(request: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return jsonError("missing_api_key", 500);
  }
  const contentLength = Number(request.headers.get("content-length"));
  if (Number.isFinite(contentLength) && contentLength > MAX_REQUEST_BYTES) {
    return jsonError("request_too_large", 413);
  }
  const from =
    process.env.RESEND_FROM_EMAIL || "Portfolio Contact Form <onboarding@resend.dev>";
  const to = process.env.CONTACT_TO_EMAIL || "hello@quadriismail.com";

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

  if (!isContactPayload(body)) {
    return jsonError("invalid_payload", 400);
  }

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
      const hostname = new URL(request.url).hostname;
      if (!(await verifyTurnstile(token, secret, hostname))) {
        return jsonError("security_check_failed", 400);
      }
    } catch {
      return jsonError("security_check_unavailable", 503);
    }
  }

  const resend = new Resend(apiKey);

  try {
    await resend.emails.send({
      from,
      to,
      replyTo: body.email,
      subject: `New message from ${body.name} (${body.interest})`,
      text: `Name: ${body.name}\nEmail: ${body.email}\nInterested in: ${body.interest}\n\n${body.message}`,
    });
  } catch {
    return jsonError("send_failed", 502);
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
