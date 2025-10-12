import React from "react";
import MentorAppLayout from "../MentorAppLayout";
import {
  Search,
  Filter,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  BadgeDollarSign,
  CreditCard,
  User,
  Users,
  Clock,
  CalendarDays,
  ArrowDownRight,
  ArrowUpRight,
  CheckCircle2,
  XCircle,
  Download,
  Receipt,
} from "lucide-react";

/* ---------------------------------
   Indigo glass UI tokens (local)
---------------------------------- */
const ringIndigo =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#6366F1]/40";
const card =
  "rounded-2xl border border-[#E7E9FF] dark:border-[#2B2F55] bg-white/80 dark:bg-white/[0.05] backdrop-blur";
const btnBase =
  "inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-semibold transition " +
  ringIndigo;
const btnSolid =
  "text-white bg-gradient-to-r from-[#4F46E5] via-[#6366F1] to-[#8B5CF6] shadow-[0_10px_30px_rgba(79,70,229,0.35)] hover:shadow-[0_16px_40px_rgba(79,70,229,0.45)]";
const btnGhost =
  "border border-[#D9DBFF] dark:border-[#30345D] text-[#1B1F3A] dark:text-[#E6E9FF] bg-white/70 dark:bg-white/[0.05] hover:bg-white/90 dark:hover:bg-white/[0.08]";
const pill =
  "inline-flex items-center gap-2 rounded-full border border-[#E7E9FF] dark:border-[#2B2F55] bg-white/70 dark:bg-white/[0.05] px-3 py-1 text-[11px] font-semibold";

type Method = "Stripe" | "Paystack" | "Flutterwave" | "Razorpay" | "UPI";
type SessionType = "1:1" | "group";
type TxStatus = "cleared" | "pending" | "refunded";
type Earning = {
  id: string;
  dateISO: string;
  title: string;
  mentee: string;
  type: SessionType;
  durationMin: number;
  currency: "USD" | "NGN" | "INR" | "EUR";
  gross: number;
  fee: number;
  net: number;
  method: Method;
  status: TxStatus;
  invoiceId?: string;
};

const daysAgoISO = (d: number) =>
  new Date(Date.now() - d * 24 * 60 * 60 * 1000).toISOString();

const DUMMY: Earning[] = [
  {
    id: "e1",
    dateISO: daysAgoISO(2),
    title: "Next.js perf",
    mentee: "Tunde",
    type: "1:1",
    durationMin: 45,
    currency: "USD",
    gross: 25,
    fee: 2.5,
    net: 22.5,
    method: "Stripe",
    status: "cleared",
    invoiceId: "INV-1008",
  },
  {
    id: "e2",
    dateISO: daysAgoISO(6),
    title: "Observability",
    mentee: "Riya",
    type: "1:1",
    durationMin: 60,
    currency: "USD",
    gross: 40,
    fee: 3.2,
    net: 36.8,
    method: "Stripe",
    status: "cleared",
    invoiceId: "INV-1007",
  },
  {
    id: "e3",
    dateISO: daysAgoISO(8),
    title: "Design Crit",
    mentee: "Design Roundtable",
    type: "group",
    durationMin: 60,
    currency: "USD",
    gross: 120,
    fee: 9.6,
    net: 110.4,
    method: "Razorpay",
    status: "pending",
    invoiceId: "INV-1006",
  },
  {
    id: "e4",
    dateISO: daysAgoISO(14),
    title: "Career Planning",
    mentee: "Kelechi",
    type: "1:1",
    durationMin: 30,
    currency: "USD",
    gross: 20,
    fee: 1.6,
    net: 18.4,
    method: "Paystack",
    status: "cleared",
    invoiceId: "INV-1005",
  },
  {
    id: "e5",
    dateISO: daysAgoISO(20),
    title: "Growth Strategy",
    mentee: "Mason",
    type: "1:1",
    durationMin: 45,
    currency: "USD",
    gross: 30,
    fee: 2.4,
    net: 27.6,
    method: "Stripe",
    status: "refunded",
    invoiceId: "INV-1004",
  },
  {
    id: "e6",
    dateISO: daysAgoISO(26),
    title: "Mock Interview FE",
    mentee: "Arjun",
    type: "1:1",
    durationMin: 60,
    currency: "USD",
    gross: 45,
    fee: 3.6,
    net: 41.4,
    method: "UPI",
    status: "cleared",
    invoiceId: "INV-1003",
  },
  {
    id: "e7",
    dateISO: daysAgoISO(33),
    title: "Campaign Audit",
    mentee: "Noah",
    type: "1:1",
    durationMin: 30,
    currency: "USD",
    gross: 20,
    fee: 1.6,
    net: 18.4,
    method: "Flutterwave",
    status: "cleared",
    invoiceId: "INV-1002",
  },
  {
    id: "e8",
    dateISO: daysAgoISO(45),
    title: "ML Roadmap",
    mentee: "Olivia",
    type: "1:1",
    durationMin: 60,
    currency: "USD",
    gross: 50,
    fee: 4,
    net: 46,
    method: "Stripe",
    status: "cleared",
    invoiceId: "INV-1001",
  },
  {
    id: "e9",
    dateISO: daysAgoISO(52),
    title: "Brand Sprint",
    mentee: "Ada",
    type: "group",
    durationMin: 90,
    currency: "USD",
    gross: 180,
    fee: 14.4,
    net: 165.6,
    method: "Stripe",
    status: "pending",
    invoiceId: "INV-1000",
  },
  {
    id: "e10",
    dateISO: daysAgoISO(70),
    title: "Rust Kickoff",
    mentee: "Chidi",
    type: "1:1",
    durationMin: 60,
    currency: "USD",
    gross: 45,
    fee: 3.6,
    net: 41.4,
    method: "Razorpay",
    status: "cleared",
    invoiceId: "INV-0999",
  },
];

type Filters = {
  q: string;
  status: "all" | TxStatus;
  method: "all" | Method;
  type: "all" | SessionType;
  range: "30d" | "90d" | "all";
  sort: "dateDesc" | "dateAsc" | "netDesc" | "netAsc";
};

const perPage = 8;

function withinRange(iso: string, range: Filters["range"]) {
  if (range === "all") return true;
  const days = range === "30d" ? 30 : 90;
  const since = Date.now() - days * 864e5;
  return +new Date(iso) >= since;
}

function applyFilters(list: Earning[], f: Filters) {
  let out = list.filter((x) => {
    if (f.status !== "all" && x.status !== f.status) return false;
    if (f.method !== "all" && x.method !== f.method) return false;
    if (f.type !== "all" && x.type !== f.type) return false;
    if (!withinRange(x.dateISO, f.range)) return false;
    if (f.q.trim()) {
      const q = f.q.toLowerCase();
      const hay =
        `${x.title} ${x.mentee} ${x.method} ${x.status}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });

  if (f.sort === "dateDesc")
    out.sort((a, b) => +new Date(b.dateISO) - +new Date(a.dateISO));
  if (f.sort === "dateAsc")
    out.sort((a, b) => +new Date(a.dateISO) - +new Date(b.dateISO));
  if (f.sort === "netDesc") out.sort((a, b) => b.net - a.net);
  if (f.sort === "netAsc") out.sort((a, b) => a.net - b.net);
  return out;
}

const fmtDay = (iso: string) =>
  new Date(iso).toLocaleDateString([], {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
const fmtTime = (iso: string) =>
  new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

export default function Earnings() {
  const [data, setData] = React.useState<Earning[]>(
    () =>
      JSON.parse(localStorage.getItem("mentora.finance.earnings") || "null") ??
      DUMMY
  );
  React.useEffect(
    () =>
      localStorage.setItem("mentora.finance.earnings", JSON.stringify(data)),
    [data]
  );

  const [filters, setFilters] = React.useState<Filters>({
    q: "",
    status: "all",
    method: "all",
    type: "all",
    range: "30d",
    sort: "dateDesc",
  });

  const [page, setPage] = React.useState(1);
  const filtered = React.useMemo(
    () => applyFilters(data, filters),
    [data, filters]
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paged = React.useMemo(
    () => filtered.slice((page - 1) * perPage, page * perPage),
    [filtered, page]
  );
  React.useEffect(() => setPage(1), [filters]);

  // Summary
  const gross = filtered.reduce((s, x) => s + x.gross, 0);
  const fees = filtered.reduce((s, x) => s + x.fee, 0);
  const net = filtered.reduce((s, x) => s + x.net, 0);
  const sessions = filtered.length;

  const [actionsFor, setActionsFor] = React.useState<string | null>(null);
  const markCleared = (id: string) =>
    setData((p) =>
      p.map((x) => (x.id === id ? { ...x, status: "cleared" } : x))
    );
  const markRefunded = (id: string) =>
    setData((p) =>
      p.map((x) => (x.id === id ? { ...x, status: "refunded" } : x))
    );

  const exportCSV = () => {
    const headers = [
      "id",
      "date",
      "title",
      "mentee",
      "type",
      "durationMin",
      "currency",
      "gross",
      "fee",
      "net",
      "method",
      "status",
      "invoiceId",
    ];
    const rows = filtered.map((x) => [
      x.id,
      new Date(x.dateISO).toISOString(),
      x.title,
      x.mentee,
      x.type,
      x.durationMin,
      x.currency,
      x.gross,
      x.fee,
      x.net,
      x.method,
      x.status,
      x.invoiceId || "",
    ]);
    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "earnings.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <MentorAppLayout>
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-[#0F132E] dark:text-[#E9ECFF]">
              Earnings
            </h1>
            <p className="text-sm text-[#5E66A6] dark:text-[#A7B0FF]/85">
              Track gross, fees, and net across sessions.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button className={`${btnBase} ${btnGhost}`} onClick={exportCSV}>
              <Download size={16} /> Export CSV
            </button>
          </div>
        </div>

        {/* KPI strip */}
        <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className={`${card} p-4`}>
            <div className="text-sm text-[#6B72B3] dark:text-[#A7B0FF]/80 flex items-center gap-2">
              <BadgeDollarSign size={16} /> Gross
            </div>
            <div className="mt-1 text-2xl font-extrabold">
              ${gross.toFixed(2)}
            </div>
            <div className="mt-2 h-2 rounded-full bg-[#E9ECFF] dark:bg-[#22264A] overflow-hidden">
              <div className="h-full w-[85%] bg-gradient-to-r from-[#6366F1] to-[#8B5CF6]" />
            </div>
          </div>
          <div className={`${card} p-4`}>
            <div className="text-sm text-[#6B72B3] dark:text-[#A7B0FF]/80 flex items-center gap-2">
              <CreditCard size={16} /> Fees
            </div>
            <div className="mt-1 text-2xl font-extrabold">
              ${fees.toFixed(2)}
            </div>
            <div className="mt-2 h-2 rounded-full bg-[#E9ECFF] dark:bg-[#22264A] overflow-hidden">
              <div className="h-full w-[35%] bg-gradient-to-r from-[#C7D2FE] to-[#DDD6FE]" />
            </div>
          </div>
          <div className={`${card} p-4`}>
            <div className="text-sm text-[#6B72B3] dark:text-[#A7B0FF]/80 flex items-center gap-2">
              <ArrowUpRight size={16} /> Net
            </div>
            <div className="mt-1 text-2xl font-extrabold">
              ${net.toFixed(2)}
            </div>
            <div className="mt-2 h-2 rounded-full bg-[#E9ECFF] dark:bg-[#22264A] overflow-hidden">
              <div className="h-full w-[70%] bg-gradient-to-r from-[#4F46E5] via-[#6366F1] to-[#8B5CF6]" />
            </div>
          </div>
          <div className={`${card} p-4`}>
            <div className="text-sm text-[#6B72B3] dark:text-[#A7B0FF]/80 flex items-center gap-2">
              <CalendarDays size={16} /> Sessions
            </div>
            <div className="mt-1 text-2xl font-extrabold">{sessions}</div>
            <div className="mt-2 h-2 rounded-full bg-[#E9ECFF] dark:bg-[#22264A] overflow-hidden">
              <div className="h-full w-[60%] bg-gradient-to-r from-[#EEF2FF] to-[#EDE9FE]" />
            </div>
          </div>
        </div>

        {/* Filters / Search */}
        <div className="mt-4 flex flex-wrap gap-2">
          {/* Search */}
          <div
            className={`flex items-center gap-2 ${card} h-11 px-3.5 flex-1 min-w-[220px]`}
          >
            <Search size={16} className="text-[#5F679A] dark:text-[#A7B0FF]" />
            <input
              className="bg-transparent outline-none text-sm w-full text-[#101436] dark:text-[#EEF0FF] placeholder-[#7A81B4] dark:placeholder-[#A7B0FF]/80"
              placeholder="Search title, mentee, method…"
              value={filters.q}
              onChange={(e) => setFilters((f) => ({ ...f, q: e.target.value }))}
            />
          </div>

          {/* Filter rail */}
          <div
            className={`flex items-center gap-2 ${card} h-11 px-3 flex-wrap`}
          >
            <Filter size={16} className="text-[#5F679A] dark:text-[#A7B0FF]" />
            <select
              className="bg-transparent text-sm outline-none"
              value={filters.status}
              onChange={(e) =>
                setFilters((f) => ({ ...f, status: e.target.value as any }))
              }
            >
              <option value="all">Status: All</option>
              <option value="cleared">Cleared</option>
              <option value="pending">Pending</option>
              <option value="refunded">Refunded</option>
            </select>
            <span className="h-4 w-px bg-[#E7E9FF] dark:bg-[#2B2F55]" />
            <select
              className="bg-transparent text-sm outline-none"
              value={filters.method}
              onChange={(e) =>
                setFilters((f) => ({ ...f, method: e.target.value as any }))
              }
            >
              <option value="all">Method: Any</option>
              <option value="Stripe">Stripe</option>
              <option value="Paystack">Paystack</option>
              <option value="Flutterwave">Flutterwave</option>
              <option value="Razorpay">Razorpay</option>
              <option value="UPI">UPI</option>
            </select>
            <span className="h-4 w-px bg-[#E7E9FF] dark:bg-[#2B2F55]" />
            <select
              className="bg-transparent text-sm outline-none"
              value={filters.type}
              onChange={(e) =>
                setFilters((f) => ({ ...f, type: e.target.value as any }))
              }
            >
              <option value="all">Type: All</option>
              <option value="1:1">1:1</option>
              <option value="group">Group</option>
            </select>
            <span className="h-4 w-px bg-[#E7E9FF] dark:bg-[#2B2F55]" />
            <select
              className="bg-transparent text-sm outline-none"
              value={filters.range}
              onChange={(e) =>
                setFilters((f) => ({ ...f, range: e.target.value as any }))
              }
            >
              <option value="30d">Last 30d</option>
              <option value="90d">Last 90d</option>
              <option value="all">All time</option>
            </select>
            <span className="h-4 w-px bg-[#E7E9FF] dark:bg-[#2B2F55]" />
            <select
              className="bg-transparent text-sm outline-none"
              value={filters.sort}
              onChange={(e) =>
                setFilters((f) => ({ ...f, sort: e.target.value as any }))
              }
            >
              <option value="dateDesc">Sort: Date ↓</option>
              <option value="dateAsc">Sort: Date ↑</option>
              <option value="netDesc">Sort: Net ↓</option>
              <option value="netAsc">Sort: Net ↑</option>
            </select>
          </div>
        </div>

        {/* Content: cards (mobile) + table (md+) */}
        <div className="mt-4">
          {/* Cards small */}
          <div className="md:hidden grid grid-cols-1 gap-3">
            {paged.map((x) => (
              <div key={x.id} className={`${card} p-3`}>
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-xl grid place-items-center bg-[#EEF2FF] dark:bg-white/[0.08] border border-[#E7E9FF] dark:border-[#2B2F55]">
                        {x.type === "group" ? (
                          <Users size={14} />
                        ) : (
                          <User size={14} />
                        )}
                      </div>
                      <div className="font-semibold text-sm text-[#0F1536] dark:text-[#E7E9FF] truncate">
                        {x.title}
                      </div>
                    </div>
                    <div className="mt-1 text-[12px] text-[#5E66A6] dark:text-[#A7B0FF]/80">
                      with {x.mentee} · {fmtDay(x.dateISO)} {fmtTime(x.dateISO)}
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-1">
                      <span className={`${pill} !py-0.5`}>
                        <BadgeDollarSign size={14} /> {x.currency} {x.gross}
                      </span>
                      <span className={`${pill} !py-0.5`}>
                        <ArrowDownRight size={14} /> Fee {x.fee}
                      </span>
                      <span className={`${pill} !py-0.5`}>
                        <ArrowUpRight size={14} /> Net {x.net}
                      </span>
                      <span className={`${pill} !py-0.5`}>
                        <CreditCard size={14} /> {x.method}
                      </span>
                      <StatusChip status={x.status} />
                    </div>
                  </div>
                  <button
                    className={`${btnBase} ${btnGhost} px-2 py-1`}
                    onClick={() => setActionsFor(x.id)}
                    aria-label="More"
                  >
                    <MoreVertical size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Table md+ */}
          <div className="hidden md:block overflow-x-auto">
            <table className={`min-w-full ${card}`}>
              <thead>
                <tr className="text-left text-[12px] text-[#6B72B3] dark:text-[#A7B0FF]/80">
                  <th className="px-4 py-3">Session</th>
                  <th className="px-4 py-3">When</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Method</th>
                  <th className="px-4 py-3">Gross</th>
                  <th className="px-4 py-3">Fee</th>
                  <th className="px-4 py-3">Net</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E7E9FF] dark:divide-[#2B2F55]">
                {paged.map((x) => (
                  <tr key={x.id}>
                    <td className="px-4 py-3 text-sm">
                      <div className="font-semibold">{x.title}</div>
                      <div className="text-[12px] text-[#6B72B3] dark:text-[#A7B0FF]/80">
                        with {x.mentee}
                      </div>
                      {x.invoiceId && (
                        <div className="mt-1 inline-flex items-center gap-1 text-[11px]">
                          <Receipt size={12} /> {x.invoiceId}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <Clock size={14} className="inline mr-2" />
                      {fmtDay(x.dateISO)} · {fmtTime(x.dateISO)}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {x.type} · {x.durationMin}m
                    </td>
                    <td className="px-4 py-3 text-sm">{x.method}</td>
                    <td className="px-4 py-3 text-sm">
                      {x.currency} {x.gross.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {x.currency} {x.fee.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-sm font-semibold">
                      {x.currency} {x.net.toFixed(2)}
                    </td>
                    <td className="px-4 py-3">
                      <StatusChip status={x.status} />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        className={`${btnBase} ${btnGhost} px-2 py-1`}
                        onClick={() => setActionsFor(x.id)}
                      >
                        <MoreVertical size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="mt-3 flex items-center justify-between">
            <div className="text-[12px] text-[#6B72B3] dark:text-[#A7B0FF]/80">
              Page {page} / {totalPages} · {filtered.length} total
            </div>
            <div className="flex items-center gap-2">
              <button
                className={`${btnBase} ${btnGhost} px-2 py-1`}
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                <ChevronLeft size={16} />
              </button>
              <button
                className={`${btnBase} ${btnGhost} px-2 py-1`}
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Actions Modal */}
        {actionsFor && (
          <EarningActions
            earning={data.find((d) => d.id === actionsFor)!}
            onClose={() => setActionsFor(null)}
            onClear={() => {
              markCleared(actionsFor);
              setActionsFor(null);
            }}
            onRefund={() => {
              markRefunded(actionsFor);
              setActionsFor(null);
            }}
          />
        )}
      </div>
    </MentorAppLayout>
  );
}

function StatusChip({ status }: { status: TxStatus }) {
  const map: Record<TxStatus, string> = {
    cleared:
      "text-emerald-700 bg-emerald-50 border-emerald-100 dark:text-emerald-300/90 dark:bg-emerald-900/20 dark:border-emerald-900/30",
    pending:
      "text-amber-700 bg-amber-50 border-amber-100 dark:text-amber-300/90 dark:bg-amber-900/20 dark:border-amber-900/30",
    refunded:
      "text-rose-700 bg-rose-50 border-rose-100 dark:text-rose-300/90 dark:bg-rose-900/20 dark:border-rose-900/30",
  };
  return (
    <span
      className={`text-[11px] rounded-full px-2.5 py-0.5 border ${map[status]}`}
    >
      {status}
    </span>
  );
}

function EarningActions({
  earning,
  onClose,
  onClear,
  onRefund,
}: {
  earning: Earning;
  onClose: () => void;
  onClear: () => void;
  onRefund: () => void;
}) {
  React.useEffect(() => {
    const onEsc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, [onClose]);
  return (
    <div className="fixed inset-0 z-50" onClick={onClose}>
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
      <div
        className="relative mx-auto mt-24 w-full max-w-sm rounded-2xl border border-[#E7E9FF] dark:border-[#2B2F55] bg-white/95 dark:bg-[#0B0F2A]/95 p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-sm font-semibold">{earning.title}</div>
        <div className="mt-1 text-[12px] text-[#6B72B3] dark:text-[#A7B0FF]/80">
          Choose action
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <button className={`${btnBase} ${btnGhost}`} onClick={onClear}>
            <CheckCircle2 size={16} /> Mark cleared
          </button>
          <button className={`${btnBase} ${btnGhost}`} onClick={onRefund}>
            <XCircle size={16} /> Mark refunded
          </button>
        </div>
        <div className="mt-4 flex justify-end">
          <button className={`${btnBase} ${btnSolid}`} onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
