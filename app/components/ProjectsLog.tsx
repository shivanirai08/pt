"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import { projects, type Project } from "../data";

export const RECENT_PROJECT_COUNT = 3;

const PROJECT_CATEGORY: Record<string, string> = {
  codecollab: "realtime",
  codeclash: "realtime",
  "chess-platform": "realtime",
  classence: "education",
};

function initialExpanded() {
  return new Set(projects.slice(0, RECENT_PROJECT_COUNT).map((project) => project.id));
}

type Props = {
  density?: "gui" | "cli";
};

export default function ProjectsLog({ density = "gui" }: Props) {
  const [expanded, setExpanded] = useState<Set<string>>(initialExpanded);
  const isCli = density === "cli";

  const setOpen = useCallback((id: string, open: boolean) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (open) next.add(id);
      else next.delete(id);
      return next;
    });
  }, []);

  const toggle = useCallback(
    (id: string) => {
      setExpanded((prev) => {
        const next = new Set(prev);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        return next;
      });
    },
    []
  );

  useEffect(() => {
    function onOpen(event: Event) {
      const id = (event as CustomEvent<{ id?: string }>).detail?.id;
      if (!id) return;
      setOpen(id, true);
    }
    window.addEventListener("portfolio:open-project", onOpen);
    return () => window.removeEventListener("portfolio:open-project", onOpen);
  }, [setOpen]);

  return (
    <div className="relative">
      {projects.map((project, index) => {
        const isExpanded = expanded.has(project.id);
        const isLast = index === projects.length - 1;

        return (
          <div
            key={project.id}
            id={`project-${project.id}`}
            className={
              isCli ? "grid grid-cols-[20px_1fr] gap-6" : "reveal-item flex gap-5 md:gap-7"
            }
          >
            <div className={`flex shrink-0 flex-col items-center ${isCli ? "w-5 pt-1" : "w-4 pt-2"}`}>
              <span
                className={
                  isCli
                    ? "h-3 w-3 shrink-0 rounded-full border-2"
                    : "h-2 w-2 shrink-0 rounded-full transition-colors duration-300"
                }
                style={
                  isCli
                    ? {
                        backgroundColor: isExpanded ? "#ffddc0" : "#c3c7f4",
                        borderColor: isExpanded ? "#ffddc0" : "#c3c7f4",
                      }
                    : { backgroundColor: isExpanded ? "#ffddc0" : "#4a4a52" }
                }
              />
              {!isLast && (
                <div
                  className={
                    isCli
                      ? "mt-1 min-h-[20px] w-[2px] flex-1 bg-[#222]"
                      : "mt-1 w-px flex-1 bg-[#242428]"
                  }
                />
              )}
            </div>

            <div className={`min-w-0 flex-1 ${isLast ? "pb-2" : isCli ? "pb-8" : "pb-14"}`}>
              <div className="mb-3 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  aria-expanded={isExpanded}
                  aria-controls={`project-panel-${project.id}`}
                  onClick={() => toggle(project.id)}
                  className="flex min-w-0 flex-wrap items-center gap-3 text-left"
                >
                  <span
                    className={
                      isCli
                        ? "text-[15px] font-bold transition-colors duration-300"
                        : `text-[17px] font-semibold transition-colors duration-300 ${
                            isExpanded ? "text-[#ffddc0]" : "text-[#e8e8ea]"
                          }`
                    }
                    style={isCli ? { color: isExpanded ? "#ffddc0" : "#c3c7f4" } : undefined}
                  >
                    {project.name}
                  </span>
                  <span className={isCli ? "text-[12px] text-[#555]" : "text-[13px] text-[#7c7c85]"}>
                    {project.date}
                  </span>
                  {project.head && (
                    <span
                      className={
                        isCli
                          ? "border border-[rgba(63,185,80,0.27)] bg-[#1a1a2e] px-2 py-0.5 text-[12px] text-[#3fb950]"
                          : "border border-[#3fb95044] px-2 py-0.5 text-[10px] tracking-[0.14em] text-[#3fb950]"
                      }
                    >
                      HEAD
                    </span>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => toggle(project.id)}
                  className="ml-auto inline-flex items-center gap-1 border border-[#2a2a30] bg-[#151519] px-2 py-1 text-[11px] text-[#7c7c85] hover:border-[#3a3a40] hover:text-[#a8a8ad]"
                >
                  {isExpanded ? "collapse" : "expand"}
                  <ChevronDown
                    size={12}
                    className={`transition-transform ${isExpanded ? "rotate-180" : ""}`}
                  />
                </button>
              </div>

              <AnimatePresence initial={false} mode="wait">
                {isExpanded ? (
                  <motion.div
                    key={`${project.id}-expanded`}
                    id={`project-panel-${project.id}`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {isCli ? (
                      <ProjectExpandedCli project={project} />
                    ) : (
                      <ProjectExpandedGui project={project} />
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    key={`${project.id}-collapsed`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.18 }}
                    className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(200px,0.85fr)_1fr_auto] lg:items-start lg:gap-8"
                  >
                    <div className="text-[12px] text-[#7c7c85]">
                      {project.date} · {PROJECT_CATEGORY[project.id] ?? project.role.toLowerCase()}
                    </div>
                    <div>
                      <p className="max-w-[56ch] font-sans text-[14px] leading-[1.7] text-[#a8a8ad]">
                        {project.excerpt}
                      </p>
                      <p className="mt-2 text-[12px] text-[#7c7c85]">
                        {project.stack.slice(0, 5).join(" · ").toLowerCase()}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-[12px] lg:justify-end">
                      {project.links.map((link) => (
                        <a
                          key={link.label}
                          href={link.url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-[#a8a8ad] transition-colors hover:text-[#ffddc0]"
                        >
                          {link.label} <ArrowUpRight size={12} strokeWidth={1.5} />
                        </a>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ProjectExpandedGui({ project }: { project: Project }) {
  const specRows = [
    { label: "client", value: project.highlights[0] ?? project.excerpt },
    { label: "server", value: project.stack[0] ?? "—" },
    { label: "infra", value: project.stack.slice(1, 3).join(" + ") || "—" },
    { label: "built", value: project.stack.join(" · ").toLowerCase() },
  ];

  return (
    <div>
      <div className="relative mb-8 min-h-[220px] w-full overflow-hidden bg-[#0a0a0b] md:min-h-[300px]">
        <Image
          src={project.image}
          alt={`${project.name.replace("feat: ", "")} screenshot`}
          fill
          sizes="(max-width: 1280px) 100vw, 70vw"
          className="object-cover"
        />
      </div>
      <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        <div>
          <p className="mb-6 max-w-[52ch] font-sans text-[15px] leading-[1.75] text-[#a8a8ad]">
            {project.excerpt}
          </p>
          <div className="mb-4 flex flex-wrap gap-3">
            {project.links.map((link, index) => (
              <a
                key={link.label}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className={
                  index === 0
                    ? "inline-flex min-h-11 items-center justify-center gap-2 whitespace-nowrap border border-[#ffddc0] px-5 py-2.5 text-[13px] leading-none text-[#ffddc0] transition-all duration-200 hover:bg-[#ffddc0] hover:text-[#0a0a0a]"
                    : "inline-flex min-h-11 items-center justify-center gap-2 whitespace-nowrap border border-[#333] px-5 py-2.5 text-[13px] leading-none text-[#a8a8ad] transition-all duration-200 hover:border-[#c3c7f4] hover:text-[#c3c7f4]"
                }
              >
                {link.label} <ArrowUpRight size={13} />
              </a>
            ))}
          </div>
        </div>
        <div className="space-y-3 text-[12px]">
          {specRows.map((row) => (
            <div key={row.label} className="grid grid-cols-[72px_1fr] gap-4">
              <span className="text-[#7c7c85]">{row.label}</span>
              <span className="font-sans leading-relaxed text-[#a8a8ad]">{row.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProjectExpandedCli({ project }: { project: Project }) {
  return (
    <div className="grid items-stretch gap-6 md:grid-cols-[minmax(240px,0.8fr)_minmax(320px,1.2fr)]">
      <div className="relative h-full min-h-[170px] overflow-hidden border border-[#222] bg-[#111]">
        <Image
          src={project.image}
          alt={`${project.name.replace("feat: ", "")} screenshot`}
          fill
          sizes="(max-width: 768px) 100vw, 40vw"
          className="object-cover"
        />
      </div>
      <div className="flex h-full min-w-0 flex-col">
        <p className="mb-4 text-[12px] leading-relaxed text-[#888]">{project.excerpt}</p>
        <div className="mb-4 flex flex-wrap gap-1">
          {project.stack.map((s) => (
            <span key={s} className="border border-[#333] px-2 py-0.5 text-[12px] text-[#c3c7f4]">
              [{s}]
            </span>
          ))}
        </div>
        <div className="mb-4 space-y-1 text-[12px] text-[#888]">
          {project.description.split(". ").map((line) => (
            <p key={line} className="leading-[19px]">
              {line}
              {!line.endsWith(".") && "."}
            </p>
          ))}
        </div>
        <div className="mb-4 space-y-1 text-[12px] text-[#6f737d]">
          {project.highlights.map((highlight) => (
            <p key={highlight} className="leading-[18px]">
              - {highlight}
            </p>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-3 text-[12px]">
          {project.links.map((l, index) => (
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
  );
}
