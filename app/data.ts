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
    "Frontend is where I live, but I've never been able to stop at the component boundary. Two years of building real products pushed me past it. I started caring about why the API call takes 800ms, how the data model holds up at scale, and what the user actually feels between the click and the render.",
  bio:
    "I reach for Next.js by default, and open Figma when I need to think out loud. I obsess over the details that most people ship past: the 200ms that feels slow, the grey that isn't quite neutral, the motion that either earns its place or gets cut.",
  role: "Frontend Developer · Product Designer",
  pronouns: "she/her",
  status: "open_to_work",
  responseTime: "< 24h",
  availability: "true",
};

export const aboutStack = [
  { label: "core/", items: "react · typescript · next.js · javascript" },
  { label: "styling/", items: "tailwind · css · framer-motion" },
  { label: "state/", items: "zustand · react-query · redux toolkit" },
  { label: "backend/", items: "node · supabase · mongodb · rest apis" },
  { label: "realtime/", items: "socket.io · webrtc" },
  { label: "tools/", items: "figma · git · vercel · vite" },
  { label: "exploring/", items: "rust · three.js · webgpu" },
];

export const aboutPhilosophy = [
  "pixel = pride",
  "ship beats perfect — until the last 5%",
  "good DX makes good UX",
  "animation is a feature, not a polish",
];

export const aboutCurrently = {
  reading: '"Designing Data-Intensive Applications"',
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
  image: string;
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
    image: "/projects/codecollab2.png",
    date: "2025",
    dateSort: 20250101,
    excerpt:
      "Real-time collaborative coding platform. One shared editor, live cursors, zero context switching.",
    description:
      "CodeCollab lets developers code together in real time with live cursors, line locking, voice, chat, and GitHub integration in one screen. Built with Next.js 15, Monaco Editor, and Supabase Realtime for presence sync. Redux Toolkit manages shared session state across all panels simultaneously.",
    stack: ["Next.js 15", "Supabase", "Monaco Editor", "Redux Toolkit", "TypeScript"],
    role: "Full Stack",
    status: "live",
    links: [
      { label: "Live", url: "http://code-to-collab.vercel.app" },
      { label: "GitHub", url: "https://github.com/shivanirai08/CodeCollab" },
    ],
    highlights: [
      "Sub-100ms cursor sync with line locking across unlimited collaborators",
      "GitHub push, pull, and diff built into the editor, no tab switching",
      "Voice, chat, and code in one screen, no external tools needed",
    ],
    head: true,
  },
  {
    id: "codeclash",
    name: "feat: CodeClash",
    image: "/projects/codeclash2.png",
    date: "2025",
    dateSort: 20250201,
    excerpt:
      "1v1 coding battles and contest management. Built for competitive programmers.",
    description:
      "CodeClash matches two players head to head with three DSA questions and decides a winner in real time. Supports full contest creation end to end. Built with Next.js, TypeScript, and a queue-based pairing system. JWT handles role-based auth separating participants from organisers.",
    stack: ["Next.js", "TypeScript", "Redux", "Tailwind CSS", "JWT"],
    role: "Full Stack",
    status: "live",
    links: [
      { label: "Live", url: "https://codeclash.notsg.space/" },
      { label: "GitHub", url: "https://github.com/shivanirai08/codeclash" },
    ],
    highlights: [
      "Queue-based matchmaking in under 10 seconds, no major CP platform does this natively",
      "Auto-evaluated submissions across 4 languages with near zero wait time",
      "Contest setup to publish in under 2 minutes at any scale",
    ],
  },
  {
    id: "chess-platform",
    name: "feat: Chess Platform",
    image: "/projects/chess2.png",
    date: "2024",
    dateSort: 20240301,
    excerpt: "Real-time chess with multiplayer and AI. One click to match, no account needed.",
    description:
      "Multiplayer chess where guests and logged-in users both get into a match in under 30 seconds. Solo players practice against Stockfish AI across three difficulty tiers. Built with Next.js, Socket.io for move sync, and Node.js with MongoDB for game state and player stats.",
    stack: ["Next.js", "TypeScript", "Socket.io", "Stockfish", "Node.js", "MongoDB"],
    role: "Full Stack",
    status: "live",
    links: [
      { label: "Live", url: "http://chess-xi-ivory.vercel.app" },
      { label: "GitHub", url: "https://github.com/shivanirai08/chess" },
    ],
    highlights: [
      "Server-side clock sync accurate to 50ms, zero client-side drift",
      "No sign-up wall, guests play immediately with just a name",
      "Full gameplay on screens under 400px, built mobile-first throughout",
    ],
  },
  {
    id: "classence",
    name: "feat: Classence",
    image: "/projects/classence2.png",
    date: "2024",
    dateSort: 20240201,
    excerpt: "Online classroom platform. One account, two roles, switched by a single toggle.",
    description:
      "Classence lets the same person teach and learn from one account without separate logins. Teachers manage classes, live sessions, announcements, and assignments. Students join and submit from the same dashboard. Built with React, Node.js, MongoDB, and WebRTC for live classes without any third-party dependency.",
    stack: ["React", "Redux Toolkit", "Node.js", "MongoDB", "WebRTC", "Tailwind CSS"],
    role: "Full Stack",
    status: "live",
    links: [
      { label: "Live", url: "https://classence-frontened-8e7d.vercel.app/" },
      { label: "GitHub", url: "https://github.com/shivanirai08/classence" },
    ],
    highlights: [
      "Single account for both roles, onboarding friction cut in half",
      "WebRTC built in directly, live class setup reduced from 4 steps to 1",
      "Unified dashboard reduced screens per teacher session by 60%",
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

export type ExperienceImpact = {
  company: string;
  product: string;
  points: {
    metric: string;
    summary: string;
    context: string;
  }[];
};

export const experienceImpact: ExperienceImpact[] = [
  {
    company: "Hikigai Inc.",
    product: "Health AI Platform",
    points: [
      {
        metric: "40%",
        summary: "drop-off rate reduced across Chrome, Safari, and Firefox",
        context: "WebRTC consultation module",
      },
      {
        metric: "25%",
        summary: "less redundant UI code after shared component library",
        context: "React + TypeScript, 5 clinical modules",
      },
    ],
  },
  {
    company: "QuantumNXT",
    product: "Carbon Emissions Platform",
    points: [
      {
        metric: "5+",
        summary: "user flows built for BOI including a live emission calculator",
        context: "C# / ASP.NET backend integration",
      },
      {
        metric: "15+",
        summary: "UI/UX bugs resolved across 4 dashboard views",
        context: "sprint-based development",
      },
    ],
  },
  {
    company: "HSLR Limited",
    product: "EdTech Product",
    points: [
      {
        metric: "6-12",
        summary: "grades mapped through UX research using JTBD and Octalysis",
        context: "Ask Ira, student motivation flows",
      },
      {
        metric: "1",
        summary: "end-to-end student query flow designed from scratch",
        context: "mode selection, quiz, practice follow-up",
      },
    ],
  },
];

export const stats = {
  yearsActive: "2+",
  projectsShipped: "8+",
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
