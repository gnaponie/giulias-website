import { getAllContent } from "@/lib/content";
import { VideosClient } from "./videos-client";

export const metadata = {
  title: "Videos — Giulia",
  description: "Talks, podcasts, and presentations by Giulia.",
};

export default async function VideosListing() {
  const videos = await getAllContent("videos");

  const serialized = videos.map((video) => ({
    slug: video.slug,
    title: video.meta.title as string,
    event: typeof video.meta.event === "string" ? video.meta.event : null,
    date: video.meta.date,
    tags: Array.isArray(video.meta.tags) ? (video.meta.tags as string[]) : [],
    language: typeof video.meta.language === "string" ? video.meta.language : null,
    youtube: typeof video.meta.youtube === "string" ? video.meta.youtube : null,
    contentHtml: video.contentHtml,
  }));

  return <VideosClient videos={serialized} />;
}
