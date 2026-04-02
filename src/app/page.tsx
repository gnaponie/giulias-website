import Link from "next/link";
import { getBioContent } from "@/lib/content";

export default async function BioPage() {
  const bio = await getBioContent();

  if (!bio) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 text-center">
        <h1 className="text-3xl font-semibold tracking-tight">Bio</h1>
        <p className="mt-4 text-muted-foreground">
          Bio content is not available yet. Add a <code className="text-sm">content/bio.md</code> file to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
      <div className="text-center mb-10">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight bg-gradient-to-r from-primary via-accent-cool to-accent-amber bg-clip-text text-transparent">
          Giulia
        </h1>
        <p className="mt-1 text-muted-foreground">Principal Software Engineer @ Red Hat</p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
        <div
          className="prose prose-zinc dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: bio.contentHtml }}
        />
      </div>

      <div className="mt-12 grid sm:grid-cols-3 gap-4">
        {[
          { href: "/blog", emoji: "✍️", label: "Blog", desc: "Thoughts & learnings" },
          { href: "/talks", emoji: "🎤", label: "Talks", desc: "Conferences & meetups" },
          { href: "/projects", emoji: "🚀", label: "Projects", desc: "Things I've built" },
        ].map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="group rounded-2xl border border-border bg-card p-6 text-center hover:shadow-md hover:border-primary/40 transition-all"
          >
            <span className="text-3xl">{item.emoji}</span>
            <h3 className="mt-2 font-semibold group-hover:text-primary transition-colors">{item.label}</h3>
            <p className="text-sm text-muted-foreground">{item.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
