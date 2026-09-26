"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Folder, FileCode2, Plus } from "lucide-react";
import { Panel, Tile, mono, useTicker } from "./shared";

/* Illustrative only: generic service, module and file names, no internal structure. */

/** A request travels from the web tier through a domain service to its own client database. */
function ArchitectureVisual() {
  const i = useTicker(4, 1500);
  const svc = i % 4;
  const db = [1, 2, 3, 1][i];
  const dbs = ["Admin", "Client A", "Client B", "Client C"];
  const row = "grid grid-cols-4 gap-1.5 sm:gap-2";
  const box = (on: boolean) =>
    `rounded-lg border px-1.5 py-2 text-center font-mono text-[9px] transition-colors duration-300 sm:text-[10px] ${on ? "border-ipink-500/60 bg-ipink-500/10 text-ipink-200" : "border-white/10 text-white/40"}`;

  return (
    <Panel>
      <div className="space-y-2">
        <p className={`${mono} text-white/35`}>Web tier</p>
        <div className="grid grid-cols-1">
          <div className={box(true)}>Frontend service · HR platform · self-service · admin</div>
        </div>
        <Flow />
        <p className={`${mono} text-white/35`}>Domain services</p>
        <div className={row}>
          {[1, 2, 3, 4].map((n, k) => (
            <div key={n} className={box(k === svc)}>
              service {n}
            </div>
          ))}
        </div>
        <Flow />
        <p className={`${mono} text-white/35`}>Databases · one per client</p>
        <div className={row}>
          {dbs.map((d, k) => (
            <div key={d} className={box(k === db)}>
              {d}
            </div>
          ))}
        </div>
      </div>
    </Panel>
  );
}

function Flow() {
  return (
    <div className="relative mx-auto h-4 w-px bg-white/15">
      <motion.span
        className="absolute -left-[2.5px] h-1.5 w-1.5 rounded-full bg-ipink-500 shadow-[0_0_8px_rgba(252,23,119,0.8)]"
        animate={{ top: ["0%", "100%"], opacity: [0, 1, 0] }}
        transition={{ duration: 0.9, repeat: Infinity, ease: "easeIn" }}
      />
    </div>
  );
}

const MODS = ["employees", "leave", "payroll", "attendance"];
const PARTS = ["routes", "service", "model", "validation"];

/** Every module follows the same shape, so any developer knows where to look. */
function CodebaseVisual() {
  const i = useTicker(MODS.length, 1300);
  return (
    <Panel label="modules/">
      <div className="space-y-1">
        {MODS.map((m, k) => {
          const on = k === i;
          return (
            <div key={m}>
              <div className={`flex items-center gap-2 rounded-md px-1.5 py-1 text-[12px] transition-colors duration-300 ${on ? "bg-inf-600/40 text-white" : "text-white/50"}`}>
                <Folder className={`h-3.5 w-3.5 ${on ? "text-ipink-300" : "text-inf-300"}`} />
                {m}/
              </div>
              <AnimatePresence initial={false}>
                {on && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                    <div className="grid grid-cols-2 gap-x-2 py-1 pl-6">
                      {PARTS.map((p) => (
                        <span key={p} className="flex items-center gap-1.5 font-mono text-[10px] text-white/55">
                          <FileCode2 className="h-3 w-3 text-white/30" />
                          {p}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </Panel>
  );
}

const BLOCKS = ["API response", "Validation", "Data table", "Theme"];
const USERS = ["Leave", "Payroll", "Expenses"];

/** The same shared pieces light up inside every module that uses them. */
function SharedBlocksVisual() {
  const i = useTicker(BLOCKS.length, 1200);
  return (
    <Panel>
      <div className="mb-3 flex flex-wrap gap-1.5">
        {BLOCKS.map((b, k) => (
          <span key={b} className={`rounded-full border px-2.5 py-1 font-mono text-[10px] transition-colors duration-300 ${k === i ? "border-ipink-500/60 bg-ipink-500/15 text-ipink-200" : "border-white/10 text-white/40"}`}>
            {b}
          </span>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-1.5">
        {USERS.map((u) => (
          <div key={u} className="rounded-lg border border-white/[0.07] p-2">
            <p className="mb-1.5 text-[11px] text-white/65">{u}</p>
            <div className="space-y-1">
              {BLOCKS.map((b, k) => (
                <span key={b} className={`block h-1.5 rounded-full transition-colors duration-300 ${k === i ? "bg-ipink-500/80" : "bg-white/10"}`} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
}

/* Stored values in two languages; the response carries the one the user prefers. */
const RECORD = [
  { k: "name", en: "Omar Haddad", ar: "عمر حداد" },
  { k: "location", en: "Dubai", ar: "دبي" },
  { k: "subsidiary", en: "Company A", ar: "الشركة أ" },
];

function MultiLanguageVisual() {
  const [lang, setLang] = useState<"en" | "ar">("en");
  const [auto, setAuto] = useState(true);
  useEffect(() => {
    if (!auto) return;
    const id = setInterval(() => setLang((l) => (l === "en" ? "ar" : "en")), 2600);
    return () => clearInterval(id);
  }, [auto]);
  const pick = (l: "en" | "ar") => {
    setAuto(false);
    setLang(l);
  };

  return (
    <div className="grid items-stretch gap-3 md:grid-cols-[1.5fr_auto_1fr]">
      <Panel label="Stored · employee record">
        <div className="space-y-2">
          {RECORD.map((r) => (
            <div key={r.k} className="grid grid-cols-[62px_1fr] items-center gap-2">
              <span className={`${mono} text-white/35`}>{r.k}</span>
              <div className="grid grid-cols-2 gap-1.5">
                <span className={`truncate rounded-md border px-2 py-1 text-[12px] transition-colors duration-300 ${lang === "en" ? "border-inf-400/60 bg-inf-600/30 text-white" : "border-white/10 text-white/45"}`}>{r.en}</span>
                <span dir="rtl" className={`truncate rounded-md border px-2 py-1 text-[12px] transition-colors duration-300 ${lang === "ar" ? "border-ipink-500/60 bg-ipink-500/10 text-ipink-100" : "border-white/10 text-white/45"}`}>
                  {r.ar}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Panel>

      <div className="flex flex-row items-center justify-center gap-2 md:flex-col">
        <div className="flex gap-1 rounded-full border border-white/10 p-1">
          {(["en", "ar"] as const).map((l) => (
            <button
              key={l}
              onClick={() => pick(l)}
              aria-pressed={lang === l}
              className={`rounded-full px-3 py-1 font-mono text-[10px] uppercase transition-colors duration-200 ${lang === l ? "bg-inf-600 text-white" : "text-white/45 hover:text-white"}`}
            >
              {l}
            </button>
          ))}
          <span className="flex items-center rounded-full px-2 text-white/25" title="Any further language">
            <Plus className="h-3 w-3" />
          </span>
        </div>
        <ArrowRight className="h-4 w-4 rotate-90 text-ipink-400 md:rotate-0" />
        <span className={`${mono} text-white/35`}>user preference</span>
      </div>

      <Panel label="API response">
        <div className="font-mono text-[11px] leading-relaxed text-white/45">
          <p>{"{"}</p>
          {RECORD.map((r, k) => (
            <p key={r.k} className="pl-3">
              <span className="text-inf-300">&quot;{r.k}&quot;</span>:{" "}
              <AnimatePresence mode="wait">
                <motion.span
                  key={lang}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.2, delay: k * 0.05 }}
                  className={`inline-block ${lang === "ar" ? "text-ipink-200" : "text-white/85"}`}
                >
                  &quot;{lang === "en" ? r.en : r.ar}&quot;
                </motion.span>
              </AnimatePresence>
              {k < RECORD.length - 1 ? "," : ""}
            </p>
          ))}
          <p>{"}"}</p>
        </div>
      </Panel>
    </div>
  );
}

export default function Foundations() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-5">
      <Tile
        title="Architecture and infrastructure"
        caption="I chose the cloud services, split the backend into domain services, and designed the database schema and table structure, with a separate database for every client."
        className="md:col-span-2"
      >
        <ArchitectureVisual />
      </Tile>
      <Tile title="Codebase standards" caption="One repository layout, module structure and set of naming rules, so any developer can find where a feature lives and add the next one the same way.">
        <CodebaseVisual />
      </Tile>
      <Tile title="Shared building blocks" caption="A standard API structure, reusable functions and components on the backend and frontend, and a global theme and styling system.">
        <SharedBlocksVisual />
      </Tile>
      <Tile
        title="Multi-language data"
        caption="Multi-language covers stored data, not only the interface. Fields such as employee, location and subsidiary names take values in more than one language, and a layer in the data access code swaps in the stored translation before the API responds. Emails follow the same preference. Arabic runs in production, and adding another language needs no custom code. Try it."
        className="md:col-span-2"
      >
        <MultiLanguageVisual />
      </Tile>
    </div>
  );
}
