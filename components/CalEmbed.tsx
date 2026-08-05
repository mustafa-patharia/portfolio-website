"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    Cal?: any;
  }
}

/** Initializes the Cal.com element-click embed once on mount. */
export default function CalEmbed() {
  useEffect(() => {
    (function (C: any, A: string, L: string) {
      let p = function (a: { q: any[] }, ar: any) {
        a.q.push(ar);
      };
      const d = C.document;
      C.Cal =
        C.Cal ||
        function (...args: any[]) {
          const cal = C.Cal;
          const ar = args;
          if (!cal.loaded) {
            cal.ns = {};
            cal.q = cal.q || [];
            d.head.appendChild(d.createElement("script")).src = A;
            cal.loaded = true;
          }
          if (ar[0] === L) {
            const api: any = function (...apiArgs: any[]) {
              p(api, apiArgs);
            };
            const namespace = ar[1];
            api.q = api.q || [];
            if (typeof namespace === "string") {
              cal.ns[namespace] = cal.ns[namespace] || api;
              p(cal.ns[namespace], ar);
              p(cal, ["initNamespace", namespace]);
            } else p(cal, ar);
            return;
          }
          p(cal, ar);
        };
    })(window, "https://app.cal.com/embed/embed.js", "init");

    window.Cal("init", "quick-chat", { origin: "https://app.cal.com" });
    window.Cal.ns["quick-chat"]("ui", {
      hideEventTypeDetails: false,
      layout: "month_view",
    });
  }, []);

  return null;
}
