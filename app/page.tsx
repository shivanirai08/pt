"use client";

import { useState, useEffect, useCallback, useRef, useLayoutEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Minimize2 } from "lucide-react";
import Shell from "./components/Shell";
import CommandBar from "./components/CommandBar";
import StatusBar from "./components/StatusBar";
import HelpOverlay from "./components/HelpOverlay";
import GUIHome from "./gui/Home";
import CLIAbout from "./cli/About";
import CLIProjects from "./cli/Projects";
import CLIExperience from "./cli/Experience";
import CLISkills from "./cli/Skills";
import CLIContact from "./cli/Contact";
import { personal } from "./data";

type ViewMode = "unified" | "cli";
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
const CLI_DISPLAY_COMMAND_MAX = 40;

function normalizeCLICommand(input: string) {
  return input.trim().toLowerCase().replace(/^[:/]+/, "").trim();
}

function formatCLICommandForDisplay(command: string) {
  const sanitized = command
    .replace(/[\u0000-\u001F\u007F]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (sanitized.length <= CLI_DISPLAY_COMMAND_MAX) return sanitized;
  return `${sanitized.slice(0, CLI_DISPLAY_COMMAND_MAX - 1)}…`;
}

export default function Page() {
  const [viewMode, setViewMode] = useState<ViewMode>("unified");
  const [cliTab, setCLITab] = useState<CLITab>("about");
  const [cliView, setCLIView] = useState<CLIView>("home");
  const [cliInvalidMessage, setCLIInvalidMessage] = useState("");
  const [commandMode, setCommandMode] = useState(false);
  const [cmd, setCmd] = useState("");
  const [cliCommandHistory, setCLICommandHistory] = useState<string[]>([]);
  const [cliHistoryIndex, setCLIHistoryIndex] = useState<number | null>(null);
  const [cliHistoryDraft, setCLIHistoryDraft] = useState("");
  const [cliCommandEcho, setCLICommandEcho] = useState("");
  const [helpOpen, setHelpOpen] = useState(false);
  const [toast, setToast] = useState("");
  const [clock, setClock] = useState("");
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

  useEffect(() => {
    const handleDragStart = (event: DragEvent) => event.preventDefault();
    document.addEventListener("dragstart", handleDragStart);
    return () => document.removeEventListener("dragstart", handleDragStart);
  }, []);

  useEffect(() => {
    if (viewMode !== "unified") return;
    const sections = ["about", "projects", "experience", "contact"] as const;
    let frameId = 0;
    const syncScrollState = () => {
      const markerY = window.scrollY + 180;
      let currentSection: GUISection = "about";
      sections.forEach((sectionId) => {
        const el = document.getElementById(sectionId);
        if (el && el.offsetTop <= markerY) currentSection = sectionId;
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
  }, [viewMode]);

  const clearCLICommandPlayback = useCallback(() => {
    cliCommandTimersRef.current.forEach(clearTimeout);
    cliCommandTimersRef.current = [];
  }, []);

  const fetchCLIUnknownMessage = useCallback(async (commandText: string) => {
    const fallback = "unknown command. terminal unimpressed.";
    try {
      const response = await fetch("/api/terminal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ command: commandText }),
      });
      const data = (await response.json()) as { message?: string };
      if (response.ok && typeof data.message === "string" && data.message.trim()) {
        return data.message.trim();
      }
    } catch {
      /* fallback */
    }
    return fallback;
  }, []);

  useEffect(() => clearCLICommandPlayback, [clearCLICommandPlayback]);

  const scrollToGUISection = useCallback((section: GUISection) => {
    document.getElementById(section)?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const enterCLIFullscreen = useCallback(() => {
    clearCLICommandPlayback();
    setCommandMode(false);
    setCmd("");
    setCLIView("home");
    setCLICommandEcho("");
    setCLIInvalidMessage("");
    setViewMode("cli");
  }, [clearCLICommandPlayback]);

  const exitCLIFullscreen = useCallback(() => {
    setViewMode("unified");
    setCommandMode(false);
    setCmd("");
  }, []);

  const handleGUIBootComplete = useCallback(() => setHasPlayedGUIBoot(true), []);

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
          setTimeout(() => setCLICommandEcho(commandText.slice(0, index + 1)), index * CLI_COMMAND_TYPE_MS)
        );
      });
      cliCommandTimersRef.current.push(
        setTimeout(() => onComplete?.(), commandText.length * CLI_COMMAND_TYPE_MS + CLI_COMMAND_SETTLE_MS)
      );
    },
    [clearCLICommandPlayback]
  );

  const navigateCLI = useCallback(
    (tab: CLITab, commandText: string = tab) => {
      runCLICommandAnimation(commandText, () => {
        setCLITab(tab);
        setCLIView("section");
        setCLIInvalidMessage("");
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
    const input = normalizeCLICommand(rawInput);
    setCmd("");
    setCLIHistoryIndex(null);
    setCLIHistoryDraft("");
    setCommandMode(false);
    if (!input) return;

    setCLICommandHistory((previous) => [...previous, rawInput]);

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
    if (input === "gui" || input === "exit" || input === "minimize") {
      runCLICommandAnimation(rawInput, exitCLIFullscreen);
      return;
    }
    if (input === "github") {
      runCLICommandAnimation(rawInput, () => window.open("https://github.com/shivanirai08", "_blank"));
      return;
    }

    runCLICommandAnimation(rawInput, () => {
      void (async () => {
        const message = await fetchCLIUnknownMessage(rawInput);
        setCLIInvalidMessage(message);
        setCLIView("not-found");
      })();
    });
  }, [cmd, exitCLIFullscreen, fetchCLIUnknownMessage, navigateCLI, runCLICommandAnimation]);

  const handleCLIHistoryUp = useCallback(() => {
    if (!cliCommandHistory.length) return;
    if (cliHistoryIndex === null) {
      setCLIHistoryDraft(cmd);
      const nextIndex = cliCommandHistory.length - 1;
      setCLIHistoryIndex(nextIndex);
      setCmd(cliCommandHistory[nextIndex]);
      return;
    }
    const nextIndex = Math.max(0, cliHistoryIndex - 1);
    setCLIHistoryIndex(nextIndex);
    setCmd(cliCommandHistory[nextIndex]);
  }, [cliCommandHistory, cliHistoryIndex, cmd]);

  const handleCLIHistoryDown = useCallback(() => {
    if (!cliCommandHistory.length || cliHistoryIndex === null) return;
    if (cliHistoryIndex >= cliCommandHistory.length - 1) {
      setCLIHistoryIndex(null);
      setCmd(cliHistoryDraft);
      return;
    }
    const nextIndex = cliHistoryIndex + 1;
    setCLIHistoryIndex(nextIndex);
    setCmd(cliCommandHistory[nextIndex]);
  }, [cliCommandHistory, cliHistoryDraft, cliHistoryIndex]);

  const handleCommandChange = useCallback((value: string) => {
    setCmd(value);
    setCLIHistoryIndex(null);
    setCLIHistoryDraft("");
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isInput =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable;

      if (e.key === "Escape") {
        if (helpOpen) { setHelpOpen(false); return; }
        if (viewMode === "cli" && commandMode) { setCommandMode(false); setCmd(""); }
        return;
      }

      if (isInput || (viewMode === "cli" && commandMode)) return;

      if (viewMode === "unified") {
        if (e.key === "?") {
          e.preventDefault();
          setHelpOpen((v) => !v);
        }
        return;
      }

      if (viewMode === "cli") {
        if (e.key === "~" || ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "m")) {
          e.preventDefault();
          exitCLIFullscreen();
          return;
        }
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
  }, [commandMode, exitCLIFullscreen, helpOpen, moveCLITab, navigateCLI, viewMode]);

  const focusCommandBar = useCallback(() => {
    window.dispatchEvent(new CustomEvent("portfolio:focus-command"));
  }, []);

  const ActiveCLI = CLI_TABS[cliTab];

  if (viewMode === "unified") {
    return (
      <>
        <Shell
          activeSection={activeGUISection}
          onNavigate={(section) => {
            setActiveGUISection(section);
            scrollToGUISection(section);
          }}
          onFocusCommand={focusCommandBar}
          onOpenHelp={() => setHelpOpen(true)}
        >
          <GUIHome
            showBootSequence={!hasPlayedGUIBoot}
            onBootSequenceComplete={handleGUIBootComplete}
          />
          <footer className="relative mt-24 overflow-visible py-2 sm:py-4 md:py-8 lg:py-10">
            <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-[-56px] -translate-x-1/2">
              <div
                className="select-none whitespace-nowrap font-['Press_Start_2P',cursive] font-bold uppercase leading-none text-[#f7dfc0]/[0.12]"
                style={{ fontSize: "clamp(20px, 4vw - 5px, 72px)" }}
              >
                Design.Develop.Deliver.
              </div>
            </div>
            <div className="relative z-10 mx-auto w-full max-w-[1440px] px-5 pb-16 text-center text-[13px] text-[#5d564e] sm:px-8 lg:px-12 xl:px-16">
              Made with sharp pixels, late-night focus, and probably one more coffee.
            </div>
          </footer>
        </Shell>
        <CommandBar onEnterFullscreen={enterCLIFullscreen} />
        <HelpOverlay open={helpOpen} onClose={() => setHelpOpen(false)} unified />
      </>
    );
  }

  return (
    <div className="min-h-dvh overflow-x-hidden bg-[#0b0a09] text-[#ece5da]">
      <header className="sticky top-0 z-40 border-b border-[#24211d] bg-[#0b0a09]/92 backdrop-blur">
        <div className="mx-auto flex h-[68px] w-full max-w-[2400px] items-center justify-between px-5 sm:px-8 lg:px-12 xl:px-16">
          <span className="text-[16px] font-bold tracking-tight">{personal.initials}.</span>
          <div className="flex items-center gap-4">
            <span className="text-[12px] uppercase tracking-[0.18em] text-[#453f38]">
              terminal · fullscreen
            </span>
            <button
              type="button"
              onClick={exitCLIFullscreen}
              title="Exit to unified view (~)"
              className="inline-flex min-h-9 items-center gap-2 border border-[#38322b] bg-[#1a1715] px-4 py-2 text-[12px] text-[#a89f92] hover:text-[#ece5da]"
            >
              <Minimize2 size={14} strokeWidth={1.5} />
              exit
            </button>
          </div>
        </div>
      </header>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="relative h-[calc(100dvh-68px)]"
      >
        <main
          className={
            "h-full overflow-y-auto px-5 py-8 pb-32 sm:px-8 sm:pb-36 lg:px-12 xl:px-16 " +
            (cliView === "section" ? "overflow-y-auto " : "overflow-hidden ") +
            (cliView === "home" && !cliCommandEcho ? "flex items-center " : "") +
            (cliView === "not-found" ? "flex flex-col " : "")
          }
        >
          {cliCommandEcho && cliView !== "home" ? (
            <motion.div
              key={cliCommandEcho}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 flex items-center gap-2 border-b border-[#1e1b18] pb-5 text-[13px] text-[#6b625a]"
            >
              <span className="shrink-0 text-[#86b06a]">shivanirai@portfolio:~$</span>
              <span className="min-w-0 truncate text-[#ece5da]">
                {formatCLICommandForDisplay(cliCommandEcho)}
              </span>
              <span className="ml-1 inline-block h-[14px] w-[8px] animate-pulse bg-[#f7dfc0] align-[-2px]" />
            </motion.div>
          ) : null}

          <AnimatePresence mode="wait">
            <motion.div
              key={cliView === "section" ? cliTab : cliView}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className={"w-full " + (cliView === "not-found" ? "flex flex-1 items-center justify-center" : "")}
            >
              {cliView === "home" ? (
                <CLIHome onSelect={(tab) => navigateCLI(tab, tab)} />
              ) : cliView === "not-found" ? (
                <CLINotFound
                  message={cliInvalidMessage}
                  onSelect={(tab) => navigateCLI(tab, tab)}
                />
              ) : (
                <ActiveCLI />
              )}
            </motion.div>
          </AnimatePresence>
        </main>

        <div className="pointer-events-none fixed bottom-5 left-4 right-4 z-40 sm:left-6 sm:right-6 lg:left-10 lg:right-10 xl:left-14 xl:right-14">
          <StatusBar
            commandMode={commandMode}
            commandValue={cmd}
            onCommandChange={handleCommandChange}
            onCommandSubmit={executeCommand}
            onCommandCancel={() => {
              setCommandMode(false);
              setCmd("");
              setCLIHistoryIndex(null);
              setCLIHistoryDraft("");
            }}
            onCommandFocus={() => setCommandMode(true)}
            onCommandBlur={() => setCommandMode(false)}
            onCommandHistoryUp={handleCLIHistoryUp}
            onCommandHistoryDown={handleCLIHistoryDown}
            toast={toast}
            time={clock}
            cliMode
          />
        </div>
      </motion.div>

      <HelpOverlay open={helpOpen} onClose={() => setHelpOpen(false)} />
    </div>
  );
}

function CLIHome({ onSelect }: { onSelect: (tab: CLITab) => void }) {
  const sectionLinks: { tab: CLITab; label: string; hint: string }[] = [
    { tab: "about", label: "About", hint: ":about" },
    { tab: "projects", label: "Projects", hint: ":projects" },
    { tab: "experience", label: "Experience", hint: ":experience" },
    { tab: "skills", label: "Skills", hint: ":skills" },
    { tab: "contact", label: "Contact", hint: ":contact" },
  ];

  return (
    <div className="mx-auto w-full max-w-[960px] py-6 text-center">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mx-auto w-full max-w-[760px]"
      >
        <div className="mb-4 text-[11px] uppercase tracking-[0.28em] text-[#453f38]">
          terminal session ready
        </div>
        <h1 className="mb-5 font-['Press_Start_2P',cursive] text-[28px] leading-[1.4] text-[#f7dfc0] sm:text-[34px]">
          HELLO, I&apos;M {personal.name.toUpperCase()}
        </h1>
        <p className="mx-auto mb-3 max-w-[640px] text-[14px] leading-[1.9] text-[#a89f92]">
          {personal.intro}
        </p>
        <p className="mx-auto mb-12 max-w-[680px] text-[12px] leading-[1.8] text-[#6b625a]">
          Type a command in the terminal below or choose a section to explore this portfolio.
        </p>
        <div className="mb-10 flex flex-wrap items-center justify-center gap-3">
          {sectionLinks.map((item, index) => (
            <button
              key={item.tab}
              type="button"
              onClick={() => onSelect(item.tab)}
              className="border border-[#38322b] bg-[#121110] px-4 py-3 text-left transition-colors hover:border-[#8a7654] hover:bg-[#1a1715]"
            >
              <div className="text-[12px] text-[#ece5da]">
                ({index + 1}) {item.label}
              </div>
              <div className="mt-1 text-[11px] text-[#6b625a]">{item.hint}</div>
            </button>
          ))}
        </div>
        <div className="mx-auto max-w-[560px] border border-[#1e1b18] bg-[#100e0d] px-5 py-4 text-left text-[12px] leading-[1.9]">
          <div className="text-[#86b06a]">Suggested commands</div>
          <div className="mt-2 text-[#6b625a]">
            <span className="text-[#ece5da]">:projects</span> for selected work
            <span className="mx-3 text-[#453f38]">·</span>
            <span className="text-[#ece5da]">:contact</span> to reach out
          </div>
          <div className="text-[#6b625a]">
            <span className="text-[#ece5da]">:help</span> for shortcuts
            <span className="mx-3 text-[#453f38]">·</span>
            <span className="text-[#ece5da]">exit</span> or <span className="text-[#ece5da]">~</span> to return
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function CLINotFound({
  message,
  onSelect,
}: {
  message: string;
  onSelect: (tab: CLITab) => void;
}) {
  const quickLinks: { tab: CLITab; label: string }[] = [
    { tab: "projects", label: "projects" },
    { tab: "about", label: "about" },
    { tab: "experience", label: "experience" },
    { tab: "skills", label: "skills" },
    { tab: "contact", label: "contact" },
  ];
  const responseLines = message
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, 1);

  return (
    <div className="mx-auto flex min-h-[calc(100dvh-220px)] max-w-[960px] flex-col items-center justify-center text-center">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <div className="mb-6 text-[11px] uppercase tracking-[0.28em] text-[#453f38]">
          invalid terminal route
        </div>
        <div className="mb-6 font-['Press_Start_2P',cursive] text-[48px] leading-none text-[#f7dfc0] sm:text-[72px]">
          FOUR-O-FOUR
        </div>
        {responseLines.length > 0 ? (
          <div className="mb-6 space-y-1 text-md text-[#a89f92]">
            {responseLines.map((line, index) => (
              <div key={`${line}-${index}`}>{line}</div>
            ))}
          </div>
        ) : (
          <div className="mb-6 text-[13px] text-[#a89f92]">Try one of the valid routes below.</div>
        )}
        <div className="mb-3 text-[13px] text-[#6b625a]">try any of the links below</div>
        <div className="flex flex-wrap items-center justify-center gap-3 text-[13px]">
          {quickLinks.map((item) => (
            <button
              key={item.tab}
              type="button"
              onClick={() => onSelect(item.tab)}
              className="border border-[#38322b] px-3 py-2 text-[#c3c7f4] transition-colors hover:border-[#c3c7f4] hover:text-[#ece5da]"
            >
              [{item.label}]
            </button>
          ))}
          <span className="text-[#453f38]">or type</span>
          <span className="text-[#86b06a]">:help</span>
        </div>
      </motion.div>
    </div>
  );
}
