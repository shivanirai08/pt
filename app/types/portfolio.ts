export type Personal = {
  name: string;
  fullName: string;
  initials: string;
  handle: string;
  location: string;
  timezone: string;
  editor: string;
  email: string;
  resumeUrl: string;
  tagline: string;
  headline: string;
  intro: string;
  synopsis: string;
  description: string;
  bio: string;
  role: string;
  pronouns: string;
  status: string;
  responseTime: string;
  availability: string;
};

export type StackRow = { label: string; items: string };

export type Social = { name: string; handle: string; url: string };

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

export type Experience = {
  version: string;
  range: string;
  role: string;
  company: string;
  achievements: string[];
};

export type Skill = {
  name: string;
  years: number;
  projects: number;
  level: number;
  category: "product" | "backend" | "design" | "tooling";
};

export type SkillProcessRow = {
  pid: string;
  skill: string;
  years: string;
  projects: string;
  state: "RUNNING" | "IDLE" | "LEARNING";
};

export type ExperienceImpact = {
  company: string;
  product: string;
  points: {
    metric: string;
    summary: string;
    context: string;
  }[];
};

export type PortfolioContent = {
  personal: Personal;
  aboutStack: StackRow[];
  aboutPhilosophy: string[];
  aboutCurrently: {
    reading: string;
    building: string;
    learning: string;
    listening: string;
  };
  aboutEnv: {
    timezone: string;
    available: string;
    response: string;
    remote: string;
    coffee: string;
  };
  socials: Social[];
  projects: Project[];
  experience: Experience[];
  skills: Skill[];
  skillProcessRows: SkillProcessRow[];
  secondaryTools: string[];
  certifications: string[];
  experienceImpact: ExperienceImpact[];
  stats: {
    yearsActive: string;
    projectsShipped: string;
    yearsLed: number;
  };
};

export const defaultPortfolioContent: PortfolioContent = {
  personal: {
    name: "Shivani",
    fullName: "Shivani Rai",
    initials: "SR",
    handle: "@shivanirai08",
    location: "Uttar Pradesh, IN",
    timezone: "IST (UTC+5:30)",
    editor: "VS Code",
    email: "raishivani1406@gmail.com",
    resumeUrl:
      "https://drive.google.com/file/d/1ZkeOxShgyUX_0iwb50j9cYS2JqU5EC_Q/view?usp=sharing",
    tagline: "software developer with a product brain",
    headline: "I design, build, and ship.",
    intro:
      "I turn ideas into complete products — interfaces, APIs, and everything in between.",
    synopsis: "shivani [--solve] [--shape] [--simplify] <ideas>",
    description:
      "I build end to end — React on the surface, Node and Python underneath, and the data model holding it together. Two years of shipping real products taught me the job doesn't stop at the component boundary: why the API takes 800ms, how auth scales, what the user feels between click and render.",
    bio:
      "I reach for Next.js and Express by default, open Figma when I need to think out loud, and reach for Python when the problem needs FastAPI or logic that shouldn't live in the browser. I obsess over the details most people ship past: the 200ms that feels slow, the schema that won't bend at scale, the motion that either earns its place or gets cut.",
    role: "Software Developer · Product Designer",
    pronouns: "she/her",
    status: "open_to_work",
    responseTime: "< 24h",
    availability: "true",
  },
  aboutStack: [
    { label: "languages/", items: "javascript · typescript · python · java · c · c++ · go · sql" },
    { label: "frontend/", items: "react · next.js · tailwind · redux toolkit · zustand · react-query · framer-motion" },
    { label: "backend/", items: "node · express · fastapi · rest apis · jwt · stripe · webhooks" },
    { label: "ai/", items: "llm agents · prompt engineering · mcp · fhir" },
    { label: "data/", items: "postgresql · mongodb · redis · supabase · firebase" },
    { label: "realtime/", items: "webrtc · websockets · socket.io" },
    { label: "tools/", items: "docker · aws · gcp · vercel · git · ci/cd · jest · eslint · vite · figma" },
    { label: "exploring/", items: "rust · three.js · webgpu" },
  ],
  aboutPhilosophy: [
    "pixel = pride",
    "ship beats perfect — until the last 5%",
    "good DX makes good UX",
    "animation is a feature, not a polish",
  ],
  aboutCurrently: {
    reading: '"Designing Data-Intensive Applications"',
    building: "terminal portfolio v2",
    learning: "rust + tauri",
    listening: "tycho · rüfüs · ambient",
  },
  aboutEnv: {
    timezone: "IST · UTC+5:30",
    available: "true",
    response: "< 24h",
    remote: "yes",
    coffee: "★★★ /day",
  },
  socials: [
    { name: "github", handle: "shivanirai08", url: "https://github.com/shivanirai08" },
    { name: "leetcode", handle: "shivanirai08", url: "https://leetcode.com/u/shivanirai08/" },
    { name: "twitter", handle: "shivanirai08", url: "https://x.com/shivanirai08" },
    { name: "behance", handle: "shivanirai08", url: "https://www.behance.net/shivanirai08" },
    { name: "linkedin", handle: "shivanirai08", url: "https://linkedin.com/in/shivanirai08" },
  ],
  projects: [
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
      role: "Software Developer",
      status: "live",
      links: [
        { label: "Live", url: "http://codecollab.tech" },
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
        "Competitive programming platform with public and private contests in ACM-ICPC and Codeforces-style formats. React and TypeScript on the frontend, Node.js on the backend with PostgreSQL schemas, JWT auth, and Redis Pub/Sub plus BullMQ for scalable code execution across Python, JavaScript, Java, and C++. Real-time leaderboards via WebSocket updates.",
      stack: ["React", "TypeScript", "Node.js", "PostgreSQL", "Redis", "Docker", "AWS"],
      role: "Software Developer",
      status: "live",
      links: [
        { label: "Live", url: "https://codeclash.notsg.space/" },
        { label: "GitHub", url: "https://github.com/shivanirai08/codeclash" },
      ],
      highlights: [
        "Real-time leaderboards via WebSocket with Redis Pub/Sub and BullMQ job queues",
        "Auto-evaluated submissions across Python, JavaScript, Java, and C++ at scale",
        "PostgreSQL schemas, JWT auth, and Docker deployment on AWS",
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
      role: "Software Developer",
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
      role: "Software Developer",
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
  ],
  experience: [
    {
      version: "v5.0.0",
      range: "Nov 2025 – Nov 2026",
      role: "Software Engineer Intern",
      company: "Hikigai Inc. (Internship · Remote)",
      achievements: [
        "Built Stripe subscription billing for two Health AI products: Checkout, a webhook handler for thin event payloads, a customer billing portal, and plan-based access gates that sign users out when a subscription ends, all backed by automated billing tests.",
        "Wired 12 specialised AI agents (SOAP notes, ICD-10/CPT/E&M coding, medications, labs, vaccines, referrals) into one visit-report flow that runs them in parallel, with PubMed MCP evidence lookups and clinician-approved write-back to eClinicalWorks through FHIR and MCP.",
        "Designed and built WebRTC audio consultation modules (peer connection lifecycles, Chrome/Safari/Firefox support) and a reusable React + TypeScript component library for the patient-doctor workflow, working across the full SDLC from design to deployment.",
      ],
    },
    {
      version: "v4.0.0",
      range: "Oct 2025 – Dec 2025",
      role: "Frontend Developer Intern",
      company: "QuantumNXT · Quantum Leap Technology (Part-time · Remote)",
      achievements: [
        "Built 5+ end-to-end user flows and a dynamic emission calculator on REST APIs backed by C# / ASP.NET, for BOI, an enterprise sustainability platform.",
        "Fixed 15+ critical UI/UX bugs across four dashboard views in sprint-based development.",
        "Resolved cross-browser issues on Chrome, Firefox, and Edge while working inside an existing enterprise codebase.",
      ],
    },
    {
      version: "v3.0.0",
      range: "Jun 2025 – Oct 2025",
      role: "Product Designer",
      company: "HLSR Technologies Pvt Ltd (Internship · Remote)",
      achievements: [
        "Led UX research for Ask Ira, an EdTech product, using Jobs to be Done and Octalysis frameworks to map student motivation across grades 6 to 12.",
        "Designed the complete student query flow from scratch: mode selection, concept learning, quiz and practice follow-up screens.",
      ],
    },
    {
      version: "v2.0.0",
      range: "Apr 2025 – Jul 2025",
      role: "Product Designer",
      company: "AlgoRoot Pvt. Ltd (Remote)",
      achievements: [
        "Owned end-to-end design for AlgoVox, an AI sales call agent, including the landing page, dashboard and all core screens.",
        "Delivered a complete developer handoff with interactions, animations and production-ready assets for the frontend team.",
      ],
    },
    {
      version: "v1.0.0",
      range: "Dec 2024 – Present",
      role: "Product Engineer",
      company: "Software Incubator (SDC-SI)",
      achievements: [
        "Designer: started as the team's designer, creating UI designs and prototypes and handing specs and assets to developers across a 45-person cross-functional team.",
        "Frontend Developer: moved into development, turning designs into reusable React and Tailwind CSS components and contributing to shared design system conventions.",
        "Full-Stack Developer: now build backend-integrated features end to end (APIs, data and UI) under agile workflows, shipping zero regression defects across 4 sprints.",
      ],
    },
  ],
  skills: [
    { name: "react", years: 4, projects: 24, level: 0.92, category: "product" },
    { name: "typescript", years: 3, projects: 18, level: 0.9, category: "product" },
    { name: "next.js", years: 3, projects: 18, level: 0.88, category: "product" },
    { name: "node.js", years: 3, projects: 12, level: 0.85, category: "backend" },
    { name: "javascript", years: 4, projects: 24, level: 0.88, category: "product" },
    { name: "python", years: 2, projects: 8, level: 0.78, category: "backend" },
    { name: "express", years: 2, projects: 10, level: 0.8, category: "backend" },
    { name: "figma", years: 3, projects: 20, level: 0.88, category: "design" },
    { name: "postgresql", years: 2, projects: 6, level: 0.72, category: "backend" },
    { name: "socket.io", years: 2, projects: 8, level: 0.7, category: "tooling" },
  ],
  skillProcessRows: [
    { pid: "01", skill: "--react", years: "4y 08m", projects: "24", state: "RUNNING" },
    { pid: "02", skill: "--typescript", years: "3y 02m", projects: "18", state: "RUNNING" },
    { pid: "03", skill: "--node.js", years: "3y 00m", projects: "12", state: "RUNNING" },
    { pid: "04", skill: "--javascript", years: "4y 00m", projects: "24", state: "RUNNING" },
    { pid: "05", skill: "--next.js", years: "3y 00m", projects: "18", state: "RUNNING" },
    { pid: "06", skill: "--express", years: "2y 04m", projects: "10", state: "RUNNING" },
    { pid: "07", skill: "--python", years: "2y 02m", projects: "8", state: "IDLE" },
    { pid: "08", skill: "--figma", years: "3y 06m", projects: "20", state: "IDLE" },
    { pid: "09", skill: "--postgresql", years: "2y 01m", projects: "6", state: "IDLE" },
    { pid: "97", skill: "--fastapi", years: "0y 08m", projects: "2", state: "LEARNING" },
    { pid: "98", skill: "--docker", years: "0y 06m", projects: "3", state: "LEARNING" },
    { pid: "99", skill: "--redis", years: "0y 04m", projects: "2", state: "LEARNING" },
  ],
  secondaryTools: [
    "Git", "CI/CD", "Jest", "ESLint", "Vite", "Tailwind CSS", "Redux Toolkit", "WebRTC", "WebSockets", "REST APIs", "Stripe", "MCP", "FHIR", "MongoDB", "Redis", "Supabase", "Firebase", "Docker", "AWS", "GCP", "Vercel",
  ],
  certifications: ["Certified TypeScript Engineer", "AWS Cloud Practitioner"],
  experienceImpact: [
    {
      company: "Hikigai Inc.",
      product: "Health AI Platform",
      points: [
        {
          metric: "5",
          summary: "clinical modules connected with AI-generated SOAP summaries",
          context: "REST APIs · frontend and backend integration across the patient-doctor workflow",
        },
        {
          metric: "3",
          summary: "browsers where WebRTC consultations had to work reliably",
          context: "Chrome, Safari, Firefox with fallbacks for unstable networks",
        },
      ],
    },
    {
      company: "QuantumNXT",
      product: "BOI · Sustainability Platform",
      points: [
        {
          metric: "5+",
          summary: "user flows shipped, including a live emission calculator",
          context: "REST APIs on C# / ASP.NET, 3+ emission categories",
        },
        {
          metric: "15+",
          summary: "UI/UX bugs cleared across dashboard views",
          context: "sprint cycles · Chrome, Firefox, Edge compatibility",
        },
      ],
    },
    {
      company: "HLSR Technologies",
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
  ],
  stats: {
    yearsActive: "2+",
    projectsShipped: "8+",
    yearsLed: 3,
  },
};
