import React from "react";
import Header from "@/layout/Header";
import Footer from "@/layout/Footer";
import {
  UserPlus, CalendarCheck2, Package, ShoppingCart, Wallet, MessageSquare,
  ArrowRight, Sparkles, ShieldCheck, Check
} from "lucide-react";
import { Link } from "react-router-dom";

/* Tokens */
const ringIndigo =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#6366F1]/40";
const card =
  "rounded-2xl border border-[#E7E9FF] dark:border-[#2B2F55] bg-white/80 dark:bg-white/[0.05] backdrop-blur";
const chip =
  "inline-flex items-center gap-2 rounded-full border border-[#E7E9FF] dark:border-[#2B2F55] bg-white/70 dark:bg-white/[0.06] px-3 py-1 text-[11px] font-semibold";
const btn =
  "inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition " + ringIndigo;
const btnSolid =
  "text-white bg-gradient-to-r from-[#4F46E5] via-[#6366F1] to-[#8B5CF6] shadow-[0_10px_30px_rgba(79,70,229,0.35)] hover:shadow-[0_16px_40px_rgba(79,70,229,0.45)]";
const btnGhost =
  "border border-[#D9DBFF] dark:border-[#30345D] text-[#1B1F3A] dark:text-[#E6E9FF] bg-white/70 dark:bg-white/[0.05] hover:bg-white/90 dark:hover:bg-white/[0.08]";

type Step = {
  icon: React.ComponentType<any>;
  title: string;
  blurb: string;
  bullets: string[];
};

const STEPS: Step[] = [
  {
    icon: UserPlus,
    title: "Create your profile",
    blurb: "Add expertise, bio, and highlights that convert.",
    bullets: ["SEO-ready public page", "Ratings & social proof", "Custom URLs"],
  },
  {
    icon: CalendarCheck2,
    title: "Set availability",
    blurb: "Connect calendars and define working hours.",
    bullets: ["Timezone-aware", "Buffers & limits", "Auto reminders"],
  },
  {
    icon: Package,
    title: "Publish offers",
    blurb: "1:1s, packages, and group sessions—priced your way.",
    bullets: ["Coupons & add-ons", "Waitlists", "Instant checkout"],
  },
  {
    icon: ShoppingCart,
    title: "Take bookings",
    blurb: "Clean checkout with Stripe, Paystack, Flutterwave & more.",
    bullets: ["Secure payments", "Fraud checks", "Receipts & invoices"],
  },
  {
    icon: Wallet,
    title: "Get paid",
    blurb: "Automated payouts to your bank on your schedule.",
    bullets: ["Multi-currency", "Tax summaries", "Dispute tooling"],
  },
  {
    icon: MessageSquare,
    title: "Follow up",
    blurb: "Keep momentum with in-thread notes and files.",
    bullets: ["Post-call notes", "Attachments", "AI assist (optional)"],
  },
];

export default function HowItWorks() {
  return (
    <div className="min-h-screen bg-[radial-gradient(1100px_600px_at_10%_-10%,rgba(79,70,229,0.16),transparent),radial-gradient(900px_500px_at_90%_-10%,rgba(99,102,241,0.12),transparent)]">
      <Header />

      {/* Hero */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-10">
        <div className="text-center">
          <span className={chip}><Sparkles size={14}/> How it works</span>
          <h1 className="mt-3 text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight text-[#0F132E] dark:text-[#E9ECFF]">
            From profile to payout—fast
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-sm sm:text-base text-[#5E66A6] dark:text-[#A7B0FF]/85">
            A streamlined flow for experts to onboard, sell sessions, and get paid—without duct tape.
          </p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <Link to="/demo" className={`${btn} ${btnSolid}`}>Watch demo <ArrowRight size={16}/></Link>
            <Link to="/pricing" className={`${btn} ${btnGhost}`}>See pricing</Link>
          </div>
        </div>

        {/* Steps as connected rail */}
        <div className="mt-10 grid md:grid-cols-3 gap-6">
          {STEPS.map((s, i) => (
            <div key={s.title} className={`${card} p-6 relative`}>
              <span className="absolute -top-3 left-5 inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-semibold bg-[#EEF2FF] dark:bg-white/[0.08] border border-[#E7E9FF] dark:border-[#2B2F55]">
                Step {i + 1}
              </span>
              <div className="flex items-center gap-2 text-sm font-semibold">
                <s.icon className="text-indigo-500" size={16}/> {s.title}
              </div>
              <p className="mt-2 text-sm text-[#2C3157] dark:text-[#C9D1FF]/85">{s.blurb}</p>
              <ul className="mt-3 space-y-2 text-sm">
                {s.bullets.map(b => (
                  <li key={b} className="flex items-center gap-2">
                    <Check size={16} className="text-emerald-500"/>{b}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Trust strip */}
        <div className={`${card} mt-10 p-5`}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <ShieldCheck className="text-indigo-500" size={16}/> Secure by default
            </div>
            <div className="text-xs text-[#6B72B3] dark:text-[#A7B0FF]/80">
              PCI DSS via partners • OAuth2 where possible • PII minimization • Audit trails
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
