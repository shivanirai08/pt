"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import TerminalOutput, { type Entry } from "./TerminalOutput";
import { SHELL_NAV, SHELL_X } from "../lib/shell";

type Props = {
  entries: Entry[];
  onSuggestion?: (cmd: string) => void;
  onClear?: () => void;
  onClose?: () => void;
  maxHeight?: string;
  layoutId?: string;
};

export default function TerminalScrollback({
  entries,
  onSuggestion,
  onClear,
  onClose,
  maxHeight = "max-h-[46vh]",
  layoutId,
}: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [entries]);

  if (entries.length === 0) return null;

  const shell = (
    <>
      <div className={`flex items-center justify-between border-b border-[#242428] bg-[#0d0d10] py-2 ${SHELL_X}`}>
        <div className={`${SHELL_NAV} flex items-center justify-between`}>
          <div className="flex items-center gap-3 text-xs text-[#7c7c85]">
            <span className="flex gap-1.5">
              <span className="h-2 w-2 rounded-full bg-[#4a4a52]" />
              <span className="h-2 w-2 rounded-full bg-[#4a4a52]" />
              <span className="h-2 w-2 rounded-full bg-[#4a4a52]" />
            </span>
            <span>shivanirai@portfolio: ~ — zsh</span>
          </div>
          <div className="flex items-center gap-4 text-xs text-[#4a4a52]">
            {onClear ? (
              <button type="button" onClick={onClear} className="hover:text-[#a8a8ad]">
                clear
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
        className={`${maxHeight} overflow-y-auto border-b border-[#242428] bg-[#111114] py-3 ${SHELL_X}`}
      >
        <div className={`${SHELL_NAV} flex flex-col gap-5`}>
          {entries.map((e) => (
            <TerminalOutput key={e.id} entry={e} onSuggestion={onSuggestion} />
          ))}
        </div>
      </div>
    </>
  );

  const className =
    "relative border-2 border-b-0 border-[#2a2a30] bg-[#111114] shadow-[0_-28px_56px_rgba(0,0,0,0.85)] ring-1 ring-inset ring-[#242428]/80 before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-[#ffddc0]/10 before:to-transparent";

  if (layoutId) {
    return (
      <motion.div layoutId={layoutId} transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }} className={className}>
        {shell}
      </motion.div>
    );
  }

  return <div className={className}>{shell}</div>;
}
