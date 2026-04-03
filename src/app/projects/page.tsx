import { getAllContent } from "@/lib/content";
import { ProjectsClient } from "./projects-client";

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

interface SerializedProject {
  slug: string;
  title: string;
  description: string | null;
  github: string | null;
  tech: string[];
  size: string | null;
  commits: GitHubCommit[];
}

export default async function ProjectsListing() {
  const projectsEn = await getAllContent("projects", "en");
  const projectsIt = await getAllContent("projects", "it");

  const commitsMap = new Map<string, GitHubCommit[]>();
  await Promise.all(
    projectsEn.map(async (project) => {
      const github =
        typeof project.meta.github === "string" ? project.meta.github : null;
      if (!github) return;
      const isLarge = project.meta.size === "large";
      const commits = await getLatestCommits(github, isLarge ? 5 : 3);
      commitsMap.set(project.slug, commits);
    })
  );

  const serialize = (projects: typeof projectsEn): SerializedProject[] =>
    projects.map((p) => ({
      slug: p.slug,
      title: p.meta.title as string,
      description:
        typeof p.meta.description === "string" ? p.meta.description : null,
      github: typeof p.meta.github === "string" ? p.meta.github : null,
      tech: Array.isArray(p.meta.tech) ? (p.meta.tech as string[]) : [],
      size: typeof p.meta.size === "string" ? p.meta.size : null,
      commits: commitsMap.get(p.slug) ?? [],
    }));

  return (
    <ProjectsClient
      projectsEn={serialize(projectsEn)}
      projectsIt={serialize(projectsIt)}
    />
  );
}
