import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { RootContent } from "mdast";
import {
  parseMarkdownBody,
  splitByHeadingText,
  listItemsWithLeadingImage,
  extractLeadingImages,
  nodesToSourceText,
} from "./markdown-sections";
import type {
  CaseStudyCategory,
  CaseStudyMetric,
  CaseStudyProcessInsight,
} from "./case-studies";

const CONTENT_DIR = path.join(process.cwd(), "content", "case-studies");

// Defense in depth: every function that turns a slug into a filesystem path
// goes through here, so a caller that forgets its own validation (e.g. a
// future script or test) can't be tricked into reading/writing/deleting
// outside content/case-studies/ via a slug like "../../etc/passwd".
function resolveContentPath(slug: string): string {
  const filePath = path.join(CONTENT_DIR, `${slug}.md`);
  const resolved = path.resolve(filePath);
  if (!resolved.startsWith(path.resolve(CONTENT_DIR) + path.sep)) {
    throw new Error(`Invalid slug: "${slug}"`);
  }
  return resolved;
}

export type RawSolutionItem = {
  heading: string;
  images: string[];
  body: string;
};

export type RawCaseStudyContent = {
  slug: string;
  title: string;
  category: CaseStudyCategory;
  summary: string;
  role?: string;
  team?: string;
  client?: string;
  duration?: string;
  location?: string;
  liveUrl?: string;
  heroImage?: string;
  metrics?: CaseStudyMetric[];
  problem?: string;
  process?: CaseStudyProcessInsight[];
  obstacles?: string;
  solution?: RawSolutionItem[];
  outcome?: string;
  close?: string;
};

type RawFrontmatter = {
  slug: string;
  title: string;
  category: CaseStudyCategory;
  summary: string;
  role?: string;
  team?: string;
  client?: string;
  duration?: string;
  location?: string;
  liveUrl?: string;
  heroImage?: string;
  metrics?: CaseStudyMetric[];
};

export function getAllRawCaseStudySlugs(): string[] {
  return fs
    .readdirSync(CONTENT_DIR)
    .filter((filename) => filename.endsWith(".md"))
    .map((filename) => filename.replace(/\.md$/, ""));
}

export function getRawCaseStudyContent(slug: string): RawCaseStudyContent | undefined {
  const filePath = resolveContentPath(slug);
  if (!fs.existsSync(filePath)) return undefined;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  const frontmatter = data as RawFrontmatter;

  const nodes = parseMarkdownBody(content);
  const sections = splitByHeadingText(nodes, 2);
  const getSection = (name: string) => sections.find((s) => s.heading === name);

  const problem = getSection("Problem");
  const processSection = getSection("Process");
  const obstacles = getSection("Obstacles");
  const solution = getSection("Solution");
  const outcome = getSection("Outcome");
  const close = getSection("Close");

  let solutionItems: RawSolutionItem[] | undefined;
  if (solution) {
    const items = splitByHeadingText(solution.nodes as RootContent[], 3);
    solutionItems = items.map((item) => {
      const { images, rest } = extractLeadingImages(item.nodes);
      return { heading: item.heading, images, body: nodesToSourceText(rest, content) };
    });
  }

  return {
    slug,
    title: frontmatter.title,
    category: frontmatter.category,
    summary: frontmatter.summary,
    role: frontmatter.role,
    team: frontmatter.team,
    client: frontmatter.client,
    duration: frontmatter.duration,
    location: frontmatter.location,
    liveUrl: frontmatter.liveUrl,
    heroImage: frontmatter.heroImage,
    metrics: frontmatter.metrics,
    problem: problem ? nodesToSourceText(problem.nodes, content) : undefined,
    process: processSection ? listItemsWithLeadingImage(processSection.nodes) : undefined,
    obstacles: obstacles ? nodesToSourceText(obstacles.nodes, content) : undefined,
    solution: solutionItems,
    outcome: outcome ? nodesToSourceText(outcome.nodes, content) : undefined,
    close: close ? nodesToSourceText(close.nodes, content) : undefined,
  };
}

export function getAllRawCaseStudies(): RawCaseStudyContent[] {
  return getAllRawCaseStudySlugs()
    .map((slug) => getRawCaseStudyContent(slug))
    .filter((cs): cs is RawCaseStudyContent => cs !== undefined);
}

function serializeProseSection(heading: string, text?: string): string {
  if (!text || text.trim() === "") return "";
  return `## ${heading}\n${text.trim()}\n`;
}

function serializeProcessSection(insights?: CaseStudyProcessInsight[]): string {
  if (!insights || insights.length === 0) return "";
  const items = insights.map((insight) => {
    if (insight.image) {
      return `- ![Screenshot](${insight.image})\n\n  ${insight.text}`;
    }
    return `- ${insight.text}`;
  });
  return `## Process\n${items.join("\n")}\n`;
}

function serializeSolutionSection(items?: RawSolutionItem[]): string {
  if (!items || items.length === 0) return "";
  const blocks = items.map((item) => {
    const imageLines = item.images
      .filter((src) => src.trim() !== "")
      .map((src) => `![Screenshot](${src})`)
      .join("\n");
    const imagePart = imageLines ? `${imageLines}\n` : "";
    return `### ${item.heading}\n${imagePart}${item.body.trim()}`;
  });
  return `## Solution\n${blocks.join("\n\n")}\n`;
}

function buildBody(data: RawCaseStudyContent): string {
  const sections = [
    serializeProseSection("Problem", data.problem),
    serializeProcessSection(data.process),
    serializeProseSection("Obstacles", data.obstacles),
    serializeSolutionSection(data.solution),
    serializeProseSection("Outcome", data.outcome),
    serializeProseSection("Close", data.close),
  ].filter((section) => section.length > 0);
  return `\n${sections.join("\n")}`;
}

export function saveCaseStudyContent(slug: string, data: RawCaseStudyContent): void {
  const filePath = resolveContentPath(slug);
  const frontmatter: RawFrontmatter = {
    // Frontmatter always reflects the `slug` this function was actually
    // asked to write to, not `data.slug` — those two could otherwise
    // silently disagree and corrupt the file with a mismatched slug.
    slug,
    title: data.title,
    category: data.category,
    summary: data.summary,
  };
  if (data.role) frontmatter.role = data.role;
  if (data.team) frontmatter.team = data.team;
  if (data.client) frontmatter.client = data.client;
  if (data.duration) frontmatter.duration = data.duration;
  if (data.location) frontmatter.location = data.location;
  if (data.liveUrl) frontmatter.liveUrl = data.liveUrl;
  if (data.heroImage) frontmatter.heroImage = data.heroImage;
  if (data.metrics && data.metrics.length > 0) frontmatter.metrics = data.metrics;

  const body = buildBody(data);
  const fileContents = matter.stringify(body, frontmatter);
  fs.writeFileSync(filePath, fileContents, "utf-8");
}

export function createCaseStudy(data: {
  slug: string;
  title: string;
  category: CaseStudyCategory;
  summary: string;
}): void {
  const filePath = resolveContentPath(data.slug);
  if (fs.existsSync(filePath)) {
    throw new Error(`A case study with slug "${data.slug}" already exists`);
  }
  saveCaseStudyContent(data.slug, {
    slug: data.slug,
    title: data.title,
    category: data.category,
    summary: data.summary,
  });
}

export function deleteCaseStudy(slug: string): void {
  const filePath = resolveContentPath(slug);
  if (!fs.existsSync(filePath)) {
    throw new Error(`No case study found with slug "${slug}"`);
  }
  fs.unlinkSync(filePath);
}
