"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP, reducedMotion } from "./gsap";
import { usePortfolio } from "../context/PortfolioContext";
import type { Project } from "../types/portfolio";

const clean = (s: string) => s.replace(/^feat:\s*/i, "");
// Each project ships two captures: name2.png (wide) and name.png (alternate).
const otherShot = (src: string) => (/2\.\w+$/.test(src) ? src.replace(/2(\.\w+)$/, "$1") : src);
const host = (p: Project) => {
  try {
    return new URL(p.links[0].url).host.replace(/^www\./, "");
  } catch {
    return clean(p.name).toLowerCase().replace(/\s+/g, "") + ".app";
  }
};
const BG = ["var(--cream)", "var(--pink)", "var(--lav)", "var(--sky)"];

/** Screenshot with cursor-driven 3D tilt, glare, and a wipe between two captures. */
function Shot({ project }: { project: Project }) {
  const inner = useRef<HTMLDivElement>(null);
  const [alt, setAlt] = useState(false);

  const move = (e: React.PointerEvent) => {
    if (reducedMotion() || !inner.current) return;
    const r = inner.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    gsap.to(inner.current, {
      rotateY: (px - 0.5) * 12,
      rotateX: (0.5 - py) * 10,
      transformPerspective: 900,
      duration: 0.4,
      ease: "power3.out",
    });
    inner.current.style.setProperty("--gx", `${px * 100}%`);
    inner.current.style.setProperty("--gy", `${py * 100}%`);
  };
  const leave = () => {
    if (inner.current) gsap.to(inner.current, { rotateX: 0, rotateY: 0, duration: 0.8, ease: "elastic.out(1, 0.5)" });
  };

  return (
    <div className="shot" onPointerMove={move} onPointerLeave={leave}>
      <button
        type="button"
        className="shot-btn"
        onClick={() => setAlt((v) => !v)}
        data-cursor="Flip"
        aria-label={`Show the other screenshot of ${clean(project.name)}`}
      >
        <div ref={inner} className={`shot-inner${alt ? " is-alt" : ""}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={project.image} alt="" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="b" src={otherShot(project.image)} alt={`${clean(project.name)} screenshot`} />
          <span className="shot-glare" />
          <span className="shot-hint">{alt ? "2 / 2" : "1 / 2"} · click to flip</span>
        </div>
      </button>
    </div>
  );
}

export default function Work() {
  const { projects } = usePortfolio();
  const ref = useRef<HTMLElement>(null);
  const ordered = [...projects].sort((a, b) => (b.dateSort ?? 0) - (a.dateSort ?? 0));

  useGSAP(
    () => {
      if (reducedMotion()) return;
      gsap.from(".work .h2, .work .sect-lead", {
        y: 50,
        opacity: 0,
        duration: 0.9,
        stagger: 0.1,
        ease: "expo.out",
        scrollTrigger: { trigger: ".work .h2", start: "top 88%", once: true },
      });

      // Cards stack: each one settles back as the next slides over it.
      const mm = gsap.matchMedia();
      mm.add("(min-width: 960px) and (min-height: 720px)", () => {
        const cards = gsap.utils.toArray<HTMLElement>(".pcard");
        cards.forEach((card, i) => {
          const next = cards[i + 1];
          if (!next) return;
          gsap.to(card, {
            scale: 0.95,
            opacity: 0.96,
            ease: "none",
            scrollTrigger: { trigger: next, start: "top 90%", end: "top 140px", scrub: true },
          });
        });
      });
      return () => mm.revert();
    },
    { scope: ref }
  );

  return (
    <section id="work" ref={ref} className="work" data-station="work">
      <div className="wrap">
        <div >
          <h2 className="h2">
            Things I&apos;ve <mark>shipped</mark>
          </h2>
          <p className="sect-lead">{projects.length} products, built end to end. Click a screenshot to flip it.</p>
        </div>

        <div className="stack">
          {ordered.map((pr, i) => (
            <article key={pr.id} className="pcard" style={{ ["--bg-card" as string]: BG[i % BG.length], ["--i" as string]: i }}>
              <div className="phead">
                <div>
                  <div className="pmeta">
                    <span className="pill">{pr.status}</span>
                    <span>{pr.date}</span>
                    <span>· {pr.role}</span>
                  </div>
                  <h3>{clean(pr.name)}</h3>
                </div>
                <div className="links">
                  {pr.links.map((l, li) => (
                    <a key={l.url} className={`btn magnetic${li ? " is-soft" : ""}`} href={l.url} target="_blank" rel="noreferrer" data-cursor="Visit">
                      {l.label}
                    </a>
                  ))}
                </div>
              </div>
              <div className="pgrid">
                <div className="frame">
                  <div className="frame-bar">
                    <i />
                    <i />
                    <i />
                    <span className="url">{host(pr)}</span>
                  </div>
                  <Shot project={pr} />
                </div>
                <div className="pinfo">
                  <p className="pdesc">{pr.description}</p>
                  <ul className="highlights">
                    {pr.highlights.map((h) => (
                      <li key={h}>{h}</li>
                    ))}
                  </ul>
                  <ul className="chips" aria-label="Stack">
                    {pr.stack.map((st) => (
                      <li className="chip" key={st}>
                        {st}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
