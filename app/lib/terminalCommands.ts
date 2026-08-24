import type { Dispatch, SetStateAction } from "react";
import { personal, projects } from "../data";
import type { Entry } from "../components/TerminalOutput";
import { whoamiLines } from "../components/TerminalOutput";

export type TerminalSection = "about" | "projects" | "experience" | "contact";

type Spec = {
  id: string;
  names: string[];
  desc: string;
  section?: TerminalSection;
  kind?: Entry["kind"];
  lines?: string[];
};

export const TERMINAL_SPECS: Spec[] = [
  { id: "about", names: [":about", "about", "1"], desc: "man page — who I am", section: "about" },
  { id: "projects", names: [":projects", "projects", "2"], desc: "shipped work, newest first", section: "projects" },
  { id: "experience", names: [":experience", "experience", "3"], desc: "changelog of roles", section: "experience" },
  { id: "contact", names: [":contact", "contact", "5"], desc: "email, socials, timezone", section: "contact" },
  { id: "skills", names: [":skills", "skills", "4"], desc: "stack, by depth", kind: "skills" },
  { id: "help", names: [":help", "help", "?"], desc: "every command", kind: "help" },
  {
    id: "whoami",
    names: ["whoami"],
    desc: "the one-line version",
    kind: "text",
    lines: whoamiLines(),
  },
  { id: "ls", names: ["ls ~/projects", "ls -la", "ls"], desc: "work as a directory listing", kind: "ls" },
  { id: "wc", names: ["wc --career", "wc"], desc: "the numbers", kind: "career" },
  {
    id: "resume",
    names: [":resume", "resume", "r"],
    desc: "download pdf",
    kind: "text",
    lines: ["fetching shivani-rai-resume.pdf …", "1 file · 184 KB · download started"],
  },
  {
    id: "hire",
    names: ["sudo hire shivani", "hire"],
    desc: "skip the small talk",
    kind: "ok",
    lines: ["permission granted.", `opening mail to ${personal.email} — response under 24h`],
  },
  { id: "clear", names: ["clear"], desc: "wipe the scrollback" },
  { id: "exit", names: ["exit", "gui", "minimize", "~"], desc: "return to portfolio view" },
  { id: "fullscreen", names: ["fullscreen", "cli", "terminal"], desc: "enter full terminal mode" },
];

function distance(a: string, b: string) {
  const m = a.length;
  const n = b.length;
  const d: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) d[i][0] = i;
  for (let j = 0; j <= n; j++) d[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      d[i][j] = Math.min(
        d[i - 1][j] + 1,
        d[i][j - 1] + 1,
        d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
      );
    }
  }
  return d[m][n];
}

export async function fetchTerminalMessage(commandText: string) {
  const fallback = "unknown command. terminal unimpressed.";
  try {
    const response = await fetch("/api/terminal", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ command: commandText }),
    });
    const data = (await response.json()) as { message?: string };
    if (response.ok && typeof data.message === "string" && data.message.trim()) {
      return data.message.trim();
    }
  } catch {
    /* use fallback */
  }
  return fallback;
}

export type RunTerminalContext = {
  mode: "gui" | "fullscreen";
  push: (entry: Omit<Entry, "id">) => void;
  setEntries: Dispatch<SetStateAction<Entry[]>>;
  setHistory: Dispatch<SetStateAction<string[]>>;
  goSection?: (id: string) => void;
  onEnterFullscreen?: () => void;
  onExitFullscreen?: () => void;
  onOpenHelp?: () => void;
  setFlash?: (msg: string | null) => void;
};

export function runTerminalCommand(raw: string, ctx: RunTerminalContext) {
  const cmd = raw.trim();
  if (!cmd) return;
  ctx.setHistory((prev) => [...prev, cmd]);
  const q = cmd.toLowerCase();

  if (q === "clear" || q === "⌃l") {
    ctx.setEntries([]);
    return;
  }

  if (q === "help" || q === "?") {
    ctx.push({ cmd, kind: "help" });
    ctx.onOpenHelp?.();
    return;
  }

  if ((q === "exit" || q === "gui" || q === "minimize" || q === "~") && ctx.mode === "fullscreen") {
    ctx.onExitFullscreen?.();
    return;
  }

  if (q === "fullscreen" || q === "cli" || q === "terminal") {
    if (ctx.mode === "fullscreen") {
      ctx.push({ cmd, kind: "text", lines: ["already in full terminal mode."] });
      return;
    }
    ctx.push({ cmd, kind: "text", lines: ["entering full terminal mode…"] });
    window.setTimeout(() => ctx.onEnterFullscreen?.(), 280);
    return;
  }

  if (q.startsWith("cd ")) {
    const slug = q.slice(3).replace(/\//g, "").trim();
    const hit = projects.find((p) => p.id === slug);
    if (hit) {
      window.setTimeout(() => {
        window.dispatchEvent(new CustomEvent("portfolio:open-project", { detail: { id: hit.id } }));
        document.getElementById(`project-${hit.id}`)?.scrollIntoView({ behavior: "smooth" });
      }, ctx.mode === "gui" ? 400 : 80);
      if (ctx.mode === "gui" && ctx.goSection) {
        ctx.push({ cmd, kind: "text", lines: [`opening ~/projects/${hit.id}`] });
        ctx.goSection("projects");
      } else {
        ctx.push({ cmd, kind: "section", section: "projects" });
      }
      return;
    }
    ctx.push({
      cmd,
      kind: "error",
      lines: [`cd: no such directory: ${slug}`],
      suggestions: projects.slice(0, 3).map((p) => `cd ${p.id}`),
    });
    ctx.setFlash?.(`no such directory: ${slug}`);
    return;
  }

  const spec = TERMINAL_SPECS.find((s) => s.names.includes(q));
  if (spec) {
    if (spec.section) {
      if (ctx.mode === "gui" && ctx.goSection) {
        ctx.push({
          cmd,
          kind: "text",
          lines: [`jumping to ~/${spec.section} — the page moves, nothing reloads`],
        });
        ctx.goSection(spec.section);
      } else {
        ctx.push({ cmd, kind: "section", section: spec.section });
      }
      return;
    }
    if (spec.id === "hire") {
      ctx.push({ cmd, kind: "ok", lines: spec.lines });
      window.location.href = `mailto:${personal.email}`;
      return;
    }
    ctx.push({ cmd, kind: spec.kind ?? "text", lines: spec.lines });
    return;
  }

  void (async () => {
    const message = await fetchTerminalMessage(cmd);
    const all = TERMINAL_SPECS.flatMap((s) => s.names.filter((n) => n.length > 2));
    const near = all
      .map((n) => ({ n, d: distance(q, n) }))
      .filter((x) => x.d <= 3)
      .sort((a, b) => a.d - b.d)
      .slice(0, 3)
      .map((x) => x.n);

    ctx.push({
      cmd,
      kind: "error",
      lines: [message.split(/\r?\n/)[0] || `zsh: command not found: ${cmd}`],
      suggestions: near.length ? near : [":help", ":projects", ":contact"],
    });
    ctx.setFlash?.(`command not found: ${cmd}`);
  })();
}

export function matchTerminalCommands(query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return TERMINAL_SPECS.filter((s) => s.names.some((n) => n.startsWith(q))).slice(0, 4);
}
