"use client";

import { useEffect, useRef } from "react";

export const HLS_SRC =
  "https://stream.mux.com/Aa02T7oM1wH5Mk5EEVDYhbZ1ChcdhRsS2m1NYyx4Ua1g.m3u8";

export default function HlsVideo({ className }: { className?: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let hls: import("hls.js").default | null = null;
    let cancelled = false;

    (async () => {
      const Hls = (await import("hls.js")).default;

      if (Hls.isSupported()) {
        if (cancelled) return;
        // Assume a fast link so playback starts on the top rendition — the
        // home dive scales this video up ~10x. ABR still steps down if needed.
        hls = new Hls({
          enableWorker: true,
          capLevelToPlayerSize: false,
          abrEwmaDefaultEstimate: 20_000_000,
        });
        hls.loadSource(HLS_SRC);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          void video.play().catch(() => {});
        });
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = HLS_SRC;
        void video.play().catch(() => {});
      }
    })();

    return () => {
      cancelled = true;
      hls?.destroy();
    };
  }, []);

  return (
    <video
      ref={videoRef}
      autoPlay
      muted
      loop
      playsInline
      className={`absolute left-1/2 top-1/2 min-h-full min-w-full -translate-x-1/2 -translate-y-1/2 object-cover ${
        className ?? ""
      }`}
    />
  );
}
