import Link from "next/link";
import { getAllContent } from "@/lib/content";

export const metadata = {
  title: "Videos — Giulia",
  description: "Talks, podcasts, and presentations by Giulia.",
};

export default async function VideosListing() {
  const videos = await getAllContent("videos");

  if (videos.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16">
        <h1 className="font-mono text-2xl font-bold">Videos</h1>
        <p className="mt-4 text-muted-foreground">No videos yet.</p>
      </div>
    );
  }

  const allTags = new Set<string>();
  for (const video of videos) {
    if (Array.isArray(video.meta.tags)) {
      for (const tag of video.meta.tags as string[]) {
        allTags.add(tag);
      }
    }
  }
  const tags = Array.from(allTags).sort();

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      <h1 className="font-mono text-2xl font-bold mb-8">Videos</h1>
      <div className="flex flex-col sm:flex-row gap-10">
        {/* Videos timeline */}
        <div className="flex-1 min-w-0 relative border-l-2 border-border pl-6 space-y-10">
          {videos.map((video) => (
            <div key={video.slug} className="relative">
              <div className="absolute -left-[calc(1.5rem+5px)] top-1.5 w-2.5 h-2.5 rounded-full bg-primary border-2 border-background" />
              <div>
                <h2 className="font-mono text-lg font-semibold">
                  {typeof video.meta.youtube === "string" && video.meta.youtube ? (
                    <a
                      href={video.meta.youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-foreground hover:text-primary transition-colors"
                    >
                      {video.meta.title as string}
                    </a>
                  ) : (
                    <span className="text-foreground">{video.meta.title as string}</span>
                  )}
                </h2>
                <div className="mt-1 flex items-center gap-3 text-sm text-muted-foreground font-mono">
                  {typeof video.meta.event === "string" && video.meta.event && (
                    <span className="text-primary">{video.meta.event}</span>
                  )}
                  {video.meta.date && (
                    <time className="tabular-nums">
                      {new Date(video.meta.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                      })}
                    </time>
                  )}
                </div>
                {Array.isArray(video.meta.tags) && video.meta.tags.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {(video.meta.tags as string[]).map((tag) => (
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

        {/* Tags sidebar */}
        {tags.length > 0 && (
          <aside className="sm:w-40 shrink-0 sm:border-l sm:border-border sm:pl-6">
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
          </aside>
        )}
      </div>
    </div>
  );
}
