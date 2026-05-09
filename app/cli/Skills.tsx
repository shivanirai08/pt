"use client";

import { motion } from "framer-motion";
import { skills } from "../data";

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" as const } },
};

export default function CLISkills() {
  const rows = [
    { pid: "01", skill: "--react", years: "4y 08m", projects: "24", state: "RUNNING" },
    { pid: "02", skill: "--typescript", years: "3y 02m", projects: "18", state: "RUNNING" },
    { pid: "03", skill: "--css", years: "4y 00m", projects: "22", state: "RUNNING" },
    { pid: "04", skill: "--javascript", years: "4y 00m", projects: "24", state: "RUNNING" },
    { pid: "05", skill: "--tailwind", years: "3y 00m", projects: "18", state: "RUNNING" },
    { pid: "06", skill: "--figma", years: "3y 06m", projects: "20", state: "RUNNING" },
    { pid: "07", skill: "--next.js", years: "2y 04m", projects: "9", state: "IDLE" },
    { pid: "08", skill: "--redux", years: "2y 02m", projects: "12", state: "IDLE" },
    { pid: "09", skill: "--socket.io", years: "2y 01m", projects: "8", state: "IDLE" },
    { pid: "97", skill: "--three.js", years: "0y 06m", projects: "1", state: "LEARNING" },
    { pid: "98", skill: "--rust", years: "0y 03m", projects: "-", state: "LEARNING" },
    { pid: "99", skill: "--webgpu", years: "0y 00m", projects: "-", state: "LEARNING" },
  ];

  const runningCount = rows.filter((r) => r.state === "RUNNING").length;
  const learningCount = rows.filter((r) => r.state === "LEARNING").length;

  const stateClass = (state: string) => {
    if (state === "RUNNING") return "text-[#3fb950]";
    if (state === "LEARNING") return "text-[#d4b483]";
    return "text-[#8b8b92]";
  };

  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="show"
      className="max-w-[1040px] mx-auto text-[13px]"
    >
      <motion.div
        variants={fadeUp}
        className="flex items-center gap-2 pb-4 mb-5 border-b border-[#16161a] text-[12px]"
      >
        <span className="text-[#7c7c85]">&gt;</span>
        <span className="text-[#e8e8ea]">skills</span>
        <span className="text-[#3fb950]">--watch</span>
      </motion.div>

      <motion.div variants={fadeUp} className="mb-3 text-[12px] text-[#555a64]">
        top · 17:38 · uptime 4y 280d · <span className="text-[#d4b483]">{learningCount} learning</span> · <span className="text-[#3fb950]">{runningCount} running</span> · 0 zombies
      </motion.div>
      <motion.div variants={fadeUp} className="mb-4 text-[13px] text-[#8b8b92]">
        Tasks: <span className="text-[#d0d0d4]">{rows.length} total</span>, <span className="text-[#3fb950]">{runningCount} running</span>, <span className="text-[#d4b483]">{learningCount} learning</span>
        <span className="ml-4 text-[#666a73]">CPU usage mapped from project frequency x recency</span>
      </motion.div>

      <motion.div variants={fadeUp} className="rounded border border-[#242428] bg-[#111114] px-4 py-4">
        <div className="grid grid-cols-[52px_1.2fr_80px_80px_120px] gap-3 bg-[#1a1a1f] px-3 py-1.5 text-[12px] text-[#a8a8ad]">
          <span>PID</span>
          <span>SKILL</span>
          <span>TIME</span>
          <span>PROJECTS</span>
          <span>STATE</span>
        </div>

        <div className="space-y-0.5 px-3 py-1.5 text-[13px] text-[#2b2b31]">·</div>

        <div className="space-y-1 px-3 text-[13px] leading-[1.35]">
          {rows.slice(0, 9).map((row) => (
            <div key={row.pid} className="grid grid-cols-[52px_1.2fr_80px_80px_120px] gap-3 text-[#a8a8ad]">
              <span>{row.pid}</span>
              <span>{row.skill}</span>
              <span>{row.years}</span>
              <span>{row.projects}</span>
              <span className={stateClass(row.state)}>{row.state}</span>
            </div>
          ))}
        </div>

        <div className="space-y-0.5 px-3 py-1.5 text-[13px] text-[#2b2b31]">·</div>

        <div className="space-y-1 px-3 text-[13px] leading-[1.35]">
          {rows.slice(9).map((row) => (
            <div key={row.pid} className="grid grid-cols-[52px_1.2fr_80px_80px_120px] gap-3 text-[#a8a8ad]">
              <span>{row.pid}</span>
              <span>{row.skill}</span>
              <span>{row.years}</span>
              <span>{row.projects}</span>
              <span className={stateClass(row.state)}>{row.state}</span>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div
        variants={fadeUp}
        className="mt-8 flex items-center justify-between border-t border-[#16161a] pt-4 text-[12px]"
      >
        <div className="text-[#6b7078]">
          <span className="text-[#3fb950]">RUNNING</span> = used this quarter
          <span className="mx-2 text-[#3f434b]">·</span>
          <span className="text-[#8b8b92]">IDLE</span> = warm but not active
          <span className="mx-2 text-[#3f434b]">·</span>
          <span className="text-[#d4b483]">LEARNING</span> = ramping up
        </div>
        <div className="text-[#8b8b92]">
          refresh: <span className="text-[#d0d0d4]">2s</span>
        </div>
      </motion.div>
    </motion.div>
  );
}
