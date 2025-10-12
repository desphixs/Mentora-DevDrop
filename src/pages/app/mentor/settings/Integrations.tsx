import React from "react";
import MentorAppLayout from "../MentorAppLayout";
import {
  PlugZap,
  Wallet,
  CalendarCheck2,
  MessageSquare,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  RefreshCcw,
  Link2,
  Copy,
  Webhook,
  Clock,
} from "lucide-react";

/* tokens */
const ringIndigo =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#6366F1]/40";
const card =
  "rounded-2xl border border-[#E7E9FF] dark:border-[#2B2F55] bg-white/80 dark:bg-white/[0.05] backdrop-blur";
const btnBase =
  "inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-semibold transition " + ringIndigo;
const btnSolid =
  "text-white bg-gradient-to-r from-[#4F46E5] via-[#6366F1] to-[#8B5CF6] shadow-[0_10px_30px_rgba(79,70,229,0.35)] hover:shadow-[0_16px_40px_rgba(79,70,229,0.45)]";
const btnGhost =
  "border border-[#D9DBFF] dark:border-[#30345D] text-[#1B1F3A] dark:text-[#E6E9FF] bg-white/70 dark:bg-white/[0.05] hover:bg-white/90 dark:hover:bg-white/[0.08]";
const badge =
  "inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full";

/* dummy */
type ProviderCat = "payments" | "calendar" | "messaging";
type Provider = {
  id: string;
  name: string;
  cat: ProviderCat;
  status: "connected" | "disconnected";
  account?: string;
};

const PROVIDERS: Provider[] = [
  { id: "p1", name: "Stripe", cat: "payments", status: "connected", account: "acct_12AB" },
  { id: "p2", name: "Paystack", cat: "payments", status: "connected", account: "pk_live_xxxx" },
  { id: "p3", name: "Flutterwave", cat: "payments", status: "disconnected" },
  { id: "p4", name: "Razorpay", cat: "payments", status: "disconnected" },
  { id: "p5", name: "Google Calendar", cat: "calendar", status: "connected", account: "ada@team.com" },
  { id: "p6", name: "Outlook", cat: "calendar", status: "disconnected" },
  { id: "p7", name: "WhatsApp", cat: "messaging", status: "connected", account: "+234 802 *** 123" },
];

type Delivery = {
  id: string;
  at: string;
  status: "200" | "500" | "404";
  event: string;
  durationMs: number;
};

const isoAgo = (m: number) => new Date(Date.now() - m * 60000).toISOString();
const D_DELIVERIES: Delivery[] = Array.from({ length: 22 }).map((_, i) => ({
  id: "d" + (i + 1),
  at: isoAgo(5 + i * 7),
  status: (i % 7 === 0 ? "500" : "200") as any,
  event: ["session.created", "session.updated", "payout.sent", "review.created"][i % 4],
  durationMs: 120 + (i % 5) * 40,
}));

const PER_PAGE = 8;

const Integrations: React.FC = () => {
  const [providers, setProviders] = React.useState<Provider[]>(
    () => JSON.parse(localStorage.getItem("mentora.integrations.providers") || "null") ?? PROVIDERS
  );
  React.useEffect(() => {
    localStorage.setItem("mentora.integrations.providers", JSON.stringify(providers));
  }, [providers]);

  const [query, setQuery] = React.useState("");
  const [cat, setCat] = React.useState<"all" | ProviderCat>("all");
  const filtered = providers.filter((p) => {
    const q = query.trim().toLowerCase();
    if (cat !== "all" && p.cat !== cat) return false;
    if (q && !`${p.name} ${p.account ?? ""}`.toLowerCase().includes(q)) return false;
    return true;
  });

  const connect = (id: string) =>
    setProviders((ps) => ps.map((p) => (p.id === id ? { ...p, status: "connected", account: p.account || "linked" } : p)));
  const disconnect = (id: string) =>
    setProviders((ps) => ps.map((p) => (p.id === id ? { ...p, status: "disconnected", account: undefined } : p)));

  /* Webhooks config */
  const [endpoint, setEndpoint] = React.useState("https://api.yourdomain.com/webhooks/mentora");
  const [secret, setSecret] = React.useState("whsec_1234567890abcdef");
  const [events, setEvents] = React.useState<string[]>(["session.created", "payout.sent"]);
  const toggleEvent = (ev: string) =>
    setEvents((es) => (es.includes(ev) ? es.filter((e) => e !== ev) : [...es, ev]));

  /* deliveries */
  const [deliveries, setDeliveries] = React.useState<Delivery[]>(
    () => JSON.parse(localStorage.getItem("mentora.integrations.deliveries") || "null") ?? D_DELIVERIES
  );
  React.useEffect(() => {
    localStorage.setItem("mentora.integrations.deliveries", JSON.stringify(deliveries));
  }, [deliveries]);

  const [dQuery, setDQuery] = React.useState("");
  const [dStatus, setDStatus] = React.useState<"all" | "200" | "500" | "404">("all");
  const dFiltered = deliveries.filter((d) => {
    const q = dQuery.trim().toLowerCase();
    if (dStatus !== "all" && d.status !== dStatus) return false;
    if (q && !`${d.event}`.toLowerCase().includes(q)) return false;
    return true;
  });
  const [page, setPage] = React.useState(1);
  const totalPages = Math.max(1, Math.ceil(dFiltered.length / PER_PAGE));
  const paged = dFiltered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  React.useEffect(() => setPage(1), [dQuery, dStatus]);

  /* row menus */
  const [openMenu, setOpenMenu] = React.useState<string | null>(null);

  return (
    <MentorAppLayout>
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-[#0F132E] dark:text-[#E9ECFF]">Integrations</h1>
            <p className="text-sm text-[#5E66A6] dark:text-[#A7B0FF]/85">Connect payment, calendar, and messaging providers. Configure webhooks.</p>
          </div>
          <span className="inline-flex items-center gap-2 text-[11px] px-3 py-1 rounded-full border border-[#E7E9FF] dark:border-[#2B2F55] bg-white/70 dark:bg-white/[0.05]">
            <PlugZap size={14}/> Build-first
          </span>
        </div>

        <div className="mt-4 grid grid-cols-1 xl:grid-cols-12 gap-4">
          {/* Providers */}
          <div className={`xl:col-span-5 ${card} p-4`}>
            <div className="text-sm font-semibold flex items-center gap-2">
              <Wallet size={16}/> Connected providers
            </div>

            {/* Filters */}
            <div className="mt-3 flex flex-wrap gap-2">
              <div className={`flex items-center gap-2 ${card} h-11 px-3.5 flex-1 min-w-[220px]`}>
                <Search size={16} className="text-[#5F679A] dark:text-[#A7B0FF]" />
                <input
                  className="bg-transparent outline-none text-sm w-full text-[#101436] dark:text-[#EEF0FF] placeholder-[#7A81B4] dark:placeholder-[#A7B0FF]/80"
                  placeholder="Search Stripe, Calendar, WhatsApp…"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>

              <div className={`flex items-center gap-2 ${card} h-11 px-3`}>
                <Filter size={16} className="text-[#5F679A] dark:text-[#A7B0FF]" />
                <select className="bg-transparent text-sm outline-none" value={cat} onChange={(e) => setCat(e.target.value as any)}>
                  <option value="all">All categories</option>
                  <option value="payments">Payments</option>
                  <option value="calendar">Calendar</option>
                  <option value="messaging">Messaging</option>
                </select>
              </div>
            </div>

            {/* Provider cards */}
            <div className="mt-3 grid sm:grid-cols-2 gap-3">
              {filtered.map((p) => (
                <div key={p.id} className="p-3 rounded-xl border border-[#E7E9FF] dark:border-[#2B2F55]">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-sm font-semibold text-[#0F1536] dark:text-[#E7E9FF]">{p.name}</div>
                      <div className="mt-1 text-xs text-[#5E66A6] dark:text-[#A7B0FF]/85 capitalize">{p.cat}</div>
                      <div className="mt-2">
                        {p.status === "connected" ? (
                          <span className={`${badge} bg-emerald-50 dark:bg-emerald-400/10 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-400/20`}>
                            <CheckCircle2 size={12}/> Connected {p.account ? `· ${p.account}` : ""}
                          </span>
                        ) : (
                          <span className={`${badge} bg-rose-50 dark:bg-rose-400/10 text-rose-700 dark:text-rose-300 border border-rose-200/60 dark:border-rose-400/20`}>
                            <XCircle size={12}/> Disconnected
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="relative">
                      <button
                        className={`${btnBase} ${btnGhost} px-2 py-1`}
                        onClick={() => setOpenMenu((m) => (m === p.id ? null : p.id))}
                        aria-expanded={openMenu === p.id}
                        aria-haspopup="menu"
                      >
                        <MoreVertical size={16}/>
                      </button>
                      {openMenu === p.id && (
                        <div className="absolute right-0 mt-2 w-44 z-20 rounded-xl border border-[#E7E9FF] dark:border-[#2B2F55] bg-white dark:bg-[#0c0f27] shadow-lg p-1">
                          {p.status === "connected" ? (
                            <>
                              <button className="w-full text-left text-sm px-3 py-2 rounded-lg hover:bg-zinc-50/70 dark:hover:bg-white/[0.06]"
                                onClick={() => { alert("Opened settings (demo)"); setOpenMenu(null); }}>
                                Settings
                              </button>
                              <button className="w-full text-left text-sm px-3 py-2 rounded-lg hover:bg-zinc-50/70 dark:hover:bg-white/[0.06]"
                                onClick={() => { disconnect(p.id); setOpenMenu(null); }}>
                                Disconnect
                              </button>
                            </>
                          ) : (
                            <button className="w-full text-left text-sm px-3 py-2 rounded-lg hover:bg-zinc-50/70 dark:hover:bg-white/[0.06]"
                              onClick={() => { connect(p.id); setOpenMenu(null); }}>
                              Connect
                            </button>
                          )}
                          <button className="w-full text-left text-sm px-3 py-2 rounded-lg hover:bg-zinc-50/70 dark:hover:bg-white/[0.06]"
                            onClick={() => { alert("Docs (demo)"); setOpenMenu(null); }}>
                            View docs
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {p.cat === "payments" && <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#EEF2FF] dark:bg-white/[0.06] border border-[#E7E9FF] dark:border-[#2B2F55]">Payouts</span>}
                    {p.cat === "calendar" && <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#EEF2FF] dark:bg-white/[0.06] border border-[#E7E9FF] dark:border-[#2B2F55]">Bookings</span>}
                    {p.cat === "messaging" && <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#EEF2FF] dark:bg-white/[0.06] border border-[#E7E9FF] dark:border-[#2B2F55]">Reminders</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Webhooks */}
          <div className={`xl:col-span-7 ${card} p-4`}>
            <div className="text-sm font-semibold flex items-center gap-2">
              <Webhook size={16}/> Webhooks
            </div>

            {/* Endpoint */}
            <div className="mt-3 grid md:grid-cols-2 gap-3">
              <label className="text-sm">
                <div className="text-[#0F1536] dark:text-[#E7E9FF]">Endpoint URL</div>
                <div className="mt-1 flex gap-2">
                  <input
                    className={`h-11 w-full px-3 rounded-xl border border-[#E7E9FF] dark:border-[#2B2F55] bg-white/70 dark:bg-white/[0.05] outline-none text-sm ${ringIndigo}`}
                    value={endpoint}
                    onChange={(e) => setEndpoint(e.target.value)}
                  />
                  <button className={`${btnBase} ${btnGhost}`} onClick={() => navigator.clipboard.writeText(endpoint)}>
                    <Copy size={16}/> Copy
                  </button>
                </div>
              </label>
              <label className="text-sm">
                <div className="text-[#0F1536] dark:text-[#E7E9FF]">Signing secret</div>
                <div className="mt-1 flex gap-2">
                  <input
                    className={`h-11 w-full px-3 rounded-xl border border-[#E7E9FF] dark:border-[#2B2F55] bg-white/70 dark:bg-white/[0.05] outline-none text-sm ${ringIndigo}`}
                    value={secret}
                    onChange={(e) => setSecret(e.target.value)}
                  />
                  <button className={`${btnBase} ${btnGhost}`} onClick={() => navigator.clipboard.writeText(secret)}>
                    <Copy size={16}/> Copy
                  </button>
                </div>
              </label>
            </div>

            {/* Events */}
            <div className="mt-3">
              <div className="text-sm font-semibold">Subscribed events</div>
              <div className="mt-2 grid sm:grid-cols-2 md:grid-cols-3 gap-2">
                {["session.created", "session.updated", "session.cancelled", "payout.sent", "review.created", "review.flagged"].map((ev) => (
                  <label key={ev} className="flex items-center gap-2 text-sm px-3 py-2 rounded-lg border border-[#E7E9FF] dark:border-[#2B2F55] bg-white/70 dark:bg-white/[0.05]">
                    <input type="checkbox" className="accent-[#6366F1]" checked={events.includes(ev)} onChange={() => toggleEvent(ev)} />
                    {ev}
                  </label>
                ))}
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <button className={`${btnBase} ${btnSolid}`} onClick={() => alert("Saved (demo)")}>Save</button>
                <button className={`${btnBase} ${btnGhost}`} onClick={() => alert("Ping sent (demo)")}>
                  <Link2 size={16}/> Send test ping
                </button>
              </div>
            </div>

            {/* Deliveries */}
            <div className="mt-6 p-3 rounded-xl border border-[#E7E9FF] dark:border-[#2B2F55]">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="text-sm font-semibold">Recent deliveries</div>
                <div className="flex flex-wrap gap-2">
                  <div className={`flex items-center gap-2 ${card} h-10 px-3`}>
                    <Search size={16} className="text-[#5F679A] dark:text-[#A7B0FF]" />
                    <input
                      className="bg-transparent outline-none text-sm w-40 text-[#101436] dark:text-[#EEF0FF] placeholder-[#7A81B4] dark:placeholder-[#A7B0FF]/80"
                      placeholder="Search event…"
                      value={dQuery}
                      onChange={(e) => setDQuery(e.target.value)}
                    />
                  </div>
                  <div className={`flex items-center gap-2 ${card} h-10 px-3`}>
                    <Filter size={16} className="text-[#5F679A] dark:text-[#A7B0FF]" />
                    <select className="bg-transparent text-sm outline-none" value={dStatus} onChange={(e) => setDStatus(e.target.value as any)}>
                      <option value="all">All</option>
                      <option value="200">200</option>
                      <option value="500">500</option>
                      <option value="404">404</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Table */}
              <div className="mt-3 overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs text-[#6B72B3] dark:text-[#A7B0FF]/80">
                      <th className="py-2 pr-4">Time</th>
                      <th className="py-2 pr-4">Event</th>
                      <th className="py-2 pr-4">Status</th>
                      <th className="py-2 pr-4">Duration</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E7E9FF] dark:divide-[#2B2F55]">
                    {paged.map((d) => (
                      <tr key={d.id}>
                        <td className="py-2 pr-4 text-[#0F1536] dark:text-[#E7E9FF]">
                          {new Date(d.at).toLocaleString()} <span className="text-[11px] text-[#6B72B3] dark:text-[#A7B0FF]/80">({rel(d.at)})</span>
                        </td>
                        <td className="py-2 pr-4">{d.event}</td>
                        <td className="py-2 pr-4">
                          <StatusPill code={d.status} />
                        </td>
                        <td className="py-2 pr-4">{d.durationMs} ms</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="mt-3 flex items-center justify-between">
                <div className="text-[12px] text-[#6B72B3] dark:text-[#A7B0FF]/80">
                  Page {page} / {totalPages} • {dFiltered.length} total
                </div>
                <div className="flex items-center gap-2">
                  <button className={`${btnBase} ${btnGhost} px-2 py-1`} disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
                    <ChevronLeft size={16}/>
                  </button>
                  <button className={`${btnBase} ${btnGhost} px-2 py-1`} disabled={page >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>
                    <ChevronRight size={16}/>
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </MentorAppLayout>
  );
};

/* ui bits */
function StatusPill({ code }: { code: "200" | "500" | "404" }) {
  const map = {
    "200": "bg-emerald-50 dark:bg-emerald-400/10 text-emerald-700 dark:text-emerald-300 border-emerald-200/60 dark:border-emerald-400/20",
    "500": "bg-rose-50 dark:bg-rose-400/10 text-rose-700 dark:text-rose-300 border-rose-200/60 dark:border-rose-400/20",
    "404": "bg-amber-50 dark:bg-amber-400/10 text-amber-700 dark:text-amber-300 border-amber-200/60 dark:border-amber-400/20",
  } as const;
  return (
    <span className={`inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full border ${map[code]}`}>
      {code}
    </span>
  );
}

const rel = (iso: string) => {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.round(diff / 60000);
  if (m < 1) return "now";
  if (m < 60) return `${m}m`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h`;
  const d = Math.round(h / 24);
  return `${d}d`;
};

export default Integrations;
