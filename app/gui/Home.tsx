"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import {
  personal,
  projects,
  experience,
  aboutStack,
  aboutCurrently,
  socials,
  stats,
} from "../data";

gsap.registerPlugin(ScrollTrigger);

const ROLE_TAGS: Record<string, string[]> = {
  "v5.0.0": ["next.js", "typescript", "react", "webrtc"],
  "v4.0.0": ["next.js", "typescript", "tailwind", "rest apis"],
  "v3.0.0": ["figma", "ux research", "product design"],
  "v2.0.0": ["figma", "prototyping", "handoff"],
  "v1.0.0": ["react", "tailwind", "components"],
};

const CAREER_STATS = [
  { value: stats.yearsActive, label: "years in production" },
  { value: stats.projectsShipped, label: "projects shipped" },
  { value: String(stats.yearsLed), label: "teams led" },
  { value: "1", label: "design-system shipped" },
];

const BOOT_LINES = [
  { text: "[BOOT] Initializing portfolio...", color: "#3f3f3f" },
  { text: "[LOAD] Loading modules..............", color: "#3f3f3f" },
  { text: "[DONE] All systems operational. ✓", color: "#3fb950" },
];
const BOOT_WORDS = BOOT_LINES.map((line) => line.text.split(" "));
const HERO_SEQUENCE_STEP_MS = 850;
const HERO_ENTRY_EASE: [number, number, number, number] = [0.16, 0.84, 0.24, 1];
const HERO_ENTRY_HIDDEN = { opacity: 0, y: "100vh" };
const HERO_ENTRY_VISIBLE = { opacity: 1, y: 0 };
const HERO_INTRO_DOCKED = { opacity: 1, y: -22 };

type GUIHomeProps = {
  showBootSequence: boolean;
  onBootSequenceComplete: () => void;
};

type SectionCommandRevealProps = {
  id: string;
  command: string;
  className: string;
  innerClassName?: string;
  children: React.ReactNode;
};

export default function GUIHome({
  showBootSequence,
  onBootSequenceComplete,
}: GUIHomeProps) {
  const [bootPhase, setBootPhase] = useState(showBootSequence ? 0 : 5);
  const [bootWordCounts, setBootWordCounts] = useState<number[]>(
    showBootSequence
      ? BOOT_WORDS.map(() => 0)
      : BOOT_WORDS.map((words) => words.length)
  );
  const [showBootOverlay, setShowBootOverlay] = useState(showBootSequence);
  const [showEarlierRoles, setShowEarlierRoles] = useState(false);
  const mainRef = useRef<HTMLDivElement>(null);

  const primaryRoles = experience.slice(0, 2);
  const earlierDesignRoles = experience.filter((role) =>
    role.role.toLowerCase().includes("designer")
  );
  const incubatorRole = experience.find((role) => role.version === "v1.0.0");
  const featuredProject = projects[0];
  const archiveProjects = projects.slice(1);

  // Boot sequence
  useEffect(() => {
    if (!showBootSequence) return;
    const timers: ReturnType<typeof setTimeout>[] = [];
    let currentDelay = 200;

    BOOT_WORDS.forEach((words, lineIndex) => {
      words.forEach((_, wordIndex) => {
        timers.push(
          setTimeout(() => {
            setBootWordCounts((prev) =>
              prev.map((count, index) =>
                index === lineIndex ? wordIndex + 1 : count
              )
            );
          }, currentDelay)
        );
        currentDelay += 150;
      });
      currentDelay += 280;
    });

    const overlayExitAt = currentDelay + 980;
    const overlayUnmountAt = currentDelay + 1780;
    const introStartAt = currentDelay + 2080;
    const introDockAt = introStartAt + HERO_SEQUENCE_STEP_MS;
    const heroRevealAt = introDockAt + HERO_SEQUENCE_STEP_MS;

    timers.push(setTimeout(() => setBootPhase(1), currentDelay + 140));
    timers.push(setTimeout(() => setBootPhase(2), overlayExitAt));
    timers.push(setTimeout(() => setShowBootOverlay(false), overlayUnmountAt));
    timers.push(setTimeout(() => setBootPhase(3), introStartAt));
    timers.push(setTimeout(() => setBootPhase(4), introDockAt));
    timers.push(setTimeout(() => setBootPhase(5), heroRevealAt));
    timers.push(setTimeout(() => onBootSequenceComplete(), heroRevealAt));

    return () => timers.forEach(clearTimeout);
  }, [onBootSequenceComplete, showBootSequence]);

  // GSAP scroll reveals
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".reveal-section").forEach((el) => {
        gsap.from(el, {
          scrollTrigger: {
            trigger: el,
            start: "top 80%",
            toggleActions: "play none none none",
          },
          opacity: 0,
          y: 30,
          duration: 0.7,
          ease: "power3.out",
        });
      });

      gsap.utils.toArray<HTMLElement>(".reveal-item").forEach((el, i) => {
        gsap.from(el, {
          scrollTrigger: {
            trigger: el,
            start: "top 88%",
            toggleActions: "play none none none",
          },
          opacity: 0,
          y: 20,
          duration: 0.5,
          delay: i * 0.06,
          ease: "power2.out",
        });
      });
    }, mainRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={mainRef} className="text-[14px] md:text-[15px]">
      <AnimatePresence>
        {showBootOverlay && (
          <motion.div
            key="boot-overlay"
            initial={{ opacity: 1, y: 0 }}
            animate={
              bootPhase >= 2
                ? { opacity: 0, y: -110, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } }
                : { opacity: 1, y: 0 }
            }
            exit={{ opacity: 0, y: -110, transition: { duration: 0.45, ease: "easeInOut" } }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#0a0a0b]"
          >
            <div className="flex min-h-[148px] w-full max-w-[680px] flex-col justify-center px-6 text-center">
              {BOOT_LINES.map((line, i) => (
                <div
                  key={line.text}
                  className={`min-h-[28px] text-[14px] leading-7 tracking-[0.02em] transition-all duration-300 ${
                    bootWordCounts[i] > 0 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1"
                  }`}
                  style={{ color: line.color }}
                >
                  {BOOT_WORDS[i].slice(0, bootWordCounts[i]).join(" ")}
                  {bootWordCounts[i] > 0 && bootWordCounts[i] < BOOT_WORDS[i].length ? (
                    <span className="ml-1 inline-block h-[14px] w-[8px] animate-pulse bg-[#ffddc0] align-[-1px]" />
                  ) : null}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ════════ HERO — full viewport ════════ */}
      <section
        id="hero"
        className="min-h-dvh flex flex-col justify-center relative"
      >
        {/* Subtle radial glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-[radial-gradient(ellipse,rgba(255,221,192,0.03)_0%,transparent_70%)]" />
        </div>

        <div className="relative mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-12 xl:px-16 pt-24 pb-8">
          {/* Intro */}
          <div className="relative">
            <motion.div
              initial={HERO_ENTRY_HIDDEN}
              animate={
                bootPhase >= 4
                  ? HERO_INTRO_DOCKED
                  : bootPhase >= 3
                    ? HERO_ENTRY_VISIBLE
                    : HERO_ENTRY_HIDDEN
              }
              transition={{ duration: bootPhase >= 4 ? 0.72 : 0.58, ease: HERO_ENTRY_EASE }}
              className="text-[18px] text-[#888]"
            >
              Hi, I&apos;m <span className="text-white">{personal.name}</span>
            </motion.div>
          </div>

          {/* Pixel headline */}
          <motion.div
            initial={HERO_ENTRY_HIDDEN}
            animate={bootPhase >= 4 ? HERO_ENTRY_VISIBLE : HERO_ENTRY_HIDDEN}
            transition={{ duration: 0.6, ease: HERO_ENTRY_EASE }}
            className="mb-8"
          >
            <h1 className="font-['Press_Start_2P',cursive] leading-[1.3] tracking-wide [text-shadow:0_0_20px_rgba(255,221,192,0.15),0_0_40px_rgba(255,221,192,0.05)]">
              <span className="block text-[36px] sm:text-[50px] lg:text-[64px] text-white">
                <span className="pr-3 py-1.5 inline-block mb-2">
                  I BUILD
                </span>
              </span>
              <span className="block text-[36px] sm:text-[50px] lg:text-[64px] text-white">
                <span className="pr-3 py-1.5 inline-block mb-2">
                   PRODUCTS WITH
                </span>
              </span>
              <span className="block text-[36px] sm:text-[50px] lg:text-[64px] text-[#ffddc0]">
                <span className="pr-3 py-1.5 inline-block">
                  DESIGN INSTINCT.
                </span>
              </span>
            </h1>
          </motion.div>

          {/* Description + CTAs */}
          <motion.div
            initial={HERO_ENTRY_HIDDEN}
            animate={bootPhase >= 5 ? HERO_ENTRY_VISIBLE : HERO_ENTRY_HIDDEN}
            transition={{ duration: 0.56, ease: HERO_ENTRY_EASE }}
            className="max-w-[940px]"
          >
            <p className="text-[16px] font-sans text-[#888] leading-[1.8] mb-10">
              {personal.intro}
            </p>
            <div className="flex flex-wrap items-center gap-5 md:gap-7 text-[15px]">
              <a
                href="#contact"
                className="inline-flex min-h-14 items-center justify-center gap-2 whitespace-nowrap border border-[#ffddc0] px-11 py-4 leading-none text-[#ffddc0] transition-all duration-200 hover:bg-[#ffddc0] hover:text-[#0a0a0a]"
              >
                Get in touch <ArrowUpRight size={13} />
              </a>
              <a
                href="#projects"
                className="text-[#c3c7f4] border-b border-dashed border-[#c3c7f4] pb-[1px] hover:text-white hover:border-white transition-colors duration-150"
              >
                View my work
              </a>
            </div>
          </motion.div>

          {/* Bottom status bar */}
          <div
            className={`mt-24 pt-5 border-t border-[#1a1a1a] flex justify-between items-center transition-all duration-500 ${
              bootPhase >= 5 ? "opacity-100" : "opacity-0"
            }`}
          >
            <div className="text-[12px] text-[#888]">
              <span className="text-[#555]">[tip]</span> press{" "}
              <kbd className="border border-[#333] px-1.5 py-0.5 text-[#aaa]">/</kbd> or{" "}
              <kbd className="border border-[#333] px-1.5 py-0.5 text-[#aaa]">⌘K</kbd> to run
              commands — the page keeps scrolling underneath
            </div>
            <div className="text-[12px] text-[#666]">↓ scroll to explore</div>
          </div>
        </div>
      </section>

      {/* ════════ EXPERIENCE — full viewport ════════ */}
      <SectionCommandReveal
        id="experience"
        command="❯ cat CHANGELOG.md"
        className="min-h-screen py-20 md:py-24 xl:py-32"
        innerClassName="mx-auto flex w-full max-w-[1440px] flex-col gap-8 md:gap-10 xl:gap-12 px-5 sm:px-8 lg:px-12 xl:px-16"
      >
        <div className="space-y-14">
          {primaryRoles.map((role) => (
            <div
              key={role.version}
              className="reveal-item grid grid-cols-1 gap-6 border-b border-[#16161a] pb-14 md:grid-cols-[148px_1fr] md:gap-10"
            >
              <div className="space-y-1">
                <div className="text-[13px] text-[#7c7c85]">{role.range.replace(" – ", " — ")}</div>
                <div className="text-[11px] text-[#4a4a52]">{role.version}</div>
              </div>
              <div>
                <div className="mb-2 flex flex-wrap items-center gap-3">
                  <h3 className="font-sans text-[26px] font-semibold leading-tight text-[#ffddc0]">
                    {role.role}
                  </h3>
                  {role.version === "v5.0.0" && (
                    <span className="border border-[#3fb95044] px-2 py-0.5 text-[10px] tracking-[0.12em] text-[#3fb950]">
                      LATEST
                    </span>
                  )}
                </div>
                <p className="mb-5 font-sans text-[14px] text-[#7c7c85]">{role.company}</p>
                <ul className="mb-6 space-y-3">
                  {role.achievements.map((achievement) => (
                    <li
                      key={achievement}
                      className="flex gap-3 font-sans text-[14px] leading-[1.75] text-[#a8a8ad]"
                    >
                      <span className="shrink-0 text-[#3fb950]">›</span>
                      <span className="max-w-[62ch]">{achievement}</span>
                    </li>
                  ))}
                </ul>
                <div className="flex flex-wrap gap-2">
                  {(ROLE_TAGS[role.version] ?? []).map((tag) => (
                    <span
                      key={tag}
                      className="border border-[#242428] bg-[#111114] px-2.5 py-1 text-[11px] text-[#7c7c85]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}

          {earlierDesignRoles.length > 0 && (
            <div className="reveal-item">
              <button
                type="button"
                onClick={() => setShowEarlierRoles((open) => !open)}
                className="flex items-center gap-2 text-[13px] text-[#7c7c85] transition-colors hover:text-[#e8e8ea]"
              >
                <span>
                  {earlierDesignRoles.length} earlier design roles —{" "}
                  {earlierDesignRoles.map((r) => r.company.split(" ")[0]).join(", ")} · expand
                </span>
                <ChevronDown
                  size={14}
                  className={`transition-transform ${showEarlierRoles ? "rotate-180" : ""}`}
                />
              </button>

              {showEarlierRoles && (
                <div className="mt-10 space-y-12 border-l border-[#242428] pl-6">
                  {earlierDesignRoles.map((role) => (
                    <div key={role.version} className="grid grid-cols-1 gap-4 md:grid-cols-[148px_1fr] md:gap-10">
                      <div className="space-y-1">
                        <div className="text-[13px] text-[#7c7c85]">{role.range.replace(" – ", " — ")}</div>
                        <div className="text-[11px] text-[#4a4a52]">{role.version}</div>
                      </div>
                      <div>
                        <h4 className="font-sans text-[18px] font-medium text-[#e8e8ea]">{role.role}</h4>
                        <p className="mb-4 mt-1 font-sans text-[13px] text-[#7c7c85]">{role.company}</p>
                        <ul className="mb-4 space-y-2">
                          {role.achievements.map((achievement) => (
                            <li
                              key={achievement}
                              className="flex gap-3 font-sans text-[13px] leading-[1.7] text-[#7c7c85]"
                            >
                              <span className="text-[#4a4a52]">›</span>
                              <span>{achievement}</span>
                            </li>
                          ))}
                        </ul>
                        <div className="flex flex-wrap gap-2">
                          {(ROLE_TAGS[role.version] ?? []).map((tag) => (
                            <span
                              key={tag}
                              className="border border-[#242428] bg-[#111114] px-2.5 py-1 text-[11px] text-[#7c7c85]"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                  {incubatorRole && (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-[148px_1fr] md:gap-10">
                      <div className="space-y-1">
                        <div className="text-[13px] text-[#7c7c85]">
                          {incubatorRole.range.replace(" – ", " — ")}
                        </div>
                        <div className="text-[11px] text-[#4a4a52]">{incubatorRole.version}</div>
                      </div>
                      <div>
                        <h4 className="font-sans text-[18px] font-medium text-[#e8e8ea]">
                          {incubatorRole.role}
                        </h4>
                        <p className="mb-4 mt-1 font-sans text-[13px] text-[#7c7c85]">
                          {incubatorRole.company}
                        </p>
                        <ul className="space-y-2">
                          {incubatorRole.achievements.map((achievement) => (
                            <li
                              key={achievement}
                              className="flex gap-3 font-sans text-[13px] leading-[1.7] text-[#7c7c85]"
                            >
                              <span className="text-[#4a4a52]">›</span>
                              <span>{achievement}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="reveal-item mt-6 grid grid-cols-2 gap-8 border-t border-[#16161a] pt-10 md:grid-cols-4">
          {CAREER_STATS.map((item) => (
            <div key={item.label}>
              <div className="text-[32px] font-bold leading-none text-[#ffddc0]">{item.value}</div>
              <div className="mt-2 font-sans text-[13px] text-[#7c7c85]">{item.label}</div>
            </div>
          ))}
        </div>
      </SectionCommandReveal>

      {/* ════════ PROJECTS — full viewport ════════ */}
      <SectionCommandReveal
        id="projects"
        command="❯ git log --oneline --graph ~/projects"
        className="min-h-screen py-20 md:py-24 xl:py-32"
        innerClassName="mx-auto flex w-full max-w-[1440px] flex-col gap-8 md:gap-10 xl:gap-12 px-5 sm:px-8 lg:px-12 xl:px-16"
      >
        <div id={`project-${featuredProject.id}`} className="reveal-item border border-[#242428] bg-[#111114]">
          <div className="flex flex-wrap items-center gap-3 border-b border-[#242428] px-5 py-4">
            <span className="text-[#4a4a52]">●</span>
            <span className="text-[18px] font-semibold text-[#ffddc0]">{featuredProject.name}</span>
            <span className="text-[13px] text-[#7c7c85]">{featuredProject.date}</span>
            {featuredProject.head && (
              <span className="border border-[#3fb95044] px-2 py-0.5 text-[10px] tracking-[0.14em] text-[#3fb950]">
                HEAD
              </span>
            )}
          </div>

          <div className="relative min-h-[220px] w-full overflow-hidden border-b border-[#242428] bg-[#0a0a0b] md:min-h-[280px]">
            <Image
              src={featuredProject.image}
              alt={`${featuredProject.name.replace("feat: ", "")} screenshot`}
              fill
              sizes="(max-width: 1280px) 100vw, 70vw"
              className="object-cover"
            />
          </div>

          <div className="grid gap-8 p-5 md:p-7 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <p className="mb-6 max-w-[52ch] font-sans text-[15px] leading-[1.75] text-[#a8a8ad]">
                {featuredProject.excerpt}
              </p>
              <div className="mb-5 flex flex-wrap gap-3">
                {featuredProject.links.map((link, index) => (
                  <a
                    key={link.label}
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    className={
                      index === 0
                        ? "inline-flex items-center gap-2 border border-[#ffddc0] bg-[#ffddc0] px-5 py-2.5 text-[12px] font-semibold text-[#0a0a0b] transition-colors hover:bg-[#e8e8ea]"
                        : "inline-flex items-center gap-2 border border-[#242428] px-5 py-2.5 text-[12px] text-[#e8e8ea] transition-colors hover:border-[#ffddc0]"
                    }
                  >
                    {link.label}
                  </a>
                ))}
              </div>
              {featuredProject.highlights[0] && (
                <p className="text-[12px] text-[#7c7c85]">
                  read: {featuredProject.highlights[0].toLowerCase()} →
                </p>
              )}
            </div>

            <div className="space-y-3 text-[12px]">
              {[
                { label: "client", value: featuredProject.highlights[0] },
                { label: "server", value: featuredProject.stack[0] },
                {
                  label: "infra",
                  value: featuredProject.stack.slice(1, 3).join(" + "),
                },
                {
                  label: "built",
                  value: `${featuredProject.date} · ${featuredProject.role.toLowerCase()} · live`,
                },
              ].map((row) => (
                <div key={row.label} className="grid grid-cols-[72px_1fr] gap-4">
                  <span className="text-[#7c7c85]">{row.label}</span>
                  <span className="font-sans text-[#a8a8ad]">{row.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="border border-[#242428]">
          {archiveProjects.map((project) => (
            <div
              key={project.id}
              id={`project-${project.id}`}
              className="reveal-item grid grid-cols-1 gap-4 border-b border-[#242428] px-5 py-5 last:border-b-0 lg:grid-cols-[minmax(220px,0.9fr)_1fr_auto] lg:items-start lg:gap-8"
            >
              <div>
                <div className="mb-1 flex items-start gap-2">
                  <span className="mt-1 text-[#4a4a52]">●</span>
                  <div>
                    <div className="text-[16px] font-medium text-[#e8e8ea]">{project.name}</div>
                    <div className="mt-1 text-[12px] text-[#7c7c85]">
                      {project.date} · {project.role.toLowerCase()}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <p className="mb-3 max-w-[56ch] font-sans text-[14px] leading-[1.7] text-[#a8a8ad]">
                  {project.excerpt}
                </p>
                <div className="text-[12px] text-[#7c7c85]">
                  {project.stack.slice(0, 5).join(" · ").toLowerCase()}
                </div>
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
            </div>
          ))}
        </div>
      </SectionCommandReveal>

      {/* ════════ ABOUT — full viewport ════════ */}
      <SectionCommandReveal
        id="about"
        command="❯ man shivani"
        className="min-h-screen py-20 md:py-24 xl:py-32"
        innerClassName="mx-auto flex w-full max-w-[1440px] flex-col gap-8 md:gap-10 xl:gap-12 px-5 sm:px-8 lg:px-12 xl:px-16"
      >
          <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-16 xl:gap-20">
            {/* Left — man page content */}
            <div className="flex-1 space-y-10">
              <div className="reveal-item">
                <div className="text-[#ffddc0] font-bold text-[16px] mb-2">
                  NAME
                </div>
                <div className="text-[15px] font-sans text-[#ccc] pl-7 leading-[1.85]">
                  {personal.name} — frontend developer with a product brain.
                </div>
              </div>

              <div className="reveal-item">
                <div className="text-[#ffddc0] font-bold text-[16px] mb-2">
                  SYNOPSIS
                </div>
                <div className="text-[15px] pl-7 leading-[1.85]">
                  <span className="text-[#c3c7f4]">{personal.synopsis}</span>
                </div>
              </div>

              <div className="reveal-item">
                <div className="text-[#ffddc0] font-bold text-[16px] mb-2">
                  DESCRIPTION
                </div>
                <div className="text-[15px] font-sans text-[#ccc] pl-7 leading-[1.9] space-y-6">
                  <p>
                    Frontend is where I live, but I&apos;ve never been able to stop at the component boundary. Two years of building real products will do that - you start caring about why the API call takes 800ms, how the data model holds up at scale, and what the user actually experiences between the click and the render.
                  </p>
                  <p>
                    Next.js by default. Figma when I need to think out loud. Strong opinions about padding, motion, and whether that shade of grey is actually neutral. All held loosely, none of them quiet.
                  </p>
                </div>
              </div>

              <div className="reveal-item">
                <div className="text-[#ffddc0] font-bold text-[16px] mb-2">
                  ENVIRONMENT
                </div>
                <div className="text-[15px] pl-7 leading-[1.85]">
                  <div>
                    <span className="text-[#c3c7f4]">$LOCATION</span> ={" "}
                    <span className="text-[#888]">{personal.location}</span>
                  </div>
                  <div>
                    <span className="text-[#c3c7f4]">$EDITOR</span> ={" "}
                    <span className="text-[#888]">{personal.editor}</span>
                  </div>
                  <div>
                    <span className="text-[#c3c7f4]">$AVAILABLE</span> ={" "}
                    <span className="text-[#3fb950]">true</span>
                  </div>
                </div>
              </div>

              <div className="reveal-item">
                <div className="text-[#ffddc0] font-bold text-[16px] mb-2">
                  SEE ALSO
                </div>
                <div className="text-[15px] pl-7">
                  <a
                    href="#experience"
                    className="text-[#c3c7f4] underline hover:text-white transition-colors duration-150"
                  >
                    experience(3)
                  </a>
                  ,{" "}
                  <a
                    href="#projects"
                    className="text-[#c3c7f4] underline hover:text-white transition-colors duration-150"
                  >
                    projects(2)
                  </a>
                  ,{" "}
                  <a
                    href="#contact"
                    className="text-[#c3c7f4] underline hover:text-white transition-colors duration-150"
                  >
                    contact(5)
                  </a>
                </div>
              </div>
            </div>

            {/* Right — skills */}
            <div className="w-full lg:w-[430px] shrink-0" id="skills-panel">
              <div className="mb-6 reveal-item">
                <div className="text-[#ffddc0] font-bold text-[16px] mb-6">
                  OPTIONS (Skills)
                </div>
                <div className="text-[12px] text-[#7c7c85] mb-3">
                  <span className="text-[#7c7c85]">&gt;</span> ls ~/stack/
                </div>
                <div className="border border-[#242428] bg-[#111114] p-5 space-y-3">
                  {aboutStack.map((row) => (
                    <div key={row.label} className="flex gap-4 text-[14px] leading-relaxed">
                      <span className="text-[#8fb88f] w-[95px] shrink-0">{row.label}</span>
                      <span className="text-[#a8a8ad]">{row.items}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-[12px] text-[#7c7c85]">
                  tip · type <span className="text-[#d4b483]">:projects</span> to see these in action.
                </div>
              </div>

              <div className="reveal-item border border-[#222] bg-[#111] p-6 md:p-7">
                <div className="text-[11px] text-[#7c7c85] tracking-[0.2em] mb-3">
                  CURRENTLY READING
                </div>
                <p className="text-[13px] font-sans leading-relaxed text-[#a8a8ad]">
                  {aboutCurrently.reading} — Kleppmann
                </p>
              </div>
            </div>
          </div>
      </SectionCommandReveal>

      {/* ════════ CONTACT — full viewport ════════ */}
      <SectionCommandReveal
        id="contact"
        command="❯ ssh connect@shivani.dev"
        className="py-20 md:py-24 xl:py-32"
        innerClassName="mx-auto flex w-full max-w-[1440px] flex-col gap-8 md:gap-10 xl:gap-12 px-5 sm:px-8 lg:px-12 xl:px-16"
      >
          <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr]">
            <div>
              <div className="reveal-item mb-8 flex flex-col gap-1 text-sm">
                <span className="text-[#7c7c85]">Connecting to shivani.dev…</span>
                <span className="text-[#3fb950]">Connection established.</span>
              </div>
              <p className="reveal-item mb-6 max-w-[54ch] font-sans text-2xl leading-snug text-[#e8e8ea]">
                Always open to interesting conversations about frontend, design systems, or your next product.
              </p>
              <div className="reveal-item mb-9 flex flex-wrap items-center gap-6 text-xs text-[#7c7c85]">
                <span>
                  response time{" "}
                  <span className="text-[#a8a8ad]">{personal.responseTime}</span>
                </span>
                <span>
                  timezone{" "}
                  <span className="text-[#a8a8ad]">{personal.timezone}</span>
                </span>
                <span className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#3fb950]" />
                  <span className="text-[#3fb950]">open to work</span>
                </span>
              </div>
              <div className="reveal-item flex flex-wrap gap-3">
                <a
                  href={`mailto:${personal.email}`}
                  className="inline-flex items-center gap-2 border border-[#ffddc0] bg-[#ffddc0] px-5 py-3 text-xs font-semibold text-[#0a0a0a] transition-colors hover:border-[#e8e8ea] hover:bg-[#e8e8ea]"
                >
                  Send email <ArrowUpRight size={14} strokeWidth={2} />
                </a>
                <button
                  type="button"
                  className="inline-flex items-center gap-2 border border-[#38322b] px-5 py-3 text-xs text-[#e8e8ea] transition-colors hover:border-[#ffddc0]"
                >
                  Download résumé
                </button>
              </div>
            </div>

            <div className="reveal-item border border-[#242428] bg-[#111114]">
              {socials.map((s) => (
                <a
                  key={s.name}
                  href={s.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between border-b border-[#242428] px-5 py-4 text-xs last:border-b-0 transition-colors hover:bg-[#151519]"
                >
                  <span className="text-[#a8a8ad] capitalize">{s.name}</span>
                  <ArrowUpRight size={14} strokeWidth={1.5} className="text-[#7c7c85]" />
                </a>
              ))}
            </div>
          </div>
      </SectionCommandReveal>
    </div>
  );
}

function SectionCommandReveal({
  id,
  command,
  className,
  innerClassName,
  children,
}: SectionCommandRevealProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [isActivated, setIsActivated] = useState(false);
  const [typedLength, setTypedLength] = useState(0);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsActivated(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -18% 0px",
      }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isActivated) return;

    const timers: ReturnType<typeof setTimeout>[] = [];

    for (let index = 0; index < command.length; index += 1) {
      timers.push(
        setTimeout(() => {
          setTypedLength(index + 1);
        }, index * 26)
      );
    }

    const revealTimer = setTimeout(() => {
      setShowContent(true);
      ScrollTrigger.refresh();
    }, command.length * 26 + 180);

    return () => {
      timers.forEach(clearTimeout);
      if (revealTimer) clearTimeout(revealTimer);
    };
  }, [command, isActivated]);

  return (
    <section id={id} ref={sectionRef} className={className}>
      <div className={innerClassName}>
        <div className="min-h-[38px]">
          <div
            className={`text-[16px] text-[#ffddc0] transition-opacity duration-300 ${
              isActivated ? "opacity-100" : "opacity-45"
            }`}
          >
            {isActivated ? command.slice(0, typedLength) : command}
            {isActivated && typedLength < command.length ? (
              <span className="ml-1 inline-block h-[16px] w-[9px] animate-pulse bg-[#ffddc0] align-[-2px]" />
            ) : null}
          </div>
        </div>

        <motion.div
          initial={false}
          animate={
            showContent
              ? { opacity: 1, y: 0 }
              : { opacity: 0, y: 28 }
          }
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className={showContent ? "pointer-events-auto" : "pointer-events-none"}
        >
          {children}
        </motion.div>
      </div>
    </section>
  );
}
