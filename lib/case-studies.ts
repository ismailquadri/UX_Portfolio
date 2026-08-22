import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { RootContent } from "mdast";
import {
  parseMarkdownBody,
  splitByHeadingText,
  nodesToHtml,
  listItemsWithLeadingImage,
  extractLeadingImage,
  extractLeadingImages,
} from "./markdown-sections";

const CONTENT_DIR = path.join(process.cwd(), "content", "case-studies");

export type CaseStudyCategory = "FinTech" | "AI-native" | "GovTech";

export type CaseStudyMetric = {
  value: string;
  label: string;
};

export type CaseStudySolutionItem = {
  heading: string;
  images: string[];
  html: string;
};

export type CaseStudyProcessInsight = {
  text: string;
  image?: string;
};

export type CaseStudy = {
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
  problemHtml?: string;
  processInsights?: CaseStudyProcessInsight[];
  obstaclesHtml?: string;
  solutionItems?: CaseStudySolutionItem[];
  outcomeHtml?: string;
  closeHtml?: string;
};

type CaseStudyFrontmatter = {
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

export function getAllCaseStudySlugs(): string[] {
  return fs
    .readdirSync(CONTENT_DIR)
    .filter((filename) => filename.endsWith(".md"))
    .map((filename) => filename.replace(/\.md$/, ""));
}

export function getCaseStudyBySlug(slug: string): CaseStudy | undefined {
  const filePath = path.join(CONTENT_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) return undefined;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  const frontmatter = data as CaseStudyFrontmatter;

  const nodes = parseMarkdownBody(content);
  const sections = splitByHeadingText(nodes, 2);
  const getSection = (name: string) => sections.find((s) => s.heading === name);

  const problem = getSection("Problem");
  const processSection = getSection("Process");
  const obstacles = getSection("Obstacles");
  const solution = getSection("Solution");
  const outcome = getSection("Outcome");
  const close = getSection("Close");

  let solutionItems: CaseStudySolutionItem[] | undefined;
  if (solution) {
    const items = splitByHeadingText(solution.nodes as RootContent[], 3);
    solutionItems = items.map((item) => {
      const { images, rest } = extractLeadingImages(item.nodes);
      return { heading: item.heading, images, html: nodesToHtml(rest) };
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
    problemHtml: problem ? nodesToHtml(problem.nodes) : undefined,
    processInsights: processSection
      ? listItemsWithLeadingImage(processSection.nodes)
      : undefined,
    obstaclesHtml: obstacles ? nodesToHtml(obstacles.nodes) : undefined,
    solutionItems,
    outcomeHtml: outcome ? nodesToHtml(outcome.nodes) : undefined,
    closeHtml: close ? nodesToHtml(close.nodes) : undefined,
  };
}

export function getAllCaseStudies(): CaseStudy[] {
  return getAllCaseStudySlugs()
    .map((slug) => getCaseStudyBySlug(slug))
    .filter((cs): cs is CaseStudy => cs !== undefined);
}
