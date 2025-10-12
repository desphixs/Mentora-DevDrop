import React from "react";
import Header from "@/layout/Header";
import Footer from "@/layout/Footer";
import { Search, ChevronDown, ChevronUp, HelpCircle, Filter } from "lucide-react";

/* Tokens */
const ringIndigo =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#6366F1]/40";
const card =
  "rounded-2xl border border-[#E7E9FF] dark:border-[#2B2F55] bg-white/80 dark:bg-white/[0.05] backdrop-blur";
const chip =
  "inline-flex items-center gap-2 rounded-full border border-[#E7E9FF] dark:border-[#2B2F55] bg-white/70 dark:bg-white/[0.06] px-3 py-1 text-[11px] font-semibold";

type FAQ = { id: string; q: string; a: string; cat: "General" | "Billing" | "Sessions" | "Security" };

const DATA: FAQ[] = [
  { id: "1", cat: "General", q: "What is Mentora?", a: "Mentora is a mentorship marketplace toolkit: discovery, booking, payments, sessions, and follow-up." },
  { id: "2", cat: "General", q: "Can I use my own domain?", a: "Yes. Add your custom domain via DNS (CNAME) and configure inside Integrations." },
  { id: "3", cat: "Billing", q: "How do you bill?", a: "Flat subscription per mentor/org plus payment processor fees. See Pricing for plan details." },
  { id: "4", cat: "Billing", q: "Do you offer refunds?", a: "We honor refunds under our Refund Policy for duplicate charges and billing errors." },
  { id: "5", cat: "Sessions", q: "Do you support group sessions?", a: "Yes—create a group offer, set capacity, and enable waitlist. Built-in reminders included." },
  { id: "6", cat: "Sessions", q: "Do mentees need an account?", a: "Accounts are optional; we support guest checkout with email verification." },
  { id: "7", cat: "Security", q: "How is my data secured?", a: "Encryption in transit, least-privilege access, and third-party audits via payment providers." },
  { id: "8", cat: "Security", q: "Do you have webhooks?", a: "Yes, Pro+ plans offer webhooks and API keys for bookings, payouts, and reviews events." },
];

const CATS = ["All", "General", "Billing", "Sessions", "Security"] as const;
type Cat = typeof CATS[number];

export default function FAQPage() {
  const [query, setQuery] = React.useState("");
  const [cat, setCat] = React.useState<Cat>("All");
  const [open, setOpen] = React.useState<string | null>(null);

  const list = DATA.filter(f =>
    (cat === "All" || f.cat === cat) &&
    (query.trim() === "" ||
      (f.q + " " + f.a).toLowerCase().includes(query.trim().toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-[radial-gradient(1100px_600px_at_10%_-10%,rgba(79,70,229,0.16),transparent),radial-gradient(900px_500px_at_90%_-10%,rgba(99,102,241,0.12),transparent)]">
      <Header />

      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 pb-14">
        <div className="text-center">
          <span className={chip}><HelpCircle size={14}/> Frequently asked questions</span>
          <h1 className="mt-3 text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight text-[#0F132E] dark:text-[#E9ECFF]">
            Answers at a glance
          </h1>
        </div>

        {/* Controls */}
        <div className="mt-8 grid sm:grid-cols-3 gap-3">
          <div className={`${card} h-11 flex items-center gap-2 px-3.5`}>
            <Search size={16} className="text-[#5F679A] dark:text-[#A7B0FF]" />
            <input
              className="flex-1 bg-transparent outline-none text-sm"
              placeholder="Search questions…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div className="sm:col-span-2 flex flex-wrap items-center gap-2">
            {CATS.map(c => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={`flex items-center gap-1 cursor-pointer rounded-xl border px-3 py-1.5 text-xs font-semibold transition ${
                  c === cat ? "text-white bg-[#4F46E5]" : "bg-white/70 dark:bg-white/[0.06] text-[#1B1F3A] dark:text-[#E6E9FF]"
                } border-[#E7E9FF] dark:border-[#2B2F55]`}
              >
                <Filter size={12} /> {c}
              </button>
            ))}
          </div>
        </div>

        {/* FAQ list */}
        <div className="mt-6 grid gap-3">
          {list.map(f => {
            const isOpen = open === f.id;
            return (
              <div key={f.id} className={`${card} p-4`}>
                <button
                  className="w-full text-left flex items-center justify-between gap-3"
                  onClick={() => setOpen(isOpen ? null : f.id)}
                  aria-expanded={isOpen}
                >
                  <div className="text-sm font-semibold text-[#0F1536] dark:text-[#E7E9FF]">{f.q}</div>
                  {isOpen ? <ChevronUp size={18}/> : <ChevronDown size={18}/>}
                </button>
                {isOpen && (
                  <p className="mt-3 text-sm text-[#2C3157] dark:text-[#C9D1FF]/85">{f.a}</p>
                )}
              </div>
            );
          })}
          {list.length === 0 && (
            <div className={`${card} p-4 text-sm text-[#6B72B3] dark:text-[#A7B0FF]/80`}>No results.</div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
