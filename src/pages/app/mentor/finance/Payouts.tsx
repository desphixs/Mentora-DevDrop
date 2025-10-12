import React from "react";
import MentorAppLayout from "../MentorAppLayout";
import {
  Search,
  Filter,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Receipt,
  Download,
  Mail,
  CreditCard,
  CheckCircle2,
  XCircle,
  Clock,
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

type InvoiceStatus = "paid" | "due" | "overdue" | "refunded";
type Invoice = {
  id: string; // INV-XXXX
  dateISO: string;
  dueISO: string;
  title: string;
  mentee: string;
  currency: "USD" | "NGN" | "INR" | "EUR";
  amount: number;
  method: "Stripe" | "Paystack" | "Flutterwave" | "Razorpay" | "UPI";
  status: InvoiceStatus;
  email: string;
};

const daysAgoISO = (d: number) =>
  new Date(Date.now() - d * 864e5).toISOString();
const daysAfterISO = (d: number) =>
  new Date(Date.now() + d * 864e5).toISOString();

const DUMMY: Invoice[] = [
  {
    id: "INV-1008",
    dateISO: daysAgoISO(2),
    dueISO: daysAfterISO(12),
    title: "Next.js perf",
    mentee: "Tunde",
    currency: "USD",
    amount: 25,
    method: "Stripe",
    status: "paid",
    email: "tunde@example.com",
  },
  {
    id: "INV-1007",
    dateISO: daysAgoISO(6),
    dueISO: daysAfterISO(10),
    title: "Observability",
    mentee: "Riya",
    currency: "USD",
    amount: 40,
    method: "Stripe",
    status: "paid",
    email: "riya@example.com",
  },
  {
    id: "INV-1006",
    dateISO: daysAgoISO(8),
    dueISO: daysAfterISO(8),
    title: "Design Crit",
    mentee: "Design Roundtable",
    currency: "USD",
    amount: 120,
    method: "Razorpay",
    status: "due",
    email: "team@example.com",
  },
  {
    id: "INV-1005",
    dateISO: daysAgoISO(14),
    dueISO: daysAfterISO(1),
    title: "Career Planning",
    mentee: "Kelechi",
    currency: "USD",
    amount: 20,
    method: "Paystack",
    status: "paid",
    email: "kelechi@example.com",
  },
  {
    id: "INV-1004",
    dateISO: daysAgoISO(20),
    dueISO: daysAfterISO(-5),
    title: "Growth Strategy",
    mentee: "Mason",
    currency: "USD",
    amount: 30,
    method: "Stripe",
    status: "refunded",
    email: "mason@example.com",
  },
  {
    id: "INV-1003",
    dateISO: daysAgoISO(26),
    dueISO: daysAfterISO(-2),
    title: "Mock Interview",
    mentee: "Arjun",
    currency: "USD",
    amount: 45,
    method: "UPI",
    status: "overdue",
    email: "arjun@example.com",
  },
  {
    id: "INV-1002",
    dateISO: daysAgoISO(33),
    dueISO: daysAfterISO(3),
    title: "Campaign Audit",
    mentee: "Noah",
    currency: "USD",
    amount: 20,
    method: "Flutterwave",
    status: "paid",
    email: "noah@example.com",
  },
  {
    id: "INV-1001",
    dateISO: daysAgoISO(45),
    dueISO: daysAfterISO(-10),
    title: "ML Roadmap",
    mentee: "Olivia",
    currency: "USD",
    amount: 50,
    method: "Stripe",
    status: "paid",
    email: "olivia@example.com",
  },
];

type Filters = {
  q: string;
  status: "all" | InvoiceStatus;
  method: "all" | Invoice["method"];
  sort: "dateDesc" | "dateAsc" | "amountDesc" | "amountAsc";
};

const perPage = 8;

const fmtDay = (iso: string) =>
  new Date(iso).toLocaleDateString([], {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

function applyFilters(list: Invoice[], f: Filters) {
  let out = list.filter((x) => {
    if (f.status !== "all" && x.status !== f.status) return false;
    if (f.method !== "all" && x.method !== f.method) return false;
    if (f.q.trim()) {
      const q = f.q.toLowerCase();
      const hay = `${x.id} ${x.title} ${x.mentee} ${x.email}`.toLowerCase();
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

export default function Invoices() {
  const [rows, setRows] = React.useState<Invoice[]>(
    () =>
      JSON.parse(localStorage.getItem("mentora.finance.invoices") || "null") ??
      DUMMY
  );
  React.useEffect(
    () =>
      localStorage.setItem("mentora.finance.invoices", JSON.stringify(rows)),
    [rows]
  );

  const [filters, setFilters] = React.useState<Filters>({
    q: "",
    status: "all",
    method: "all",
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
  const markRefunded = (id: string) =>
    setRows((p) =>
      p.map((r) => (r.id === id ? { ...r, status: "refunded" } : r))
    );

  const exportOne = (inv: Invoice) => {
    const text = `Invoice ${inv.id}\nTitle: ${inv.title}\nMentee: ${
      inv.mentee
    }\nDate: ${fmtDay(inv.dateISO)}\nDue: ${fmtDay(inv.dueISO)}\nAmount: ${
      inv.currency
    } ${inv.amount}\nMethod: ${inv.method}\nStatus: ${inv.status}\n`;
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${inv.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <MentorAppLayout>
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-[#0F132E] dark:text-[#E9ECFF]">
              Invoices
            </h1>
            <p className="text-sm text-[#5E66A6] dark:text-[#A7B0FF]/85">
              Manage billing documents and statuses.
            </p>
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
              placeholder="Search id, mentee, title…"
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
              value={filters.status}
              onChange={(e) =>
                setFilters((f) => ({ ...f, status: e.target.value as any }))
              }
            >
              <option value="all">Status: All</option>
              <option value="paid">Paid</option>
              <option value="due">Due</option>
              <option value="overdue">Overdue</option>
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
          {/* Cards (mobile) */}
          <div className="md:hidden grid grid-cols-1 gap-3">
            {paged.map((r) => (
              <div key={r.id} className={`${card} p-3`}>
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-xl grid place-items-center bg-[#EEF2FF] dark:bg-white/[0.08] border border-[#E7E9FF] dark:border-[#2B2F55]">
                        <Receipt size={14} />
                      </div>
                      <div className="font-semibold text-sm truncate">
                        {r.id} — {r.title}
                      </div>
                    </div>
                    <div className="mt-1 text-[12px] text-[#5E66A6] dark:text-[#A7B0FF]/80">
                      {r.mentee} · {fmtDay(r.dateISO)}
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-1">
                      <span className={`${pill} !py-0.5`}>
                        <CreditCard size={14} /> {r.method}
                      </span>
                      <StatusChip status={r.status} />
                      <span className={`${pill} !py-0.5`}>
                        {r.currency} {r.amount}
                      </span>
                      <span className={`${pill} !py-0.5`}>
                        <Clock size={14} /> due {fmtDay(r.dueISO)}
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

          {/* Table (md+) */}
          <div className="hidden md:block overflow-x-auto">
            <table className={`min-w-full ${card}`}>
              <thead>
                <tr className="text-left text-[12px] text-[#6B72B3] dark:text-[#A7B0FF]/80">
                  <th className="px-4 py-3">Invoice</th>
                  <th className="px-4 py-3">Mentee</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Due</th>
                  <th className="px-4 py-3">Method</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E7E9FF] dark:divide-[#2B2F55]">
                {paged.map((r) => (
                  <tr key={r.id}>
                    <td className="px-4 py-3 text-sm font-semibold">
                      {r.id}
                      <div className="text-[12px] text-[#6B72B3] dark:text-[#A7B0FF]/80">
                        {r.title}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {r.mentee}
                      <div className="text-[12px] text-[#6B72B3] dark:text-[#A7B0FF]/80">
                        {r.email}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">{fmtDay(r.dateISO)}</td>
                    <td className="px-4 py-3 text-sm">{fmtDay(r.dueISO)}</td>
                    <td className="px-4 py-3 text-sm">{r.method}</td>
                    <td className="px-4 py-3 text-sm">
                      {r.currency} {r.amount.toFixed(2)}
                    </td>
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
          <InvoiceActions
            invoice={rows.find((x) => x.id === actionsFor)!}
            onClose={() => setActionsFor(null)}
            onPaid={() => {
              markPaid(actionsFor!);
              setActionsFor(null);
            }}
            onRefund={() => {
              markRefunded(actionsFor!);
              setActionsFor(null);
            }}
            onExport={(inv) => exportOne(inv)}
            onSend={() => {
              alert("Invoice email sent.");
              setActionsFor(null);
            }}
          />
        )}
      </div>
    </MentorAppLayout>
  );
}

function StatusChip({ status }: { status: InvoiceStatus }) {
  const map: Record<InvoiceStatus, string> = {
    paid: "text-emerald-700 bg-emerald-50 border-emerald-100 dark:text-emerald-300/90 dark:bg-emerald-900/20 dark:border-emerald-900/30",
    due: "text-sky-700 bg-sky-50 border-sky-100 dark:text-sky-300/90 dark:bg-sky-900/20 dark:border-sky-900/30",
    overdue:
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

function InvoiceActions({
  invoice,
  onClose,
  onPaid,
  onRefund,
  onExport,
  onSend,
}: {
  invoice: Invoice;
  onClose: () => void;
  onPaid: () => void;
  onRefund: () => void;
  onExport: (i: Invoice) => void;
  onSend: () => void;
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
        <div className="text-sm font-semibold">
          {invoice.id} — {invoice.title}
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <button className={`${btnBase} ${btnGhost}`} onClick={onPaid}>
            <CheckCircle2 size={16} /> Mark paid
          </button>
          <button className={`${btnBase} ${btnGhost}`} onClick={onRefund}>
            <XCircle size={16} /> Refund
          </button>
          <button
            className={`${btnBase} ${btnGhost}`}
            onClick={() => onExport(invoice)}
          >
            <Download size={16} /> Export
          </button>
          <button className={`${btnBase} ${btnGhost}`} onClick={onSend}>
            <Mail size={16} /> Send
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
