"use client";

import { useEffect } from "react";
import Lenis from "@studio-freight/lenis";
import { usePathname } from "next/navigation";

export default function LenisScroll({ children }) {
  const pathname = usePathname();

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: "vertical",
      gestureDirection: "vertical",
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, [pathname]); // Re-initialize on route change if needed, though usually one instance is enough.

  return <>{children}</>;
}
