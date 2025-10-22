import React from "react";
import MenteeAppLayout from "../MenteeAppLayout";
import {
  Search,
  Filter,
  MoreVertical,
  Pause,
  Play,
  XCircle,
  BadgeCheck,
  CalendarClock,
  CreditCard,
  ChevronLeft,
  ChevronRight,
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

type SubStatus = "active" | "trialing" | "paused" | "canceled" | "past_due";
type Sub = {
  id: string;
  plan: string;
  price: string; // e.g. "$29/mo"
  seats: number;
  startedAt: string; // ISO
  renewsAt?: string; // ISO
  status: SubStatus;
  methodTail?: string; // e.g. "Visa •••• 4242"
};

function isoIn(days: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString();
}
function d(s?: string) {
  return s
    ? new Date(s).toLocaleDateString([], {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "—";
}

const DUMMY: Sub[] = [
  {
    id: "sub_1",
    plan: "Mentora Plus",
    price: "$19/mo",
    seats: 1,
    startedAt: isoIn(-120),
    renewsAt: isoIn(10),
    status: "active",
    methodTail: "Visa •••• 4242",
  },
  {
    id: "sub_2",
    plan: "Team Plan",
    price: "$49/mo",
    seats: 3,
    startedAt: isoIn(-40),
    renewsAt: isoIn(20),
    status: "trialing",
    methodTail: "Mastercard •••• 4444",
  },
  {
    id: "sub_3",
    plan: "Recording Add-on",
    price: "$5/mo",
    seats: 1,
    startedAt: isoIn(-300),
    status: "canceled",
    methodTail: "Visa •••• 4242",
  },
  {
    id: "sub_4",
    plan: "Priority Support",
    price: "$9/mo",
    seats: 1,
    startedAt: isoIn(-5),
    renewsAt: isoIn(-1),
    status: "past_due",
    methodTail: "Visa •••• 4242",
  },
  {
    id: "sub_5",
    plan: "Pause Demo",
    price: "$12/mo",
    seats: 1,
    startedAt: isoIn(-80),
    renewsAt: isoIn(15),
    status: "paused",
    methodTail: "GTBank •••• 1021",
  },
];

const Pill: React.FC<{ s: SubStatus }> = ({ s }) => {
  const map = {
    active:
      "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900",
    trialing:
      "bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-900",
    paused:
      "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900",
    canceled:
      "bg-zinc-100 text-zinc-700 border-zinc-200 dark:bg-zinc-900/40 dark:text-zinc-300 dark:border-zinc-800",
    past_due:
      "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-900",
  } as const;
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg border text-[11px] ${map[s]}`}
    >
      {s.replace("_", " ")}
    </span>
  );
};

const ME_Subscriptions: React.FC = () => {
  const [q, setQ] = React.useState("");
  const [status, setStatus] = React.useState<"all" | SubStatus>("all");
  const [page, setPage] = React.useState(1);
  const perPage = 5;

  const filtered = React.useMemo(() => {
    const l = q.trim().toLowerCase();
    return DUMMY.filter((s) => {
      if (status !== "all" && s.status !== status) return false;
      if (l) {
        const hay = `${s.plan} ${s.price} ${s.methodTail ?? ""}`.toLowerCase();
        if (!hay.includes(l)) return false;
      }
      return true;
    }).sort((a, b) => a.plan.localeCompare(b.plan));
  }, [q, status]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const rows = filtered.slice((page - 1) * perPage, page * perPage);
  React.useEffect(() => setPage(1), [q, status]);

  return (
    <MenteeAppLayout>
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold">Subscriptions</h1>
            <p className="text-sm text-[#5E66A6] dark:text-[#A7B0FF]/85">
              Manage plans and add-ons linked to your mentee account.
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-12 gap-2">
          <div className="md:col-span-6">
            <div className={`flex items-center gap-2 ${card} h-11 px-3.5`}>
              <Search className="h-4 w-4 text-[#5F679A] dark:text-[#A7B0FF]" />
              <input
                className="bg-transparent outline-none text-sm w-full"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search plan, price, payment method…"
              />
            </div>
          </div>
          <div className="md:col-span-6">
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
                  <option value="active">Active</option>
                  <option value="trialing">Trialing</option>
                  <option value="paused">Paused</option>
                  <option value="past_due">Past due</option>
                  <option value="canceled">Canceled</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Table / cards */}
        <div className="mt-6 hidden md:block">
          <div className={`${card} overflow-x-auto`}>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[#6B72B3] dark:text-[#A7B0FF]/80">
                  <th className="px-4 py-3">Plan</th>
                  <th className="px-4 py-3">Started</th>
                  <th className="px-4 py-3">Renews</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E7E9FF] dark:divide-[#2B2F55]">
                {rows.map((s) => (
                  <tr key={s.id}>
                    <td className="px-4 py-3">
                      <div className="font-semibold flex items-center gap-2">
                        <BadgeCheck className="h-4 w-4 text-indigo-500" />{" "}
                        {s.plan}
                      </div>
                      <div className="text-xs opacity-70">
                        {s.price} • {s.seats} seat(s) • {s.methodTail ?? "—"}
                      </div>
                    </td>
                    <td className="px-4 py-3">{d(s.startedAt)}</td>
                    <td className="px-4 py-3">{d(s.renewsAt)}</td>
                    <td className="px-4 py-3">
                      <Pill s={s.status} />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <RowMenu s={s} />
                    </td>
                  </tr>
                ))}
                {rows.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-4 py-6 text-center opacity-70"
                    >
                      No subscriptions match your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile cards */}
        <div className="mt-6 grid md:hidden grid-cols-1 gap-3">
          {rows.map((s) => (
            <div key={s.id} className={`${card} p-4`}>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="text-sm font-semibold flex items-center gap-2">
                    <BadgeCheck className="h-4 w-4 text-indigo-500" /> {s.plan}
                  </div>
                  <div className="text-xs opacity-70">
                    {s.price} • {s.seats} seat(s) • {s.methodTail ?? "—"}
                  </div>
                  <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                    <Info label="Started" value={d(s.startedAt)} />
                    <Info label="Renews" value={d(s.renewsAt)} />
                    <div>
                      <Pill s={s.status} />
                    </div>
                  </div>
                </div>
                <RowMenu s={s} compact />
              </div>
            </div>
          ))}
          {rows.length === 0 && (
            <div className="text-sm opacity-70">
              No subscriptions match your filters.
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

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[#E7E9FF] dark:border-[#2B2F55] p-2">
      <div className="text-[11px] opacity-70 inline-flex items-center gap-1">
        <CalendarClock className="h-3.5 w-3.5" />
        {label}
      </div>
      <div className="font-semibold">{value}</div>
    </div>
  );
}

const RowMenu: React.FC<{ s: Sub; compact?: boolean }> = ({ s, compact }) => {
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
  const act = (msg: string) => alert(`Demo: ${msg} (${s.plan})`);
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
        {s.status !== "paused" && s.status !== "canceled" && (
          <MenuItem
            icon={<Pause size={14} />}
            label="Pause"
            onClick={() => {
              act("pause");
              setOpen(false);
            }}
          />
        )}
        {s.status === "paused" && (
          <MenuItem
            icon={<Play size={14} />}
            label="Resume"
            onClick={() => {
              act("resume");
              setOpen(false);
            }}
          />
        )}
        {s.status !== "canceled" && (
          <MenuItem
            icon={<XCircle size={14} />}
            label="Cancel"
            danger
            onClick={() => {
              act("cancel");
              setOpen(false);
            }}
          />
        )}
        <MenuItem
          icon={<CreditCard size={14} />}
          label="Change payment method"
          onClick={() => {
            act("change method");
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

export default ME_Subscriptions;
