import React from "react";
import MentorAppLayout from "../MentorAppLayout";
import {
  Search,
  Filter,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Banknote,
  CalendarDays,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Download,
} from "lucide-react";

const ringIndigo =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#6366F1]/40";
const card =
  "rounded-2xl border border-[#E7E9FF] dark:border-[#2B2F55] bg-white/80 dark:bg-white/[0.05] backdrop-blur";
const btnBase =
  "inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-semibold transition " +
  ringIndigo;
const btnSolid =
  "text-white bg-gradient-to-r from-[#4F46E5] via-[#6366F1] to-[#8B5CF6]";
const btnGhost =
  "border border-[#D9DBFF] dark:border-[#30345D] text-[#1B1F3A] dark:text-[#E6E9FF] bg-white/70 dark:bg-white/[0.05]";
const pill =
  "inline-flex items-center gap-2 rounded-full border border-[#E7E9FF] dark:border-[#2B2F55] bg-white/70 dark:bg-white/[0.05] px-3 py-1 text-[11px] font-semibold";

type PayoutStatus = "paid" | "pending" | "failed";
type Method = "Bank Transfer" | "Stripe Connect";
type Payout = {
  id: string; // PO-XXXX
  dateISO: string;
  method: Method;
  currency: "USD" | "NGN" | "INR" | "EUR";
  amount: number;
  txCount: number;
  status: PayoutStatus;
  reference: string;
};

const daysAgoISO = (d: number) =>
  new Date(Date.now() - d * 864e5).toISOString();
const DUMMY: Payout[] = [
  {
    id: "PO-2006",
    dateISO: daysAgoISO(2),
    method: "Stripe Connect",
    currency: "USD",
    amount: 160.8,
    txCount: 4,
    status: "paid",
    reference: "stripe_trf_88a",
  },
  {
    id: "PO-2005",
    dateISO: daysAgoISO(8),
    method: "Bank Transfer",
    currency: "USD",
    amount: 110.4,
    txCount: 2,
    status: "pending",
    reference: "bank_ref_882",
  },
  {
    id: "PO-2004",
    dateISO: daysAgoISO(15),
    method: "Stripe Connect",
    currency: "USD",
    amount: 41.4,
    txCount: 1,
    status: "paid",
    reference: "stripe_trf_77z",
  },
  {
    id: "PO-2003",
    dateISO: daysAgoISO(30),
    method: "Bank Transfer",
    currency: "USD",
    amount: 27.6,
    txCount: 1,
    status: "failed",
    reference: "bank_ref_871",
  },
  {
    id: "PO-2002",
    dateISO: daysAgoISO(45),
    method: "Stripe Connect",
    currency: "USD",
    amount: 165.6,
    txCount: 3,
    status: "paid",
    reference: "stripe_trf_66y",
  },
  {
    id: "PO-2001",
    dateISO: daysAgoISO(60),
    method: "Bank Transfer",
    currency: "USD",
    amount: 46.0,
    txCount: 1,
    status: "paid",
    reference: "bank_ref_860",
  },
];

type Filters = {
  q: string;
  method: "all" | Method;
  status: "all" | PayoutStatus;
  sort: "dateDesc" | "dateAsc" | "amountDesc" | "amountAsc";
};

const perPage = 6;
const fmtDay = (iso: string) =>
  new Date(iso).toLocaleDateString([], {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

function applyFilters(list: Payout[], f: Filters) {
  let out = list.filter((x) => {
    if (f.method !== "all" && x.method !== f.method) return false;
    if (f.status !== "all" && x.status !== f.status) return false;
    if (f.q.trim()) {
      const q = f.q.toLowerCase();
      const hay = `${x.id} ${x.reference}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
  if (f.sort === "dateDesc")
    out.sort((a, b) => +new Date(b.dateISO) - +new Date(a.dateISO));
  if (f.sort === "dateAsc")
    out.sort((a, b) => +new Date(a.dateISO) - +new Date(b.dateISO));
  if (f.sort === "amountDesc") out.sort((a, b) => b.amount - a.amount);
  if (f.sort === "amountAsc") out.sort((a, b) => a.amount - b.amount);
  return out;
}

export default function Payouts() {
  const [rows, setRows] = React.useState<Payout[]>(
    () =>
      JSON.parse(localStorage.getItem("mentora.finance.payouts") || "null") ??
      DUMMY
  );
  React.useEffect(
    () => localStorage.setItem("mentora.finance.payouts", JSON.stringify(rows)),
    [rows]
  );

  const [filters, setFilters] = React.useState<Filters>({
    q: "",
    method: "all",
    status: "all",
    sort: "dateDesc",
  });

  const [page, setPage] = React.useState(1);
  const filtered = React.useMemo(
    () => applyFilters(rows, filters),
    [rows, filters]
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paged = React.useMemo(
    () => filtered.slice((page - 1) * perPage, page * perPage),
    [filtered, page]
  );
  React.useEffect(() => setPage(1), [filters]);

  const [actionsFor, setActionsFor] = React.useState<string | null>(null);
  const markPaid = (id: string) =>
    setRows((p) => p.map((r) => (r.id === id ? { ...r, status: "paid" } : r)));
  const retry = (id: string) => {
    alert(`Retry initiated for ${id}`);
  };
  const exportOne = (id: string) => {
    const r = rows.find((x) => x.id === id)!;
    const text = `Payout ${r.id}\nDate: ${fmtDay(r.dateISO)}\nMethod: ${
      r.method
    }\nAmount: ${r.currency} ${r.amount}\nTransactions: ${
      r.txCount
    }\nReference: ${r.reference}\nStatus: ${r.status}`;
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${r.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const paidSum = filtered
    .filter((x) => x.status === "paid")
    .reduce((s, x) => s + x.amount, 0);
  const pendSum = filtered
    .filter((x) => x.status === "pending")
    .reduce((s, x) => s + x.amount, 0);

  return (
    <MentorAppLayout>
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-[#0F132E] dark:text-[#E9ECFF]">
              Payouts
            </h1>
            <p className="text-sm text-[#5E66A6] dark:text-[#A7B0FF]/85">
              Batch transfers to your bank or Stripe balance.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className={`${pill}`}>
              <CheckCircle2 size={14} /> Paid ${paidSum.toFixed(2)}
            </span>
            <span className={`${pill}`}>
              <RefreshCw size={14} /> Pending ${pendSum.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Filters */}
        <div className="mt-4 flex flex-wrap gap-2">
          <div
            className={`flex items-center gap-2 ${card} h-11 px-3.5 flex-1 min-w-[220px]`}
          >
            <Search size={16} />
            <input
              className="bg-transparent outline-none text-sm w-full"
              placeholder="Search id/reference…"
              value={filters.q}
              onChange={(e) => setFilters((f) => ({ ...f, q: e.target.value }))}
            />
          </div>
          <div
            className={`flex items-center gap-2 ${card} h-11 px-3 flex-wrap`}
          >
            <Filter size={16} />
            <select
              className="bg-transparent text-sm outline-none"
              value={filters.method}
              onChange={(e) =>
                setFilters((f) => ({ ...f, method: e.target.value as any }))
              }
            >
              <option value="all">Method: Any</option>
              <option value="Stripe Connect">Stripe Connect</option>
              <option value="Bank Transfer">Bank Transfer</option>
            </select>
            <span className="h-4 w-px bg-[#E7E9FF] dark:bg-[#2B2F55]" />
            <select
              className="bg-transparent text-sm outline-none"
              value={filters.status}
              onChange={(e) =>
                setFilters((f) => ({ ...f, status: e.target.value as any }))
              }
            >
              <option value="all">Status: All</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
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
              <option value="amountDesc">Sort: Amount ↓</option>
              <option value="amountAsc">Sort: Amount ↑</option>
            </select>
          </div>
        </div>

        {/* Content */}
        <div className="mt-4">
          {/* Cards small */}
          <div className="md:hidden grid grid-cols-1 gap-3">
            {paged.map((r) => (
              <div key={r.id} className={`${card} p-3`}>
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-xl grid place-items-center bg-[#EEF2FF] dark:bg-white/[0.08] border border-[#E7E9FF] dark:border-[#2B2F55]">
                        <Banknote size={14} />
                      </div>
                      <div className="font-semibold text-sm truncate">
                        {r.id}
                      </div>
                    </div>
                    <div className="mt-1 text-[12px] text-[#5E66A6] dark:text-[#A7B0FF]/80">
                      {r.method} · {fmtDay(r.dateISO)} · {r.txCount} txns
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-1">
                      <span className={`${pill} !py-0.5`}>
                        {r.currency} {r.amount.toFixed(2)}
                      </span>
                      <StatusChip status={r.status} />
                      <span className={`${pill} !py-0.5`}>
                        <CalendarDays size={14} /> {r.reference}
                      </span>
                    </div>
                  </div>
                  <button
                    className={`${btnBase} ${btnGhost} px-2 py-1`}
                    onClick={() => setActionsFor(r.id)}
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
                  <th className="px-4 py-3">Payout</th>
                  <th className="px-4 py-3">Method</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Txns</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Reference</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E7E9FF] dark:divide-[#2B2F55]">
                {paged.map((r) => (
                  <tr key={r.id}>
                    <td className="px-4 py-3 text-sm font-semibold">{r.id}</td>
                    <td className="px-4 py-3 text-sm">{r.method}</td>
                    <td className="px-4 py-3 text-sm">{fmtDay(r.dateISO)}</td>
                    <td className="px-4 py-3 text-sm">{r.txCount}</td>
                    <td className="px-4 py-3 text-sm">
                      {r.currency} {r.amount.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-sm">{r.reference}</td>
                    <td className="px-4 py-3">
                      <StatusChip status={r.status} />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        className={`${btnBase} ${btnGhost} px-2 py-1`}
                        onClick={() => setActionsFor(r.id)}
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

        {/* Actions modal */}
        {actionsFor && (
          <PayoutActions
            payout={rows.find((x) => x.id === actionsFor)!}
            onClose={() => setActionsFor(null)}
            onPaid={() => {
              markPaid(actionsFor!);
              setActionsFor(null);
            }}
            onRetry={() => {
              retry(actionsFor!);
              setActionsFor(null);
            }}
            onExport={() => {
              exportOne(actionsFor!);
              setActionsFor(null);
            }}
          />
        )}
      </div>
    </MentorAppLayout>
  );
}

function StatusChip({ status }: { status: PayoutStatus }) {
  const map: Record<PayoutStatus, string> = {
    paid: "text-emerald-700 bg-emerald-50 border-emerald-100 dark:text-emerald-300/90 dark:bg-emerald-900/20 dark:border-emerald-900/30",
    pending:
      "text-amber-700 bg-amber-50 border-amber-100 dark:text-amber-300/90 dark:bg-amber-900/20 dark:border-amber-900/30",
    failed:
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

function PayoutActions({
  payout,
  onClose,
  onPaid,
  onRetry,
  onExport,
}: {
  payout: Payout;
  onClose: () => void;
  onPaid: () => void;
  onRetry: () => void;
  onExport: () => void;
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
        <div className="text-sm font-semibold">{payout.id}</div>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <button className={`${btnBase} ${btnGhost}`} onClick={onPaid}>
            <CheckCircle2 size={16} /> Mark paid
          </button>
          <button className={`${btnBase} ${btnGhost}`} onClick={onRetry}>
            <RefreshCw size={16} /> Retry
          </button>
          <button className={`${btnBase} ${btnGhost}`} onClick={onExport}>
            <Download size={16} /> Export
          </button>
          <button className={`${btnBase} ${btnGhost}`} onClick={onClose}>
            <XCircle size={16} /> Close
          </button>
        </div>
      </div>
    </div>
  );
}
