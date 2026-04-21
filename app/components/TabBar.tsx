"use client";

import { motion } from "framer-motion";
import { tabs } from "../data";

type Props = {
  activeTab: string;
  onTabChange: (key: string) => void;
};

export default function TabBar({ activeTab, onTabChange }: Props) {
  return (
    <div className="flex items-center gap-2 px-8 pt-2 pb-5 text-[13px] border-b border-[#161619]">
      {tabs.map((t) => {
        const active = t.key === activeTab;
        return (
          <button
            key={t.key}
            onClick={() => onTabChange(t.key)}
            className={
              "relative px-4 py-2 transition-colors duration-150 " +
              (active
                ? "text-[#0a0a0b]"
                : "text-[#a8a8ad] hover:text-[#e8e8ea]")
            }
          >
            {active && (
              <motion.div
                layoutId="tab-bg"
                className="absolute inset-0 bg-[#e8e8ea]"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10">
              <span className={active ? "text-[#0a0a0b]/70" : "text-[#4a4a52]"}>
                ({t.num})
              </span>
              <span className="ml-1.5">{t.label}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
