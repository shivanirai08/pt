"use client";

import { skillProcessRows } from "../data";

function stateClass(state: string) {
  if (state === "RUNNING") return "text-[#3fb950]";
  if (state === "LEARNING") return "text-[#d4b483]";
  return "text-[#8b8b92]";
}

function ProcessRow({ row }: { row: (typeof skillProcessRows)[number] }) {
  return (
    <div className="grid grid-cols-[44px_minmax(0,1fr)_110px] gap-2 text-[#a8a8ad] md:grid-cols-[52px_1.2fr_80px_80px_120px] md:gap-3">
      <span>{row.pid}</span>
      <span>{row.skill}</span>
      <span className="hidden md:block">{row.years}</span>
      <span className="hidden md:block">{row.projects}</span>
      <span className={stateClass(row.state)}>{row.state}</span>
    </div>
  );
}

type Props = {
  compact?: boolean;
};

export default function SkillsProcessTable({ compact = false }: Props) {
  const runningCount = skillProcessRows.filter((r) => r.state === "RUNNING").length;
  const learningCount = skillProcessRows.filter((r) => r.state === "LEARNING").length;

  return (
    <div className={compact ? "text-[12px]" : "max-w-[1040px] text-[13px]"}>
      <div
        className={`flex items-center gap-2 border-b border-[#16161a] text-[12px] ${
          compact ? "pb-2 mb-3" : "pb-4 mb-5"
        }`}
      >
        <span className="text-[#7c7c85]">&gt;</span>
        <span className="text-[#e8e8ea]">skills</span>
        <span className="text-[#3fb950]">--watch</span>
      </div>

      <div className={`text-[12px] text-[#555a64] ${compact ? "mb-2" : "mb-3"}`}>
        top <span className="hidden sm:inline">· 17:38</span> · uptime 4y 280d ·{" "}
        <span className="text-[#d4b483]">{learningCount} learning</span> ·{" "}
        <span className="text-[#3fb950]">{runningCount} running</span> · 0 zombies
      </div>

      <div className={`text-[#8b8b92] ${compact ? "mb-2 text-[12px]" : "mb-4 text-[13px]"}`}>
        Tasks: <span className="text-[#d0d0d4]">{skillProcessRows.length} total</span>,{" "}
        <span className="text-[#3fb950]">{runningCount} running</span>,{" "}
        <span className="text-[#d4b483]">{learningCount} learning</span>
        {!compact && (
          <span className="ml-4 text-[#666a73]">CPU usage mapped from project frequency x recency</span>
        )}
      </div>

      <div className="rounded border border-[#242428] bg-[#111114] px-4 py-4">
        <div className="grid grid-cols-[44px_minmax(0,1fr)_110px] gap-2 bg-[#1a1a1f] px-3 py-1.5 text-[12px] text-[#a8a8ad] md:grid-cols-[52px_1.2fr_80px_80px_120px] md:gap-3">
          <span>PID</span>
          <span>SKILL</span>
          <span className="hidden md:block">TIME</span>
          <span className="hidden md:block">PROJECTS</span>
          <span>STATE</span>
        </div>

        <div className="space-y-0.5 px-3 py-1.5 text-[13px] text-[#2b2b31]">·</div>

        <div className="space-y-1 px-3 text-[13px] leading-[1.35]">
          {skillProcessRows.slice(0, 9).map((row) => (
            <ProcessRow key={row.pid} row={row} />
          ))}
        </div>

        <div className="space-y-0.5 px-3 py-1.5 text-[13px] text-[#2b2b31]">·</div>

        <div className="space-y-1 px-3 text-[13px] leading-[1.35]">
          {skillProcessRows.slice(9).map((row) => (
            <ProcessRow key={row.pid} row={row} />
          ))}
        </div>
      </div>

      <div
        className={`flex items-center justify-between border-t border-[#16161a] text-[12px] ${
          compact ? "mt-4 pt-3" : "mt-8 pt-4"
        }`}
      >
        <div className="text-[#6b7078]">
          <span className="text-[#3fb950]">RUNNING</span> = used this quarter
          <span className="mx-2 text-[#3f434b]">·</span>
          <span className="text-[#8b8b92]">IDLE</span> = warm but not active
          <span className="mx-2 text-[#3f434b]">·</span>
          <span className="text-[#d4b483]">LEARNING</span> = ramping up
        </div>
        {!compact && (
          <div className="hidden text-[#8b8b92] sm:block">
            refresh: <span className="text-[#d0d0d4]">2s</span>
          </div>
        )}
      </div>
    </div>
  );
}
