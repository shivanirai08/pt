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
  cliMode?: boolean;
  placeholder?: string;
  actions?: React.ReactNode;
  animate?: boolean;
};

export default function StatusBar(props: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const animate = props.animate ?? props.cliMode ?? false;

  useEffect(() => {
    if (props.commandMode) inputRef.current?.focus();
  }, [props.commandMode]);

  useEffect(() => {
    function onFocusCommand() {
      // Always pull focus to the live prompt — even if the dock is already open
      // and commandMode didn't change (e.g. / or ⌘K after blur/submit).
      window.requestAnimationFrame(() => inputRef.current?.focus());
    }
    window.addEventListener("portfolio:focus-command", onFocusCommand);
    return () => window.removeEventListener("portfolio:focus-command", onFocusCommand);
  }, []);

  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      props.onCommandSubmit();
      window.requestAnimationFrame(() => inputRef.current?.focus());
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

  const rowClass =
    "flex h-14 w-full items-center gap-3 text-[12px] transition-colors duration-200 px-10" +
    (props.commandMode ? " bg-[#101014]/95" : " bg-[#0d0d10]/95");

  const inner = (
    <>
      <span className="hidden shrink-0 text-[#d4b483] sm:inline">shivanirai@portfolio:~$</span>
      <span className="shrink-0 text-[#d4b483] sm:hidden">~$</span>
      <span className="shrink-0 font-medium text-[#d4b483]">:</span>
      <input
        ref={inputRef}
        className="min-w-0 flex-1 bg-transparent text-[#e8e8ea] outline-none placeholder:text-[#4a4a52] caret-[#d4b483]"
        value={props.commandValue}
        onChange={(e) => props.onCommandChange(e.target.value)}
        onKeyDown={handleKey}
        onFocus={props.onCommandFocus}
        onBlur={props.onCommandBlur}
        placeholder={
          props.placeholder ??
          (props.cliMode
            ? "type a command, use ↑/↓ history, 1-5, or :help"
            : "type a command, or ? for the list")
        }
        spellCheck={false}
        autoComplete="off"
      />
      {props.actions ? <div className="flex shrink-0 items-center">{props.actions}</div> : null}
      {props.toast ? (
        <motion.span
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          className="hidden whitespace-nowrap text-[11px] text-[#c27070] md:inline"
        >
          {props.toast}
        </motion.span>
      ) : (
        !props.actions && (
          <div className="hidden items-center gap-3 text-[10px] tracking-[0.08em] text-[#7c7c85] md:flex">
            <span>{props.time}</span>
            <span className="text-[#4a4a52]">|</span>
            <span>
              <span className="text-[#ffddc0]">?</span> help
            </span>
            <span className="text-[#4a4a52]">|</span>
            <span>
              <span className="text-[#ffddc0]">{props.cliMode ? "exit" : "~"}</span>{" "}
              {props.cliMode ? "unified" : "GUI"}
            </span>
          </div>
        )
      )}
    </>
  );

  return (
    <div className="pointer-events-auto w-full overflow-hidden border border-[#242428] bg-[#070708]/96 backdrop-blur-lg">
      {animate ? (
        <motion.div
          initial={{ clipPath: "inset(0 50% 0 50%)" }}
          animate={{ clipPath: "inset(0 0% 0 0%)" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className={rowClass}
        >
          {inner}
        </motion.div>
      ) : (
        <div className={rowClass}>{inner}</div>
      )}
    </div>
  );
}
