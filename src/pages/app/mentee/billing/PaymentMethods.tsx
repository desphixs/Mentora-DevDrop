import React from "react";
import MenteeAppLayout from "../MenteeAppLayout";
import {
  Search,
  Filter,
  Plus,
  MoreVertical,
  CreditCard,
  Landmark,
  ShieldCheck,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Building2,
  Calendar as CalendarIcon,
  User as UserIcon,
  BadgeDollarSign,
} from "lucide-react";

/* tokens */
const ringIndigo =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#6366F1]/40";
const card =
  "rounded-2xl border border-[#E7E9FF] dark:border-[#2B2F55] bg-white/95 dark:bg-zinc-900/95 backdrop-blur";
const btnBase =
  "inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-semibold transition " +
  ringIndigo;
const btnGhost =
  "border border-[#D9DBFF] dark:border-[#30345D] text-[#1B1F3A] dark:text-[#E6E9FF] bg-white/70 dark:bg-white/[0.06] hover:bg-white/90 dark:hover:bg-white/[0.12]";
const btnSolid =
  "text-white bg-gradient-to-r from-[#4F46E5] via-[#6366F1] to-[#8B5CF6]";

type MethodType = "card" | "bank";
type MethodStatus = "valid" | "expired" | "verifying";
type Method = {
  id: string;
  type: MethodType;
  ownerName: string; // NEW: card/account holder; same across methods
  brand?: "visa" | "mastercard" | "verve" | "amex";
  last4?: string;
  exp?: string; // MM/YY
  bankName?: string; // for cards: issuing bank; for bank: bank itself
  accountLast4?: string;
  default: boolean;
  status: MethodStatus;
  funding?: "debit" | "credit"; // card funding type
  addedAt?: string; // ISO
  currency?: "NGN" | "USD" | "GBP";
  billingZip?: string; // light detail to avoid clutter
};

const sameName = "Aisha Bello";

const DUMMY: Method[] = [
  {
    id: "pm_1",
    type: "card",
    ownerName: sameName,
    brand: "visa",
    last4: "4242",
    exp: "08/27",
    bankName: "Zenith Bank",
    default: true,
    status: "valid",
    funding: "debit",
    addedAt: isoAgoDays(12),
    currency: "NGN",
    billingZip: "101001",
  },
  {
    id: "pm_2",
    type: "card",
    ownerName: sameName,
    brand: "mastercard",
    last4: "4444",
    exp: "02/25",
    bankName: "First Bank",
    default: false,
    status: "valid",
    funding: "credit",
    addedAt: isoAgoDays(60),
    currency: "NGN",
    billingZip: "101001",
  },
  {
    id: "pm_3",
    type: "bank",
    ownerName: sameName,
    bankName: "Guaranty Trust Bank",
    accountLast4: "1021",
    default: false,
    status: "verifying",
    addedAt: isoAgoDays(2),
    currency: "NGN",
  },
  {
    id: "pm_4",
    type: "card",
    ownerName: sameName,
    brand: "verve",
    last4: "9911",
    exp: "03/24",
    bankName: "Access Bank",
    default: false,
    status: "expired",
    funding: "debit",
    addedAt: isoAgoDays(420),
    currency: "NGN",
    billingZip: "101001",
  },
];

function isoAgoDays(days: number) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString();
}
function rel(iso?: string) {
  if (!iso) return "—";
  const diffMs = Date.now() - new Date(iso).getTime();
  const d = Math.floor(diffMs / (24 * 3600_000));
  if (d <= 0) return "today";
  if (d === 1) return "yesterday";
  if (d < 30) return `${d}d ago`;
  const m = Math.floor(d / 30);
  return `${m}mo ago`;
}

const ME_PaymentMethods: React.FC = () => {
  const [q, setQ] = React.useState("");
  const [type, setType] = React.useState<"all" | MethodType>("all");
  const [status, setStatus] = React.useState<"all" | MethodStatus>("all");

  const [data, setData] = React.useState<Method[]>(() => {
    const cache = localStorage.getItem("mentee.pay.methods");
    return cache ? (JSON.parse(cache) as Method[]) : DUMMY;
  });
  React.useEffect(() => {
    localStorage.setItem("mentee.pay.methods", JSON.stringify(data));
  }, [data]);

  const filtered = React.useMemo(() => {
    const l = q.trim().toLowerCase();
    return data.filter((m) => {
      if (type !== "all" && m.type !== type) return false;
      if (status !== "all" && m.status !== status) return false;
      if (l) {
        const hay = `${m.type} ${m.brand ?? ""} ${m.last4 ?? ""} ${m.bankName ?? ""} ${m.accountLast4 ?? ""} ${m.ownerName} ${m.funding ?? ""} ${m.currency ?? ""}`.toLowerCase();
        if (!hay.includes(l)) return false;
      }
      return true;
    });
  }, [data, q, type, status]);

  const setDefault = (id: string) =>
    setData((prev) => prev.map((m) => ({ ...m, default: m.id === id })));
  const remove = (id: string) =>
    setData((prev) => prev.filter((m) => m.id !== id));
  const addCard = () =>
    setData((prev) => [
      {
        id: "pm_" + Math.random().toString(36).slice(2),
        type: "card",
        ownerName: sameName,
        brand: "visa",
        last4: String(Math.floor(1000 + Math.random() * 8999)),
        exp: "12/28",
        bankName: ["Zenith Bank", "Access Bank", "UBA", "First Bank"][
          Math.floor(Math.random() * 4)
        ],
        default: false,
        status: "valid",
        funding: Math.random() > 0.5 ? "debit" : "credit",
        addedAt: new Date().toISOString(),
        currency: "NGN",
        billingZip: "101001",
      },
      ...prev,
    ]);

  return (
    <MenteeAppLayout>
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold">Payment Methods</h1>
            <p className="text-sm text-[#5E66A6] dark:text-[#A7B0FF]/85">
              Manage your saved cards and bank accounts.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button className={`${btnBase} ${btnSolid}`} onClick={addCard}>
              <Plus className="h-4 w-4" />
              Add card
            </button>
          </div>
        </div>

        {/* Filters (responsive, won’t push layout) */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-12 gap-2">
          <div className="md:col-span-5">
            <div className={`flex items-center gap-2 ${card} h-11 px-3.5`}>
              <Search className="h-4 w-4 text-[#5F679A] dark:text-[#A7B0FF]" />
              <input
                className="bg-transparent outline-none text-sm w-full"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search name, brand, bank, last4…"
              />
            </div>
          </div>
          <div className="md:col-span-7">
            <div className="flex flex-wrap gap-2">
              <div className={`flex items-center gap-2 ${card} h-11 px-3 w-full sm:w-auto`}>
                <Filter className="h-4 w-4 text-[#5F679A] dark:text-[#A7B0FF]" />
                <select
                  className="bg-transparent text-sm outline-none"
                  value={type}
                  onChange={(e) => setType(e.target.value as any)}
                >
                  <option value="all">Type: All</option>
                  <option value="card">Card</option>
                  <option value="bank">Bank</option>
                </select>
                <span className="h-4 w-px bg-[#E7E9FF] dark:bg-[#2B2F55]" />
                <select
                  className="bg-transparent text-sm outline-none"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                >
                  <option value="all">Status: All</option>
                  <option value="valid">Valid</option>
                  <option value="expired">Expired</option>
                  <option value="verifying">Verifying</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Cards grid */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
          {filtered.map((m) => (
            <div key={m.id} className={`${card} p-4`}>
              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="h-10 w-10 rounded-xl grid place-items-center border border-[#E7E9FF] dark:border-[#2B2F55] bg-white/70 dark:bg-white/[0.06] shrink-0">
                    {m.type === "card" ? (
                      <CreditCard className="h-5 w-5 text-indigo-500" />
                    ) : (
                      <Landmark className="h-5 w-5 text-indigo-500" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold truncate">
                      {m.type === "card"
                        ? `${m.brand?.toUpperCase()} •••• ${m.last4}`
                        : `${m.bankName} •••• ${m.accountLast4}`}
                    </div>
                    <div className="text-[11px] opacity-70 flex items-center gap-2 flex-wrap">
                      {m.type === "card" ? (
                        <>
                          <span className="inline-flex items-center gap-1">
                            <CalendarIcon className="h-3.5 w-3.5" />
                            Exp {m.exp}
                          </span>
                          {m.funding && (
                            <span className="inline-flex items-center gap-1">
                              <BadgeDollarSign className="h-3.5 w-3.5" />
                              {m.funding}
                            </span>
                          )}
                        </>
                      ) : (
                        <span>Bank account</span>
                      )}
                      <span className="inline-flex items-center gap-1">
                        <Building2 className="h-3.5 w-3.5" />
                        {m.bankName ?? "—"}
                      </span>
                    </div>

                    {/* Name row (requested) */}
                    <div className="mt-2 text-[12px] flex flex-col items-start gap-2">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md border border-[#E7E9FF] dark:border-[#2B2F55] bg-white/60 dark:bg-white/[0.06]">
                        <UserIcon className="h-3.5 w-3.5" />
                        {m.ownerName}
                      </span>
                      {m.currency && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md border border-[#E7E9FF] dark:border-[#2B2F55] bg-white/60 dark:bg-white/[0.06]">
                          {m.currency}
                        </span>
                      )}
                      {m.billingZip && m.type === "card" && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md border border-[#E7E9FF] dark:border-[#2B2F55] bg-white/60 dark:bg-white/[0.06]">
                          ZIP {m.billingZip}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <MethodMenu
                  onMakeDefault={() => setDefault(m.id)}
                  onRemove={() => remove(m.id)}
                  disabledRemove={m.default}
                />
              </div>

              {/* Status + default badges */}
              <div className="mt-3 flex items-center gap-2 flex-wrap">
                <Status m={m} />
                {m.default && (
                  <span className="inline-flex items-center gap-1 text-[11px] px-2 py-1 rounded-md border border-emerald-300/60 text-emerald-700 dark:text-emerald-300 dark:border-emerald-900 bg-emerald-50 dark:bg-emerald-950/40">
                    <ShieldCheck className="h-3.5 w-3.5" /> Default
                  </span>
                )}
                <span className="text-[11px] opacity-70">
                  Added {rel(m.addedAt)}
                </span>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="text-sm opacity-70">No methods match your filters.</div>
          )}
        </div>
      </div>
    </MenteeAppLayout>
  );
};

const Status: React.FC<{ m: Method }> = ({ m }) => {
  if (m.status === "valid")
    return (
      <span className="inline-flex items-center gap-1 text-[11px] px-2 py-1 rounded-md border border-emerald-300/60 text-emerald-700 dark:text-emerald-300 dark:border-emerald-900 bg-emerald-50 dark:bg-emerald-950/40">
        <CheckCircle2 className="h-3.5 w-3.5" /> Valid
      </span>
    );
  if (m.status === "expired")
    return (
      <span className="inline-flex items-center gap-1 text-[11px] px-2 py-1 rounded-md border border-rose-300/60 text-rose-700 dark:text-rose-300 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/40">
        <AlertTriangle className="h-3.5 w-3.5" /> Expired
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 text-[11px] px-2 py-1 rounded-md border border-amber-300/60 text-amber-700 dark:text-amber-300 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/40">
      <AlertTriangle className="h-3.5 w-3.5" /> Verifying
    </span>
  );
};

const MethodMenu: React.FC<{
  onMakeDefault: () => void;
  onRemove: () => void;
  disabledRemove?: boolean;
}> = ({ onMakeDefault, onRemove, disabledRemove }) => {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement | null>(null);
  React.useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);
  return (
    <div className="relative" ref={ref}>
      <button
        className={`${btnBase} ${btnGhost} px-2 py-1`}
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <MoreVertical className="h-4 w-4" />
      </button>
      <div
        role="menu"
        className={`absolute right-0 mt-2 w-48 ${card} p-1 z-30 shadow-lg transition ${
          open ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-1 pointer-events-none"
        }`}
      >
        <MenuItem
          icon={<ShieldCheck size={14} />}
          label="Make default"
          onClick={() => {
            onMakeDefault();
            setOpen(false);
          }}
        />
        <MenuItem
          icon={<Trash2 size={14} />}
          label="Remove"
          onClick={() => {
            if (!disabledRemove) onRemove();
            setOpen(false);
          }}
          danger
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
      className={`w-full text-left px-3 py-2 rounded-lg hover:bg-white/90 dark:hover:bg-white/[0.10] inline-flex items-center gap-2 ${
        danger ? "text-rose-600" : ""
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

export default ME_PaymentMethods;
