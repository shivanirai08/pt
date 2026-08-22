"use client";

import {
  personal,
  projects,
  stats,
  experienceImpact,
} from "../data";
import SkillsProcessTable from "./SkillsProcessTable";

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
      <span className="text-[#3fb950]">shivanirai@portfolio</span>
      <span className="text-[#4a4a52]">:~$</span>{" "}
      <span className="text-[#e8e8ea]">{cmd}</span>
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
        <div className="flex flex-col gap-1 pl-1 font-sans text-sm leading-relaxed text-[#a8a8ad]">
          {entry.lines?.map((line, i) => (
            <span key={i}>{line}</span>
          ))}
        </div>
      )}

      {entry.kind === "ok" && (
        <div className="flex flex-col gap-1 border-l-2 border-[#3fb95044] pl-4 font-sans text-sm leading-relaxed">
          {entry.lines?.map((line, i) => (
            <span key={i} className={i === 0 ? "text-[#3fb950]" : "text-[#a8a8ad]"}>
              {line}
            </span>
          ))}
        </div>
      )}

      {entry.kind === "error" && (
        <div className="flex flex-col gap-2 border-l-2 border-[#c2707044] pl-4">
          <span className="text-sm text-[#c27070]">{entry.lines?.[0]}</span>
          {entry.suggestions && entry.suggestions.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 text-xs text-[#7c7c85]">
              <span>did you mean</span>
              {entry.suggestions.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => onSuggestion?.(s)}
                  className="border border-[#242428] bg-[#111114] px-2 py-1 text-[#e8e8ea] hover:border-[#ffddc0]"
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
        <div className="border border-[#242428] bg-[#111114]">
          <div className="flex gap-4 border-b border-[#242428] bg-[#0d0d10] px-4 py-2 text-xs tracking-widest text-[#7c7c85]">
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
              className="flex w-full gap-4 border-b border-[#242428] px-4 py-2.5 text-left text-xs last:border-b-0 hover:bg-[#0d0d10]"
            >
              <span className="w-24 shrink-0 text-[#4a4a52]">drwxr-xr-x</span>
              <span className="w-12 shrink-0 text-[#7c7c85]">{p.date}</span>
              <span className="w-32 shrink-0 text-[#ffddc0]">{p.id}/</span>
              <span className="hidden flex-1 truncate font-sans text-[#a8a8ad] sm:block">
                {p.excerpt}
              </span>
              <span className="w-20 shrink-0 text-right text-[#3fb950]">
                {p.head ? "live · HEAD" : "live"}
              </span>
            </button>
          ))}
          <div className="px-4 py-2 text-xs text-[#4a4a52]">
            {projects.length} dirs · cd &lt;name&gt; to jump to a project
          </div>
        </div>
      )}

      {entry.kind === "skills" && <SkillsProcessTable compact />}

      {entry.kind === "career" && (
        <div className="grid grid-cols-2 gap-px border border-[#242428] bg-[#242428] sm:grid-cols-4">
          {careerStats.map((c) => (
            <div key={c.label} className="flex flex-col gap-1 bg-[#111114] px-4 py-3">
              <span className="text-lg font-semibold text-[#ffddc0]">{c.value}</span>
              <span className="text-xs text-[#7c7c85]">{c.label}</span>
            </div>
          ))}
        </div>
      )}

      {entry.kind === "help" && (
        <div className="border border-[#242428] bg-[#111114]">
          {helpRows.map((r) => (
            <div
              key={r.cmd}
              className="flex gap-4 border-b border-[#242428] px-4 py-2 text-xs last:border-b-0"
            >
              <span className="w-32 shrink-0 text-[#ffddc0]">{r.cmd}</span>
              <span className="w-8 shrink-0 text-[#4a4a52]">{r.key}</span>
              <span className="flex-1 font-sans text-[#a8a8ad]">{r.desc}</span>
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
