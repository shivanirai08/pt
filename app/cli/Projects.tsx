"use client";

import { motion } from "framer-motion";
import { projects } from "../data";

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

export default function CLIProjects() {
  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="show"
      className="max-w-[1040px] mx-auto text-[13px]"
    >
      <motion.div
        variants={fadeUp}
        className="flex items-center gap-2 pb-4 mb-6 border-b border-[#16161a] text-[12px]"
      >
        <span className="text-[#ffddc0]">
          ❯ git log --oneline --graph ~/projects
        </span>
      </motion.div>

      <div className="space-y-0">
        {projects.map((p, i) => {
          const isHead = p.head;
          const isLast = i === projects.length - 1;
          return (
            <motion.div
              key={p.id}
              variants={fadeUp}
              className="group grid grid-cols-[20px_1fr] gap-6 cursor-pointer"
            >
              {/* Graph line */}
              <div className="flex flex-col items-center pt-1">
                <div
                  className={
                    isHead
                      ? "w-3 h-3 rounded-full bg-[#ffddc0] border-2 border-[#ffddc0] shrink-0"
                      : p.status === "archived"
                      ? "w-3 h-3 rounded-full border border-[#4a4a52] shrink-0"
                      : "w-3 h-3 rounded-full bg-[#c3c7f4] border-2 border-[#c3c7f4] shrink-0"
                  }
                />
                {!isLast && (
                  <div className="w-[2px] flex-1 bg-[#222] mt-1 min-h-[20px]" />
                )}
              </div>

              {/* Content */}
              <div className="pb-8">
                <div className="flex items-center gap-3 mb-1.5">
                  <span
                    className={
                      "text-[15px] font-bold " +
                      (isHead ? "text-[#ffddc0]" : "text-[#c3c7f4]")
                    }
                  >
                    {p.name}
                  </span>
                  <span className="text-[12px] text-[#555]">{p.date}</span>
                  {isHead && (
                    <span className="text-[12px] bg-[#1a1a2e] border border-[rgba(63,185,80,0.27)] text-[#3fb950] px-2 py-0.5">
                      HEAD
                    </span>
                  )}
                </div>
                <p className="text-[12px] text-[#888] mb-4 leading-relaxed">
                  {p.excerpt}
                </p>

                {/* Project preview placeholder + details */}
                <div className="grid grid-cols-[1fr_300px] gap-6">
                  <div className="bg-[#111] border border-[#222] h-[150px] flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-[16px] text-[#1a1a2e]">
                        {p.name.replace("feat: ", "")}
                      </div>
                      <div className="text-[11px] text-[#222]">
                        [ project screenshot ]
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="flex flex-wrap gap-1 mb-4">
                      {p.stack.map((s) => (
                        <span
                          key={s}
                          className="text-[12px] text-[#c3c7f4] border border-[#333] px-2 py-0.5"
                        >
                          [{s}]
                        </span>
                      ))}
                    </div>
                    <div className="text-[12px] text-[#888] space-y-1 mb-4">
                      {p.description.split(". ").map((line, i) => (
                        <p key={i} className="leading-[19px]">
                          {line}
                          {!line.endsWith(".") && "."}
                        </p>
                      ))}
                    </div>
                    <div className="flex items-center gap-4 text-[12px]">
                      {p.links.map((l) => (
                        <a
                          key={l.label}
                          href={l.url}
                          className="text-[#c3c7f4] border-b border-[#c3c7f4] hover:text-[#e8e8ea] transition-colors"
                        >
                          → {l.label}
                        </a>
                      ))}
                      <span className="text-[#555]">★ 142</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
