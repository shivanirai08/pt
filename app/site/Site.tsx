"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, useGSAP } from "./gsap";
import Interactions from "./Interactions";
import Hero from "./Hero";
import Story from "./Story";
import Toolbox from "./Toolbox";
import Work from "./Work";
import Journey from "./Journey";
import Contact from "./Contact";
import Footer from "./Footer";
import Nav from "./Nav";
import { STOPS } from "./tour";

export default function Site() {
  const root = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<string>(STOPS[0].id);

  useEffect(() => {
    const { history } = window;
    const prev = history.scrollRestoration;
    history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
    return () => {
      history.scrollRestoration = prev;
    };
  }, []);

  useGSAP(
    () => {
      // Which section are we in? Drives the nav pill.
      gsap.utils.toArray<HTMLElement>("[data-station]").forEach((sec) => {
        ScrollTrigger.create({
          trigger: sec,
          start: "top 55%",
          end: "bottom 55%",
          onToggle: (self) => self.isActive && setActive(sec.dataset.station!),
        });
      });
      const refresh = () => ScrollTrigger.refresh();
      window.addEventListener("load", refresh);
      return () => window.removeEventListener("load", refresh);
    },
    { scope: root }
  );


  return (
    <div ref={root} className="site">
      <a className="skip-link" href="#story">
        Skip to content
      </a>
      <Interactions />

      <main>
        <Hero />
        <Story />
        <Toolbox />
        <Work />
        <Journey />
        <Contact />
      </main>
      <Footer />

      <Nav active={active} />
    </div>
  );
}
