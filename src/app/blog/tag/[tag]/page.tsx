import Link from "next/link";
import { getAllContent } from "@/lib/content";

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
  const allPosts = await getAllContent("blog");
  const posts = allPosts.filter(
    (p) => Array.isArray(p.meta.tags) && (p.meta.tags as string[]).includes(tag)
  );

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16">
      <h1 className="font-mono text-2xl font-bold mb-8">
        <span className="text-muted-foreground">#</span>{tag}
      </h1>
      {posts.length === 0 ? (
        <p className="text-muted-foreground">No posts with this tag.</p>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => (
            <article key={post.slug} className="group">
              <Link href={`/blog/${post.slug}`} className="block">
                <div className="flex items-baseline justify-between gap-4">
                  <h2 className="font-mono text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                    {String(post.meta.title)}
                  </h2>
                  {post.meta.date && (
                    <time className="shrink-0 text-sm text-muted-foreground tabular-nums font-mono">
                      {new Date(post.meta.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </time>
                  )}
                </div>
                {typeof post.meta.excerpt === "string" && post.meta.excerpt && (
                  <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                    {post.meta.excerpt}
                  </p>
                )}
              </Link>
            </article>
          ))}
        </div>
      )}
      <Link href="/blog" className="mt-8 inline-block text-sm text-primary hover:underline font-mono">
        ← All posts
      </Link>
    </div>
  );
}
