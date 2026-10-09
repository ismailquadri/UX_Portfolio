import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import links from "@/content/articles.json";

export type Article = {
  slug: string;
  title: string;
  description: string;
  kind: "writing" | "reading";
  author: string;
  source: string;
  url?: string;
  addedAt: string;
  publishedAt?: string;
  tags: string[];
  body?: string;
};
const directory = path.join(process.cwd(), "content/blog");

export function getArticles(): Article[] {
  const external = links.map(item => {
    if (!["writing", "reading"].includes(item.kind) || new URL(item.url).protocol !== "https:") throw new Error("Invalid linked article");
    return item as Article;
  });
  const local = fs.existsSync(directory) ? fs.readdirSync(directory).filter(name => name.endsWith(".md")).flatMap(name => {
    const { data, content } = matter(fs.readFileSync(path.join(directory, name), "utf8"));
    if (data.draft === true) return [];
    const slug = name.replace(/\.md$/, "");
    if (!/^[a-z0-9-]+$/.test(slug) || !data.title || !data.description || !/^\d{4}-\d{2}-\d{2}$/.test(String(data.publishedAt))) throw new Error(`Invalid blog metadata: ${name}`);
    return [{ slug, title: String(data.title), description: String(data.description), kind: "writing" as const, author: "Quadri Ismail", source: "On this site", addedAt: String(data.publishedAt), publishedAt: String(data.publishedAt), tags: Array.isArray(data.tags) ? data.tags.map(String) : [], body: content }];
  }) : [];
  return [...external, ...local].sort((a, b) => (b.publishedAt || b.addedAt).localeCompare(a.publishedAt || a.addedAt));
}
export function getArticle(slug: string) { return getArticles().find(article => article.slug === slug && !article.url); }
