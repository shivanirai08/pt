"use client";

import { useEffect, useRef } from "react";
import { gsap } from "./gsap";

/**
 * Global pointer layer: a blend-mode dot, a labelled disc that appears over
 * [data-cursor] targets, and magnetic pull on .magnetic elements.
 * Only runs on fine hover pointers.
 */
export default function Interactions() {
  const dotRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const dot = dotRef.current!;
    const label = labelRef.current!;
    const text = textRef.current!;
    const root = document.documentElement;

    const dx = gsap.quickTo(dot, "x", { duration: 0.08, ease: "power3" });
    const dy = gsap.quickTo(dot, "y", { duration: 0.08, ease: "power3" });
    const lx = gsap.quickTo(label, "x", { duration: 0.4, ease: "power3" });
    const ly = gsap.quickTo(label, "y", { duration: 0.4, ease: "power3" });

    let shown = false;
    let labelOn = false;
    let magnet: HTMLElement | null = null;

    const reset = (el: HTMLElement) =>
      gsap.to(el, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.4)" });

    const onMove = (e: PointerEvent) => {
      if (!shown) {
        shown = true;
        root.classList.add("has-cursor");
        gsap.set([dot, label], { x: e.clientX, y: e.clientY });
        gsap.to(dot, { opacity: 1, duration: 0.2 });
        label.style.opacity = "1";
      }
      dx(e.clientX);
      dy(e.clientY);
      lx(e.clientX);
      ly(e.clientY);

      const m = (e.target as Element | null)?.closest?.<HTMLElement>(".magnetic") ?? null;
      if (m !== magnet) {
        if (magnet) reset(magnet);
        magnet = m;
      }
      if (magnet) {
        const r = magnet.getBoundingClientRect();
        gsap.to(magnet, {
          x: (e.clientX - (r.left + r.width / 2)) * 0.28,
          y: (e.clientY - (r.top + r.height / 2)) * 0.28,
          duration: 0.35,
          ease: "power3.out",
        });
      }
    };

    const onOver = (e: PointerEvent) => {
      const t = e.target as Element | null;
      const c = t?.closest?.<HTMLElement>("[data-cursor]");
      labelOn = !!c;
      if (c) {
        text.textContent = c.dataset.cursor ?? "";
        gsap.to(label, { scale: 1, duration: 0.35, ease: "back.out(2.2)", overwrite: "auto" });
        gsap.to(dot, { scale: 0, duration: 0.2 });
        return;
      }
      gsap.to(label, { scale: 0, duration: 0.25, ease: "power2.in", overwrite: "auto" });
      const link = t?.closest?.("a, button, [role='button']");
      gsap.to(dot, { scale: link ? 2.6 : 1, duration: 0.3, ease: "power3.out" });
    };

    const onDown = () => {
      if (labelOn) gsap.to(label, { scale: 0.82, duration: 0.15 });
    };
    const onUp = () => {
      if (labelOn) gsap.to(label, { scale: 1, duration: 0.3, ease: "back.out(3)" });
    };
    const onLeave = () => {
      gsap.to([dot, label], { opacity: 0, duration: 0.2 });
      shown = false;
      root.classList.remove("has-cursor");
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerover", onOver, { passive: true });
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      root.classList.remove("has-cursor");
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
      <div ref={labelRef} className="cursor-label" aria-hidden="true">
        <span ref={textRef} />
      </div>
    </>
  );
}
