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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 text-center">
        <div className="text-5xl mb-4">✍️</div>
        <h1 className="text-3xl font-semibold tracking-tight">Blog</h1>
        <p className="mt-4 text-muted-foreground">
          No posts yet. Check back soon!
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
      <div className="mb-10">
        <h1 className="text-3xl font-semibold tracking-tight">
          <span className="bg-gradient-to-r from-accent-coral to-accent-violet bg-clip-text text-transparent">Blog</span>
        </h1>
        <p className="mt-2 text-muted-foreground">Thoughts, learnings, and things I find interesting.</p>
      </div>
      <div className="grid gap-4">
        {posts.map((post, i) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group block rounded-2xl border border-border bg-card p-6 hover:shadow-lg hover:border-accent-cool/40 transition-all"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h2 className="text-lg font-semibold group-hover:text-primary transition-colors">
                  {String(post.meta.title)}
                </h2>
                {typeof post.meta.excerpt === "string" && post.meta.excerpt && (
                  <p className="mt-1 text-muted-foreground text-sm line-clamp-2">
                    {post.meta.excerpt}
                  </p>
                )}
              </div>
              {post.meta.date && (
                <time className="shrink-0 text-xs text-muted-foreground tabular-nums">
                  {new Date(post.meta.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </time>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
