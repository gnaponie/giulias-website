"use client";

import { useLanguage, t } from "@/lib/language";

interface GitHubCommit {
  sha: string;
  commit: {
    message: string;
    author: { date: string };
  };
  html_url: string;
}

interface Project {
  slug: string;
  title: string;
  description: string | null;
  github: string | null;
  tech: string[];
  size: string | null;
  commits: GitHubCommit[];
}

export function ProjectsClient({
  projectsEn,
  projectsIt,
}: {
  projectsEn: Project[];
  projectsIt: Project[];
}) {
  const { lang } = useLanguage();
  const s = t[lang];
  const projects =
    lang === "it" && projectsIt.length > 0 ? projectsIt : projectsEn;
  // Always use EN commits (they're the same data)
  const commitsMap = new Map(
    projectsEn.map((p) => [p.slug, p.commits])
  );

  if (projects.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
        <h1 className="font-mono text-2xl font-bold">{s.projects}</h1>
        <p className="mt-4 text-muted-foreground">{s.noProjects}</p>
      </div>
    );
  }

  const getSpan = (size: string | null) => {
    if (size === "large") return "sm:col-span-2 sm:row-span-2";
    if (size === "medium") return "sm:col-span-2";
    return "";
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
      <h1 className="font-mono text-2xl font-bold mb-2">{s.projects}</h1>
      <p className="text-sm text-muted-foreground mb-8 font-mono">
        {s.projectsIntro}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {projects.map((project) => {
          const isLarge = project.size === "large";
          const commits = commitsMap.get(project.slug) ?? [];

          return (
            <div
              key={project.slug}
              className={`card-subtle rounded-lg p-5 flex flex-col ${getSpan(project.size)}`}
            >
              <h2
                className={`font-mono font-semibold ${isLarge ? "text-xl" : "text-lg"}`}
              >
                {project.github ? (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-foreground hover:text-primary transition-colors"
                  >
                    {project.title}
                  </a>
                ) : (
                  project.title
                )}
              </h2>
              {project.description && (
                <p
                  className={`mt-2 text-muted-foreground ${isLarge ? "text-base" : "text-sm"}`}
                >
                  {project.description}
                </p>
              )}
              {project.tech.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {project.tech.map((t) => (
                    <span
                      key={t}
                      className="text-xs font-mono text-accent-warm"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              )}
              {commits.length > 0 && (
                <div className="mt-3 space-y-1.5">
                  <p className="text-xs font-mono text-muted-foreground">
                    {s.latestCommits}
                  </p>
                  {commits.map((c) => (
                    <a
                      key={c.sha}
                      href={c.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-xs font-mono text-muted-foreground hover:text-primary transition-colors truncate"
                    >
                      <span className="text-accent-warm">
                        {c.sha.slice(0, 7)}
                      </span>{" "}
                      {c.commit.message.split("\n")[0]}
                    </a>
                  ))}
                </div>
              )}
              {project.github && (
                <div className="mt-auto pt-4 flex gap-4 text-sm font-mono">
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    GitHub →
                  </a>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
