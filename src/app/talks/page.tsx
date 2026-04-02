import { getAllContent } from "@/lib/content";

export const metadata = {
  title: "Talks — Giulia",
  description: "Presentations and talks given by Giulia.",
};

const gradients = [
  "from-accent-rose to-accent-amber",
  "from-accent-cool to-accent-violet",
  "from-accent-violet to-accent-rose",
  "from-accent-amber to-accent-cool",
];

export default async function TalksListing() {
  const talks = await getAllContent("talks");

  if (talks.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 text-center">
        <div className="text-5xl mb-4">🎤</div>
        <h1 className="text-3xl font-semibold tracking-tight">Talks</h1>
        <p className="mt-4 text-muted-foreground">
          No talks yet. Check back soon!
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
      <div className="mb-10">
        <h1 className="text-3xl font-semibold tracking-tight">
          <span className="bg-gradient-to-r from-accent-cool to-accent-violet bg-clip-text text-transparent">Talks</span>
        </h1>
        <p className="mt-2 text-muted-foreground">Conferences, meetups, and things I've presented.</p>
      </div>
      <div className="grid gap-4">
        {talks.map((talk, i) => (
          <div
            key={talk.slug}
            className="rounded-2xl border border-border bg-card overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className={`h-1.5 bg-gradient-to-r ${gradients[i % gradients.length]}`} />
            <div className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h2 className="text-lg font-semibold">{talk.meta.title as string}</h2>
                  {typeof talk.meta.event === "string" && talk.meta.event && (
                    <p className="mt-1 text-sm text-muted-foreground">{talk.meta.event}</p>
                  )}
                  {talk.meta.date && (
                    <time className="mt-1 block text-xs text-muted-foreground">
                      {new Date(talk.meta.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                      })}
                    </time>
                  )}
                </div>
              </div>
              <div
                className="mt-4 prose prose-zinc dark:prose-invert prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: talk.contentHtml }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
