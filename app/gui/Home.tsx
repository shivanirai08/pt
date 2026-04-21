"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
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
  { text: "[BOOT] Initializing portfolio...", color: "#333" },
  { text: "[LOAD] Loading modules..............", color: "#333" },
  { text: "[DONE] All systems operational. ✓", color: "#3fb950" },
];

const CONNECTION_LINES = [
  { text: "Connecting to shivani.dev...", delay: 0, color: "#888" },
  {
    text: "Verifying host key.............. ",
    delay: 400,
    color: "#888",
    suffix: "OK",
    suffixColor: "#3fb950",
  },
  {
    text: "Authenticating................ ",
    delay: 800,
    color: "#888",
    suffix: "OK",
    suffixColor: "#3fb950",
  },
  { text: "Connection established.", delay: 1200, color: "#3fb950" },
];

export default function GUIHome({
  onSwitchToCLI,
}: {
  onSwitchToCLI: () => void;
}) {
  const [bootPhase, setBootPhase] = useState(0);
  const [visibleBootLines, setVisibleBootLines] = useState(0);
  const [contactLines, setContactLines] = useState(0);
  const [contactAnimated, setContactAnimated] = useState(false);
  const [skillsVisible, setSkillsVisible] = useState(false);
  const mainRef = useRef<HTMLDivElement>(null);

  // Boot sequence
  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    timers.push(
      setTimeout(() => {
        setBootPhase(1);
        setVisibleBootLines(1);
      }, 200)
    );
    timers.push(setTimeout(() => setVisibleBootLines(2), 600));
    timers.push(setTimeout(() => setVisibleBootLines(3), 1000));
    timers.push(setTimeout(() => setBootPhase(2), 1400));
    timers.push(setTimeout(() => setBootPhase(3), 1800));
    timers.push(setTimeout(() => setBootPhase(4), 2400));
    return () => timers.forEach(clearTimeout);
  }, []);

  // Contact SSH animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !contactAnimated) {
          setContactAnimated(true);
          CONNECTION_LINES.forEach((_, i) => {
            setTimeout(
              () => setContactLines((prev) => Math.max(prev, i + 1)),
              CONNECTION_LINES[i].delay + 300
            );
          });
        }
      },
      { threshold: 0.3 }
    );
    const el = document.getElementById("contact-terminal");
    if (el) observer.observe(el);
    return () => observer.disconnect();
  }, [contactAnimated]);

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
      {/* ════════ HERO — full viewport ════════ */}
      <section
        id="hero"
        className="min-h-dvh flex flex-col justify-center relative"
      >
        {/* Subtle radial glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-[radial-gradient(ellipse,rgba(255,221,192,0.03)_0%,transparent_70%)]" />
        </div>

        <div className="gui-shell relative pt-24 pb-8">
          {/* Boot lines */}
          <div className="mb-12 min-h-[86px]">
            {BOOT_LINES.map((line, i) => (
              <div
                key={i}
                className={`text-[13px] leading-relaxed transition-all duration-300 ${
                  visibleBootLines > i
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-1"
                }`}
                style={{ color: line.color }}
              >
                {line.text}
              </div>
            ))}
          </div>

          {/* Intro */}
          <div
            className={`text-[18px] text-[#888] mb-7 transition-all duration-500 ${
              bootPhase >= 2
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-2"
            }`}
          >
            Hii, I&apos;m <span className="text-white">{personal.name}</span>
          </div>

          {/* Pixel headline */}
          <div
            className={`mb-8 transition-all duration-700 ${
              bootPhase >= 3
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
          >
            <h1 className="pixel-headline leading-[1.3] tracking-wide">
              <span className="block text-[36px] sm:text-[50px] lg:text-[64px] text-white">
                <span className="bg-[#1a1a1a] px-2 py-1 inline-block mb-2">
                  I TURN DESIGN FILES
                </span>
              </span>
              <span className="block text-[36px] sm:text-[50px] lg:text-[64px] text-white">
                <span className="bg-[#1a1a1a] px-2 py-1 inline-block mb-2">
                  INTO LIVING
                </span>
              </span>
              <span className="block text-[36px] sm:text-[50px] lg:text-[64px] text-[#ffddc0]">
                <span className="bg-[#1a1a1a] px-2 py-1 inline-block">
                  INTERFACES.
                </span>
              </span>
            </h1>
          </div>

          {/* Description + CTAs */}
          <div
            className={`max-w-[760px] transition-all duration-500 ${
              bootPhase >= 4
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-2"
            }`}
          >
            <p className="text-[16px] text-[#888] leading-[1.8] mb-10 max-w-[760px]">
              {personal.intro}
            </p>
            <div className="flex items-center gap-7 text-[14px]">
              <a
                href="#contact"
                className="text-[#ffddc0] border border-[#ffddc0] px-6 py-2.5 hover:bg-[#ffddc0] hover:text-[#0a0a0a] transition-all duration-200 inline-flex items-center gap-2"
              >
                Get in touch <ArrowUpRight size={13} />
              </a>
              <a
                href="#projects"
                className="text-[#c3c7f4] border-b border-dashed border-[#c3c7f4] pb-[1px] hover:text-white hover:border-white transition-colors duration-150"
              >
                view projects
              </a>
            </div>
          </div>

          {/* Bottom status bar */}
          <div
            className={`mt-24 pt-5 border-t border-[#1a1a1a] flex justify-between items-center transition-all duration-500 ${
              bootPhase >= 4 ? "opacity-100" : "opacity-0"
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
      <section id="about" className="min-h-screen py-32">
        <div className="gui-shell">
          {/* Section divider */}
          <div className="text-[12px] text-[#333] mb-2 reveal-section">
            // ─────────────────────────────────────────────────────────
          </div>
          <div className="text-[13px] text-[#555] mb-12 text-center reveal-section">
            {personal.name.toUpperCase()}(7)
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Developer
            Manual&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            {personal.name.toUpperCase()}(7)
          </div>

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

              <div className="border border-[#222] p-5 reveal-item">
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
        </div>
      </section>

      {/* ════════ PROJECTS — full viewport ════════ */}
      <section id="projects" className="min-h-screen py-32">
        <div className="gui-shell">
          <div className="text-[12px] text-[#333] mb-2 reveal-section">
            // ─────────────────────────────────────────────────────────
          </div>
          <div className="text-[16px] text-[#ffddc0] mb-12 reveal-section">
            ❯ git log --oneline --graph ~/projects
          </div>

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
                        <span className="text-[12px] px-2 py-[2px] border text-[#3fb950] border-[#3fb95044] bg-[#1a1a2e]">
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
                        <div className="flex-1 h-[170px] bg-[#111] border border-[#222] flex items-center justify-center px-4">
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
                                className="text-[#c3c7f4] text-[13px] border border-[#333] px-2 py-[2px]"
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
                              className="text-[#c3c7f4] text-[13px] border border-[#333] px-2 py-[2px]"
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
        </div>
      </section>

      {/* ════════ EXPERIENCE — full viewport ════════ */}
      <section id="experience" className="min-h-screen py-32">
        <div className="gui-shell">
          <div className="text-[12px] text-[#333] mb-2 reveal-section">
            // ─────────────────────────────────────────────────────────
          </div>
          <div className="text-[16px] text-[#ffddc0] mb-12 reveal-section">
            ❯ cat CHANGELOG.md
          </div>

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
              <div className="bg-[#111] border border-[#222] p-6 reveal-item">
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

              <div className="bg-[#111] border border-[#222] p-6 reveal-item">
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
        </div>
      </section>

      {/* ════════ CONTACT — full viewport ════════ */}
      <section id="contact" className="min-h-screen py-32">
        <div className="gui-shell">
          <div className="text-[12px] text-[#333] mb-2 reveal-section">
            // ─────────────────────────────────────────────────────────
          </div>

          <div className="flex items-center justify-center min-h-[560px]">
            <div className="max-w-[680px] w-full text-center">
              <div className="text-[16px] text-[#ffddc0] mb-8 reveal-section">
                ❯ ssh connect@shivani.dev
              </div>

              {/* Terminal connection animation */}
              <div
                id="contact-terminal"
                className="bg-[#0d0d0d] border border-[#222] p-7 sm:p-9 text-left text-[14px] leading-loose mb-10 reveal-section"
              >
                {CONNECTION_LINES.map((line, i) => (
                  <div
                    key={i}
                    className={`transition-all duration-300 ${
                      contactLines > i
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-1"
                    }`}
                    style={{ color: line.color }}
                  >
                    {line.text}
                    {line.suffix && (
                      <span style={{ color: line.suffixColor }}>
                        {line.suffix}
                      </span>
                    )}
                  </div>
                ))}

                {/* Welcome message */}
                <div
                  className={`mt-4 transition-all duration-500 delay-300 ${
                    contactLines >= 4
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-2"
                  }`}
                >
                  <div className="text-[#ccc] text-[15px]">
                    Welcome! I&apos;m always open to interesting conversations
                  </div>
                  <div className="text-[#ccc] text-[15px]">
                    about frontend, design systems, or your next project.
                  </div>
                  <div className="mt-3 text-[#888] text-[14px]">
                    Response time:{" "}
                    <span className="text-[#3fb950]">&lt; 24 hours</span> ·
                    Timezone:{" "}
                    <span className="text-[#ccc]">{personal.timezone}</span>
                  </div>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-5 justify-center mb-7 reveal-section">
                <a
                  href={`mailto:${personal.email}`}
                  className="inline-flex items-center justify-center gap-1.5 bg-[#ffddc0] text-[#0a0a0a] font-bold text-[14px] px-9 py-3.5 hover:bg-white transition-colors duration-200"
                >
                  <Mail size={14} /> Send Email →
                </a>
                <a
                  href="#"
                  className="inline-flex items-center justify-center gap-1.5 border border-[#333] text-[#c3c7f4] text-[14px] px-9 py-3.5 hover:border-[#c3c7f4] transition-colors duration-200"
                >
                  <FileText size={14} /> View Resume
                </a>
              </div>

              {/* Social links */}
              <div className="flex justify-center gap-8 text-[14px] reveal-section">
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
        </div>
      </section>
    </div>
  );
}
