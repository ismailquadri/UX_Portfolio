import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { RootContent } from "mdast";
import {
  parseMarkdownBody,
  splitByHeadingText,
  listItemsWithLeadingImage,
  extractLeadingImages,
  nodesToPlainParagraphs,
} from "./markdown-sections";
import type {
  CaseStudyCategory,
  CaseStudyMetric,
  CaseStudyProcessInsight,
} from "./case-studies";

const CONTENT_DIR = path.join(process.cwd(), "content", "case-studies");

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
  const filePath = path.join(CONTENT_DIR, `${slug}.md`);
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
      return { heading: item.heading, images, body: nodesToPlainParagraphs(rest) };
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
    problem: problem ? nodesToPlainParagraphs(problem.nodes) : undefined,
    process: processSection ? listItemsWithLeadingImage(processSection.nodes) : undefined,
    obstacles: obstacles ? nodesToPlainParagraphs(obstacles.nodes) : undefined,
    solution: solutionItems,
    outcome: outcome ? nodesToPlainParagraphs(outcome.nodes) : undefined,
    close: close ? nodesToPlainParagraphs(close.nodes) : undefined,
  };
}

export function getAllRawCaseStudies(): RawCaseStudyContent[] {
  return getAllRawCaseStudySlugs()
    .map((slug) => getRawCaseStudyContent(slug))
    .filter((cs): cs is RawCaseStudyContent => cs !== undefined);
}
