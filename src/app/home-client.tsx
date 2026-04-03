"use client";

import Link from "next/link";
import { useLanguage, t } from "@/lib/language";

interface BioData {
  meta: { title: string; [key: string]: unknown };
  contentHtml: string;
}

export function HomeClient({
  bioEn,
  bioIt,
}: {
  bioEn: BioData | null;
  bioIt: BioData | null;
}) {
  const { lang } = useLanguage();
  const s = t[lang];
  const bio = lang === "it" && bioIt ? bioIt : bioEn;

  if (!bio) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16 text-center">
        <h1 className="text-2xl font-mono font-bold">Bio</h1>
        <p className="mt-4 text-muted-foreground">
          Bio content is not available yet.
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
        className="prose prose-zinc dark:prose-invert max-w-none
          prose-headings:font-mono prose-headings:text-foreground"
        dangerouslySetInnerHTML={{ __html: bio.contentHtml }}
      />

      <nav className="mt-12 flex gap-8 text-lg">
        {[
          { href: "/blog", label: s.blog },
          { href: "/videos", label: s.videos },
          { href: "/projects", label: s.projects },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="text-primary hover:underline font-mono font-semibold"
          >
            {item.label} →
          </Link>
        ))}
      </nav>
    </div>
  );
}
