"use client";

import { useRef, useEffect } from "react";
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

  return (
    <div className="border-t border-[#242428] bg-[#070708]/98 backdrop-blur">
      {props.commandMode ? (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex h-12 items-center gap-3 border-b border-[#1a1a1d] bg-[#0d0d10] px-6 text-[12px]"
        >
          <span className="text-[#d4b483]">shivanirai@portfolio:~$</span>
          <span className="text-[#d4b483] font-medium">:</span>
          <input
            ref={inputRef}
            className="flex-1 bg-transparent text-[#e8e8ea] outline-none placeholder:text-[#4a4a52] caret-[#d4b483]"
            value={props.commandValue}
            onChange={(e) => props.onCommandChange(e.target.value)}
            onKeyDown={handleKey}
            placeholder="type a command and press enter"
          />
          <span className="ml-3 text-[10px] tracking-widest text-[#4a4a52]">
            COMMAND
          </span>
        </motion.div>
      ) : null}

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
          <span>
            <span className="text-[#d4b483]">:help</span> for commands · press{" "}
            <kbd className="bg-[#1d1d22] px-1.5 py-0.5 text-[10px] text-[#e8e8ea]">
              ~
            </kbd>{" "}
            for GUI
          </span>
        )}
      </div>
    </div>
  );
}
