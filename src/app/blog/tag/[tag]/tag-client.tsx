"use client";

import Link from "next/link";
import { useLanguage, t } from "@/lib/language";

interface Post {
  slug: string;
  meta: {
    title: string;
    date: string;
    excerpt?: unknown;
    [key: string]: unknown;
  };
  contentHtml: string;
}

export function TagClient({
  tag,
  postsEn,
  postsIt,
}: {
  tag: string;
  postsEn: Post[];
  postsIt: Post[];
}) {
  const { lang } = useLanguage();
  const s = t[lang];
  const posts = lang === "it" && postsIt.length > 0 ? postsIt : postsEn;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16">
      <h1 className="font-mono text-2xl font-bold mb-8">
        <span className="text-muted-foreground">#</span>{tag}
      </h1>
      {posts.length === 0 ? (
        <p className="text-muted-foreground">{s.noPosts}</p>
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
                      {new Date(post.meta.date).toLocaleDateString(
                        lang === "it" ? "it-IT" : "en-US",
                        { year: "numeric", month: "short", day: "numeric" }
                      )}
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
        {s.allPosts}
      </Link>
    </div>
  );
}
