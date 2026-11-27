"use client";

import { useRef } from "react";
import { gsap, useGSAP, reducedMotion } from "./gsap";
import { usePortfolio } from "../context/PortfolioContext";

const BG = ["var(--pink)", "var(--lav)", "var(--sky)", "var(--cream)", "var(--mint)"];
const COLS = 3;
const TILE = 94;
const ROW = 48;

const label = (s: string) => {
  const t = s.replace("/", "");
  return t.length <= 2 ? t.toUpperCase() : t.charAt(0).toUpperCase() + t.slice(1);
};

/**
 * Each skill group is a folder. As it scrolls into view the skills rise out of it
 * and settle in a loose fan above the pocket.
 */
export default function Toolbox() {
  const c = usePortfolio();
  const ref = useRef<HTMLElement>(null);

  const notes = [
    ["Reading", c.aboutCurrently.reading],
    ["Building", c.aboutCurrently.building],
    ["Learning", c.aboutCurrently.learning],
    ["Listening", c.aboutCurrently.listening],
  ].filter(([, v]) => v) as [string, string][];

  useGSAP(
    () => {
      const reduced = reducedMotion();
      const cells = gsap.utils.toArray<HTMLElement>(".fcell");

      cells.forEach((cell) => {
        const items = gsap.utils.toArray<HTMLElement>(".sk", cell);
        const n = items.length;
        const rot = items.map((_, i) => ((i * 37) % 11) - 5); // stable, small tilts
        const target = (i: number) => {
          const col = i % COLS;
          const row = Math.floor(i / COLS);
          const inRow = Math.min(COLS, n - row * COLS);
          const offset = col - (inRow - 1) / 2;
          return { x: offset * TILE, y: -(118 + row * ROW), rotate: rot[i] };
        };

        if (reduced) {
          items.forEach((el, i) => gsap.set(el, target(i)));
          return;
        }
        gsap.set(items, { x: 0, y: 0, rotate: 0 });
        gsap.to(items, {
          x: (i) => target(i).x,
          y: (i) => target(i).y,
          rotate: (i) => target(i).rotate,
          ease: "power2.out",
          stagger: { each: 0.06, from: "start" },
          scrollTrigger: { trigger: cell, start: "top 88%", end: "top 38%", scrub: 0.7 },
        });
      });

      if (reduced) return;
      gsap.from(".note", {
        y: 50,
        opacity: 0,
        duration: 0.9,
        stagger: 0.1,
        ease: "expo.out",
        scrollTrigger: { trigger: ".notes", start: "top 90%", once: true },
      });
      gsap.from(".toolbox .h2, .toolbox .sect-lead", {
        y: 40,
        opacity: 0,
        duration: 0.9,
        stagger: 0.1,
        ease: "expo.out",
        scrollTrigger: { trigger: ".toolbox .h2", start: "top 88%", once: true },
      });
    },
    { scope: ref }
  );

  return (
    <section id="toolbox" ref={ref} className="toolbox" data-station="toolbox">
      <div className="wrap">
        <h2 className="h2">
          What&apos;s in the <mark>toolbox</mark>
        </h2>
        <p className="sect-lead">{c.personal.description}</p>

        <div className="shelf">
          {c.aboutStack.map((row, i) => {
            const items = row.items.split("·").map((s) => s.trim()).filter(Boolean);
            const rows = Math.ceil(items.length / COLS);
            return (
              <div className="fcell" key={row.label} style={{ ["--rows" as string]: rows }}>
                <div className="folder" style={{ ["--bg-card" as string]: BG[i % BG.length] }}>
                  <div className="folder-back" />
                  <ul className="folder-items" aria-label={`${label(row.label)} skills`}>
                    {items.map((it) => (
                      <li className="sk" key={it}>
                        {it}
                      </li>
                    ))}
                  </ul>
                  <div className="folder-front">
                    <h3>{label(row.label)}</h3>
                    <span>{items.length}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <ul className="notes" aria-label="Currently">
          {notes.map(([k, v], i) => (
            <li className="note" key={k} style={{ ["--bg-card" as string]: BG[(i + 1) % BG.length] }}>
              <b>{k}</b>
              <span>{v.replace(/["“”]/g, "")}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
