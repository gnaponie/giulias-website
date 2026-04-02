import { getAllContent } from "@/lib/content";

export const metadata = {
  title: "Talks — Giulia",
  description: "Presentations and talks given by Giulia.",
};

export default async function TalksListing() {
  const talks = await getAllContent("talks");

  if (talks.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16">
        <h1 className="font-mono text-2xl font-bold">Talks</h1>
        <p className="mt-4 text-muted-foreground">No talks yet.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16">
      <h1 className="font-mono text-2xl font-bold mb-8">Talks</h1>
      <div className="relative border-l-2 border-border pl-6 space-y-10">
        {talks.map((talk) => (
          <div key={talk.slug} className="relative">
            <div className="absolute -left-[calc(1.5rem+5px)] top-1.5 w-2.5 h-2.5 rounded-full bg-primary border-2 border-background" />
            <div>
              <h2 className="font-mono text-lg font-semibold text-foreground">
                {talk.meta.title as string}
              </h2>
              <div className="mt-1 flex items-center gap-3 text-sm text-muted-foreground font-mono">
                {typeof talk.meta.event === "string" && talk.meta.event && (
                  <span className="text-accent-warm">{talk.meta.event}</span>
                )}
                {talk.meta.date && (
                  <time className="tabular-nums">
                    {new Date(talk.meta.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                    })}
                  </time>
                )}
              </div>
              <div
                className="mt-3 prose prose-invert prose-zinc prose-sm max-w-none
                  prose-a:text-primary prose-headings:font-mono"
                dangerouslySetInnerHTML={{ __html: talk.contentHtml }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
