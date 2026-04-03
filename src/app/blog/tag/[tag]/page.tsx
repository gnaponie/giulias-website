import { getAllContent } from "@/lib/content";
import { TagClient } from "./tag-client";

export async function generateStaticParams() {
  const posts = await getAllContent("blog");
  const tags = new Set<string>();
  for (const post of posts) {
    if (Array.isArray(post.meta.tags)) {
      for (const tag of post.meta.tags as string[]) {
        tags.add(tag);
      }
    }
  }
  return Array.from(tags).map((tag) => ({ tag: encodeURIComponent(tag) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tag: string }>;
}) {
  const { tag: rawTag } = await params;
  const tag = decodeURIComponent(rawTag);
  return { title: `#${tag} — Blog` };
}

export default async function TagPage({
  params,
}: {
  params: Promise<{ tag: string }>;
}) {
  const { tag: rawTag } = await params;
  const tag = decodeURIComponent(rawTag);
  const allPostsEn = await getAllContent("blog", "en");
  const allPostsIt = await getAllContent("blog", "it");
  const postsEn = allPostsEn.filter(
    (p) => Array.isArray(p.meta.tags) && (p.meta.tags as string[]).includes(tag)
  );
  const postsIt = allPostsIt.filter(
    (p) => Array.isArray(p.meta.tags) && (p.meta.tags as string[]).includes(tag)
  );

  return <TagClient tag={tag} postsEn={postsEn} postsIt={postsIt} />;
}
