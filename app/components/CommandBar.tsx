"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Download, Mail, Maximize2, X } from "lucide-react";
import TerminalOutput, { helpRows, whoamiLines, type Entry } from "./TerminalOutput";
import { personal, projects } from "../data";

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
  onEnterFullscreen: () => void;
};

export default function CommandBar({ onEnterFullscreen }: Props) {
  const [focused, setFocused] = useState(false);
  const [value, setValue] = useState("");
  const [entries, setEntries] = useState<Entry[]>([]);
  const [history, setHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(-1);
  const [flash, setFlash] = useState<string | null>(null);
  const [active, setActive] = useState("hero");

  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const counter = useRef(0);

  const matches = useMemo(() => {
    const q = value.trim().toLowerCase();
    if (!q) return [];
    return SPECS.filter((s) => s.names.some((n) => n.startsWith(q))).slice(0, 4);
  }, [value]);

  const ghost = useMemo(() => {
    const q = value.trim().toLowerCase();
    if (!q || matches.length === 0) return "";
    const hit = matches[0].names.find((n) => n.startsWith(q));
    return hit ? hit.slice(q.length) : "";
  }, [value, matches]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [entries]);

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

  const push = useCallback((e: Omit<Entry, "id">) => {
    counter.current += 1;
    setEntries((prev) => [...prev, { ...e, id: counter.current }]);
  }, []);

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
    [fetchUnknownMessage, goSection, onEnterFullscreen, push]
  );

  useEffect(() => {
    if (!flash) return;
    const t = window.setTimeout(() => setFlash(null), 2600);
    return () => window.clearTimeout(t);
  }, [flash]);

  useEffect(() => {
    function onFocusCommand() {
      setFocused(true);
      window.setTimeout(() => inputRef.current?.focus(), 0);
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
        window.setTimeout(() => inputRef.current?.focus(), 0);
        return;
      }
      if (e.key === "/" && !typing) {
        e.preventDefault();
        setFocused(true);
        window.setTimeout(() => inputRef.current?.focus(), 0);
      }
      if (e.key === "Escape") {
        setFocused(false);
        inputRef.current?.blur();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function onInputKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      run(value);
    } else if (e.key === "Tab") {
      e.preventDefault();
      if (ghost) setValue(value.trim() + ghost);
      else if (entries.length) {
        const last = entries[entries.length - 1];
        if (last.kind === "error" && last.suggestions?.[0]) setValue(last.suggestions[0]);
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!history.length) return;
      const next = histIdx < 0 ? history.length - 1 : Math.max(0, histIdx - 1);
      setHistIdx(next);
      setValue(history[next]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (histIdx < 0) return;
      const next = histIdx + 1;
      if (next >= history.length) {
        setHistIdx(-1);
        setValue("");
      } else {
        setHistIdx(next);
        setValue(history[next]);
      }
    }
  }

  const idx = SECTIONS.indexOf(active);
  const pathLabel = active === "hero" ? "~" : `~/${active}`;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40">
      {entries.length > 0 && focused && (
        <div className="border-t border-[#38322b] bg-[#121110]">
          <div className="flex items-center justify-between border-b border-[#262320] bg-[#1a1715] px-5 py-2">
            <div className="flex items-center gap-3 text-xs text-[#6b625a]">
              <span className="flex gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[#453f38]" />
                <span className="h-2 w-2 rounded-full bg-[#453f38]" />
                <span className="h-2 w-2 rounded-full bg-[#453f38]" />
              </span>
              <span>shivanirai@portfolio: ~ — zsh</span>
            </div>
            <div className="flex items-center gap-4 text-xs text-[#453f38]">
              <button type="button" onClick={() => setEntries([])} className="hover:text-[#a89f92]">
                clear
              </button>
              <button
                type="button"
                onClick={() => setFocused(false)}
                className="flex items-center gap-1 hover:text-[#a89f92]"
              >
                esc <X size={12} strokeWidth={1.5} />
              </button>
            </div>
          </div>
          <div ref={scrollRef} className="max-h-[46vh] overflow-y-auto px-5 py-4">
            <div className="mx-auto flex max-w-5xl flex-col gap-6">
              {entries.map((e) => (
                <TerminalOutput key={e.id} entry={e} onSuggestion={run} />
              ))}
            </div>
          </div>
        </div>
      )}

      {focused && matches.length > 0 && (
        <div className="border-t border-[#262320] bg-[#121110]">
          <div className="mx-auto max-w-5xl">
            {matches.map((m, i) => (
              <button
                key={m.id}
                type="button"
                onClick={() => run(m.names[0])}
                className={`flex w-full items-center justify-between px-5 py-2 text-left text-xs ${
                  i === 0 ? "bg-[#1a1715] text-[#f7dfc0]" : "text-[#a89f92] hover:bg-[#1a1715]"
                }`}
              >
                <span>{m.names[0]}</span>
                <span className="text-[#453f38]">{m.desc}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="border-t border-[#38322b] bg-[#1a1715]">
        <div className="flex h-12 items-center justify-between gap-4 pr-1">
          <div className="flex h-full min-w-0 flex-1 items-center gap-0">
            <a
              href={`mailto:${personal.email}`}
              className="flex h-full shrink-0 items-center gap-2 bg-[#f7dfc0] px-4 text-xs font-semibold text-[#171310] hover:bg-[#ece5da]"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[#2f6b1f]" />
              AVAILABLE
            </a>

            {focused ? (
              <div className="relative flex min-w-0 flex-1 items-center gap-2 px-4">
                <span className="shrink-0 text-sm text-[#86b06a]">~$</span>
                <div className="relative min-w-0 flex-1">
                  <div className="pointer-events-none absolute inset-0 flex items-center truncate font-mono text-sm">
                    <span className="text-[#ece5da]">{value}</span>
                    <span className="text-[#453f38]">{ghost}</span>
                    {!value && (
                      <span className="text-[#453f38]">type a command, or ? for the list</span>
                    )}
                  </div>
                  <input
                    ref={inputRef}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    onKeyDown={onInputKey}
                    onBlur={() => !entries.length && setFocused(false)}
                    className="w-full bg-transparent font-mono text-sm text-transparent caret-[#f7dfc0] outline-none"
                    spellCheck={false}
                    autoComplete="off"
                  />
                </div>
                <span className="hidden shrink-0 items-center gap-3 text-xs text-[#453f38] sm:flex">
                  <span className="border border-[#262320] px-1.5 py-0.5">↹ tab</span>
                  <span className="border border-[#262320] px-1.5 py-0.5">↑ history</span>
                  <span className="border border-[#262320] px-1.5 py-0.5">↵ run</span>
                </span>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setFocused(true);
                  window.setTimeout(() => inputRef.current?.focus(), 0);
                }}
                className="flex h-full min-w-0 flex-1 items-center gap-4 px-4 text-left"
              >
                {flash ? (
                  <span className="truncate text-xs text-[#d98d6c]">✕ {flash}</span>
                ) : (
                  <>
                    <span className="text-xs text-[#a89f92]">{pathLabel}</span>
                    <span className="hidden text-xs text-[#453f38] sm:inline">
                      {idx + 1} / {SECTIONS.length}
                    </span>
                    <span className="hidden truncate text-xs text-[#453f38] md:inline">
                      press <span className="text-[#a89f92]">/</span> to run a command · try{" "}
                      <span className="text-[#a89f92]">{helpRows[1].cmd}</span>
                    </span>
                  </>
                )}
              </button>
            )}
          </div>

          <div className="flex h-full shrink-0 items-center">
            <button
              type="button"
              onClick={() => run(":resume")}
              className="hidden h-full items-center gap-2 px-4 text-xs text-[#a89f92] hover:text-[#ece5da] sm:flex"
            >
              <Download size={13} strokeWidth={1.5} /> :resume
            </button>
            <button
              type="button"
              onClick={() => goSection("contact")}
              className="hidden h-full items-center gap-2 px-4 text-xs text-[#a89f92] hover:text-[#ece5da] sm:flex"
            >
              <Mail size={13} strokeWidth={1.5} /> :contact
            </button>
            <button
              type="button"
              onClick={onEnterFullscreen}
              title="Enter full terminal mode"
              className="flex h-full items-center gap-2 border-l border-[#262320] bg-[#231f1b] px-4 text-xs text-[#ece5da] hover:bg-[#38322b]"
            >
              <Maximize2 size={13} strokeWidth={1.5} />
              <span className="hidden sm:inline">fullscreen</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setFocused(true);
                window.setTimeout(() => inputRef.current?.focus(), 0);
              }}
              className="flex h-full items-center gap-2 border-l border-[#262320] bg-[#231f1b] px-4 text-xs text-[#ece5da] hover:bg-[#38322b]"
            >
              ⌘K
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
