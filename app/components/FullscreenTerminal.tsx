"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import TerminalScrollback from "./TerminalScrollback";
import StatusBar from "./StatusBar";
import { personal } from "../data";
import type { Entry } from "./TerminalOutput";
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

  const matches = useMemo(() => matchTerminalCommands(value), [value]);

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
    <div className="min-h-dvh bg-[#0a0a0b] text-[#e8e8ea]">
      <header className="sticky top-0 z-30 border-b border-[#16161a] bg-[#0a0a0b]/92 backdrop-blur">
        <div className={`${SHELL_NAV} flex h-[68px] items-center justify-between ${SHELL_X} ${SHELL_PAD}`}>
          <span className="text-[16px] font-bold tracking-tight">{personal.initials}.</span>
          <span className="text-[12px] uppercase tracking-[0.18em] text-[#4a4a52]">
            terminal · fullscreen
          </span>
        </div>
      </header>

      <div className="fixed inset-x-0 bottom-0 z-40">
        <div className={SHELL_PAD}>
          <TerminalScrollback
            entries={entries}
            onSuggestion={run}
            onClear={() => setEntries([])}
            onMinimize={onExit}
            layoutId="terminal-panel"
            variant="fullscreen"
          />
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
      </div>
    </div>
  );
}
