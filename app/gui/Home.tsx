"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowUpRight,
  Mail,
  FileText,
  GitBranch,
  Send,
  MessageCircle,
  ExternalLink,
} from "lucide-react";
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
  "[BOOT] Initialising portfolio...",
  "[INFO] Loading modules: design, code, coffee",
  "[DONE] All systems operational. ✓",
];

export default function GUIHome({
  onSwitchToCLI,
}: {
  onSwitchToCLI: () => void;
}) {
  const [bootIdx, setBootIdx] = useState(0);
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (bootIdx >= BOOT_LINES.length) return;
    const t = setTimeout(() => setBootIdx((i) => i + 1), 420);
    return () => clearTimeout(t);
  }, [bootIdx]);

  // GSAP scroll animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate sections on scroll
      gsap.utils.toArray<HTMLElement>(".gsap-section").forEach((section) => {
        gsap.from(section, {
          scrollTrigger: {
            trigger: section,
            start: "top 85%",
            end: "top 50%",
            toggleActions: "play none none reverse",
          },
          opacity: 0,
          y: 40,
          duration: 0.8,
          ease: "power3.out",
        });
      });

      // Animate project cards with stagger
      gsap.utils
        .toArray<HTMLElement>(".gsap-project")
        .forEach((card, i) => {
          gsap.from(card, {
            scrollTrigger: {
              trigger: card,
              start: "top 88%",
              toggleActions: "play none none reverse",
            },
            opacity: 0,
            x: -20,
            duration: 0.6,
            delay: i * 0.1,
            ease: "power2.out",
          });
        });

      // Skill bars animation
      gsap.utils
        .toArray<HTMLElement>(".gsap-skill-bar")
        .forEach((bar) => {
          gsap.from(bar, {
            scrollTrigger: {
              trigger: bar,
              start: "top 90%",
              toggleActions: "play none none reverse",
            },
            scaleX: 0,
            transformOrigin: "left center",
            duration: 0.8,
            ease: "power2.out",
          });
        });

      // Experience timeline
      gsap.utils
        .toArray<HTMLElement>(".gsap-exp")
        .forEach((el, i) => {
          gsap.from(el, {
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
            opacity: 0,
            y: 20,
            duration: 0.5,
            delay: i * 0.08,
            ease: "power2.out",
          });
        });
    }, mainRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={mainRef} className="max-w-[1200px] mx-auto px-6 pb-20">
      {/* ───── Hero ───── */}
      <section id="about" className="pt-12 pb-24">
        <div className="text-[11px] text-[#4a4a52] tracking-wider space-y-1 mb-12 h-[72px]">
          {BOOT_LINES.slice(0, bootIdx).map((l) => (
            <motion.div
              key={l}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              {l}
            </motion.div>
          ))}
          {bootIdx < BOOT_LINES.length && (
            <div className="text-[#d4b483] caret">{BOOT_LINES[bootIdx]}</div>
          )}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.4 }}
          className="text-[13px] text-[#a8a8ad] mb-5"
        >
          Hi, I&apos;m{" "}
          <span className="text-[#e8e8ea]">{personal.name}</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.6, ease: "easeOut" }}
          className="text-[clamp(48px,7.5vw,96px)] leading-[0.95] tracking-[0.02em] text-[#e8e8ea] mb-8 max-w-[16ch] font-bold"
        >
          {personal.headline.split("INTERFACES.")[0]}
          <span className="text-[#FFDDC0]">INTERFACES.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 2 }}
          className="text-[#a8a8ad] text-[14.5px] leading-[1.75] max-w-[580px] mb-8"
        >
          {personal.intro}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 2.2 }}
          className="flex items-center gap-3"
        >
          <a
            href="#contact"
            className="text-[13px] border-2 border-[#FFDDC0] text-[#FFDDC0] hover:bg-[#FFDDC0] hover:text-[#000000] px-4 py-2 transition-colors inline-flex items-center gap-1.5"
          >
            Get in touch <ArrowUpRight size={13} />
          </a>
          <a
            href="#projects"
            className="text-[13px] text-[#a8a8ad] hover:text-[#e8e8ea] px-3 py-2 transition-colors"
          >
            view projects
          </a>
        </motion.div>
      </section>

      {/* ───── Nav bar below hero ───── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.4 }}
        className="flex items-center gap-2 text-[12px] mb-1 py-3 border-t border-b border-[#16161a]"
      >
        <span className="text-[#4a4a52]">FRONTEND(7)</span>
        <span className="mx-3 text-[#2a2a2e]">·</span>
        <span className="text-[#a8a8ad]">Developer Manual</span>
        <span className="mx-3 text-[#2a2a2e]">·</span>
        <span className="text-[#4a4a52]">FRONTEND(7)</span>
      </motion.div>

      {/* ───── Manual + Skills ───── */}
      <section className="gsap-section grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-10 mb-24 mt-8">
        <div className="space-y-6 text-[13.5px] leading-[1.75]">
          <ManSection label="NAME">
            <span className="text-[#e8e8ea]">
              {personal.name.toLowerCase()}
            </span>
            <span className="text-[#a8a8ad]">
              {" "}
              — {personal.tagline}. Specializing in turning design visions into
              production-ready, pixel-perfect UIs.
            </span>
          </ManSection>

          <ManSection label="SYNOPSIS">
            <span className="text-[#89b4e8]">{personal.synopsis}</span>
          </ManSection>

          <ManSection label="DESCRIPTION">
            <span className="text-[#a8a8ad]">{personal.description}</span>
          </ManSection>

          <ManSection label="ENVIRONMENT">
            <div className="text-[#a8a8ad] space-y-0.5">
              <div>
                <span className="text-[#d4b483]">$LOCATION</span> ={" "}
                {personal.location}
              </div>
              <div>
                <span className="text-[#d4b483]">$EDITOR</span> ={" "}
                {personal.editor}
              </div>
              <div>
                <span className="text-[#d4b483]">$AVAILABLE</span> ={" "}
                {personal.availability}
              </div>
            </div>
          </ManSection>

          <ManSection label="SEE ALSO">
            <a
              href="#projects"
              className="text-[#89b4e8] hover:text-[#b4cffb] transition-colors"
            >
              projects(2)
            </a>
            <span className="text-[#7c7c85]">, </span>
            <a
              href="#experience"
              className="text-[#89b4e8] hover:text-[#b4cffb] transition-colors"
            >
              experience(3)
            </a>
            <span className="text-[#7c7c85]">, </span>
            <a
              href="#contact"
              className="text-[#89b4e8] hover:text-[#b4cffb] transition-colors"
            >
              contact(8)
            </a>
          </ManSection>
        </div>

        <aside>
          <div className="text-[11px] text-[#7c7c85] tracking-[0.22em] mb-5">
            OPTIONS (Skills)
          </div>
          <div className="space-y-2.5 mb-8">
            {skills.map((s) => (
              <div
                key={s.name}
                className="grid grid-cols-[90px_1fr_72px] gap-3 items-center text-[12px]"
              >
                <span className="text-[#d4b483]">--{s.name}</span>
                <div className="h-[5px] bg-[#1d1d22] overflow-hidden">
                  <div
                    className="gsap-skill-bar h-full bg-gradient-to-r from-[#ffddc0] to-[#c3c7f4]"
                    style={{ width: `${s.level * 100}%` }}
                  />
                </div>
                <span className="text-[#7c7c85] text-[11px] text-right">
                  {s.years}y · {s.projects}p
                </span>
              </div>
            ))}
          </div>

          <div className="text-[11px] text-[#7c7c85] tracking-[0.22em] mb-3">
            ALSO PROFICIENT IN
          </div>
          <div className="flex flex-wrap gap-1.5">
            {secondaryTools.slice(0, 8).map((t) => (
              <span
                key={t}
                className="text-[11px] text-[#a8a8ad] bg-[#1d1d22] border border-[#242428] px-1.5 py-0.5"
              >
                [{t}]
              </span>
            ))}
          </div>
        </aside>
      </section>

      {/* ───── Projects ───── */}
      <SectionHeader>
        <span className="text-[#7c7c85]">&gt;</span>
        <span className="ml-2 text-[#e8e8ea]">git log</span>
        <span className="text-[#a8a8ad]">
          {" "}
          --oneline --graph ~/projects
        </span>
      </SectionHeader>

      <section id="projects" className="space-y-2 mb-24">
        {projects.slice(0, 4).map((p, i) => {
          const isHead = p.head;
          const isLast = i === 3;
          return (
            <div
              key={p.id}
              className="gsap-project group grid grid-cols-[auto_1fr_auto] gap-6 items-start pb-5 border-b border-[#16161a] last:border-none cursor-pointer"
            >
              {/* Graph column */}
              <div className="flex flex-col items-center pt-2 min-w-[20px]">
                <div
                  className={
                    isHead
                      ? "w-2.5 h-2.5 rounded-full bg-[#ffddc0]"
                      : p.status === "archived"
                      ? "w-2.5 h-2.5 rounded-full border border-[#4a4a52]"
                      : "w-2.5 h-2.5 rounded-full bg-[#c3c7f4]"
                  }
                />
                {!isLast && (
                  <div className="w-px flex-1 bg-[#242428] mt-1 min-h-[30px]" />
                )}
              </div>

              {/* Content */}
              <div className="min-w-0">
                <div className="flex items-center gap-3 mb-1.5">
                  <span className="text-[14px] text-[#e8e8ea] font-medium">
                    {p.name}
                  </span>
                  <span className="text-[11px] text-[#7c7c85]">{p.date}</span>
                  {isHead && (
                    <span className="text-[10px] bg-[#ffddc0] text-[#0a0a0b] px-1.5 py-0.5 font-medium">
                      HEAD
                    </span>
                  )}
                </div>
                <p className="text-[12.5px] text-[#a8a8ad] mb-3 leading-relaxed">
                  {p.excerpt}
                </p>
                <div className="flex items-center gap-4 text-[11px]">
                  <div className="flex flex-wrap gap-1">
                    {p.stack.map((s) => (
                      <span
                        key={s}
                        className="text-[#a8a8ad] bg-[#1d1d22] border border-[#242428] px-1.5 py-0.5"
                      >
                        [{s}]
                      </span>
                    ))}
                  </div>
                  <span className="text-[#4a4a52]">·</span>
                  {p.links.map((l) => (
                    <a
                      key={l.label}
                      href={l.url}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-[#89b4e8] hover:text-[#b4cffb] transition-colors"
                    >
                      + {l.label}
                    </a>
                  ))}
                </div>
              </div>

              {/* Preview swatch */}
              <div className="hidden md:block w-[200px] aspect-[16/10] border border-[#242428] bg-[linear-gradient(135deg,#1d1d22_0%,#2a2332_50%,#1a2330_100%)] relative overflow-hidden shrink-0 group-hover:border-[#ffddc0]/40 transition-colors">
                <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_30%_40%,#d4b483,transparent_50%)]" />
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_70%_60%,#89b4e8,transparent_50%)]" />
                <div className="absolute bottom-2 left-2 right-2 text-[9px] text-[#e8e8ea]/70 tracking-[0.2em] font-medium">
                  {p.id.toUpperCase()}
                </div>
              </div>
            </div>
          );
        })}
      </section>

      {/* ───── Experience ───── */}
      <SectionHeader>
        <span className="text-[#7c7c85]">&gt;</span>
        <span className="ml-2 text-[#e8e8ea]">cat</span>
        <span className="text-[#a8a8ad]"> CHANGELOG.md</span>
      </SectionHeader>

      <section
        id="experience"
        className="gsap-section grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-10 mb-24"
      >
        <div>
          {experience.slice(0, 3).map((e, i) => (
            <div key={e.version} className="gsap-exp mb-7">
              <div className="flex items-baseline gap-3 mb-1">
                <span className="text-[15px] text-[#d4b483] font-medium">
                  ## [{e.version}]
                </span>
                <span className="text-[11.5px] text-[#7c7c85]">
                  {e.range}
                </span>
                {i === 0 && (
                  <span className="text-[9.5px] bg-[#8fb88f] text-[#0a0a0b] px-1.5 py-0.5 font-medium">
                    CURRENT
                  </span>
                )}
              </div>
              <div className="text-[13.5px] text-[#e8e8ea] mb-2">
                {e.role}{" "}
                {e.company && (
                  <span className="text-[#7c7c85]">— {e.company}</span>
                )}
              </div>
              <ul className="space-y-1 pl-2 text-[12.5px]">
                {e.achievements.map((a) => (
                  <li key={a} className="flex gap-2 text-[#a8a8ad]">
                    <span className="text-[#8fb88f] shrink-0">+</span>
                    <span>{a}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div className="text-[11.5px] text-[#7c7c85]">
            + Previous roles:{" "}
            <span className="text-[#a8a8ad]">
              Junior Dev · First Job Co (2020–2021)
            </span>
          </div>
        </div>

        <aside className="space-y-4">
          <div className="border border-[#242428] p-5 bg-[#111114]">
            <div className="text-[10.5px] text-[#7c7c85] tracking-[0.22em] mb-4">
              <span className="text-[#d4b483]">&gt;</span> wc --lines
            </div>
            <div className="space-y-3">
              <StatLine label="YEARS ACTIVE" value={stats.yearsActive} />
              <StatLine label="PROJECTS SHIPPED" value={stats.projectsShipped} />
              <StatLine label="YEARS LED" value={String(stats.yearsLed)} />
            </div>
          </div>
          <div className="border border-[#242428] p-5 bg-[#111114]">
            <div className="text-[10.5px] text-[#7c7c85] tracking-[0.22em] mb-2">
              CERTIFICATIONS
            </div>
            <ul className="space-y-1 text-[11.5px]">
              {certifications.map((c) => (
                <li key={c} className="flex gap-2 text-[#a8a8ad]">
                  <span className="text-[#d4b483]">—</span>
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </section>

      {/* ───── Contact ───── */}
      <SectionHeader>
        <span className="text-[#7c7c85]">&gt;</span>
        <span className="ml-2 text-[#e8e8ea]">ssh</span>
        <span className="text-[#a8a8ad]"> connect@shivani.dev</span>
      </SectionHeader>

      <section id="contact" className="gsap-section flex justify-center mb-16">
        <div className="w-full max-w-[560px] bg-[#111114] border border-[#242428] p-8">
          <div className="space-y-2 text-[12.5px] mb-6">
            <BootLine label="Connecting to shivani.dev" />
            <BootLine label="Verifying host key" />
            <BootLine label="Authenticating" />
            <BootLine label="Connection established" final />
          </div>
          <p className="text-[#a8a8ad] text-[13px] leading-[1.75] mb-6">
            Welcome! I&apos;m always open to interesting conversations about
            frontend, design systems, or your next project.
          </p>

          <div className="grid grid-cols-2 gap-4 text-[11.5px] pb-6 mb-6 border-b border-[#242428]">
            <div>
              <div className="text-[10px] text-[#7c7c85] tracking-[0.18em] mb-1">
                RESPONSE TIME
              </div>
              <div className="text-[#e8e8ea]">Usually within a day</div>
            </div>
            <div>
              <div className="text-[10px] text-[#7c7c85] tracking-[0.18em] mb-1">
                TIMEZONE
              </div>
              <div className="text-[#e8e8ea]">{personal.timezone}</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={`mailto:${personal.email}`}
              className="flex-1 bg-[#FFDDC0] text-[#000000] text-[13px] font-medium px-4 py-2.5 hover:bg-[#ffe8d4] transition-colors inline-flex items-center justify-center gap-1.5"
            >
              <Mail size={13} /> Send Email →
            </a>
            <a
              href="#"
              className="flex-1 border-2 border-[#FFFFFF] text-[#FFFFFF] text-[13px] px-4 py-2.5 hover:bg-[#FFFFFF] hover:text-[#000000] transition-colors inline-flex items-center justify-center gap-1.5"
            >
              <FileText size={13} /> View Resume
            </a>
          </div>
        </div>
      </section>

      {/* Socials row */}
      <div className="flex items-center justify-center gap-6 text-[12px] text-[#7c7c85] pb-4">
        <a
          href="#"
          className="hover:text-[#e8e8ea] transition-colors inline-flex items-center gap-1.5"
        >
          <GitBranch size={13} /> github
        </a>
        <span className="text-[#242428]">·</span>
        <a
          href="#"
          className="hover:text-[#e8e8ea] transition-colors inline-flex items-center gap-1.5"
        >
          <Send size={13} /> twitter
        </a>
        <span className="text-[#242428]">·</span>
        <a
          href="#"
          className="hover:text-[#e8e8ea] transition-colors inline-flex items-center gap-1.5"
        >
          <MessageCircle size={13} /> discord
        </a>
        <span className="text-[#242428]">·</span>
        <a
          href="#"
          className="hover:text-[#e8e8ea] transition-colors inline-flex items-center gap-1.5"
        >
          <ExternalLink size={13} /> linkedin
        </a>
      </div>
    </div>
  );
}

function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <div className="gsap-section flex items-center gap-2 text-[12px] mb-6 py-3 border-t border-b border-[#16161a]">
      {children}
    </div>
  );
}

function ManSection({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="text-[11px] text-[#7c7c85] tracking-[0.22em] font-medium mb-1">
        {label}
      </div>
      <div className="pl-5">{children}</div>
    </div>
  );
}

function StatLine({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] text-[#7c7c85] tracking-[0.18em] mb-0.5">
        {label}
      </div>
      <div className="text-[24px] text-[#e8e8ea] leading-none tracking-tight">
        {value}
      </div>
    </div>
  );
}

function BootLine({ label, final }: { label: string; final?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-[#a8a8ad] flex-1">{label}...</span>
      <span className="text-[#8fb88f]">{final ? "✓ OK" : "OK"}</span>
    </div>
  );
}
