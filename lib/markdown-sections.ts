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
  return collectText(node.children as RootContent[]);
}

export function nodesToHtml(nodes: RootContent[]): string {
  const root: Root = { type: "root", children: nodes };
  const processor = unified().use(remarkRehype).use(rehypeStringify);
  const hastTree = processor.runSync(root);
  return processor.stringify(hastTree) as string;
}

export function nodesToPlainParagraphs(nodes: RootContent[]): string {
  return nodes
    .filter((node) => node.type === "paragraph")
    .map((node) => collectText((node as Paragraph).children as RootContent[]).trim())
    .join("\n\n");
}

// Like nodesToPlainParagraphs, but slices the ORIGINAL markdown source
// instead of re-deriving plain text from the parsed tree, so inline
// formatting (**bold**, _italic_, [links](url)) survives a round trip
// through an editor textarea instead of being silently flattened to
// plain text. Falls back to nodesToPlainParagraphs if position info is
// missing (shouldn't happen with the default remark-parse config, but
// this keeps the function total rather than throwing).
export function nodesToSourceText(nodes: RootContent[], source: string): string {
  if (nodes.length === 0) return "";
  const first = nodes[0];
  const last = nodes[nodes.length - 1];
  const start = first.position?.start.offset;
  const end = last.position?.end.offset;
  if (start === undefined || end === undefined) {
    return nodesToPlainParagraphs(nodes);
  }
  return source.slice(start, end).trim();
}

export function listItemsWithLeadingImage(
  nodes: RootContent[]
): { text: string; image?: string }[] {
  const list = nodes.find((node) => node.type === "list");
  if (!list || list.type !== "list") return [];
  return list.children.map((item) => {
    const { image, rest } = extractLeadingImage(item.children as RootContent[]);
    return { text: collectText(rest).trim(), image };
  });
}

// Note: nested lists (a list item containing another list) are concatenated
// with no separator between the parent item's text and the nested list's
// text. This is intentional — the content schema only produces flat bullet
// lists under `## Process`-style sections, so nested-list flattening with
// proper delimiters is out of scope here.
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
  const [first, ...restNodes] = nodes;
  if (first.type !== "paragraph") return { rest: nodes };

  const paragraph = first as Paragraph;
  const [firstChild, ...remainingChildren] = paragraph.children;
  if (!firstChild || firstChild.type !== "image") return { rest: nodes };

  const image = firstChild as MdastImage;

  // Remark merges an image and any immediately-following text (no blank
  // line between them) into a single paragraph's inline children, rather
  // than producing separate block nodes. Drop leading whitespace-only text
  // so a following image or prose on the very next line is still detected,
  // and keep any remaining inline content as a new paragraph node so it
  // isn't lost.
  let leftover = remainingChildren;
  if (
    leftover.length > 0 &&
    leftover[0].type === "text" &&
    leftover[0].value.trim() === ""
  ) {
    leftover = leftover.slice(1);
  }

  const rest: RootContent[] =
    leftover.length > 0
      ? [{ ...paragraph, children: leftover } as Paragraph, ...restNodes]
      : restNodes;

  return { image: image.url, alt: image.alt ?? undefined, rest };
}

export function extractLeadingImages(
  nodes: RootContent[]
): { images: string[]; rest: RootContent[] } {
  const images: string[] = [];
  let rest = nodes;
  while (true) {
    const result = extractLeadingImage(rest);
    if (!result.image) break;
    images.push(result.image);
    rest = result.rest;
  }
  return { images, rest };
}
