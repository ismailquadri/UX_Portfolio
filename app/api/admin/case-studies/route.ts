import { isDevOnly } from "@/lib/admin-guard";
import { getAllRawCaseStudies, createCaseStudy } from "@/lib/case-study-admin";
import type { CaseStudyCategory } from "@/lib/case-studies";

export const runtime = "nodejs";

function jsonError(error: string, status: number): Response {
  return new Response(JSON.stringify({ error }), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export async function GET() {
  if (!isDevOnly()) return jsonError("not_found", 404);
  const caseStudies = getAllRawCaseStudies();
  return new Response(JSON.stringify({ caseStudies }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

type CreatePayload = {
  slug: string;
  title: string;
  category: CaseStudyCategory;
  summary: string;
};

function isCreatePayload(value: unknown): value is CreatePayload {
  if (typeof value !== "object" || value === null) return false;
  const { slug, title, category, summary } = value as Record<string, unknown>;
  return (
    typeof slug === "string" &&
    /^[a-z0-9-]+$/.test(slug) &&
    typeof title === "string" &&
    title.trim().length > 0 &&
    (category === "FinTech" || category === "AI-native" || category === "GovTech") &&
    typeof summary === "string" &&
    summary.trim().length > 0
  );
}

export async function POST(request: Request) {
  if (!isDevOnly()) return jsonError("not_found", 404);

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError("invalid_json", 400);
  }

  if (!isCreatePayload(body)) {
    return jsonError("invalid_payload", 400);
  }

  try {
    createCaseStudy(body);
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "create_failed", 409);
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 201,
    headers: { "Content-Type": "application/json" },
  });
}
