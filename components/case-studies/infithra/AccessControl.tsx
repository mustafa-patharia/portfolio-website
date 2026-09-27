"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Lock, Monitor, ShieldCheck, Smartphone, UserRound } from "lucide-react";
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

/* One login across clients: roles differ per client, and mobile access opens only after onboarding. */
const TENANTS = {
  "Company A": { role: "HR manager", spaces: ["hr", "ess", "mobile"] },
  "Company B": { role: "Employee", spaces: ["ess", "mobile"] },
} as const;
type TenantName = keyof typeof TENANTS;
const SPACES = [
  { id: "hr", label: "HR platform", icon: Monitor },
  { id: "ess", label: "Self-service · web", icon: UserRound },
  { id: "mobile", label: "Self-service · mobile", icon: Smartphone },
] as const;
type Space = (typeof SPACES)[number]["id"];

function SignInDemo() {
  const [tenant, setTenant] = useState<TenantName>("Company A");
  const [space, setSpace] = useState<Space>("hr");
  const [onboarded, setOnboarded] = useState(false);

  const allowed = (s: Space) => (TENANTS[tenant].spaces as readonly Space[]).includes(s) && (s !== "mobile" || onboarded);
  const pickTenant = (t: TenantName) => {
    setTenant(t);
    if (!(TENANTS[t].spaces as readonly Space[]).includes(space)) setSpace("ess");
  };
  const toggleOnboarded = () => {
    if (onboarded && space === "mobile") setSpace("ess");
    setOnboarded(!onboarded);
  };
  const current = SPACES.find((s) => s.id === space)!;

  return (
    <div className="grid gap-4 lg:grid-cols-[1.25fr_1fr]">
      <Panel label="One login">
        <div className="space-y-4">
          <div>
            <p className={`${mono} mb-1.5 text-white/40`}>Switch company</p>
            <div className="flex flex-wrap gap-1.5">
              {(Object.keys(TENANTS) as TenantName[]).map((t) => (
                <button
                  key={t}
                  onClick={() => pickTenant(t)}
                  aria-pressed={tenant === t}
                  className={`rounded-full border px-3 py-1 text-xs transition-all duration-200 hover:-translate-y-0.5 ${tenant === t ? "border-ipink-500/70 bg-ipink-500/15 text-ipink-200" : "border-white/10 text-white/50 hover:border-white/30 hover:text-white"}`}
                >
                  {t} <span className="text-white/35">· {TENANTS[t].role}</span>
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className={`${mono} mb-1.5 text-white/40`}>Switch platform</p>
            <div className="grid gap-1.5 sm:grid-cols-3">
              {SPACES.map((s) => {
                const ok = allowed(s.id);
                const on = s.id === space;
                const Icon = s.icon;
                return (
                  <button
                    key={s.id}
                    disabled={!ok}
                    onClick={() => setSpace(s.id)}
                    aria-pressed={on}
                    className={`flex items-center gap-2 rounded-lg border px-2.5 py-2 text-left text-[12px] transition-all duration-200 ${on ? "border-inf-400/60 bg-inf-600 text-white" : ok ? "border-white/10 text-white/60 hover:border-inf-400/40 hover:text-white" : "cursor-not-allowed border-white/[0.05] text-white/20"}`}
                  >
                    {ok ? <Icon className="h-3.5 w-3.5 shrink-0" /> : <Lock className="h-3.5 w-3.5 shrink-0" />}
                    {s.label}
                  </button>
                );
              })}
            </div>
          </div>
          <button onClick={toggleOnboarded} aria-pressed={onboarded} className="group flex items-center gap-2.5 text-left text-[12px] text-white/60 transition-colors hover:text-white">
            <span className={`relative h-5 w-9 rounded-full border transition-colors duration-200 ${onboarded ? "border-ipink-500/60 bg-ipink-500/30" : "border-white/15 bg-white/5"}`}>
              <motion.span layout className={`absolute top-0.5 h-3.5 w-3.5 rounded-full ${onboarded ? "right-0.5 bg-ipink-400" : "left-0.5 bg-white/40"}`} />
            </span>
            Onboarding complete <span className="hidden text-white/35 sm:inline">· unlocks mobile access</span>
          </button>
        </div>
      </Panel>

      <Panel label="Session">
        <AnimatePresence mode="wait">
          <motion.div key={`${tenant}-${space}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.22 }} className="space-y-2.5">
            <div className="flex items-center gap-2 rounded-lg border border-inf-400/30 bg-inf-600/20 px-3 py-2 text-[12px] text-inf-100">
              <ShieldCheck className="h-4 w-4 text-ipink-300" /> Signed in · multi-factor verified
            </div>
            {[
              ["Company", tenant],
              ["Platform", current.label],
              ["Role", TENANTS[tenant].role],
            ].map(([k, v]) => (
              <div key={k} className="flex items-center justify-between border-b border-white/[0.06] pb-2 text-[13px]">
                <span className="text-white/40">{k}</span>
                <span className="text-white/85">{v}</span>
              </div>
            ))}
            <div className="flex items-center gap-2 pt-1 font-mono text-[10px] text-ipink-200">
              <Check className="h-3 w-3" strokeWidth={3} /> Data scope: {tenant} only
            </div>
          </motion.div>
        </AnimatePresence>
      </Panel>
    </div>
  );
}

/** Each tenant's requests stay inside its own boundary. */
function IsolationVisual() {
  const i = useTicker(3, 1400);
  return (
    <div className="grid grid-cols-3 gap-3">
      {["Company A", "Company B", "Company C"].map((c, k) => (
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
        title="Multi-tenant sign-in"
        caption="A single user can belong to multiple companies and switch between them without signing out, and each switch moves the session into that company's own data. Users move between the HR platform and self-service on the web, and self-service also runs on mobile. Access is granted in stages: web access when the employee record is created, mobile access once onboarding is complete. Sign-in is protected with multi-factor authentication. Try it."
      >
        <SignInDemo />
      </Tile>
      <Tile
        title="Two-layer permissions"
        caption="I designed a two-layer permission model. The first layer grants create, read, update and delete rights per module. The second narrows those rights to a slice of the organisation, by subsidiary, location, department or a set of employees, in any combination. Both layers are configuration. Try it."
      >
        <PermissionDemo />
      </Tile>
      <Tile
        title="Tenant isolation"
        caption="Every tenant's data is isolated, and a request can only reach its own data. This was built into the architecture from the first release."
      >
        <IsolationVisual />
      </Tile>
    </div>
  );
}
