import type { MetadataRoute } from "next";
import { getArticles } from "@/lib/articles";
import { getAllCaseStudySlugs } from "@/lib/case-studies";

const siteUrl = "https://quadriismail.com";

export default function sitemap(): MetadataRoute.Sitemap {
	const pages = ["", "/about", "/case-studies", "/blog", "/contact"];
	const staticEntries: MetadataRoute.Sitemap = pages.map((page) => ({
		url: `${siteUrl}${page}`,
		changeFrequency: page === "" ? "weekly" : "monthly",
		priority: page === "" ? 1 : 0.7,
	}));
	const caseStudyEntries: MetadataRoute.Sitemap = getAllCaseStudySlugs().map((slug) => ({
		url: `${siteUrl}/case-studies/${slug}`,
		changeFrequency: "monthly",
		priority: 0.6,
	}));

	return [...staticEntries, ...caseStudyEntries, ...getArticles().filter(article => !article.url).map(article => ({ url: `${siteUrl}/blog/${article.slug}`, lastModified: article.publishedAt, changeFrequency: "monthly" as const, priority: 0.6 }))];
}
