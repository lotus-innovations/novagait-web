import type { MetadataRoute } from "next";

// /before/* is deliberately absent: the inaccessible variant is noindex.
export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://demo.lotusinnovations.io";
  return [
    "",
    "/services",
    "/providers",
    "/locations",
    "/contact",
    "/accessibility-demo",
    "/accessibility-demo/audit",
    "/accessibility-demo/vpat",
  ].map((path) => ({ url: `${base}${path}`, changeFrequency: "monthly" }));
}
