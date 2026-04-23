"use client";

type Props = {
  mode: "gui" | "cli";
  onToggle: () => void;
};

export default function ModeToggle({ mode, onToggle }: Props) {
  return (
    <div
      className="inline-flex items-center bg-[#161616] border border-[#242428] text-[12px] tracking-[0.14em] font-medium select-none"
      title="Press ~ to toggle"
    >
      <button
        onClick={() => mode === "cli" && onToggle()}
        style={mode === "gui" ? { backgroundColor: "#ffddc0" } : undefined}
        className={
          mode === "gui"
            ? "inline-flex min-h-9 items-center justify-center px-4 py-2 leading-none text-[#0a0a0b] transition-colors duration-150 cursor-pointer"
            : "inline-flex min-h-9 items-center justify-center px-4 py-2 leading-none text-[#7c7c85] hover:text-[#e8e8ea] transition-colors duration-150 cursor-pointer"
        }
      >
        GUI
      </button>
      <button
        onClick={() => mode === "gui" && onToggle()}
        style={mode === "cli" ? { backgroundColor: "#ffddc0" } : undefined}
        className={
          mode === "cli"
            ? "inline-flex min-h-9 items-center justify-center px-4 py-2 leading-none text-[#0a0a0b] transition-colors duration-150 cursor-pointer"
            : "inline-flex min-h-9 items-center justify-center px-4 py-2 leading-none text-[#7c7c85] hover:text-[#e8e8ea] transition-colors duration-150 cursor-pointer"
        }
      >
        CLI
      </button>
      {/* <span className="ml-2 mr-2 text-[#4a4a52] text-[10px]">~</span> */}
    </div>
  );
}
