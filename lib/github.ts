import { config } from "./config";

export type Repo = {
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  stargazers_count: number;
  fork: boolean;
  topics?: string[];
};

// Fallback caso a API falhe no build (limite de requisições, etc.)
const fallback: Repo[] = [
  {
    name: "Financify",
    description: "API REST para Gerenciamento de Finanças Pessoais",
    html_url: `https://github.com/${config.githubUser}/Financify`,
    homepage: null,
    language: "JavaScript",
    stargazers_count: 0,
    fork: false,
  },
];

export async function getRepos(): Promise<Repo[]> {
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
    const all = (await res.json()) as Repo[];

    const visible = all.filter(
      (r) => !r.fork && !config.hidden.includes(r.name),
    );
    const rank = (r: Repo) => {
      const i = config.featured.indexOf(r.name);
      return i === -1 ? Number.MAX_SAFE_INTEGER : i;
    };
    visible.sort(
      (a, b) =>
        rank(a) - rank(b) || b.stargazers_count - a.stargazers_count,
    );
    return visible.slice(0, config.maxProjects);
  } catch (e) {
    console.warn("Falha ao buscar repositórios, usando fallback:", e);
    return fallback;
  }
}
