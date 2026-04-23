"use client";

import { useState, useEffect, useCallback, useRef, useLayoutEffect } from "react";
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
import { personal } from "./data";

type Mode = "gui" | "cli";
type CLITab = "about" | "projects" | "experience" | "skills" | "contact";
type GUISection = "about" | "projects" | "experience" | "contact";
type CLIView = "home" | "section" | "not-found";

const CLI_TABS: Record<CLITab, React.ComponentType> = {
  about: CLIAbout,
  projects: CLIProjects,
  experience: CLIExperience,
  skills: CLISkills,
  contact: CLIContact,
};
const CLI_TAB_ORDER: CLITab[] = ["about", "projects", "experience", "skills", "contact"];
const CLI_COMMAND_TYPE_MS = 38;
const CLI_COMMAND_SETTLE_MS = 180;

export default function Page() {
  const [mode, setMode] = useState<Mode>("gui");
  const [cliTab, setCLITab] = useState<CLITab>("about");
  const [cliView, setCLIView] = useState<CLIView>("home");
  const [cliInvalidCommand, setCLIInvalidCommand] = useState("");
  const [commandMode, setCommandMode] = useState(false);
  const [cmd, setCmd] = useState("");
  const [cliCommandEcho, setCLICommandEcho] = useState("");
  const [helpOpen, setHelpOpen] = useState(false);
  const [toast, setToast] = useState("");
  const [clock, setClock] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [hasPlayedGUIBoot, setHasPlayedGUIBoot] = useState(false);
  const [activeGUISection, setActiveGUISection] = useState<GUISection>("about");
  const cliCommandTimersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useLayoutEffect(() => {
    if (typeof window === "undefined") return;

    const { history } = window;
    const previousScrollRestoration = history.scrollRestoration;

    history.scrollRestoration = "manual";
    window.scrollTo(0, 0);

    return () => {
      history.scrollRestoration = previousScrollRestoration;
    };
  }, []);

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

    const sections = ["about", "projects", "experience", "contact"] as const;
    let frameId = 0;

    const syncScrollState = () => {
      setScrolled(window.scrollY > 40);

      const markerY = window.scrollY + 180;
      let currentSection: GUISection = "about";

      sections.forEach((sectionId) => {
        const el = document.getElementById(sectionId);
        if (el && el.offsetTop <= markerY) {
          currentSection = sectionId;
        }
      });

      setActiveGUISection(currentSection);
    };

    const onScroll = () => {
      if (frameId) cancelAnimationFrame(frameId);
      frameId = requestAnimationFrame(syncScrollState);
    };

    syncScrollState();

    window.addEventListener("scroll", onScroll);
    window.addEventListener("resize", onScroll);

    return () => {
      if (frameId) cancelAnimationFrame(frameId);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [mode]);

  const pushToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3200);
  }, []);

  const clearCLICommandPlayback = useCallback(() => {
    cliCommandTimersRef.current.forEach(clearTimeout);
    cliCommandTimersRef.current = [];
  }, []);

  useEffect(() => clearCLICommandPlayback, [clearCLICommandPlayback]);

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
      setCLIView("home");
      setCLIInvalidCommand("");
      setMode("cli");
      return;
    }

    switchToGUI(cliTab);
  }, [cliTab, mode, switchToGUI]);

  const handleGUIBootComplete = useCallback(() => {
    setHasPlayedGUIBoot(true);
  }, []);

  const runCLICommandAnimation = useCallback(
    (commandText: string, onComplete?: () => void) => {
      clearCLICommandPlayback();
      setCLICommandEcho("");

      if (!commandText) {
        onComplete?.();
        return;
      }

      Array.from(commandText).forEach((_, index) => {
        cliCommandTimersRef.current.push(
          setTimeout(() => {
            setCLICommandEcho(commandText.slice(0, index + 1));
          }, index * CLI_COMMAND_TYPE_MS)
        );
      });

      cliCommandTimersRef.current.push(
        setTimeout(() => {
          onComplete?.();
        }, commandText.length * CLI_COMMAND_TYPE_MS + CLI_COMMAND_SETTLE_MS)
      );
    },
    [clearCLICommandPlayback]
  );

  const navigateCLI = useCallback(
    (tab: CLITab, commandText: string = tab) => {
      runCLICommandAnimation(commandText, () => {
        setCLITab(tab);
        setCLIView("section");
        setCLIInvalidCommand("");
      });
    },
    [runCLICommandAnimation]
  );

  const moveCLITab = useCallback(
    (direction: "left" | "right") => {
      const currentIndex = CLI_TAB_ORDER.indexOf(cliTab);
      const nextIndex =
        direction === "right"
          ? (currentIndex + 1) % CLI_TAB_ORDER.length
          : (currentIndex - 1 + CLI_TAB_ORDER.length) % CLI_TAB_ORDER.length;

      navigateCLI(CLI_TAB_ORDER[nextIndex], CLI_TAB_ORDER[nextIndex]);
    },
    [cliTab, navigateCLI]
  );

  const executeCommand = useCallback(() => {
    const rawInput = cmd.trim();
    const input = rawInput.toLowerCase();
    setCmd("");
    setCommandMode(false);
    if (!input) return;

    if (input === "help" || input === "?") {
      runCLICommandAnimation(rawInput, () => setHelpOpen(true));
      return;
    }
    if (input === "about" || input === "1") { navigateCLI("about", rawInput); return; }
    if (input === "projects" || input === "2") { navigateCLI("projects", rawInput); return; }
    if (input === "experience" || input === "3") { navigateCLI("experience", rawInput); return; }
    if (input === "skills" || input === "4") { navigateCLI("skills", rawInput); return; }
    if (input === "contact" || input === "5") { navigateCLI("contact", rawInput); return; }
    if (input === "email") { navigateCLI("contact", rawInput); return; }
    if (input === "cv" || input === "resume") {
      runCLICommandAnimation(rawInput, () => pushToast("downloading cv.pdf..."));
      return;
    }
    if (input === "github") {
      runCLICommandAnimation(rawInput, () => window.open("https://github.com", "_blank"));
      return;
    }
    if (input === "gui") {
      runCLICommandAnimation(rawInput, () => switchToGUI(cliTab));
      return;
    }

    runCLICommandAnimation(rawInput, () => {
      setCLIInvalidCommand(rawInput);
      setCLIView("not-found");
    });
  }, [cliTab, cmd, navigateCLI, pushToast, runCLICommandAnimation, switchToGUI]);

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
        if (e.key === "ArrowLeft") {
          e.preventDefault();
          moveCLITab("left");
          return;
        }
        if (e.key === "ArrowRight") {
          e.preventDefault();
          moveCLITab("right");
          return;
        }
        if (/^[1-5]$/.test(e.key)) {
          e.preventDefault();
          navigateCLI(CLI_TAB_ORDER[Number(e.key) - 1], e.key);
        }
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [commandMode, helpOpen, mode, moveCLITab, navigateCLI, toggleMode]);

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

            <footer className="relative mt-24 overflow-visible border-t border-[#16161a] py-10">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute left-1/2 top-[-56px] hidden -translate-x-1/2 md:flex"
              >
                <div className="select-none whitespace-nowrap font-['Press_Start_2P',cursive] text-[72px] font-bold uppercase leading-none text-[#ffddc0]/[0.12]">
                  Design. Develop. Deliver.
                </div>
              </div>
              <div className="relative z-10 mx-auto w-full max-w-[1440px] px-5 text-center text-[13px] text-[#5b5b62] sm:px-8 lg:px-12 xl:px-16">
                Made with sharp pixels, late-night focus, and probably one more coffee.
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
            <main className="flex-1 min-h-0 overflow-y-auto px-5 py-8 sm:px-8 lg:px-12 xl:px-16">
              {cliCommandEcho ? (
                <motion.div
                  key={cliCommandEcho}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-8 border-b border-[#16161a] pb-5 text-[13px] text-[#7c7c85]"
                >
                  <span className="text-[#d4b483]">shivanirai@portfolio:~$</span>{" "}
                  <span className="text-[#e8e8ea]">{cliCommandEcho}</span>
                  <span className="ml-1 inline-block h-[14px] w-[8px] animate-pulse bg-[#ffddc0] align-[-2px]" />
                </motion.div>
              ) : null}

              <AnimatePresence mode="wait">
                <motion.div
                  key={cliView === "section" ? cliTab : cliView}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                >
                  {cliView === "home" ? (
                    <CLIHome
                      onSelect={(tab) => navigateCLI(tab, tab)}
                    />
                  ) : cliView === "not-found" ? (
                    <CLINotFound
                      command={cliInvalidCommand}
                      onSelect={(tab) => navigateCLI(tab, tab)}
                    />
                  ) : (
                    <ActiveCLI />
                  )}
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
                onCommandFocus={() => setCommandMode(true)}
                onCommandBlur={() => setCommandMode(false)}
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

function CLIHome({
  onSelect,
}: {
  onSelect: (tab: CLITab) => void;
}) {
  const sectionLinks: { tab: CLITab; label: string; hint: string }[] = [
    { tab: "about", label: "About", hint: ":about" },
    { tab: "projects", label: "Projects", hint: ":projects" },
    { tab: "experience", label: "Experience", hint: ":experience" },
    { tab: "skills", label: "Skills", hint: ":skills" },
    { tab: "contact", label: "Contact", hint: ":contact" },
  ];

  return (
    <div className="mx-auto flex min-h-full max-w-[960px] flex-col items-center justify-center py-6 text-center">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="max-w-[760px]"
      >
        <div className="mb-4 text-[11px] uppercase tracking-[0.28em] text-[#4a4a52]">
          terminal session ready
        </div>
        <h1 className="mb-5 font-['Press_Start_2P',cursive] text-[28px] leading-[1.4] text-[#ffddc0] sm:text-[34px]">
          HELLO, I&apos;M {personal.name.toUpperCase()}
        </h1>
        <p className="mx-auto mb-3 max-w-[640px] text-[14px] leading-[1.9] text-[#a8a8ad]">
          {personal.intro}
        </p>
        <p className="mx-auto mb-12 max-w-[680px] text-[12px] leading-[1.8] text-[#7c7c85]">
          Type a command in the terminal below or choose a section to explore this portfolio.
        </p>

        <div className="mb-10 flex flex-wrap items-center justify-center gap-3">
          {sectionLinks.map((item, index) => (
            <button
              key={item.tab}
              onClick={() => onSelect(item.tab)}
              className="border border-[#242428] bg-[#111114] px-4 py-3 text-left transition-colors hover:border-[#3a3a40] hover:bg-[#151519]"
            >
              <div className="text-[12px] text-[#e8e8ea]">
                ({index + 1}) {item.label}
              </div>
              <div className="mt-1 text-[11px] text-[#7c7c85]">{item.hint}</div>
            </button>
          ))}
        </div>

        <div className="mx-auto max-w-[560px] border border-[#16161a] bg-[#0d0d10] px-5 py-4 text-left text-[12px] leading-[1.9]">
          <div className="text-[#d4b483]">Suggested commands</div>
          <div className="mt-2 text-[#7c7c85]">
            <span className="text-[#e8e8ea]">:projects</span> for selected work
            <span className="mx-3 text-[#4a4a52]">·</span>
            <span className="text-[#e8e8ea]">:contact</span> to reach out
          </div>
          <div className="text-[#7c7c85]">
            <span className="text-[#e8e8ea]">:help</span> for shortcuts
            <span className="mx-3 text-[#4a4a52]">·</span>
            <span className="text-[#e8e8ea]">~</span> to switch back to GUI
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function CLINotFound({
  command,
  onSelect,
}: {
  command: string;
  onSelect: (tab: CLITab) => void;
}) {
  const quickLinks: { tab: CLITab; label: string }[] = [
    { tab: "projects", label: "projects" },
    { tab: "about", label: "about" },
    { tab: "contact", label: "contact" },
  ];

  return (
    <div className="mx-auto flex min-h-[calc(100dvh-220px)] max-w-[960px] flex-col items-center justify-center text-center">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="max-w-[760px]"
      >
        <div className="mb-6 text-[11px] uppercase tracking-[0.28em] text-[#4a4a52]">
          invalid terminal route
        </div>
        <div className="mb-6 font-['Press_Start_2P',cursive] text-[48px] leading-none text-[#ffddc0] sm:text-[72px]">
          404
        </div>
        <div className="mb-2 text-[16px] text-[#e8e8ea]">Command not found</div>
        <div className="mb-4 text-[13px] text-[#7c7c85]">
          {command ? (
            <>
              Nothing happens at <span className="text-[#d4b483]">:{command}</span>
            </>
          ) : (
            <>Nothing happens here.</>
          )}
        </div>
        <div className="mb-8 text-[13px] text-[#a8a8ad]">
          Try one of the valid routes below.
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3 text-[13px]">
          {quickLinks.map((item) => (
            <button
              key={item.tab}
              onClick={() => onSelect(item.tab)}
              className="border border-[#242428] px-3 py-2 text-[#c3c7f4] transition-colors hover:border-[#c3c7f4] hover:text-[#e8e8ea]"
            >
              [{item.label}]
            </button>
          ))}
          <span className="text-[#4a4a52]">or type</span>
          <span className="text-[#d4b483]">:help</span>
        </div>
      </motion.div>
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
