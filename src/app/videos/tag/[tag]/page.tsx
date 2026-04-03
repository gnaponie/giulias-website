import { getAllContent } from "@/lib/content";
import { VideoTagClient } from "./video-tag-client";

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

  const allEn = await getAllContent("videos", "en");
  const allIt = await getAllContent("videos", "it");
  const videosEn = allEn.filter(
    (v) => Array.isArray(v.meta.tags) && (v.meta.tags as string[]).includes(tag)
  );
  const videosIt = allIt.filter(
    (v) => Array.isArray(v.meta.tags) && (v.meta.tags as string[]).includes(tag)
  );

  return <VideoTagClient tag={tag} videosEn={videosEn} videosIt={videosIt} />;
}
