"use client";

import { useRef } from "react";
import { gsap, useGSAP, reducedMotion } from "./gsap";
import { usePortfolio } from "../context/PortfolioContext";

/** Split the headline into up to three lines; each line ends with a small project pill. */
function lines(words: string[]) {
  const n = Math.min(3, words.length);
  const size = Math.ceil(words.length / n);
  const out: string[][] = [];
  for (let i = 0; i < words.length; i += size) out.push(words.slice(i, i + size));
  return out;
}

export default function Hero() {
  const c = usePortfolio();
  const p = c.personal;
  const ref = useRef<HTMLElement>(null);
  const projects = [...c.projects].sort((a, b) => Number(!!b.head) - Number(!!a.head));
  const rows = lines(p.headline.split(" "));

  useGSAP(
    () => {
      if (reducedMotion()) return;
      const hero = ref.current!;
      gsap
        .timeline({ defaults: { ease: "expo.out" } })
        .from(".hero h1 .w > span", { yPercent: 110, duration: 1.2, stagger: 0.08 }, 0.1)
        .from(".pillimg", { scale: 0.4, opacity: 0, duration: 1, stagger: 0.12 }, 0.7)
        .from(".hero-rise", { y: 18, opacity: 0, duration: 0.9, stagger: 0.08 }, 0.8);

      // A whisper of pointer response: the little project pills drift slightly.
      const pills = gsap.utils.toArray<HTMLElement>(".pillimg", hero);
      const movers = pills.map((el, i) => ({
        x: gsap.quickTo(el, "x", { duration: 1.1, ease: "power3" }),
        y: gsap.quickTo(el, "y", { duration: 1.1, ease: "power3" }),
        k: 10 + i * 5,
      }));
      const onMove = (e: PointerEvent) => {
        const nx = e.clientX / window.innerWidth - 0.5;
        const ny = e.clientY / window.innerHeight - 0.5;
        movers.forEach((m) => {
          m.x(nx * m.k);
          m.y(ny * m.k);
        });
      };
      window.addEventListener("pointermove", onMove, { passive: true });
      return () => window.removeEventListener("pointermove", onMove);
    },
    { scope: ref }
  );

  const goWork = () => gsap.to(window, { scrollTo: { y: "#work" }, duration: reducedMotion() ? 0 : 1.3, ease: "power3.inOut" });
  let pi = 0;

  return (
    <section id="platform" ref={ref} className="hero" data-station="platform">
      <div className="wrap">
        <h1 aria-label={p.headline}>
          {rows.map((row, ri) => {
            const proj = projects[pi++ % Math.max(projects.length, 1)];
            return (
              <span className="line" key={ri} aria-hidden="true">
                {row.map((word, wi) => (
                  <span className={`w${ri === rows.length - 1 && wi === row.length - 1 ? " soft" : ""}`} key={wi}>
                    <span>{word}</span>
                    {" "}
                  </span>
                ))}
                {proj && (
                  <span className="pillimg">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={proj.image} alt="" />
                  </span>
                )}
              </span>
            );
          })}
        </h1>
        <p className="hero-who hero-rise">
          {p.fullName}, {p.tagline}.
        </p>
        <p className="hero-sub hero-rise">{p.intro}</p>
        <div className="hero-actions hero-rise">
          <button className="btn magnetic" onClick={goWork} data-cursor="Scroll">
            See my work
          </button>
          <a className="btn is-soft magnetic" href={p.resumeUrl} target="_blank" rel="noreferrer" data-cursor="Open">
            Resume
          </a>
        </div>
        {p.status === "open_to_work" && (
          <p className="status hero-rise">
            <i aria-hidden="true" />
            Open to work · replies in {p.responseTime}
          </p>
        )}
      </div>
    </section>
  );
}
