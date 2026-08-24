"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { defaultPortfolioContent, type PortfolioContent } from "../types/portfolio";

const PortfolioContext = createContext<PortfolioContent | null>(null);

export function PortfolioProvider({ children }: { children: React.ReactNode }) {
  const [content, setContent] = useState<PortfolioContent | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/content")
      .then((res) => (res.ok ? res.json() : defaultPortfolioContent))
      .then((data: PortfolioContent) => {
        if (!cancelled) setContent(data);
      })
      .catch(() => {
        if (!cancelled) setContent(defaultPortfolioContent);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!content) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-[#0a0a0b] text-sm text-[#7c7c85]">
        Loading portfolio…
      </div>
    );
  }

  return <PortfolioContext.Provider value={content}>{children}</PortfolioContext.Provider>;
}

export function usePortfolio(): PortfolioContent {
  const content = useContext(PortfolioContext);
  if (!content) {
    throw new Error("usePortfolio must be used within PortfolioProvider");
  }
  return content;
}
