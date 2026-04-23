"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight, Mail, FileText } from "lucide-react";
import {
  personal,
  projects,
  experience,
  skills,
  secondaryTools,
  socials,
  stats,
  certifications,
} from "../data";

gsap.registerPlugin(ScrollTrigger);

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

const CONNECTION_LINES: ConnectionLine[] = [
  { text: "Connecting to shivani.dev...", color: "#888" },
  { text: "Connection established.", color: "#3fb950" },
];

const CONTACT_SEQUENCE_DELAYS = {
  connected: 1400,
  reveal: 2200,
};

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

type ConnectionLine = {
  text: string;
  color: string;
  suffix?: string;
  suffixColor?: string;
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
  const [contactPhase, setContactPhase] = useState(0);
  const [contactConnected, setContactConnected] = useState(false);
  const [skillsVisible, setSkillsVisible] = useState(false);
  const mainRef = useRef<HTMLDivElement>(null);
  const contactSequenceStartedRef = useRef(false);

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

  // Contact SSH animation
  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !contactSequenceStartedRef.current) {
          contactSequenceStartedRef.current = true;
          setContactPhase(1);
          observer.disconnect();

          timers.push(
            setTimeout(() => setContactPhase(2), CONTACT_SEQUENCE_DELAYS.connected)
          );
          timers.push(
            setTimeout(() => setContactConnected(true), CONTACT_SEQUENCE_DELAYS.reveal)
          );
        }
      },
      { threshold: 0.3 }
    );
    const el = document.getElementById("contact-terminal");
    if (el) observer.observe(el);
    return () => {
      observer.disconnect();
      timers.forEach(clearTimeout);
    };
  }, []);

  // Skills visibility observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setSkillsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    const el = document.getElementById("skills-panel");
    if (el) observer.observe(el);
    return () => observer.disconnect();
  }, []);

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
            <p className="text-[16px] text-[#888] leading-[1.8] mb-10">
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
            <div className="text-[12px] text-[#333]">
              <span className="text-[#555]">[LOAD]</span> modules:{" "}
              <span className="text-[#3fb950]">about</span> ·{" "}
              <span className="text-[#3fb950]">projects</span> ·{" "}
              <span className="text-[#3fb950]">experience</span> ·{" "}
              <span className="text-[#3fb950]">contact</span> — all loaded
            </div>
            <div className="text-[12px] text-[#333]">↓ scroll to explore</div>
          </div>
        </div>
      </section>

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
                <div className="text-[15px] text-[#ccc] pl-7 leading-[1.85]">
                  {personal.name} — {personal.tagline}. Specializing in turning
                  design visions into production-ready, pixel-perfect interfaces.
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
                <div className="text-[15px] text-[#ccc] pl-7 leading-[1.85]">
                  {personal.description}
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
                    href="#projects"
                    className="text-[#c3c7f4] underline hover:text-white transition-colors duration-150"
                  >
                    projects(1)
                  </a>
                  ,{" "}
                  <a
                    href="#experience"
                    className="text-[#c3c7f4] underline hover:text-white transition-colors duration-150"
                  >
                    experience(5)
                  </a>
                  ,{" "}
                  <a
                    href="#contact"
                    className="text-[#c3c7f4] underline hover:text-white transition-colors duration-150"
                  >
                    contact(8)
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
                <div className="pl-4 space-y-5">
                  {skills.map((skill) => {
                    const level = Math.round(skill.level * 100);
                    const blocks = 20;
                    const filled = Math.round((level / 100) * blocks);
                    const bar =
                      "█".repeat(filled) + "░".repeat(blocks - filled);
                    return (
                      <div key={skill.name}>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-[#c3c7f4] text-[15px]">
                            --{skill.name}
                          </span>
                          <span className="text-[#444] text-[13px]">
                            {level}%
                          </span>
                        </div>
                        <div className="h-[5px] bg-[#1a1a2e] overflow-hidden">
                          <div
                            className="h-full transition-all duration-1000 ease-out"
                            style={{
                              width: skillsVisible ? `${level}%` : "0%",
                              background:
                                "linear-gradient(90deg, #c3c7f4, #ffddc0)",
                            }}
                          />
                        </div>
                        <div className="text-[11px] text-[#222] mt-1 tracking-wider">
                          {bar}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="reveal-item border border-[#222] bg-[#111] p-6 md:p-7">
                <div className="text-[13px] text-[#888] mb-4">
                  ALSO PROFICIENT IN
                </div>
                <div className="flex flex-wrap gap-2">
                  {secondaryTools.slice(0, 8).map((tool) => (
                    <span
                      key={tool}
                      className="bg-[#111] text-[#888] text-[13px] px-3 py-1.5 border border-[#222]"
                    >
                      [{tool}]
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
      </SectionCommandReveal>

      {/* ════════ PROJECTS — full viewport ════════ */}
      <SectionCommandReveal
        id="projects"
        command="❯ git log --oneline --graph ~/projects"
        className="min-h-screen py-20 md:py-24 xl:py-32"
        innerClassName="mx-auto flex w-full max-w-[1440px] flex-col gap-8 md:gap-10 xl:gap-12 px-5 sm:px-8 lg:px-12 xl:px-16"
      >
          <div className="relative">
            {projects.slice(0, 4).map((project, i) => {
              const isExpanded = i < 2;
              const isLast = i === projects.length - 1;
              const dotColor =
                i === 0
                  ? "#ffddc0"
                  : i === 1
                  ? "#c3c7f4"
                  : i === 2
                  ? "#3fb950"
                  : "#555";

              return (
                <div key={project.id} className="flex gap-9 mb-14 reveal-item">
                  {/* Timeline */}
                  <div className="flex flex-col items-center shrink-0 w-5">
                    <div
                      className="w-[14px] h-[14px] rounded-full shrink-0 border-2"
                      style={{
                        backgroundColor: isExpanded ? dotColor : "transparent",
                        borderColor: dotColor,
                      }}
                    />
                    {!isLast && (
                      <div className="w-[2px] flex-1 bg-[#222] mt-1" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 pb-2">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <span
                        className="font-bold text-[18px]"
                        style={{ color: dotColor }}
                      >
                        {project.name}
                      </span>
                      <span className="text-[14px] text-[#555]">
                        {project.date}
                      </span>
                      {project.head && (
                        <span className="text-[12px] px-3 py-1 border text-[#3fb950] border-[#3fb95044] bg-[#1a1a2e]">
                          HEAD
                        </span>
                      )}
                    </div>

                    <div className="text-[14px] text-[#888] mb-4 leading-relaxed">
                      {project.excerpt}
                    </div>

                    {isExpanded ? (
                      <div className="flex flex-col xl:flex-row gap-7">
                        {/* Screenshot placeholder */}
                        <div className="flex h-[170px] flex-1 items-center justify-center border border-[#222] bg-[#111] p-6 md:p-7">
                          <div className="text-center">
                            <div className="text-[18px] text-[#1a1a2e]">
                              {project.name.replace("feat: ", "")}
                            </div>
                            <div className="text-[12px] text-[#222]">
                              [ project screenshot ]
                            </div>
                          </div>
                        </div>

                        {/* Details */}
                        <div className="xl:w-[380px] shrink-0">
                          <div className="flex gap-2 flex-wrap mb-4">
                            {project.stack.map((tag) => (
                              <span
                                key={tag}
                                className="text-[#c3c7f4] text-[13px] border border-[#333] px-3 py-1"
                              >
                                [{tag}]
                              </span>
                            ))}
                          </div>
                          <div className="text-[14px] text-[#888] leading-relaxed mb-4">
                            {project.description}
                          </div>
                          <div className="flex gap-4 text-[13px]">
                            {project.links.map((l, li) => (
                              <a
                                key={l.label}
                                href={l.url}
                                target="_blank"
                                rel="noreferrer"
                                className={
                                  li === 0
                                    ? "text-[#c3c7f4] border-b border-[#c3c7f4] pb-[1px] hover:text-white hover:border-white transition-colors duration-150"
                                    : "text-[#666] hover:text-[#888] transition-colors duration-150"
                                }
                              >
                                → {l.label}
                              </a>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex gap-4 text-[13px] items-center">
                        <div className="flex gap-2 flex-wrap">
                          {project.stack.map((tag) => (
                            <span
                              key={tag}
                              className="text-[#c3c7f4] text-[13px] border border-[#333] px-3 py-1"
                            >
                              [{tag}]
                            </span>
                          ))}
                        </div>
                        <span className="text-[#555]">·</span>
                        {project.links.map((l) => (
                          <a
                            key={l.label}
                            href={l.url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[#c3c7f4] hover:text-white transition-colors duration-150"
                          >
                            → {l.label.toLowerCase()}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
      </SectionCommandReveal>

      {/* ════════ EXPERIENCE — full viewport ════════ */}
      <SectionCommandReveal
        id="experience"
        command="❯ cat CHANGELOG.md"
        className="min-h-screen py-20 md:py-24 xl:py-32"
        innerClassName="mx-auto flex w-full max-w-[1440px] flex-col gap-8 md:gap-10 xl:gap-12 px-5 sm:px-8 lg:px-12 xl:px-16"
      >
          <div className="grid grid-cols-1 xl:grid-cols-[1.2fr_0.8fr] gap-12 xl:gap-16">
            {/* Timeline */}
            <div className="flex-1">
              {experience.map((role, i) => (
                <div key={role.version} className="mb-10 reveal-item">
                  <div className="flex items-center gap-3 mb-1 flex-wrap">
                    <span
                      className="text-[20px] font-bold"
                      style={{
                        color:
                          i === 0
                            ? "#ffddc0"
                            : i === 1
                            ? "#c3c7f4"
                            : i === 2
                            ? "#888"
                            : "#555",
                      }}
                    >
                      ## [{role.version}]
                    </span>
                    <span className="text-[14px] text-[#555]">
                      {role.range}
                    </span>
                    {i === 0 && (
                      <span className="bg-[#3fb950] text-[#000] text-[12px] px-2 py-[2px] font-bold">
                        LATEST
                      </span>
                    )}
                  </div>

                  <div className="text-[16px] text-[#ccc] mb-3">
                    {role.role} —{" "}
                    <span className="text-[#c3c7f4]">{role.company}</span>
                  </div>

                  {role.achievements.length > 0 && (
                    <div className="pl-6 text-[14px] leading-loose">
                      {role.achievements.map((a, j) => (
                        <div key={j} className="text-[#888]">
                          <span className="text-[#3fb950]">+</span> {a}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Stats sidebar */}
            <div className="w-full lg:w-[320px] shrink-0 space-y-6">
              <div className="reveal-item border border-[#222] bg-[#111] p-6 md:p-7">
                <div className="text-[13px] text-[#555] mb-6">
                  ❯ wc --career
                </div>
                <div className="flex flex-col gap-6">
                  <div>
                    <div className="text-[13px] text-[#555] mb-1">
                      YEARS ACTIVE
                    </div>
                    <div className="text-[36px] font-bold text-[#ffddc0] leading-none">
                      {stats.yearsActive}
                    </div>
                  </div>
                  <div>
                    <div className="text-[13px] text-[#555] mb-1">
                      PROJECTS SHIPPED
                    </div>
                    <div className="text-[36px] font-bold text-[#c3c7f4] leading-none">
                      {stats.projectsShipped}
                    </div>
                  </div>
                  <div>
                    <div className="text-[13px] text-[#555] mb-1">
                      TEAMS LED
                    </div>
                    <div className="text-[36px] font-bold text-[#3fb950] leading-none">
                      {stats.yearsLed}
                    </div>
                  </div>
                </div>
              </div>

              <div className="reveal-item border border-[#222] bg-[#111] p-6 md:p-7">
                <div className="text-[13px] text-[#555] mb-3">
                  CERTIFICATIONS
                </div>
                <div className="text-[13px] text-[#888] leading-loose">
                  {certifications.map((c) => (
                    <div key={c}>· {c}</div>
                  ))}
                </div>
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
          <div className="flex items-center justify-center py-10">
            <div className="max-w-[680px] w-full text-center">
              {/* Terminal connection animation */}
              <div
                id="contact-terminal"
                className="relative mb-10 border border-[#222] bg-[#0d0d0d] p-6 text-left text-[14px] leading-loose reveal-section md:p-7 xl:p-11"
              >
                <div
                  className={`transition-all duration-400 ${
                    contactConnected
                      ? "pointer-events-none absolute inset-x-6 top-6 opacity-0 md:inset-x-7 md:top-7 xl:inset-x-11 xl:top-11"
                      : "opacity-100"
                  }`}
                >
                  <div
                    className={`transition-all duration-300 ${
                      contactPhase >= 1 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1"
                    }`}
                    style={{ color: CONNECTION_LINES[0].color }}
                  >
                    {CONNECTION_LINES[0].text}
                    {contactPhase === 1 ? (
                      <span className="ml-1 inline-block h-[15px] w-[10px] animate-pulse bg-[#ffddc0] align-[-2px]" />
                    ) : null}
                  </div>

                  {CONNECTION_LINES.slice(1).map((line, index) => {
                    const visibleAtPhase = index + 2;
                    const showWaitingCursor =
                      Boolean(line.suffix) && contactPhase === visibleAtPhase;
                    const showSuffix =
                      Boolean(line.suffix) && contactPhase > visibleAtPhase;

                    return (
                      <div
                        key={line.text}
                        className={`transition-all duration-300 ${
                          contactPhase >= visibleAtPhase
                            ? "opacity-100 translate-y-0"
                            : "opacity-0 translate-y-1"
                        }`}
                        style={{ color: line.color }}
                      >
                        {line.text}
                        {showWaitingCursor ? (
                          <span className="inline-block h-[15px] w-[10px] animate-pulse bg-[#ffddc0] align-[-2px]" />
                        ) : null}
                        {showSuffix ? (
                          <span style={{ color: line.suffixColor }}>
                            {line.suffix}
                          </span>
                        ) : null}
                      </div>
                    );
                  })}
                </div>

                {/* Welcome message */}
                <div
                  className={`text-center transition-all duration-500 delay-300 ${
                    contactConnected
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-2"
                  }`}
                >
                  <div className="text-[15px] text-[#ccc]">
                    Welcome! I&apos;m always open to interesting conversations
                  </div>
                  <div className="text-[15px] text-[#ccc]">
                    about frontend, design systems, or your next project.
                  </div>
                  <div className="mt-3 text-[14px] text-[#888]">
                    Response time:{" "}
                    <span className="text-[#3fb950]">&lt; 24 hours</span> ·
                    Timezone:{" "}
                    <span className="text-[#ccc]">{personal.timezone}</span>
                  </div>
                </div>
              </div>

              {/* CTAs */}
              <div
                className={`mb-7 flex flex-col justify-center gap-5 transition-all duration-500 sm:flex-row ${
                  contactConnected ? "opacity-100 translate-y-0" : "pointer-events-none opacity-0 translate-y-3"
                }`}
              >
                <a
                  href={`mailto:${personal.email}`}
                  className="inline-flex min-h-14 items-center justify-center gap-1.5 whitespace-nowrap bg-[#ffddc0] px-11 py-4 text-[15px] font-bold leading-none text-[#0a0a0a] transition-colors duration-200 hover:bg-white"
                >
                  <Mail size={14} /> Send Email →
                </a>
                <a
                  href="#"
                  className="inline-flex min-h-14 items-center justify-center gap-1.5 whitespace-nowrap border border-[#333] px-11 py-4 text-[15px] leading-none text-[#c3c7f4] transition-colors duration-200 hover:border-[#c3c7f4]"
                >
                  <FileText size={14} /> View Resume
                </a>
              </div>

              {/* Social links */}
              <div
                className={`flex justify-center gap-8 text-[14px] transition-all duration-500 ${
                  contactConnected ? "opacity-100 translate-y-0" : "pointer-events-none opacity-0 translate-y-3"
                }`}
              >
                {socials.map((s, i) => (
                  <span key={s.name}>
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#c3c7f4] hover:text-white transition-colors duration-150"
                    >
                      {s.name}
                    </a>
                    {i < socials.length - 1 && (
                      <span className="text-[#888] ml-7">·</span>
                    )}
                  </span>
                ))}
              </div>
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
