import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: "/before/" }],
    sitemap: "https://demo.lotusinnovations.io/sitemap.xml",
  };
}
