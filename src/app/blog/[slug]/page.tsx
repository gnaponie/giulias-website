import { notFound } from "next/navigation";
import Link from "next/link";
import { getContentBySlug, getAllContent } from "@/lib/content";

export async function generateStaticParams() {
  const posts = await getAllContent("blog");
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getContentBySlug("blog", slug);
  if (!post) return { title: "Post Not Found" };
  return {
    title: `${post.meta.title} — Giulia`,
    description: typeof post.meta.excerpt === "string" ? post.meta.excerpt : undefined,
  };
}

export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getContentBySlug("blog", slug);

  if (!post) notFound();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
      <Link
        href="/blog"
        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        &larr; Back to blog
      </Link>
      <article className="mt-8">
        <header className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight">
            {String(post.meta.title)}
          </h1>
          {post.meta.date && (
            <time className="mt-2 block text-sm text-muted-foreground">
              {new Date(post.meta.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
          )}
        </header>
        <div
          className="prose prose-zinc dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: post.contentHtml }}
        />
      </article>
    </div>
  );
}
