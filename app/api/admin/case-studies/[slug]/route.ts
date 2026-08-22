import { isDevOnly } from "@/lib/admin-guard";
import {
  getRawCaseStudyContent,
  saveCaseStudyContent,
  deleteCaseStudy,
  type RawCaseStudyContent,
} from "@/lib/case-study-admin";

export const runtime = "nodejs";

function jsonError(error: string, status: number): Response {
  return new Response(JSON.stringify({ error }), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  if (!isDevOnly()) return jsonError("not_found", 404);
  const { slug } = await params;
  const caseStudy = getRawCaseStudyContent(slug);
  if (!caseStudy) return jsonError("not_found", 404);
  return new Response(JSON.stringify({ caseStudy }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

function isRawCaseStudyContent(value: unknown): value is RawCaseStudyContent {
  if (typeof value !== "object" || value === null) return false;
  const { slug, title, category, summary } = value as Record<string, unknown>;
  return (
    typeof slug === "string" &&
    typeof title === "string" &&
    (category === "FinTech" || category === "AI-native" || category === "GovTech") &&
    typeof summary === "string"
  );
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  if (!isDevOnly()) return jsonError("not_found", 404);
  const { slug } = await params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError("invalid_json", 400);
  }

  if (!isRawCaseStudyContent(body)) {
    return jsonError("invalid_payload", 400);
  }

  saveCaseStudyContent(slug, body);
  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  if (!isDevOnly()) return jsonError("not_found", 404);
  const { slug } = await params;
  try {
    deleteCaseStudy(slug);
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "delete_failed", 404);
  }
  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
