"use client";

import { motion } from "framer-motion";
import ProjectsLog from "../components/ProjectsLog";

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
    <motion.div variants={stagger} initial="hidden" animate="show" className="w-full text-[13px]">
      <motion.div
        variants={fadeUp}
        className="mb-6 flex items-center gap-2 border-b border-[#16161a] pb-4 text-[12px]"
      >
        <span className="text-[#ffddc0]">❯ git log --oneline --graph ~/projects</span>
      </motion.div>
      <motion.div variants={fadeUp}>
        <ProjectsLog density="cli" />
      </motion.div>
    </motion.div>
  );
}
