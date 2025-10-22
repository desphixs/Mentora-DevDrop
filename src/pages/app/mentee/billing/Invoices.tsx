import React from "react";
import MenteeAppLayout from "../MenteeAppLayout";
import {
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Download,
  FileText,
  CreditCard,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ExternalLink,
} from "lucide-react";

/* tokens */
const ringIndigo =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#6366F1]/40";
const card =
  "rounded-2xl border border-[#E7E9FF] dark:border-[#2B2F55] bg-white/90 dark:bg-white/[0.06] backdrop-blur";
const btnBase =
  "inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-semibold transition " +
  ringIndigo;
const btnGhost =
  "border border-[#D9DBFF] dark:border-[#30345D] text-[#1B1F3A] dark:text-[#E6E9FF] bg-white/70 dark:bg-white/[0.04] hover:bg-white/90 dark:hover:bg-white/[0.08]";
const btnSolid =
  "text-white bg-gradient-to-r from-[#4F46E5] via-[#6366F1] to-[#8B5CF6]";

type InvoiceStatus = "paid" | "unpaid" | "overdue" | "refunded";
type Invoice = {
  id: string;
  number: string;
  issuedAt: string; // ISO
  dueAt: string; // ISO
  amount: number;
  currency: "USD" | "NGN" | "EUR";
  status: InvoiceStatus;
  items: number;
  method: "card" | "bank";
  memo?: string;
};

function money(n: number, c: Invoice["currency"]) {
  const map = { USD: "en-US", NGN: "en-NG", EUR: "de-DE" } as const;
  return new Intl.NumberFormat(map[c], {
    style: "currency",
    currency: c,
    maximumFractionDigits: 2,
  }).format(n);
}
function d(s: string) {
  return new Date(s).toLocaleDateString([], {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

const DUMMY: Invoice[] = Array.from({ length: 37 }).map((_, i) => {
  const status: InvoiceStatus =
    i % 9 === 0
      ? "overdue"
      : i % 7 === 0
      ? "refunded"
      : i % 2
      ? "paid"
      : "unpaid";
  const c: Invoice["currency"] =
    i % 4 === 0 ? "NGN" : i % 3 === 0 ? "EUR" : "USD";
  const today = new Date();
  const issued = new Date(today.getTime() - (i + 2) * 86400000);
  const due = new Date(issued.getTime() + 10 * 86400000);
  return {
    id: "inv_" + (1000 + i),
    number: "INV-" + (2024000 + i),
    issuedAt: issued.toISOString(),
    dueAt: due.toISOString(),
    amount: 50 + (i % 5) * 25,
    currency: c,
    status,
    items: 1 + (i % 3),
    method: i % 2 ? "card" : "bank",
    memo: i % 5 === 0 ? "Includes session recording" : undefined,
  };
});

const StatusPill: React.FC<{ s: InvoiceStatus }> = ({ s }) => {
  const map = {
    paid: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900",
    unpaid:
      "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900",
    overdue:
      "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-900",
    refunded:
      "bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-900",
  } as const;
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg border text-[11px] ${map[s]}`}
    >
      {s === "paid" && <CheckCircle2 className="h-3.5 w-3.5" />}
      {s === "unpaid" && <Clock className="h-3.5 w-3.5" />}
      {s === "overdue" && <AlertTriangle className="h-3.5 w-3.5" />}
      {s === "refunded" && <CreditCard className="h-3.5 w-3.5" />}
      {s}
    </span>
  );
};

const ME_Invoices: React.FC = () => {
  const [q, setQ] = React.useState("");
  const [status, setStatus] = React.useState<"all" | InvoiceStatus>("all");
  const [method, setMethod] = React.useState<"all" | "card" | "bank">("all");
  const [currency, setCurrency] = React.useState<"all" | Invoice["currency"]>(
    "all"
  );
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);

  const filtered = React.useMemo(() => {
    const l = q.trim().toLowerCase();
    return DUMMY.filter((inv) => {
      if (status !== "all" && inv.status !== status) return false;
      if (method !== "all" && inv.method !== method) return false;
      if (currency !== "all" && inv.currency !== currency) return false;
      if (l) {
        const hay = `${inv.number} ${inv.id} ${inv.currency} ${inv.amount} ${
          inv.memo ?? ""
        }`.toLowerCase();
        if (!hay.includes(l)) return false;
      }
      return true;
    }).sort((a, b) => +new Date(b.issuedAt) - +new Date(a.issuedAt));
  }, [q, status, method, currency]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const rows = filtered.slice((page - 1) * pageSize, page * pageSize);

  React.useEffect(() => setPage(1), [q, status, method, currency, pageSize]);

  return (
    <MenteeAppLayout>
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        {/* Title */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold">Invoices</h1>
            <p className="text-sm text-[#5E66A6] dark:text-[#A7B0FF]/85">
              All charges for your mentee account.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button className={`${btnBase} ${btnGhost}`}>
              <Download className="h-4 w-4" />
              Export CSV
            </button>
          </div>
        </div>

        {/* Controls */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-12 gap-2">
          <div className="md:col-span-5">
            <div className={`flex items-center gap-2 ${card} h-11 px-3.5`}>
              <Search className="h-4 w-4 text-[#5F679A] dark:text-[#A7B0FF]" />
              <input
                className="bg-transparent outline-none text-sm w-full"
                placeholder="Search invoice #, memo, amount…"
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
            </div>
          </div>
          <div className="md:col-span-7">
            <div className="flex flex-wrap gap-2">
              <div
                className={`flex items-center gap-2 ${card} h-11 px-3 w-full sm:w-auto`}
              >
                <Filter className="h-4 w-4 text-[#5F679A] dark:text-[#A7B0FF]" />
                <select
                  className="bg-transparent text-sm outline-none"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                >
                  <option value="all">Status: All</option>
                  <option value="paid">Paid</option>
                  <option value="unpaid">Unpaid</option>
                  <option value="overdue">Overdue</option>
                  <option value="refunded">Refunded</option>
                </select>
                <span className="h-4 w-px bg-[#E7E9FF] dark:bg-[#2B2F55]" />
                <select
                  className="bg-transparent text-sm outline-none"
                  value={method}
                  onChange={(e) => setMethod(e.target.value as any)}
                >
                  <option value="all">Method: Any</option>
                  <option value="card">Card</option>
                  <option value="bank">Bank</option>
                </select>
                <span className="h-4 w-px bg-[#E7E9FF] dark:bg-[#2B2F55]" />
                <select
                  className="bg-transparent text-sm outline-none"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value as any)}
                >
                  <option value="all">Currency: Any</option>
                  <option value="USD">USD</option>
                  <option value="NGN">NGN</option>
                  <option value="EUR">EUR</option>
                </select>
                <span className="h-4 w-px bg-[#E7E9FF] dark:bg-[#2B2F55]" />
                <select
                  className="bg-transparent text-sm outline-none"
                  value={pageSize}
                  onChange={(e) => setPageSize(parseInt(e.target.value, 10))}
                >
                  {[10, 20, 50].map((n) => (
                    <option key={n} value={n}>
                      {n}/page
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Table md+, cards mobile */}
        <div className="mt-6 hidden md:block">
          <div className={`${card} overflow-x-auto`}>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[#6B72B3] dark:text-[#A7B0FF]/80">
                  <th className="px-4 py-3">Invoice</th>
                  <th className="px-4 py-3">Issued</th>
                  <th className="px-4 py-3">Due</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E7E9FF] dark:divide-[#2B2F55]">
                {rows.map((r) => (
                  <tr key={r.id}>
                    <td className="px-4 py-3">
                      <div className="font-semibold">{r.number}</div>
                      <div className="text-xs opacity-70">
                        {r.items} item(s) •{" "}
                        {r.method === "card" ? "Card" : "Bank"}
                      </div>
                    </td>
                    <td className="px-4 py-3">{d(r.issuedAt)}</td>
                    <td className="px-4 py-3">{d(r.dueAt)}</td>
                    <td className="px-4 py-3 font-semibold">
                      {money(r.amount, r.currency)}
                    </td>
                    <td className="px-4 py-3">
                      <StatusPill s={r.status} />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <RowMenu
                        onView={() => alert(`Viewing ${r.number}`)}
                        onPay={() => alert("Demo pay")}
                        onDownload={() => alert("Demo PDF")}
                        status={r.status}
                      />
                    </td>
                  </tr>
                ))}
                {rows.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-6 text-center text-[#6B72B3] dark:text-[#A7B0FF]/80"
                    >
                      No invoices match your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Cards mobile */}
        <div className="mt-6 grid md:hidden grid-cols-1 gap-3">
          {rows.map((r) => (
            <div key={r.id} className={`${card} p-4`}>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="text-sm font-semibold">{r.number}</div>
                  <div className="text-xs opacity-70">
                    {r.items} item(s) • {r.method === "card" ? "Card" : "Bank"}
                  </div>
                  <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                    <Info label="Issued" value={d(r.issuedAt)} />
                    <Info label="Due" value={d(r.dueAt)} />
                    <Info label="Amount" value={money(r.amount, r.currency)} />
                    <div>
                      <StatusPill s={r.status} />
                    </div>
                  </div>
                  {r.memo && (
                    <p className="mt-2 text-xs opacity-80">{r.memo}</p>
                  )}
                </div>
                <RowMenu
                  compact
                  onView={() => alert(`Viewing ${r.number}`)}
                  onPay={() => alert("Demo pay")}
                  onDownload={() => alert("Demo PDF")}
                  status={r.status}
                />
              </div>
            </div>
          ))}
          {rows.length === 0 && (
            <div className="text-center text-sm text-[#6B72B3] dark:text-[#A7B0FF]/80">
              No invoices match your filters.
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="mt-6 flex items-center justify-between">
          <span className="text-xs text-[#6B72B3] dark:text-[#A7B0FF]/80">
            Page {page} / {totalPages} • Showing {rows.length} of{" "}
            {filtered.length}
          </span>
          <div className="flex items-center gap-2">
            <button
              className={`${btnBase} ${btnGhost}`}
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              <ChevronLeft className="h-4 w-4" /> Prev
            </button>
            <button
              className={`${btnBase} ${btnGhost}`}
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Next <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </MenteeAppLayout>
  );
};

/* bits */
function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[#E7E9FF] dark:border-[#2B2F55] p-2">
      <div className="text-[11px] opacity-70">{label}</div>
      <div className="font-semibold">{value}</div>
    </div>
  );
}

const RowMenu: React.FC<{
  status: InvoiceStatus;
  onView: () => void;
  onPay: () => void;
  onDownload: () => void;
  compact?: boolean;
}> = ({ status, onView, onPay, onDownload, compact }) => {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement | null>(null);
  React.useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);
  return (
    <div className="relative" ref={ref}>
      <button
        className={`${btnBase} ${btnGhost} ${compact ? "px-2 py-1" : ""}`}
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <MoreVertical className="h-4 w-4" />
      </button>
      <div
        role="menu"
        className={`absolute right-0 mt-2 w-48  ${card} p-1 z-20 transition ${
          open
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-1 pointer-events-none"
        }`}
      >
        <MenuItem
          icon={<FileText size={14} />}
          label="View invoice"
          onClick={() => {
            onView();
            setOpen(false);
          }}
        />
        <MenuItem
          icon={<Download size={14} />}
          label="Download PDF"
          onClick={() => {
            onDownload();
            setOpen(false);
          }}
        />
        {status !== "paid" && status !== "refunded" && (
          <MenuItem
            icon={<CreditCard size={14} />}
            label="Pay now"
            onClick={() => {
              onPay();
              setOpen(false);
            }}
          />
        )}
        <MenuItem
          icon={<ExternalLink size={14} />}
          label="Open in portal"
          onClick={() => {
            alert("Demo portal");
            setOpen(false);
          }}
        />
      </div>
    </div>
  );
};

function MenuItem({
  icon,
  label,
  onClick,
  danger,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-3 py-2 rounded-lg hover:bg-white/90 dark:hover:bg-white/[0.1] inline-flex items-center gap-2 ${
        danger ? "text-rose-600" : ""
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

export default ME_Invoices;
