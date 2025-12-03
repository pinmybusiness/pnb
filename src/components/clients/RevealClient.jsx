"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { animate, inView, stagger } from "framer-motion";

export default function RevealClient() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const cleanups = []; // FIXED: removed TypeScript types

    /** ------------------------------------
     * 1) ELEMENT REVEALS USING data-animate
     * ------------------------------------ */
    const revealEls = Array.from(document.querySelectorAll("[data-animate]"));
    revealEls.forEach((el) => {
      const type = el.getAttribute("data-animate");
      const delay = parseFloat(el.getAttribute("data-delay") || "0");
      const duration = parseFloat(el.getAttribute("data-duration") || "0.6");
      const easing = el.getAttribute("data-ease") || "easeOut";
      const offset = parseFloat(el.getAttribute("data-offset") || "0");

      const keyframes =
        (() => {
          switch (type) {
            case "fade-up":
              return {
                opacity: [0, 1],
                transform: [`translateY(${offset || 24}px)`, "translateY(0px)"],
              };
            case "fade-down":
              return {
                opacity: [0, 1],
                transform: [
                  `translateY(-${offset || 24}px)`,
                  "translateY(0px)",
                ],
              };
            case "fade-left":
              return {
                opacity: [0, 1],
                transform: [
                  `translateX(-${offset || 24}px)`,
                  "translateX(0px)",
                ],
              };
            case "fade-right":
              return {
                opacity: [0, 1],
                transform: [
                  `translateX(${offset || 24}px)`,
                  "translateX(0px)",
                ],
              };
            case "scale-in":
              return {
                opacity: [0, 1],
                transform: ["scale(0.95)", "scale(1)"],
              };
            default:
              return { opacity: [0, 1] };
          }
        })();

      const stop = inView(
        el,
        () => {
          animate(el, keyframes, { duration, delay, easing });
          stop && stop();
        },
        { margin: "0px 0px -20% 0px" }
      );

      cleanups.push(() => stop && stop());
    });

    /** ------------------------------------
     * 2) STAGGERED GROUPS USING data-stagger-parent
     * ------------------------------------ */
    const staggers = Array.from(
      document.querySelectorAll("[data-stagger-parent]")
    );
    staggers.forEach((parent) => {
      const items = parent.querySelectorAll("[data-stagger-item]");
      const amount = parseFloat(parent.getAttribute("data-stagger") || "0.08");
      const axis = parent.getAttribute("data-stagger-from") || "y";
      const offset = parseFloat(
        parent.getAttribute("data-stagger-offset") ||
          (axis === "x" ? "16" : "24")
      );
      const duration = parseFloat(
        parent.getAttribute("data-stagger-duration") || "0.6"
      );
      const easing = parent.getAttribute("data-stagger-ease") || "easeOut";

      const props =
        axis === "x"
          ? {
              opacity: [0, 1],
              transform: [`translateX(${offset}px)`, "translateX(0px)"],
            }
          : {
              opacity: [0, 1],
              transform: [`translateY(${offset}px)`, "translateY(0px)"],
            };

      const stop = inView(
        parent,
        () => {
          animate(items, props, {
            duration,
            delay: stagger(amount),
            easing,
          });
          stop && stop();
        },
        { margin: "0px 0px -15% 0px" }
      );

      cleanups.push(() => stop && stop());
    });

    /** ------------------------------------
     * 3) TEXT SPLITTING FOR WORD ANIMATION
     * ------------------------------------ */
    const splitEls = Array.from(
      document.querySelectorAll('[data-split="words"]')
    );
    splitEls.forEach((el) => {
      const delay = parseFloat(el.getAttribute("data-delay") || "0");
      const duration = parseFloat(el.getAttribute("data-duration") || "0.5");
      const each = parseFloat(el.getAttribute("data-stagger") || "0.12");
      const easing = el.getAttribute("data-ease") || "easeOut";

      const noGradient = el.getAttribute("data-nogradient") === "true";

      const original = el.textContent || "";
      const words = original.split(/\s+/);
      el.textContent = "";

      const spans = words.map((w, i) => {
        const span = document.createElement("span");
        span.textContent = w + (i < words.length - 1 ? " " : "");
        span.style.display = "inline-block";
        span.style.whiteSpace = "pre";

        if (noGradient) {
          span.style.color = "inherit";
        } else {
          span.style.background = "inherit";
          span.style.webkitBackgroundClip = "text";
          span.style.backgroundClip = "text";
          span.style.color = "transparent";
        }

        el.appendChild(span);
        return span;
      });

      const stop = inView(
        el,
        () => {
          animate(
            spans,
            {
              opacity: [0, 1],
              transform: ["translateY(20px)", "translateY(0px)"],
            },
            {
              duration,
              delay: stagger(each, { startDelay: delay }),
              easing,
            }
          );
          stop && stop();
        },
        { margin: "0px 0px -10% 0px" }
      );

      cleanups.push(() => stop && stop());
    });

    /** Cleanup on route change */
    return () => cleanups.forEach((fn) => fn());
  }, [pathname]);

  return null;
}
