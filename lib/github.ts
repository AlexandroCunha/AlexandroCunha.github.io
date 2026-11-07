import { config, type FeaturedProject } from "./config";

type Repo = {
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  stargazers_count: number;
  fork: boolean;
};

export type Project = {
  title: string;
  description: string;
  stack: string[];
  url: string;
  homepage?: string;
  stars: number | null;
};

async function fetchRepos(): Promise<Repo[]> {
  try {
    const headers: Record<string, string> = {
      Accept: "application/vnd.github+json",
    };
    if (process.env.GITHUB_TOKEN) {
      headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    }
    const res = await fetch(
      `https://api.github.com/users/${config.githubUser}/repos?per_page=100&sort=updated`,
      { headers },
    );
    if (!res.ok) throw new Error(`GitHub API ${res.status}`);
    return (await res.json()) as Repo[];
  } catch (e) {
    console.warn("Falha ao buscar repositórios, usando dados do config:", e);
    return [];
  }
}

function resolve(p: FeaturedProject, repos: Repo[]): Project {
  const repo = repos.find(
    (r) => !r.fork && r.name.toLowerCase().includes(p.match.toLowerCase()),
  );
  return {
    title: p.title,
    description: p.description, // texto do config (mantém o site em inglês)
    stack: p.stack,
    url: repo?.html_url ?? p.url,
    homepage: repo?.homepage || p.homepage || undefined,
    stars: repo ? repo.stargazers_count : null,
  };
}

export async function getProjects(): Promise<Project[]> {
  const repos = await fetchRepos();
  return config.projects.map((p) => resolve(p, repos));
}
