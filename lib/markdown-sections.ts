import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import type { Root, RootContent, Heading, Paragraph, Image as MdastImage } from "mdast";

export function parseMarkdownBody(markdown: string): RootContent[] {
  const tree = unified().use(remarkParse).use(remarkGfm).parse(markdown) as Root;
  return tree.children;
}

export function splitByHeadingText(
  nodes: RootContent[],
  depth: number
): { heading: string; nodes: RootContent[] }[] {
  const sections: { heading: string; nodes: RootContent[] }[] = [];
  let current: { heading: string; nodes: RootContent[] } | null = null;

  for (const node of nodes) {
    if (node.type === "heading" && (node as Heading).depth === depth) {
      current = { heading: headingText(node as Heading), nodes: [] };
      sections.push(current);
    } else if (current) {
      current.nodes.push(node);
    }
  }

  return sections;
}

function headingText(node: Heading): string {
  return node.children
    .map((child) => ("value" in child ? String(child.value) : ""))
    .join("");
}

export function nodesToHtml(nodes: RootContent[]): string {
  const root: Root = { type: "root", children: nodes };
  const processor = unified().use(remarkRehype).use(rehypeStringify);
  const hastTree = processor.runSync(root);
  return processor.stringify(hastTree) as string;
}

export function nodesToPlainText(nodes: RootContent[]): string[] {
  const list = nodes.find((node) => node.type === "list");
  if (!list || list.type !== "list") return [];
  return list.children.map((item) => collectText(item.children as RootContent[]).trim());
}

function collectText(nodes: RootContent[]): string {
  let text = "";
  for (const node of nodes) {
    if (node.type === "text") {
      text += node.value;
    } else if ("children" in node && Array.isArray(node.children)) {
      text += collectText(node.children as RootContent[]);
    }
  }
  return text;
}

export function extractLeadingImage(
  nodes: RootContent[]
): { image?: string; alt?: string; rest: RootContent[] } {
  if (nodes.length === 0) return { rest: nodes };
  const [first, ...rest] = nodes;
  if (first.type === "paragraph") {
    const paragraph = first as Paragraph;
    if (paragraph.children.length === 1 && paragraph.children[0].type === "image") {
      const image = paragraph.children[0] as MdastImage;
      return { image: image.url, alt: image.alt ?? undefined, rest };
    }
  }
  return { rest: nodes };
}
