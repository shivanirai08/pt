"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MousePointer2, FileText, GitBranch } from "lucide-react";
import ModeToggle from "./components/ModeToggle";
import TabBar from "./components/TabBar";
import StatusBar from "./components/StatusBar";
import HelpOverlay from "./components/HelpOverlay";
import GUIHome from "./gui/Home";
import CLIAbout from "./cli/About";
import CLIProjects from "./cli/Projects";
import CLIExperience from "./cli/Experience";
import CLISkills from "./cli/Skills";
import CLIContact from "./cli/Contact";
import { personal, socials, asciiLogo } from "./data";

type Mode = "gui" | "cli";
type CLITab = "about" | "projects" | "experience" | "skills" | "contact";

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

  // Scroll detection for GUI header
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const pushToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3200);
  }, []);

  const toggleMode = useCallback(() => {
    setMode((m) => (m === "gui" ? "cli" : "gui"));
    window.scrollTo({ top: 0, behavior: "smooth" });
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
    if (input === "gui") { setMode("gui"); return; }

    pushToast(`command not found: :${input} — try :help`);
  }, [cmd, pushToast]);

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
      <AnimatePresence mode="wait">
        {mode === "gui" ? (
          <motion.div
            key="gui"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* GUI Header */}
            <header
              className={
                "sticky top-0 z-30 transition-colors duration-200 " +
                (scrolled
                  ? "bg-[#0a0a0b]/90 backdrop-blur border-b border-[#16161a]"
                  : "bg-transparent")
              }
            >
              <div className="gui-shell h-[68px] flex items-center justify-between">
                <span className="text-[#e8e8ea] font-bold tracking-tight text-[16px]">
                  {personal.initials}.
                </span>
                <nav className="hidden md:flex items-center gap-8 text-[14px] text-[#a8a8ad]">
                  <a href="#about" className="hover:text-[#e8e8ea] transition-colors">about</a>
                  <a href="#projects" className="hover:text-[#e8e8ea] transition-colors">projects</a>
                  <a href="#experience" className="hover:text-[#e8e8ea] transition-colors">experience</a>
                  <a href="#contact" className="hover:text-[#e8e8ea] transition-colors">contact</a>
                </nav>
                <ModeToggle mode="gui" onToggle={toggleMode} />
              </div>
            </header>

            <main>
              <GUIHome onSwitchToCLI={() => setMode("cli")} />
            </main>

            {/* GUI Footer */}
            <footer className="border-t border-[#16161a] mt-24 py-10">
              <div className="gui-shell flex items-center justify-between text-[13px] text-[#4a4a52]">
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
            className="flex flex-col min-h-dvh"
          >
            {/* CLI Header */}
            <header className="px-8 pt-6 pb-4 flex items-start justify-between">
              <div className="flex items-start gap-10">
                <pre className="text-[11px] text-[#e8e8ea] leading-[1.05] font-medium">
                  {asciiLogo}
                </pre>
                <div className="pt-1 text-[12.5px] leading-[1.7]">
                  {[
                    ["Name", personal.fullName],
                    ["Location", personal.location],
                    ["Handle", personal.handle],
                    ["Editor", personal.editor],
                  ].map(([k, v]) => (
                    <div key={k} className="flex gap-8">
                      <span className="w-[74px] text-[#7c7c85]">{k}</span>
                      <span className="text-[#e8e8ea]">{v}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex items-start gap-5 text-[12px] pt-1">
                <button
                  onClick={() => setMode("gui")}
                  className="text-[#7c7c85] hover:text-[#e8e8ea] flex items-center gap-1.5 transition-colors"
                  title="Switch to GUI mode (~)"
                >
                  <MousePointer2 size={12} /> GUI mode
                  <span className="ml-1 text-[10px] bg-[#1d1d22] border border-[#242428] px-1 text-[#7c7c85]">
                    ~
                  </span>
                </button>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#7c7c85] hover:text-[#e8e8ea] flex items-center gap-1.5 transition-colors"
                >
                  <GitBranch size={12} /> Github
                </a>
              </div>
            </header>

            <TabBar
              activeTab={cliTab}
              onTabChange={(key) => setCLITab(key as CLITab)}
            />

            <main className="flex-1 px-8 py-8 min-h-0 overflow-y-auto">
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
          </motion.div>
        )}
      </AnimatePresence>

      <HelpOverlay open={helpOpen} onClose={() => setHelpOpen(false)} />
    </div>
  );
}

