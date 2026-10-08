import type { MetadataRoute } from "next";
import { getAllCaseStudySlugs } from "@/lib/case-studies";

const siteUrl = "https://quadriismail.com";

export default function sitemap(): MetadataRoute.Sitemap {
	const pages = ["", "/about", "/case-studies", "/contact"];
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

	return [...staticEntries, ...caseStudyEntries];
}
