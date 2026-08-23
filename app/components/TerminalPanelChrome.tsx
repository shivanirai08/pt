"use client";

import { ChevronDown, ChevronUp, Minimize2, X } from "lucide-react";

type Props = {
  onClear?: () => void;
  onMinimize?: () => void;
  onClose?: () => void;
  heightVh?: number;
  onIncreaseHeight?: () => void;
  onDecreaseHeight?: () => void;
  showHeightControls?: boolean;
  minimizeLabel?: string;
};

export default function TerminalPanelChrome({
  onClear,
  onMinimize,
  onClose,
  heightVh,
  onIncreaseHeight,
  onDecreaseHeight,
  showHeightControls = false,
  minimizeLabel = "minimize",
}: Props) {
  const actionClass =
    "inline-flex items-center gap-1.5 border border-[#38322b] bg-[#151519] px-2.5 py-1 text-[11px] text-[#d0d0d4] transition-colors hover:border-[#ffddc0]/40 hover:text-[#ffddc0]";

  return (
    <div className="flex items-center justify-between gap-3 border-b border-[#242428] bg-[#0d0d10] px-4 py-2.5">
      <div className="flex min-w-0 items-center gap-3 text-xs text-[#7c7c85]">
        <span className="flex shrink-0 gap-1.5">
          <span className="h-2 w-2 rounded-full bg-[#4a4a52]" />
          <span className="h-2 w-2 rounded-full bg-[#4a4a52]" />
          <span className="h-2 w-2 rounded-full bg-[#4a4a52]" />
        </span>
        <span className="truncate">shivanirai@portfolio: ~ — zsh</span>
        {showHeightControls && heightVh != null ? (
          <span className="hidden shrink-0 text-[10px] text-[#4a4a52] sm:inline">{heightVh}vh</span>
        ) : null}
      </div>

      <div className="flex shrink-0 items-center gap-2">
        {showHeightControls && onDecreaseHeight && onIncreaseHeight ? (
          <div className="flex items-center gap-1 border border-[#38322b] bg-[#151519] p-0.5">
            <button
              type="button"
              onClick={onDecreaseHeight}
              title="Decrease terminal height"
              className="inline-flex h-7 w-7 items-center justify-center text-[#a8a8ad] transition-colors hover:bg-[#1a1a1f] hover:text-[#ffddc0]"
            >
              <ChevronDown size={14} strokeWidth={1.5} />
            </button>
            <button
              type="button"
              onClick={onIncreaseHeight}
              title="Increase terminal height"
              className="inline-flex h-7 w-7 items-center justify-center text-[#a8a8ad] transition-colors hover:bg-[#1a1a1f] hover:text-[#ffddc0]"
            >
              <ChevronUp size={14} strokeWidth={1.5} />
            </button>
          </div>
        ) : null}

        {onClear ? (
          <button type="button" onClick={onClear} className={actionClass}>
            clear
          </button>
        ) : null}

        {onMinimize ? (
          <button type="button" onClick={onMinimize} className={actionClass} title="Minimize terminal">
            <Minimize2 size={12} strokeWidth={1.5} />
            <span className="hidden sm:inline">{minimizeLabel}</span>
          </button>
        ) : null}

        {onClose ? (
          <button type="button" onClick={onClose} className={actionClass}>
            esc <X size={12} strokeWidth={1.5} />
          </button>
        ) : null}
      </div>
    </div>
  );
}
