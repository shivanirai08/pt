"use client";

import { motion } from "framer-motion";
import { experience, stats, certifications } from "../data";

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" as const } },
};

export default function CLIExperience() {
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
        <span className="text-[#7c7c85]">&gt;</span>
        <span className="text-[#e8e8ea]">cat</span>
        <span className="text-[#a8a8ad]">CHANGELOG.md</span>
        <span className="flex-1" />
        <span className="text-[10.5px] text-[#4a4a52] tracking-widest">
          type <span className="text-[#d4b483]">:cv</span> to download full
          resume
        </span>
      </motion.div>

      <div className="grid grid-cols-[1fr_260px] gap-10">
        <div>
          {experience.map((e, i) => (
            <motion.div
              key={e.version}
              variants={fadeUp}
              className="mb-9 relative"
            >
              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-[16px] text-[#d4b483] font-medium">
                  ## [{e.version}]
                </span>
                <span className="text-[12px] text-[#7c7c85]">{e.range}</span>
                {i === 0 && (
                  <span className="text-[10px] bg-[#8fb88f] text-[#0a0a0b] px-1.5 py-0.5 font-medium">
                    CURRENT
                  </span>
                )}
              </div>
              <div className="text-[14px] text-[#e8e8ea] mb-3">
                {e.role}{" "}
                {e.company && (
                  <span className="text-[#7c7c85]">— {e.company}</span>
                )}
              </div>
              {e.achievements.length > 0 && (
                <ul className="space-y-1.5 pl-2">
                  {e.achievements.map((a) => (
                    <li key={a} className="flex gap-3 text-[#a8a8ad]">
                      <span className="text-[#8fb88f] shrink-0">+</span>
                      <span>{a}</span>
                    </li>
                  ))}
                </ul>
              )}
            </motion.div>
          ))}
        </div>

        <motion.aside variants={fadeUp} className="space-y-6">
          <div className="border border-[#242428] p-5 bg-[#111114]">
            <div className="text-[10.5px] text-[#7c7c85] tracking-[0.2em] mb-4">
              <span className="text-[#d4b483]">&gt;</span> wc --lines career
            </div>
            <div className="space-y-4">
              <Stat label="YEARS ACTIVE" value={stats.yearsActive} />
              <Stat label="PROJECTS SHIPPED" value={stats.projectsShipped} />
              <Stat label="YEARS LED" value={String(stats.yearsLed)} />
            </div>
          </div>

          <div className="border border-[#242428] p-5 bg-[#111114]">
            <div className="text-[10.5px] text-[#7c7c85] tracking-[0.2em] mb-3">
              CERTIFICATIONS
            </div>
            <ul className="space-y-1.5 text-[12px]">
              {certifications.map((c) => (
                <li key={c} className="flex gap-2 text-[#a8a8ad]">
                  <span className="text-[#d4b483]">—</span>
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </div>
        </motion.aside>
      </div>
    </motion.div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] text-[#7c7c85] tracking-[0.18em] mb-1">
        {label}
      </div>
      <div className="text-[28px] text-[#e8e8ea] leading-none tracking-tight">
        {value}
      </div>
    </div>
  );
}
