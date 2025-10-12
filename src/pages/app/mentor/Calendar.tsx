import React from "react";
import MentorAppLayout from "./MentorAppLayout";
import {
  Calendar as CalendarIcon,
  CalendarCheck2,
  Clock,
  Filter,
  Search,
  ChevronLeft,
  ChevronRight,
  Plus,
  Download,
  CheckCircle2,
  XCircle,
  MapPin,
  Link2,
  Users,
  X,
} from "lucide-react";

/* ---------------------------
   Indigo glass UI tokens (local)
---------------------------- */
const ringIndigo =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#6366F1]/40";
const card =
  "rounded-2xl border border-[#E7E9FF] dark:border-[#2B2F55] bg-white/80 dark:bg-white/[0.05] backdrop-blur";
const btnBase =
  "inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-semibold transition " + ringIndigo;
const btnSolid =
  "text-white bg-gradient-to-r from-[#4F46E5] via-[#6366F1] to-[#8B5CF6] shadow-[0_10px_30px_rgba(79,70,229,0.35)] hover:shadow-[0_16px_40px_rgba(79,70,229,0.45)]";
const btnGhost =
  "border border-[#D9DBFF] dark:border-[#30345D] text-[#1B1F3A] dark:text-[#E6E9FF] bg-white/70 dark:bg-white/[0.05] hover:bg-white/90 dark:hover:bg-white/[0.08]";
const badge =
  "inline-flex items-center gap-2 rounded-full border border-[#E7E9FF] dark:border-[#2B2F55] bg-white/70 dark:bg-white/[0.05] px-3 py-1 text-[11px] font-semibold";

/* ---------------------------
   Types & dummy data
---------------------------- */
type EventType = "1:1" | "group" | "personal" | "blocked";
type EventStatus = "pending" | "confirmed" | "completed" | "canceled";

type CalEvent = {
  id: string;
  title: string;
  mentee?: string;
  type: EventType;
  status: EventStatus;
  start: string; // ISO
  end: string;   // ISO
  location?: string;
  meet?: string;
};

const now = new Date();

function isoOf(y: number, m: number, d: number, hh = 9, mm = 0) {
  const dt = new Date(y, m, d, hh, mm, 0, 0);
  return dt.toISOString();
}

function seedMonth(year: number, monthIndex: number): CalEvent[] {
  return [
    {
      id: "e1",
      title: "Frontend code review",
      mentee: "Tunde",
      type: "1:1",
      status: "confirmed",
      start: isoOf(year, monthIndex, 6, 10, 30),
      end: isoOf(year, monthIndex, 6, 11, 15),
      location: "Google Meet",
      meet: "https://meet.example.com/abc",
    },
    {
      id: "e2",
      title: "System design workshop",
      type: "group",
      status: "pending",
      start: isoOf(year, monthIndex, 12, 14, 0),
      end: isoOf(year, monthIndex, 12, 15, 0),
      location: "Zoom",
      meet: "https://zoom.us/j/xyz",
    },
    {
      id: "e3",
      title: "Deep work (personal)",
      type: "personal",
      status: "confirmed",
      start: isoOf(year, monthIndex, 15, 9, 0),
      end: isoOf(year, monthIndex, 15, 11, 0),
      location: "Home office",
    },
    {
      id: "e4",
      title: "Backend performance review",
      mentee: "Riya",
      type: "1:1",
      status: "completed",
      start: isoOf(year, monthIndex, 18, 16, 0),
      end: isoOf(year, monthIndex, 18, 16, 45),
      location: "Google Meet",
      meet: "https://meet.example.com/def",
    },
    {
      id: "e5",
      title: "Focus block",
      type: "blocked",
      status: "confirmed",
      start: isoOf(year, monthIndex, 22, 12, 0),
      end: isoOf(year, monthIndex, 22, 13, 0),
      location: "Do not disturb",
    },
  ];
}

/* ---------------------------
   Date helpers
---------------------------- */
const daysInMonth = (y: number, m: number) => new Date(y, m + 1, 0).getDate();
const startOfMonth = (y: number, m: number) => new Date(y, m, 1).getDay(); // 0 Sun..6 Sat

const monthNames = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

function parseISO(iso: string) {
  const d = new Date(iso);
  return { y: d.getFullYear(), m: d.getMonth(), d: d.getDate(), h: d.getHours(), min: d.getMinutes() };
}
function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

/* ---------------------------
   Component
---------------------------- */
const Calendar: React.FC = () => {
  // current visible month
  const [cursor, setCursor] = React.useState(() => new Date(now.getFullYear(), now.getMonth(), 1));
  // events (persist for optimistic UX)
  const [events, setEvents] = React.useState<CalEvent[]>(
    () => JSON.parse(localStorage.getItem("mentora.calendar") || "null") ?? seedMonth(cursor.getFullYear(), cursor.getMonth())
  );
  React.useEffect(() => {
    localStorage.setItem("mentora.calendar", JSON.stringify(events));
  }, [events]);

  // Controls
  const [query, setQuery] = React.useState("");
  const [status, setStatus] = React.useState<EventStatus | "all">("all"); // filter status
  const [type, setType] = React.useState<EventType | "all">("all");
  const [view, setView] = React.useState<"month" | "agenda">("month");

  // Date Navigator (Years → Months → Days)
  const [navOpen, setNavOpen] = React.useState(false);
  const [navYear, setNavYear] = React.useState(cursor.getFullYear());
  const [navMonth, setNavMonth] = React.useState(cursor.getMonth());
  const YEAR_MIN = 2000;
  const YEAR_MAX = 2025; // per your spec “2000 to 2025”

  // Scroll focused year/month into view when opening
  const yearsRef = React.useRef<HTMLDivElement | null>(null);
  const monthsRef = React.useRef<HTMLDivElement | null>(null);
  React.useEffect(() => {
    if (!navOpen) return;
    const yEl = yearsRef.current?.querySelector<HTMLButtonElement>(`[data-year="${navYear}"]`);
    yEl?.scrollIntoView({ block: "center" });
    const mEl = monthsRef.current?.querySelector<HTMLButtonElement>(`[data-month="${navMonth}"]`);
    mEl?.scrollIntoView({ block: "center" });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setNavOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [navOpen, navYear, navMonth]);

  // Filtered (search + filters)
  const visibleEvents = React.useMemo(() => {
    const lower = query.trim().toLowerCase();
    return events.filter((e) => {
      if (status !== "all" && e.status !== status) return false;
      if (type !== "all" && e.type !== type) return false;
      if (!lower) return true;
      const hay = `${e.title} ${e.mentee ?? ""} ${e.type} ${e.status} ${e.location ?? ""}`.toLowerCase();
      return hay.includes(lower);
    });
  }, [events, query, status, type]);

  // Agenda = events in the current month only
  const monthEvents = React.useMemo(() => {
    const y = cursor.getFullYear();
    const m = cursor.getMonth();
    return visibleEvents
      .filter((e) => {
        const { y: ey, m: em } = parseISO(e.start);
        return ey === y && em === m;
      })
      .sort((a, b) => +new Date(a.start) - +new Date(b.start));
  }, [visibleEvents, cursor]);

  const goPrevMonth = () => setCursor((c) => new Date(c.getFullYear(), c.getMonth() - 1, 1));
  const goNextMonth = () => setCursor((c) => new Date(c.getFullYear(), c.getMonth() + 1, 1));
  const resetToday = () => setCursor(new Date(now.getFullYear(), now.getMonth(), 1));

  // Quick actions (optimistic) — avoid naming clash with filter setter
  const setEventStatus = (id: string, s: EventStatus) =>
    setEvents((prev) => prev.map((ev) => (ev.id === id ? { ...ev, status: s } : ev)));

  const quickAdd = () => {
    const title = window.prompt("Title?");
    if (!title) return;
    const d = window.prompt(
      "Date (YYYY-MM-DD)?",
      `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, "0")}-15`
    );
    if (!d) return;
    const start = `${d}T10:00:00.000Z`;
    const end = `${d}T10:45:00.000Z`;
    const ev: CalEvent = {
      id: "e" + Math.random().toString(36).slice(2),
      title,
      type: "1:1",
      status: "pending",
      start,
      end,
      mentee: "New mentee",
      location: "Google Meet",
    };
    setEvents((prev) => [ev, ...prev]);
  };

  // Month grid data
  const y = cursor.getFullYear();
  const m = cursor.getMonth();
  const din = daysInMonth(y, m);
  const padStart = startOfMonth(y, m);
  const cells = padStart + din;
  const rows = Math.ceil(cells / 7);

  // Styles per type
  const typePill: Record<EventType, string> = {
    "1:1": "bg-[#EEF2FF] text-[#1B1F3A] dark:bg-white/[0.06] dark:text-[#E6E9FF]",
    group: "bg-[#EDE9FE] text-[#1B1F3A] dark:bg-white/[0.06] dark:text-[#E6E9FF]",
    personal: "bg-[#E0E7FF] text-[#1B1F3A] dark:bg-white/[0.06] dark:text-[#E6E9FF]",
    blocked: "bg-[#F3F4F6] text-[#1B1F3A] dark:bg-white/[0.06] dark:text-[#E6E9FF]",
  };

  const statusDot: Record<EventStatus, string> = {
    pending: "bg-amber-500",
    confirmed: "bg-indigo-500",
    completed: "bg-emerald-500",
    canceled: "bg-rose-500",
  };

  const today = new Date();

  // Build days for Date Navigator’s right column
  const navDays = React.useMemo(() => {
    const dd = daysInMonth(navYear, navMonth);
    return Array.from({ length: dd }, (_, i) => i + 1);
  }, [navYear, navMonth]);

  return (
    <MentorAppLayout>
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        {/* Title */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-[#0F132E] dark:text-[#E9ECFF]">Calendar</h1>
            <p className="text-sm text-[#5E66A6] dark:text-[#A7B0FF]/85">Stay on schedule — sessions, group events, and focus blocks.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button className={`${btnBase} ${btnGhost}`} onClick={quickAdd}>
              <Plus size={16} /> Quick add
            </button>
            <button className={`${btnBase} ${btnGhost}`}>
              <Download size={16} /> Export (.ics)
            </button>
          </div>
        </div>

        {/* Controls */}
        <div className="mt-6 flex flex-wrap items-center gap-3">
          {/* Month nav */}
          <div className={`flex items-center gap-2 ${card} px-2 py-1`}>
            <button className={`${btnBase} ${btnGhost} px-2 py-1`} onClick={goPrevMonth} aria-label="Previous month">
              <ChevronLeft size={16} />
            </button>

            {/* Clickable label opens Date Navigator */}
            <button
              className="px-3 py-1 text-sm font-semibold text-[#0F1536] dark:text-[#E7E9FF] hover:text-[#4F46E5] dark:hover:text-[#A7B0FF]"
              onClick={() => {
                setNavYear(cursor.getFullYear());
                setNavMonth(cursor.getMonth());
                setNavOpen(true);
              }}
              aria-haspopup="dialog"
            >
              {monthNames[m]} {y}
            </button>

            <button className={`${btnBase} ${btnGhost} px-2 py-1`} onClick={goNextMonth} aria-label="Next month">
              <ChevronRight size={16} />
            </button>
            <button className={`${btnBase} ${btnGhost} px-2 py-1`} onClick={resetToday}>
              Today
            </button>
            <button
              className={`${btnBase} ${btnGhost} px-2 py-1`}
              onClick={() => {
                setNavYear(cursor.getFullYear());
                setNavMonth(cursor.getMonth());
                setNavOpen(true);
              }}
            >
              <CalendarIcon size={16} /> Jump
            </button>
          </div>

          {/* Search */}
          <div className={`flex items-center gap-2 ${card} h-11 px-3.5`}>
            <Search size={16} className="text-[#5F679A] dark:text-[#A7B0FF]" />
            <input
              className="bg-transparent outline-none text-sm text-[#101436] dark:text-[#EEF0FF] placeholder-[#7A81B4] dark:placeholder-[#A7B0FF]/80"
              placeholder="Search events, mentees, locations…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <span className={`${badge} text-[#6065A6] dark:text-[#A7B0FF]/80`}><Filter size={14} /> Filters</span>

            <select
              className={`${card} h-11 px-3 text-sm ${ringIndigo}`}
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
            >
              <option value="all">Status: All</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="canceled">Canceled</option>
            </select>

            <select
              className={`${card} h-11 px-3 text-sm ${ringIndigo}`}
              value={type}
              onChange={(e) => setType(e.target.value as any)}
            >
              <option value="all">Type: All</option>
              <option value="1:1">1:1</option>
              <option value="group">Group</option>
              <option value="personal">Personal</option>
              <option value="blocked">Blocked</option>
            </select>

            <select
              className={`${card} h-11 px-3 text-sm ${ringIndigo}`}
              value={view}
              onChange={(e) => setView(e.target.value as any)}
            >
              <option value="month">Month</option>
              <option value="agenda">Agenda</option>
            </select>
          </div>
        </div>

        {/* Views */}
        {view === "month" ? (
          <div className={`${card} mt-6 p-4`}>
            {/* weekday header */}
            <div className="grid grid-cols-7 text-[11px] text-[#6B72B3] dark:text-[#A7B0FF]/80">
              {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d) => (
                <div key={d} className="px-2 py-1">{d}</div>
              ))}
            </div>

            {/* month grid */}
            <div className="grid grid-cols-7 gap-2 mt-1">
              {Array.from({ length: rows * 7 }).map((_, idx) => {
                const dayNum = idx - padStart + 1;
                const inMonth = dayNum >= 1 && dayNum <= din;
                const cellDate = new Date(y, m, Math.max(1, Math.min(dayNum, din)));
                const isToday = inMonth && isSameDay(cellDate, today);

                const dayEvents = inMonth
                  ? monthEvents.filter((ev) => isSameDay(new Date(ev.start), cellDate))
                  : [];

                return (
                  <div
                    key={idx}
                    className={`rounded-xl border border-[#E7E9FF] dark:border-[#2B2F55] min-h-[104px] p-2 ${inMonth ? "bg-white/70 dark:bg-white/[0.04]" : "bg-white/40 dark:bg-white/[0.02] opacity-70"}`}
                  >
                    <div className="flex items-center justify-between">
                      <button
                        className={`text-[11px] ${isToday ? "text-[#4F46E5] font-bold" : "text-[#6B72B3] dark:text-[#A7B0FF]/80"}`}
                        onClick={() => {
                          // Open navigator initialized to this day
                          setNavYear(cellDate.getFullYear());
                          setNavMonth(cellDate.getMonth());
                          setNavOpen(true);
                        }}
                        title="Jump"
                      >
                        {inMonth ? dayNum : ""}
                      </button>
                      {isToday && <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#4F46E5] shadow-[0_0_10px_rgba(79,70,229,0.6)]" />}
                    </div>

                    <div className="mt-2 flex flex-col gap-1">
                      {dayEvents.slice(0, 3).map((ev) => (
                        <button
                          key={ev.id}
                          className={`w-full text-left px-2 py-1 rounded-lg text-[11px] ${typePill[ev.type]} hover:bg-white/90 dark:hover:bg-white/[0.08] transition`}
                          title={`${ev.title} • ${new Date(ev.start).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`}
                          onClick={() => {
                            const next: Record<EventStatus, EventStatus> = {
                              pending: "confirmed",
                              confirmed: "completed",
                              completed: "canceled",
                              canceled: "pending",
                            };
                            setEventStatus(ev.id, next[ev.status]);
                          }}
                        >
                          <div className="flex items-center justify-between">
                            <span className="truncate">{ev.title}</span>
                            <span className={`ml-2 inline-block h-1.5 w-1.5 rounded-full ${statusDot[ev.status]}`} />
                          </div>
                          <div className="text-[10px] opacity-70 truncate">
                            {ev.mentee ? `with ${ev.mentee}` : ev.type === "group" ? "Group session" : ev.location ?? "—"}
                          </div>
                        </button>
                      ))}
                      {dayEvents.length > 3 && (
                        <div className="text-[11px] text-[#6B72B3] dark:text-[#A7B0FF]/80">+{dayEvents.length - 3} more</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          // Agenda view
          <div className={`${card} mt-6 p-4`}>
            <div className="flex flex-col gap-3">
              {monthEvents.length === 0 && (
                <div className="text-sm text-[#6B72B3] dark:text-[#A7B0FF]/80 p-4">No events this month.</div>
              )}

              {monthEvents.map((ev) => {
                const start = new Date(ev.start);
                const end = new Date(ev.end);
                return (
                  <div key={ev.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#E7E9FF] dark:border-[#2B2F55] bg-white/70 dark:bg-white/[0.04] p-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 grid place-items-center rounded-xl border border-[#E7E9FF] dark:border-[#2B2F55]">
                        <CalendarCheck2 className="text-indigo-500" size={18} />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-[#0F1536] dark:text-[#E7E9FF]">{ev.title}</div>
                        <div className="flex flex-wrap items-center gap-2 text-[11px] text-[#6B72B3] dark:text-[#A7B0FF]/80">
                          <Clock size={12} />
                          {start.toLocaleDateString()} · {start.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} – {end.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          {ev.mentee && (<><span>·</span><Users size={12} /> {ev.mentee}</>)}
                          {ev.location && (<><span>·</span><MapPin size={12} /> {ev.location}</>)}
                          {ev.meet && (<><span>·</span><Link2 size={12} /> link</>)}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`px-2 py-1 rounded-lg text-[11px] ${typePill[ev.type]}`}>{ev.type}</span>
                      <span className="px-2 py-1 rounded-lg text-[11px] border border-[#E7E9FF] dark:border-[#2B2F55]">
                        status: <b className="capitalize">{ev.status}</b>
                      </span>

                      <button className={`${btnBase} ${btnGhost}`} onClick={() => setEventStatus(ev.id, "confirmed")}>
                        <CheckCircle2 size={14} /> Confirm
                      </button>
                      <button className={`${btnBase} ${btnGhost}`} onClick={() => setEventStatus(ev.id, "canceled")}>
                        <XCircle size={14} /> Cancel
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ---------------- Date Navigator (overlay) ---------------- */}
        {navOpen && (
          <div
            className="fixed inset-0 z-50"
            role="dialog"
            aria-modal="true"
            aria-label="Choose date"
          >
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setNavOpen(false)}
            />

            {/* Modal */}
            <div className="relative mx-auto mt-16 w-[95%] max-w-5xl">
              <div className={`${card} p-4 sm:p-6`}>
                {/* Header */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <CalendarIcon size={18} className="text-indigo-500" />
                    <div className="text-sm font-semibold text-[#0F1536] dark:text-[#E7E9FF]">
                      Jump to date <span className="text-[#6B72B3] dark:text-[#A7B0FF]/70">(2000–2025)</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className={`${btnBase} ${btnGhost}`} onClick={() => {
                      setNavYear(now.getFullYear());
                      setNavMonth(now.getMonth());
                    }}>
                      Today
                    </button>
                    <button className={`${btnBase} ${btnGhost}`} onClick={() => setNavOpen(false)} aria-label="Close">
                      <X size={16} /> Close
                    </button>
                  </div>
                </div>

                {/* Body: 3 columns */}
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Years */}
                  <div className="rounded-xl border border-[#E7E9FF] dark:border-[#2B2F55] bg-white/70 dark:bg-white/[0.04] overflow-hidden">
                    <div className="px-3 py-2 text-xs font-semibold text-[#6B72B3] dark:text-[#A7B0FF]/80 border-b border-[#E7E9FF] dark:border-[#2B2F55]">
                      Years
                    </div>
                    <div ref={yearsRef} className="max-h-[50vh] overflow-auto p-2 space-y-1">
                      {Array.from({ length: YEAR_MAX - YEAR_MIN + 1 }, (_, i) => YEAR_MIN + i).map((yr) => {
                        const active = yr === navYear;
                        return (
                          <button
                            key={yr}
                            data-year={yr}
                            className={`w-full text-left px-3 py-2 rounded-lg text-sm ${
                              active
                                ? "bg-gradient-to-r from-[#EEF2FF] to-[#EDE9FE] text-[#1B1F3A] dark:bg-white/[0.08] dark:text-[#E6E9FF]"
                                : "hover:bg-white/70 dark:hover:bg-white/[0.06]"
                            }`}
                            onClick={() => setNavYear(yr)}
                          >
                            {yr}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Months */}
                  <div className="rounded-xl border border-[#E7E9FF] dark:border-[#2B2F55] bg-white/70 dark:bg-white/[0.04] overflow-hidden">
                    <div className="px-3 py-2 text-xs font-semibold text-[#6B72B3] dark:text-[#A7B0FF]/80 border-b border-[#E7E9FF] dark:border-[#2B2F55]">
                      Months
                    </div>
                    <div ref={monthsRef} className="max-h-[50vh] overflow-auto p-2 grid grid-cols-2 gap-2">
                      {monthNames.map((mm, idx) => {
                        const active = idx === navMonth;
                        return (
                          <button
                            key={mm}
                            data-month={idx}
                            className={`px-3 py-2 rounded-lg text-sm ${
                              active
                                ? "bg-gradient-to-r from-[#EEF2FF] to-[#EDE9FE] text-[#1B1F3A] dark:bg-white/[0.08] dark:text-[#E6E9FF]"
                                : "hover:bg-white/70 dark:hover:bg-white/[0.06]"
                            }`}
                            onClick={() => setNavMonth(idx)}
                          >
                            {mm}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Days */}
                  <div className="rounded-xl border border-[#E7E9FF] dark:border-[#2B2F55] bg-white/70 dark:bg-white/[0.04] overflow-hidden">
                    <div className="px-3 py-2 text-xs font-semibold text-[#6B72B3] dark:text-[#A7B0FF]/80 border-b border-[#E7E9FF] dark:border-[#2B2F55]">
                      Days in {monthNames[navMonth]} {navYear}
                    </div>
                    <div className="max-h-[50vh] overflow-auto p-2">
                      {/* Weekday header */}
                      <div className="grid grid-cols-7 text-[11px] text-[#6B72B3] dark:text-[#A7B0FF]/80 px-1">
                        {["S","M","T","W","T","F","S"].map((d) => <div key={d} className="text-center py-1">{d}</div>)}
                      </div>

                      {/* Padded grid */}
                      {(() => {
                        const startPad = startOfMonth(navYear, navMonth);
                        const total = startPad + navDays.length;
                        const r = Math.ceil(total / 7);
                        return (
                          <div className="grid grid-cols-7 gap-1 mt-1 px-1">
                            {Array.from({ length: r * 7 }).map((_, idx) => {
                              const dayNum = idx - startPad + 1;
                              const inMonth = dayNum >= 1 && dayNum <= navDays.length;
                              const isToday =
                                inMonth &&
                                navYear === today.getFullYear() &&
                                navMonth === today.getMonth() &&
                                dayNum === today.getDate();

                              return (
                                <button
                                  key={idx}
                                  disabled={!inMonth}
                                  className={`h-9 rounded-lg text-[12px] ${
                                    inMonth
                                      ? "border border-[#E7E9FF] dark:border-[#2B2F55] hover:bg-white/80 dark:hover:bg-white/[0.06] text-[#101436] dark:text-[#EEF0FF]"
                                      : "opacity-50 cursor-default border border-transparent"
                                  } ${isToday ? "ring-1 ring-[#4F46E5]" : ""}`}
                                  onClick={() => {
                                    // Jump to chosen month (we track month view; selecting day still sets month)
                                    setCursor(new Date(navYear, navMonth, 1));
                                    setNavOpen(false);
                                  }}
                                >
                                  {inMonth ? dayNum : ""}
                                </button>
                              );
                            })}
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                </div>

                {/* Footer actions */}
                <div className="mt-4 flex items-center justify-end gap-2">
                  <button className={`${btnBase} ${btnGhost}`} onClick={() => setNavOpen(false)}>
                    Cancel
                  </button>
                  <button
                    className={`${btnBase} ${btnSolid}`}
                    onClick={() => {
                      setCursor(new Date(navYear, navMonth, 1));
                      setNavOpen(false);
                    }}
                  >
                    Jump to {monthNames[navMonth]} {navYear}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* ---------------- /Date Navigator ---------------- */}
      </div>
    </MentorAppLayout>
  );
};

export default Calendar;
