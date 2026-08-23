"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Minimize2 } from "lucide-react";
import TerminalOutput, { type Entry } from "./TerminalOutput";
import StatusBar from "./StatusBar";
import { personal } from "../data";
import { matchTerminalCommands, runTerminalCommand } from "../lib/terminalCommands";
import { SHELL_NAV, SHELL_PAD, SHELL_X } from "../lib/shell";

type Props = {
  entries: Entry[];
  setEntries: React.Dispatch<React.SetStateAction<Entry[]>>;
  history: string[];
  setHistory: React.Dispatch<React.SetStateAction<string[]>>;
  entryCounter: React.MutableRefObject<number>;
  initialDraft?: string;
  time: string;
  onExit: () => void;
  onOpenHelp: () => void;
};

export default function FullscreenTerminal({
  entries,
  setEntries,
  history,
  setHistory,
  entryCounter,
  initialDraft = "",
  time,
  onExit,
  onOpenHelp,
}: Props) {
  const [value, setValue] = useState(initialDraft);
  const [histIdx, setHistIdx] = useState(-1);
  const [focused, setFocused] = useState(true);
  const [flash, setFlash] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const matches = useMemo(() => matchTerminalCommands(value), [value]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [entries]);

  useEffect(() => {
    if (!flash) return;
    const t = window.setTimeout(() => setFlash(null), 2600);
    return () => window.clearTimeout(t);
  }, [flash]);

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
        mode: "fullscreen",
        push,
        setEntries,
        setHistory,
        onExitFullscreen: onExit,
        onOpenHelp,
        setFlash,
      });
    },
    [onExit, onOpenHelp, push, setEntries, setHistory]
  );

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

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setFocused(true);
      }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "m") {
        e.preventDefault();
        onExit();
      }
      if (e.key === "~" && (e.target as HTMLElement)?.tagName !== "INPUT") {
        e.preventDefault();
        onExit();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onExit]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="flex min-h-dvh flex-col bg-[#0a0a0b] text-[#e8e8ea]"
    >
      <header className="sticky top-0 z-40 shrink-0 border-b border-[#16161a] bg-[#0a0a0b]/92 backdrop-blur">
        <div className={`${SHELL_NAV} flex h-[68px] items-center justify-between ${SHELL_X}`}>
          <span className="text-[16px] font-bold tracking-tight">{personal.initials}.</span>
          <div className="flex items-center gap-4">
            <span className="hidden text-[12px] uppercase tracking-[0.18em] text-[#4a4a52] sm:inline">
              terminal · fullscreen
            </span>
            <button
              type="button"
              onClick={onExit}
              title="Exit to portfolio (~)"
              className="inline-flex min-h-9 items-center gap-2 border border-[#242428] px-4 py-2 text-[12px] text-[#7c7c85] hover:text-[#a8a8ad]"
            >
              <Minimize2 size={14} strokeWidth={1.5} />
              exit
            </button>
          </div>
        </div>
      </header>

      <div className={`flex min-h-0 flex-1 flex-col ${SHELL_PAD} pt-2`}>
        <motion.div
          layoutId="terminal-panel"
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="relative flex min-h-0 flex-1 flex-col border-2 border-[#2a2a30] bg-[#111114] shadow-[0_-28px_56px_rgba(0,0,0,0.85)] ring-1 ring-inset ring-[#242428]/80 before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-[#ffddc0]/10 before:to-transparent"
        >
          <div className={`flex shrink-0 items-center justify-between border-b border-[#242428] bg-[#0d0d10] py-2 ${SHELL_X}`}>
            <div className={`${SHELL_NAV} flex items-center justify-between`}>
              <div className="flex items-center gap-3 text-xs text-[#7c7c85]">
                <span className="flex gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-[#4a4a52]" />
                  <span className="h-2 w-2 rounded-full bg-[#4a4a52]" />
                  <span className="h-2 w-2 rounded-full bg-[#4a4a52]" />
                </span>
                <span>shivanirai@portfolio: ~ — zsh</span>
              </div>
              <button
                type="button"
                onClick={() => setEntries([])}
                className="text-xs text-[#4a4a52] hover:text-[#a8a8ad]"
              >
                clear
              </button>
            </div>
          </div>

          <div ref={scrollRef} className={`min-h-0 flex-1 overflow-y-auto py-3 ${SHELL_X}`}>
            <div className={`${SHELL_NAV} flex flex-col gap-5`}>
              {entries.length === 0 ? (
                <div className="py-8 text-sm text-[#4a4a52]">
                  session open — type a command, or <span className="text-[#a8a8ad]">:help</span> for the list
                </div>
              ) : (
                entries.map((e) => <TerminalOutput key={e.id} entry={e} onSuggestion={run} />)
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {focused && matches.length > 0 && (
        <div className={`shrink-0 border-t border-[#16161a] bg-[#0d0d10] ${SHELL_PAD}`}>
          <div className={`${SHELL_NAV} ${SHELL_X}`}>
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

      <div className={`shrink-0 ${SHELL_PAD} pb-2`}>
        <div className={SHELL_NAV}>
          <StatusBar
            commandMode={focused}
            commandValue={value}
            onCommandChange={(v) => {
              setFocused(true);
              setValue(v);
              setHistIdx(-1);
            }}
            onCommandSubmit={() => run(value)}
            onCommandCancel={() => {
              setValue("");
              setHistIdx(-1);
            }}
            onCommandFocus={() => setFocused(true)}
            onCommandBlur={() => setFocused(true)}
            onCommandHistoryUp={handleHistoryUp}
            onCommandHistoryDown={handleHistoryDown}
            toast={flash ?? ""}
            time={time}
            placeholder="type a command, use ↑/↓ history, or :help"
            cliMode
            animate={false}
          />
        </div>
      </div>
    </motion.div>
  );
}
