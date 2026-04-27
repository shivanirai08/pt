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
    <div className="pointer-events-auto w-full border border-[#242428] bg-[#070708]/96 backdrop-blur-lg">
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className={
          "flex h-14 w-full items-center justify-center gap-3 px-4 text-[12px] transition-colors duration-200" +
          (props.commandMode
            ? "bg-[#101014]/95"
            : "bg-[#0d0d10]/95")
        }
      >
        <span className="hidden text-[#d4b483] sm:inline">shivanirai@portfolio:~$</span>
        <span className="text-[#d4b483] sm:hidden">~$</span>
        <span className="text-[#d4b483] font-medium">:</span>
        <input
          ref={inputRef}
          className="flex-1 bg-transparent text-[#e8e8ea] outline-none placeholder:text-[#4a4a52] caret-[#d4b483]"
          value={props.commandValue}
          onChange={(e) => props.onCommandChange(e.target.value)}
          onKeyDown={handleKey}
          onFocus={props.onCommandFocus}
          onBlur={props.onCommandBlur}
          placeholder="type a command, use ↑/↓ history, 1-5, or :help"
        />
        {props.toast ? (
          <motion.span
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="hidden whitespace-nowrap text-[11px] text-[#c27070] md:inline"
          >
            {props.toast}
          </motion.span>
        ) : (
          <div className="hidden items-center gap-3 text-[10px] tracking-[0.08em] text-[#7c7c85] md:flex">
            <span>{props.time}</span>
            <span className="text-[#4a4a52]">|</span>
            <span>
              <span className="text-[#ffddc0]">?</span> help
            </span>
            <span className="text-[#4a4a52]">|</span>
            <span>
              <span className="text-[#ffddc0]">~</span> GUI
            </span>
          </div>
        )}
      </motion.div>
    </div>
  );
}
