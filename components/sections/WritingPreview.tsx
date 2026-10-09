import { Link } from "next-view-transitions";
import { ArrowRightIcon, ArrowTopRightIcon } from "@radix-ui/react-icons";
import { getArticles } from "@/lib/articles";

export default function WritingPreview() {
  const article = getArticles()[0];
  if (!article) return null;
  return <section className="section-pad border-t border-border-subtle"><div className="grid items-start gap-8 lg:grid-cols-[1fr_1.4fr]"><div><p className="eyebrow">From the blog</p><h2 className="section-title mt-3">Thinking out loud.</h2><p className="mt-4 max-w-[320px] leading-relaxed text-muted">Notes on design and what I’m learning along the way.</p><Link href="/blog" className="mt-6 inline-flex items-center gap-2 text-sm underline underline-offset-4">Explore the blog <ArrowRightIcon aria-hidden="true" /></Link></div><a href={article.url || `/blog/${article.slug}`} className="group rounded-2xl border border-border-subtle bg-surface p-6 transition-colors hover:border-accent/40 sm:p-8" {...(article.url ? { target: "_blank", rel: "noopener noreferrer" } : {})}><div className="flex items-center justify-between"><p className="eyebrow">{article.kind === "writing" ? "My writing" : "Reading list"} / {article.source}</p><ArrowTopRightIcon aria-hidden="true" /></div><h3 className="mt-6 font-heading text-3xl leading-tight">{article.title}</h3><p className="mt-4 leading-relaxed text-muted">{article.description}</p><span className="mt-6 inline-block text-sm underline underline-offset-4">Read {article.url ? `on ${article.source}` : "the article"}</span></a></div></section>;
}
