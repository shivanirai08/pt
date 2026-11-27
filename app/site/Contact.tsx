"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP, reducedMotion } from "./gsap";
import { confetti } from "./fx";
import { usePortfolio } from "../context/PortfolioContext";

const NAMES: Record<string, string> = {
  github: "GitHub",
  leetcode: "LeetCode",
  linkedin: "LinkedIn",
  twitter: "X / Twitter",
  behance: "Behance",
};
const BG: Record<string, string> = {
  github: "var(--cream)",
  linkedin: "var(--sky)",
  leetcode: "var(--pink)",
  behance: "var(--lav)",
  twitter: "var(--mint)",
};
const PRIMARY = ["github", "linkedin"];

const Arrow = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M4 12L12 4M5 4h7v7" />
  </svg>
);

export default function Contact() {
  const { personal: p, socials } = usePortfolio();
  const ref = useRef<HTMLElement>(null);
  const [copied, setCopied] = useState(false);

  const primary = PRIMARY.map((k) => socials.find((s) => s.name.toLowerCase() === k)).filter(Boolean) as typeof socials;
  const rest = socials.filter((s) => !primary.includes(s));

  useGSAP(
    () => {
      if (reducedMotion()) return;
      gsap.from(".contact .h2, .mail, .contact-actions > *", {
        y: 50,
        opacity: 0,
        duration: 0.9,
        stagger: 0.08,
        ease: "expo.out",
        scrollTrigger: { trigger: ".contact .h2", start: "top 88%", once: true },
      });
      // Two cards slide in from the sides...
      const row2 = gsap.utils.toArray<HTMLElement>(".row2 .scard");
      row2.forEach((el, i) =>
        gsap.from(el, {
          x: i % 2 === 0 ? -240 : 240,
          rotate: i % 2 === 0 ? -8 : 8,
          opacity: 0,
          duration: 1.1,
          ease: "expo.out",
          scrollTrigger: { trigger: ".row2", start: "top 88%", once: true },
        })
      );
      // ...then three pop up underneath.
      gsap.from(".row3 .scard", {
        y: 140,
        scale: 0.55,
        opacity: 0,
        duration: 0.9,
        stagger: 0.14,
        ease: "back.out(1.7)",
        scrollTrigger: { trigger: ".row3", start: "top 92%", once: true },
      });
    },
    { scope: ref }
  );

  const copy = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    try {
      await navigator.clipboard.writeText(p.email);
    } catch {
      /* clipboard can be blocked; the burst still plays */
    }
    setCopied(true);
    confetti(r.left + r.width / 2, r.top + r.height / 2);
    window.setTimeout(() => setCopied(false), 2200);
  };

  const card = (s: (typeof socials)[number], big = false) => {
    const k = s.name.toLowerCase();
    return (
      <li key={s.name}>
        <a
          className={`scard${big ? " is-big" : ""}`}
          href={s.url}
          target="_blank"
          rel="noreferrer"
          data-cursor="Visit"
          style={{ ["--bg-card" as string]: BG[k] ?? "var(--paper)" }}
        >
          <span className="arrow">
            <Arrow />
          </span>
          <span className="mono" aria-hidden="true">
            {(NAMES[k] ?? s.name)[0]}
          </span>
          <span>
            <b>{NAMES[k] ?? s.name}</b>
            <br />
            <span className="h">{s.handle}</span>
          </span>
        </a>
      </li>
    );
  };

  return (
    <section id="contact" ref={ref} className="contact" data-station="contact">
      <div className="wrap">
        <div >
          <h2 className="h2" style={{ maxWidth: "none" }}>
            Let&apos;s build <mark>something</mark>
          </h2>
          <a className="mail magnetic" href={`mailto:${p.email}`} data-cursor="Write">
            {p.email}
          </a>
          <div className="contact-actions">
            <button className="btn magnetic" onClick={copy} data-cursor={copied ? "Done" : "Copy"} aria-live="polite">
              {copied ? "Copied. Thank you!" : "Copy email"}
            </button>
            <a className="btn is-soft magnetic" href={p.resumeUrl} target="_blank" rel="noreferrer" data-cursor="Open">
              Resume
            </a>
          </div>
        </div>

        <div className="socials">
          <ul className="row2">{primary.map((s) => card(s, true))}</ul>
          <ul className="row3">{rest.slice(0, 3).map((s) => card(s))}</ul>
        </div>

      </div>
    </section>
  );
}
