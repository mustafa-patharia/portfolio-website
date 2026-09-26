"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Lock } from "lucide-react";
import { Panel, Tile, mono, useTicker } from "./shared";

/* Illustrative organisation — generic names, no client data. */
const MODULES = ["Employees", "Payroll", "Leave", "Attendance"];
const ACTIONS = ["C", "R", "U", "D"] as const;

const SCOPES = {
  Subsidiary: ["Company A", "Company B"],
  Location: ["Dubai", "Abu Dhabi", "Riyadh"],
  Department: ["Finance", "Operations", "Sales"],
} as const;
type Dim = keyof typeof SCOPES;

const PEOPLE = Array.from({ length: 12 }, (_, k) => ({
  id: 1040 + k,
  Subsidiary: SCOPES.Subsidiary[k % 2],
  Location: SCOPES.Location[k % 3],
  Department: SCOPES.Department[Math.floor(k / 2) % 3],
}));

function PermissionDemo() {
  const [grid, setGrid] = useState<Record<string, boolean>>(() => {
    const g: Record<string, boolean> = {};
    MODULES.forEach((m) => ACTIONS.forEach((a) => (g[`${m}-${a}`] = a === "R" || (m === "Leave" && a === "U"))));
    return g;
  });
  const [scope, setScope] = useState<Record<Dim, string[]>>({ Subsidiary: [], Location: ["Dubai"], Department: [] });

  const toggleScope = (d: Dim, v: string) =>
    setScope((s) => ({ ...s, [d]: s[d].includes(v) ? s[d].filter((x) => x !== v) : [...s[d], v] }));

  const visible = useMemo(
    () => PEOPLE.filter((p) => (Object.keys(scope) as Dim[]).every((d) => scope[d].length === 0 || scope[d].includes(p[d]))),
    [scope]
  );
  const canRead = grid["Employees-R"];

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_1fr_1.1fr]">
      <Panel label="Layer 1 · rights per module">
        <div className="grid grid-cols-[1fr_repeat(4,28px)] items-center gap-1.5">
          <span />
          {ACTIONS.map((a) => (
            <span key={a} className={`${mono} text-center text-white/35`}>{a}</span>
          ))}
          {MODULES.map((m) => (
            <div key={m} className="contents">
              <span className="text-[13px] text-white/70">{m}</span>
              {ACTIONS.map((a) => {
                const on = grid[`${m}-${a}`];
                return (
                  <button
                    key={a}
                    aria-label={`${m} ${a}`}
                    aria-pressed={on}
                    onClick={() => setGrid((g) => ({ ...g, [`${m}-${a}`]: !g[`${m}-${a}`] }))}
                    className={`h-7 rounded-md border transition-all duration-200 hover:scale-110 ${on ? "border-inf-400/60 bg-inf-600" : "border-white/10 bg-white/[0.02] hover:border-inf-400/40"}`}
                  />
                );
              })}
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs text-white/35">Tap a cell to grant or revoke.</p>
      </Panel>

      <Panel label="Layer 2 · scope by organisation">
        <div className="space-y-3">
          {(Object.keys(SCOPES) as Dim[]).map((d) => (
            <div key={d}>
              <p className={`${mono} mb-1.5 text-white/40`}>{d}</p>
              <div className="flex flex-wrap gap-1.5">
                {SCOPES[d].map((v) => {
                  const on = scope[d].includes(v);
                  return (
                    <button
                      key={v}
                      onClick={() => toggleScope(d, v)}
                      aria-pressed={on}
                      className={`rounded-full border px-2.5 py-1 text-xs transition-all duration-200 hover:-translate-y-0.5 ${on ? "border-ipink-500/70 bg-ipink-500/15 text-ipink-200" : "border-white/10 text-white/50 hover:border-white/30 hover:text-white"}`}
                    >
                      {v}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs text-white/35">No selection in a group means no limit on it.</p>
      </Panel>

      <Panel label={canRead ? `Visible employees · ${visible.length}` : "Visible employees · none"}>
        {canRead ? (
          <div className="grid max-h-[230px] grid-cols-2 gap-1.5 overflow-hidden">
            <AnimatePresence initial={false}>
              {visible.map((p) => (
                <motion.div
                  key={p.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  className="rounded-lg border border-white/[0.07] bg-white/[0.03] px-2 py-1.5"
                >
                  <p className="text-[12px] text-white/80">#{p.id}</p>
                  <p className="truncate font-mono text-[9px] text-white/35">
                    {p.Location} · {p.Department}
                  </p>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="flex h-[180px] flex-col items-center justify-center gap-2 text-sm text-white/40">
            <Lock className="h-5 w-5" /> Read on Employees is off
          </div>
        )}
      </Panel>
    </div>
  );
}

/** Each tenant's requests stay inside its own boundary. */
function IsolationVisual() {
  const i = useTicker(3, 1400);
  return (
    <div className="grid grid-cols-3 gap-3">
      {["Client A", "Client B", "Client C"].map((c, k) => (
        <div key={c} className={`relative rounded-2xl border p-3 transition-colors duration-300 ${k === i ? "border-ipink-500/50 bg-ipink-500/[0.06]" : "border-white/[0.07] bg-[#0b0811]"}`}>
          <p className={`${mono} mb-3 ${k === i ? "text-ipink-200" : "text-white/40"}`}>{c}</p>
          <div className="relative h-16">
            <div className={`absolute inset-x-0 bottom-0 flex h-8 items-center justify-center gap-1.5 rounded-lg border font-mono text-[10px] transition-colors ${k === i ? "border-ipink-500/40 text-ipink-200" : "border-white/10 text-white/30"}`}>
              <Lock className="h-3 w-3" /> own data
            </div>
            {k === i && (
              <motion.span
                key={`${c}-${i}`}
                initial={{ top: 0, opacity: 0 }}
                animate={{ top: 34, opacity: [0, 1, 1, 0] }}
                transition={{ duration: 1.1, ease: "easeIn" }}
                className="absolute left-1/2 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-ipink-500 shadow-[0_0_12px_rgba(252,23,119,0.8)]"
              />
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function AccessControl() {
  return (
    <div className="grid gap-4 md:gap-5">
      <Tile
        title="Two-layer permissions"
        caption="Layer one grants create, read, update and delete rights per module. Layer two narrows those rights to a slice of the organisation, by subsidiary, location, department or a set of employees, in any combination. Both layers are configuration. Try it."
      >
        <PermissionDemo />
      </Tile>
      <Tile
        title="Tenant isolation"
        caption="Every client's data is kept separate, and a request can only ever reach its own tenant. This was part of the architecture from the first release, not added later."
      >
        <IsolationVisual />
      </Tile>
    </div>
  );
}
