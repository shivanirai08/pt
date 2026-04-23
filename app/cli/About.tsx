"use client";

import { motion } from "framer-motion";
import { personal } from "../data";

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" as const } },
};

export default function CLIAbout() {
  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="show"
      className="max-w-[960px] mx-auto text-[13.5px] leading-[1.75]"
    >
      <motion.pre
        variants={fadeUp}
        className="text-[11px] text-[#4a4a52] tracking-[0.3em] mb-4"
      >
        FRONTEND(7)            Developer Manual            FRONTEND(7)
      </motion.pre>

      <Section label="NAME">
        <span className="text-[#e8e8ea]">{personal.name.toLowerCase()}</span>
        <span className="text-[#7c7c85]">
          {" "}
          — {personal.tagline}. Specializing in turning design visions into
          production-ready, pixel-perfect UIs.
        </span>
      </Section>

      <Section label="SYNOPSIS">
        <span className="text-[#89b4e8]">{personal.synopsis}</span>
      </Section>

      <Section label="DESCRIPTION">
        <span className="text-[#a8a8ad]">{personal.description}</span>
      </Section>

      <Section label="ENVIRONMENT">
        <div className="pl-0 text-[#a8a8ad]">
          <EnvLine k="$LOCATION" value={personal.location} />
          <EnvLine k="$EDITOR" value={personal.editor} />
          <EnvLine k="$AVAILABLE" value={personal.availability} />
          <EnvLine k="$TIMEZONE" value={personal.timezone} />
        </div>
      </Section>

      <Section label="SEE ALSO">
        <span className="text-[#89b4e8] hover:text-[#b4cffb] cursor-pointer transition-colors">
          projects(2)
        </span>
        <span className="text-[#7c7c85]">, </span>
        <span className="text-[#89b4e8] hover:text-[#b4cffb] cursor-pointer transition-colors">
          experience(3)
        </span>
        <span className="text-[#7c7c85]">, </span>
        <span className="text-[#89b4e8] hover:text-[#b4cffb] cursor-pointer transition-colors">
          skills(4)
        </span>
        <span className="text-[#7c7c85]">, </span>
        <span className="text-[#89b4e8] hover:text-[#b4cffb] cursor-pointer transition-colors">
          contact(5)
        </span>
      </Section>
    </motion.div>
  );
}

function Section({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div variants={fadeUp} className="mb-5">
      <div className="text-[11px] text-[#7c7c85] tracking-[0.22em] font-medium mb-1">
        {label}
      </div>
      <div className="pl-6">{children}</div>
    </motion.div>
  );
}

function EnvLine({ k, value }: { k: string; value: string }) {
  return (
    <div className="flex gap-3">
      <span className="text-[#d4b483]">{k}</span>
      <span className="text-[#4a4a52]">=</span>
      <span className="text-[#a8a8ad]">{value}</span>
    </div>
  );
}
