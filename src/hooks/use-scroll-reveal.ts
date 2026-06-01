"use client";

import { useEffect, useRef } from "react";

/**
 * Hook to reveal elements when they enter the viewport.
 * Adds the "revealed" class to elements with cafe-reveal* classes.
 */
export function useScrollReveal(deps: any[] = []) {
  const containerRef = useRef<any>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const targets = container.querySelectorAll(
      ".cafe-reveal, .cafe-reveal-left, .cafe-reveal-right, .cafe-reveal-scale"
    );

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: "0px 0px -60px 0px",
      }
    );

    targets.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, deps);

  return containerRef;
}
