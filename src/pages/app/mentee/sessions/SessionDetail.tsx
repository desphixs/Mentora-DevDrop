import React from "react";
import { useParams, useLocation, useNavigate, Link } from "react-router-dom";
import MenteeAppLayout from "../MenteeAppLayout";
import {
  ArrowLeft,
  CalendarClock,
  Video,
  MapPin,
  Clock4,
  BadgeCheck,
  MessageSquare,
  CalendarPlus,
  MoreVertical,
  Copy,
  XCircle,
  Download,
  Link2,
  CheckCircle2,
  AlarmClock,
  FileText,
} from "lucide-react";

/* ---------- UI tokens (stay consistent with your app) ---------- */
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
  "border border-[#D9DBFF] dark:border-[#30345D] text-[#1B1F3A] dark:text-[#E6E9FF] bg-white/70 dark:bg-white/[0.05] hover:bg-white/90 dark:hover:bg-white/[0.08]";

/* ---------------- Types & helpers ---------------- */
type Session = {
  id: string;
  mentor: string;
  title: string;
  start: string; // ISO
  end: string;   // ISO
  durationMin: number;
  mode: "virtual" | "inperson";
  status: "upcoming" | "completed" | "cancelled";
  locationText?: string; // for in-person
  meetingUrl?: string;   // for virtual
};

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
    year: "numeric",
  });
}
function fmtTime(s: string) {
  const d = new Date(s);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}
function minutesBetween(a: string, b: string) {
  return Math.max(0, Math.round((+new Date(b) - +new Date(a)) / 60000));
}

/** Default dataset – mirrors Sessions.tsx */
const DEFAULT_SESSIONS: Session[] = [
  {
    id: "s1",
    mentor: "Ada Lovette",
    title: "RSC performance review",
    start: isoIn(1, 10),
    end: isoIn(1, 11),
    durationMin: 60,
    mode: "virtual",
    status: "upcoming",
    meetingUrl: "https://meet.example.com/rsc-ada-s1",
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
    meetingUrl: "https://meet.example.com/sre-rohan-s2",
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
    locationText: "Brooklyn Public Library, Study Rm 2",
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
    meetingUrl: "https://meet.example.com/hooks-ada-s4",
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
    meetingUrl: "https://meet.example.com/k8s-rohan-s5",
  },
];

/* ---------------- Session Detail ---------------- */
const ME_SessionDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();

  // 1) Prefer data passed via navigate(..., { state: { session } })
  const fromState = (location.state as any)?.session as Session | undefined;

  // 2) Try to load a cached list the list page may have saved (optional)
  const cachedList: Session[] | null = (() => {
    try {
      const raw = localStorage.getItem("mentee.sessions.cache");
      return raw ? (JSON.parse(raw) as Session[]) : null;
    } catch {
      return null;
    }
  })();

  // 3) Fallback to defaults (always present)
  const canonical = fromState
    ? [fromState]
    : cachedList ?? DEFAULT_SESSIONS;

  const session =
    canonical.find((s) => s.id === id) ||
    // final fallback if cache didn't include it
    DEFAULT_SESSIONS.find((s) => s.id === id) ||
    null;

  // Private notes (autosave per-session)
  const notesKey = `mentee.session.notes.${id}`;
  const [notes, setNotes] = React.useState<string>(() => {
    return localStorage.getItem(notesKey) || "";
  });
  React.useEffect(() => {
    localStorage.setItem(notesKey, notes);
  }, [notes, notesKey]);

  // More menu
  const [menuOpen, setMenuOpen] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement | null>(null);
  React.useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onEsc);
    };
  }, []);

  // Quick helpers
  const mkIcs = () => {
    if (!session) return;
    const dt = (s: string) =>
      new Date(s)
        .toISOString()
        .replace(/[-:]/g, "")
        .replace(/\.\d{3}Z$/, "Z");
    const ics = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Mentora//Mentee//EN",
      "BEGIN:VEVENT",
      `UID:${session.id}@mentora.local`,
      `DTSTAMP:${dt(new Date().toISOString())}`,
      `DTSTART:${dt(session.start)}`,
      `DTEND:${dt(session.end)}`,
      `SUMMARY:${session.title} • ${session.mentor}`,
      `DESCRIPTION:Mentee session with ${session.mentor}`,
      session.mode === "virtual" && session.meetingUrl
        ? `URL:${session.meetingUrl}`
        : "",
      "END:VEVENT",
      "END:VCALENDAR",
    ]
      .filter(Boolean)
      .join("\r\n");
    const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `session-${session.id}.ics`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!session) {
    return (
      <MenteeAppLayout>
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          <div className={`${card} p-6 text-center`}>
            <p className="text-sm text-zinc-600 dark:text-zinc-300">
              That session wasn’t found.
            </p>
            <div className="mt-3">
              <button
                className={`${btnBase} ${btnGhost}`}
                onClick={() => navigate("/mentee/sessions")}
              >
                <ArrowLeft className="h-4 w-4" />
                Back to sessions
              </button>
            </div>
          </div>
        </div>
      </MenteeAppLayout>
    );
  }

  const durationMin =
    session.durationMin || minutesBetween(session.start, session.end);

  const StatusPill = ({ s }: { s: Session["status"] }) => {
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
  };

  return (
    <MenteeAppLayout>
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        {/* Top bar */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Link
              to="/mentee/sessions"
              className={`${btnBase} ${btnGhost}`}
              aria-label="Back to sessions"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Link>
            <h1 className="text-xl sm:text-2xl font-bold">
              {session.title}
            </h1>
            <StatusPill s={session.status} />
          </div>

          {/* More menu */}
          <div className="relative" ref={menuRef}>
            <button
              className={`${btnBase} ${btnGhost}`}
              onClick={() => setMenuOpen((v) => !v)}
              aria-haspopup="menu"
              aria-expanded={menuOpen}
              aria-label="More actions"
            >
              <MoreVertical className="h-4 w-4" />
            </button>
            <div
              role="menu"
              className={`absolute right-0 mt-2 w-56 ${card} p-1 z-20 transition ${
                menuOpen
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 -translate-y-1 pointer-events-none"
              }`}
            >
              <MenuItem
                icon={<CalendarPlus size={14} />}
                label="Add to calendar (.ics)"
                onClick={() => {
                  mkIcs();
                  setMenuOpen(false);
                }}
              />
              <MenuItem
                icon={<Link2 size={14} />}
                label="Copy session link"
                onClick={async () => {
                  await navigator.clipboard.writeText(
                    `${location.origin}/mentee/sessions/${session.id}`
                  );
                  setMenuOpen(false);
                }}
              />
              <MenuItem
                icon={<Download size={14} />}
                label="Download summary (PDF)"
                onClick={() => {
                  alert("Demo: PDF generation stub.");
                  setMenuOpen(false);
                }}
              />
            </div>
          </div>
        </div>

        {/* Meta panel */}
        <div className="mt-4 grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className={`lg:col-span-8 ${card} p-4`}>
            <div className="grid sm:grid-cols-2 gap-3">
              <Meta
                icon={<BadgeCheck size={16} />}
                label="Mentor"
                value={session.mentor}
              />
              <Meta
                icon={<CalendarClock size={16} />}
                label="Date"
                value={`${fmtDate(session.start)}`}
              />
              <Meta
                icon={<Clock4 size={16} />}
                label="Time"
                value={`${fmtTime(session.start)} – ${fmtTime(session.end)} (${durationMin} min)`}
              />
              <Meta
                icon={
                  session.mode === "virtual" ? (
                    <Video size={16} />
                  ) : (
                    <MapPin size={16} />
                  )
                }
                label="Mode"
                value={
                  session.mode === "virtual"
                    ? "Virtual"
                    : `In person${session.locationText ? ` • ${session.locationText}` : ""}`
                }
              />
            </div>

            {/* CTAs */}
            <div className="mt-4 flex flex-wrap items-center gap-2">
              {session.status === "upcoming" && session.mode === "virtual" && session.meetingUrl && (
                <a
                  href={session.meetingUrl}
                  target="_blank"
                  rel="noreferrer"
                  className={`${btnBase} ${btnSolid}`}
                >
                  <Video className="h-4 w-4" />
                  Join session
                </a>
              )}
              <Link to="/mentee/messages" className={`${btnBase} ${btnGhost}`}>
                <MessageSquare className="h-4 w-4" />
                Message mentor
              </Link>
              <button
                className={`${btnBase} ${btnGhost}`}
                onClick={() => alert("Demo: reschedule flow")}
              >
                <CalendarPlus className="h-4 w-4" />
                Reschedule
              </button>
              <button
                className={`${btnBase} ${btnGhost}`}
                onClick={() => alert("Demo: add reminder")}
              >
                <AlarmClock className="h-4 w-4" />
                Add reminder
              </button>
              {session.status === "upcoming" && (
                <button
                  className={`${btnBase} ${btnGhost} text-rose-600`}
                  onClick={() => alert("Demo: cancel flow")}
                >
                  <XCircle className="h-4 w-4" />
                  Cancel
                </button>
              )}
            </div>
          </div>

          {/* Notes */}
          <div className={`lg:col-span-4 ${card} p-4`}>
            <div className="text-sm font-semibold">Private notes</div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Only visible to you.
            </p>
            <textarea
              className={`mt-2 w-full h-40 rounded-xl border border-[#E7E9FF] dark:border-[#2B2F55] bg-white/70 dark:bg-white/[0.05] p-3 text-sm ${ringIndigo}`}
              placeholder="Jot prep questions, goals, or follow-ups…"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </div>

        {/* Timeline & resources */}
        <div className="mt-4 grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className={`lg:col-span-8 ${card} p-4`}>
            <div className="text-sm font-semibold mb-2">Timeline</div>
            <ol className="relative border-l border-zinc-200 dark:border-zinc-800 ml-2">
              <TimelineItem
                icon={<CheckCircle2 className="h-4 w-4 text-emerald-500" />}
                title="Booking confirmed"
                when={`${fmtDate(session.start)} • ${fmtTime(session.start)}`}
                desc={`You booked “${session.title}” with ${session.mentor}.`}
              />
              {session.status !== "cancelled" && (
                <TimelineItem
                  icon={<AlarmClock className="h-4 w-4 text-indigo-500" />}
                  title="Reminder scheduled"
                  when="24h & 1h before start"
                  desc="We’ll nudge you so you don’t miss it."
                />
              )}
              {session.status === "completed" && (
                <TimelineItem
                  icon={<BadgeCheck className="h-4 w-4 text-emerald-500" />}
                  title="Session completed"
                  when="Completed"
                  desc="Thanks for attending!"
                />
              )}
              {session.status === "cancelled" && (
                <TimelineItem
                  icon={<XCircle className="h-4 w-4 text-rose-500" />}
                  title="Session cancelled"
                  when="Cancelled"
                  desc="This session was cancelled."
                />
              )}
            </ol>
          </div>

          <div className={`lg:col-span-4 ${card} p-4`}>
            <div className="text-sm font-semibold mb-2">Resources</div>
            <ul className="space-y-2">
              {mockResources(session).map((r) => (
                <li
                  key={r.id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-[#E7E9FF] dark:border-[#2B2F55] px-3 py-2"
                >
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-indigo-500" />
                    <div>
                      <div className="text-sm font-medium">{r.name}</div>
                      <div className="text-[11px] text-zinc-500">
                        {r.size} • {r.kind}
                      </div>
                    </div>
                  </div>
                  <button
                    className={`${btnBase} ${btnGhost} px-2 py-1`}
                    onClick={() => alert("Demo: download")}
                  >
                    <Download className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </MenteeAppLayout>
  );
};

/* ---------------- Small bits ---------------- */
function Meta({
  icon,
  label,
  value,
}: {
  icon?: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-[#E7E9FF] dark:border-[#2B2F55] p-3">
      <div className="text-[11px] text-zinc-500 dark:text-zinc-400 inline-flex items-center gap-1">
        {icon}
        {label}
      </div>
      <div className="font-semibold">{value}</div>
    </div>
  );
}

function TimelineItem({
  icon,
  title,
  when,
  desc,
}: {
  icon?: React.ReactNode;
  title: string;
  when: string;
  desc?: string;
}) {
  return (
    <li className="ml-3 pl-4 relative py-3">
      <span className="absolute -left-2 top-[18px] h-3 w-3 rounded-full bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700" />
      <div className="flex items-start gap-2">
        <div className="mt-0.5">{icon}</div>
        <div>
          <div className="text-sm font-semibold">{title}</div>
          <div className="text-[11px] text-zinc-500">{when}</div>
          {desc && <div className="text-xs mt-1">{desc}</div>}
        </div>
      </div>
    </li>
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

/* Mock resources linked to session id for deterministic demo */
function mockResources(s: Session) {
  const base = [
    { id: "r1", name: "Prep Notes.pdf", size: "220 KB", kind: "PDF" },
    { id: "r2", name: "Example Code.zip", size: "1.2 MB", kind: "ZIP" },
    { id: "r3", name: "Reading List.txt", size: "3 KB", kind: "Text" },
  ];
  // vary slightly by id
  if (s.id === "s3") return base.slice(0, 2);
  if (s.id === "s5") return base.slice(0, 1);
  return base;
}

export default ME_SessionDetail;
