// src/pages/app/Activity.tsx
import React from "react";
import MentorAppLayout from "./mentor/MentorAppLayout";
import {
  CalendarCheck2,
  MessageSquare,
  Star,
  CreditCard,
  Wallet,
  Bell,
  ShieldCheck,
  AlertTriangle,
  Users,
  Settings,
  CheckCircle2,
  Search,
  Filter,
  X,
  ChevronLeft,
  ChevronRight,
  Pin,
  PinOff,
  Eye,
  EyeOff,
  Trash2,
  Archive,
  Download,
  Clock,
} from "lucide-react";
import { Link } from "react-router-dom";

/* =========================
   UI Helpers (no shadcn)
   ========================= */
const ringBrand =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#6366F1]/40";
const cardBase =
  "rounded-2xl border border-[#E7E9FF] dark:border-[#2B2F55] bg-white/80 dark:bg-white/[0.05] backdrop-blur";

function Button({
  children,
  variant = "solid",
  className = "",
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "solid" | "ghost" | "outline" | "chip";
}) {
  const base =
    "inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-semibold transition " +
    ringBrand;
  const styles = {
    solid:
      "text-white bg-gradient-to-r from-[#4F46E5] via-[#6366F1] to-[#8B5CF6] shadow-[0_10px_30px_rgba(79,70,229,0.35)] hover:shadow-[0_16px_40px_rgba(79,70,229,0.45)]",
    ghost:
      "border border-[#D9DBFF] dark:border-[#30345D] text-[#1B1F3A] dark:text-[#E6E9FF] bg-white/70 dark:bg-white/[0.05] hover:bg-white/90 dark:hover:bg-white/[0.08]",
    outline:
      "border border-[#D9DBFF] dark:border-[#30345D] text-[#1B1F3A] dark:text-[#E6E9FF] hover:bg-white/70 dark:hover:bg-white/[0.07]",
    chip: "border border-[#E7E9FF] dark:border-[#2B2F55] text-[#1B1F3A] dark:text-[#E6E9FF] bg-white/60 dark:bg-white/[0.04] hover:bg-white/80 dark:hover:bg-white/[0.07]",
  } as const;

  return (
    <button className={`${base} ${styles[variant]} ${className}`} {...rest}>
      {children}
    </button>
  );
}

function Input({
  icon: Icon,
  ...rest
}: React.InputHTMLAttributes<HTMLInputElement> & {
  icon?: React.ComponentType<any>;
}) {
  return (
    <div
      className={`flex items-center gap-2 ${cardBase} px-3.5 py-2 h-11 w-full`}
    >
      {Icon && (
        <Icon size={16} className="text-[#5F679A] dark:text-[#A7B0FF]" />
      )}
      <input
        className={`flex-1 bg-transparent outline-none text-sm text-[#101436] dark:text-[#EEF0FF] placeholder-[#7A81B4] dark:placeholder-[#A7B0FF]/80`}
        {...rest}
      />
    </div>
  );
}

function Select({
  value,
  onChange,
  children,
  className = "",
  ...rest
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      value={value}
      onChange={onChange}
      className={`${cardBase} h-11 px-3.5 text-sm text-[#101436] dark:text-[#EEF0FF] ${ringBrand} ${className}`}
      {...rest}
    >
      {children}
    </select>
  );
}

function ToggleChip({
  active,
  children,
  onClick,
  icon: Icon,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
  icon?: React.ComponentType<any>;
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-xl border px-3 py-1.5 text-xs font-medium transition ${
        active
          ? "text-white bg-[#4F46E5]"
          : "text-[#1B1F3A] dark:text-[#E6E9FF] bg-white/60 dark:bg-white/[0.04]"
      } border-[#E7E9FF] dark:border-[#2B2F55]`}
    >
      {Icon && <Icon size={14} />}
      {children}
    </button>
  );
}

/* =========================
   Types & Dummy Data
   ========================= */
type ActivityType =
  | "session_booked"
  | "session_completed"
  | "message"
  | "payout"
  | "payment"
  | "review"
  | "kyc"
  | "dispute"
  | "mentee_joined"
  | "offer_published"
  | "settings";

type ActorRole = "mentor" | "mentee" | "system";

type ActivityItem = {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  actor: { name: string; role: ActorRole };
  timestamp: string; // ISO
  unread: boolean;
  pinned?: boolean;
  severity: "info" | "success" | "warning" | "error";
  tags?: string[];
  meta?: Partial<{
    amount: string;
    currency: string;
    rating: number;
    sessionId: string;
    bookingRef: string;
  }>;
};

const now = new Date();
function daysAgo(n: number) {
  const d = new Date(now);
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

const DUMMY_ACTIVITIES: ActivityItem[] = [
  {
    id: "a1",
    type: "session_booked",
    title: "Session booked · Ada → Tunde",
    description: "45 min Frontend review. Auto reminders scheduled.",
    actor: { name: "Tunde", role: "mentee" },
    timestamp: daysAgo(1),
    unread: true,
    severity: "success",
    tags: ["booking", "frontend"],
    meta: {
      sessionId: "S-10234",
      amount: "₦18,000",
      currency: "NGN",
      bookingRef: "BK-8125",
    },
  },
  {
    id: "a2",
    type: "message",
    title: "New message from Riya",
    description: "Shared a Figma link + questions before the call.",
    actor: { name: "Riya", role: "mentee" },
    timestamp: daysAgo(0),
    unread: true,
    severity: "info",
    tags: ["message", "prep"],
  },
  {
    id: "a3",
    type: "review",
    title: "Review received · 5.0 ★",
    description: "“Clear path forward and great code examples.”",
    actor: { name: "Mason", role: "mentee" },
    timestamp: daysAgo(3),
    unread: false,
    severity: "success",
    tags: ["review"],
    meta: { rating: 5 },
  },
  {
    id: "a4",
    type: "payout",
    title: "Payout processed",
    description: "Weekly settlement sent to your connected account.",
    actor: { name: "System", role: "system" },
    timestamp: daysAgo(2),
    unread: false,
    severity: "success",
    tags: ["payout", "finance"],
    meta: { amount: "$420", currency: "USD" },
  },
  {
    id: "a5",
    type: "kyc",
    title: "KYC verified",
    description: "Identity & address verification approved.",
    actor: { name: "System", role: "system" },
    timestamp: daysAgo(9),
    unread: false,
    severity: "success",
    tags: ["kyc"],
  },
  {
    id: "a6",
    type: "offer_published",
    title: "New group session published",
    description: "“JavaScript System Design · 60 min” is live.",
    actor: { name: "You", role: "mentor" },
    timestamp: daysAgo(4),
    unread: false,
    severity: "info",
    tags: ["offer", "group"],
  },
  {
    id: "a7",
    type: "payment",
    title: "Payment dispute opened",
    description: "Buyer flagged a payment; mediation started.",
    actor: { name: "System", role: "system" },
    timestamp: daysAgo(6),
    unread: false,
    severity: "warning",
    tags: ["dispute", "finance"],
  },
  {
    id: "a8",
    type: "session_completed",
    title: "Session completed · Ada ↔ Rohan",
    description: "Recording available for 7 days.",
    actor: { name: "Rohan", role: "mentee" },
    timestamp: daysAgo(5),
    unread: false,
    severity: "success",
    tags: ["session", "recording"],
  },
  {
    id: "a9",
    type: "mentee_joined",
    title: "New mentee joined",
    description: "Aisha created an account via referral.",
    actor: { name: "Aisha", role: "mentee" },
    timestamp: daysAgo(7),
    unread: true,
    severity: "info",
    tags: ["growth"],
  },
  {
    id: "a10",
    type: "settings",
    title: "Integrations updated",
    description: "Google Calendar + Paystack connected.",
    actor: { name: "You", role: "mentor" },
    timestamp: daysAgo(8),
    unread: false,
    severity: "info",
    tags: ["integrations"],
  },
];

// Expand to look realistic
const EXTENDED: ActivityItem[] = Array.from({ length: 38 }).map((_, i) => {
  const base = DUMMY_ACTIVITIES[i % DUMMY_ACTIVITIES.length];
  const id = `x${i}`;
  return {
    ...base,
    id,
    timestamp: daysAgo(1 + (i % 14)),
    unread: i % 5 === 0,
    pinned: i % 13 === 0,
  };
});

const ALL_ACTIVITIES: ActivityItem[] = [...DUMMY_ACTIVITIES, ...EXTENDED];

/* =========================
   Utilities
   ========================= */
function iconForType(t: ActivityType) {
  switch (t) {
    case "session_booked":
      return CalendarCheck2;
    case "session_completed":
      return CheckCircle2;
    case "message":
      return MessageSquare;
    case "payout":
      return Wallet;
    case "payment":
      return CreditCard;
    case "review":
      return Star;
    case "kyc":
      return ShieldCheck;
    case "dispute":
      return AlertTriangle;
    case "mentee_joined":
      return Users;
    case "offer_published":
      return Bell;
    default:
      return Settings;
  }
}

function timeAgo(iso: string) {
  const d = new Date(iso).getTime();
  const diff = Date.now() - d;
  const mins = Math.round(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.round(hrs / 24);
  return `${days}d ago`;
}

/* =========================
   Activity Component
   ========================= */
const Activity: React.FC = () => {
  // --- Defensive a11y patch: if a focused element lives under an aria-hidden ancestor (e.g. closed mobile drawer), blur it.
  React.useEffect(() => {
    const active = document.activeElement as HTMLElement | null;
    if (!active) return;
    let node: HTMLElement | null = active;
    while (node) {
      if (node.getAttribute && node.getAttribute("aria-hidden") === "true") {
        active.blur();
        break;
      }
      node = node.parentElement as HTMLElement | null;
    }
  }, []);
  // ---

  // Query state
  const [query, setQuery] = React.useState("");
  const [types, setTypes] = React.useState<ActivityType[] | "all">("all");
  const [roles, setRoles] = React.useState<ActorRole[] | "all">("all");
  const [severity, setSeverity] = React.useState<
    Array<"info" | "success" | "warning" | "error"> | "all"
  >("all");
  const [dateRange, setDateRange] = React.useState<
    "7d" | "30d" | "90d" | "all"
  >("30d");
  const [sort, setSort] = React.useState<"newest" | "oldest">("newest");

  // Pagination
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(12);

  // Data (with optimistic local state)
  const [data, setData] = React.useState<ActivityItem[]>(() => {
    const fromStorage = localStorage.getItem("mentora.activity.optimistic");
    return fromStorage
      ? (JSON.parse(fromStorage) as ActivityItem[])
      : ALL_ACTIVITIES;
  });

  React.useEffect(() => {
    localStorage.setItem("mentora.activity.optimistic", JSON.stringify(data));
  }, [data]);

  // Derived filtering
  const filtered = React.useMemo(() => {
    const lower = query.trim().toLowerCase();
    const startLimit = (() => {
      if (dateRange === "all") return 0;
      const days = dateRange === "7d" ? 7 : dateRange === "30d" ? 30 : 90;
      const d = new Date();
      d.setDate(d.getDate() - days);
      return d.getTime();
    })();

    return data
      .filter((a) => {
        if (startLimit && new Date(a.timestamp).getTime() < startLimit)
          return false;

        if (types !== "all" && !types.includes(a.type)) return false;
        if (roles !== "all" && !roles.includes(a.actor.role)) return false;
        if (severity !== "all" && !severity.includes(a.severity)) return false;

        if (!lower) return true;
        const hay = `${a.title} ${a.description} ${a.actor.name} ${
          a.actor.role
        } ${a.tags?.join(" ") || ""} ${a.meta?.bookingRef || ""}`.toLowerCase();
        return hay.includes(lower);
      })
      .sort((a, b) => {
        const da = new Date(a.timestamp).getTime();
        const db = new Date(b.timestamp).getTime();
        return sort === "newest" ? db - da : da - db;
      });
  }, [data, query, types, roles, severity, dateRange, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageSafe = Math.min(page, totalPages);
  const start = (pageSafe - 1) * pageSize;
  const items = filtered.slice(start, start + pageSize);

  // Actions (optimistic)
  const markRead = (id: string, read = true) =>
    setData((prev) =>
      prev.map((x) => (x.id === id ? { ...x, unread: !read } : x))
    );

  const togglePin = (id: string) =>
    setData((prev) =>
      prev.map((x) => (x.id === id ? { ...x, pinned: !x.pinned } : x))
    );

  const archiveItem = (id: string) =>
    setData((prev) => prev.filter((x) => x.id !== id));

  const clearFilters = () => {
    setQuery("");
    setTypes("all");
    setRoles("all");
    setSeverity("all");
    setDateRange("30d");
    setSort("newest");
    setPage(1);
  };

  const exportCSV = () => {
    const header = [
      "id",
      "type",
      "title",
      "description",
      "actor_name",
      "actor_role",
      "timestamp",
      "unread",
      "severity",
      "tags",
      "amount",
      "currency",
      "rating",
      "sessionId",
      "bookingRef",
    ].join(",");
    const rows = filtered.map((a) =>
      [
        a.id,
        a.type,
        `"${a.title.replace(/"/g, '""')}"`,
        `"${a.description.replace(/"/g, '""')}"`,
        a.actor.name,
        a.actor.role,
        a.timestamp,
        a.unread ? "1" : "0",
        a.severity,
        (a.tags || []).join("|"),
        a.meta?.amount || "",
        a.meta?.currency || "",
        a.meta?.rating ?? "",
        a.meta?.sessionId || "",
        a.meta?.bookingRef || "",
      ].join(",")
    );
    const csv = [header, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "mentora-activities.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  // Filter toggles building
  const allTypes: ActivityType[] = [
    "session_booked",
    "session_completed",
    "message",
    "review",
    "payment",
    "payout",
    "offer_published",
    "mentee_joined",
    "kyc",
    "dispute",
    "settings",
  ];
  const roleOpts: ActorRole[] = ["mentor", "mentee", "system"];

  const toggleType = (t: ActivityType) =>
    setTypes((prev) =>
      prev === "all"
        ? [t]
        : prev.includes(t)
        ? (prev.filter((x) => x !== t) as ActivityType[])
        : ([...prev, t] as ActivityType[])
    );

  const toggleRole = (r: ActorRole) =>
    setRoles((prev) =>
      prev === "all"
        ? [r]
        : prev.includes(r)
        ? (prev.filter((x) => x !== r) as ActorRole[])
        : ([...prev, r] as ActorRole[])
    );

  const toggleSeverity = (s: "info" | "success" | "warning" | "error") =>
    setSeverity((prev) =>
      prev === "all"
        ? [s]
        : prev.includes(s)
        ? (prev.filter((x) => x !== s) as any)
        : ([...prev, s] as any)
    );

  return (
    <MentorAppLayout>
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        {/* Title Bar */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#0F132E] dark:text-[#E9ECFF]">
              Activity
            </h1>
            <p className="text-sm text-[#5E66A6] dark:text-[#A7B0FF]/85">
              Your system feed — sessions, payments, reviews, messages, and
              more.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="chip" onClick={exportCSV}>
              <Download size={16} />
              Export CSV
            </Button>
          </div>
        </div>

        {/* Controls */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-3">
          <div className="lg:col-span-5">
            <Input
              icon={Search}
              placeholder="Search activities, people, tags, refs…"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
            />
          </div>
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Select
              value={dateRange}
              onChange={(e) => {
                setDateRange(e.target.value as any);
                setPage(1);
              }}
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="all">All time</option>
            </Select>
            <Select
              value={sort}
              onChange={(e) => setSort(e.target.value as any)}
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
            </Select>
            <Select
              value={pageSize}
              onChange={(e) => {
                setPageSize(parseInt(e.target.value, 10));
                setPage(1);
              }}
            >
              {[6, 12, 24, 48].map((n) => (
                <option key={n} value={n}>
                  {n} / page
                </option>
              ))}
            </Select>
            <Button variant="ghost" onClick={clearFilters}>
              <X size={16} />
              Reset
            </Button>
          </div>
        </div>

        {/* Filter chips */}
        <div className="mt-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#6065A6] dark:text-[#A7B0FF]/80">
              <Filter size={14} /> Filters:
            </span>

            {/* Types */}
            {allTypes.map((t) => {
              const active = types !== "all" && types.includes(t);
              const Icon = iconForType(t);
              const label = t.replace(/_/g, " ");
              return (
                <ToggleChip
                  key={t}
                  active={!!active}
                  onClick={() => {
                    toggleType(t);
                    setPage(1);
                  }}
                  icon={Icon}
                >
                  {label}
                </ToggleChip>
              );
            })}

            {/* Roles */}
            {roleOpts.map((r) => {
              const active = roles !== "all" && roles.includes(r);
              return (
                <ToggleChip
                  key={r}
                  active={!!active}
                  onClick={() => {
                    toggleRole(r);
                    setPage(1);
                  }}
                >
                  role: {r}
                </ToggleChip>
              );
            })}

            {/* Severity */}
            {(["info", "success", "warning", "error"] as const).map((s) => {
              const active = severity !== "all" && severity.includes(s);
              return (
                <ToggleChip
                  key={s}
                  active={!!active}
                  onClick={() => {
                    toggleSeverity(s);
                    setPage(1);
                  }}
                >
                  {s}
                </ToggleChip>
              );
            })}
          </div>
        </div>

        {/* Grid */}
        <div className="mt-6 grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {items.map((a) => {
            const Icon = iconForType(a.type);
            const colorBySeverity =
              a.severity === "success"
                ? "text-emerald-500"
                : a.severity === "warning"
                ? "text-amber-500"
                : a.severity === "error"
                ? "text-rose-500"
                : "text-indigo-500";

            return (
              <div key={a.id} className={`${cardBase} p-4`}>
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl grid place-items-center border border-[#E7E9FF] dark:border-[#2B2F55] bg-white/70 dark:bg-white/[0.04]">
                      <Icon size={18} className={colorBySeverity} />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-[#0F1536] dark:text-[#E7E9FF]">
                        {a.title}
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-[#6B72B3] dark:text-[#A7B0FF]/80">
                        <Clock size={12} />{" "}
                        <span title={new Date(a.timestamp).toLocaleString()}>
                          {timeAgo(a.timestamp)}
                        </span>
                        <span>·</span>
                        <span>{a.actor.name}</span>
                        <span className="opacity-60">({a.actor.role})</span>
                        {a.unread && (
                          <span className="ml-2 inline-block h-1.5 w-1.5 rounded-full bg-[#4F46E5] shadow-[0_0_10px_rgba(79,70,229,0.6)]" />
                        )}
                        {a.pinned && (
                          <span className="ml-1 inline-block text-[10px] text-[#4F46E5]">
                            pinned
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="chip"
                      onClick={() => togglePin(a.id)}
                      aria-label="toggle pin"
                    >
                      {a.pinned ? <PinOff size={14} /> : <Pin size={14} />}
                    </Button>
                    <Button
                      variant="chip"
                      onClick={() => markRead(a.id, a.unread ? false : true)}
                      aria-label="toggle read"
                      title={a.unread ? "Mark as read" : "Mark as unread"}
                    >
                      {a.unread ? <Eye size={14} /> : <EyeOff size={14} />}
                    </Button>
                    <Button
                      variant="chip"
                      onClick={() => archiveItem(a.id)}
                      aria-label="archive"
                    >
                      <Archive size={14} />
                    </Button>
                    <Button
                      variant="chip"
                      onClick={() => archiveItem(a.id)}
                      aria-label="delete"
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>

                {/* Body */}
                <p className="mt-3 text-sm text-[#2C3157] dark:text-[#C9D1FF]/85">
                  {a.description}
                </p>

                {/* Meta */}
                <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                  {a.meta?.amount && (
                    <div className="rounded-lg border border-[#E7E9FF] dark:border-[#2B2F55] p-2">
                      <div className="text-[11px] text-[#6B72B3] dark:text-[#A7B0FF]/75">
                        Amount
                      </div>
                      <div className="font-semibold text-[#101436] dark:text-[#EEF0FF]">
                        {a.meta.amount} {a.meta.currency || ""}
                      </div>
                    </div>
                  )}
                  {typeof a.meta?.rating === "number" && (
                    <div className="rounded-lg border border-[#E7E9FF] dark:border-[#2B2F55] p-2">
                      <div className="text-[11px] text-[#6B72B3] dark:text-[#A7B0FF]/75">
                        Rating
                      </div>
                      <div className="font-semibold text-[#101436] dark:text-[#EEF0FF]">
                        {a.meta.rating} ★
                      </div>
                    </div>
                  )}
                  {a.meta?.sessionId && (
                    <div className="rounded-lg border border-[#E7E9FF] dark:border-[#2B2F55] p-2">
                      <div className="text-[11px] text-[#6B72B3] dark:text-[#A7B0FF]/75">
                        Session
                      </div>
                      <div className="font-semibold text-[#101436] dark:text-[#EEF0FF]">
                        {a.meta.sessionId}
                      </div>
                    </div>
                  )}
                  {a.meta?.bookingRef && (
                    <div className="rounded-lg border border-[#E7E9FF] dark:border-[#2B2F55] p-2">
                      <div className="text-[11px] text-[#6B72B3] dark:text-[#A7B0FF]/75">
                        Booking Ref
                      </div>
                      <div className="font-semibold text-[#101436] dark:text-[#EEF0FF]">
                        {a.meta.bookingRef}
                      </div>
                    </div>
                  )}
                </div>

                {/* Tags + CTA */}
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-2 flex-wrap">
                    {(a.tags || []).map((t) => (
                      <span
                        key={t}
                        className="inline-flex items-center gap-1 rounded-lg border border-[#E7E9FF] dark:border-[#2B2F55] px-2 py-1 text-[11px] text-[#1B1F3A] dark:text-[#E6E9FF] bg-white/60 dark:bg-white/[0.04]"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                  {/* optional deep links (wire these to your actual routes) */}
                  <Link
                    to="#"
                    className="text-[12px] font-semibold text-[#4F46E5] hover:underline"
                  >
                    View details
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty state */}
        {items.length === 0 && (
          <div className="mt-10 text-center">
            <div className="mx-auto w-fit rounded-2xl border border-[#E7E9FF] dark:border-[#2B2F55] bg-white/60 dark:bg-white/[0.04] backdrop-blur px-5 py-4">
              <p className="text-sm text-[#5E66A6] dark:text-[#A7B0FF]/85">
                No activities match your filters.
              </p>
              <div className="mt-2">
                <Button variant="chip" onClick={clearFilters}>
                  Reset filters
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Pagination */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-[#6B72B3] dark:text-[#A7B0FF]/80">
            Showing <span className="font-semibold">{items.length}</span> of{" "}
            <span className="font-semibold">{filtered.length}</span> activities
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={pageSafe <= 1}
              className={pageSafe <= 1 ? "opacity-50 cursor-not-allowed" : ""}
            >
              <ChevronLeft size={16} /> Prev
            </Button>

            {/* Page numbers (compact) */}
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages })
                .slice(0, 7)
                .map((_, i) => {
                  const n = i + 1;
                  const active = n === pageSafe;
                  return (
                    <button
                      key={n}
                      onClick={() => setPage(n)}
                      className={`h-9 w-9 grid place-items-center rounded-xl border ${
                        active
                          ? "text-white bg-[#4F46E5]"
                          : "text-[#1B1F3A] dark:text-[#E6E9FF] bg-white/50 dark:bg-white/[0.04]"
                      } border-[#E7E9FF] dark:border-[#2B2F55]`}
                    >
                      {n}
                    </button>
                  );
                })}
              {totalPages > 7 && (
                <>
                  <span className="px-2 text-[#6B72B3] dark:text-[#A7B0FF]/80">
                    …
                  </span>
                  <button
                    onClick={() => setPage(totalPages)}
                    className={`h-9 w-9 grid place-items-center rounded-xl border text-[#1B1F3A] dark:text-[#E6E9FF] bg-white/50 dark:bg-white/[0.04] border-[#E7E9FF] dark:border-[#2B2F55]`}
                  >
                    {totalPages}
                  </button>
                </>
              )}
            </div>

            <Button
              variant="outline"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={pageSafe >= totalPages}
              className={
                pageSafe >= totalPages ? "opacity-50 cursor-not-allowed" : ""
              }
            >
              Next <ChevronRight size={16} />
            </Button>
          </div>
        </div>
      </div>
    </MentorAppLayout>
  );
};

export default Activity;
