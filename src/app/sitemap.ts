import { getAllContent, getBioContent } from "@/lib/content";
import { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://giulia.dev";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [blogPosts, talks, projects, bio] = await Promise.all([
    getAllContent("blog"),
    getAllContent("talks"),
    getAllContent("projects"),
    getBioContent(),
  ]);

  const routes = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 1,
    },
    {
      url: `${siteUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    {
      url: `${siteUrl}/talks`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${siteUrl}/projects`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
  ];

  if (bio) {
    routes.push({
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 1,
    });
  }

  for (const post of blogPosts) {
    routes.push({
      url: `${siteUrl}/blog/${post.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    });
  }

  return routes;
}
