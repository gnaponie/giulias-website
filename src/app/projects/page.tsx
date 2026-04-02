import { getAllContent } from "@/lib/content";

export const metadata = {
  title: "Projects — Giulia",
  description: "Selected projects and work by Giulia.",
};

const gradients = [
  "from-accent-rose to-accent-amber",
  "from-accent-cool to-accent-violet",
  "from-accent-violet to-accent-rose",
  "from-accent-amber to-accent-cool",
];

export default async function ProjectsListing() {
  const projects = await getAllContent("projects");

  if (projects.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 text-center">
        <div className="text-5xl mb-4">🚀</div>
        <h1 className="text-3xl font-semibold tracking-tight">Projects</h1>
        <p className="mt-4 text-muted-foreground">
          No projects yet. Check back soon!
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
      <div className="mb-10">
        <h1 className="text-3xl font-semibold tracking-tight">
          <span className="bg-gradient-to-r from-accent-amber to-accent-cool bg-clip-text text-transparent">Projects</span>
        </h1>
        <p className="mt-2 text-muted-foreground">Things I've built and contributed to.</p>
      </div>
      <div className="grid gap-4">
        {projects.map((project, i) => {
          const tech = Array.isArray(project.meta.tech) ? project.meta.tech as string[] : [];
          const github = typeof project.meta.github === "string" ? project.meta.github : null;
          const demo = typeof project.meta.demo === "string" ? project.meta.demo : null;
          const description = typeof project.meta.description === "string" ? project.meta.description : null;

          return (
            <div
              key={project.slug}
              className="rounded-2xl border border-border bg-card overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className={`h-1.5 bg-gradient-to-r ${gradients[i % gradients.length]}`} />
              <div className="p-6">
                <h2 className="text-lg font-semibold">{project.meta.title as string}</h2>
                {description && (
                  <p className="mt-2 text-muted-foreground text-sm">
                    {description}
                  </p>
                )}
                {tech.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {tech.map((t) => (
                      <span
                        key={t}
                        className="inline-flex items-center rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}
                {(github || demo) && (
                  <div className="mt-4 flex gap-4 text-sm">
                    {github && (
                      <a
                        href={github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-primary transition-colors font-medium"
                      >
                        GitHub ↗
                      </a>
                    )}
                    {demo && (
                      <a
                        href={demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-primary transition-colors font-medium"
                      >
                        Live Demo ↗
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
