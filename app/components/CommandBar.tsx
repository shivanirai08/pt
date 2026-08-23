"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Download, Mail, Maximize2 } from "lucide-react";
import { helpRows, type Entry } from "./TerminalOutput";
import TerminalScrollback from "./TerminalScrollback";
import StatusBar from "./StatusBar";
import { matchTerminalCommands, runTerminalCommand } from "../lib/terminalCommands";
import { SHELL_NAV, SHELL_PAD } from "../lib/shell";

export type { Entry };

const SECTIONS = ["hero", "experience", "projects", "about", "contact"];

type Props = {
  entries: Entry[];
  setEntries: React.Dispatch<React.SetStateAction<Entry[]>>;
  history: string[];
  setHistory: React.Dispatch<React.SetStateAction<string[]>>;
  entryCounter: React.MutableRefObject<number>;
  onEnterFullscreen: (draft?: string) => void;
  onOpenHelp: () => void;
  time: string;
};

export default function CommandBar({
  entries,
  setEntries,
  history,
  setHistory,
  entryCounter,
  onEnterFullscreen,
  onOpenHelp,
  time,
}: Props) {
  const [focused, setFocused] = useState(false);
  const [value, setValue] = useState("");
  const [histIdx, setHistIdx] = useState(-1);
  const [flash, setFlash] = useState<string | null>(null);
  const [active, setActive] = useState("hero");

  const matches = useMemo(() => matchTerminalCommands(value), [value]);

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
    (entry: Omit<Entry, "id">) => {
      entryCounter.current += 1;
      setEntries((prev) => [...prev, { ...entry, id: entryCounter.current }]);
    },
    [entryCounter, setEntries]
  );

  const run = useCallback(
    (raw: string) => {
      setValue("");
      setHistIdx(-1);
      setFocused(true);
      runTerminalCommand(raw, {
        mode: "gui",
        push,
        setEntries,
        setHistory,
        goSection,
        onEnterFullscreen: () => onEnterFullscreen(),
        onOpenHelp,
        setFlash,
      });
    },
    [goSection, onEnterFullscreen, onOpenHelp, push, setEntries, setHistory]
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

  const idx = SECTIONS.indexOf(active);
  const pathLabel = active === "hero" ? "~" : `~/${active}`;
  const idlePlaceholder = flash
    ? `✕ ${flash}`
    : `${pathLabel} · ${idx + 1}/${SECTIONS.length} · press / or ⌘K · try ${helpRows[1].cmd}`;

  const openFullscreen = useCallback(() => {
    onEnterFullscreen(focused ? value.trim() || undefined : undefined);
  }, [focused, onEnterFullscreen, value]);

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
        onClick={openFullscreen}
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
      <div className={SHELL_PAD}>
        {entries.length > 0 && focused && (
          <TerminalScrollback
            entries={entries}
            onSuggestion={run}
            onClear={() => setEntries([])}
            onClose={() => setFocused(false)}
            layoutId="terminal-panel"
          />
        )}
      </div>

      {focused && matches.length > 0 && (
        <div className={`border-t border-[#16161a] bg-[#0d0d10] ${SHELL_PAD}`}>
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

      <div className={`pb-2 ${SHELL_PAD}`}>
        <div className={SHELL_NAV}>
          <StatusBar
            commandMode={focused}
            commandValue={focused ? value : ""}
            onCommandChange={(v) => {
              setFocused(true);
              setValue(v);
              setHistIdx(-1);
            }}
            onCommandSubmit={() => run(value)}
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
