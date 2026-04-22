"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ModeToggle from "./components/ModeToggle";
import StatusBar from "./components/StatusBar";
import HelpOverlay from "./components/HelpOverlay";
import GUIHome from "./gui/Home";
import CLIAbout from "./cli/About";
import CLIProjects from "./cli/Projects";
import CLIExperience from "./cli/Experience";
import CLISkills from "./cli/Skills";
import CLIContact from "./cli/Contact";
import { personal, socials } from "./data";

type Mode = "gui" | "cli";
type CLITab = "about" | "projects" | "experience" | "skills" | "contact";
type GUISection = "about" | "projects" | "experience" | "contact";

const CLI_TABS: Record<CLITab, React.ComponentType> = {
  about: CLIAbout,
  projects: CLIProjects,
  experience: CLIExperience,
  skills: CLISkills,
  contact: CLIContact,
};

export default function Page() {
  const [mode, setMode] = useState<Mode>("gui");
  const [cliTab, setCLITab] = useState<CLITab>("about");
  const [commandMode, setCommandMode] = useState(false);
  const [cmd, setCmd] = useState("");
  const [helpOpen, setHelpOpen] = useState(false);
  const [toast, setToast] = useState("");
  const [clock, setClock] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [hasPlayedGUIBoot, setHasPlayedGUIBoot] = useState(false);
  const [activeGUISection, setActiveGUISection] = useState<GUISection>("about");

  // Clock
  useEffect(() => {
    const update = () => {
      const now = new Date();
      setClock(
        `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`
      );
    };
    update();
    const t = setInterval(update, 30000);
    return () => clearInterval(t);
  }, []);

  // Scroll detection for GUI header + active section
  useEffect(() => {
    if (mode !== "gui") return;

    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();

    const sections = ["about", "projects", "experience", "contact"] as const;
    const observers: IntersectionObserver[] = [];

    sections.forEach((sectionId) => {
      const el = document.getElementById(sectionId);
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveGUISection(sectionId);
          }
        },
        {
          threshold: 0.45,
          rootMargin: "-20% 0px -30% 0px",
        }
      );

      observer.observe(el);
      observers.push(observer);
    });

    window.addEventListener("scroll", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      observers.forEach((observer) => observer.disconnect());
    };
  }, [mode]);

  const pushToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3200);
  }, []);

  const scrollToGUISection = useCallback((section: GUISection) => {
    const el = document.getElementById(section);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const switchToGUI = useCallback(
    (sourceTab: CLITab) => {
      const targetSection: GUISection =
        sourceTab === "skills" ? "about" : sourceTab;

      setMode("gui");
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          scrollToGUISection(targetSection);
        });
      });
    },
    [scrollToGUISection]
  );

  const toggleMode = useCallback(() => {
    if (mode === "gui") {
      setCLITab(activeGUISection);
      setMode("cli");
      return;
    }

    switchToGUI(cliTab);
  }, [activeGUISection, cliTab, mode, switchToGUI]);

  const handleGUIBootComplete = useCallback(() => {
    setHasPlayedGUIBoot(true);
  }, []);

  const executeCommand = useCallback(() => {
    const input = cmd.trim().toLowerCase();
    setCmd("");
    setCommandMode(false);
    if (!input) return;

    if (input === "help" || input === "?") {
      setHelpOpen(true);
      return;
    }
    if (input === "about" || input === "1") { setCLITab("about"); return; }
    if (input === "projects" || input === "2") { setCLITab("projects"); return; }
    if (input === "experience" || input === "3") { setCLITab("experience"); return; }
    if (input === "skills" || input === "4") { setCLITab("skills"); return; }
    if (input === "contact" || input === "5") { setCLITab("contact"); return; }
    if (input === "email") { setCLITab("contact"); return; }
    if (input === "cv" || input === "resume") { pushToast("downloading cv.pdf..."); return; }
    if (input === "github") { window.open("https://github.com", "_blank"); return; }
    if (input === "gui") { switchToGUI(cliTab); return; }

    pushToast(`command not found: :${input} — try :help`);
  }, [cliTab, cmd, pushToast, switchToGUI]);

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isInput =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable;

      if (e.key === "Escape") {
        if (helpOpen) { setHelpOpen(false); return; }
        if (commandMode) { setCommandMode(false); setCmd(""); }
        return;
      }

      if (isInput || commandMode) return;

      if (e.key === "~") {
        e.preventDefault();
        toggleMode();
        return;
      }

      // CLI-only shortcuts
      if (mode === "cli") {
        if (e.key === ":") {
          e.preventDefault();
          setCommandMode(true);
          return;
        }
        if (e.key === "?") {
          e.preventDefault();
          setHelpOpen((v) => !v);
          return;
        }
        if (/^[1-5]$/.test(e.key)) {
          const tabs: CLITab[] = ["about", "projects", "experience", "skills", "contact"];
          setCLITab(tabs[Number(e.key) - 1]);
        }
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [commandMode, helpOpen, mode, toggleMode]);

  const ActiveCLI = CLI_TABS[cliTab];

  return (
    <div className="min-h-dvh bg-[#0a0a0b] text-[#e8e8ea]">
      <SharedHeader
        mode={mode}
        activeGUISection={activeGUISection}
        onNavigate={(section) => {
          setActiveGUISection(section);
          setCLITab(section);
          scrollToGUISection(section);
        }}
        onToggleMode={toggleMode}
      />

      <AnimatePresence mode="wait">
        {mode === "gui" ? (
          <motion.div
            key="gui"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <main className={scrolled ? "pt-0" : ""}>
              <GUIHome
                showBootSequence={!hasPlayedGUIBoot}
                onBootSequenceComplete={handleGUIBootComplete}
              />
            </main>

            {/* GUI Footer */}
            <footer className="relative mt-24 overflow-visible border-t border-[#16161a] py-10">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute left-1/2 top-[-56px] hidden -translate-x-1/2 md:flex"
              >
                <div className="select-none whitespace-nowrap font-['Press_Start_2P',cursive] text-[72px] font-bold uppercase leading-none text-[#ffddc0]/[0.12]">
                  Design. Develop. Deliver.
                </div>
              </div>
              <div className="relative z-10 mx-auto flex w-full max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:px-12 xl:px-16 text-[13px] text-[#4a4a52]">
                <span>© 2026 {personal.fullName} — Built with Next.js</span>
                <div className="flex items-center gap-5">
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
                </div>
                <span>Inspired by Neovim · v1.0.0</span>
              </div>
            </footer>
          </motion.div>
        ) : (
          <motion.div
            key="cli"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="flex h-[calc(100dvh-68px)] flex-col"
          >
            <div className="border-b border-[#16161a] bg-[#0a0a0b]/95 px-5 py-3 text-[12px] text-[#7c7c85] backdrop-blur sm:px-8 lg:px-12 xl:px-16">
              <div className="mx-auto flex w-full max-w-[1440px] items-center justify-between">
                <span>
                  terminal mode · active section{" "}
                  <span className="text-[#e8e8ea]">{cliTab}</span>
                </span>
                <span className="hidden md:inline">
                  press <span className="text-[#d4b483]">:</span> to open the command bar ·{" "}
                  <span className="text-[#d4b483]">1-5</span> to switch sections
                </span>
              </div>
            </div>

            <main className="flex-1 min-h-0 overflow-y-auto px-5 py-8 sm:px-8 lg:px-12 xl:px-16">
              <AnimatePresence mode="wait">
                <motion.div
                  key={cliTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                >
                  <ActiveCLI />
                </motion.div>
              </AnimatePresence>
            </main>

            <div className="sticky bottom-0 z-30">
              <StatusBar
              commandMode={commandMode}
              commandValue={cmd}
              onCommandChange={setCmd}
              onCommandSubmit={executeCommand}
              onCommandCancel={() => {
                setCommandMode(false);
                setCmd("");
              }}
              toast={toast}
              time={clock}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <HelpOverlay open={helpOpen} onClose={() => setHelpOpen(false)} />
    </div>
  );
}

function SharedHeader({
  mode,
  activeGUISection,
  onNavigate,
  onToggleMode,
}: {
  mode: Mode;
  activeGUISection: GUISection;
  onNavigate: (section: GUISection) => void;
  onToggleMode: () => void;
}) {
  const navSections: GUISection[] = ["about", "projects", "experience", "contact"];

  return (
    <header className="sticky top-0 z-40 border-b border-[#16161a] bg-[#0a0a0b]/92 backdrop-blur">
      <div className="mx-auto flex h-[68px] w-full max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:px-12 xl:px-16">
        <span className="text-[16px] font-bold tracking-tight text-[#e8e8ea]">
          {personal.initials}.
        </span>

        <div className="flex items-center gap-6">
          {mode === "gui" ? (
            <nav className="hidden items-center gap-8 text-[14px] text-[#a8a8ad] md:flex">
              {navSections.map((section) => {
                const isActive = section === activeGUISection;
                return (
                  <button
                    key={section}
                    onClick={() => onNavigate(section)}
                    className={
                      "transition-colors duration-150 " +
                      (isActive ? "text-[#e8e8ea]" : "hover:text-[#e8e8ea]")
                    }
                  >
                    {section}
                  </button>
                );
              })}
            </nav>
          ) : (
            <div className="hidden text-[12px] uppercase tracking-[0.18em] text-[#4a4a52] md:block">
              terminal interface
            </div>
          )}

          <ModeToggle mode={mode} onToggle={onToggleMode} />
        </div>
      </div>
    </header>
  );
}
