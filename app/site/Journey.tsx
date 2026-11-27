"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP, reducedMotion } from "./gsap";
import { usePortfolio } from "../context/PortfolioContext";

const BG = ["var(--cream)", "var(--pink)", "var(--lav)", "var(--sky)", "var(--mint)"];

/**
 * The career as one winding road. Stops sit on the bends; the road draws itself
 * and a marker travels it as you scroll. Cards enter from alternating sides.
 */
export default function Journey() {
  const { experience, certifications, stats } = usePortfolio();
  const ref = useRef<HTMLElement>(null);
  const roadRef = useRef<HTMLDivElement>(null);
  const baseRef = useRef<SVGPathElement>(null);
  const fillRef = useRef<SVGPathElement>(null);
  const markerRef = useRef<SVGGElement>(null);
  const stopRefs = useRef<(SVGCircleElement | null)[]>([]);

  useGSAP(
    () => {
      const road = roadRef.current!;
      const base = baseRef.current!;
      const fill = fillRef.current!;
      const marker = markerRef.current!;
      const rows = gsap.utils.toArray<HTMLElement>(".jobrow", road);
      const reduced = reducedMotion();
      let total = 1;
      let stopLens: number[] = [];
      let trigger: ScrollTrigger | null = null;

      const paint = (progress: number) => {
        const l = progress * total;
        fill.style.strokeDashoffset = String(total - l);
        const pt = base.getPointAtLength(l);
        marker.setAttribute("transform", `translate(${pt.x} ${pt.y})`);
        stopRefs.current.forEach((c, i) => {
          const hit = l >= (stopLens[i] ?? 0) - 2;
          c?.classList.toggle("is-passed", hit);
          rows[i]?.classList.toggle("is-reached", hit);
        });
      };

      const build = () => {
        const W = road.clientWidth;
        const narrow = W < 1000;
        // Each stop sits on its card's inner edge (right edge for left cards, left edge for right cards),
        // so the road swings across the page and the cards hang off the bends.
        const rr = road.getBoundingClientRect();
        const pts = rows.map((row, i) => {
          const slot = row.querySelector<HTMLElement>(".jslot")!.getBoundingClientRect();
          const left = slot.left - rr.left;
          const right = left + slot.width;
          const off = narrow ? 24 : 0;
          return {
            y: slot.top - rr.top + 64,
            x: i % 2 === 0 ? right + off : left - off,
          };
        });
        let d = `M ${pts[0].x} ${pts[0].y - 170} L ${pts[0].x} ${pts[0].y}`;
        for (let i = 0; i < pts.length - 1; i++) {
          const a = pts[i];
          const b = pts[i + 1];
          const dy = (b.y - a.y) * 0.62;
          d += ` C ${a.x} ${a.y + dy} ${b.x} ${b.y - dy} ${b.x} ${b.y}`;
        }
        const last = pts[pts.length - 1];
        d += ` L ${last.x} ${last.y + 150}`;
        base.setAttribute("d", d);
        fill.setAttribute("d", d);
        total = base.getTotalLength();
        fill.style.strokeDasharray = String(total);

        stopLens = pts.map((p) => {
          let best = 0;
          let bestD = Infinity;
          for (let l = 0; l <= total; l += 4) {
            const q = base.getPointAtLength(l);
            const dist = Math.hypot(q.x - p.x, q.y - p.y);
            if (dist < bestD) {
              bestD = dist;
              best = l;
            }
          }
          return best;
        });
        pts.forEach((p, i) => {
          stopRefs.current[i]?.setAttribute("cx", String(p.x));
          stopRefs.current[i]?.setAttribute("cy", String(p.y));
        });

        trigger?.kill();
        if (reduced) {
          paint(1);
          return;
        }
        trigger = ScrollTrigger.create({
          trigger: road,
          start: "top 65%",
          end: "bottom 60%",
          scrub: 0.5,
          onUpdate: (self) => paint(self.progress),
        });
        paint(trigger.progress);
      };

      build();
      let t = 0;
      const ro = new ResizeObserver(() => {
        window.clearTimeout(t);
        t = window.setTimeout(() => {
          build();
          ScrollTrigger.refresh();
        }, 120);
      });
      ro.observe(road);

      if (!reduced) {
        rows.forEach((row) => {
          const card = row.querySelector(".jcard")!;
          gsap.fromTo(
            card,
            { yPercent: 104 },
            {
              yPercent: 0,
              ease: "power2.out",
              scrollTrigger: { trigger: row, start: "top 92%", end: "top 42%", scrub: 0.7 },
            }
          );
        });
        gsap.from(".journey .h2, .journey .sect-lead", {
          y: 50,
          opacity: 0,
          duration: 0.9,
          stagger: 0.1,
          ease: "expo.out",
          scrollTrigger: { trigger: ".journey .h2", start: "top 88%", once: true },
        });
      }

      return () => {
        ro.disconnect();
        window.clearTimeout(t);
        trigger?.kill();
      };
    },
    { scope: ref }
  );

  return (
    <section id="journey" ref={ref} className="journey" data-station="journey">
      <div className="wrap">
        <div>
          <h2 className="h2">
            The <mark>road</mark> so far
          </h2>
          <p className="sect-lead">
            {stats.yearsActive} years, {experience.length} stops. Follow the road.
          </p>
        </div>

        <div ref={roadRef} className="road">
          <svg aria-hidden="true" className="back">
            <path ref={baseRef} className="road-base" d="M0 0" />
            <path ref={fillRef} className="road-fill" d="M0 0" />
          </svg>
          <svg aria-hidden="true" className="front">
            {experience.map((j, i) => (
              <circle
                key={j.version}
                ref={(el) => {
                  stopRefs.current[i] = el;
                }}
                className="road-stop"
                r="10"
              />
            ))}
            <g ref={markerRef} className="road-marker">
              <circle className="o" r="11" />
            </g>
          </svg>

          {experience.map((job, i) => {
            const [company, kind] = job.company.split(" (");
            return (
              <div key={job.version} className={`jobrow${i % 2 ? " is-right" : ""}`}>
                <div className="jslot" style={{ ["--bg-card" as string]: BG[i % BG.length] }}>
                  <div className="jclip">
                    <article className="jcard">
                      <h3>{job.role}</h3>
                      <p className="jco">
                        {company}
                        {kind ? ` · ${kind.replace(")", "")}` : ""}
                      </p>
                      <ul className="jlist">
                        {job.achievements.map((a) => (
                          <li key={a}>{a}</li>
                        ))}
                      </ul>
                    </article>
                  </div>
                  <div className="jfront">
                    <span className="jtab">{job.version}</span>
                    <span>{company.split(" · ")[0]}</span>
                    <span className="jdate">{job.range}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {certifications.length > 0 && (
          <ul className="certs" aria-label="Certifications">
            {certifications.map((c) => (
              <li className="cert" key={c}>
                {c}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
