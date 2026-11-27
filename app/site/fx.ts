"use client";

import { gsap, reducedMotion } from "./gsap";

const COLORS = ["#33c791", "#ffe3ac", "#ffd3fe", "#d3d3ff", "#b8e3e9", "#cfefe2"];

/** Ticket-stamp confetti burst from a viewport point. */
export function confetti(x: number, y: number, count = 28) {
  if (reducedMotion()) return;
  for (let i = 0; i < count; i++) {
    const el = document.createElement("span");
    el.className = "confetti";
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    el.style.background = COLORS[i % COLORS.length];
    document.body.appendChild(el);
    const angle = Math.random() * Math.PI * 2;
    const dist = 90 + Math.random() * 190;
    gsap
      .timeline({ onComplete: () => el.remove() })
      .to(el, {
        x: Math.cos(angle) * dist,
        y: Math.sin(angle) * dist - 60,
        rotation: Math.random() * 540 - 270,
        duration: 0.7,
        ease: "power3.out",
      })
      .to(el, { y: "+=220", opacity: 0, duration: 0.7, ease: "power1.in" }, ">-0.1");
  }
}

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

/** Split-flap departures-board text: letters flip, then settle left to right. */
export function flap(el: HTMLElement, text: string, duration = 1.1) {
  if (reducedMotion()) {
    el.textContent = text;
    return;
  }
  const state = { p: 0 };
  gsap.to(state, {
    p: 1,
    duration,
    ease: "none",
    onUpdate: () => {
      const settled = Math.floor(state.p * text.length);
      let out = "";
      for (let i = 0; i < text.length; i++) {
        const ch = text[i];
        if (i < settled || ch === " ") out += ch;
        else out += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
      }
      el.textContent = out;
    },
    onComplete: () => {
      el.textContent = text;
    },
  });
}
