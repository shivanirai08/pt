"use client";

import { useState, useEffect, useCallback, useRef, useLayoutEffect } from "react";
import { LayoutGroup } from "framer-motion";
import Shell from "./components/Shell";
import CommandBar from "./components/CommandBar";
import FullscreenTerminal from "./components/FullscreenTerminal";
import HelpOverlay from "./components/HelpOverlay";
import type { Entry } from "./components/TerminalOutput";
import GUIHome from "./gui/Home";

type ViewMode = "unified" | "cli";
type GUISection = "about" | "projects" | "experience" | "contact";

export default function Page() {
  const [viewMode, setViewMode] = useState<ViewMode>("unified");
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [terminalEntries, setTerminalEntries] = useState<Entry[]>([]);
  const [terminalDraft, setTerminalDraft] = useState("");
  const [helpOpen, setHelpOpen] = useState(false);
  const [clock, setClock] = useState("");
  const [hasPlayedGUIBoot, setHasPlayedGUIBoot] = useState(false);
  const [activeGUISection, setActiveGUISection] = useState<GUISection>("experience");
  const terminalEntryCounter = useRef(0);

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
    const sections = ["experience", "projects", "about", "contact"] as const;
    let frameId = 0;
    const syncScrollState = () => {
      const markerY = window.scrollY + 180;
      let currentSection: GUISection = "experience";
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

  const scrollToGUISection = useCallback((section: GUISection) => {
    document.getElementById(section)?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const enterCLIFullscreen = useCallback((draft?: string) => {
    setTerminalDraft(draft ?? "");
    setViewMode("cli");
    window.scrollTo(0, 0);
  }, []);

  const exitCLIFullscreen = useCallback(() => {
    setViewMode("unified");
    setTerminalDraft("");
  }, []);

  const handleGUIBootComplete = useCallback(() => setHasPlayedGUIBoot(true), []);

  const focusCommandBar = useCallback(() => {
    window.dispatchEvent(new CustomEvent("portfolio:focus-command"));
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isInput =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable;

      if (e.key === "Escape" && helpOpen) {
        setHelpOpen(false);
        return;
      }

      if (isInput) return;

      if (viewMode === "unified" && e.key === "?") {
        e.preventDefault();
        setHelpOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [helpOpen, viewMode]);

  return (
    <LayoutGroup id="terminal">
      {viewMode === "unified" ? (
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
              <div
                aria-hidden="true"
                className="pointer-events-none absolute left-1/2 top-[-56px] -translate-x-1/2"
              >
                <div
                  className="select-none whitespace-nowrap font-['Press_Start_2P',cursive] font-bold uppercase leading-none text-[#ffddc0]/[0.12]"
                  style={{ fontSize: "clamp(20px, 4vw - 5px, 72px)" }}
                >
                  Design.Develop.Deliver.
                </div>
              </div>
              <div className="relative z-10 mx-auto w-full max-w-[1440px] px-5 pb-16 text-center text-[13px] text-[#5b5b62] sm:px-8 lg:px-12 xl:px-16">
                Made with sharp pixels, late-night focus, and probably one more coffee.
              </div>
            </footer>
          </Shell>
          <CommandBar
            entries={terminalEntries}
            setEntries={setTerminalEntries}
            history={commandHistory}
            setHistory={setCommandHistory}
            entryCounter={terminalEntryCounter}
            onEnterFullscreen={enterCLIFullscreen}
            onOpenHelp={() => setHelpOpen(true)}
            time={clock}
          />
          <HelpOverlay open={helpOpen} onClose={() => setHelpOpen(false)} unified />
        </>
      ) : (
        <>
          <FullscreenTerminal
            entries={terminalEntries}
            setEntries={setTerminalEntries}
            history={commandHistory}
            setHistory={setCommandHistory}
            entryCounter={terminalEntryCounter}
            initialDraft={terminalDraft}
            time={clock}
            onExit={exitCLIFullscreen}
            onOpenHelp={() => setHelpOpen(true)}
          />
          <HelpOverlay open={helpOpen} onClose={() => setHelpOpen(false)} />
        </>
      )}
    </LayoutGroup>
  );
}
