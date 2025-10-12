import React from "react";
import { Check, X as XIcon, Star, Sparkles, ShieldCheck, ArrowRight, Info, BadgeDollarSign } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/layout/Header";
import Footer from "@/layout/Footer";

/* ---------------------------
   Local UI tokens (indigo glass)
---------------------------- */
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

type PlanKey = "starter" | "pro" | "studio";
type Plan = {
  key: PlanKey;
  name: string;
  monthly: number;
  highlight?: boolean;
  bullet: string;
  features: Array<{ label: string; included: boolean; tip?: string }>;
  cta: string;
};

const BASE_PLANS: Plan[] = [
  {
    key: "starter",
    name: "Starter",
    monthly: 0,
    bullet: "Kick off bookings, no credit card.",
    features: [
      { label: "Profile + availability", included: true },
      { label: "1:1 sessions & basic chat", included: true },
      { label: "Payments (standard fee)", included: true },
      { label: "Reviews & public page", included: true },
      { label: "Coupons & simple offers", included: false, tip: "Pro+ only" },
      { label: "Group sessions", included: false },
      { label: "Advanced analytics", included: false },
      { label: "Priority support", included: false },
    ],
    cta: "Start free",
  },
  {
    key: "pro",
    name: "Pro",
    monthly: 19,
    highlight: true,
    bullet: "Best for active mentors and boutique teams.",
    features: [
      { label: "Everything in Starter", included: true },
      { label: "Coupons & packages", included: true },
      { label: "Group sessions & waitlists", included: true },
      { label: "Advanced analytics", included: true },
      { label: "Lower processing fee", included: true, tip: "Save on every booking" },
      { label: "Webhooks + API keys", included: true },
      { label: "Priority support", included: false },
    ],
    cta: "Go Pro",
  },
  {
    key: "studio",
    name: "Studio",
    monthly: 49,
    bullet: "Scale up with multi-mentor operations.",
    features: [
      { label: "Everything in Pro", included: true },
      { label: "Multi-mentor orgs & roles", included: true },
      { label: "Custom payout schedules", included: true },
      { label: "SLA + priority support", included: true },
      { label: "Advanced KYC & tax tools", included: true },
      { label: "White-label options", included: true },
    ],
    cta: "Choose Studio",
  },
];

export default function Pricing() {
  const [yearly, setYearly] = React.useState(true); // 2 months free
  const price = (p: number) => (yearly ? Math.round(p * 10) : p); // pay 10x monthly price
  const badge = yearly ? "2 months free" : "Monthly";

  return (
    <div className="min-h-screen bg-[radial-gradient(1200px_600px_at_10%_-10%,rgba(79,70,229,0.18),transparent),radial-gradient(900px_500px_at_90%_-20%,rgba(99,102,241,0.14),transparent)]">
      <Header />

      {/* Hero */}
      <section className="relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-10">
          <div className="text-center">
            <span className={chip}>
              <BadgeDollarSign size={14} /> Simple, transparent pricing
            </span>
            <h1 className="mt-4 text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight text-[#0F132E] dark:text-[#E9ECFF]">
              Pricing that scales with your momentum
            </h1>
            <p className="mt-3 max-w-2xl mx-auto text-sm sm:text-base text-[#5E66A6] dark:text-[#A7B0FF]/85">
              Start free, then unlock pro features when you need them. Cancel anytime.
            </p>

            {/* Billing toggle */}
            <div className="mt-6 inline-flex items-center gap-2 rounded-2xl border border-[#E7E9FF] dark:border-[#2B2F55] p-1 bg-white/70 dark:bg-white/[0.06]">
              <button
                onClick={() => setYearly(false)}
                className={`${btn} ${!yearly ? btnSolid : ""} rounded-xl`}
                aria-pressed={!yearly}
              >
                Monthly
              </button>
              <button
                onClick={() => setYearly(true)}
                className={`${btn} ${yearly ? btnSolid : ""} rounded-xl`}
                aria-pressed={yearly}
              >
                Yearly <span className="hidden sm:inline">({badge})</span>
              </button>
            </div>
          </div>

          {/* Plans */}
          <div className="mt-10 grid md:grid-cols-3 gap-6">
            {BASE_PLANS.map((p) => {
              const isHL = p.highlight;
              return (
                <div
                  key={p.key}
                  className={`${card} p-6 relative ${isHL ? "ring-2 ring-[#6366F1]/50" : ""}`}
                >
                  {isHL && (
                    <span className="absolute -top-3 right-4 inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-semibold bg-[#EEF2FF] dark:bg-white/[0.08] border border-[#E7E9FF] dark:border-[#2B2F55] text-[#1B1F3A] dark:text-[#E6E9FF]">
                      <Star size={12} className="text-indigo-500" /> Most popular
                    </span>
                  )}

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-semibold text-[#0F1536] dark:text-[#E7E9FF]">
                        {p.name}
                      </div>
                      <div className="text-xs text-[#5E66A6] dark:text-[#A7B0FF]/85">{p.bullet}</div>
                    </div>
                    <Sparkles className="text-indigo-500" />
                  </div>

                  <div className="mt-5 flex items-end gap-2">
                    <div className="text-4xl font-extrabold text-[#0F1536] dark:text-[#E7E9FF]">
                      {p.monthly === 0 ? "Free" : `$${price(p.monthly)}`}
                    </div>
                    {p.monthly !== 0 && (
                      <div className="text-xs text-[#6B72B3] dark:text-[#A7B0FF]/80">
                        {yearly ? "per year" : "per month"}
                      </div>
                    )}
                  </div>

                  <div className="mt-5 grid gap-2">
                    {p.features.map((f) => (
                      <div
                        key={f.label}
                        className="flex items-center justify-between rounded-xl border border-[#E7E9FF] dark:border-[#2B2F55] px-3 py-2 bg-white/70 dark:bg-white/[0.05]"
                      >
                        <div className="flex items-center gap-2 text-sm">
                          {f.included ? (
                            <Check size={16} className="text-emerald-500" />
                          ) : (
                            <XIcon size={16} className="text-rose-500/70" />
                          )}
                          <span className="text-[#101436] dark:text-[#EEF0FF]">{f.label}</span>
                        </div>
                        {f.tip && (
                          <span className="text-[11px] text-[#6B72B3] dark:text-[#A7B0FF]/80">{f.tip}</span>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="mt-6">
                    <Link to="/checkout" className={`${btn} ${btnSolid} w-full justify-center`}>
                      {p.cta} <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Comparison */}
          <div className="mt-12">
            <div className={`${card} overflow-hidden`}>
              <div className="px-4 py-3 text-sm font-semibold border-b border-[#E7E9FF] dark:border-[#2B2F55]">
                Compare plans
              </div>
              <div className="w-full overflow-auto">
                <table className="min-w-[760px] w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#E7E9FF] dark:border-[#2B2F55]">
                      <th className="px-4 py-3 text-left">Feature</th>
                      {BASE_PLANS.map((p) => (
                        <th key={p.key} className="px-4 py-3 text-left">{p.name}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      "Profile & availability",
                      "Payments & payouts",
                      "Coupons / Packages",
                      "Group sessions",
                      "Advanced analytics",
                      "Priority support",
                    ].map((row) => (
                      <tr key={row} className="border-b border-[#E7E9FF] dark:border-[#2B2F55]">
                        <td className="px-4 py-3">{row}</td>
                        {BASE_PLANS.map((p) => {
                          const inc =
                            p.key === "studio" ||
                            (p.key === "pro" && !["Priority support"].includes(row)) ||
                            (p.key === "starter" && ["Profile & availability", "Payments & payouts"].includes(row));
                          return (
                            <td key={p.key + row} className="px-4 py-3">
                              {inc ? <Check size={16} className="text-emerald-500" /> : <XIcon size={16} className="text-rose-500/70" />}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="px-4 py-3 text-[12px] text-[#6B72B3] dark:text-[#A7B0FF]/80 flex items-center gap-2">
                <Info size={14} /> Prices exclude payment processor fees and applicable taxes.
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
