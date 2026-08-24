"use client";

import { motion } from "framer-motion";
import { usePortfolio } from "../context/PortfolioContext";

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" as const } },
};

export default function CLIExperience() {
  const { experience } = usePortfolio();
  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="show"
      className="w-full text-[13px]"
    >
      <motion.div
        variants={fadeUp}
        className="flex items-center gap-2 pb-4 mb-6 border-b border-[#16161a] text-[12px]"
      >
        <span className="text-[#7c7c85]">&gt;</span>
        <span className="text-[#e8e8ea]">cat</span>
        <span className="text-[#a8a8ad]">CHANGELOG.md</span>
      </motion.div>

      <div>
        {experience.map((e, i) => (
          <motion.div key={e.version} variants={fadeUp} className="relative mb-12">
            <div className="mb-3 flex flex-wrap items-baseline gap-3">
              <span className="text-[16px] font-medium text-[#d4b483]">## [{e.version}]</span>
              <span className="text-[12px] text-[#7c7c85]">{e.range}</span>
              {i === 0 && (
                <span className="bg-[#8fb88f] px-1.5 py-0.5 text-[10px] font-medium tracking-wide text-[#0a0a0b]">
                  LATEST
                </span>
              )}
            </div>
            <div className="mb-4 text-[15px] leading-relaxed text-[#e8e8ea]">
              {e.role}{" "}
              {e.company && <span className="text-[#7c7c85]">— {e.company}</span>}
            </div>
            {e.achievements.length > 0 && (
              <ul className="space-y-3 pl-2">
                {e.achievements.map((a) => (
                  <li key={a} className="flex max-w-[96%] gap-3 leading-[1.9] text-[#a8a8ad]">
                    <span className="shrink-0 text-[#8fb88f]">+</span>
                    <span>{a}</span>
                  </li>
                ))}
              </ul>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
