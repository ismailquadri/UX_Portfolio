import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import SiteSidebar from "@/components/SiteSidebar";
import Footer from "@/components/Footer";
import ArticleList from "@/components/ArticleList";
import { getArticles } from "@/lib/articles";

export const metadata: Metadata = { title: "Blog", description: "Writing by Quadri Ismail on design practice, product thinking, and growing as a designer.", alternates: { canonical: "/blog" } };
export default function BlogPage() {
  const articles = getArticles().map(({ body, ...article }) => { void body; return article; });
  return <div className="flex min-h-screen flex-col"><Navbar /><div className="flex flex-1"><SiteSidebar /><main id="main-content" className="min-w-0 flex-1">
    <header className="section-pad border-b border-border-subtle"><p className="eyebrow">Blog / Notes &amp; reading</p><h1 className="mt-5 font-heading text-[clamp(2.8rem,5vw,4.8rem)] leading-[1.05] tracking-tight">Ideas worth<br /><span className="text-accent/65">spending time with.</span></h1><p className="mt-6 max-w-[560px] text-lg leading-relaxed text-muted">Notes on design, the questions I keep coming back to, and articles I want to share.</p></header>
    <section className="section-pad" aria-label="Articles"><ArticleList articles={articles} /></section>
    <div className="section-pad border-t border-border-subtle"><p className="eyebrow">Keep the conversation going</p><p className="mt-3 max-w-[540px] font-heading text-3xl">Have a different take? I’d like to hear it.</p><a href="mailto:hello@quadriismail.com" className="mt-5 inline-block underline underline-offset-4">hello@quadriismail.com</a></div>
  </main></div><Footer /></div>;
}
