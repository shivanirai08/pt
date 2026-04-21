"use client";

import { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { commands } from "../data";
import { X } from "lucide-react";

type Props = { open: boolean; onClose: () => void };

export default function HelpOverlay({ open, onClose }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      const handler = (e: KeyboardEvent) => {
        if (e.key === "Escape") onClose();
      };
      window.addEventListener("keydown", handler);
      return () => window.removeEventListener("keydown", handler);
    }
  }, [open, onClose]);

  const nav = commands.filter((c) =>
    /about|projects|experience|skills|contact/.test(c.cmd)
  );
  const actions = commands.filter((c) =>
    /help|email|cv|github|gui/.test(c.cmd)
  );

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-6"
          onClick={onClose}
        >
          <motion.div
            ref={ref}
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="bg-[#111114] border border-[#2a2a2e] w-full max-w-[760px] text-[13px] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-7 py-5 border-b border-[#242428]">
              <div className="flex items-center gap-3">
                <span className="text-[#d4b483] text-[14px] font-medium">
                  :help
                </span>
                <span className="text-[#4a4a52]">│</span>
                <span className="text-[#7c7c85] text-[12px]">
                  command reference
                </span>
              </div>
              <button
                onClick={onClose}
                className="text-[#7c7c85] hover:text-[#e8e8ea] transition-colors"
                aria-label="Close help"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-7 space-y-6">
              <CmdSection title="Navigation" items={nav} />
              <CmdSection title="Actions" items={actions} />
            </div>

            <div className="px-7 py-4 border-t border-[#242428] text-[11.5px] text-[#7c7c85] bg-[#0d0d10] flex items-center justify-between">
              <span>
                tip: press digits{" "}
                <kbd className="bg-[#1d1d22] px-1.5 py-0.5 text-[10px] text-[#e8e8ea] mx-0.5">
                  1
                </kbd>
                –
                <kbd className="bg-[#1d1d22] px-1.5 py-0.5 text-[10px] text-[#e8e8ea] mx-0.5">
                  5
                </kbd>{" "}
                to switch tabs, or{" "}
                <kbd className="bg-[#1d1d22] px-1.5 py-0.5 text-[10px] text-[#e8e8ea] mx-0.5">
                  :
                </kbd>{" "}
                to open the command bar.
              </span>
              <span className="text-[#4a4a52]">
                <kbd className="bg-[#1d1d22] px-1.5 py-0.5 text-[10px] text-[#e8e8ea]">
                  esc
                </kbd>{" "}
                to close
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function CmdSection({
  title,
  items,
}: {
  title: string;
  items: { cmd: string; desc: string }[];
}) {
  return (
    <div>
      <div className="text-[#7c7c85] text-[11px] tracking-[0.18em] uppercase mb-3">
        {title}
      </div>
      <div className="grid grid-cols-1 gap-1.5">
        {items.map((c) => (
          <div key={c.cmd} className="flex gap-6 items-baseline">
            <span className="w-[200px] text-[#89b4e8]">{c.cmd}</span>
            <span className="text-[#a8a8ad] flex-1">{c.desc}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
