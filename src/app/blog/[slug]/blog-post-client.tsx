"use client";

import Link from "next/link";
import { useLanguage, t } from "@/lib/language";

interface Post {
  slug: string;
  meta: {
    title: string;
    date: string;
    [key: string]: unknown;
  };
  contentHtml: string;
}

export function BlogPostClient({
  postEn,
  postIt,
}: {
  postEn: Post;
  postIt: Post | null;
}) {
  const { lang } = useLanguage();
  const s = t[lang];
  const post = lang === "it" && postIt ? postIt : postEn;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16">
      <Link
        href="/blog"
        className="text-sm text-muted-foreground hover:text-primary transition-colors font-mono"
      >
        {s.back}
      </Link>
      <article className="mt-8">
        <header className="mb-8">
          <h1 className="font-mono text-2xl sm:text-3xl font-bold">
            {String(post.meta.title)}
          </h1>
          {post.meta.date && (
            <time className="mt-2 block text-sm text-muted-foreground font-mono">
              {new Date(post.meta.date).toLocaleDateString(
                lang === "it" ? "it-IT" : "en-US",
                { year: "numeric", month: "long", day: "numeric" }
              )}
            </time>
          )}
        </header>
        <div
          className="prose prose-zinc dark:prose-invert max-w-none
            prose-headings:font-mono prose-headings:text-foreground
            prose-code:text-accent-warm prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-mono
            prose-pre:bg-muted prose-pre:border prose-pre:border-border prose-pre:rounded-lg
            [&>p]:mb-6 [&_ol]:![list-style-type:decimal] [&_ul]:![list-style-type:disc] [&_ol]:pl-6 [&_ul]:pl-6 [&_li]:mb-2"
          dangerouslySetInnerHTML={{ __html: post.contentHtml }}
        />
      </article>
    </div>
  );
}
