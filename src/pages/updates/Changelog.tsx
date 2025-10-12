import React from "react";
import Header from "@/layout/Header";
import Footer from "@/layout/Footer";
import { Tag, Calendar as Cal, Search, Filter, ChevronLeft, ChevronRight, Rss } from "lucide-react";

/* Tokens */
const ringIndigo =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#6366F1]/40";
const card =
  "rounded-2xl border border-[#E7E9FF] dark:border-[#2B2F55] bg-white/80 dark:bg-white/[0.05] backdrop-blur";
const chip =
  "inline-flex items-center gap-2 rounded-full border border-[#E7E9FF] dark:border-[#2B2F55] bg-white/70 dark:bg-white/[0.06] px-3 py-1 text-[11px] font-semibold";

type EntryType = "new" | "improved" | "fixed" | "deprecated";
type Change = { type: EntryType; text: string };
type Release = {
  id: string;
  version: string;
  date: string; // ISO
  changes: Change[];
  tags: string[];
};

const LOG: Release[] = [
  {
    id: "v1.3.0",
    version: "1.3.0",
    date: "2025-02-10",
    tags: ["offers", "groups"],
    changes: [
      { type: "new", text: "Group sessions with capacity, waitlist and reminders." },
      { type: "improved", text: "Cleaner bookings UI with fewer steps." },
      { type: "fixed", text: "Timezone mismatch when rescheduling cross-TZ." },
    ],
  },
  {
    id: "v1.2.0",
    version: "1.2.0",
    date: "2025-01-22",
    tags: ["finance", "payouts"],
    changes: [
      { type: "new", text: "Payout schedules: weekly/bi-weekly/monthly." },
      { type: "improved", text: "Invoices now support VAT/GST fields." },
      { type: "fixed", text: "Stripe webhooks retry logic." },
    ],
  },
  {
    id: "v1.1.0",
    version: "1.1.0",
    date: "2024-12-14",
    tags: ["reviews", "ux"],
    changes: [
      { type: "new", text: "Public reviews with reply from mentors." },
      { type: "improved", text: "Faster dashboard load by 28%." },
    ],
  },
  {
    id: "v1.0.0",
    version: "1.0.0",
    date: "2024-11-01",
    tags: ["launch"],
    changes: [
      { type: "new", text: "Initial release with profiles, sessions, payments, messages." },
      { type: "deprecated", text: "Legacy beta endpoints removed." },
    ],
  },
];

const TYPES: EntryType[] = ["new", "improved", "fixed", "deprecated"];

export default function Changelog() {
  const [query, setQuery] = React.useState("");
  const [typeFilters, setTypeFilters] = React.useState<EntryType[] | "all">("all");
  const [page, setPage] = React.useState(1);
  const perPage = 3;

  const toggleType = (t: EntryType) =>
    setTypeFilters((prev) =>
      prev === "all"
        ? [t]
        : prev.includes(t)
        ? (prev.filter((x) => x !== t) as EntryType[])
        : ([...prev, t] as EntryType[])
    );

  const visible = LOG
    .filter(r => {
      const q = query.trim().toLowerCase();
      const matchesQ =
        q === "" ||
        r.version.toLowerCase().includes(q) ||
        r.tags.join(" ").toLowerCase().includes(q) ||
        r.changes.some(c => c.text.toLowerCase().includes(q));
      const matchesType =
        typeFilters === "all" || r.changes.some(c => typeFilters.includes(c.type));
      return matchesQ && matchesType;
    })
    .sort((a, b) => +new Date(b.date) - +new Date(a.date));

  const totalPages = Math.max(1, Math.ceil(visible.length / perPage));
  const slice = visible.slice((page - 1) * perPage, (page - 1) * perPage + perPage);

  React.useEffect(() => { setPage(1); }, [query, typeFilters]);

  return (
    <div className="min-h-screen bg-[radial-gradient(1100px_600px_at_10%_-10%,rgba(79,70,229,0.16),transparent),radial-gradient(900px_500px_at_90%_-10%,rgba(99,102,241,0.12),transparent)]">
      <Header />

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className={chip}><Cal size={14}/> Changelog</span>
            <h1 className="mt-2 text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight text-[#0F132E] dark:text-[#E9ECFF]">
              Shipping in the open
            </h1>
          </div>
          <a href="#" className="inline-flex items-center gap-2 text-sm font-semibold">
            <Rss size={16}/> RSS
          </a>
        </div>

        {/* Controls */}
        <div className="mt-6 grid sm:grid-cols-3 gap-3">
          <div className={`${card} h-11 flex items-center gap-2 px-3.5`}>
            <Search size={16} className="text-[#5F679A] dark:text-[#A7B0FF]" />
            <input
              className="flex-1 bg-transparent outline-none text-sm"
              placeholder="Search versions, tags, changes…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div className="sm:col-span-2 flex flex-wrap items-center gap-2">
            {TYPES.map(t => {
              const on = typeFilters !== "all" && typeFilters.includes(t);
              const color =
                t === "new" ? "bg-emerald-100/70 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300" :
                t === "improved" ? "bg-indigo-100/70 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300" :
                t === "fixed" ? "bg-amber-100/70 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300" :
                "bg-rose-100/70 dark:bg-rose-900/20 text-rose-700 dark:text-rose-300";
              return (
                <button
                  key={t}
                  onClick={() => toggleType(t)}
                  className={`rounded-xl border px-3 py-1.5 text-xs font-semibold ${on ? "text-white bg-[#4F46E5]" : "bg-white/70 dark:bg-white/[0.06]"} border-[#E7E9FF] dark:border-[#2B2F55]`}
                  title={`Filter: ${t}`}
                >
                  <span className={`inline-flex items-center gap-2 px-2 py-0.5 rounded ${color}`}>
                    <Tag size={12}/>{t}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Releases */}
        <div className="mt-6 grid gap-4">
          {slice.map(r => (
            <div key={r.id} className={`${card} p-5`}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="text-sm font-semibold text-[#0F1536] dark:text-[#E7E9FF]">
                  v{r.version} <span className="text-xs text-[#6B72B3] dark:text-[#A7B0FF]/80">· {new Date(r.date).toLocaleDateString()}</span>
                </div>
                <div className="flex flex-wrap items-center gap-1">
                  {r.tags.map(t => (
                    <span key={t} className="text-[11px] rounded-lg border border-[#E7E9FF] dark:border-[#2B2F55] px-2 py-1 bg-white/70 dark:bg-white/[0.06]">{t}</span>
                  ))}
                </div>
              </div>

              <div className="mt-3 grid gap-2">
                {r.changes.map((c, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-sm">
                    <span
                      className={`mt-1 h-2 w-2 rounded-full
                      ${c.type === "new" ? "bg-emerald-500" :
                        c.type === "improved" ? "bg-indigo-500" :
                        c.type === "fixed" ? "bg-amber-500" : "bg-rose-500"}`}
                    />
                    <span className="font-semibold capitalize mr-1">{c.type}:</span>
                    <span className="text-[#2C3157] dark:text-[#C9D1FF]/85">{c.text}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
          {slice.length === 0 && (
            <div className={`${card} p-4 text-sm text-[#6B72B3] dark:text-[#A7B0FF]/80`}>No releases match your filters.</div>
          )}
        </div>

        {/* Pagination */}
        <div className="mt-6 flex items-center justify-between">
          <div className="text-xs text-[#6B72B3] dark:text-[#A7B0FF]/80">Page {page} of {totalPages}</div>
          <div className="flex items-center gap-2">
            <button
              className="h-9 w-9 grid place-items-center rounded-xl border border-[#E7E9FF] dark:border-[#2B2F55] disabled:opacity-50"
              disabled={page <= 1}
              onClick={() => setPage(p => Math.max(1, p - 1))}
            >
              <ChevronLeft size={16}/>
            </button>
            <button
              className="h-9 w-9 grid place-items-center rounded-xl border border-[#E7E9FF] dark:border-[#2B2F55] disabled:opacity-50"
              disabled={page >= totalPages}
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            >
              <ChevronRight size={16}/>
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
