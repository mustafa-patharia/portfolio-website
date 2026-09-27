"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function HorizontalScrollSection({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!containerRef.current || !wrapperRef.current) return;

    let ctx = gsap.context(() => {
      let sections = gsap.utils.toArray(".horizontal-panel");
      
      gsap.to(sections, {
        xPercent: -100 * (sections.length - 1),
        ease: "none",
        scrollTrigger: {
          trigger: wrapperRef.current,
          pin: true,
          scrub: 1,
          snap: 1 / (sections.length - 1),
          // base end on the total width of the content
          end: () => "+=" + containerRef.current?.offsetWidth
        }
      });
    }, wrapperRef);
    
    return () => ctx.revert();
  }, { scope: wrapperRef });

  return (
    <div ref={wrapperRef} className="overflow-hidden bg-surface py-20 border-y border-stroke my-20">
      <div ref={containerRef} className="flex flex-nowrap w-[300vw] h-full gap-10 px-10">
        {/* We expect children to have class 'horizontal-panel w-screen flex-shrink-0' */}
        {children}
      </div>
    </div>
  );
}

export function HorizontalPanel({ children }: { children: React.ReactNode }) {
  return (
    <div className="horizontal-panel w-screen flex-shrink-0 pr-[20vw] flex flex-col justify-center">
      {children}
    </div>
  );
}
