import React from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import MentorAppLayout from "../MentorAppLayout";
import {
  ChevronLeft, Video, MapPin, Clock, BadgeDollarSign, Users, User, Mail, Phone, CalendarClock,
  MoreVertical, CheckCircle2, XCircle, Undo2, FileText, Star, Paperclip
} from "lucide-react";

type SessionStatus = "requested" | "scheduled" | "completed" | "cancelled" | "refunded" | "no-show";
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
  attachments?: { name: string; type: "file" | "image" }[];
};

const card = "rounded-2xl border border-[#E7E9FF] dark:border-[#2B2F55] bg-white/80 dark:bg-white/[0.05] backdrop-blur";
const btnBase =
  "inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#6366F1]/40";
const btnSolid = "text-white bg-gradient-to-r from-[#4F46E5] via-[#6366F1] to-[#8B5CF6]";
const btnGhost = "border border-[#D9DBFF] dark:border-[#30345D] text-[#1B1F3A] dark:text-[#E6E9FF] bg-white/70 dark:bg-white/[0.05]";
const pill = "inline-flex items-center gap-2 rounded-full border border-[#E7E9FF] dark:border-[#2B2F55] bg-white/70 dark:bg-white/[0.05] px-3 py-1 text-[11px] font-semibold";

const fmtTime = (iso: string) => new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
const fmtDay = (iso: string) => new Date(iso).toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" });

const fallback: Session = {
  id: "sX",
  title: "Session",
  mentee: "Unknown",
  menteeEmail: "unknown@example.com",
  tz: "UTC",
  type: "1:1",
  durationMin: 45,
  price: 0,
  currency: "USD",
  startISO: new Date().toISOString(),
  endISO: new Date(Date.now() + 45 * 60000).toISOString(),
  provider: "Google Meet",
  meetingLink: "#",
  tags: [],
  status: "scheduled",
};

export default function SessionDetail() {
  const params = useParams();
  const id = params.id!;
  const navigate = useNavigate();
  const store = JSON.parse(localStorage.getItem("mentora.sessions") || "null") as Session[] | null;
  const session = (store?.find((s) => s.id === id) as Session | undefined) ?? fallback;

  // modal
  const [open, setOpen] = React.useState(false);
  const updateStatus = (status: SessionStatus) => {
    if (!store) return;
    const next = store.map((s) => (s.id === id ? { ...s, status } : s));
    localStorage.setItem("mentora.sessions", JSON.stringify(next));
    setOpen(false);
    // force re-read
    window.location.reload();
  };

  return (
    <MentorAppLayout>
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button className={`${btnBase} ${btnGhost}`} onClick={() => navigate(-1)}>
              <ChevronLeft size={16} /> Back
            </button>
            <h1 className="text-2xl font-bold text-[#0F132E] dark:text-[#E9ECFF] truncate">{session.title}</h1>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <a href={session.meetingLink} className={`${btnBase} ${btnSolid}`}><Video size={16} /> Join</a>
            <button className={`${btnBase} ${btnGhost}`} onClick={() => setOpen(true)}>
              <MoreVertical size={16} /> Actions
            </button>
          </div>
        </div>

        {/* Top meta */}
        <div className="mt-4 grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className={`lg:col-span-8 ${card} p-4`}>
            <div className="flex flex-wrap items-center gap-2">
              <span className={`${pill} !py-0.5`}><CalendarClock size={14} /> {fmtDay(session.startISO)} · {fmtTime(session.startISO)}</span>
              <span className={`${pill} !py-0.5`}><Clock size={14} /> {session.durationMin}m</span>
              <span className={`${pill} !py-0.5`}><BadgeDollarSign size={14} /> {session.currency} {session.price}</span>
              <span className={`${pill} !py-0.5`}><Video size={14} /> {session.provider}</span>
              <span className={`${pill} !py-0.5`}><MapPin size={14} /> {session.tz}</span>
              <span className={`${pill} !py-0.5`}>{session.type === "group" ? <Users size={14} /> : <User size={14} />} {session.type}</span>
            </div>

            <div className="mt-4 grid sm:grid-cols-2 gap-3">
              <div className={`${card} p-3`}>
                <div className="text-sm font-semibold">Mentee</div>
                <div className="mt-1 text-sm">{session.mentee}</div>
                <div className="mt-1 flex items-center gap-2 text-[12px] text-[#6B72B3] dark:text-[#A7B0FF]/80">
                  <Mail size={12} /> {session.menteeEmail}
                </div>
                <div className="mt-1 flex items-center gap-2 text-[12px] text-[#6B72B3] dark:text-[#A7B0FF]/80">
                  <Phone size={12} /> n/a
                </div>
              </div>
              <div className={`${card} p-3`}>
                <div className="text-sm font-semibold">Session notes</div>
                <div className="mt-1 text-sm">{session.notes || "—"}</div>
                {session.tags.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {session.tags.map((t) => (
                      <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-[#EEF2FF] dark:bg-white/[0.06] text-[#1B1F3A] dark:text-[#E6E9FF] border border-[#E7E9FF] dark:border-[#2B2F55]">#{t}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {session.attachments && session.attachments.length > 0 && (
              <div className="mt-4">
                <div className="text-sm font-semibold">Attachments</div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {session.attachments.map((a) => (
                    <span key={a.name} className="px-2 py-1 rounded-lg border border-[#E7E9FF] dark:border-[#2B2F55] bg-white/70 dark:bg-white/[0.06] inline-flex items-center gap-2 text-sm">
                      <Paperclip size={14} /> {a.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className={`lg:col-span-4 ${card} p-4`}>
            <div className="text-sm font-semibold">Status</div>
            <div className="mt-1 text-sm capitalize">{session.status}</div>

            <div className="mt-4 text-sm font-semibold">After the call</div>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <Link to="/dashboard/reviews" className={`${btnBase} ${btnGhost}`}>
                <Star size={16} /> Reviews
              </Link>
              <button className={`${btnBase} ${btnGhost}`}>
                <FileText size={16} /> Notes doc
              </button>
              <button className={`${btnBase} ${btnGhost}`}>
                <CheckCircle2 size={16} /> Mark done
              </button>
              <button className={`${btnBase} ${btnGhost}`}>
                <Undo2 size={16} /> Reschedule
              </button>
            </div>
          </div>
        </div>

        {/* Actions modal */}
        {open && (
          <div className="fixed inset-0 z-50" onClick={() => setOpen(false)}>
            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
            <div className="relative mx-auto mt-24 w-full max-w-sm rounded-2xl border border-[#E7E9FF] dark:border-[#2B2F55] bg-white/95 dark:bg-[#0B0F2A]/95 p-4" onClick={(e) => e.stopPropagation()}>
              <div className="text-sm font-semibold">Session actions</div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <button className={`${btnBase} ${btnGhost}`} onClick={() => updateStatus("cancelled")}><XCircle size={16} /> Cancel</button>
                <button className={`${btnBase} ${btnGhost}`} onClick={() => updateStatus("refunded")}><Undo2 size={16} /> Refund</button>
                <button className={`${btnBase} ${btnGhost}`} onClick={() => updateStatus("scheduled")}><CheckCircle2 size={16} /> Mark scheduled</button>
                <button className={`${btnBase} ${btnGhost}`} onClick={() => updateStatus("completed")}><CheckCircle2 size={16} /> Mark completed</button>
              </div>
              <div className="mt-4 flex justify-end">
                <button className={`${btnBase} ${btnSolid}`} onClick={() => setOpen(false)}>Close</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </MentorAppLayout>
  );
}
