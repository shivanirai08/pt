"use client";

import { useRef, useEffect } from "react";
import { motion } from "framer-motion";

type Props = {
  commandMode: boolean;
  commandValue: string;
  onCommandChange: (v: string) => void;
  onCommandSubmit: () => void;
  onCommandCancel: () => void;
  onCommandFocus: () => void;
  onCommandBlur: () => void;
  onCommandHistoryUp: () => void;
  onCommandHistoryDown: () => void;
  toast: string;
  time: string;
};

export default function StatusBar(props: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (props.commandMode) inputRef.current?.focus();
  }, [props.commandMode]);

  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      inputRef.current?.blur();
      props.onCommandSubmit();
    }
    if (e.key === "Escape") {
      e.preventDefault();
      inputRef.current?.blur();
      props.onCommandCancel();
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      props.onCommandHistoryUp();
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      props.onCommandHistoryDown();
    }
  };

  return (
    <div className="border-t border-[#242428] bg-[#070708]/98 backdrop-blur">
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className={
          "flex h-12 items-center gap-3 border-b px-6 text-[12px] transition-colors duration-200 " +
          (props.commandMode
            ? "border-[#26262b] bg-[#101014]"
            : "border-[#1a1a1d] bg-[#0d0d10]")
        }
      >
        <span className="text-[#d4b483]">shivanirai@portfolio:~$</span>
        <span className="text-[#d4b483] font-medium">:</span>
        <input
          ref={inputRef}
          className="flex-1 bg-transparent text-[#e8e8ea] outline-none placeholder:text-[#4a4a52] caret-[#d4b483]"
          value={props.commandValue}
          onChange={(e) => props.onCommandChange(e.target.value)}
          onKeyDown={handleKey}
          onFocus={props.onCommandFocus}
          onBlur={props.onCommandBlur}
          placeholder="type a command, use up/down history, 1-5, or left/right arrows"
        />
        <span className="ml-3 text-[10px] tracking-widest text-[#4a4a52]">
          COMMAND
        </span>
      </motion.div>

      <div className="flex h-11 items-center gap-4 bg-[#09090a]/96 px-6 text-[11.5px] text-[#7c7c85]">
        <span className="text-[#a8a8ad]">By Shivani</span>
        <span className="text-[#4a4a52]">│</span>
        <span>{props.time}</span>
        <span className="flex-1" />
        {props.toast ? (
          <motion.span
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-[#c27070]"
          >
            {props.toast}
          </motion.span>
        ) : (
          <span className="flex flex-wrap items-center gap-2 text-[#d7d7dc]">
            <span className="text-[#7c7c85]">Shortcuts:</span>
            <span>
              use <span className="text-[#ffddc0]">←</span>/<span className="text-[#ffddc0]">→</span>, <span className="text-[#ffddc0]">1-5</span>, or <span className="text-[#ffddc0]">:help</span>
            </span>
            <span className="rounded-sm border border-[#5a4630] bg-[#241b12] px-1.5 py-0.5 text-[10px] font-medium text-[#ffddc0]">
              ~
            </span>
            <span>for GUI</span>
          </span>
        )}
      </div>
    </div>
  );
}
