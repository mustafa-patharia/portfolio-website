"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import DecryptedText from "../../reactbits/DecryptedText";
import { mono, reveal, useTicker } from "./shared";

const B36 = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

/* Same algorithm as the addon's to_netsuite_gift_code(): strip to A-Z0-9, append #n for
   a top-up, SHA-256, read as an integer, take the 9 lowest base-36 digits, lowest first. */
async function toNetSuiteGiftCode(odooCode: string, topUp: number) {
  let clean = odooCode.toUpperCase().replace(/[^A-Z0-9]/g, "");
  if (topUp) clean += `#${topUp}`;
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(clean));
  const hex = Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, "0")).join("");
  let n = BigInt("0x" + hex);
  const base = BigInt(36);
  let code = "";
  for (let i = 0; i < 9; i++) {
    code += B36[Number(n % base)];
    n = n / base;
  }
  return { clean, hex, code };
}

const LOADS = ["Purchase", "Top-up 1", "Top-up 2"];

function Forge() {
  const [card, setCard] = useState("0447-0562-429d");
  const [load, setLoad] = useState(0);
  const [out, setOut] = useState<{ clean: string; hex: string; code: string } | null>(null);

  useEffect(() => {
    let live = true;
    if (!window.crypto?.subtle) return;
    toNetSuiteGiftCode(card, load).then((r) => live && setOut(r));
    return () => {
      live = false;
    };
  }, [card, load]);

  const rows = out
    ? [
      { k: "hash input", v: out.clean },
      { k: "sha-256", v: `${out.hex.slice(0, 24)}…` },
      { k: "base-36, 9 digits", v: out.code },
    ]
    : [];

  return (
    <motion.div {...reveal} className="rounded-2xl border border-white/[0.06] bg-[#121013] p-5 transition-colors hover:border-odoo-400/40 md:p-7">
      <div className="grid gap-6 md:grid-cols-[1fr_1.1fr] md:items-center">
        <div>
          <label className={`${mono} text-white/40`} htmlFor="gift-card-code">
            Odoo&apos;s gift card or eWallet code · 14 characters
          </label>
          <input
            id="gift-card-code"
            value={card}
            maxLength={20}
            onChange={(e) => setCard(e.target.value)}
            spellCheck={false}
            className="mt-2 w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2.5 font-mono text-lg tracking-wider text-white outline-none transition-colors focus:border-odoo-400/60"
          />
          <div className="mt-4 flex flex-wrap gap-2">
            {LOADS.map((l, k) => (
              <button
                key={l}
                onClick={() => setLoad(k)}
                className={`rounded-full border px-3 py-1 text-sm transition-all duration-300 hover:-translate-y-0.5 ${load === k ? "border-odoo-600 bg-odoo-600 text-white" : "border-white/10 text-white/55 hover:border-odoo-400/50 hover:text-white"
                  }`}
              >
                {l}
              </button>
            ))}
          </div>
          <p className="mt-5 text-sm leading-relaxed text-muted">
            Enter any card code. It runs the add-on&apos;s own algorithm in your browser. The same card and top-up always give the same code, so no
            lookup table is needed.
          </p>
        </div>

        <div className="rounded-xl border border-white/[0.06] bg-black/30 p-4">
          <div className="flex flex-col gap-2">
            {rows.map((r) => (
              <div key={r.k} className="flex items-baseline justify-between gap-3 border-b border-white/[0.05] pb-2">
                <span className={`${mono} shrink-0 text-white/35`}>{r.k}</span>
                <span className="truncate font-mono text-xs text-white/60">{r.v}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className={`${mono} text-white/40`}>NetSuite gift certificate</p>
              <div className="mt-1 font-mono text-3xl tracking-[0.15em] text-oteal-300 md:text-4xl">
                {out && <DecryptedText key={out.code} text={out.code} animateOn="view" sequential speed={40} characters={B36} encryptedClassName="text-odoo-300/60" />}
              </div>
            </div>
            <span className={`${mono} whitespace-nowrap rounded bg-white/[0.05] px-2 py-1 text-white/50`}>
              line: {card}_{load + 1}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* Oldest certificate first. Card bought for 200, topped up with 50, redeemed 70 then 170. */
const FIFO = [
  { label: "Purchase 200", c1: 200, c2: null, sent: "" },
  { label: "Top-up 50", c1: 200, c2: 50, sent: "" },
  { label: "Redeem 70", c1: 130, c2: 50, sent: "cert 1: 70" },
  { label: "Redeem 170", c1: 0, c2: 10, sent: "cert 1: 130 · cert 2: 40" },
];

function Fifo() {
  const t = useTicker(FIFO.length + 1, 1500);
  const s = FIFO[Math.min(t, FIFO.length - 1)];
  return (
    <motion.div {...reveal} className="flex flex-col rounded-2xl border border-white/[0.06] bg-[#121013] p-5 transition-colors hover:border-odoo-400/40 md:p-6">
      <div className="flex-1">
        <AnimatePresence mode="wait">
          <motion.p key={s.label} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mb-4 font-mono text-sm text-odoo-200">
            {s.label}
          </motion.p>
        </AnimatePresence>
        {[
          { name: "cert 1 · _1", v: s.c1, max: 200 },
          { name: "cert 2 · _2", v: s.c2, max: 200 },
        ].map((c) => (
          <div key={c.name} className="mb-3">
            <div className={`${mono} mb-1 flex justify-between text-white/45`}>
              <span>{c.name}</span>
              <span className="text-white/70">{c.v === null ? "not issued" : c.v.toFixed(2)}</span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-white/5">
              <motion.div className="h-full rounded-full bg-gradient-to-r from-odoo-500 to-oteal-400" animate={{ width: `${((c.v ?? 0) / c.max) * 100}%` }} transition={{ duration: 0.6 }} />
            </div>
          </div>
        ))}
        <p className={`${mono} mt-2 h-4 text-oteal-300`}>{s.sent && `redeem_gift_codes → ${s.sent}`}</p>
      </div>
      <div className="mt-5 border-t border-white/[0.06] pt-4">
        <h3 className="font-medium text-white">Oldest balance first</h3>
        <p className="mt-1 text-sm leading-relaxed text-muted">When a card is used, the add-on replays its history and spends the oldest certificate first, telling NetSuite exactly how much comes from each.</p>
      </div>
    </motion.div>
  );
}

export default function GiftCards() {
  return (
    <div className="flex flex-col gap-5">
      <Forge />
      <div className="grid gap-5 md:grid-cols-2">
        <Fifo />
        <motion.div {...reveal} className="flex flex-col justify-between rounded-2xl border border-white/[0.06] bg-[#121013] p-5 transition-colors hover:border-odoo-400/40 md:p-6">
          <div className="flex flex-col gap-2">
            {[
              { t: "Gift card invoice · order A", d: "posted first", c: "border-oteal-400/40 bg-oteal-500/10 text-oteal-200" },
              { t: "Consolidated invoice · A + B", d: "then everything else", c: "border-odoo-400/30 bg-odoo-600/10 text-odoo-100" },
            ].map((r, k) => (
              <motion.div
                key={r.t}
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + k * 0.25 }}
                className={`${mono} flex justify-between rounded-lg border px-3 py-2.5 ${r.c}`}
              >
                <span>{r.t}</span>
                <span className="opacity-70">{r.d}</span>
              </motion.div>
            ))}
          </div>
          <div className="mt-5 border-t border-white/[0.06] pt-4">
            <h3 className="font-medium text-white">Top-ups before spending</h3>
            <p className="mt-1 text-sm leading-relaxed text-muted">
              When a day is merged, gift card sales go first on their own invoice, so a certificate exists before anything in the same batch uses
              it.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
