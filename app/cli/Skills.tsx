"use client";

import { motion } from "framer-motion";
import { skills, secondaryTools } from "../data";

const BAR_WIDTH = 22;

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" as const } },
};

export default function CLISkills() {
  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="show"
      className="max-w-[980px] mx-auto text-[13px]"
    >
      <motion.div
        variants={fadeUp}
        className="flex items-center gap-2 pb-4 mb-8 border-b border-[#16161a] text-[12px]"
      >
        <span className="text-[#7c7c85]">&gt;</span>
        <span className="text-[#e8e8ea]">man</span>
        <span className="text-[#a8a8ad]">shivani.skills</span>
      </motion.div>

      <div className="grid grid-cols-[1fr_320px] gap-10">
        <div>
          <motion.div
            variants={fadeUp}
            className="text-[11px] text-[#7c7c85] tracking-[0.22em] mb-4"
          >
            OPTIONS (Skills)
          </motion.div>

          <div className="space-y-2.5">
            {skills.map((s) => {
              const filled = Math.round(s.level * BAR_WIDTH);
              return (
                <motion.div
                  key={s.name}
                  variants={fadeUp}
                  className="grid grid-cols-[140px_1fr_160px] gap-5 items-center"
                >
                  <span className="text-[#d4b483]">--{s.name}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-[#89b4e8] font-medium tracking-tighter">
                      {"█".repeat(filled)}
                    </span>
                    <span className="text-[#242428] tracking-tighter">
                      {"█".repeat(BAR_WIDTH - filled)}
                    </span>
                  </div>
                  <div className="text-[11.5px] text-[#7c7c85]">
                    <span className="text-[#a8a8ad]">{s.years} yrs</span>
                    <span className="mx-1.5 text-[#4a4a52]">·</span>
                    <span>{s.projects} projects</span>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <motion.div
            variants={fadeUp}
            className="mt-10 pt-6 border-t border-[#16161a]"
          >
            <div className="text-[11px] text-[#7c7c85] tracking-[0.22em] mb-4">
              ALSO PROFICIENT IN
            </div>
            <div className="flex flex-wrap gap-1.5">
              {secondaryTools.map((t) => (
                <span
                  key={t}
                  className="text-[12px] text-[#a8a8ad] bg-[#1d1d22] border border-[#242428] px-2 py-1"
                >
                  [{t}]
                </span>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.aside variants={fadeUp} className="space-y-5 text-[12px]">
          <div className="border border-[#242428] p-5 bg-[#111114]">
            <div className="text-[10.5px] text-[#7c7c85] tracking-[0.2em] mb-3">
              NOTE
            </div>
            <p className="text-[#a8a8ad] leading-relaxed">
              Bars show relative experience — not a self-rated percentage. Real
              signal is in the{" "}
              <span className="text-[#d4b483]">years</span> and{" "}
              <span className="text-[#d4b483]">projects</span> columns.
            </p>
          </div>

          <div className="border border-[#242428] p-5 bg-[#111114]">
            <div className="text-[10.5px] text-[#7c7c85] tracking-[0.2em] mb-3">
              CURRENTLY LEARNING
            </div>
            <ul className="space-y-1.5 text-[#a8a8ad]">
              <li className="flex gap-2">
                <span className="text-[#d4b483]">▸</span> Rust (for tooling)
              </li>
              <li className="flex gap-2">
                <span className="text-[#d4b483]">▸</span> Server Components
              </li>
              <li className="flex gap-2">
                <span className="text-[#d4b483]">▸</span> WebGPU compute
              </li>
            </ul>
          </div>
        </motion.aside>
      </div>
    </motion.div>
  );
}
