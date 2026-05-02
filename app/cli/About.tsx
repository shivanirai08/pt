"use client";

import { motion } from "framer-motion";
import { personal, socials, aboutStack, aboutPhilosophy, aboutCurrently, aboutEnv } from "../data";

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
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
      className="max-w-[1040px] mx-auto text-[13px]"
    >
      {/* command header */}
      <motion.div
        variants={fadeUp}
        className="flex items-center gap-2 pb-4 mb-6 border-b border-[#16161a] text-[12px]"
      >
        <span className="text-[#7c7c85]">&gt;</span>
        <span className="text-[#e8e8ea]">cat</span>
        <span className="text-[#a8a8ad]">about.md</span>
      </motion.div>

      <div className="grid grid-cols-[1fr_260px] gap-10">
        {/* ── LEFT COLUMN ── */}
        <div>
          {/* ~/identity block */}
          <motion.div variants={fadeUp} className="mb-8">
            <div className="text-[11px] text-[#7c7c85] tracking-[0.2em] mb-3">~/identity</div>
            <div className="border border-[#242428] bg-[#111114] p-4 space-y-1.5 text-[13px]">
              <IdentityRow k="name"      v={personal.fullName} />
              <IdentityRow k="role"      v={personal.role} highlight />
              <IdentityRow k="location"  v={`${personal.location} (${personal.timezone})`} />
              <IdentityRow k="pronouns"  v={personal.pronouns} />
              <IdentityRow k="status"    v={personal.status} dot />
            </div>
          </motion.div>

          {/* ## bio */}
          <motion.div variants={fadeUp} className="mb-8">
            <div className="text-[11px] text-[#7c7c85] tracking-[0.2em] mb-2">## bio</div>
            <p className="text-[#e8e8ea] leading-relaxed">{personal.bio}</p>
            <p className="text-[#a8a8ad] leading-relaxed mt-2">{personal.description}</p>
          </motion.div>

          {/* ## stack */}
          <motion.div variants={fadeUp} className="mb-8">
            <div className="text-[11px] text-[#7c7c85] tracking-[0.2em] mb-2">## stack</div>
            <div className="text-[12px] text-[#7c7c85] mb-3">
              <span className="text-[#8fb88f]">$</span> ls ~/stack/
            </div>
            <div className="space-y-1.5">
              {aboutStack.map((row) => (
                <div key={row.label} className="flex gap-4 text-[13px]">
                  <span className="text-[#89b4e8] w-[100px] shrink-0">{row.label}</span>
                  <span className="text-[#a8a8ad]">{row.items}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* ## philosophy */}
          <motion.div variants={fadeUp} className="mb-4">
            <div className="text-[11px] text-[#7c7c85] tracking-[0.2em] mb-3">## philosophy</div>
            <ul className="space-y-1.5">
              {aboutPhilosophy.map((line) => (
                <li key={line} className="flex gap-2 text-[#a8a8ad] text-[13px]">
                  <span className="text-[#8fb88f]">+</span>
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* ── RIGHT COLUMN ── */}
        <motion.aside variants={fadeUp} className="space-y-5">
          {/* FIND ME */}
          <div className="border border-[#242428] p-5 bg-[#111114]">
            <div className="text-[10.5px] text-[#7c7c85] tracking-[0.2em] mb-4">FIND ME</div>
            <ul className="space-y-2 text-[12px]">
              {socials.map((s) => (
                <li key={s.name} className="flex gap-2 items-baseline">
                  <span className="text-[#4a4a52]">—</span>
                  <span className="text-[#7c7c85] w-[52px] shrink-0">{s.name}</span>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#89b4e8] hover:text-[#b4cffb] transition-colors"
                  >
                    {s.handle}
                  </a>
                </li>
              ))}
              <li className="flex gap-2 items-baseline">
                <span className="text-[#4a4a52]">—</span>
                <span className="text-[#7c7c85] w-[52px] shrink-0">email</span>
                <a
                  href={`mailto:${personal.email}`}
                  className="text-[#89b4e8] hover:text-[#b4cffb] transition-colors"
                >
                  {personal.email}
                </a>
              </li>
            </ul>
            <div className="mt-3 text-[10.5px] text-[#4a4a52]">
              type <span className="text-[#d4b483]">contact</span> for the full reach-out form
            </div>
          </div>

          {/* CURRENTLY */}
          <div className="border border-[#242428] p-5 bg-[#111114]">
            <div className="text-[10.5px] text-[#7c7c85] tracking-[0.2em] mb-4">CURRENTLY</div>
            <div className="space-y-2.5 text-[12px]">
              <CurrentRow k="reading"   v={aboutCurrently.reading} />
              <CurrentRow k="building"  v={aboutCurrently.building} />
              <CurrentRow k="learning"  v={aboutCurrently.learning} />
              <CurrentRow k="listening" v={aboutCurrently.listening} />
            </div>
          </div>

          {/* ENV */}
          <div className="border border-[#242428] p-5 bg-[#111114]">
            <div className="text-[10.5px] text-[#7c7c85] tracking-[0.2em] mb-4">ENV</div>
            <div className="space-y-2 text-[12px]">
              <EnvRow k="TIMEZONE"  v={aboutEnv.timezone} />
              <EnvRow k="AVAILABLE" v={aboutEnv.available} />
              <EnvRow k="RESPONSE"  v={aboutEnv.response} />
              <EnvRow k="REMOTE"    v={aboutEnv.remote} />
              <EnvRow k="COFFEE"    v={aboutEnv.coffee} />
            </div>
          </div>
        </motion.aside>
      </div>
    </motion.div>
  );
}

function IdentityRow({
  k, v, highlight, dot,
}: {
  k: string; v: string; highlight?: boolean; dot?: boolean;
}) {
  return (
    <div className="flex gap-3">
      <span className="text-[#7c7c85] w-[80px] shrink-0">{k}</span>
      <span className={highlight ? "text-[#e8e8ea]" : dot ? "text-[#8fb88f]" : "text-[#a8a8ad]"}>
        {dot && <span className="mr-1.5">●</span>}
        {v}
      </span>
    </div>
  );
}

function CurrentRow({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex gap-3">
      <span className="text-[#7c7c85] w-[56px] shrink-0">{k}</span>
      <span className="text-[#a8a8ad]">{v}</span>
    </div>
  );
}

function EnvRow({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex gap-3">
      <span className="text-[#d4b483] w-[72px] shrink-0">{k}</span>
      <span className="text-[#a8a8ad]">{v}</span>
    </div>
  );
}
