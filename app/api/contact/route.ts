import { Resend } from "resend";

export const runtime = "nodejs";

type ContactPayload = {
  name: string;
  email: string;
  interest: string;
  message: string;
};

function isContactPayload(value: unknown): value is ContactPayload {
  if (typeof value !== "object" || value === null) return false;
  const { name, email, interest, message } = value as Record<string, unknown>;
  return (
    typeof name === "string" &&
    name.trim().length > 0 &&
    typeof email === "string" &&
    email.includes("@") &&
    typeof interest === "string" &&
    interest.trim().length > 0 &&
    typeof message === "string" &&
    message.trim().length > 0
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

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError("invalid_json", 400);
  }

  if (!isContactPayload(body)) {
    return jsonError("invalid_payload", 400);
  }

  const resend = new Resend(apiKey);

  try {
    await resend.emails.send({
      from: "Portfolio Contact Form <onboarding@resend.dev>",
      to: "hello@quadriismail.com",
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
