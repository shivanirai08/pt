"use client";

import { motion } from "framer-motion";
import { gsap, reducedMotion } from "./gsap";
import { STOPS } from "./tour";
import { usePortfolio } from "../context/PortfolioContext";

/** Floating top nav: a roundel home, section links with a gliding ink pill, and the resume. */
export default function Nav({ active }: { active: string }) {
  const { personal: p } = usePortfolio();

  const go = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    gsap.to(window, {
      scrollTo: { y: id === "platform" ? 0 : el, autoKill: true },
      duration: reducedMotion() ? 0 : 1.3,
      ease: "power3.inOut",
    });
  };

  return (
    <nav className="nav" aria-label="Sections">
      <button className="home" onClick={() => go("platform")} aria-label={`${p.fullName}, back to top`} data-cursor="Top">
        {p.initials}
      </button>
      <ol>
        {STOPS.filter((s) => s.id !== "platform").map((s) => {
          const on = s.id === active;
          return (
            <li key={s.id}>
              <button onClick={() => go(s.id)} aria-current={on ? "location" : undefined} data-cursor="Go">
                {on && <motion.span layoutId="nav-pill" className="pill-bg" transition={{ type: "spring", stiffness: 420, damping: 34 }} />}
                <span>{s.label}</span>
              </button>
            </li>
          );
        })}
      </ol>
      <a className="nav-cta" href={p.resumeUrl} target="_blank" rel="noreferrer" data-cursor="Open">
        Resume
      </a>
    </nav>
  );
}
