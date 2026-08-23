"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Minimize2, X } from "lucide-react";
import TerminalOutput, { type Entry } from "./TerminalOutput";
import { SHELL_NAV, SHELL_X } from "../lib/shell";

type Props = {
  entries: Entry[];
  onSuggestion?: (cmd: string) => void;
  onClear?: () => void;
  onClose?: () => void;
  onMinimize?: () => void;
  maxHeight?: string;
  layoutId?: string;
  variant?: "docked" | "fullscreen";
  forceShow?: boolean;
};

export default function TerminalScrollback({
  entries,
  onSuggestion,
  onClear,
  onClose,
  onMinimize,
  maxHeight = "max-h-[46vh]",
  layoutId,
  variant = "docked",
  forceShow = false,
}: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isFullscreen = variant === "fullscreen";

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [entries]);

  if (entries.length === 0 && !isFullscreen && !forceShow) return null;

  const shell = (
    <>
      <div
        className={`flex shrink-0 items-center justify-between border-b border-[#242428] bg-[#0d0d10] py-2.5 ${SHELL_X}`}
      >
        <div className={`${SHELL_NAV} flex items-center justify-between`}>
          <div className="flex items-center gap-3 text-xs text-[#7c7c85]">
            <span className="flex gap-1.5">
              <span className="h-2 w-2 rounded-full bg-[#4a4a52]" />
              <span className="h-2 w-2 rounded-full bg-[#4a4a52]" />
              <span className="h-2 w-2 rounded-full bg-[#4a4a52]" />
            </span>
            <span>shivanirai@portfolio: ~ — zsh</span>
          </div>
          <div className="flex items-center gap-4 text-xs text-[#7c7c85]">
            {onClear ? (
              <button type="button" onClick={onClear} className="hover:text-[#a8a8ad]">
                clear
              </button>
            ) : null}
            {onMinimize ? (
              <button
                type="button"
                onClick={onMinimize}
                className="flex items-center gap-1 hover:text-[#a8a8ad]"
                title="Minimize to portfolio"
              >
                minimize <Minimize2 size={12} strokeWidth={1.5} />
              </button>
            ) : null}
            {onClose ? (
              <button
                type="button"
                onClick={onClose}
                className="flex items-center gap-1 hover:text-[#a8a8ad]"
              >
                esc <X size={12} strokeWidth={1.5} />
              </button>
            ) : null}
          </div>
        </div>
      </div>
      <div
        ref={scrollRef}
        className={
          isFullscreen
            ? `min-h-0 flex-1 overflow-y-auto bg-[#111114] py-3 ${SHELL_X}`
            : `${maxHeight} overflow-y-auto border-b border-[#242428] bg-[#111114] py-3 ${SHELL_X}`
        }
      >
        <div className={`${SHELL_NAV} flex flex-col gap-5`}>
          {entries.length === 0 ? (
            <div className="py-8 text-sm text-[#4a4a52]">
              session open — type a command, or <span className="text-[#a8a8ad]">:help</span> for the
              list
            </div>
          ) : (
            entries.map((e) => (
              <TerminalOutput key={e.id} entry={e} onSuggestion={onSuggestion} />
            ))
          )}
        </div>
      </div>
    </>
  );

  const className =
    "relative flex flex-col border-2 border-[#2a2a30] bg-[#111114] shadow-[0_-28px_56px_rgba(0,0,0,0.85)] ring-1 ring-inset ring-[#242428]/80 before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-[#ffddc0]/10 before:to-transparent" +
    (isFullscreen ? " h-full min-h-0" : " border-b-0");

  if (layoutId) {
    return (
      <motion.div
        layoutId={layoutId}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className={className}
      >
        {shell}
      </motion.div>
    );
  }

  return <div className={className}>{shell}</div>;
}
