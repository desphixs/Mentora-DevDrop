import React from "react";
import { Link } from "react-router-dom";
import MentorAppLayout from "../MentorAppLayout";
import {
  Search,
  Filter,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  CalendarClock,
  Users,
  User,
  Clock,
  Video,
  MapPin,
  Archive,
  ArchiveRestore,
  CheckCircle2,
  XCircle,
  Undo2,
  FileText,
  BadgeDollarSign,
  Tag,
  Star,
  Flag,
  FlagOff,
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

/* ---------------------------
   Types + dummy data
---------------------------- */
type SessionStatus =
  | "requested"
  | "scheduled"
  | "completed"
  | "cancelled"
  | "refunded"
  | "no-show";
type SessionType = "1:1" | "group";

type Session = {
  id: string;
  title: string;
  mentee: string;
  menteeEmail: string;
  tz: string;
  type: SessionType;
  durationMin: number;
  price: number;
  currency: string;
  startISO: string;
  endISO: string;
  provider: "Google Meet" | "Zoom";
  meetingLink: string;
  tags: string[];
  notes?: string;
  status: SessionStatus;
  rating?: number;
  flagged?: boolean;
};

const isoFromNow = (mins: number) =>
  new Date(Date.now() + mins * 60 * 1000).toISOString();
const DUMMY_SESSIONS: Session[] = [
  {
    id: "s1",
    title: "Next.js Performance Deep-Dive",
    mentee: "Tunde",
    menteeEmail: "tunde@example.com",
    tz: "Africa/Lagos",
    type: "1:1",
    durationMin: 45,
    price: 25,
    currency: "USD",
    startISO: isoFromNow(180),
    endISO: isoFromNow(225),
    provider: "Google Meet",
    meetingLink: "#",
    tags: ["frontend", "perf"],
    notes: "Review Lighthouse, image strategy.",
    status: "scheduled",
    rating: undefined,
  },
  {
    id: "s2",
    title: "Observability & p95 Latency",
    mentee: "Riya",
    menteeEmail: "riya@example.com",
    tz: "Asia/Kolkata",
    type: "1:1",
    durationMin: 60,
    price: 40,
    currency: "USD",
    startISO: isoFromNow(-1440),
    endISO: isoFromNow(-1380),
    provider: "Zoom",
    meetingLink: "#",
    tags: ["backend", "tracing"],
    status: "completed",
    rating: 5,
  },
  {
    id: "s3",
    title: "Design Crit Roundtable",
    mentee: "Design Roundtable",
    menteeEmail: "team@example.com",
    tz: "Europe/London",
    type: "group",
    durationMin: 60,
    price: 120,
    currency: "USD",
    startISO: isoFromNow(60 * 24 * 3),
    endISO: isoFromNow(60 * 24 * 3 + 60),
    provider: "Zoom",
    meetingLink: "#",
    tags: ["design", "ux"],
    notes: "Moodboard + heuristics.",
    status: "requested",
    rating: undefined,
    flagged: false,
  },
  {
    id: "s4",
    title: "Growth Strategy",
    mentee: "Mason",
    menteeEmail: "mason@example.com",
    tz: "America/Los_Angeles",
    type: "1:1",
    durationMin: 45,
    price: 30,
    currency: "USD",
    startISO: isoFromNow(-120),
    endISO: isoFromNow(-75),
    provider: "Google Meet",
    meetingLink: "#",
    tags: ["growth", "ads"],
    status: "completed",
    rating: 3,
  },
  {
    id: "s5",
    title: "Career Planning",
    mentee: "Kelechi",
    menteeEmail: "kelechi@example.com",
    tz: "Africa/Lagos",
    type: "1:1",
    durationMin: 30,
    price: 20,
    currency: "USD",
    startISO: isoFromNow(60 * 20),
    endISO: isoFromNow(60 * 20 + 30),
    provider: "Google Meet",
    meetingLink: "#",
    tags: ["career"],
    status: "scheduled",
  },
  {
    id: "s6",
    title: "ML Roadmap Triage",
    mentee: "Olivia",
    menteeEmail: "olivia@example.com",
    tz: "America/New_York",
    type: "1:1",
    durationMin: 60,
    price: 50,
    currency: "USD",
    startISO: isoFromNow(-60 * 48),
    endISO: isoFromNow(-60 * 47),
    provider: "Zoom",
    meetingLink: "#",
    tags: ["ml"],
    status: "refunded",
    rating: 1,
    flagged: true,
  },
  {
    id: "s7",
    title: "Mock Interview • Frontend",
    mentee: "Arjun",
    menteeEmail: "arjun@example.com",
    tz: "Asia/Kolkata",
    type: "1:1",
    durationMin: 60,
    price: 45,
    currency: "USD",
    startISO: isoFromNow(60 * 8),
    endISO: isoFromNow(60 * 9),
    provider: "Google Meet",
    meetingLink: "#",
    tags: ["interview", "frontend"],
    status: "scheduled",
  },
  {
    id: "s8",
    title: "Campaign Audit",
    mentee: "Noah",
    menteeEmail: "noah@example.com",
    tz: "Europe/Berlin",
    type: "1:1",
    durationMin: 30,
    price: 20,
    currency: "USD",
    startISO: isoFromNow(-60 * 5),
    endISO: isoFromNow(-60 * 4.5),
    provider: "Zoom",
    meetingLink: "#",
    tags: ["ops"],
    status: "cancelled",
  },
];

/* ---------------------------
   Helpers
---------------------------- */
const fmtTime = (iso: string) =>
  new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
const fmtDay = (iso: string) =>
  new Date(iso).toLocaleDateString([], {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
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

function StatusBadge({ status }: { status: SessionStatus }) {
  const map: Record<SessionStatus, string> = {
    requested:
      "text-sky-700 bg-sky-50 border-sky-100 dark:text-sky-300/90 dark:bg-sky-900/20 dark:border-sky-900/30",
    scheduled:
      "text-indigo-700 bg-indigo-50 border-indigo-100 dark:text-indigo-300/90 dark:bg-indigo-900/20 dark:border-indigo-900/30",
    completed:
      "text-emerald-700 bg-emerald-50 border-emerald-100 dark:text-emerald-300/90 dark:bg-emerald-900/20 dark:border-emerald-900/30",
    cancelled:
      "text-rose-700 bg-rose-50 border-rose-100 dark:text-rose-300/90 dark:bg-rose-900/20 dark:border-rose-900/30",
    refunded:
      "text-amber-700 bg-amber-50 border-amber-100 dark:text-amber-300/90 dark:bg-amber-900/20 dark:border-amber-900/30",
    "no-show":
      "text-fuchsia-700 bg-fuchsia-50 border-fuchsia-100 dark:text-fuchsia-300/90 dark:bg-fuchsia-900/20 dark:border-fuchsia-900/30",
  };
  return (
    <span
      className={`text-[11px] rounded-full px-2.5 py-0.5 border ${map[status]}`}
    >
      {status}
    </span>
  );
}

/* ---------------------------
   Filtering & sorting
---------------------------- */
type Filters = {
  q: string;
  status: "all" | SessionStatus;
  type: "all" | SessionType;
  provider: "all" | "Google Meet" | "Zoom";
  tagged: "all" | string; // any tag
  minDur: "all" | "30" | "45" | "60";
  onlyFlagged: boolean;
  sort: "dateDesc" | "dateAsc" | "priceDesc" | "priceAsc";
};

const perPage = 8;

function applyFilters(list: Session[], f: Filters) {
  let out = list.filter((s) => {
    if (f.status !== "all" && s.status !== f.status) return false;
    if (f.type !== "all" && s.type !== f.type) return false;
    if (f.provider !== "all" && s.provider !== f.provider) return false;
    if (f.tagged !== "all" && !s.tags.includes(f.tagged)) return false;
    if (f.minDur !== "all" && s.durationMin < +f.minDur) return false;
    if (f.onlyFlagged && !s.flagged) return false;
    if (f.q.trim()) {
      const q = f.q.toLowerCase();
      const hay = `${s.title} ${s.mentee} ${s.menteeEmail} ${s.tags.join(
        " "
      )} ${s.status}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });

  if (f.sort === "dateDesc")
    out.sort((a, b) => +new Date(b.startISO) - +new Date(a.startISO));
  if (f.sort === "dateAsc")
    out.sort((a, b) => +new Date(a.startISO) - +new Date(b.startISO));
  if (f.sort === "priceDesc") out.sort((a, b) => b.price - a.price);
  if (f.sort === "priceAsc") out.sort((a, b) => a.price - b.price);

  return out;
}

/* ---------------------------
   Component
---------------------------- */
const SessionsList: React.FC = () => {
  const [sessions, setSessions] = React.useState<Session[]>(
    () =>
      JSON.parse(localStorage.getItem("mentora.sessions") || "null") ??
      DUMMY_SESSIONS
  );
  React.useEffect(
    () => localStorage.setItem("mentora.sessions", JSON.stringify(sessions)),
    [sessions]
  );

  const [filters, setFilters] = React.useState<Filters>({
    q: "",
    status: "all",
    type: "all",
    provider: "all",
    tagged: "all",
    minDur: "all",
    onlyFlagged: false,
    sort: "dateDesc",
  });

  const [page, setPage] = React.useState(1);
  const filtered = React.useMemo(
    () => applyFilters(sessions, filters),
    [sessions, filters]
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paged = React.useMemo(
    () => filtered.slice((page - 1) * perPage, page * perPage),
    [filtered, page]
  );

  React.useEffect(() => setPage(1), [filters]);

  const [actionsFor, setActionsFor] = React.useState<string | null>(null);

  // Actions (modal-driven)
  const markCancelled = (id: string) =>
    setSessions((p) =>
      p.map((s) => (s.id === id ? { ...s, status: "cancelled" } : s))
    );
  const markRefunded = (id: string) =>
    setSessions((p) =>
      p.map((s) => (s.id === id ? { ...s, status: "refunded" } : s))
    );
  const archiveCompleted = (id: string) =>
    setSessions((p) =>
      p.map((s) =>
        s.id === id && s.status === "completed"
          ? { ...s, status: "archived" as any }
          : s
      )
    );
  const toggleFlag = (id: string) =>
    setSessions((p) =>
      p.map((s) => (s.id === id ? { ...s, flagged: !s.flagged } : s))
    );

  return (
    <MentorAppLayout>
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-[#0F132E] dark:text-[#E9ECFF]">
              Sessions
            </h1>
            <p className="text-sm text-[#5E66A6] dark:text-[#A7B0FF]/85">
              Manage requests, upcoming and past calls.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Link
              to="/dashboard/sessions/requests"
              className={`${btnBase} ${btnGhost}`}
            >
              <FileText size={16} /> Requests
            </Link>
            <Link
              to="/dashboard/sessions/upcoming"
              className={`${btnBase} ${btnGhost}`}
            >
              <CalendarClock size={16} /> Upcoming
            </Link>
            <Link
              to="/dashboard/sessions/past"
              className={`${btnBase} ${btnGhost}`}
            >
              <Undo2 size={16} /> Past
            </Link>
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
              placeholder="Search title, mentee, tag… (⌘/Ctrl+K)"
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
              <option value="requested">Requested</option>
              <option value="scheduled">Scheduled</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
              <option value="refunded">Refunded</option>
              <option value="no-show">No-show</option>
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
              value={filters.provider}
              onChange={(e) =>
                setFilters((f) => ({ ...f, provider: e.target.value as any }))
              }
            >
              <option value="all">Provider: Any</option>
              <option value="Google Meet">Google Meet</option>
              <option value="Zoom">Zoom</option>
            </select>
            <span className="h-4 w-px bg-[#E7E9FF] dark:bg-[#2B2F55]" />
            <select
              className="bg-transparent text-sm outline-none"
              value={filters.minDur}
              onChange={(e) =>
                setFilters((f) => ({ ...f, minDur: e.target.value as any }))
              }
            >
              <option value="all">Min. Duration</option>
              <option value="30">≥ 30m</option>
              <option value="45">≥ 45m</option>
              <option value="60">≥ 60m</option>
            </select>
            <span className="h-4 w-px bg-[#E7E9FF] dark:bg-[#2B2F55]" />
            <select
              className="bg-transparent text-sm outline-none"
              value={filters.tagged}
              onChange={(e) =>
                setFilters((f) => ({ ...f, tagged: e.target.value as any }))
              }
            >
              <option value="all">Tag: Any</option>
              {Array.from(new Set(sessions.flatMap((s) => s.tags))).map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            <label className="ml-2 inline-flex items-center gap-2 text-xs">
              <input
                type="checkbox"
                className="accent-[#6366F1]"
                checked={filters.onlyFlagged}
                onChange={(e) =>
                  setFilters((f) => ({ ...f, onlyFlagged: e.target.checked }))
                }
              />
              Only flagged
            </label>
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
              <option value="priceDesc">Sort: Price ↓</option>
              <option value="priceAsc">Sort: Price ↑</option>
            </select>
          </div>
        </div>

        {/* Content: cards (mobile) + table (md+) */}
        <div className="mt-4">
          {/* Cards for small screens */}
          <div className="md:hidden grid grid-cols-1 gap-3">
            {paged.map((s) => (
              <div key={s.id} className={`${card} p-3`}>
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-xl grid place-items-center bg-[#EEF2FF] dark:bg-white/[0.08] border border-[#E7E9FF] dark:border-[#2B2F55] text-[11px] text-[#1B1F3A] dark:text-[#E6E9FF]">
                        {s.type === "group" ? (
                          <Users size={14} />
                        ) : (
                          <User size={14} />
                        )}
                      </div>
                      <div className="font-semibold text-sm text-[#0F1536] dark:text-[#E7E9FF] truncate">
                        {s.title}
                      </div>
                      {s.flagged && (
                        <Flag
                          size={14}
                          className="text-amber-500"
                          title="Flagged"
                        />
                      )}
                    </div>
                    <div className="mt-1 text-[12px] text-[#5E66A6] dark:text-[#A7B0FF]/80 truncate">
                      with {s.mentee} · {s.type} · {s.durationMin}m
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-1">
                      <StatusBadge status={s.status} />
                      <span className={`${pill} !py-0.5`}>
                        <BadgeDollarSign size={14} /> {s.currency} {s.price}
                      </span>
                      <span className={`${pill} !py-0.5`}>
                        <Video size={14} /> {s.provider}
                      </span>
                      <span className={`${pill} !py-0.5`}>
                        <MapPin size={14} /> {s.tz}
                      </span>
                      {s.tags.map((t) => (
                        <span
                          key={t}
                          className="text-[10px] px-2 py-0.5 rounded-full bg-[#EEF2FF] dark:bg-white/[0.06] text-[#1B1F3A] dark:text-[#E6E9FF] border border-[#E7E9FF] dark:border-[#2B2F55]"
                        >
                          #{t}
                        </span>
                      ))}
                    </div>
                    <div className="mt-2 text-[11px] text-[#6B72B3] dark:text-[#A7B0FF]/80 flex items-center gap-2">
                      <Clock size={12} /> {fmtDay(s.startISO)} ·{" "}
                      {fmtTime(s.startISO)} ({rel(s.startISO)})
                    </div>
                  </div>
                  <button
                    className={`${btnBase} ${btnGhost} px-2 py-1`}
                    onClick={() => setActionsFor(s.id)}
                    aria-label="More"
                  >
                    <MoreVertical size={16} />
                  </button>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Link
                    to={`/dashboard/sessions/${s.id}`}
                    className={`${btnBase} ${btnSolid}`}
                  >
                    View
                  </Link>
                  <a href={s.meetingLink} className={`${btnBase} ${btnGhost}`}>
                    Join link
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Table for md+ */}
          <div className="hidden md:block overflow-x-auto">
            <table className={`min-w-full ${card}`}>
              <thead>
                <tr className="text-left text-[12px] text-[#6B72B3] dark:text-[#A7B0FF]/80">
                  <th className="px-4 py-3">Session</th>
                  <th className="px-4 py-3">When</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="px-4 py-3">Meta</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E7E9FF] dark:divide-[#2B2F55]">
                {paged.map((s) => (
                  <tr key={s.id} className="align-top">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-xl grid place-items-center bg-[#EEF2FF] dark:bg-white/[0.08] border border-[#E7E9FF] dark:border-[#2B2F55]">
                          {s.type === "group" ? (
                            <Users size={14} />
                          ) : (
                            <User size={14} />
                          )}
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-[#0F1536] dark:text-[#E7E9FF]">
                            {s.title}
                          </div>
                          <div className="text-[12px] text-[#5E66A6] dark:text-[#A7B0FF]/80">
                            with {s.mentee} · {s.menteeEmail}
                          </div>
                          <div className="mt-1 flex flex-wrap gap-1">
                            {s.tags.map((t) => (
                              <span
                                key={t}
                                className="text-[10px] px-2 py-0.5 rounded-full bg-[#EEF2FF] dark:bg-white/[0.06] text-[#1B1F3A] dark:text-[#E6E9FF] border border-[#E7E9FF] dark:border-[#2B2F55]"
                              >
                                #{t}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex items-center gap-2">
                        <Clock size={14} /> {fmtDay(s.startISO)} ·{" "}
                        {fmtTime(s.startISO)}
                      </div>
                      <div className="text-[11px] text-[#6B72B3] dark:text-[#A7B0FF]/80">
                        {rel(s.startISO)} · {s.tz}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex items-center gap-2">
                        {s.type === "group" ? (
                          <Users size={14} />
                        ) : (
                          <User size={14} />
                        )}
                        {s.type} · {s.durationMin}m
                      </div>
                      <div className="text-[11px] text-[#6B72B3] dark:text-[#A7B0FF]/80 flex items-center gap-2">
                        <Video size={12} /> {s.provider}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {s.currency} {s.price}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {s.notes ? (
                        <div className="flex items-center gap-2">
                          <Tag size={14} /> {s.notes}
                        </div>
                      ) : (
                        <span className="text-[#6B72B3] dark:text-[#A7B0FF]/80">
                          —
                        </span>
                      )}
                      {typeof s.rating === "number" && (
                        <div className="mt-1 flex items-center gap-1">
                          <Star
                            size={14}
                            className="text-[#F59E0B] fill-[#F59E0B]"
                          />
                          <span className="text-[12px]">{s.rating}.0</span>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <StatusBadge status={s.status} />
                        {s.flagged && (
                          <Flag size={14} className="text-amber-500" />
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="inline-flex gap-2">
                        <Link
                          to={`/dashboard/sessions/${s.id}`}
                          className={`${btnBase} ${btnSolid}`}
                        >
                          View
                        </Link>
                        <button
                          className={`${btnBase} ${btnGhost} px-2 py-1`}
                          onClick={() => setActionsFor(s.id)}
                        >
                          <MoreVertical size={16} />
                        </button>
                      </div>
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
          <ActionsModal
            session={sessions.find((x) => x.id === actionsFor)!}
            onClose={() => setActionsFor(null)}
            onCancel={() => {
              markCancelled(actionsFor);
              setActionsFor(null);
            }}
            onRefund={() => {
              markRefunded(actionsFor);
              setActionsFor(null);
            }}
            onArchive={() => {
              archiveCompleted(actionsFor);
              setActionsFor(null);
            }}
            onFlag={() => {
              toggleFlag(actionsFor);
              setActionsFor(null);
            }}
          />
        )}
      </div>
    </MentorAppLayout>
  );
};

/* ---------------------------
   Actions Modal
---------------------------- */
function ActionsModal({
  session,
  onClose,
  onCancel,
  onRefund,
  onArchive,
  onFlag,
}: {
  session: Session;
  onClose: () => void;
  onCancel: () => void;
  onRefund: () => void;
  onArchive: () => void;
  onFlag: () => void;
}) {
  React.useEffect(() => {
    const onEsc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
      <div
        className="relative mx-auto mt-24 w-full max-w-sm rounded-2xl border border-[#E7E9FF] dark:border-[#2B2F55] bg-white/95 dark:bg-[#0B0F2A]/95 p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-sm font-semibold text-[#0F1536] dark:text-[#E7E9FF]">
          {session.title}
        </div>
        <div className="text-[11px] text-[#6B72B3] dark:text-[#A7B0FF]/80 mt-1">
          Choose an action
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <button className={`${btnBase} ${btnGhost}`} onClick={onCancel}>
            <XCircle size={16} /> Cancel
          </button>
          <button className={`${btnBase} ${btnGhost}`} onClick={onRefund}>
            <Undo2 size={16} /> Refund
          </button>
          <button className={`${btnBase} ${btnGhost}`} onClick={onArchive}>
            {session.status === "completed" ? (
              <Archive size={16} />
            ) : (
              <ArchiveRestore size={16} />
            )}{" "}
            Archive/Restore
          </button>
          <button className={`${btnBase} ${btnGhost}`} onClick={onFlag}>
            {session.flagged ? <FlagOff size={16} /> : <Flag size={16} />}{" "}
            {session.flagged ? "Unflag" : "Flag"}
          </button>
        </div>
        <div className="mt-4 flex justify-end">
          <button className={`${btnBase} ${btnSolid}`} onClick={onClose}>
            <CheckCircle2 size={16} /> Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default SessionsList;
