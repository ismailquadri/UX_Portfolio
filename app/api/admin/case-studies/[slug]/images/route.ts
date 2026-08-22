import fs from "fs";
import path from "path";
import sharp from "sharp";
import { isDevOnly } from "@/lib/admin-guard";

export const runtime = "nodejs";

function jsonError(error: string, status: number): Response {
  return new Response(JSON.stringify({ error }), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function sanitizeFilename(name: string): string {
  const ext = path.extname(name).toLowerCase() || ".png";
  const base = path
    .basename(name, path.extname(name))
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  return `${base || "image"}${ext}`;
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  if (!isDevOnly()) return jsonError("not_found", 404);
  const { slug } = await params;

  if (!/^[a-z0-9-]+$/.test(slug)) {
    return jsonError("invalid_slug", 400);
  }

  const formData = await request.formData();
  const file = formData.get("file");
  const maxWidthRaw = formData.get("maxWidth");
  const maxWidth = typeof maxWidthRaw === "string" ? parseInt(maxWidthRaw, 10) : 1200;

  if (!(file instanceof File)) {
    return jsonError("missing_file", 400);
  }

  const dir = path.join(process.cwd(), "public", "images", "case-studies", slug);
  fs.mkdirSync(dir, { recursive: true });

  const sanitized = sanitizeFilename(file.name);
  let filename = sanitized;
  let counter = 1;
  while (fs.existsSync(path.join(dir, filename))) {
    const ext = path.extname(sanitized);
    const base = path.basename(sanitized, ext);
    filename = `${base}-${counter}${ext}`;
    counter += 1;
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const resized = await sharp(buffer)
    .resize({ width: maxWidth, withoutEnlargement: true })
    .toBuffer();

  fs.writeFileSync(path.join(dir, filename), resized);

  return new Response(
    JSON.stringify({ path: `/images/case-studies/${slug}/${filename}` }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
}
