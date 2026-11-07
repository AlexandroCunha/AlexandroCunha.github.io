import { config } from "@/lib/config";
import { getRepos } from "@/lib/github";

export default async function Home() {
  const repos = await getRepos();

  return (
    <main className="wrap">
      <section className="hero">
        <p className="prompt">$ whoami</p>
        <h1>
          Oi, eu sou o {config.name}<span className="cursor">_</span>
        </h1>
        <p className="role">
          {config.role} · {config.tagline}
        </p>
        <div className="links">
          <a href={config.links.github}>github</a>
          <a href={config.links.linkedin}>linkedin</a>
          <a href={config.links.email}>email</a>
        </div>
      </section>

      <section>
        <h2>
          <span className="prompt">$</span> cat sobre.md
        </h2>
        {config.bio.map((line) => (
          <p key={line}>{line}</p>
        ))}
        <ul className="plain">
          {config.hobbies.map((h) => (
            <li key={h}>{h}</li>
          ))}
        </ul>
      </section>

      <section>
        <h2>
          <span className="prompt">$</span> ls skills/
        </h2>
        <ul className="tags">
          {config.skills.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
      </section>

      <section>
        <h2>
          <span className="prompt">$</span> git log --projetos
        </h2>
        <div className="grid">
          {repos.map((r) => (
            <article key={r.name} className="card">
              <h3>
                <a href={r.html_url}>{r.name}</a>
              </h3>
              <p>{r.description ?? "Sem descrição."}</p>
              <footer>
                {r.language && <span>● {r.language}</span>}
                <span>★ {r.stargazers_count}</span>
                {r.homepage && <a href={r.homepage}>demo ↗</a>}
              </footer>
            </article>
          ))}
        </div>
        <p className="more">
          <a href={config.links.github}>ver todos no GitHub →</a>
        </p>
      </section>

      <footer className="foot">
        © {new Date().getFullYear()} {config.name}
      </footer>
    </main>
  );
}
