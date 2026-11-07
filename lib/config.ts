// Edit here: this is the only file with your personal data.
export type FeaturedProject = {
  /** Part of the GitHub repository name (case-insensitive). */
  match: string;
  title: string;
  /** Used if the repository is private or has no description. */
  description: string;
  stack: string[];
  /** Fallback link (private repository or no demo yet). */
  url: string;
  /** Live site address, if any. */
  homepage?: string;
};

export const config = {
  githubUser: "AlexandroCunha",
  name: "Alexandro",
  role: "Software Developer",
  headline: "Backend Development · Data Science Enthusiast",
  location: "Dublin, Ireland",
  about: {
    intro:
      "I'm Alexandro, a Brazilian based in Dublin, Ireland, passionate about technology, problem-solving, and continuous learning.",
    journey:
      "My journey combines different areas of knowledge. I have a Bachelor's degree in Pedagogy and a background in Backend Development, which have helped me develop analytical thinking, creativity, and a strong ability to learn and adapt.",
    interestsTitle: "I'm particularly interested in",
    interests: [
      "Software Development & Backend Engineering",
      "Data Science & Data Analytics",
      "Problem-solving and logical thinking",
      "Building projects and exploring new technologies",
      "Continuous learning and personal growth",
    ],
    factsTitle: "A little more about me",
    facts: [
      "Originally from Brazil, currently living in Ireland.",
      "Bachelor's degree in Pedagogy.",
      "Studied Backend Development at Cubos Academy.",
      "Always exploring new technologies and improving my programming skills.",
      "Working towards growing my career in the tech industry.",
    ],
    philosophyTitle: "My philosophy",
    philosophy:
      "I believe technology is about more than writing code. It's about understanding problems, creating meaningful solutions, and making people's lives easier.",
    motto: ["Always learning.", "Always building.", "Always evolving."],
  },
  skillGroups: [
    { title: "Languages", items: ["JavaScript", "TypeScript"] },
    { title: "Backend", items: ["Node.js", "REST APIs"] },
    { title: "Databases", items: ["PostgreSQL"] },
    { title: "Tools", items: ["Git", "GitHub"] },
  ],
  links: {
    github: "https://github.com/AlexandroCunha",
    linkedin: "https://www.linkedin.com/in/alexandrocunha/",
    email: "", // optional: "mailto:you@gmail.com" (empty = button hidden)
  },
  // Only these projects are shown, in this order.
  projects: [
    {
      match: "barbershop-platform",
      title: "Barbershop",
      description:
        "Multi-tenant online booking for barbershops: each shop gets its own website, booking calendar and owner area. GDPR-minded, with data retention and strict security headers.",
      stack: ["TypeScript", "Express", "React", "PostgreSQL"],
      url: "https://github.com/AlexandroCunha/barbershop-platform",
      homepage: "https://www.trimly.software",
    },
    {
      match: "financify",
      title: "Financify",
      description: "REST API for personal finance management.",
      stack: ["JavaScript", "Node.js", "PostgreSQL"],
      url: "https://github.com/AlexandroCunha/Financify",
    },
    {
      match: "vocabloom",
      title: "Vocabloom",
      description:
        "Turns any PDF into an interactive English worksheet that students answer on their phone, with hints and corrections on mistakes.",
      stack: ["JavaScript", "Node.js", "Claude API"],
      url: "https://github.com/AlexandroCunha/vocabloom",
    },
  ] as FeaturedProject[],
};
