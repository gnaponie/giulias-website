import Link from "next/link";
import { getAllContent } from "@/lib/content";

export async function generateStaticParams() {
  const videos = await getAllContent("videos");
  const tags = new Set<string>();
  for (const video of videos) {
    if (Array.isArray(video.meta.tags)) {
      for (const tag of video.meta.tags as string[]) {
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
  return { title: `#${tag} — Videos` };
}

export default async function VideoTagPage({
  params,
}: {
  params: Promise<{ tag: string }>;
}) {
  const { tag: rawTag } = await params;
  const tag = decodeURIComponent(rawTag);
  const allVideos = await getAllContent("videos");
  const videos = allVideos.filter(
    (v) => Array.isArray(v.meta.tags) && (v.meta.tags as string[]).includes(tag)
  );

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16">
      <h1 className="font-mono text-2xl font-bold mb-8">
        <span className="text-muted-foreground">#</span>{tag}
      </h1>
      {videos.length === 0 ? (
        <p className="text-muted-foreground">No videos with this tag.</p>
      ) : (
        <div className="relative border-l-2 border-border pl-6 space-y-10">
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
              </div>
            </div>
          ))}
        </div>
      )}
      <Link href="/videos" className="mt-8 inline-block text-sm text-primary hover:underline font-mono">
        ← All videos
      </Link>
    </div>
  );
}
