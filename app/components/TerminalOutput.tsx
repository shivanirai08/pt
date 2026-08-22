"use client";

import {
  personal,
  projects,
  skills,
  stats,
  experienceImpact,
} from "../data";

export type Entry = {
  id: number;
  cmd: string;
  kind: "text" | "ls" | "skills" | "career" | "help" | "error" | "ok";
  lines?: string[];
  suggestions?: string[];
};

export const helpRows: { cmd: string; key: string; desc: string }[] = [
  { cmd: ":about", key: "1", desc: "man page — who I am" },
  { cmd: ":projects", key: "2", desc: "shipped work, newest first" },
  { cmd: ":experience", key: "3", desc: "changelog of roles" },
  { cmd: ":skills", key: "4", desc: "stack, by depth" },
  { cmd: ":contact", key: "5", desc: "email, socials, timezone" },
  { cmd: ":resume", key: "r", desc: "download pdf" },
  { cmd: "whoami", key: "—", desc: "the one-line version" },
  { cmd: "ls ~/projects", key: "—", desc: "work as a directory listing" },
  { cmd: "wc --career", key: "—", desc: "the numbers" },
  { cmd: "cd <project>", key: "↵", desc: "scroll to a project" },
  { cmd: "clear", key: "⌃L", desc: "wipe the scrollback" },
  { cmd: "fullscreen", key: "⛶", desc: "enter full terminal mode" },
];

const careerStats = [
  { label: "years active", value: stats.yearsActive },
  { label: "projects shipped", value: String(stats.projectsShipped) },
  { label: "teams led", value: String(stats.yearsLed) },
  { label: "impact groups", value: String(experienceImpact.length) },
];

function Prompt({ cmd }: { cmd: string }) {
  return (
    <div className="text-sm">
      <span className="text-[#86b06a]">shivanirai@portfolio</span>
      <span className="text-[#5d564e]">:~$</span>{" "}
      <span className="text-[#ece5da]">{cmd}</span>
    </div>
  );
}

type Props = {
  entry: Entry;
  onSuggestion?: (cmd: string) => void;
};

export default function TerminalOutput({ entry, onSuggestion }: Props) {
  return (
    <div className="flex flex-col gap-2">
      <Prompt cmd={entry.cmd} />

      {entry.kind === "text" && (
        <div className="flex flex-col gap-1 pl-1 text-sm leading-relaxed text-[#a89f92]">
          {entry.lines?.map((line, i) => (
            <span key={i}>{line}</span>
          ))}
        </div>
      )}

      {entry.kind === "ok" && (
        <div className="flex flex-col gap-1 border-l-2 border-[#3f5b32] pl-4 text-sm leading-relaxed">
          {entry.lines?.map((line, i) => (
            <span key={i} className={i === 0 ? "text-[#86b06a]" : "text-[#a89f92]"}>
              {line}
            </span>
          ))}
        </div>
      )}

      {entry.kind === "error" && (
        <div className="flex flex-col gap-2 border-l-2 border-[#6b3a2e] pl-4">
          <span className="text-sm text-[#d98d6c]">{entry.lines?.[0]}</span>
          {entry.suggestions && entry.suggestions.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 text-xs text-[#6b625a]">
              <span>did you mean</span>
              {entry.suggestions.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => onSuggestion?.(s)}
                  className="border border-[#38322b] bg-[#121110] px-2 py-1 text-[#ece5da] hover:border-[#8a7654]"
                >
                  {s}
                </button>
              ))}
              <span>· press ↹ to accept</span>
            </div>
          )}
        </div>
      )}

      {entry.kind === "ls" && (
        <div className="border border-[#262320] bg-[#121110]">
          <div className="flex gap-4 border-b border-[#262320] bg-[#1a1715] px-4 py-2 text-xs tracking-widest text-[#6b625a]">
            <span className="w-24 shrink-0">MODE</span>
            <span className="w-12 shrink-0">YEAR</span>
            <span className="w-32 shrink-0">NAME</span>
            <span className="hidden flex-1 sm:block">SUMMARY</span>
            <span className="w-20 shrink-0 text-right">STATUS</span>
          </div>
          {projects.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => onSuggestion?.(`cd ${p.id}`)}
              className="flex w-full gap-4 border-b border-[#262320] px-4 py-2.5 text-left text-xs last:border-b-0 hover:bg-[#1a1715]"
            >
              <span className="w-24 shrink-0 text-[#453f38]">drwxr-xr-x</span>
              <span className="w-12 shrink-0 text-[#6b625a]">{p.date}</span>
              <span className="w-32 shrink-0 text-[#f7dfc0]">{p.id}/</span>
              <span className="hidden flex-1 truncate text-[#a89f92] sm:block">
                {p.excerpt}
              </span>
              <span className="w-20 shrink-0 text-right text-[#86b06a]">
                {p.head ? "live · HEAD" : "live"}
              </span>
            </button>
          ))}
          <div className="px-4 py-2 text-xs text-[#453f38]">
            {projects.length} dirs · cd &lt;name&gt; to jump to a project
          </div>
        </div>
      )}

      {entry.kind === "skills" && (
        <div className="flex flex-col gap-2 border border-[#262320] bg-[#121110] p-4">
          {skills.map((s) => (
            <div key={s.name} className="flex items-center gap-4 text-xs">
              <span className="w-32 shrink-0 text-[#a89f92]">{s.name}</span>
              <span className="flex flex-1 gap-px">
                {Array.from({ length: 18 }).map((_, i) => (
                  <span
                    key={i}
                    className={`h-2 flex-1 ${
                      i < Math.round(s.level * 18) ? "bg-[#f7dfc0]" : "bg-[#231f1b]"
                    }`}
                  />
                ))}
              </span>
              <span className="w-16 shrink-0 text-right text-[#453f38]">
                {s.years}y · {s.projects}p
              </span>
            </div>
          ))}
        </div>
      )}

      {entry.kind === "career" && (
        <div className="grid grid-cols-2 gap-px border border-[#262320] bg-[#262320] sm:grid-cols-4">
          {careerStats.map((c) => (
            <div key={c.label} className="flex flex-col gap-1 bg-[#121110] px-4 py-3">
              <span className="text-lg font-semibold text-[#f7dfc0]">{c.value}</span>
              <span className="text-xs text-[#6b625a]">{c.label}</span>
            </div>
          ))}
        </div>
      )}

      {entry.kind === "help" && (
        <div className="border border-[#262320] bg-[#121110]">
          {helpRows.map((r) => (
            <div
              key={r.cmd}
              className="flex gap-4 border-b border-[#262320] px-4 py-2 text-xs last:border-b-0"
            >
              <span className="w-32 shrink-0 text-[#f7dfc0]">{r.cmd}</span>
              <span className="w-8 shrink-0 text-[#453f38]">{r.key}</span>
              <span className="flex-1 text-[#a89f92]">{r.desc}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function whoamiLines() {
  return [
    `${personal.fullName.toLowerCase()} · frontend engineer · ${personal.location.toLowerCase()}`,
    `2 yrs shipping · currently at Hikigai Inc. · $AVAILABLE = ${personal.availability}`,
  ];
}
