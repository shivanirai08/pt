"use client";

import { motion } from "framer-motion";
import SkillsProcessTable from "../components/SkillsProcessTable";

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
    <motion.div variants={stagger} initial="hidden" animate="show" className="w-full">
      <motion.div variants={fadeUp}>
        <SkillsProcessTable />
      </motion.div>
    </motion.div>
  );
}
