import Link from "next/link";
import { getAllContent } from "@/lib/content";

export const metadata = {
  title: "Blog — Giulia",
  description: "Thoughts on software engineering, architecture, and more.",
};

export default async function BlogListing() {
  const posts = await getAllContent("blog");

  if (posts.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16">
        <h1 className="font-mono text-2xl font-bold">Blog</h1>
        <p className="mt-4 text-muted-foreground">No posts yet.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16">
      <h1 className="font-mono text-2xl font-bold mb-8">Blog</h1>
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
              {Array.isArray(post.meta.tags) && post.meta.tags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {(post.meta.tags as string[]).map((tag) => (
                    <span
                      key={tag}
                      className="text-xs font-mono text-accent-warm"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
