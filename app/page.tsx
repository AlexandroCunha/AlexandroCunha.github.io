import { config } from "@/lib/config";
import { getProjects, type Project } from "@/lib/github";
import Name from "@/components/Name";
import ScrollFX from "@/components/ScrollFX";
import ApiDemo from "@/components/ApiDemo";
import Clock from "@/components/Clock";
import ContactForm from "@/components/ContactForm";

const idx = (i: number) => ({ "--i": i }) as React.CSSProperties;

/** Elevation of an imaginary brutalist building: slabs, pilotis, a tower and one round void of light. */
function HeroArt() {
  return (
    <svg
      className="art"
      viewBox="0 0 1600 520"
      preserveAspectRatio="xMidYMax slice"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <pattern id="form" width="40" height="24" patternUnits="userSpaceOnUse">
          <path d="M0 23.5H40" stroke="#6f7a7e" strokeWidth="1" />
          <path d="M39.5 0V24" stroke="#6f7a7e" strokeWidth="0.6" />
        </pattern>
      </defs>

      {/* steps */}
      <g className="l-steps">
        <rect x="0" y="440" width="120" height="40" fill="#7f8a8e" />
        <rect x="0" y="400" width="70" height="40" fill="#7f8a8e" />
      </g>

      {/* long slab on two pilotis */}
      <g className="l-pilotis">
        <rect x="170" y="260" width="56" height="220" fill="#1e2a32" />
        <rect x="650" y="260" width="56" height="220" fill="#1e2a32" />
      </g>
      <g className="l-slab">
        <rect x="120" y="150" width="640" height="110" fill="#7f8a8e" />
        <rect x="120" y="150" width="640" height="110" fill="url(#form)" />
        <rect x="120" y="260" width="640" height="10" fill="#1e2a32" />
      </g>

      {/* block with the round void */}
      <rect x="760" y="250" width="440" height="230" fill="#1e2a32" />
      <rect x="760" y="250" width="440" height="8" fill="#2c3a44" />
      <circle className="sun" cx="980" cy="365" r="78" fill="#e8a23a" />

      {/* tower with slits */}
      <g className="l-tower">
        <rect x="1200" y="60" width="150" height="420" fill="#7f8a8e" />
        <rect x="1200" y="60" width="150" height="420" fill="url(#form)" />
        <rect x="1236" y="110" width="10" height="300" fill="#1e2a32" />
        <rect x="1270" y="110" width="10" height="300" fill="#1e2a32" />
        <rect x="1304" y="110" width="10" height="300" fill="#1e2a32" />
      </g>

      {/* low wing */}
      <g className="l-wing">
        <rect x="1350" y="330" width="250" height="150" fill="#2c3a44" />
        <rect x="1390" y="370" width="170" height="14" fill="#e4e6e4" />
      </g>

      {/* ground */}
      <rect x="0" y="480" width="1600" height="40" fill="#1e2a32" />
    </svg>
  );
}

/** A small copy of the hero building. As you scroll, the sun sets behind it and the tower lights up. */
function Dusk() {
  return (
    <svg className="dusk" data-fx-t viewBox="0 0 400 205" preserveAspectRatio="xMaxYMax meet" aria-hidden="true" focusable="false">
      <circle className="dusk-sun" cx="250" cy="78" r="34" fill="#e8a23a" />
      <rect x="20" y="96" width="170" height="30" fill="#7f8a8e" />
      <rect x="34" y="126" width="14" height="78" fill="#2c3a44" />
      <rect x="158" y="126" width="14" height="78" fill="#2c3a44" />
      <rect x="190" y="148" width="120" height="56" fill="#2c3a44" />
      <rect x="310" y="54" width="44" height="150" fill="#7f8a8e" />
      <g className="dusk-lights">
        <rect x="320" y="74" width="4" height="104" fill="#e8a23a" />
        <rect x="330" y="74" width="4" height="104" fill="#e8a23a" />
        <rect x="340" y="74" width="4" height="104" fill="#e8a23a" />
      </g>
      <rect className="dusk-ground" x="0" y="204" width="400" height="1" />
    </svg>
  );
}

function Slab({ p }: { p: Project }) {
  const { shots } = p;
  return (
    <article className="slab" id={p.id} data-fx>
      <div className="slab-text">
        <h3>{p.title}</h3>
        <p className="kind">{p.kind}</p>
        <p className="desc">{p.description}</p>
        <dl className="spec">
          <div>
            <dt>Status</dt>
            <dd>{p.status}</dd>
          </div>
          <div>
            <dt>Built with</dt>
            <dd>{p.stack.join(", ")}</dd>
          </div>
          <div>
            <dt>Tested</dt>
            <dd>Automated tests on every pull request (GitHub Actions)</dd>
          </div>
        </dl>
        <div className="links">
          {p.homepage ? (
            <a className="btn" href={p.homepage} target="_blank" rel="noopener noreferrer">
              Live demo
            </a>
          ) : (
            <span className="btn soon" aria-disabled="true">
              Live demo coming soon
            </span>
          )}
          <a className="btn alt" href={p.url} target="_blank" rel="noopener noreferrer">
            Code on GitHub
          </a>
          {p.stars ? (
            <span className="stars">
              {p.stars} {p.stars === 1 ? "star" : "stars"}
            </span>
          ) : null}
        </div>
      </div>

      {shots && (
        <figure className="slab-shot">
          <div className="shots">
            <div className="frame main">
              <img
                src={shots.main.src}
                width={shots.main.width}
                height={shots.main.height}
                alt={shots.main.alt}
                decoding="async"
              />
            </div>
            {shots.phone && (
              <div className="frame phone">
                <img
                  src={shots.phone.src}
                  width={shots.phone.width}
                  height={shots.phone.height}
                  alt={shots.phone.alt}
                  decoding="async"
                />
              </div>
            )}
          </div>
          <figcaption>{shots.caption}</figcaption>
        </figure>
      )}

      {p.apiDemo && <ApiDemo />}
    </article>
  );
}

export default async function Home() {
  const projects = await getProjects();
  const { about } = config;
  const [first, ...rest] = config.name.split(" ");

  return (
    <>
      <a className="skip" href="#work">
        Skip to the work
      </a>
      <ScrollFX />
      <main>
        <section id="top" className="hero">
          <header className="nav">
            <a href="#top" className="brand">
              {config.name}
            </a>
            <nav aria-label="Main">
              <a href="#about">About</a>
              <a href="#work">Work</a>
              <a href="#contact">Contact</a>
            </nav>
          </header>

          <div className="hero-main">
            <Name first={first} last={rest.join(" ")} />
            <div className="hero-side">
              <p className="tagline">{config.tagline}</p>
              <Clock place={config.location} timeZone="Europe/Dublin" />
              <a className="btn" href="#work">
                See my work
              </a>
            </div>
          </div>

          <HeroArt />
        </section>

        <section id="about" className="about">
          <h2 data-fx>About</h2>
          <div className="about-grid">
            <div className="about-text">
              <p className="about-lead">{about.headline}</p>
              <p>{about.intro}</p>
              <p>{about.journey}</p>
              <p>{about.now}</p>
              <h3>{about.interestsTitle}</h3>
              <ul className="rows" data-fx>
                {about.interests.map((item, n) => (
                  <li key={item} style={idx(n)}>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="about-side">
              <h3>Technologies</h3>
              <dl className="tech" data-fx>
                {config.skillGroups.map((g, n) => (
                  <div key={g.title} style={idx(n)}>
                    <dt>{g.title}</dt>
                    <dd>{g.items.join(", ")}</dd>
                  </div>
                ))}
              </dl>
              <Dusk />
            </div>
          </div>
          <blockquote className="philosophy" data-fx>{about.philosophy}</blockquote>
        </section>

        <section id="work" className="work">
          <p className="work-meta">
            {projects.length} products · {projects.filter((p) => p.homepage).length} live · all tested in CI
          </p>
          <h2 className="work-title" data-fx>
            Work
          </h2>
          <p className="work-intro">Products I designed and built end to end, with the code open on GitHub.</p>
          <ul className="index">
            {projects.map((p) => (
              <li key={p.id}>
                <a href={`#${p.id}`}>
                  <span className="index-name">{p.title}</span>
                  <span className="index-summary">{p.summary}</span>
                  <span className={`index-status${p.status === "Live" ? " live" : ""}`}>{p.status}</span>
                </a>
              </li>
            ))}
            <li>
              <a href="#contact" className="index-open">
                <span className="index-name">Your team&apos;s next project</span>
                <span className="index-summary">Hiring, or have something to build?</span>
                <span className="index-status">Let&apos;s talk</span>
              </a>
            </li>
          </ul>
          {projects.map((p) => (
            <Slab key={p.title} p={p} />
          ))}
        </section>

        <section id="contact" className="contact">
          <h2 data-fx>Let&apos;s talk</h2>
          <p className="contact-lead">Hiring for a backend role, or have a product to build? Send it through.</p>
          {config.links.email && <ContactForm to={config.links.email.replace("mailto:", "")} />}
          <ul className="contact-links">
            <li>
              <a href={config.links.github} target="_blank" rel="noopener noreferrer">
                GitHub
              </a>
            </li>
            <li>
              <a href={config.links.linkedin} target="_blank" rel="noopener noreferrer">
                LinkedIn
              </a>
            </li>
            {config.links.email && (
              <li>
                <a href={config.links.email}>Email</a>
              </li>
            )}
          </ul>
        </section>
      </main>

      <footer className="foot">
        <span>
          © {new Date().getFullYear()} {config.name}
        </span>
        <span>{config.location}</span>
        <span>No cookies. No tracking.</span>
      </footer>
    </>
  );
}
