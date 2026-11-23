// Edit here: this is the only file with your personal data.
export type Shot = {
  /** Path under /public. */
  src: string;
  width: number;
  height: number;
  alt: string;
};

export type FeaturedProject = {
  /** Part of the GitHub repository name (case-insensitive). */
  match: string;
  title: string;
  /** Short label shown under the title, e.g. "Web platform". */
  kind: string;
  /** Used if the repository is private or has no description. */
  description: string;
  stack: string[];
  /** Fallback link (private repository or no demo yet). */
  url: string;
  /** Live site address, if any. */
  homepage?: string;
  /** The repository is private: show that instead of a link visitors can't open. */
  privateRepo?: boolean;
  /** Anchor id, used by the project index. */
  id: string;
  /** One line for the project index. */
  summary: string;
  /** "Live" or "Not deployed yet". */
  status: string;
  /** Screens taken from the project README (files in /public/shots). */
  shots?: { main: Shot; phone?: Shot; caption: string };
};

export const config = {
  githubUser: "AlexandroCunha",
  name: "Alexandro Silva",
  role: "Software Developer",
  tagline: "I build backend systems and the web apps around them.",
  location: "Dublin, Ireland",
  about: {
    headline: "Building software with purpose.",
    intro:
      "I’m a Brazilian software developer based in Dublin, specialising in backend development and building reliable, scalable web applications.",
    journey:
      "I work across the full development lifecycle, from designing RESTful APIs with Node.js and TypeScript to modelling data with PostgreSQL and building intuitive interfaces with React. I also focus on automated testing, CI/CD, and integrating security and privacy into every stage of development.",
    now: "With a degree in Pedagogy and a background in Backend Development from Cubos Academy, I bring a different perspective to software engineering. I value clear communication, thoughtful architecture, well-documented code, and solutions that are built to be understood, maintained, and improved.",
    interestsTitle: "Interested in",
    interests: [
      "Software development",
      "Creative solutions",
      "Data science and analytics",
      "Building and shipping real products",
    ],
    philosophy: "Technology is about understanding problems and making people's lives easier.",
  },
  // Taken from the code in the GitHub repositories (package.json, CI, deploy files).
  skillGroups: [
    { title: "Languages", items: ["TypeScript", "JavaScript", "SQL"] },
    { title: "Backend", items: ["Node.js", "Express", "REST APIs", "JWT authentication"] },
    { title: "Databases", items: ["PostgreSQL"] },
    { title: "Testing and CI", items: ["Node.js test runner", "GitHub Actions", "npm audit"] },
    { title: "Deploy", items: ["Docker", "Render", "Vercel", "S3 storage"] },
    { title: "Tools", items: ["Git", "GitHub"] },
  ],
  links: {
    github: "https://github.com/AlexandroCunha",
    linkedin: "https://www.linkedin.com/in/alexandrocunha/",
    email: "mailto:alexandrocunha4@gmail.com", // empty = link hidden
  },
  // Only these projects are shown, in this order.
  projects: [
    {
      match: "vocabloom",
      title: "Vocabloom",
      id: "vocabloom",
      summary: "PDF worksheets, made interactive.",
      status: "Live",
      kind: "Web app with AI",
      description:
        "Turns any PDF into an interactive English worksheet that students answer on their phone, with hints and corrections on mistakes.",
      stack: ["JavaScript", "Node.js", "Claude API", "Redis", "Vercel"],
      url: "https://github.com/AlexandroCunha/vocabloom",
      homepage: "https://vocabloom-esl.vercel.app",
      shots: {
        main: {
          src: "/shots/vocabloom-wide.webp",
          width: 1200,
          height: 750,
          alt: "Vocabloom share step: a link and QR code for the teacher, and a preview of what students see.",
        },
        phone: {
          src: "/shots/vocabloom-phone.webp",
          width: 480,
          height: 960,
          alt: "A Vocabloom worksheet on a phone, with a question and an answer field.",
        },
        caption: "Sharing a worksheet, and the student view.",
      },
    },
    {
      match: "barbershop-platform",
      title: "Barbershop",
      id: "barbershop",
      summary: "Online booking for barbershops.",
      status: "Live",
      kind: "Web platform",
      description:
        "Multi-tenant online booking for barbershops: each shop gets its own website, booking calendar and owner area. GDPR-minded, with data retention and strict security headers.",
      stack: ["TypeScript", "Node.js", "Express", "React", "PostgreSQL", "Docker"],
      url: "https://github.com/AlexandroCunha/barbershop-platform",
      homepage: "https://www.trimly.software",
      shots: {
        main: {
          src: "/shots/barbershop-wide.webp",
          width: 1280,
          height: 860,
          alt: "Home page of a demo barbershop website: headline, opening hours, address and a booking button.",
        },
        phone: {
          src: "/shots/barbershop-phone.webp",
          width: 480,
          height: 1039,
          alt: "The same barbershop website on a phone.",
        },
        caption: "A demo shop with sample data.",
      },
    },
    {
      match: "keep-left",
      title: "Keep Left",
      id: "keep-left",
      summary: "Irish driving theory, lesson by lesson.",
      status: "Live",
      kind: "Learning web app",
      description:
        "Practise for the Irish driving theory test (RSA) in short lessons, like a language app. Roundabout and junction questions come with animated road scenes, and each lesson has optional study notes. Available in English, Portuguese and Spanish. 50 questions so far, with more coming soon.",
      stack: ["TypeScript", "Next.js", "PostgreSQL", "pnpm monorepo"],
      url: "https://github.com/AlexandroCunha/keep-left",
      privateRepo: true,
      homepage: "https://keep-left.onrender.com",
      shots: {
        main: {
          src: "/shots/keepleft-2026-11-23.webp", // new name on each update, so browsers fetch the new image
          width: 1322,
          height: 932,
          alt: "Three Keep Left screens on a phone: the lesson path for Unit 1, Roundabouts; a question with a drawn roundabout showing your car and the other car; and the correct answer explained, with the page of the Rules of the Road it comes from.",
        },
        caption: "The lesson path, a question with its road scene, and the answer with the rule from the book.",
      },
    },
    {
      match: "financify",
      title: "Financify",
      id: "financify",
      summary: "Personal finance, web app and API.",
      status: "Live",
      kind: "Web app and API",
      description:
        "Personal finance in euros. Record income and expenses, see your balance and spot spending patterns by category and by month.",
      stack: ["JavaScript", "Node.js", "Express", "React", "PostgreSQL", "JWT"],
      url: "https://github.com/AlexandroCunha/Financify",
      homepage: "https://financify-web-m2zy.onrender.com/?demo", // ?demo opens a demo account with sample data
      shots: {
        main: {
          src: "/shots/financify-wide.webp",
          width: 1200,
          height: 1047,
          alt: "Financify dashboard for November 2026: balance, income and expenses compared with October, a month-by-month chart, spending by category, what was left each month and the latest transactions.",
        },
        caption: "The dashboard of the demo account, with sample data.",
      },
    },
  ] as FeaturedProject[],
};
