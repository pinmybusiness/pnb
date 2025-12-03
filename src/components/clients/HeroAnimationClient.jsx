"use client";

import { useEffect } from "react";
import { animate, inView } from "framer-motion";
import { usePathname } from "next/navigation";

export default function HeroAnimationClient() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const els = Array.from(document.querySelectorAll('[data-hero-image]'));
    const cleanups = [];

    els.forEach((el) => {
      const stop = inView(el, () => {
        const target = el.querySelector('.relative.group') || el;
        animate(target, {
          opacity: [0, 1],
          transform: [
            'translateX(50px) scale(0.9) rotateY(15deg)',
            'translateX(0px) scale(1) rotateY(0deg)'
          ],
        }, {
          duration: 1.2,
          easing: 'easeOut',
          delay: 0.4,
        });
        stop && stop();
      }, { margin: "0px 0px -20% 0px" });

      cleanups.push(() => stop && stop());
    });

    return () => cleanups.forEach(fn => fn());
  }, [pathname]);

  return null;
}
