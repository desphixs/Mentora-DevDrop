import React from "react";
import MenteeAppLayout from "../MenteeAppLayout";
import {
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  CalendarClock,
  Video,
  MapPin,
  MessageSquare,
  XCircle,
  CalendarPlus,
  Eye, // NEW: view icon
} from "lucide-react";
import { useNavigate } from "react-router-dom";

/* tokens */
const ringIndigo =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#6366F1]/40";
const card =
  "rounded-2xl border border-[#E7E9FF] dark:border-[#2B2F55] bg-white/80 dark:bg-white/[0.09] backdrop-blur";
const btnBase =
  "inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-semibold transition " +
  ringIndigo;
const btnGhost =
  "border border-[#D9DBFF] dark:border-[#30345D] text-[#1B1F3A] dark:text-[#E6E9FF] bg-white/70 dark:bg-white/[0.05] hover:bg-white/90 dark:hover:bg-white/[0.08]";

type Session = {
  id: string;
  mentor: string;
  title: string;
  start: string; // ISO
  end: string; // ISO
  durationMin: number;
  mode: "virtual" | "inperson";
  status: "upcoming" | "completed" | "cancelled";
};

const DUMMY: Session[] = [
  {
    id: "s1",
    mentor: "Ada Lovette",
    title: "RSC performance review",
    start: isoIn(1, 10),
    end: isoIn(1, 11),
    durationMin: 60,
    mode: "virtual",
    status: "upcoming",
  },
  {
    id: "s2",
    mentor: "Rohan Bala",
    title: "SRE: tracing deep dive",
    start: isoIn(-5, 9),
    end: isoIn(-5, 10),
    durationMin: 60,
    mode: "virtual",
    status: "completed",
  },
  {
    id: "s3",
    mentor: "Maya I.",
    title: "Portfolio critique",
    start: isoIn(7, 14),
    end: isoIn(7, 14.75),
    durationMin: 45,
    mode: "inperson",
    status: "upcoming",
  },
  {
    id: "s4",
    mentor: "Ada Lovette",
    title: "Advanced hooks",
    start: isoIn(-15, 16),
    end: isoIn(-15, 17),
    durationMin: 60,
    mode: "virtual",
    status: "completed",
  },
  {
    id: "s5",
    mentor: "Rohan Bala",
    title: "K8s readiness",
    start: isoIn(-1, 12),
    end: isoIn(-1, 13),
    durationMin: 60,
    mode: "virtual",
    status: "cancelled",
  },
];

function isoIn(daysFromNow: number, hour: number) {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  d.setHours(Math.floor(hour), (hour % 1) * 60, 0, 0);
  return d.toISOString();
}
function fmtDate(s: string) {
  const d = new Date(s);
  return d.toLocaleDateString([], {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}
function fmtTime(s: string) {
  const d = new Date(s);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

const ME_Sessions: React.FC = () => {
  const [q, setQ] = React.useState("");
  const [status, setStatus] = React.useState<"all" | Session["status"]>("all");
  const [mode, setMode] = React.useState<"all" | "virtual" | "inperson">(
    "all"
  );

  const [page, setPage] = React.useState(1);
  const perPage = 5;

  const filtered = React.useMemo(() => {
    const l = q.trim().toLowerCase();
    return DUMMY.filter((s) => {
      if (status !== "all" && s.status !== status) return false;
      if (mode !== "all" && s.mode !== mode) return false;
      if (l) {
        const hay = `${s.mentor} ${s.title}`.toLowerCase();
        if (!hay.includes(l)) return false;
      }
      return true;
    }).sort((a, b) => +new Date(a.start) - +new Date(b.start));
  }, [q, status, mode]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const rows = filtered.slice(
    (page - 1) * perPage,
    (page - 1) * perPage + perPage
  );

  React.useEffect(() => {
    setPage(1);
  }, [q, status, mode]);

  return (
    <MenteeAppLayout>
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold">My Sessions</h1>
            <p className="text-sm text-[#5E66A6] dark:text-[#A7B0FF]/85">
              Upcoming and past sessions with your mentors.
            </p>
          </div>
        </div>

        {/* Filters/Search */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-12 gap-2">
          <div className="md:col-span-5">
            <div className={`flex items-center gap-2 ${card} h-11 px-3.5`}>
              <Search
                size={16}
                className="text-[#5F679A] dark:text-[#A7B0FF]"
              />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search mentor or topic…"
                className="bg-transparent outline-none text-sm w-full"
              />
            </div>
          </div>
          <div className="md:col-span-7">
            <div className="flex flex-wrap gap-2">
              <div
                className={`flex items-center gap-2 ${card} h-11 px-3 w-full sm:w-auto`}
              >
                <Filter
                  size={16}
                  className="text-[#5F679A] dark:text-[#A7B0FF]"
                />
                <select
                  className="bg-transparent text-sm outline-none"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                >
                  <option value="all">Status: All</option>
                  <option value="upcoming">Upcoming</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <span className="h-4 w-px bg-[#E7E9FF] dark:bg-[#2B2F55]" />
                <select
                  className="bg-transparent text-sm outline-none"
                  value={mode}
                  onChange={(e) => setMode(e.target.value as any)}
                >
                  <option value="all">Mode: Any</option>
                  <option value="virtual">Virtual</option>
                  <option value="inperson">In person</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Table on md+, cards on mobile */}
        <div className="mt-6 hidden md:block">
          <div className={`border-gray-200 border rounded-xl dark:border-gray-800 overflow-x-auto`}>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[#6B72B3] dark:text-[#A7B0FF]/80">
                  <th className="px-4 py-3">Mentor</th>
                  <th className="px-4 py-3">Topic</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Time</th>
                  <th className="px-4 py-3">Mode</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E7E9FF] dark:divide-[#2B2F55]">
                {rows.map((r) => (
                  <tr key={r.id}>
                    <td className="px-4 py-3 font-semibold">{r.mentor}</td>
                    <td className="px-4 py-3">{r.title}</td>
                    <td className="px-4 py-3">{fmtDate(r.start)}</td>
                    <td className="px-4 py-3">
                      {fmtTime(r.start)} – {fmtTime(r.end)}
                    </td>
                    <td className="px-4 py-3">
                      {r.mode === "virtual" ? (
                        <span className="inline-flex items-center gap-1">
                          <Video size={14} /> Virtual
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1">
                          <MapPin size={14} /> In person
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <StatusPill s={r.status} />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <RowMenu session={r} />
                    </td>
                  </tr>
                ))}
                {rows.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-4 py-5 text-center text-[#6B72B3] dark:text-[#A7B0FF]/80"
                    >
                      No sessions match your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Cards (mobile) */}
        <div className="mt-6 grid md:hidden grid-cols-1 gap-3">
          {rows.map((r) => (
            <div key={r.id} className={`${card} p-4`}>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="text-sm font-semibold">{r.title}</div>
                  <div className="text-xs text-[#6B72B3] dark:text-[#A7B0FF]/80">
                    {r.mentor}
                  </div>
                  <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                    <Info
                      label="Date"
                      value={fmtDate(r.start)}
                      icon={<CalendarClock size={14} />}
                    />
                    <Info
                      label="Time"
                      value={`${fmtTime(r.start)} – ${fmtTime(r.end)}`}
                    />
                    <Info
                      label="Mode"
                      value={r.mode === "virtual" ? "Virtual" : "In person"}
                      icon={
                        r.mode === "virtual" ? (
                          <Video size={14} />
                        ) : (
                          <MapPin size={14} />
                        )
                      }
                    />
                    <div>
                      <StatusPill s={r.status} />
                    </div>
                  </div>
                </div>
                <RowMenu session={r} />
              </div>
            </div>
          ))}
          {rows.length === 0 && (
            <div className="text-center text-sm text-[#6B72B3] dark:text-[#A7B0FF]/80">
              No sessions match your filters.
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="mt-6 flex items-center justify-between">
          <span className="text-xs text-[#6B72B3] dark:text-[#A7B0FF]/80">
            Page {page} / {totalPages}
          </span>
          <div className="flex items-center gap-2">
            <button
              className={`${btnBase} ${btnGhost}`}
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              <ChevronLeft size={16} />
              Prev
            </button>
            <button
              className={`${btnBase} ${btnGhost}`}
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Next
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </MenteeAppLayout>
  );
};

function Info({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-[#E7E9FF] dark:border-[#2B2F55] p-2">
      <div className="text-[11px] opacity-70 inline-flex items-center gap-1">
        {icon}
        {label}
      </div>
      <div className="font-semibold">{value}</div>
    </div>
  );
}
function StatusPill({ s }: { s: Session["status"] }) {
  const map = {
    upcoming:
      "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-900",
    completed:
      "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900",
    cancelled:
      "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-900",
  } as const;
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg border text-[11px] ${map[s]}`}
    >
      {s}
    </span>
  );
}

/** More menu with View details item */
function RowMenu({ session }: { session: Session }) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  React.useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  return (
    <div className="relative rounded-xl " ref={ref}>
      <button
        className={`${btnBase} ${btnGhost} px-2 py-1`}
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="More actions"
      >
        <MoreVertical size={16} />
      </button>

      <div className={`absolute right-0 mt-2 w-48 ${card} p-1 z-20 transition ${
          open
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-1 pointer-events-none"
        }`}
        role="menu"
      >
        {/* NEW: View details */}
        <MenuItem
          icon={<Eye size={14} />}
          label="View details"
          onClick={() => {
            setOpen(false);
            navigate(`/mentee/sessions/${session.id}`);
          }}
        />
        <MenuItem
          icon={<MessageSquare size={14} />}
          label="Message mentor"
          onClick={() => {
            setOpen(false);
            navigate("/mentee/messages");
          }}
        />
        <MenuItem
          icon={<CalendarPlus size={14} />}
          label="Add to calendar"
          onClick={() => setOpen(false)}
        />
        <MenuItem
          icon={<XCircle size={14} />}
          label="Cancel session"
          danger
          onClick={() => {
            window.alert("This is a demo.");
            setOpen(false);
          }}
        />
      </div>
    </div>
  );
}

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
      className={`w-full text-left px-3 py-2 rounded-lg hover:bg-white/80 dark:hover:bg-white/[0.08] inline-flex items-center gap-2 ${
        danger ? "text-rose-600" : ""
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

export default ME_Sessions;
