"use client";

import { motion, AnimatePresence } from "framer-motion";

type Props = {
  mode: "gui" | "cli";
  onToggle: () => void;
};

export default function ModeToggle({ mode, onToggle }: Props) {
  return (
    <div
      className="inline-flex items-center bg-[#111114] border border-[#242428] p-[3px] text-[11px] tracking-[0.14em] font-medium select-none"
      title="Press ~ to toggle"
    >
      <button
        onClick={() => mode === "cli" && onToggle()}
        className={
          mode === "gui"
            ? "px-3 py-1 bg-[#d4b483] text-[#0a0a0b] transition-colors duration-150"
            : "px-3 py-1 text-[#7c7c85] hover:text-[#e8e8ea] transition-colors duration-150"
        }
      >
        GUI
      </button>
      <button
        onClick={() => mode === "gui" && onToggle()}
        className={
          mode === "cli"
            ? "px-3 py-1 bg-[#d4b483] text-[#0a0a0b] transition-colors duration-150"
            : "px-3 py-1 text-[#7c7c85] hover:text-[#e8e8ea] transition-colors duration-150"
        }
      >
        CLI
      </button>
      <span className="ml-2 mr-2 text-[#4a4a52] text-[10px]">~</span>
    </div>
  );
}
