import { config } from "@/lib/config";
import { getProjects } from "@/lib/github";
import Reveal from "@/components/Reveal";
import HeroArt from "@/components/HeroArt";

function Divider() {
  return (
    <svg className="divider" viewBox="0 0 1200 60" preserveAspectRatio="none" aria-hidden="true">
      <path d="M0 30 C 200 0, 400 60, 600 30 S 1000 0, 1200 30" />
    </svg>
  );
}

export default async function Home() {
  const projects = await getProjects();
  const { about } = config;

  return (
    <>
      <header className="nav">
        <a href="#top" className="brand">
          {config.name}
        </a>
        <nav>
          <a href="#about">About</a>
          <a href="#projects">Projects</a>
          <a href="#contact">Contact</a>
        </nav>
      </header>

      <main id="top">
        <section className="hero">
          <HeroArt />
          <div className="hero-text">
            <p className="eyebrow">{config.role}</p>
            <h1>
              Hi, I&apos;m
              <br />
              <em>{config.name}.</em>
            </h1>
            <p className="lead">
              {config.headline}
              <br />
              {config.location}
            </p>
            <a className="btn" href="#projects">
              View projects
            </a>
          </div>
          <a className="scroll" href="#about" aria-label="Scroll to About">
            ↓
          </a>
        </section>

        <section id="about" className="section">
          <Reveal>
            <h2>About</h2>
          </Reveal>

          <div className="about">
            <Reveal delay={80}>
              <div className="about-text">
                <p className="about-lead">{about.intro}</p>
                <p>{about.journey}</p>

                <h3 className="sub">{about.interestsTitle}</h3>
                <ul className="interests">
                  {about.interests.map((i) => (
                    <li key={i}>{i}</li>
                  ))}
                </ul>
              </div>
            </Reveal>

            <Reveal delay={160}>
              <div className="side">
                <div className="skill-groups">
                  <h3>Technologies</h3>
                  {config.skillGroups.map((g) => (
                    <div key={g.title} className="skill-group">
                      <span className="skill-title">{g.title}</span>
                      <ul className="skills">
                        {g.items.map((s) => (
                          <li key={s}>{s}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>

          <Reveal>
            <div className="facts">
              <h3 className="sub">{about.factsTitle}</h3>
              <ul>
                {about.facts.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal>
            <div className="philosophy">
              <span className="skill-title">{about.philosophyTitle}</span>
              <p>{about.philosophy}</p>
              <p className="motto">
                {about.motto.map((m) => (
                  <span key={m}>{m}</span>
                ))}
              </p>
            </div>
          </Reveal>
        </section>

        <Divider />

        <section id="projects" className="section projects">
          <Reveal>
            <h2>Projects</h2>
          </Reveal>
          <div className="project-list">
            {projects.map((p, i) => (
              <Reveal key={p.title} delay={i * 90} className={`pwrap p${i % 2}`}>
                <article className="project">
                  <span className="num">0{i + 1}</span>
                  <h3>{p.title}</h3>
                  <p>{p.description}</p>
                  <ul className="stack">
                    {p.stack.map((t) => (
                      <li key={t}>{t}</li>
                    ))}
                  </ul>
                  <div className="plinks">
                    {p.homepage ? (
                      <a
                        className="plink live main"
                        href={p.homepage}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Live demo ↗
                      </a>
                    ) : (
                      <span className="plink soon" aria-disabled="true">
                        Live demo · coming soon
                      </span>
                    )}
                    <a
                      className={`plink${p.homepage ? "" : " main"}`}
                      href={p.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Code →
                    </a>
                    {p.stars !== null && <span>★ {p.stars}</span>}
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </section>

        <Divider />

        <section id="contact" className="section contact">
          <Reveal>
            <h2>Contact</h2>
            <p className="lead">Let&apos;s talk?</p>
            <div className="contact-links">
              <a href={config.links.github}>GitHub</a>
              <a href={config.links.linkedin}>LinkedIn</a>
              {config.links.email && <a href={config.links.email}>Email</a>}
            </div>
          </Reveal>
        </section>
      </main>

      <footer className="foot">
        © {new Date().getFullYear()} {config.name}
      </footer>
    </>
  );
}
