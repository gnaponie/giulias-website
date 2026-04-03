import { notFound } from "next/navigation";
import { getContentBySlug, getAllContent } from "@/lib/content";
import { BlogPostClient } from "./blog-post-client";

export async function generateStaticParams() {
  const posts = await getAllContent("blog");
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getContentBySlug("blog", slug);
  if (!post) return { title: "Post Not Found" };
  return {
    title: `${post.meta.title} — Giulia`,
    description: typeof post.meta.excerpt === "string" ? post.meta.excerpt : undefined,
  };
}

export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const postEn = await getContentBySlug("blog", slug, "en");
  const postIt = await getContentBySlug("blog", slug, "it");

  if (!postEn) notFound();

  return <BlogPostClient postEn={postEn} postIt={postIt} />;
}
