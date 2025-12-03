"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePathname } from "next/navigation";

export default function SectionRevealClient() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

    // Generic single element reveals
    const revealEls = Array.from(document.querySelectorAll("[data-animate]"));
    const cleanups = [];

    revealEls.forEach((el) => {
      const type = el.getAttribute("data-animate");
      const delay = parseFloat(el.getAttribute("data-delay") || "0");
      const duration = parseFloat(el.getAttribute("data-duration") || "0.6");

      const from = (() => {
        switch (type) {
          case "fade-up":
            return { opacity: 0, y: 24 };
          case "fade-down":
            return { opacity: 0, y: -24 };
          case "fade-left":
            return { opacity: 0, x: -24 };
          case "fade-right":
            return { opacity: 0, x: 24 };
          case "scale-in":
            return { opacity: 0, scale: 0.95 };
          case "none":
            return { opacity: 0 };
          default:
            return { opacity: 0, y: 16 };
        }
      })();

      const ctx = gsap.context(() => {
        gsap.from(el, {
          ...from,
          duration,
          delay,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 80%",
            toggleActions: "play none none none",
            once: true,
          },
        });
      }, el);

      cleanups.push(() => ctx.revert());
    });

    // Staggered containers
    const staggers = Array.from(document.querySelectorAll("[data-stagger-parent]"));
    staggers.forEach((parent) => {
      const items = parent.querySelectorAll("[data-stagger-item]");
      const amount = parseFloat(parent.getAttribute("data-stagger")) || 0.08;
      const from = parent.getAttribute("data-stagger-from") || "y"; // y or x

      const props = from === "x" ? { opacity: 0, x: 16 } : { opacity: 0, y: 24 };

      const ctx = gsap.context(() => {
        gsap.from(items, {
          ...props,
          duration: 0.6,
          ease: "power3.out",
          stagger: amount,
          scrollTrigger: {
            trigger: parent,
            start: "top 85%",
            once: true,
          },
        });
      }, parent);

      cleanups.push(() => ctx.revert());
    });

    return () => {
      cleanups.forEach((fn) => fn());
    };
  }, [pathname]);

  return null;
}
