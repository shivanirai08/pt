// Single source of content for GUI + CLI modes

export const personal = {
  name: "Shivani",
  fullName: "Shivani Rai",
  initials: "SR",
  handle: "@shivanirai08",
  location: "Uttar Pradesh, IN",
  timezone: "IST (UTC+5:30)",
  editor: "VS Code",
  email: "raishivani1406@gmail.com",
  tagline: "frontend developer with a product brain",
  headline: "I design, build, and ship.",
  intro:
    "I turn design thinking into fast, scalable frontend systems.",
  synopsis: "shivani [--design] [--develop] [--deploy] <ideas>",
  description:
    "Frontend is where I live, but I've never been able to stop at the component boundary. Two years of building real products will do that - you start caring about why the API call takes 800ms, how the data model holds up at scale, and what the user actually experiences between the click and the render.",
  bio:
    "Next.js by default. Figma when I need to think out loud. Strong opinions about padding, motion, and whether that shade of grey is actually neutral. All held loosely, none of them quiet.",
  role: "Frontend Developer · Product Designer",
  pronouns: "she/her",
  status: "open_to_work",
  responseTime: "< 24h",
  availability: "true",
};

export const aboutStack = [
  { label: "core/", items: "react · typescript · next.js" },
  { label: "styling/", items: "tailwind · css · framer-motion" },
  { label: "state/", items: "zustand · react-query" },
  { label: "tools/", items: "figma · git · vercel · linear" },
  { label: "exploring/", items: "rust · three.js · webgpu" },
];

export const aboutPhilosophy = [
  "pixel = pride",
  "ship beats perfect — until the last 5%",
  "good DX makes good UX",
  "animation is a feature, not a polish",
];

export const aboutCurrently = {
  reading: '"designing data-intensive apps"',
  building: "terminal portfolio v2",
  learning: "rust + tauri",
  listening: "tycho · rüfüs · ambient",
};

export const aboutEnv = {
  timezone: "IST · UTC+5:30",
  available: "true",
  response: "< 24h",
  remote: "yes",
  coffee: "★★★ /day",
};

export const socials = [
  { name: "github", handle: "shivanirai08", url: "https://github.com/shivanirai08" },
  { name: "twitter", handle: "shivanirai08", url: "https://twitter.com/shivanirai08" },
  { name: "behance", handle: "shivanirai08", url: "https://www.behance.net/shivanirai08" },
  { name: "linkedin", handle: "shivanirai08", url: "https://linkedin.com/in/shivanirai08" },
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
    date: "2025",
    dateSort: 20250101,
    excerpt:
      "Real-time collaborative coding, like a shared VS Code session but actually built for it.",
    description:
      "Cursor sync and line-locking across unlimited collaborators with sub-100ms latency reduced code collision to zero during active sessions. GitHub integration cut context switching by keeping push, pull, and diff checks inside the editor. Voice, chat, and code in one screen eliminated the need for 3 separate tools during a typical pair programming session.",
    stack: ["Next.js 15", "Supabase", "Monaco Editor", "Redux Toolkit", "TypeScript"],
    role: "Full Stack",
    status: "live",
    links: [
      { label: "Live", url: "#" },
      { label: "GitHub", url: "#" },
    ],
    highlights: [
      "Sub-100ms cursor sync",
      "Zero code collisions during active sessions",
      "Voice, chat, and code in one workspace",
    ],
    head: true,
  },
  {
    id: "codeclash",
    name: "feat: CodeClash",
    date: "2025",
    dateSort: 20250201,
    excerpt:
      "1v1 coding battles. Three questions. One winner.",
    description:
      "Head-to-head matchmaking that connects two players in under 10 seconds - a format no major CP platform offers natively. Real-time leaderboards and auto-evaluated submissions across 4 languages reduced result wait time to near zero. Contest creation flow designed to take under 2 minutes from setup to publish, with role-based access keeping participant management clean at any scale.",
    stack: ["Next.js", "TypeScript", "Redux", "Tailwind CSS", "JWT"],
    role: "Full Stack",
    status: "live",
    links: [
      { label: "Live", url: "#" },
      { label: "GitHub", url: "#" },
    ],
    highlights: [
      "Under 10 seconds to match two players",
      "Auto-evaluated submissions in 4 languages",
      "Contest setup to publish in under 2 minutes",
    ],
  },
  {
    id: "chess-platform",
    name: "feat: Chess Platform",
    date: "2024",
    dateSort: 20240301,
    excerpt: "Real-time chess. One click to match, zero account needed to start.",
    description:
      "Reduced time-to-first-game to under 30 seconds for both guests and logged-in users. Server-side clock sync kept timing accurate to 50ms, eliminating client-side drift entirely. Stockfish integration across 3 difficulty tiers gave solo players a full practice loop without needing an opponent. Mobile-first board design brought full gameplay to screens under 400px with zero layout breakage.",
    stack: ["Next.js", "TypeScript", "Socket.io", "Stockfish", "Node.js", "MongoDB"],
    role: "Full Stack",
    status: "live",
    links: [
      { label: "Live", url: "#" },
      { label: "GitHub", url: "#" },
    ],
    highlights: [
      "Under 30 seconds to first game",
      "Clock sync accurate to 50ms",
      "Responsive play under 400px",
    ],
  },
  {
    id: "classence",
    name: "feat: Classence",
    date: "2024",
    dateSort: 20240201,
    excerpt: "One account, two roles. Teacher and student dashboards under a single toggle.",
    description:
      "Eliminated the need for separate accounts per role, reducing onboarding friction by half for users who teach and learn on the same platform. Built-in WebRTC removed dependency on third-party tools like Meet or Zoom, cutting the steps to start a live class from 4 to 1. Assignment tracking and announcements consolidated into one dashboard reduced the number of screens a teacher navigates per session by 60%.",
    stack: ["React", "Redux Toolkit", "Node.js", "MongoDB", "WebRTC", "Tailwind CSS"],
    role: "Full Stack",
    status: "live",
    links: [
      { label: "Live", url: "#" },
      { label: "GitHub", url: "#" },
    ],
    highlights: [
      "Single account across teacher and student roles",
      "Live class flow reduced from 4 steps to 1",
      "60% fewer screens per teacher session",
    ],
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
    version: "v5.0.0",
    range: "Dec 2025 – Apr 2026",
    role: "Frontend Engineer",
    company: "Hikigai Inc. (Full-Time Remote)",
    achievements: [
      "Built WebRTC consultation modules for a Health AI platform.",
      "Drop-off rates fell 40% across Chrome, Safari, and Firefox.",
      "Cut redundant UI code by 25% with a shared React + TypeScript component library across 5 clinical modules.",
      "Zero missed deadlines across the full patient-doctor workflow.",
    ],
  },
  {
    version: "v4.0.0",
    range: "Dec 2025 – Feb 2026",
    role: "Frontend Developer Intern",
    company: "QuantumNXT (Remote)",
    achievements: [
      "Built 5+ user flows for BOI, a carbon emissions tracking platform, including a live emission calculator on a C# / ASP.NET backend.",
      "Resolved 15+ UI/UX bugs across 4 dashboard views through sprint-based development.",
    ],
  },
  {
    version: "v3.0.0",
    range: "Jul 2025 – Oct 2025",
    role: "Product Designer",
    company: "HSLR Limited Technologies (Remote)",
    achievements: [
      "Led UX research for Ask Ira using Jobs to be Done and Octalysis frameworks to map student motivation across grades 6 to 12.",
      "Designed the full student query flow - mode selection, concept learning, quiz and practice follow-up screens.",
    ],
  },
  {
    version: "v2.0.0",
    range: "Apr 2025 – Jul 2025",
    role: "Product Designer",
    company: "Algoroot Pvt. Limited (Remote)",
    achievements: [
      "Owned end-to-end design for AlgoVox, an AI sales call agent - landing page, dashboard, and all core screens.",
      "Delivered complete handoff with interactions, animations, and production-ready assets for the frontend team.",
    ],
  },
  {
    version: "v1.0.0",
    range: "Oct 2024 – Present",
    role: "Frontend Developer & Designer",
    company: "Software Incubator, SDC",
    achievements: [
      "Improved UI consistency by 20% using reusable React and Tailwind CSS components across a large-scale codebase.",
      "Zero regression defects across 4 sprints for a 45-person team.",
    ],
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
  { name: "next.js", years: 3, projects: 18, level: 0.95, category: "frontend" },
  { name: "css", years: 4, projects: 22, level: 0.95, category: "frontend" },
  { name: "javascript", years: 4, projects: 24, level: 0.92, category: "frontend" },
  { name: "react", years: 4, projects: 24, level: 0.9, category: "frontend" },
  { name: "typescript", years: 3, projects: 18, level: 0.88, category: "frontend" },
  { name: "figma", years: 3, projects: 20, level: 0.88, category: "design" },
  { name: "redux", years: 2, projects: 12, level: 0.75, category: "frontend" },
  { name: "socket.io", years: 2, projects: 8, level: 0.65, category: "tooling" },
];

export const secondaryTools = [
  "Git", "Tailwind CSS", "Supabase", "WebRTC", "Redux Toolkit", "REST APIs", "Vite", "MongoDB",
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

export const asciiLogo = 
`  ▄▄▄▄▄    ▄▄▄     ▄▄▄ 
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
