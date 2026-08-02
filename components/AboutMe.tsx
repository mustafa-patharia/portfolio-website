"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import SectionHeader from "./SectionHeader";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function AboutMe() {
  const containerRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Animate the main vertical line drawing down
      gsap.fromTo(
        lineRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top center",
            end: "bottom center",
            scrub: true,
          },
        }
      );

      // Animate each story node as the line reaches it
      const nodes = gsap.utils.toArray<HTMLElement>(".story-node");
      nodes.forEach((node) => {
        const dot = node.querySelector(".story-dot");
        const content = node.querySelector(".story-content");

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: node,
            start: "center center+=100", // When node reaches a bit below center
            toggleActions: "play none none reverse",
          },
        });

        tl.fromTo(
          dot,
          { scale: 0, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(1.7)" }
        ).fromTo(
          content,
          { x: 30, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.6, ease: "power2.out" },
          "-=0.2"
        );
      });
    },
    { scope: containerRef }
  );

  return (
    <section id="about" className="relative py-24 md:py-32" ref={containerRef}>
      <div className="mx-auto max-w-[1200px] px-6 md:px-10 lg:px-16">
        <SectionHeader 
          eyebrow="My Journey"
          title="About"
          italicWord="Me"
          subtext="The path that led me to where I am today."
        />

        <div className="mt-16 grid grid-cols-1 gap-16 lg:grid-cols-12">
          {/* Left Column: Media Placeholder */}
          <div className="lg:col-span-5">
            <div className="sticky top-32">
              <div className="group relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-surface">
                <img 
                  src="/personal/profile.jpeg" 
                  alt="Mustafa Patharia" 
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {/* Decorative borders for comic theme */}
                <div className="pointer-events-none absolute inset-0 rounded-2xl border-2 border-text-primary/10 transition-colors duration-500 group-hover:border-text-primary/30" />
              </div>
            </div>
          </div>

          {/* Right Column: The Journey / Story */}
          <div className="relative lg:col-span-7 lg:pl-12">
            {/* The continuous line */}
            <div className="absolute left-[15px] top-0 h-full w-[2px] origin-top bg-stroke lg:left-[47px]" />
            <div
              ref={lineRef}
              className="absolute left-[15px] top-0 h-full w-[2px] origin-top bg-text-primary lg:left-[47px]"
            />

            <div className="flex flex-col gap-16 pb-24 pt-8">
              {/* Node 1 */}
              <div className="story-node relative pl-12 lg:pl-16">
                <div className="story-dot absolute left-[-5px] top-2 h-[12px] w-[12px] rounded-full border-[3px] border-bg bg-text-primary lg:left-[27px]" />
                <div className="story-content">
                  <h3 className="mb-4 font-display text-2xl italic tracking-tight text-text-primary md:text-3xl">
                    The Beginning
                  </h3>
                  <p className="leading-relaxed text-muted md:text-lg">
                    I started my journey exploring the intersections of design and engineering. Early on, I realized that writing code wasn't just about syntax—it was about solving human problems. I didn't want to just build things; I wanted to build experiences that feel alive.
                  </p>
                </div>
              </div>

              {/* Node 2 */}
              <div className="story-node relative pl-12 lg:pl-16">
                <div className="story-dot absolute left-[-5px] top-2 h-[12px] w-[12px] rounded-full border-[3px] border-bg bg-text-primary lg:left-[27px]" />
                <div className="story-content">
                  <h3 className="mb-4 font-display text-2xl italic tracking-tight text-text-primary md:text-3xl">
                    Scaling Complexity
                  </h3>
                  <p className="leading-relaxed text-muted md:text-lg">
                    My work introduced me to the challenges of scale and rich interactive media. Building real-time multi-user portals taught me the importance of immediate, responsive feedback. I learned to architect systems that are robust on the backend while feeling weightless on the frontend.
                  </p>
                </div>
              </div>

              {/* Node 3 */}
              <div className="story-node relative pl-12 lg:pl-16">
                <div className="story-dot absolute left-[-5px] top-2 h-[12px] w-[12px] rounded-full border-[3px] border-bg bg-text-primary lg:left-[27px]" />
                <div className="story-content">
                  <h3 className="mb-4 font-display text-2xl italic tracking-tight text-text-primary md:text-3xl">
                    Enterprise & AI
                  </h3>
                  <p className="leading-relaxed text-muted md:text-lg">
                    Tackling enterprise complexity became my next frontier. I architected multi-tenant platforms from the ground up, dealing with compliance, scaling to thousands of daily users, and integrating AI seamlessly into engineering workflows to cut manual effort.
                  </p>
                </div>
              </div>

              {/* Node 4 */}
              <div className="story-node relative pl-12 lg:pl-16">
                <div className="story-dot absolute left-[-5px] top-2 h-[12px] w-[12px] rounded-full border-[3px] border-bg bg-text-primary lg:left-[27px]" />
                <div className="story-content">
                  <h3 className="mb-4 font-display text-2xl italic tracking-tight text-text-primary md:text-3xl">
                    My Philosophy
                  </h3>
                  <p className="leading-relaxed text-text-primary md:text-lg">
                    Design with empathy. Develop with rigor. Deploy with confidence. Every project is an opportunity to bridge the gap between complex requirements and seamless user experiences. I don't just write code; I craft digital products that make an impact.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
