"use client";

import { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, X } from "lucide-react";

type Props = { open: boolean; onClose: () => void };

export default function HelpOverlay({ open, onClose }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [showCommandList, setShowCommandList] = useState(false);

  useEffect(() => {
    if (open) {
      const handler = (e: KeyboardEvent) => {
        if (e.key === "Escape" || e.key.toLowerCase() === "q") onClose();
      };
      window.addEventListener("keydown", handler);
      return () => window.removeEventListener("keydown", handler);
    }
  }, [open, onClose]);

  const sections = [
    {
      title: "Page navigation",
      items: [
        { key: "1-5", desc: "jump between About, Projects, Experience, Skills, and Contact" },
        { key: "← / →", desc: "move through sections in order" },
        { key: ":", desc: "open the command bar" },
        { key: "~", desc: "switch to GUI mode" },
      ],
    },
    {
      title: "Hot keys",
      items: [
        { key: "?", desc: "open this help" },
        { key: "Esc", desc: "close any modal or popup" },
        { key: "Q", desc: "close this modal" },
      ],
    },
  ] as const;

  const commandItems = [
    { key: ":about", desc: "open About section" },
    { key: ":projects", desc: "open Projects section" },
    { key: ":experience", desc: "open Experience section" },
    { key: ":skills", desc: "open Skills section" },
    { key: ":contact", desc: "open Contact section" },
    { key: ":email", desc: "shortcut to Contact section" },
    { key: ":cv / :resume", desc: "trigger CV download action" },
    { key: ":github", desc: "open GitHub profile" },
    { key: ":help", desc: "open this help popup" },
    { key: ":gui", desc: "switch to GUI mode" },
  ] as const;

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
            className="w-full max-w-[760px] overflow-hidden border border-[#3a3a40] bg-[#151519] text-[13px] shadow-2xl shadow-black/50"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#2a2a30] px-7 py-5">
              <div className="flex items-center gap-3">
                <span className="text-[14px] font-medium text-[#e8e8ea]">Help</span>
                <span className="text-[#4a4a52]">│</span>
                <span className="text-[12px] text-[#9a9aa1]">command reference</span>
              </div>
              <button
                onClick={onClose}
                className="flex items-center gap-2 text-[#a8a8ad] transition-colors hover:text-[#e8e8ea]"
                aria-label="Close help"
              >
                <span className="text-[11px] uppercase tracking-[0.14em] text-[#7c7c85]">
                  [Q] close
                </span>
                <X size={16} />
              </button>
            </div>

            <div className="space-y-7 px-7 py-6">
              {sections.map((section) => (
                <CmdSection key={section.title} title={section.title} items={section.items} />
              ))}

              <div className="">
                <button
                  type="button"
                  onClick={() => setShowCommandList((value) => !value)}
                  className="flex w-full items-center justify-between py-3 text-left transition-colors hover:bg-[#101013] cursor-pointer"
                  aria-expanded={showCommandList}
                >
                  <span className="text-[11px] uppercase tracking-[0.18em] text-[#d4b483]">
                    CLI command options
                  </span>
                  <ChevronDown
                    size={15}
                    className={
                      "text-[#7c7c85] transition-transform duration-200 " +
                      (showCommandList ? "rotate-180" : "rotate-0")
                    }
                  />
                </button>

                <AnimatePresence initial={false}>
                  {showCommandList ? (
                    <motion.div
                      key="help-command-list"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="overflow-hidden border-t border-[#2a2a30]"
                    >
                      <div className="grid grid-cols-1 gap-1.5 py-3 text-[12px]">
                        {commandItems.map((item) => (
                          <div key={item.key} className="flex items-baseline gap-4">
                            <span className="w-[160px] shrink-0 text-[#d7d7dc]">{item.key}</span>
                            <span className="flex-1 text-[#9a9aa1]">{item.desc}</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            </div>

            <div className="border-t border-[#2a2a30] bg-[#101013] px-7 py-4 text-[11.5px] text-[#a8a8ad]">
              <div className="flex flex-wrap items-center gap-2 leading-6">
                <span className="text-[#7c7c85]">Tip:</span>
                <span className="text-[#d7d7dc]">
                  use
                  <kbd className="mx-1 inline-flex min-w-6 justify-center border border-[#34343a] bg-[#1a1a1f] px-1.5 py-0.5 text-[10px] text-[#f0f0f2]">
                    ←
                  </kbd>
                  /
                  <kbd className="mx-1 inline-flex min-w-6 justify-center border border-[#34343a] bg-[#1a1a1f] px-1.5 py-0.5 text-[10px] text-[#f0f0f2]">
                    →
                  </kbd>
                  ,
                  <kbd className="mx-1 inline-flex min-w-6 justify-center border border-[#34343a] bg-[#1a1a1f] px-1.5 py-0.5 text-[10px] text-[#f0f0f2]">
                    1-5
                  </kbd>
                  , or
                  <kbd className="mx-1 inline-flex min-w-6 justify-center border border-[#34343a] bg-[#1a1a1f] px-1.5 py-0.5 text-[10px] text-[#f0f0f2]">
                    :help
                  </kbd>
                </span>
                <span className="mx-2 text-[#4a4a52]">·</span>
                <span className="text-[#d7d7dc]">
                  press
                  <kbd className="mx-1 inline-flex min-w-6 justify-center border border-[#5a4630] bg-[#241b12] px-1.5 py-0.5 text-[10px] text-[#ffddc0]">
                    ~
                  </kbd>
                  for GUI
                </span>
              </div>
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
  items: readonly { key: string; desc: string }[];
}) {
  return (
    <div>
      <div className="mb-3 text-[11px] uppercase tracking-[0.18em] text-[#d4b483]">
        {title}
      </div>
      <div className="grid grid-cols-1 gap-1.5">
        {items.map((item) => (
          <div key={item.key} className="flex items-baseline gap-6">
            <span className="w-[142px] shrink-0 text-[#d7d7dc]">{item.key}</span>
            <span className="flex-1 text-[#9a9aa1]">{item.desc}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
