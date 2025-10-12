import React from "react";
import Header from "@/layout/Header";
import Footer from "@/layout/Footer";
import { Activity, AlertTriangle, CheckCircle2, Clock, Mail, Search, Filter } from "lucide-react";

/* Tokens */
const ringIndigo =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#6366F1]/40";
const card =
  "rounded-2xl border border-[#E7E9FF] dark:border-[#2B2F55] bg-white/80 dark:bg-white/[0.05] backdrop-blur";
const chip =
  "inline-flex items-center gap-2 rounded-full border border-[#E7E9FF] dark:border-[#2B2F55] bg-white/70 dark:bg-white/[0.06] px-3 py-1 text-[11px] font-semibold";

type CompStatus = "operational" | "degraded" | "outage" | "maintenance";
type ComponentRow = { key: string; name: string; status: CompStatus; note?: string };

type Incident = {
  id: string;
  date: string; // ISO
  title: string;
  impact: "minor" | "major" | "critical";
  status: "resolved" | "monitoring" | "identified" | "investigating";
  components: string[]; // component keys
  updates: Array<{ at: string; text: string }>;
};

const COMPONENTS: ComponentRow[] = [
  { key: "web", name: "Web App", status: "operational" },
  { key: "api", name: "Public API", status: "operational" },
  { key: "payments", name: "Payments", status: "degraded", note: "Higher latency on refunds" },
  { key: "notifications", name: "Notifications", status: "operational" },
  { key: "webhooks", name: "Webhooks", status: "operational" },
];

const INCIDENTS: Incident[] = [
  {
    id: "inc-2301",
    date: "2025-02-09T10:00:00Z",
    title: "Partial refunds delay",
    impact: "minor",
    status: "monitoring",
    components: ["payments"],
    updates: [
      { at: "2025-02-09T10:20:00Z", text: "Investigating elevated refund latency with provider." },
      { at: "2025-02-09T11:00:00Z", text: "Applied mitigations; latency trending down." },
      { at: "2025-02-09T12:00:00Z", text: "Monitoring. No data loss." },
    ],
  },
  {
    id: "inc-2290",
    date: "2025-01-18T08:00:00Z",
    title: "Webhooks retries stuck",
    impact: "major",
    status: "resolved",
    components: ["webhooks", "api"],
    updates: [
      { at: "2025-01-18T08:10:00Z", text: "Identified issue with backoff strategy." },
      { at: "2025-01-18T08:35:00Z", text: "Deployed fix; backlog processing." },
      { at: "2025-01-18T10:00:00Z", text: "Resolved. Added alerting rule." },
    ],
  },
];

function statusColor(s: CompStatus) {
  if (s === "operational") return "text-emerald-600";
  if (s === "degraded") return "text-amber-600";
  if (s === "outage") return "text-rose-600";
  return "text-indigo-600";
}
function worstStatus(rows: ComponentRow[]): CompStatus {
  // outage > degraded > maintenance > operational
  if (rows.some(r => r.status === "outage")) return "outage";
  if (rows.some(r => r.status === "degraded")) return "degraded";
  if (rows.some(r => r.status === "maintenance")) return "maintenance";
  return "operational";
}

export default function StatusPage() {
  const [query, setQuery] = React.useState("");
  const [impact, setImpact] = React.useState<"all" | Incident["impact"]>("all");
  const [range, setRange] = React.useState<"30d" | "90d" | "all">("30d");
  const [subscribe, setSubscribe] = React.useState("");

  const banner = worstStatus(COMPONENTS);
  const bannerText =
    banner === "operational" ? "All systems operational" :
    banner === "degraded" ? "Degraded performance on some components" :
    banner === "maintenance" ? "Scheduled maintenance" : "Partial outage";

  const incidents = INCIDENTS.filter(i => {
    const q = query.trim().toLowerCase();
    const matchesQ =
      q === "" ||
      i.title.toLowerCase().includes(q) ||
      i.components.join(" ").toLowerCase().includes(q) ||
      i.updates.some(u => u.text.toLowerCase().includes(q));
    const matchesImpact = impact === "all" || i.impact === impact;
    const withinRange = (() => {
      if (range === "all") return true;
      const days = range === "30d" ? 30 : 90;
      const since = new Date();
      since.setDate(since.getDate() - days);
      return +new Date(i.date) >= +since;
    })();
    return matchesQ && matchesImpact && withinRange;
  }).sort((a, b) => +new Date(b.date) - +new Date(a.date));

  const onSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(subscribe)) return;
    const subs = JSON.parse(localStorage.getItem("mentora.status.subscribers") || "[]");
    subs.push({ email: subscribe, at: new Date().toISOString() });
    localStorage.setItem("mentora.status.subscribers", JSON.stringify(subs));
    setSubscribe("");
    alert("Subscribed to status updates!");
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(1100px_600px_at_10%_-10%,rgba(79,70,229,0.16),transparent),radial-gradient(900px_500px_at_90%_-10%,rgba(99,102,241,0.12),transparent)]">
      <Header />

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        {/* Banner */}
        <div className={`${card} p-5`}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-sm font-semibold">
              {banner === "operational" ? (
                <CheckCircle2 className={statusColor(banner)} size={18}/>
              ) : (
                <AlertTriangle className={statusColor(banner)} size={18}/>
              )}
              <span className="text-[#0F1536] dark:text-[#E7E9FF]">{bannerText}</span>
            </div>
            <form onSubmit={onSubscribe} className="flex items-center gap-2">
              <span className={chip}><Mail size={12}/> Subscribe</span>
              <input
                value={subscribe}
                onChange={(e) => setSubscribe(e.target.value)}
                placeholder="you@company.com"
                className={`h-10 rounded-xl border border-[#E7E9FF] dark:border-[#2B2F55] bg-white/70 dark:bg-white/[0.06] px-3 text-sm ${ringIndigo}`}
              />
              <button className={`h-10 px-3 rounded-xl text-sm font-semibold text-white bg-[#4F46E5] ${ringIndigo}`}>
                Get updates
              </button>
            </form>
          </div>
        </div>

        {/* Components table */}
        <div className="mt-6 overflow-auto">
          <table className="min-w-[680px] w-full text-sm">
            <thead>
              <tr className="border-b border-[#E7E9FF] dark:border-[#2B2F55]">
                <th className="py-3 px-3 text-left">Component</th>
                <th className="py-3 px-3 text-left">Status</th>
                <th className="py-3 px-3 text-left">Notes</th>
              </tr>
            </thead>
            <tbody className={`${card}`}>
              {COMPONENTS.map(c => (
                <tr key={c.key} className="border-b last:border-none border-[#E7E9FF] dark:border-[#2B2F55]">
                  <td className="py-3 px-3">{c.name}</td>
                  <td className={`py-3 px-3 font-semibold capitalize ${statusColor(c.status)}`}>{c.status}</td>
                  <td className="py-3 px-3 text-[#2C3157] dark:text-[#C9D1FF]/85">{c.note || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Filters */}
        <div className="mt-6 grid sm:grid-cols-3 gap-3">
          <div className={`${card} h-11 flex items-center gap-2 px-3.5`}>
            <Search size={16} className="text-[#5F679A] dark:text-[#A7B0FF]" />
            <input
              className="flex-1 bg-transparent outline-none text-sm"
              placeholder="Search incidents…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 text-xs text-[#6B72B3] dark:text-[#A7B0FF]/80"><Filter size={12}/> Impact</span>
            <select
              className={`h-11 rounded-xl border border-[#E7E9FF] dark:border-[#2B2F55] bg-white/70 dark:bg-white/[0.06] px-3 text-sm ${ringIndigo}`}
              value={impact}
              onChange={(e) => setImpact(e.target.value as any)}
            >
              <option value="all">All</option>
              <option value="minor">Minor</option>
              <option value="major">Major</option>
              <option value="critical">Critical</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 text-xs text-[#6B72B3] dark:text-[#A7B0FF]/80"><Clock size={12}/> Range</span>
            <select
              className={`h-11 rounded-xl border border-[#E7E9FF] dark:border-[#2B2F55] bg-white/70 dark:bg-white/[0.06] px-3 text-sm ${ringIndigo}`}
              value={range}
              onChange={(e) => setRange(e.target.value as any)}
            >
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="all">All time</option>
            </select>
          </div>
        </div>

        {/* Incidents */}
        <div className="mt-6 grid gap-4">
          {incidents.map(inc => (
            <div key={inc.id} className={`${card} p-5`}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="text-sm font-semibold text-[#0F1536] dark:text-[#E7E9FF]">
                  {inc.title}
                  <span className="ml-2 text-xs text-[#6B72B3] dark:text-[#A7B0FF]/80">
                    {new Date(inc.date).toLocaleString()}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-1">
                  <span className="text-[11px] rounded-lg border border-[#E7E9FF] dark:border-[#2B2F55] px-2 py-1 bg-white/70 dark:bg-white/[0.06] capitalize">
                    impact: {inc.impact}
                  </span>
                  <span className={`text-[11px] rounded-lg border px-2 py-1 capitalize
                    ${inc.status === "resolved" ? "border-emerald-300/50 bg-emerald-50/70 dark:bg-emerald-900/20" :
                       inc.status === "monitoring" ? "border-indigo-300/50 bg-indigo-50/70 dark:bg-indigo-900/20" :
                       inc.status === "identified" ? "border-amber-300/50 bg-amber-50/70 dark:bg-amber-900/20" :
                       "border-rose-300/50 bg-rose-50/70 dark:bg-rose-900/20"}`}>
                    {inc.status}
                  </span>
                </div>
              </div>

              <div className="mt-3 text-xs text-[#6B72B3] dark:text-[#A7B0FF]/80">
                Affected: {inc.components.join(", ")}
              </div>

              <div className="mt-3 grid gap-2">
                {inc.updates.map((u, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-sm">
                    <Activity size={16} className="text-indigo-500 mt-0.5"/>
                    <div>
                      <div className="text-xs text-[#6B72B3] dark:text-[#A7B0FF]/80">{new Date(u.at).toLocaleString()}</div>
                      <div className="text-[#2C3157] dark:text-[#C9D1FF]/85">{u.text}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          {incidents.length === 0 && (
            <div className={`${card} p-4 text-sm text-[#6B72B3] dark:text-[#A7B0FF]/80`}>No incidents in this range.</div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
