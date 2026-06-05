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
          className="max-w-none
            [&_h1]:font-mono [&_h1]:text-xl [&_h1]:sm:text-2xl [&_h1]:font-bold [&_h1]:mt-10 [&_h1]:mb-4 [&_h1]:text-foreground
            [&_h2]:font-mono [&_h2]:text-lg [&_h2]:sm:text-xl [&_h2]:font-bold [&_h2]:mt-8 [&_h2]:mb-3 [&_h2]:text-foreground
            [&_h3]:font-mono [&_h3]:text-base [&_h3]:font-bold [&_h3]:mt-6 [&_h3]:mb-2 [&_h3]:text-foreground
            [&_code]:text-accent-warm [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-sm [&_code]:font-mono
            [&_pre]:bg-muted [&_pre]:border [&_pre]:border-border [&_pre]:rounded-lg
            [&_pre_code]:bg-transparent [&_pre_code]:p-0
            [&>p]:mb-6 [&_ol]:![list-style-type:decimal] [&_ul]:![list-style-type:disc] [&_ol]:pl-6 [&_ul]:pl-6 [&_li]:mb-2
            [&_a]:text-accent-coral [&_a]:underline [&_a]:underline-offset-2 [&_a]:hover:text-primary [&_a]:transition-colors dark:[&_a]:text-accent-cool
            [&_table]:w-full [&_table]:my-6 [&_table]:border-collapse [&_table]:text-sm
            [&_th]:text-left [&_th]:font-bold [&_th]:border-b [&_th]:border-border [&_th]:py-2 [&_th]:px-3
            [&_td]:border-b [&_td]:border-border [&_td]:py-2 [&_td]:px-3 [&_td]:align-top"
          dangerouslySetInnerHTML={{ __html: post.contentHtml }}
        />
      </article>
    </div>
  );
}
