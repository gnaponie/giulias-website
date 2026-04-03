import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";
import highlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";

const contentDirectory = path.join(process.cwd(), "content");

export interface ContentMeta {
  slug: string;
  title: string;
  date: string;
  [key: string]: unknown;
}

export interface ContentItem {
  slug: string;
  meta: ContentMeta;
  contentHtml: string;
}

async function processMarkdown(content: string): Promise<string> {
  const processed = await remark()
    .use(html, { sanitize: false })
    .use(highlight)
    .process(content);
  return processed.toString();
}

export async function getContentBySlug(
  directory: string,
  slug: string,
  lang: string = "en"
): Promise<ContentItem | null> {
  const base = lang === "it" ? path.join(contentDirectory, "it") : contentDirectory;
  const fullPath = path.join(base, directory, `${slug}.md`);
  if (!fs.existsSync(fullPath)) return null;

  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);
  const contentHtml = await processMarkdown(content);

  return {
    slug,
    meta: {
      slug,
      title: (data.title as string) ?? slug,
      date: (data.date as string) ?? "",
      ...data,
    },
    contentHtml,
  };
}

export async function getAllContent(
  directory: string,
  lang: string = "en"
): Promise<ContentItem[]> {
  const base = lang === "it" ? path.join(contentDirectory, "it") : contentDirectory;
  const dirPath = path.join(base, directory);
  if (!fs.existsSync(dirPath)) return [];

  const fileNames = fs.readdirSync(dirPath).filter((f) => f.endsWith(".md"));
  const items = await Promise.all(
    fileNames.map(async (fileName) => {
      const slug = fileName.replace(/\.md$/, "");
      const item = await getContentBySlug(directory, slug, lang);
      return item!;
    })
  );

  return items.sort((a, b) =>
    (b.meta.date ?? "").localeCompare(a.meta.date ?? "")
  );
}

export async function getBioContent(lang: string = "en"): Promise<{
  meta: ContentMeta;
  contentHtml: string;
} | null> {
  const base = lang === "it" ? path.join(contentDirectory, "it") : contentDirectory;
  const bioPath = path.join(base, "bio.md");
  if (!fs.existsSync(bioPath)) return null;

  const fileContents = fs.readFileSync(bioPath, "utf8");
  const { data, content } = matter(fileContents);
  const contentHtml = await processMarkdown(content);

  return {
    meta: {
      slug: "bio",
      title: (data.title as string) ?? "Bio",
      date: "",
      ...data,
    },
    contentHtml,
  };
}
