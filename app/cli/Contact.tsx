"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { personal, socials } from "../data";
import { Mail, FileText } from "lucide-react";

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" as const } },
};

export default function CLIContact() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    message: "",
  });

  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="show"
      className="max-w-[720px] mx-auto text-[13px]"
    >
      <motion.div
        variants={fadeUp}
        className="flex items-center gap-2 pb-4 mb-6 border-b border-[#16161a] text-[12px]"
      >
        <span className="text-[#7c7c85]">&gt;</span>
        <span className="text-[#e8e8ea]">ssh</span>
        <span className="text-[#a8a8ad]">connect@shivani.dev</span>
      </motion.div>

      <motion.div variants={fadeUp} className="space-y-2 mb-8 text-[12.5px]">
        <BootLine label="Connecting to shivani.dev" />
        <BootLine label="Verifying host key" />
        <BootLine label="Authenticating" />
        <BootLine label="Connection established" final />
      </motion.div>

      <motion.p
        variants={fadeUp}
        className="text-[#a8a8ad] text-[13px] leading-[1.75] mb-6"
      >
        Welcome! I&apos;m always open to interesting conversations about
        frontend, design systems, or your next project.
      </motion.p>

      <motion.div
        variants={fadeUp}
        className="grid grid-cols-2 gap-4 text-[11.5px] pb-6 mb-6 border-b border-[#242428]"
      >
        <div>
          <div className="text-[10px] text-[#7c7c85] tracking-[0.18em] mb-1">
            RESPONSE TIME
          </div>
          <div className="text-[#e8e8ea]">{personal.responseTime}</div>
        </div>
        <div>
          <div className="text-[10px] text-[#7c7c85] tracking-[0.18em] mb-1">
            TIMEZONE
          </div>
          <div className="text-[#e8e8ea]">{personal.timezone}</div>
        </div>
      </motion.div>

      {/* Contact form */}
      <motion.div variants={fadeUp} className="space-y-4 mb-8">
        <div>
          <label className="text-[12px] text-[#7c7c85] mb-1 block">
            &gt; Your Name
          </label>
          <input
            type="text"
            value={formState.name}
            onChange={(e) =>
              setFormState({ ...formState, name: e.target.value })
            }
            placeholder="type here..."
            className="w-full bg-[#0a0a0b] border-2 border-[#FFFFFF] text-[#e8e8ea] text-[14px] py-3 px-4 placeholder:text-[#4a4a52] focus:border-[#FFDDC0] focus:shadow-[0_0_10px_rgba(255,221,192,0.2)] outline-none transition-all"
          />
        </div>
        <div>
          <label className="text-[12px] text-[#7c7c85] mb-1 block">
            &gt; Your Email
          </label>
          <input
            type="email"
            value={formState.email}
            onChange={(e) =>
              setFormState({ ...formState, email: e.target.value })
            }
            placeholder="type here..."
            className="w-full bg-[#0a0a0b] border-2 border-[#FFFFFF] text-[#e8e8ea] text-[14px] py-3 px-4 placeholder:text-[#4a4a52] focus:border-[#FFDDC0] focus:shadow-[0_0_10px_rgba(255,221,192,0.2)] outline-none transition-all"
          />
        </div>
        <div>
          <label className="text-[12px] text-[#7c7c85] mb-1 block">
            &gt; Message
          </label>
          <textarea
            value={formState.message}
            onChange={(e) =>
              setFormState({ ...formState, message: e.target.value })
            }
            rows={4}
            placeholder="type here..."
            className="w-full bg-[#0a0a0b] border-2 border-[#FFFFFF] text-[#e8e8ea] text-[14px] py-3 px-4 placeholder:text-[#4a4a52] focus:border-[#FFDDC0] focus:shadow-[0_0_10px_rgba(255,221,192,0.2)] outline-none transition-all resize-none"
          />
        </div>
      </motion.div>

      <motion.div variants={fadeUp} className="flex items-center gap-3 mb-10">
        <a
          href={`mailto:${personal.email}`}
          className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 border-2 border-[#FFFFFF] bg-transparent px-6 py-3 text-[14px] font-medium leading-none text-[#FFFFFF] transition-colors hover:bg-[#FFFFFF] hover:text-[#000000]"
        >
          <Mail size={14} /> Send Email →
        </a>
        <a
          href="#"
          className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 border-2 border-[#FFFFFF] bg-transparent px-6 py-3 text-[14px] leading-none text-[#FFFFFF] transition-colors hover:bg-[#FFFFFF] hover:text-[#000000]"
        >
          <FileText size={14} /> View Resume
        </a>
      </motion.div>

      <motion.div
        variants={fadeUp}
        className="flex items-center justify-center gap-6 text-[12px] text-[#7c7c85] pb-4"
      >
        {socials.map((s) => (
          <a
            key={s.name}
            href={s.url}
            target="_blank"
            rel="noreferrer"
            className="hover:text-[#e8e8ea] transition-colors"
          >
            {s.name}
          </a>
        ))}
      </motion.div>
    </motion.div>
  );
}

function BootLine({ label, final }: { label: string; final?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-[#a8a8ad] flex-1">{label}...</span>
      <span className={final ? "text-[#3fb950]" : "text-[#8fb88f]"}>
        {final ? "✓ OK" : "OK"}
      </span>
    </div>
  );
}
