import React from "react";
import MenteeAppLayout from "../MenteeAppLayout";
import {
  Search,
  Filter,
  Plus,
  Minus,
  ChevronLeft,
  ChevronRight,
  Gift,
  ArrowDownRight,
  ArrowUpRight,
  Wallet,
  Info,
  MoreVertical,
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

type CreditType = "earn" | "spend";
type CreditStatus = "settled" | "pending";
type Entry = {
  id: string;
  when: string; // ISO
  type: CreditType;
  amount: number;
  currency: "USD" | "NGN";
  source: "referral" | "promo" | "refund" | "purchase";
  status: CreditStatus;
  note?: string;
};

function money(n: number, c: Entry["currency"]) {
  return new Intl.NumberFormat(c === "USD" ? "en-US" : "en-NG", {
    style: "currency",
    currency: c,
    maximumFractionDigits: 2,
  }).format(n);
}
function d(s: string) {
  return new Date(s).toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
function isoAgo(days: number) {
  const dt = new Date();
  dt.setDate(dt.getDate() - days);
  return dt.toISOString();
}

const DUMMY: Entry[] = Array.from({ length: 46 }).map((_, i) => {
  const earn = i % 3 !== 0;
  const currency: Entry["currency"] = i % 4 === 0 ? "NGN" : "USD";
  return {
    id: "cr_" + (10000 + i),
    when: isoAgo(i),
    type: earn ? "earn" : "spend",
    amount: earn ? 5 + (i % 4) * 2 : 3 + (i % 3) * 1.5,
    currency,
    source: earn
      ? i % 5 === 0
        ? "promo"
        : i % 2
        ? "referral"
        : "refund"
      : "purchase",
    status: i % 7 === 0 ? "pending" : "settled",
    note: i % 6 === 0 ? "Promo bonus applied" : undefined,
  };
});

const ME_Credits: React.FC = () => {
  const [q, setQ] = React.useState("");
  const [type, setType] = React.useState<"all" | CreditType>("all");
  const [source, setSource] = React.useState<"all" | Entry["source"]>("all");
  const [status, setStatus] = React.useState<"all" | CreditStatus>("all");
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);

  const balance = React.useMemo(() => {
    const total = DUMMY.reduce(
      (acc, e) =>
        acc +
        (e.type === "earn" ? e.amount : -e.amount) *
          (e.currency === "USD" ? 1 : 0.0012) /* fake fx */,
      0
    );
    return Math.max(0, total);
  }, []);

  const filtered = React.useMemo(() => {
    const l = q.trim().toLowerCase();
    return DUMMY.filter((e) => {
      if (type !== "all" && e.type !== type) return false;
      if (source !== "all" && e.source !== source) return false;
      if (status !== "all" && e.status !== status) return false;
      if (l) {
        const hay = `${e.id} ${e.type} ${e.source} ${
          e.note ?? ""
        }`.toLowerCase();
        if (!hay.includes(l)) return false;
      }
      return true;
    }).sort((a, b) => +new Date(b.when) - +new Date(a.when));
  }, [q, type, source, status]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const rows = filtered.slice((page - 1) * pageSize, page * pageSize);

  React.useEffect(() => setPage(1), [q, type, source, status, pageSize]);

  return (
    <MenteeAppLayout>
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        {/* Header & balance */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
          <div className="lg:col-span-8">
            <h1 className="text-2xl font-bold">Credits</h1>
            <p className="text-sm text-[#5E66A6] dark:text-[#A7B0FF]/85">
              Earned and spent credits for bookings and perks.
            </p>
          </div>
          <div className="lg:col-span-4">
            <div className={`${card} p-4 flex items-center justify-between`}>
              <div className="flex items-center gap-2">
                <Wallet className="h-5 w-5 text-indigo-500" />
                <div>
                  <div className="text-sm font-semibold">Available balance</div>
                  <div className="text-xs opacity-70">
                    USD equivalent (demo fx)
                  </div>
                </div>
              </div>
              <div className="text-xl font-bold">${balance.toFixed(2)}</div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-12 gap-2">
          <div className="md:col-span-5">
            <div className={`flex items-center gap-2 ${card} h-11 px-3.5`}>
              <Search className="h-4 w-4 text-[#5F679A] dark:text-[#A7B0FF]" />
              <input
                className="bg-transparent outline-none text-sm w-full"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search id, note, source…"
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
                  value={type}
                  onChange={(e) => setType(e.target.value as any)}
                >
                  <option value="all">Type: All</option>
                  <option value="earn">Earned</option>
                  <option value="spend">Spent</option>
                </select>
                <span className="h-4 w-px bg-[#E7E9FF] dark:bg-[#2B2F55]" />
                <select
                  className="bg-transparent text-sm outline-none"
                  value={source}
                  onChange={(e) => setSource(e.target.value as any)}
                >
                  <option value="all">Source: Any</option>
                  <option value="referral">Referral</option>
                  <option value="promo">Promo</option>
                  <option value="refund">Refund</option>
                  <option value="purchase">Purchase</option>
                </select>
                <span className="h-4 w-px bg-[#E7E9FF] dark:bg-[#2B2F55]" />
                <select
                  className="bg-transparent text-sm outline-none"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                >
                  <option value="all">Status: All</option>
                  <option value="settled">Settled</option>
                  <option value="pending">Pending</option>
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
                  <th className="px-4 py-3">Entry</th>
                  <th className="px-4 py-3">When</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Source</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E7E9FF] dark:divide-[#2B2F55]">
                {rows.map((e) => (
                  <tr key={e.id}>
                    <td className="px-4 py-3">
                      <div className="font-semibold inline-flex items-center gap-2">
                        {e.type === "earn" ? (
                          <ArrowDownRight className="h-4 w-4 text-emerald-500" />
                        ) : (
                          <ArrowUpRight className="h-4 w-4 text-rose-500" />
                        )}
                        {e.id}
                      </div>
                      <div className="text-xs opacity-70">{e.note ?? "—"}</div>
                    </td>
                    <td className="px-4 py-3">{d(e.when)}</td>
                    <td
                      className={`px-4 py-3 font-semibold ${
                        e.type === "earn" ? "text-emerald-600" : "text-rose-600"
                      }`}
                    >
                      {e.type === "earn" ? "+" : "-"}
                      {money(e.amount, e.currency)}
                    </td>
                    <td className="px-4 py-3 capitalize">{e.source}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg border text-[11px] ${
                          e.status === "settled"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900"
                            : "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900"
                        }`}
                      >
                        {e.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <RowMenu />
                    </td>
                  </tr>
                ))}
                {rows.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-6 text-center opacity-70"
                    >
                      No credits match your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-6 grid md:hidden grid-cols-1 gap-3">
          {rows.map((e) => (
            <div key={e.id} className={`${card} p-4`}>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="text-sm font-semibold inline-flex items-center gap-2">
                    {e.type === "earn" ? (
                      <Plus className="h-4 w-4 text-emerald-500" />
                    ) : (
                      <Minus className="h-4 w-4 text-rose-500" />
                    )}
                    {e.id}
                  </div>
                  <div className="text-xs opacity-70">{e.note ?? "—"}</div>
                  <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                    <InfoRow label="When" value={d(e.when)} />
                    <InfoRow label="Source" value={e.source} />
                    <InfoRow
                      label="Amount"
                      value={`${e.type === "earn" ? "+" : "-"}${money(
                        e.amount,
                        e.currency
                      )}`}
                    />
                    <div>
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg border text-[11px] ${
                          e.status === "settled"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900"
                            : "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900"
                        }`}
                      >
                        {e.status}
                      </span>
                    </div>
                  </div>
                </div>
                <RowMenu compact />
              </div>
            </div>
          ))}
          {rows.length === 0 && (
            <div className="text-sm opacity-70">
              No credits match your filters.
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="mt-6 flex items-center justify-between">
          <span className="text-xs opacity-70">
            Page {page} / {totalPages} • Showing {rows.length} of{" "}
            {filtered.length}
          </span>
          <div className="flex items-center gap-2">
            <button
              className={`${btnBase} ${btnGhost}`}
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              <ChevronLeft className="h-4 w-4" />
              Prev
            </button>
            <button
              className={`${btnBase} ${btnGhost}`}
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </MenteeAppLayout>
  );
};

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[#E7E9FF] dark:border-[#2B2F55] p-2">
      <div className="text-[11px] opacity-70 inline-flex items-center gap-1">
        <Info className="h-3.5 w-3.5" />
        {label}
      </div>
      <div className="font-semibold">{value}</div>
    </div>
  );
}

const RowMenu: React.FC<{ compact?: boolean }> = ({ compact }) => {
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
        className={`absolute right-0 mt-2 w-48 ${card} p-1 z-20 transition ${
          open
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-1 pointer-events-none"
        }`}
      >
        <MenuItem
          icon={<Gift size={14} />}
          label="Redeem promo code"
          onClick={() => {
            alert("Demo redeem");
            setOpen(false);
          }}
        />
        <MenuItem
          icon={<Wallet size={14} />}
          label="Convert credits"
          onClick={() => {
            alert("Demo convert");
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
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/90 dark:hover:bg-white/[0.1] inline-flex items-center gap-2"
    >
      {icon}
      {label}
    </button>
  );
}

export default ME_Credits;
