"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Download, Mail, Maximize2 } from "lucide-react";
import { helpRows, whoamiLines, type Entry } from "./TerminalOutput";
import TerminalScrollback from "./TerminalScrollback";
import StatusBar from "./StatusBar";
import { personal, projects } from "../data";
import { SHELL_NAV, SHELL_X } from "../lib/shell";

export type { Entry };

type Spec = {
  id: string;
  names: string[];
  desc: string;
  section?: string;
  kind?: Entry["kind"];
  lines?: string[];
};

const SPECS: Spec[] = [
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
  { id: "fullscreen", names: ["fullscreen", "cli", "terminal"], desc: "enter full terminal mode" },
];

const SECTIONS = ["hero", "experience", "projects", "about", "contact"];

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

type Props = {
  entries: Entry[];
  setEntries: React.Dispatch<React.SetStateAction<Entry[]>>;
  history: string[];
  setHistory: React.Dispatch<React.SetStateAction<string[]>>;
  entryCounter: React.MutableRefObject<number>;
  onEnterFullscreen: () => void;
  time: string;
};

export default function CommandBar({
  entries,
  setEntries,
  history,
  setHistory,
  entryCounter,
  onEnterFullscreen,
  time,
}: Props) {
  const [focused, setFocused] = useState(false);
  const [value, setValue] = useState("");
  const [histIdx, setHistIdx] = useState(-1);
  const [flash, setFlash] = useState<string | null>(null);
  const [active, setActive] = useState("hero");

  const matches = useMemo(() => {
    const q = value.trim().toLowerCase();
    if (!q) return [];
    return SPECS.filter((s) => s.names.some((n) => n.startsWith(q))).slice(0, 4);
  }, [value]);

  useEffect(() => {
    const els = SECTIONS.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const obs = new IntersectionObserver(
      (es) => {
        const vis = es
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (vis) setActive(vis.target.id);
      },
      { rootMargin: "-30% 0px -55% 0px", threshold: [0.05, 0.3, 0.6] }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const goSection = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const push = useCallback(
    (e: Omit<Entry, "id">) => {
      entryCounter.current += 1;
      setEntries((prev) => [...prev, { ...e, id: entryCounter.current }]);
    },
    [entryCounter, setEntries]
  );

  const fetchUnknownMessage = useCallback(async (commandText: string) => {
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
  }, []);

  const run = useCallback(
    (raw: string) => {
      const cmd = raw.trim();
      if (!cmd) return;
      setHistory((prev) => [...prev, cmd]);
      setHistIdx(-1);
      setValue("");
      setFocused(true);
      const q = cmd.toLowerCase();

      if (q === "clear" || q === "⌃l") {
        setEntries([]);
        return;
      }

      if (q === "fullscreen" || q === "cli" || q === "terminal") {
        push({ cmd, kind: "text", lines: ["entering full terminal mode…"] });
        window.setTimeout(onEnterFullscreen, 280);
        return;
      }

      if (q.startsWith("cd ")) {
        const slug = q.slice(3).replace(/\//g, "").trim();
        const hit = projects.find((p) => p.id === slug);
        if (hit) {
          push({ cmd, kind: "text", lines: [`opening ~/projects/${hit.id}`] });
          goSection("projects");
          window.setTimeout(() => {
            document.getElementById(`project-${hit.id}`)?.scrollIntoView({ behavior: "smooth" });
          }, 400);
          return;
        }
        push({
          cmd,
          kind: "error",
          lines: [`cd: no such directory: ${slug}`],
          suggestions: projects.slice(0, 3).map((p) => `cd ${p.id}`),
        });
        setFlash(`no such directory: ${slug}`);
        return;
      }

      const spec = SPECS.find((s) => s.names.includes(q));
      if (spec) {
        if (spec.section) {
          push({
            cmd,
            kind: "text",
            lines: [`jumping to ~/${spec.section} — the page moves, nothing reloads`],
          });
          goSection(spec.section);
          return;
        }
        if (spec.id === "hire") {
          push({ cmd, kind: "ok", lines: spec.lines });
          window.location.href = `mailto:${personal.email}`;
          return;
        }
        if (spec.id === "resume") {
          push({ cmd, kind: spec.kind ?? "text", lines: spec.lines });
          return;
        }
        if (spec.id === "fullscreen") {
          push({ cmd, kind: "text", lines: ["entering full terminal mode…"] });
          window.setTimeout(onEnterFullscreen, 280);
          return;
        }
        push({ cmd, kind: spec.kind ?? "text", lines: spec.lines });
        return;
      }

      void (async () => {
        const message = await fetchUnknownMessage(cmd);
        const all = SPECS.flatMap((s) => s.names.filter((n) => n.length > 2));
        const near = all
          .map((n) => ({ n, d: distance(q, n) }))
          .filter((x) => x.d <= 3)
          .sort((a, b) => a.d - b.d)
          .slice(0, 3)
          .map((x) => x.n);

        push({
          cmd,
          kind: "error",
          lines: [message.split(/\r?\n/)[0] || `zsh: command not found: ${cmd}`],
          suggestions: near.length ? near : [":help", ":projects", ":contact"],
        });
        setFlash(`command not found: ${cmd}`);
      })();
    },
    [fetchUnknownMessage, goSection, onEnterFullscreen, push, setEntries, setHistory]
  );

  useEffect(() => {
    if (!flash) return;
    const t = window.setTimeout(() => setFlash(null), 2600);
    return () => window.clearTimeout(t);
  }, [flash]);

  useEffect(() => {
    function onFocusCommand() {
      setFocused(true);
    }
    window.addEventListener("portfolio:focus-command", onFocusCommand);
    return () => window.removeEventListener("portfolio:focus-command", onFocusCommand);
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement)?.tagName;
      const typing = tag === "INPUT" || tag === "TEXTAREA";
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setFocused(true);
        return;
      }
      if (e.key === "/" && !typing) {
        e.preventDefault();
        setFocused(true);
      }
      if (e.key === "Escape") {
        setFocused(false);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const handleHistoryUp = useCallback(() => {
    if (!history.length) return;
    const next = histIdx < 0 ? history.length - 1 : Math.max(0, histIdx - 1);
    setHistIdx(next);
    setValue(history[next]);
  }, [histIdx, history]);

  const handleHistoryDown = useCallback(() => {
    if (histIdx < 0) return;
    const next = histIdx + 1;
    if (next >= history.length) {
      setHistIdx(-1);
      setValue("");
    } else {
      setHistIdx(next);
      setValue(history[next]);
    }
  }, [histIdx, history]);

  const handleSubmit = useCallback(() => {
    run(value);
  }, [run, value]);

  const idx = SECTIONS.indexOf(active);
  const pathLabel = active === "hero" ? "~" : `~/${active}`;
  const idlePlaceholder = flash
    ? `✕ ${flash}`
    : `${pathLabel} · ${idx + 1}/${SECTIONS.length} · press / or ⌘K · try ${helpRows[1].cmd}`;

  const barActions = (
    <>
      <button
        type="button"
        onClick={() => run(":resume")}
        className="hidden h-14 items-center gap-2 border-l border-[#242428] px-3 text-xs text-[#7c7c85] hover:text-[#a8a8ad] sm:flex"
      >
        <Download size={13} strokeWidth={1.5} /> :resume
      </button>
      <button
        type="button"
        onClick={() => goSection("contact")}
        className="hidden h-14 items-center gap-2 border-l border-[#242428] px-3 text-xs text-[#7c7c85] hover:text-[#a8a8ad] sm:flex"
      >
        <Mail size={13} strokeWidth={1.5} /> :contact
      </button>
      <button
        type="button"
        onClick={onEnterFullscreen}
        title="Enter full terminal mode"
        className="flex h-14 items-center gap-2 border-l border-[#242428] px-3 text-xs text-[#7c7c85] hover:text-[#a8a8ad]"
      >
        <Maximize2 size={13} strokeWidth={1.5} />
        <span className="hidden sm:inline">fullscreen</span>
      </button>
      <button
        type="button"
        onClick={() => setFocused(true)}
        className="flex h-14 items-center gap-2 border-l border-[#242428] px-3 text-xs text-[#7c7c85] hover:text-[#a8a8ad]"
      >
        ⌘K
      </button>
    </>
  );

  return (
    <div className="fixed inset-x-0 bottom-0 z-40">
      <div className="px-2">
      {entries.length > 0 && focused && (
        <TerminalScrollback
          entries={entries}
          onSuggestion={run}
          onClear={() => setEntries([])}
          onClose={() => setFocused(false)}
        />
      )}
      </div>
  
      {focused && matches.length > 0 && (
        <div className={`border-t border-[#16161a] bg-[#0d0d10] ${SHELL_X}`}>
          <div className={SHELL_NAV}>
            {matches.map((m, i) => (
              <button
                key={m.id}
                type="button"
                onClick={() => run(m.names[0])}
                className={`flex w-full items-center justify-between py-2 text-left text-xs ${
                  i === 0 ? "text-[#a8a8ad]" : "text-[#7c7c85] hover:text-[#a8a8ad]"
                }`}
              >
                <span>{m.names[0]}</span>
                <span className="text-[#4a4a52]">{m.desc}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className={`pb-2 px-2`}>
        <div className={SHELL_NAV}>
          <StatusBar
            commandMode={focused}
            commandValue={focused ? value : ""}
            onCommandChange={(v) => {
              setFocused(true);
              setValue(v);
              setHistIdx(-1);
            }}
            onCommandSubmit={handleSubmit}
            onCommandCancel={() => {
              setFocused(false);
              setValue("");
              setHistIdx(-1);
            }}
            onCommandFocus={() => setFocused(true)}
            onCommandBlur={() => {
              if (!entries.length) setFocused(false);
            }}
            onCommandHistoryUp={handleHistoryUp}
            onCommandHistoryDown={handleHistoryDown}
            toast={flash && focused ? flash : ""}
            time={time}
            placeholder={focused ? "type a command, or ? for the list" : idlePlaceholder}
            actions={barActions}
            animate={false}
          />
        </div>
      </div>
    </div>
  );
}
