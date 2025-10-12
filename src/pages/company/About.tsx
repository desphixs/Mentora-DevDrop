import React from "react";
import { Users, Target, Rocket, ShieldCheck, TrendingUp, Sparkles, ArrowRight, Check } from "lucide-react";
import Header from "@/layout/Header";
import Footer from "@/layout/Footer";

/* Tokens */
const card =
  "rounded-2xl border border-[#E7E9FF] dark:border-[#2B2F55] bg-white/80 dark:bg-white/[0.05] backdrop-blur";
const chip =
  "inline-flex items-center gap-2 rounded-full border border-[#E7E9FF] dark:border-[#2B2F55] bg-white/70 dark:bg-white/[0.06] px-3 py-1 text-[11px] font-semibold";
const btn =
  "inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#6366F1]/40";
const btnSolid =
  "text-white bg-gradient-to-r from-[#4F46E5] via-[#6366F1] to-[#8B5CF6] shadow-[0_10px_30px_rgba(79,70,229,0.35)] hover:shadow-[0_16px_40px_rgba(79,70,229,0.45)]";

const TEAM = [
  { name: "Ada Lovelace", role: "Engineering Lead" },
  { name: "Chidi Okafor", role: "Design Lead" },
  { name: "Mason Lee", role: "Growth" },
  { name: "Riya Shah", role: "Backend" },
  { name: "Tunde Adebayo", role: "Frontend" },
  { name: "Aisha Bello", role: "Ops" },
];

export default function About() {
  return (
    <div className="min-h-screen bg-[radial-gradient(1100px_600px_at_10%_-10%,rgba(79,70,229,0.16),transparent),radial-gradient(900px_500px_at_90%_-10%,rgba(99,102,241,0.12),transparent)]">
      <Header />

      {/* Hero */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className={`${card} p-6 sm:p-10 relative overflow-hidden`}>
          <div className="absolute -inset-16 pointer-events-none blur-3xl opacity-30 bg-[radial-gradient(400px_160px_at_20%_20%,rgba(79,70,229,0.5),transparent),radial-gradient(500px_200px_at_80%_0%,rgba(99,102,241,0.45),transparent)]" />
          <div className="relative">
            <span className={chip}>
              <Rocket size={14} /> Our mission
            </span>
            <h1 className="mt-3 text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight text-[#0F132E] dark:text-[#E9ECFF]">
              Help experts share knowledge—at global scale
            </h1>
            <p className="mt-3 max-w-3xl text-sm sm:text-base text-[#2C3157] dark:text-[#C9D1FF]/85">
              Mentora turns mentorship into a repeatable, high-quality experience with booking flows, payments,
              AI-assisted scheduling, and post-session follow-through.
            </p>
            <div className="mt-6">
              <a href="/demo" className={`${btn} ${btnSolid}`}>
                See the demo <ArrowRight size={16} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: Users, label: "Mentors onboarded", value: "2,400+" },
            { icon: TrendingUp, label: "Avg. conversion", value: "34%" },
            { icon: ShieldCheck, label: "Payout success", value: "99.98%" },
            { icon: Sparkles, label: "AI-assisted bookings", value: "65%" },
          ].map((s) => (
            <div key={s.label} className={`${card} p-5`}>
              <div className="flex items-center gap-2 text-sm font-semibold">
                <s.icon className="text-indigo-500" size={16} /> {s.label}
              </div>
              <div className="mt-2 text-2xl font-extrabold text-[#0F1536] dark:text-[#E7E9FF]">{s.value}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-10">
        <div className="grid md:grid-cols-3 gap-4">
          {[
            {
              title: "Craft over clutter",
              desc: "We sweat details so mentors can focus on people—not dashboards.",
              icon: Target,
            },
            {
              title: "Trust by default",
              desc: "Clear fees, predictable payouts, and robust verification.",
              icon: ShieldCheck,
            },
            {
              title: "Momentum mindset",
              desc: "Shipping velocity beats slide decks. We iterate in production.",
              icon: Rocket,
            },
          ].map((v) => (
            <div key={v.title} className={`${card} p-5`}>
              <div className="flex items-center gap-2 text-sm font-semibold">
                <v.icon className="text-indigo-500" size={16} /> {v.title}
              </div>
              <p className="mt-2 text-sm text-[#2C3157] dark:text-[#C9D1FF]/85">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Timeline */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-10">
        <div className={`${card} p-6`}>
          <div className="text-sm font-semibold text-[#0F1536] dark:text-[#E7E9FF]">Journey</div>
          <div className="mt-4 grid gap-4">
            {[
              ["2023 Q4", "Prototype marketplace with payments & sessions."],
              ["2024 Q2", "Mentor profiles, reviews, and group sessions launched."],
              ["2024 Q4", "Finance suite: invoices, payouts, taxes."],
              ["2025 Q1", "Integrations hub + webhooks."],
            ].map(([t, d]) => (
              <div key={t} className="flex flex-wrap items-center gap-3">
                <div className="w-32 text-xs font-semibold text-[#6065A6] dark:text-[#A7B0FF]/80">{t}</div>
                <div className="flex-1 rounded-xl border border-[#E7E9FF] dark:border-[#2B2F55] px-3 py-2 text-sm bg-white/70 dark:bg-white/[0.06]">
                  <div className="inline-flex items-center gap-2">
                    <Check size={14} className="text-emerald-500" /> {d}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className={`${card} p-6`}>
          <div className="text-sm font-semibold text-[#0F1536] dark:text-[#E7E9FF]">Team</div>
          <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {TEAM.map((m) => (
              <div key={m.name} className="flex items-center gap-3 rounded-xl border border-[#E7E9FF] dark:border-[#2B2F55] p-3 bg-white/70 dark:bg-white/[0.06]">
                <Avatar name={m.name} />
                <div>
                  <div className="text-sm font-semibold text-[#0F1536] dark:text-[#E7E9FF]">{m.name}</div>
                  <div className="text-xs text-[#6B72B3] dark:text-[#A7B0FF]/80">{m.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function Avatar({ name }: { name: string }) {
  const initials = name.split(" ").map((s) => s[0]).join("").slice(0, 2).toUpperCase();
  return (
    <div className="h-10 w-10 rounded-xl grid place-items-center bg-[#EEF2FF] dark:bg-white/[0.08] border border-[#E7E9FF] dark:border-[#2B2F55] text-[12px] text-[#1B1F3A] dark:text-[#E6E9FF]">
      {initials}
    </div>
  );
}
