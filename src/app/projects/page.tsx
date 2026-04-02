import { getAllContent } from "@/lib/content";

export const metadata = {
  title: "Projects — Giulia",
  description: "Selected projects and work by Giulia.",
};

export default async function ProjectsListing() {
  const projects = await getAllContent("projects");

  if (projects.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
        <h1 className="font-mono text-2xl font-bold">Projects</h1>
        <p className="mt-4 text-muted-foreground">No projects yet.</p>
      </div>
    );
  }

  // Assign grid sizes: first item large, then alternate medium/small
  const getSpan = (i: number) => {
    if (i === 0) return "sm:col-span-2 sm:row-span-2";
    if (i % 3 === 0) return "sm:col-span-2";
    return "";
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
      <h1 className="font-mono text-2xl font-bold mb-8">Projects</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {projects.map((project, i) => {
          const tech = Array.isArray(project.meta.tech) ? (project.meta.tech as string[]) : [];
          const github = typeof project.meta.github === "string" ? project.meta.github : null;
          const demo = typeof project.meta.demo === "string" ? project.meta.demo : null;
          const description = typeof project.meta.description === "string" ? project.meta.description : null;
          const isLarge = i === 0;

          return (
            <div
              key={project.slug}
              className={`card-subtle rounded-lg p-5 flex flex-col ${getSpan(i)}`}
            >
              <h2 className={`font-mono font-semibold ${isLarge ? "text-xl" : "text-lg"}`}>
                {project.meta.title as string}
              </h2>
              {description && (
                <p className={`mt-2 text-muted-foreground ${isLarge ? "text-base" : "text-sm"}`}>
                  {description}
                </p>
              )}
              {tech.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {tech.map((t) => (
                    <span key={t} className="text-xs font-mono text-accent-warm">
                      {t}
                    </span>
                  ))}
                </div>
              )}
              {(github || demo) && (
                <div className="mt-auto pt-4 flex gap-4 text-sm font-mono">
                  {github && (
                    <a href={github} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      GitHub →
                    </a>
                  )}
                  {demo && (
                    <a href={demo} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      Demo →
                    </a>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
