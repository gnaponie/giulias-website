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

  const allTags = new Set<string>();
  for (const post of posts) {
    if (Array.isArray(post.meta.tags)) {
      for (const tag of post.meta.tags as string[]) {
        allTags.add(tag);
      }
    }
  }
  const tags = Array.from(allTags).sort();

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      <h1 className="font-mono text-2xl font-bold mb-8">Blog</h1>
      <div className="flex flex-col sm:flex-row gap-10">
        {/* Posts */}
        <div className="flex-1 space-y-6 min-w-0">
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
              {Array.isArray(post.meta.tags) && post.meta.tags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {(post.meta.tags as string[]).map((tag) => (
                    <Link
                      key={tag}
                      href={`/blog/tag/${encodeURIComponent(tag)}`}
                      className="text-xs font-mono text-accent-warm hover:text-primary transition-colors"
                    >
                      #{tag}
                    </Link>
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>

        {/* Tags sidebar */}
        {tags.length > 0 && (
          <aside className="sm:w-40 shrink-0 sm:border-l sm:border-border sm:pl-6">
            <h2 className="font-mono text-sm font-semibold text-muted-foreground mb-3">Tags</h2>
            <ul className="flex flex-row flex-wrap sm:flex-col gap-2">
              {tags.map((tag) => (
                <li key={tag}>
                  <Link
                    href={`/blog/tag/${encodeURIComponent(tag)}`}
                    className="text-sm font-mono text-muted-foreground hover:text-primary transition-colors"
                  >
                    #{tag}
                  </Link>
                </li>
              ))}
            </ul>
          </aside>
        )}
      </div>
    </div>
  );
}
