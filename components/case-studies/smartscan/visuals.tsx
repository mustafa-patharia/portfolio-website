"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Lock, WifiOff, Wifi, X } from "lucide-react";

/* SmartScan's own accent — SmartScan brand blue (#026bc0), lifted for dark surfaces. */
export const SS_ACCENT = "#4ca2fb";

const mono = "font-mono text-[10px] md:text-[11px] tracking-wide";

function useTicker(length: number, ms: number) {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((v) => (v + 1) % length), ms);
    return () => clearInterval(id);
  }, [length, ms]);
  return i;
}

/* ---------------------------------------------------------------- handheld */

const FLYING_EPCS = ["E280·6894·A3F1", "E280·6894·A3F2", "E280·6894·B017", "E280·6894·C4D9"];

export function HandheldVisual() {
  return (
    <div className="relative flex h-full min-h-[340px] items-end justify-center overflow-hidden">
      {/* RFID field */}
      <svg className="absolute left-1/2 top-4 h-40 w-72 -translate-x-1/2" viewBox="0 0 240 120" fill="none">
        {[0, 1, 2].map((k) => (
          <motion.path
            key={k}
            d={`M ${60 - k * 22} ${110 - k * 4} Q 120 ${30 - k * 26} ${180 + k * 22} ${110 - k * 4}`}
            stroke={SS_ACCENT}
            strokeWidth={1.4}
            strokeLinecap="round"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.9, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, delay: k * 0.45, ease: "easeOut" }}
          />
        ))}
      </svg>

      {/* tags drifting into the reader */}
      {FLYING_EPCS.map((epc, k) => (
        <motion.span
          key={epc}
          className={`${mono} absolute rounded-md border border-ss-400/30 bg-ss-400/10 px-2 py-1 text-ss-200`}
          style={{ left: `${8 + (k % 2) * 62}%`, top: `${8 + k * 9}%` }}
          animate={{ y: [0, 70], opacity: [0, 1, 0], scale: [1, 0.85] }}
          transition={{ duration: 2.8, repeat: Infinity, delay: k * 0.7, ease: "easeIn" }}
        >
          {epc}
        </motion.span>
      ))}

      {/* device */}
      <motion.div
        className="relative z-10 w-[62%] max-w-[230px] translate-y-10 rounded-[1.8rem] border-[6px] border-[#1c1c1f] bg-[#1c1c1f] shadow-[0_30px_60px_rgba(0,0,0,0.6)] transition-transform duration-500 group-hover:translate-y-4"
      >
        <div className="absolute -top-3 left-1/2 h-3 w-16 -translate-x-1/2 rounded-t-lg bg-[#2a2a2e]" />
        <img
          src="/projects/smartscan/device/m-02-dashboard-home.jpeg"
          alt="SmartScan handheld dashboard showing items in stock, accuracy rate and recent scans"
          className="w-full rounded-[1.3rem]"
          loading="lazy"
        />
      </motion.div>
    </div>
  );
}

/* ------------------------------------------------------------ atomic claim */

type Outcome = { epc: string; ok: boolean; reason: string };

const CLAIM_ROUNDS: Outcome[][] = [
  [
    { epc: "E280…A3F1", ok: true, reason: "claimed" },
    { epc: "E280…A3F2", ok: true, reason: "claimed" },
    { epc: "E280…B017", ok: false, reason: "wrong item" },
    { epc: "E280…A3F2", ok: false, reason: "duplicate" },
  ],
  [
    { epc: "E280…C4D9", ok: true, reason: "claimed" },
    { epc: "E280…0F88", ok: false, reason: "already shipped" },
    { epc: "E280…C4DA", ok: true, reason: "claimed" },
    { epc: "E280…C4DB", ok: false, reason: "held by OP-2" },
  ],
];

export function AtomicClaimVisual() {
  const round = useTicker(CLAIM_ROUNDS.length, 3600);
  const rows = CLAIM_ROUNDS[round];
  return (
    <div className="flex h-full flex-col gap-3">
      <pre className={`${mono} overflow-hidden rounded-xl border border-white/5 bg-black/40 p-3 leading-relaxed text-white/50`}>
        <span className="text-ss-300">UPDATE</span> epc_tags SET state = <span className="text-white/80">&apos;in_stock&apos;</span>
        {"\n"} <span className="text-ss-300">WHERE</span> epc = ANY(:scanned) AND item_id = :line
        {"\n"}   AND state = :expected <span className="text-ss-300">RETURNING</span> epc;
      </pre>
      <div className="flex flex-col gap-1.5">
        <AnimatePresence mode="popLayout">
          {rows.map((r, k) => (
            <motion.div
              key={`${round}-${k}`}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 12 }}
              transition={{ delay: k * 0.18, duration: 0.35 }}
              className={`${mono} flex items-center justify-between rounded-lg border px-3 py-1.5 ${
                r.ok ? "border-ss-400/30 bg-ss-400/[0.07] text-ss-100" : "border-white/5 bg-white/[0.02] text-white/40"
              }`}
            >
              <span className="flex items-center gap-2">
                {r.ok ? <Check className="h-3 w-3 text-ss-300" /> : <X className="h-3 w-3 text-red-400/80" />}
                {r.epc}
              </span>
              <span className={r.ok ? "text-ss-300/80" : "text-red-300/70"}>{r.reason}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------ session lock */

export function SessionLockVisual() {
  return (
    <div className="relative flex h-full min-h-[150px] items-center justify-between">
      <motion.div
        className={`${mono} z-10 rounded-full border border-ss-400/40 bg-ss-400/10 px-2.5 py-1 text-ss-200`}
        animate={{ x: [0, 14, 14, 0] }}
        transition={{ duration: 4, repeat: Infinity, times: [0, 0.3, 0.85, 1] }}
      >
        OP-1
      </motion.div>

      <div className="relative flex flex-col items-center gap-1.5">
        <motion.div
          className="flex h-14 w-14 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03]"
          animate={{ borderColor: ["rgba(255,255,255,0.1)", "rgba(76,162,251,0.6)", "rgba(76,162,251,0.6)", "rgba(255,255,255,0.1)"] }}
          transition={{ duration: 4, repeat: Infinity, times: [0, 0.3, 0.85, 1] }}
        >
          <Lock className="h-5 w-5 text-ss-300" strokeWidth={1.6} />
        </motion.div>
        <span className={`${mono} text-white/40`}>BIN A-03-2</span>
      </div>

      <div className="relative">
        <motion.div
          className={`${mono} rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-white/60`}
          animate={{ x: [0, 0, -14, 0, 0] }}
          transition={{ duration: 4, repeat: Infinity, times: [0, 0.4, 0.5, 0.62, 1] }}
        >
          OP-2
        </motion.div>
        <motion.span
          className={`${mono} absolute -bottom-10 right-0 whitespace-nowrap text-red-300`}
          animate={{ opacity: [0, 0, 1, 1, 0], y: [4, 4, 0, 0, -4] }}
          transition={{ duration: 4, repeat: Infinity, times: [0, 0.48, 0.52, 0.75, 0.85] }}
        >
          409 Conflict
        </motion.span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------ durable outbox */

const OUTBOX_STAGES = ["outbox", "BullMQ", "ERP"];
const OUTBOX_STATUS = ["queued", "processing", "retry 2 / 5", "synced · IR-20431"];

export function OutboxVisual() {
  const status = useTicker(OUTBOX_STATUS.length, 1400);
  return (
    <div className="flex h-full min-h-[150px] flex-col justify-center gap-5">
      <div className="relative flex items-center justify-between">
        <div className="absolute left-4 right-4 top-1/2 h-px -translate-y-1/2 bg-gradient-to-r from-white/5 via-white/15 to-white/5" />
        <motion.div
          className="absolute top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full bg-ss-300 shadow-[0_0_14px_rgba(76,162,251,0.9)]"
          animate={{ left: ["6%", "48%", "48%", "90%"] }}
          transition={{ duration: 5.6, repeat: Infinity, times: [0, 0.3, 0.55, 0.85], ease: "easeInOut" }}
        />
        {OUTBOX_STAGES.map((s) => (
          <span key={s} className={`${mono} relative z-10 rounded-md border border-white/10 bg-[#0f0f11] px-2 py-1 text-white/60`}>
            {s}
          </span>
        ))}
      </div>
      <div className={`${mono} flex items-center gap-2 text-white/40`}>
        status
        <AnimatePresence mode="wait">
          <motion.span
            key={status}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className={status === 2 ? "text-red-300" : status === 3 ? "text-ss-300" : "text-white/70"}
          >
            {OUTBOX_STATUS[status]}
          </motion.span>
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------ tenants */

const SCHEMAS = ["root", "tenant_acme", "tenant_nova", "template"];

export function TenantsVisual() {
  return (
    <div className="flex h-full min-h-[170px] items-center justify-center [perspective:700px]">
      <div className="relative h-36 w-44 [--gap:22px] [transform:rotateX(55deg)_rotateZ(-35deg)] [transform-style:preserve-3d] group-hover:[--gap:36px]">
        {SCHEMAS.map((s, k) => (
          <div
            key={s}
            className={`absolute inset-x-0 top-0 flex h-16 items-end justify-start rounded-xl p-2.5 border transition-transform duration-500 ease-out ${
              k === 0 ? "border-ss-400/60 bg-ss-400/15" : "border-white/15 bg-white/[0.04]"
            }`}
            style={{ transform: `translateZ(calc(${k} * var(--gap)))` }}
          >
            <span className={`${mono} ${k === 0 ? "text-ss-200" : "text-white/50"}`}>{s}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------ RBAC matrix */

const MODULES = 19;
const ACTIONS = ["view", "manage", "delete"];

export function RbacVisual() {
  const [lit, setLit] = useState<Set<number>>(new Set([1, 5, 22, 30, 41]));
  useEffect(() => {
    const id = setInterval(() => {
      const next = new Set<number>();
      const n = 6 + Math.floor(Math.random() * 8);
      for (let k = 0; k < n; k++) next.add(Math.floor(Math.random() * MODULES * ACTIONS.length));
      setLit(next);
    }, 1300);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex h-full flex-col justify-center gap-2">
      {ACTIONS.map((a, row) => (
        <div key={a} className="flex items-center gap-2">
          <span className={`${mono} w-12 shrink-0 text-right text-white/40`}>{a}</span>
          <div className="grid flex-1 grid-cols-[repeat(19,minmax(0,1fr))] gap-1">
            {Array.from({ length: MODULES }).map((_, col) => {
              const on = lit.has(row * MODULES + col);
              return (
                <motion.span
                  key={col}
                  className="aspect-square rounded-[3px]"
                  animate={{
                    backgroundColor: on ? "rgba(76,162,251,0.85)" : "rgba(255,255,255,0.05)",
                    boxShadow: on ? "0 0 10px rgba(76,162,251,0.5)" : "0 0 0 rgba(0,0,0,0)",
                  }}
                  transition={{ duration: 0.4 }}
                />
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------ offline resume */

export function OfflineResumeVisual() {
  // 0..7 scanning online, 8..13 offline (draft holds), 14..17 back online, synced
  const tick = useTicker(18, 450);
  const offline = tick >= 8 && tick < 14;
  const count = Math.min(tick, 13) * 4; // scanning continues offline
  const synced = tick >= 14;

  return (
    <div className="flex h-full min-h-[150px] flex-col justify-center gap-4">
      <div className="flex items-center justify-between">
        <span className={`${mono} text-white/40`}>scan_sessions.draft_lines</span>
        {offline ? <WifiOff className="h-4 w-4 text-red-300" /> : <Wifi className="h-4 w-4 text-ss-300" />}
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-white/5">
        <motion.div
          className="h-full rounded-full bg-ss-400"
          animate={{ width: `${(count / 52) * 100}%`, opacity: offline ? 0.45 : 1 }}
          transition={{ duration: 0.4 }}
        />
      </div>
      <div className={`${mono} flex justify-between`}>
        <span className="text-white/70">{count} tags</span>
        <span className={offline ? "text-red-300" : synced ? "text-ss-300" : "text-white/40"}>
          {offline ? "device offline · draft kept" : synced ? "resumed · nothing lost" : "syncing draft"}
        </span>
      </div>
    </div>
  );
}
