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
                I designed and built an Odoo add-on that integrates Odoo Point of Sale with NetSuite. Each POS order is converted into the
                correct NetSuite documents (invoices, credit memos, customer payments, refunds and gift certificates) and posted in the
                sequence NetSuite requires, with no duplicates. NetSuite remains the system of record, supplying the configuration and
                product catalogue to Odoo.
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
                <Chapter menu="Architecture" title="Add-on architecture" />
                <Architecture />
              </div>
            </div>
          </section>

          {/* ---------------------------------------------------- Configuration */}
          <section id="configuration" className="scroll-mt-40 px-6 pb-28 md:px-10">
            <div className="mx-auto max-w-6xl">
              <Chapter menu="Configuration" title="Managed via NetSuite">
                <p>
                  Finance, management and operations teams work in NetSuite daily, so I designed the integration to be configured there.
                  NetSuite supplies the credentials, sync mode, merge rules, retry policy and concurrency limit, which Odoo stores as
                  read-only settings. A single source of configuration ensures the two systems cannot drift apart.
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
                  Most POS customers are anonymous, so the customer record cannot identify which branch a sale belongs to; the point of sale
                  can. I implemented a mapping that resolves each order through its shop&apos;s warehouse to a NetSuite subsidiary,
                  department and location. Payment methods and tax codes are mapped using the same approach.
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
                  I implemented the synchronisation of every POS invoice, and every payment recorded against it, to NetSuite. It supports
                  two modes: real-time, where each document is sent as it is created, and scheduled, where transactions are consolidated per
                  shop at the end of the day. Each payment is applied to its invoice, net of any change returned to the customer.
                </p>
              </Chapter>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
                <Tile
                  title="Daily merge per shop"
                  caption="In scheduled mode, each shop's invoices for the day are consolidated into a single NetSuite invoice, with lines merged by item and tax. Payments are consolidated into one customer payment per payment method, settling all of that day's invoices. Shops and days are never combined."
                  className="md:col-span-2"
                >
                  <ConsolidationVisual />
                </Tile>
                <Tile
                  title="Change handled correctly"
                  caption="Odoo records change returned to the customer as a separate negative line. I designed the add-on to net these per order and payment method, so NetSuite receives the amount the customer actually paid."
                >
                  <ChangeNettingVisual />
                </Tile>
                <Tile
                  title="Payments wait for their invoice"
                  caption="Where an invoice has not yet reached NetSuite, its payment is re-checked every 30 seconds for up to 30 minutes, without consuming its retry allowance."
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
                  A return is posted as a NetSuite credit memo. An exchange is more complex: a single order that both returns one item and
                  sells another. The walkthrough below follows a real exchange from testing and shows how the add-on separates it into three
                  linked NetSuite documents.
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
                  I extended the integration to cover gift cards and eWallets, which customers can purchase or top up at the counter and
                  later redeem as payment. Each purchase and top-up is recorded in NetSuite as a gift certificate, including sender and
                  recipient details, and each redemption is drawn from the correct certificate when its invoice is posted. eWallets follow
                  the same process, as NetSuite has no native wallet record.
                </p>
                <p>
                  Two NetSuite constraints shaped the design. Odoo gift card codes are 14 characters, whereas NetSuite accepts 9, and a
                  NetSuite certificate cannot be topped up. I therefore issued a separate certificate for each purchase or top-up, with a
                  code derived from the card number.
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
                  caption="Documents are processed in a fixed sequence: invoices, payments, credit notes, then refunds. Credit notes follow payments so that a credit cannot absorb a balance a payment was intended to settle, and a failed invoice step halts everything after it."
                  className="md:col-span-2"
                >
                  <FourStepsVisual />
                </Tile>
                <Tile
                  title="No duplicate processing"
                  caption="Each record is locked while it is being sent. A concurrent job attempting the same record waits, re-checks, and finds it already processed."
                >
                  <RowLockVisual />
                </Tile>
                <Tile
                  title="Failures are never lost"
                  caption="When a sync fails, the job's changes are rolled back while the failure status and its reason are retained, giving support a clear record of what went wrong."
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
                  Replacing manual reconciliation depends on trust in what the integration has done. I therefore gave every record a sync
                  status governed by a clear rule, and added a view to each order listing every document it created in NetSuite. Hover over
                  a status to see when it applies, then review the screens the client&apos;s team uses daily.
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
                <h2 className="font-display text-4xl italic md:text-5xl">Key decisions, limitations and lessons</h2>
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
