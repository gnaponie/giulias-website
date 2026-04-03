"use client";

import Link from "next/link";
import { useState } from "react";

interface Video {
  slug: string;
  title: string;
  event: string | null;
  date: string;
  tags: string[];
  language: string | null;
  youtube: string | null;
  contentHtml: string;
}

export function VideosClient({ videos }: { videos: Video[] }) {
  const [langFilter, setLangFilter] = useState<string | null>(null);

  if (videos.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16">
        <h1 className="font-mono text-2xl font-bold">Videos</h1>
        <p className="mt-4 text-muted-foreground">No videos yet.</p>
      </div>
    );
  }

  const allTags = new Set<string>();
  const allLangs = new Set<string>();
  for (const video of videos) {
    for (const tag of video.tags) allTags.add(tag);
    if (video.language) allLangs.add(video.language);
  }
  const tags = Array.from(allTags).sort();
  const langs = Array.from(allLangs).sort();

  const filtered = langFilter
    ? videos.filter((v) => v.language === langFilter)
    : videos;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      <h1 className="font-mono text-2xl font-bold mb-8">Videos</h1>
      <div className="flex flex-col sm:flex-row gap-10">
        {/* Videos timeline */}
        <div className="flex-1 min-w-0 relative border-l-2 border-border pl-6 space-y-10">
          {filtered.map((video) => (
            <div key={video.slug} className="relative">
              <div className="absolute -left-[calc(1.5rem+5px)] top-1.5 w-2.5 h-2.5 rounded-full bg-primary border-2 border-background" />
              <div>
                <h2 className="font-mono text-lg font-semibold">
                  {video.youtube ? (
                    <a
                      href={video.youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-foreground hover:text-primary transition-colors"
                    >
                      {video.title}
                    </a>
                  ) : (
                    <span className="text-foreground">{video.title}</span>
                  )}
                </h2>
                <div className="mt-1 flex items-center gap-3 text-sm text-muted-foreground font-mono">
                  {video.event && (
                    <span className="text-primary">{video.event}</span>
                  )}
                  {video.date && (
                    <time className="tabular-nums">
                      {new Date(video.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                      })}
                    </time>
                  )}
                  {video.language && (
                    <span className="text-xs font-mono font-bold px-1.5 py-0.5 rounded bg-[#e07a5f]/15 text-[#e07a5f] dark:bg-[#689d6a]/20 dark:text-[#8ec07c]">
                      {video.language}
                    </span>
                  )}
                </div>
                {video.tags.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {video.tags.map((tag) => (
                      <Link
                        key={tag}
                        href={`/videos/tag/${encodeURIComponent(tag)}`}
                        className="text-xs font-mono text-accent-warm hover:text-primary transition-colors"
                      >
                        #{tag}
                      </Link>
                    ))}
                  </div>
                )}
                <div
                  className="mt-3 prose prose-zinc dark:prose-invert prose-sm max-w-none
                    prose-a:text-primary prose-headings:font-mono"
                  dangerouslySetInnerHTML={{ __html: video.contentHtml }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar */}
        <aside className="sm:w-40 shrink-0 sm:border-l sm:border-border sm:pl-6">
          {langs.length > 0 && (
            <div className="mb-6">
              <h2 className="font-mono text-sm font-semibold text-muted-foreground mb-3">Language</h2>
              <div className="flex flex-row gap-1.5">
              <button
                onClick={() => setLangFilter(null)}
                className={`text-xs font-mono font-bold px-1.5 py-0.5 rounded transition-colors ${
                  langFilter === null
                    ? "bg-[#e07a5f]/30 text-[#e07a5f] dark:bg-[#689d6a]/40 dark:text-[#8ec07c]"
                    : "bg-[#e07a5f]/15 text-[#e07a5f] dark:bg-[#689d6a]/20 dark:text-[#8ec07c] hover:bg-[#e07a5f]/25 dark:hover:bg-[#689d6a]/30"
                }`}
              >
                ALL
              </button>
              {langs.map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLangFilter(langFilter === lang ? null : lang)}
                  className={`text-xs font-mono font-bold px-1.5 py-0.5 rounded transition-colors ${
                    langFilter === lang
                      ? "bg-[#e07a5f]/30 text-[#e07a5f] dark:bg-[#689d6a]/40 dark:text-[#8ec07c]"
                      : "bg-[#e07a5f]/15 text-[#e07a5f] dark:bg-[#689d6a]/20 dark:text-[#8ec07c] hover:bg-[#e07a5f]/25 dark:hover:bg-[#689d6a]/30"
                  }`}
                >
                  {lang}
                </button>
              ))}
              </div>
            </div>
          )}
          {tags.length > 0 && (
            <div>
              <h2 className="font-mono text-sm font-semibold text-muted-foreground mb-3">Tags</h2>
              <ul className="flex flex-row flex-wrap sm:flex-col gap-2">
                {tags.map((tag) => (
                  <li key={tag}>
                    <Link
                      href={`/videos/tag/${encodeURIComponent(tag)}`}
                      className="text-sm font-mono text-muted-foreground hover:text-primary transition-colors"
                    >
                      #{tag}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
