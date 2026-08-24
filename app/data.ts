// Types + static UI constants. Live content is loaded from /api/content via PortfolioProvider.

export type {
  Personal,
  StackRow,
  Social,
  Project,
  Experience,
  Skill,
  SkillProcessRow,
  ExperienceImpact,
  PortfolioContent,
} from "./types/portfolio";

export { defaultPortfolioContent } from "./types/portfolio";

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
