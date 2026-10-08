import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { FAQ_ITEMS } from "./faq-data";
import publicKnowledge from "../content/public-knowledge.json";

type Source = {
  title: string;
  url: string;
  freshness?: string;
};

type KnowledgeDocument = {
  id: string;
  title: string;
  content: string;
  source: Source;
  tags: string[];
};

type RetrievedDocument = KnowledgeDocument & { score: number };

const CASE_STUDY_DIR = path.join(process.cwd(), "content", "case-studies");
const MAX_CHUNK_CHARS = 2_200;
const STOP_WORDS = new Set([
  "about", "after", "again", "also", "and", "are", "can", "could", "did",
  "does", "for", "from", "have", "how", "into", "its", "just", "like",
  "more", "most", "not", "our", "she", "that", "the", "their", "then",
  "there", "these", "they", "this", "through", "under", "was", "what",
  "when", "where", "which", "who", "will", "with", "would", "you", "your",
]);

function tokenize(text: string): string[] {
  return text
    .toLocaleLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .split(/\s+/)
    .filter((term) => term.length > 1 && !STOP_WORDS.has(term))
    .map((term) => {
      if (term.length > 5 && term.endsWith("ies")) return `${term.slice(0, -3)}y`;
      if (term.length > 5 && term.endsWith("ing")) return term.slice(0, -3);
      if (term.length > 4 && term.endsWith("ed")) return term.slice(0, -2);
      if (term.length > 4 && term.endsWith("s")) return term.slice(0, -1);
      return term;
    });
}

function caseStudyDocuments(): KnowledgeDocument[] {
  if (!fs.existsSync(CASE_STUDY_DIR)) return [];
  return fs
    .readdirSync(CASE_STUDY_DIR)
    .filter((filename) => filename.endsWith(".md"))
    .flatMap((filename) => {
      const slug = filename.replace(/\.md$/, "");
      const raw = fs.readFileSync(path.join(CASE_STUDY_DIR, filename), "utf8");
      const { data, content } = matter(raw);
      const title = typeof data.title === "string" ? data.title : slug;
      const category = typeof data.category === "string" ? data.category : "product design";
      const role = typeof data.role === "string" ? data.role : "";
      const clean = content
        .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
        .replace(/^---\s*$/gm, " ")
        .replace(/\s+/g, " ")
        .trim();
      const sentences = clean.split(/(?<=[.!?])\s+/);
      const chunks: string[] = [];
      let current = "";
      for (const sentence of sentences) {
        if (current && current.length + sentence.length > MAX_CHUNK_CHARS) {
          chunks.push(current.trim());
          current = "";
        }
        current += `${sentence} `;
      }
      if (current.trim()) chunks.push(current.trim());

      return chunks.map((chunk, index) => ({
        id: `case-study-${slug}-${index + 1}`,
        title: `${title} (${category})`,
        content: `${role ? `Role: ${role}. ` : ""}${chunk}`,
        source: {
          title: `${title} case study on Quadri's portfolio`,
          url: `https://quadriismail.com/case-studies/${slug}`,
          freshness: "published portfolio case study; reported results are self-reported",
        },
        tags: [slug, category, "case study", "portfolio"],
      }));
    });
}

function buildDocuments(): KnowledgeDocument[] {
  const externalDocuments = publicKnowledge.map((document) => ({
    id: document.id,
    title: document.title,
    content: document.content,
    source: {
      title: document.sourceTitle,
      url: document.sourceUrl,
      freshness: document.freshness,
    },
    tags: document.tags,
  }));
  const faqDocuments = FAQ_ITEMS.map((item, index) => ({
    id: `faq-${index + 1}`,
    title: item.question,
    content: item.answer,
    source: { title: "Portfolio FAQ", url: "https://quadriismail.com/" },
    tags: ["faq", item.audience ?? "general"],
  }));
  return [...externalDocuments, ...faqDocuments, ...caseStudyDocuments()];
}

const DOCUMENTS = buildDocuments();
const TOKENIZED_DOCUMENTS = DOCUMENTS.map((document) => ({
  document,
  terms: tokenize(`${document.title} ${document.tags.join(" ")} ${document.content}`),
}));

/** Retrieve concise, source-linked evidence from portfolio and public-profile data. */
export function retrieveKnowledge(query: string, limit = 6): RetrievedDocument[] {
  const queryTerms = [...new Set(tokenize(query))];
  if (queryTerms.length === 0) return [];

  const averageLength =
    TOKENIZED_DOCUMENTS.reduce((sum, entry) => sum + entry.terms.length, 0) /
    Math.max(TOKENIZED_DOCUMENTS.length, 1);
  const documentFrequency = new Map<string, number>();
  for (const term of queryTerms) {
    documentFrequency.set(
      term,
      TOKENIZED_DOCUMENTS.filter((entry) => entry.terms.includes(term)).length,
    );
  }

  return TOKENIZED_DOCUMENTS.map(({ document, terms }) => {
    let score = 0;
    const lengthNorm = terms.length / Math.max(averageLength, 1);
    for (const term of queryTerms) {
      const frequency = terms.filter((candidate) => candidate === term).length;
      if (!frequency) continue;
      const df = documentFrequency.get(term) ?? 0;
      const inverseFrequency = Math.log(1 + (TOKENIZED_DOCUMENTS.length - df + 0.5) / (df + 0.5));
      score += inverseFrequency * ((frequency * 2.2) / (frequency + 1.2 * (0.25 + 0.75 * lengthNorm)));
      if (tokenize(document.title).includes(term)) score += inverseFrequency * 0.9;
      if (document.tags.some((tag) => tokenize(tag).includes(term))) score += inverseFrequency * 0.55;
    }
    return { ...document, score };
  })
    .filter((document) => document.score > 0.15)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

export function formatRetrievedKnowledge(documents: RetrievedDocument[]): string {
  if (documents.length === 0) {
    return "No matching source material was found for this question.";
  }
  return documents
    .map(
      (document, index) =>
        `[${index + 1}] ${document.title}\n${document.content}\nSource: ${document.source.title} (${document.source.url})${document.source.freshness ? `\nSource note: ${document.source.freshness}` : ""}`,
    )
    .join("\n\n");
}

// Used by focused unit or integration checks and future import tooling.
export function getKnowledgeDocumentCount(): number {
  return DOCUMENTS.length;
}
