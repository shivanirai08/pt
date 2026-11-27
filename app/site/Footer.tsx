"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, useGSAP, reducedMotion } from "./gsap";
import { STOPS } from "./tour";
import { usePortfolio } from "../context/PortfolioContext";

const NAMES: Record<string, string> = { github: "GitHub", leetcode: "LeetCode", linkedin: "LinkedIn", twitter: "X", behance: "Behance" };

/** Live local time for the footer. Rendered after mount only, so it never mismatches on hydrate. */
function useClock(tz: string) {
  const [t, setT] = useState("");
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false, timeZone: tz });
    const tick = () => setT(fmt.format(new Date()));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [tz]);
  return t;
}

export default function Footer() {
  const { personal: p, socials } = usePortfolio();
  const ref = useRef<HTMLElement>(null);
  const time = useClock("Asia/Kolkata");

  useGSAP(
    () => {
      if (reducedMotion()) return;
      gsap.from(".wordmark .wm", {
        yPercent: 110,
        duration: 1.1,
        stagger: 0.05,
        ease: "expo.out",
        scrollTrigger: { trigger: ".wordmark", start: "top 95%", once: true },
      });
      gsap.from(".foot-grid > div", {
        y: 40,
        opacity: 0,
        duration: 0.9,
        stagger: 0.1,
        ease: "expo.out",
        scrollTrigger: { trigger: ".foot-grid", start: "top 90%", once: true },
      });
    },
    { scope: ref }
  );

  const go = (id: string) => {
    const el = document.getElementById(id);
    if (el) gsap.to(window, { scrollTo: { y: id === "platform" ? 0 : el }, duration: reducedMotion() ? 0 : 1.4, ease: "power3.inOut" });
  };

  return (
    <footer ref={ref} className="footer">
      <div className="wrap">
        <div className="foot-grid">
          <div>
            <h4>Local time</h4>
            <div className="foot-time" aria-live="off">
              {time || "--:--:--"}
            </div>
            <p className="foot-note">
              {p.timezone} · {p.location}
              <br />
              {p.status === "open_to_work" ? `Open to work, replies in ${p.responseTime}.` : "Currently booked."}
            </p>
          </div>
          <div>
            <h4>Navigate</h4>
            <ul>
              {STOPS.filter((s) => s.id !== "platform").map((s) => (
                <li key={s.id}>
                  <a
                    className="flink"
                    href={`#${s.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      go(s.id);
                    }}
                    data-cursor="Go"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4>Elsewhere</h4>
            <ul>
              {socials.map((s) => (
                <li key={s.name}>
                  <a className="flink" href={s.url} target="_blank" rel="noreferrer" data-cursor="Visit">
                    {NAMES[s.name.toLowerCase()] ?? s.name}
                  </a>
                </li>
              ))}
              <li>
                <a className="flink" href={`mailto:${p.email}`} data-cursor="Write">
                  Email
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="wordmark" aria-hidden="true">
        {p.fullName.split("").map((ch, i) => (
          <span className="wm" key={i}>
            {ch === " " ? " " : ch}
          </span>
        ))}
      </div>

      <div className="wrap foot-bottom">
        <span>
          © {new Date().getFullYear()} {p.fullName}. Built with Next.js and GSAP.
        </span>
        <button className="btn is-soft magnetic" onClick={() => go("platform")} data-cursor="Top">
          Back to top ↑
        </button>
      </div>
    </footer>
  );
}
