import { getAllContent } from "@/lib/content";

export const metadata = {
  title: "Projects — Giulia",
  description: "Selected projects and work by Giulia.",
};

interface GitHubCommit {
  sha: string;
  commit: {
    message: string;
    author: {
      date: string;
    };
  };
  html_url: string;
}

async function getLatestCommits(
  githubUrl: string,
  count: number
): Promise<GitHubCommit[]> {
  const match = githubUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
  if (!match) return [];
  const [, owner, repo] = match;
  try {
    const res = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/commits?author=gnaponie&per_page=${count}`,
      { next: { revalidate: 86400 } }
    );
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

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

  // Fetch commits for all projects in parallel
  const commitsMap = new Map<string, GitHubCommit[]>();
  await Promise.all(
    projects.map(async (project) => {
      const github =
        typeof project.meta.github === "string" ? project.meta.github : null;
      if (!github) return;
      const isLarge = project.meta.size === "large";
      const commits = await getLatestCommits(github, isLarge ? 5 : 3);
      commitsMap.set(project.slug, commits);
    })
  );

  const getSpan = (size: unknown) => {
    if (size === "large") return "sm:col-span-2 sm:row-span-2";
    if (size === "medium") return "sm:col-span-2";
    return "";
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
      <h1 className="font-mono text-2xl font-bold mb-2">Projects</h1>
      <p className="text-sm text-muted-foreground mb-8 font-mono">
        Turns out, even in open source, not everything is... open. Here&apos;s what made the cut.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {projects.map((project) => {
          const tech = Array.isArray(project.meta.tech)
            ? (project.meta.tech as string[])
            : [];
          const github =
            typeof project.meta.github === "string"
              ? project.meta.github
              : null;
          const description =
            typeof project.meta.description === "string"
              ? project.meta.description
              : null;
          const size = project.meta.size;
          const isLarge = size === "large";
          const commits = commitsMap.get(project.slug) ?? [];

          return (
            <div
              key={project.slug}
              className={`card-subtle rounded-lg p-5 flex flex-col ${getSpan(size)}`}
            >
              <h2
                className={`font-mono font-semibold ${isLarge ? "text-xl" : "text-lg"}`}
              >
                {github ? (
                  <a
                    href={github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-foreground hover:text-primary transition-colors"
                  >
                    {project.meta.title as string}
                  </a>
                ) : (
                  (project.meta.title as string)
                )}
              </h2>
              {description && (
                <p
                  className={`mt-2 text-muted-foreground ${isLarge ? "text-base" : "text-sm"}`}
                >
                  {description}
                </p>
              )}
              {tech.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {tech.map((t) => (
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
                    latest commits:
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
              {github && (
                <div className="mt-auto pt-4 flex gap-4 text-sm font-mono">
                  <a
                    href={github}
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
