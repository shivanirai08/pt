// Single source of content for GUI + CLI modes

export const personal = {
  name: "Shivani",
  fullName: "Shivani Rai",
  initials: "SR",
  handle: "@shivani",
  location: "Bengaluru, IN",
  timezone: "IST (UTC+5:30)",
  editor: "Neovim btw",
  email: "raishivani1406@gmail.com",
  tagline: "frontend developer & designer",
  headline: "I TURN DESIGN FILES INTO LIVING INTERFACES.",
  intro:
    "Bridging the gap between design and engineering — pixel-perfect UIs, clean architecture, and zero compromises on performance.",
  synopsis: "shivani [--design] [--develop] [--deploy] <projects>",
  description:
    "4+ years building performant, accessible web applications. Equally comfortable in Figma and VS Code. Believes great UI is invisible — it just works. Previously led frontend teams and shipped 20+ production features.",
  responseTime: "< 24 hours",
  availability: "open to select freelance + full-time",
};

export const socials = [
  { name: "github", handle: "shivani", url: "https://github.com/shivanirai08" },
  { name: "twitter", handle: "@shivani", url: "https://twitter.com/shivanirai08" },
  { name: "behance", handle: "@shivani", url: "https://www.behance.net/shivanirai08" },
  { name: "linkedin", handle: "/in/shivani", url: "https://linkedin.com/in/shivanirai08" },
];

export type Project = {
  id: string;
  name: string;
  date: string;
  dateSort: number;
  excerpt: string;
  description: string;
  stack: string[];
  role: string;
  status: "live" | "archived" | "wip";
  links: { label: string; url: string }[];
  highlights: string[];
  head?: boolean;
};

export const projects: Project[] = [
  {
    id: "codecollab",
    name: "feat: CodeCollab",
    date: "Jun 2024",
    dateSort: 20240624,
    excerpt:
      "Real-time collaborative code editor with live preview and multi-user syntax highlighting.",
    description:
      "Built for pair programming sessions. Features real-time cursor sync, chat, and instant preview. Backed by CRDT for conflict-free editing across sessions.",
    stack: ["React", "WebSocket", "Node.js"],
    role: "Lead Frontend",
    status: "live",
    links: [
      { label: "Live Demo", url: "#" },
      { label: "Source", url: "#" },
    ],
    highlights: [
      "CRDT-based conflict-free editing",
      "Sub-50ms cursor sync latency",
      "Monaco editor integration",
    ],
    head: true,
  },
  {
    id: "gpr-dashboard",
    name: "feat: GPR Dashboard",
    date: "Mar 2024",
    dateSort: 20240315,
    excerpt:
      "Operations analytics dashboard with real-time D3 charts and custom data visualizations.",
    description:
      "Tracks KPIs across 4 departments. Custom charting engine built on D3 for performance over stock libraries.",
    stack: ["Vue.js", "D3.js", "Python"],
    role: "Frontend + Design",
    status: "live",
    links: [
      { label: "Live Demo", url: "#" },
      { label: "Source", url: "#" },
    ],
    highlights: [
      "Custom D3 rendering pipeline",
      "Real-time WebSocket streams",
      "45% faster than stock dashboards",
    ],
  },
  {
    id: "design-system-kit",
    name: "feat: Design System Kit",
    date: "Jan 2023",
    dateSort: 20230115,
    excerpt: "Open-source Figma + React component library.",
    description:
      "Published NPM package powering 3 internal products. Full Figma library with tokens that round-trip to code.",
    stack: ["React", "Figma", "Storybook"],
    role: "Solo",
    status: "live",
    links: [
      { label: "Demo", url: "#" },
      { label: "Source", url: "#" },
    ],
    highlights: [
      "2.1k GitHub stars",
      "Design tokens → CSS round trip",
      "42 components shipped",
    ],
  },
  {
    id: "three-playground",
    name: "feat: Three Playground",
    date: "Aug 2023",
    dateSort: 20230810,
    excerpt: "Collection of WebGL experiments and creative coding projects.",
    description:
      "Fifteen short experiments exploring shaders, geometry, and motion. Each one self-contained and dependency-light.",
    stack: ["Three.js", "WebGL"],
    role: "Solo",
    status: "archived",
    links: [
      { label: "Demo", url: "#" },
      { label: "Source", url: "#" },
    ],
    highlights: ["15 experiments", "Custom shader library", "60fps target"],
  },
];

export type Experience = {
  version: string;
  range: string;
  role: string;
  company: string;
  achievements: string[];
};

export const experience: Experience[] = [
  {
    version: "v4.0.0",
    range: "2023 – Present",
    role: "Senior Frontend Developer",
    company: "Company Name",
    achievements: [
      "Led frontend architecture for 3 major product launches",
      "Built design system used by 12-person engineering team",
      "Reduced bundle size by 40% through code splitting",
      "Mentored 2 junior developers to mid-level",
    ],
  },
  {
    version: "v3.0.0",
    range: "2021 – 2023",
    role: "Frontend Developer",
    company: "Previous Co",
    achievements: [
      "Shipped 15+ features across 3 products",
      "Introduced TypeScript to the codebase",
      "Migrated app from Webpack to Vite",
    ],
  },
  {
    version: "v2.0.0",
    range: "2020 – 2021",
    role: "Junior Developer",
    company: "First Job Co",
    achievements: [
      "Built responsive views from Figma mocks",
      "Learned React, fell in love with components",
    ],
  },
  {
    version: "v1.0.0",
    range: "2020",
    role: "Initial release",
    company: "Graduated, started coding professionally",
    achievements: [],
  },
];

export type Skill = {
  name: string;
  years: number;
  projects: number;
  level: number;
  category: "frontend" | "design" | "tooling";
};

export const skills: Skill[] = [
  { name: "react", years: 4, projects: 24, level: 1.0, category: "frontend" },
  { name: "typescript", years: 3, projects: 18, level: 0.9, category: "frontend" },
  { name: "css", years: 5, projects: 32, level: 0.95, category: "frontend" },
  { name: "figma", years: 4, projects: 30, level: 0.9, category: "design" },
  { name: "next.js", years: 2, projects: 8, level: 0.75, category: "frontend" },
  { name: "three.js", years: 1, projects: 5, level: 0.55, category: "frontend" },
  { name: "vue", years: 1, projects: 3, level: 0.45, category: "frontend" },
];

export const secondaryTools = [
  "Git", "Vite", "Docker", "Redux", "REST", "GraphQL", "Storybook", "Jira", "Neovim", "tmux",
];

export const certifications = [
  "Certified TypeScript Engineer",
  "AWS Cloud Practitioner",
];

export const stats = {
  yearsActive: "4+",
  projectsShipped: "28+",
  yearsLed: 3,
};

export const asciiLogo = `  ▄▄▄▄▄▄    ▄▄▄     ▄▄▄ 
 ██▀▀▀▀▀    ████▄   ██  
 ▀██▄▄▄▄    ██▀██▄  ██  
     ▀▀██   ██  ▀██▄██  
 ▄▄▄▄▄██▀   ██    ▀████ 
 ▀▀▀▀▀▀     ▀▀      ▀▀▀ `;

export const commands = [
  { cmd: ":help", desc: "Show this help overlay" },
  { cmd: ":email", desc: "Open compose form to reach me" },
  { cmd: ":cv", desc: "Download my CV (PDF)" },
  { cmd: ":github", desc: "Open my Github profile" },
  { cmd: ":1 / about", desc: "Go to About" },
  { cmd: ":2 / projects", desc: "Go to Projects" },
  { cmd: ":3 / experience", desc: "Go to Experience" },
  { cmd: ":4 / skills", desc: "Go to Skills" },
  { cmd: ":5 / contact", desc: "Go to Contact" },
  { cmd: ":gui", desc: "Switch to GUI mode" },
];

export const tabs = [
  { key: "about", num: 1, label: "About" },
  { key: "projects", num: 2, label: "Projects" },
  { key: "experience", num: 3, label: "Experience" },
  { key: "skills", num: 4, label: "Skills" },
  { key: "contact", num: 5, label: "Contact" },
] as const;
