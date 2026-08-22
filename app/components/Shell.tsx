"use client";

import { personal } from "../data";

type GUISection = "about" | "projects" | "experience" | "contact";

const NAV: GUISection[] = ["experience", "projects", "about", "contact"];

type Props = {
  activeSection: GUISection;
  onNavigate: (section: GUISection) => void;
  onFocusCommand: () => void;
  onOpenHelp: () => void;
  children: React.ReactNode;
};

export default function Shell({
  activeSection,
  onNavigate,
  onFocusCommand,
  onOpenHelp,
  children,
}: Props) {
  return (
    <div className="min-h-dvh bg-[#0a0a0b] text-[#e8e8ea]">
      <header className="sticky top-0 z-40 border-b border-[#16161a] bg-[#0a0a0b]/92 backdrop-blur">
        <div className="mx-auto flex h-[68px] w-full max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:px-12 xl:px-16">
          <button
            type="button"
            onClick={() => document.getElementById("hero")?.scrollIntoView({ behavior: "smooth" })}
            className="text-[16px] font-bold tracking-tight text-[#e8e8ea]"
          >
            {personal.initials}.
          </button>

          <div className="flex items-center gap-6">
            <nav className="hidden min-h-[20px] items-center md:flex">
              <div className="flex items-center gap-8 text-[14px] text-[#a8a8ad]">
                {NAV.map((section) => {
                  const isActive = section === activeSection;
                  return (
                    <button
                      key={section}
                      type="button"
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
              </div>
            </nav>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onOpenHelp}
                title="Help"
                className="border border-[#242428] bg-[#161616] px-2.5 py-1.5 text-[12px] text-[#a8a8ad] hover:text-[#e8e8ea]"
              >
                ?
              </button>
              <button
                type="button"
                onClick={onFocusCommand}
                title="Command palette"
                className="border border-[#242428] bg-[#161616] px-2.5 py-1.5 text-[12px] text-[#a8a8ad] hover:text-[#e8e8ea]"
              >
                ⌘K
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="pb-14">{children}</main>
    </div>
  );
}
