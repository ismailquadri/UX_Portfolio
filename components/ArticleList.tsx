"use client";
import { useState } from "react";
import { Link } from "next-view-transitions";
import { ArrowTopRightIcon, MagnifyingGlassIcon } from "@radix-ui/react-icons";
import type { Article } from "@/lib/articles";

export default function ArticleList({ articles }: { articles: Article[] }) {
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");
  const visible = articles.filter(article => (filter === "all" || filter === article.kind) && `${article.title} ${article.description} ${article.tags.join(" ")}`.toLowerCase().includes(query.trim().toLowerCase()));
  return <div>
    <div className="mb-10 flex flex-wrap items-center justify-between gap-5 border-b border-border-subtle pb-5">
      <div className="flex flex-wrap gap-2" aria-label="Filter articles">{[["all", "All"], ["writing", "My writing"], ["reading", "Reading list"]].map(([value, label]) => <button key={value} type="button" aria-pressed={filter === value} onClick={() => setFilter(value)} className={`rounded-full px-4 py-2 text-sm transition-colors ${filter === value ? "bg-accent text-white" : "bg-surface text-muted hover:text-ink"}`}>{label}</button>)}</div>
      <label className="flex w-full items-center gap-2 rounded-lg border border-border-subtle px-3 py-2 sm:w-64"><MagnifyingGlassIcon className="size-4 text-muted" aria-hidden="true" /><span className="sr-only">Search articles</span><input type="search" value={query} onChange={e => setQuery(e.target.value)} placeholder="Search articles" className="min-w-0 flex-1 bg-transparent text-base outline-none" /></label>
    </div>
    <p className="sr-only" role="status">{visible.length} {visible.length === 1 ? "article" : "articles"}</p>
    {visible.length ? <div className="divide-y divide-border-subtle">{visible.map(article => {
      const inner = <><div className="text-xs text-muted"><p className="eyebrow">{article.kind === "writing" ? "My writing" : "Reading list"}</p><p className="mt-2">{article.source}</p></div><div><h2 className="font-heading text-3xl leading-tight tracking-tight transition-colors group-hover:text-accent/70 sm:text-4xl">{article.title}</h2><p className="mt-4 max-w-[600px] text-base leading-relaxed text-muted">{article.description}</p><div className="mt-5 flex flex-wrap gap-2">{article.tags.map(tag => <span key={tag} className="rounded-full border border-border-subtle px-3 py-1 text-xs text-muted">{tag}</span>)}</div><p className="mt-5 text-xs text-muted">{article.author}{article.publishedAt ? ` · ${new Date(article.publishedAt + "T12:00:00Z").toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" })}` : ""}</p></div><ArrowTopRightIcon className="size-6 shrink-0" aria-hidden="true" /></>;
      const classes = "group grid gap-5 py-8 first:pt-0 sm:grid-cols-[110px_1fr_24px]";
      return article.url ? <a key={article.slug} href={article.url} target="_blank" rel="noopener noreferrer" className={classes}>{inner}<span className="sr-only">Opens on {article.source} in a new tab</span></a> : <Link key={article.slug} href={`/blog/${article.slug}`} className={classes}>{inner}</Link>;
    })}</div> : <div className="rounded-2xl bg-surface px-6 py-16 text-center"><h2 className="font-heading text-3xl">{query ? "No matches yet" : "The reading list is on its way"}</h2><p className="mt-3 text-muted">{query ? "Try another topic or browse all articles." : "For now, you can explore my writing about design."}</p><button className="button-secondary mx-auto mt-6" type="button" onClick={() => { setFilter("all"); setQuery(""); }}>View all articles</button></div>}
  </div>;
}
