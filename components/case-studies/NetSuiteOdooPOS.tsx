"use client";

import Link from "next/link";
import { MotionConfig, motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import CountUp from "../reactbits/CountUp";
import AppCard from "./netsuite/AppCard";
import OdooMenuBar from "./netsuite/OdooMenuBar";
import PosWalkthrough from "./netsuite/PosWalkthrough";
import ExchangeSplit from "./netsuite/ExchangeSplit";
import ConfigPush from "./netsuite/ConfigPush";
import MappingResolver from "./netsuite/MappingResolver";
import GiftCards from "./netsuite/GiftCards";
import SyncLogs from "./netsuite/SyncLogs";
import Architecture from "./netsuite/Architecture";
import Roles from "./netsuite/Roles";
import Chatter from "./netsuite/Chatter";
import { Chapter, EASE, Tile, reveal } from "./netsuite/shared";
import {
  ChangeNettingVisual,
  ConsolidationVisual,
  FourStepsVisual,
  PaymentWaitVisual,
  RowLockVisual,
  StickyFailureVisual,
} from "./netsuite/syncVisuals";

/* ------------------------------------------------------------------ content */

const META = [
  { k: "Role", v: "Freelancer · end-to-end ownership" },
  { k: "Client", v: "InnovateNex, for Foresee Solutions" },
  { k: "Timeline", v: "Jul – Sep 2026 · delivered" },
  { k: "Built on", v: "Odoo 18 · NetSuite" },
];

const STATS = [
  { n: 4, label: "NetSuite transaction types" },
  { n: 6, label: "Sync states, each with a rule" },
  { n: 72, label: "Automated tests" },
  { n: 39, label: "QA cases signed off" },
];

const STACK = ["Odoo 18", "Python", "PostgreSQL", "OCA queue_job", "OAuth 1.0a", "SuiteQL", "NetSuite RESTlets", "Docker"];

/* --------------------------------------------------------------------- page */

export default function NetSuiteOdooCaseStudy() {
  return (
    <MotionConfig reducedMotion="user">
      <main className="selection:bg-odoo-600 selection:text-white">
        {/* ============================================================ HERO */}
        <section className="relative overflow-hidden px-6 pb-16 pt-36 md:px-10 lg:pt-44">
          <div aria-hidden className="pointer-events-none absolute -left-40 top-10 h-[520px] w-[520px] rounded-full bg-odoo-600/25 blur-[120px]" />
          <div aria-hidden className="pointer-events-none absolute -right-40 bottom-0 h-[420px] w-[420px] rounded-full bg-oteal-500/15 blur-[120px]" />
          {/* ledger ruling */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-40 [mask-image:linear-gradient(to_bottom,black,transparent_85%)]"
            style={{ backgroundImage: "repeating-linear-gradient(to bottom, transparent 0 39px, rgba(255,255,255,0.05) 39px 40px)" }}
          />

          <div className="relative mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1.35fr_1fr]">
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE }}>
              <p className="mb-5 inline-flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.3em] text-odoo-300">
                <span className="h-px w-8 bg-odoo-400/70" />
                Case study · Odoo addon · Foresee Solutions
              </p>
              <h1 className="font-display text-5xl italic leading-[0.95] tracking-tight md:text-7xl lg:text-8xl">
                Odoo POS <span className="text-odoo-300">×</span> NetSuite
              </h1>
              <p className="mt-5 text-2xl font-light text-white/80 md:text-3xl">
                Every POS order, <span className="text-oteal-300">on NetSuite&apos;s books.</span>
              </p>
              <p className="mt-6 max-w-xl leading-relaxed text-muted md:text-lg">
                An Odoo addon that connects Odoo Point of Sale to NetSuite. Each POS order becomes the right NetSuite documents (invoices, credit memos,
                customer payments, refunds and gift certificates), posted in the order NetSuite accepts them and never twice. NetSuite stays in charge:
                it pushes the configuration and the product catalog into Odoo.
              </p>
            </motion.div>

            <div className="flex justify-center lg:justify-end">
              <AppCard />
            </div>
          </div>

          <div className="relative mx-auto mt-16 max-w-6xl">
            <motion.dl
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: EASE }}
              className="grid grid-cols-2 gap-x-6 gap-y-5 border-y border-white/10 py-6 lg:grid-cols-4"
            >
              {META.map((m) => (
                <div key={m.k} className="group">
                  <dt className="font-mono text-[10px] uppercase tracking-[0.25em] text-odoo-grey">{m.k}</dt>
                  <dd className="mt-1.5 text-sm text-white/85 transition-colors group-hover:text-odoo-200">{m.v}</dd>
                </div>
              ))}
            </motion.dl>

            <div className="mt-10 grid grid-cols-2 gap-8 md:grid-cols-4">
              {STATS.map((s, k) => (
                <motion.div key={s.label} {...reveal} transition={{ ...reveal.transition, delay: k * 0.08 }} className="group">
                  <CountUp to={s.n} duration={1.4} className="font-display text-5xl italic text-odoo-300 transition-colors group-hover:text-oteal-300 md:text-6xl" />
                  <p className="mt-1 text-sm text-muted">{s.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================================ CHAPTERS, grouped under the add-on's own menus */}
        <div className="relative">
          <OdooMenuBar />

          {/* ---------------------------------------------------- Overview: challenge + architecture */}
          <section id="overview" className="scroll-mt-40 px-6 pb-28 pt-20 md:px-10">
            <div className="mx-auto max-w-6xl">
              <Chapter menu="Overview" title="Connecting Odoo POS to NetSuite (GCC Region)">
                <p>
                  NetSuite is one of the most widely used cloud ERPs, but its own point of sale is only offered in the US, Canada, Australia, England
                  and New Zealand. It isn&apos;t available in the GCC. Retailers in the region who run their business on NetSuite have two options:
                  build a POS themselves, or pair NetSuite with a third-party one. Odoo POS is a popular choice because it&apos;s fast to set up and easy
                  for cashiers to learn.
                </p>
                <p>
                  That leaves two systems that don&apos;t talk to each other. Sales are rung up in Odoo, while the books, stock and reporting live in
                  NetSuite. Someone has to move every sale, return and payment across by hand, and reconcile the gaps when they don&apos;t match.
                </p>
                <p>
                  My job was to connect them. I built an Odoo add-on that sends every POS transaction to NetSuite automatically and correctly. It runs
                  inside Odoo and talks to NetSuite directly, so there&apos;s no middleware platform to license or maintain.
                </p>
              </Chapter>
              <PosWalkthrough />

              <div className="mt-28">
                <Chapter menu="Architecture" title="Connecting Odoo-POS to NetSuite" />
                <Architecture />
              </div>
            </div>
          </section>

          {/* ---------------------------------------------------- Configuration */}
          <section id="configuration" className="scroll-mt-40 px-6 pb-28 md:px-10">
            <div className="mx-auto max-w-6xl">
              <Chapter menu="Configuration" title="Managed via NetSuite">
                <p>
                  NetSuite is where the finance, management and ops teams work and use it for their daily operations and analysis, so that&apos;s where the integration is configured. NetSuite sends the credentials, sync
                  mode, merge rules, retry policy and concurrency limit to Odoo, where they&apos;re stored read-only. There&apos;s one source of
                  settings, so the two systems can&apos;t drift apart.
                </p>
              </Chapter>
              <ConfigPush />
            </div>
          </section>

          {/* ---------------------------------------------------- Master Data Mappings */}
          <section id="mappings" className="scroll-mt-40 px-6 pb-28 md:px-10">
            <div className="mx-auto max-w-6xl">
              <Chapter menu="Master Data Mappings" title="Mapping warehouses, payment methods and taxes">
                <p>
                  Most POS customers are anonymous, so a customer record can&apos;t tell NetSuite which branch a sale belongs to. The counter can. The
                  add-on traces each order back to its shop&apos;s warehouse and maps that to a NetSuite subsidiary, department and location. Payment
                  methods and taxes are mapped the same way.
                </p>
              </Chapter>
              <MappingResolver />
            </div>
          </section>

          {/* ---------------------------------------------------- Sync to NetSuite: invoices & payments */}
          <section id="sync" className="scroll-mt-40 px-6 pb-28 md:px-10">
            <div className="mx-auto max-w-6xl">
              <Chapter menu="Invoices & Payments" title="Invoice and payment sync">
                <p>
                  Every invoice raised at the counter and every payment taken against it is sent to NetSuite. Invoices can go one at a time as they
                  happen, or merged per shop at the end of the day. Payments are applied to the right invoice, net of any change handed back.
                </p>
              </Chapter>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
                <Tile
                  title="Daily merge per shop"
                  caption="In scheduled mode, each shop's invoices for the day become one NetSuite invoice, with lines merged by item and tax. Its payments become one customer payment per payment method, settling all of that day's invoices at once. Different shops and days are never combined."
                  className="md:col-span-2"
                >
                  <ConsolidationVisual />
                </Tile>
                <Tile
                  title="Change handled correctly"
                  caption="Odoo records change given back as a separate negative line. The add-on combines them per order and payment method, so NetSuite receives what the customer actually paid."
                >
                  <ChangeNettingVisual />
                </Tile>
                <Tile
                  title="Payments wait for their invoice"
                  caption="If an invoice hasn't reached NetSuite yet, its payment checks again every 30 seconds for up to 30 minutes, without using up its retries."
                >
                  <PaymentWaitVisual />
                </Tile>
              </div>
            </div>
          </section>

          {/* ---------------------------------------------------- Returns & exchanges */}
          <section className="px-6 pb-4 md:px-10">
            <div className="mx-auto max-w-6xl">
              <Chapter menu="Returns & Exchanges" title="Handling returns and exchanges">
                <p>
                  A return becomes a NetSuite credit memo. An exchange is harder: one order that returns one item and sells another. Scroll through a
                  real exchange from testing to see how the add-on turns it into three linked NetSuite documents.
                </p>
              </Chapter>
            </div>
          </section>

          <ExchangeSplit />

          {/* ---------------------------------------------------- Gift cards */}
          <section className="px-6 py-28 md:px-10">
            <div className="mx-auto max-w-6xl">
              <Chapter menu="Gift Cards" title="Gift card and eWallet support">
                <p>
                  Customers can buy a gift card or top up an eWallet at the counter, then spend either one as payment later. The add-on carries all of
                  it to NetSuite. Purchases and top-ups become NetSuite gift certificates, with the sender and recipient details attached, and every
                  redemption is drawn from the right certificate when its invoice is posted. eWallets follow the same path, because NetSuite has no
                  wallet record of its own.
                </p>
                <p>
                  Two NetSuite limits made this harder. Odoo gift card codes are 14 characters, but NetSuite allows 9, and a NetSuite certificate
                  can&apos;t be topped up. So each purchase or top-up becomes its own certificate, with a code generated from the card number.
                </p>
              </Chapter>
              <GiftCards />
            </div>
          </section>

          {/* ---------------------------------------------------- Sync order, retries, duplicates */}
          <section className="px-6 pb-28 md:px-10">
            <div className="mx-auto max-w-6xl">
              <Chapter menu="Sync Order" title="Sync order, retries and duplicate protection">
                <p>
                  NetSuite rejects a payment whose invoice doesn&apos;t exist yet, and a refund whose credit memo is missing. It also won&apos;t stop
                  the same document from being sent twice. I built the sync so that ordering and duplicates are handled by the add-on, not left to
                  timing.
                </p>
              </Chapter>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
                <Tile
                  title="A fixed sync order"
                  caption="Invoices, then payments, then credit notes, then refunds. Credit notes come after payments so a credit can't absorb the balance a payment was meant to settle. If the invoice step fails, nothing after it runs."
                  className="md:col-span-2"
                >
                  <FourStepsVisual />
                </Tile>
                <Tile
                  title="No duplicate processing"
                  caption="Each record is locked while it's being sent. A second job that tries to send it at the same moment steps back, checks again, and finds it's already done."
                >
                  <RowLockVisual />
                </Tile>
                <Tile
                  title="Failures are never lost"
                  caption="If a sync fails, the job's changes roll back but the failed status and its reason are still saved, so support always knows what went wrong."
                >
                  <StickyFailureVisual />
                </Tile>
              </div>
            </div>
          </section>

          {/* ---------------------------------------------------- Sync Logs */}
          <section id="logs" className="scroll-mt-40 px-6 pb-28 md:px-10">
            <div className="mx-auto max-w-6xl">
              <Chapter menu="Sync Logs" title="Monitoring, sync status and audit logs">
                <p>
                  Replacing manual reconciliation only works if people can trust what the integration did. Every record carries a sync status with a
                  clear rule behind it, and every order shows exactly what it created in NetSuite. Hover over a status to see when it applies, then
                  look at the screens the client&apos;s team uses day to day.
                </p>
              </Chapter>
              <SyncLogs />
            </div>
          </section>
        </div>

        {/* ============================================================ ROLES */}
        <section className="px-6 pb-28 md:px-10">
          <div className="mx-auto max-w-6xl">
            <motion.div {...reveal} className="mb-10 max-w-5xl">
              <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.28em] text-odoo-300">What I owned</p>
              <h2 className="font-display text-4xl italic md:text-5xl">My role: end-to-end ownership</h2>
              <p className="mt-5 leading-relaxed text-muted md:text-lg">
                InnovateNex brought me in as a freelancer to connect Odoo POS to NetSuite for their client, Foresee Solutions. I owned the whole of it:
                the architecture, the NetSuite integration, the business rules, the back-office experience, and delivery.
              </p>
            </motion.div>
            <motion.div {...reveal}>
              <Roles />
            </motion.div>
          </div>
        </section>

        {/* ============================================================ CHATTER */}
        <section className="px-6 pb-32 md:px-10">
          <div className="mx-auto grid max-w-6xl gap-14 lg:grid-cols-[1.5fr_1fr]">
            <div>
              <motion.div {...reveal} className="mb-8">
                <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.28em] text-odoo-300">Log notes</p>
                <h2 className="font-display text-4xl italic md:text-5xl">Key decisions and known limitations</h2>
              </motion.div>
              <Chatter />
            </div>

            <motion.div {...reveal} className="lg:sticky lg:top-44 lg:self-start">
              <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.28em] text-odoo-300">Stack</p>
              <div className="flex flex-wrap gap-2">
                {STACK.map((s) => (
                  <span
                    key={s}
                    className="cursor-default rounded-md border border-white/10 px-3 py-1 font-mono text-[11px] text-white/60 transition-all duration-300 hover:-translate-y-0.5 hover:border-odoo-400/50 hover:text-odoo-100"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>

          <motion.div {...reveal} className="mx-auto mt-24 max-w-6xl">
            <Link
              href="/case-studies"
              className="group flex items-center justify-between rounded-2xl border border-white/10 p-8 transition-all duration-300 hover:border-odoo-400/50 hover:bg-odoo-600/[0.08] md:p-10"
            >
              <span>
                <span className="block font-mono text-[11px] uppercase tracking-[0.3em] text-white/40">Keep reading</span>
                <span className="mt-2 block font-display text-3xl italic md:text-4xl">All case studies</span>
              </span>
              <ArrowUpRight className="h-8 w-8 text-white/50 transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-oteal-300" />
            </Link>
          </motion.div>
        </section>
      </main>
    </MotionConfig>
  );
}
