"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
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
  const [activeProject, setActiveProject] = useState(0);
  const projectRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    projectRefs.current.forEach((el, i) => {
      if (!el) return;
      const obs = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) setActiveProject(i);
        },
        { threshold: 0.4 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);
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
          const isActive = i === activeProject;
          const accentColor = isActive ? "#ffddc0" : "#c3c7f4";
          return (
            <motion.div
              key={p.id}
              ref={(el) => { projectRefs.current[i] = el; }}
              variants={fadeUp}
              className="group grid grid-cols-[20px_1fr] gap-6 cursor-pointer"
            >
              {/* Graph line */}
              <div className="flex flex-col items-center pt-1">
                <div
                  className={
                    p.status === "archived"
                      ? "w-3 h-3 rounded-full border border-[#4a4a52] shrink-0"
                      : "w-3 h-3 rounded-full shrink-0 border-2"
                  }
                  style={
                    p.status !== "archived"
                      ? { backgroundColor: accentColor, borderColor: accentColor }
                      : undefined
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
                    className="text-[15px] font-bold transition-colors duration-300"
                    style={{ color: accentColor }}
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
                <div className="grid items-stretch gap-6 md:grid-cols-[minmax(240px,0.8fr)_minmax(320px,1.2fr)]">
                  <div className="relative min-h-[170px] h-full overflow-hidden border border-[#222] bg-[#111]">
                    <Image
                      src={p.image}
                      alt={`${p.name.replace("feat: ", "")} screenshot`}
                      fill
                      sizes="(max-width: 768px) 100vw, 40vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex h-full min-w-0 flex-col">
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
                    <div className="mb-4 space-y-1 text-[12px] text-[#6f737d]">
                      {p.highlights.map((highlight) => (
                        <p key={highlight} className="leading-[18px]">
                          - {highlight}
                        </p>
                      ))}
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-[12px]">
                      {p.links.map((l, index) => (
                        <a
                          key={l.label}
                          href={l.url}
                          target="_blank"
                          rel="noreferrer"
                          className={
                            index === 0
                              ? "inline-flex min-h-10 items-center justify-center whitespace-nowrap border border-[#ffddc0] px-4 py-2 text-[#ffddc0] transition-all duration-200 hover:bg-[#ffddc0] hover:text-[#0a0a0a]"
                              : "inline-flex min-h-10 items-center justify-center whitespace-nowrap border border-[#333] px-4 py-2 text-[#a8a8ad] transition-all duration-200 hover:border-[#c3c7f4] hover:text-[#c3c7f4]"
                          }
                        >
                          → {l.label}
                        </a>
                      ))}
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
