import { getAllContent } from "@/lib/content";
import { BlogClient } from "./blog-client";

export const metadata = {
  title: "Blog — Giulia",
  description: "Thoughts on software engineering, architecture, and more.",
};

export default async function BlogListing() {
  const postsEn = await getAllContent("blog", "en");
  const postsIt = await getAllContent("blog", "it");

  return <BlogClient postsEn={postsEn} postsIt={postsIt} />;
}
