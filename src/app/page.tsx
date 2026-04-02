import Link from "next/link";
import { getBioContent } from "@/lib/content";

export default async function BioPage() {
  const bio = await getBioContent();

  if (!bio) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16 text-center">
        <h1 className="text-2xl font-mono font-bold">Bio</h1>
        <p className="mt-4 text-muted-foreground">
          Bio content is not available yet. Add a <code className="text-sm">content/bio.md</code> file to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
      <header className="mb-12">
        <h1 className="font-mono text-2xl sm:text-3xl font-bold text-foreground">
          Giulia
        </h1>
        <p className="mt-1 text-muted-foreground">
          Principal Software Engineer @ Red Hat
        </p>
      </header>

      <div
        className="prose prose-invert prose-zinc max-w-none
          prose-a:text-primary prose-a:no-underline hover:prose-a:underline
          prose-headings:font-mono prose-headings:text-foreground"
        dangerouslySetInnerHTML={{ __html: bio.contentHtml }}
      />

      <nav className="mt-16 flex gap-6 text-sm">
        {[
          { href: "/blog", label: "Blog" },
          { href: "/talks", label: "Talks" },
          { href: "/projects", label: "Projects" },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="text-primary hover:underline font-mono"
          >
            {item.label} →
          </Link>
        ))}
      </nav>
    </div>
  );
}
