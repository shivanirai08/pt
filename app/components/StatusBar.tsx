"use client";

import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";

type Props = {
  commandMode: boolean;
  commandValue: string;
  onCommandChange: (v: string) => void;
  onCommandSubmit: () => void;
  onCommandCancel: () => void;
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
      props.onCommandSubmit();
    }
    if (e.key === "Escape") {
      e.preventDefault();
      props.onCommandCancel();
    }
  };

  if (props.commandMode) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="border-t border-[#242428] px-6 h-9 text-[12px] flex items-center bg-[#0a0a0b]"
      >
        <span className="text-[#d4b483] mr-1 font-medium">:</span>
        <input
          ref={inputRef}
          className="bg-transparent outline-none text-[#e8e8ea] flex-1 placeholder:text-[#4a4a52] caret-[#d4b483]"
          value={props.commandValue}
          onChange={(e) => props.onCommandChange(e.target.value)}
          onKeyDown={handleKey}
          placeholder="type a command — enter to run, esc to cancel"
        />
        <span className="text-[10px] text-[#4a4a52] tracking-widest ml-3">
          COMMAND
        </span>
      </motion.div>
    );
  }

  return (
    <div className="border-t border-[#242428] px-6 h-9 text-[11.5px] flex items-center gap-4 text-[#7c7c85] bg-[#0a0a0b]">
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
        <span>
          <span className="text-[#d4b483]">:help</span> for commands · press{" "}
          <kbd className="bg-[#1d1d22] px-1.5 py-0.5 text-[10px] text-[#e8e8ea]">
            ~
          </kbd>{" "}
          for GUI
        </span>
      )}
    </div>
  );
}
