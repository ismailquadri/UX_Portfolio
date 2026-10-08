import type { MetadataRoute } from "next";

const siteUrl = "https://quadriismail.com";

export default function robots(): MetadataRoute.Robots {
	return {
		 rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/admin"] },
		sitemap: `${siteUrl}/sitemap.xml`,
		host: siteUrl,
	};
}
