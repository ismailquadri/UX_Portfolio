import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Link } from "next-view-transitions";
import ReactMarkdown from "react-markdown";
import Navbar from "@/components/Navbar";
import SiteSidebar from "@/components/SiteSidebar";
import Footer from "@/components/Footer";
import { getArticle, getArticles } from "@/lib/articles";

export function generateStaticParams() { return getArticles().filter(article => !article.url).map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();
  return { title: article.title, description: article.description, alternates: { canonical: `/blog/${slug}` }, openGraph: { type: "article", title: article.title, description: article.description, publishedTime: article.publishedAt, authors: [article.author] } };
}
export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();
  return <div className="flex min-h-screen flex-col"><Navbar /><div className="flex flex-1"><SiteSidebar /><main id="main-content" className="min-w-0 flex-1 section-pad"><article className="mx-auto max-w-[720px]"><Link href="/blog" className="text-sm underline underline-offset-4">Back to the blog</Link><p className="eyebrow mt-10">{article.tags.join(" / ")}</p><h1 className="mt-4 font-heading text-4xl leading-tight sm:text-6xl">{article.title}</h1><p className="mt-6 text-muted">{article.author} · <time dateTime={article.publishedAt}>{article.publishedAt}</time></p><div className="article-prose mt-12"><ReactMarkdown>{article.body}</ReactMarkdown></div></article></main></div><Footer /></div>;
}
