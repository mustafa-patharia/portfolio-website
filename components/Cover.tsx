"use client";

import { useState } from "react";
import ProjectArt from "./ProjectArt";

const EXTENSIONS = ["jpg", "png", "webp"];

/**
 * Renders `${dir}/${slug}.{jpg|png|webp}` if the file exists, walking the
 * extension list on each load failure. Once all options are exhausted it falls
 * back to the generated gradient art — so an empty drop folder still looks
 * finished, and adding a file needs no code change.
 */
export default function Cover({
  src,
  dir,
  slug,
  seed,
  label,
  alt,
  className,
  compact = false,
}: {
  src?: string;
  dir: string;
  slug: string;
  seed: number;
  label?: string;
  alt: string;
  className?: string;
  compact?: boolean;
}) {
  const [attempt, setAttempt] = useState(0);
  const exhausted = !src && attempt >= EXTENSIONS.length;
  const currentSrc = src || `${dir}/${slug}.${EXTENSIONS[attempt]}`;

  return (
    <div className="absolute inset-0 overflow-hidden">
      <ProjectArt
        seed={seed}
        label={exhausted ? label : undefined}
        compact={compact}
      />

      {!exhausted && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={src ? "static" : attempt}
          src={currentSrc}
          alt={alt}
          onError={() => {
            if (!src) setAttempt((a) => a + 1);
          }}
          className={`absolute inset-0 h-full w-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105 ${
            className ?? ""
          }`}
        />
      )}
    </div>
  );
}
