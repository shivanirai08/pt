"use client";

import { useRef } from "react";
import { gsap, useGSAP, reducedMotion } from "./gsap";
import { usePortfolio } from "../context/PortfolioContext";

// Highlighted words get a coloured, dashed-outline chip once revealed (as in the reference).
const HL: Record<string, string> = {
  brain: "#a8ebcf",
  "800ms": "#ffb9b9",
  motion: "#a8ebcf",
};
const BLOCK = "191, 188, 180";
const AHEAD = 10; // how many blocks run ahead of the reading point

const sentences = (s: string) => s.split(/(?<=[.!?])\s+/).filter(Boolean);
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const clamp = (n: number, a = 0, b = 1) => Math.min(b, Math.max(a, n));

export default function Story() {
  const { personal: p, aboutPhilosophy } = usePortfolio();
  const ref = useRef<HTMLElement>(null);

  // Three short paragraphs, all from portfolio.json: who, what I learned, what I obsess over.
  const d = sentences(p.description);
  const [learned, why] = (d[1] ?? "").split(":");
  const bio = sentences(p.bio);
  const paras = [
    `I'm ${p.name}, ${p.tagline}. ${d[0] ?? ""}`.trim(),
    [learned ? `${learned.trim()}.` : "", why ? `${cap(why.trim())}` : ""].filter(Boolean).join(" "),
    bio[bio.length - 1] ?? "",
  ].filter(Boolean);
  const dots = ["var(--cream)", "var(--pink)", "var(--lav)", "var(--sky)", "var(--cream)"];

  useGSAP(
    () => {
      const reduced = reducedMotion();
      const root = ref.current!;
      const pin = root.querySelector<HTMLElement>(".story-pin")!;
      const words = gsap.utils.toArray<HTMLElement>(".word", pin);
      const spans = words.map((w) => w.firstElementChild as HTMLElement);
      const N = words.length;

      const paint = (front: number) => {
        words.forEach((w, i) => {
          const dist = i - front;
          // text: fades in as the reading point passes the word
          const text = clamp((front - i) / 1.2);
          // block: strongest at the reading point, fading with distance ahead, and clearing behind it
          const block = dist >= 0 ? 0.92 * clamp(1 - dist / AHEAD) : 0.92 * clamp(1 + dist / 2.4);
          spans[i].style.opacity = String(text);
          const hl = w.dataset.hl;
          if (hl && dist < -1.2) {
            w.style.backgroundColor = hl;
            w.classList.add("hl-on");
          } else {
            w.style.backgroundColor = `rgba(${BLOCK}, ${block})`;
            w.classList.remove("hl-on");
          }
        });
      };

      if (reduced) {
        paint(N + AHEAD + 5);
      } else {
        paint(-AHEAD);
        const proxy = { front: -AHEAD };
        gsap.to(proxy, {
          front: N + 4,
          ease: "none",
          onUpdate: () => paint(proxy.front),
          scrollTrigger: {
            trigger: pin,
            start: "top top",
            end: () => `+=${Math.round(window.innerHeight * (1 + N * 0.05))}`,
            pin: true,
            scrub: 0.7,
            anticipatePin: 1,
          },
        });
      }

      // Beats: big statements rise letter by letter.
      if (!reduced) {
        gsap.utils.toArray<HTMLElement>(".beat").forEach((b) => {
          const st = { trigger: b, start: "top 88%", once: true };
          gsap.from(b.querySelectorAll(".c"), { yPercent: 115, duration: 0.9, stagger: 0.014, ease: "expo.out", scrollTrigger: st });
          gsap.from(b.querySelector(".beat-dot"), { scale: 0, rotate: -90, duration: 0.8, ease: "back.out(2.4)", scrollTrigger: st });
        });
      }
    },
    { scope: ref }
  );

  return (
    <section id="story" ref={ref} className="story" data-station="story">
      <div className="story-pin">
        <div className="anime-text" aria-label={paras.join(" ")}>
          {paras.map((para, pi) => (
            <p key={pi} aria-hidden="true">
              {para.split(/\s+/).map((w, wi) => {
                const key = w.toLowerCase().replace(/[^a-z0-9]/g, "");
                const hl = HL[key];
                return (
                  <span className="word" key={wi} data-hl={hl}>
                    <span>{w}</span>
                  </span>
                );
              })}
            </p>
          ))}
        </div>
      </div>

      <div className="wrap">
        <ul className="beats" aria-label="What I believe">
          {aboutPhilosophy.map((line, i) => (
            <li className="beat" key={line}>
              <p aria-label={line}>
                {line.split(" ").map((w, wi) => (
                  <span key={wi} aria-hidden="true" style={{ display: "inline-block", overflow: "hidden", verticalAlign: "top" }}>
                    {w.split("").map((ch, ci) => (
                      <span className="c" key={ci}>
                        {ch}
                      </span>
                    ))}
                    {" "}
                  </span>
                ))}
              </p>
              <span className="beat-dot" style={{ ["--c" as string]: dots[i % dots.length] }} aria-hidden="true" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
