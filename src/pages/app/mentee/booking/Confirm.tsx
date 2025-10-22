import React from "react";
import MenteeAppLayout from "../MenteeAppLayout";
import { CheckCircle2, CalendarPlus, Share2, ExternalLink } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const card =
  "rounded-2xl border border-[#E7E9FF] dark:border-[#2B2F55] bg-white/80 dark:bg-white/[0.05] backdrop-blur";
const btnBase =
  "inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#6366F1]/40";
const btnSolid =
  "text-white bg-gradient-to-r from-[#16A34A] via-[#22C55E] to-[#4ADE80]";
const btnGhost =
  "border border-[#D9DBFF] dark:border-[#30345D] text-[#1B1F3A] dark:text-[#E6E9FF] bg-white/70 dark:bg-white/[0.05] hover:bg-white/90 dark:hover:bg-white/[0.08]";

function fmtDay(s: string) {
  const d = new Date(s);
  return d.toLocaleDateString([], { weekday: "long", month: "long", day: "numeric", year: "numeric" });
}
function fmtTime(s: string) {
  const d = new Date(s);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

const ME_Confirm: React.FC = () => {
  const navigate = useNavigate();
  const data = React.useMemo(() => {
    try {
      const raw = localStorage.getItem("mentee.booking.confirmed");
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  }, []);

  React.useEffect(() => {
    if (!data) navigate("/mentee/booking/select-slot");
  }, [data, navigate]);

  if (!data) return null;

  const { mentor, slot, price } = data as any;

  const downloadICS = () => {
    const dtStart = new Date(slot.start).toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
    const dtEnd   = new Date(slot.end).toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
    const ics =
`BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Mentora//Mentee Booking//EN
BEGIN:VEVENT
UID:${slot.id}@mentora.local
DTSTAMP:${dtStart}
DTSTART:${dtStart}
DTEND:${dtEnd}
SUMMARY:Session with ${mentor.name}
DESCRIPTION:Booked via Mentora. Please join on time.
END:VEVENT
END:VCALENDAR`;
    const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "mentora-session.ics"; a.click();
    URL.revokeObjectURL(url);
  };

  const shareText = `Session booked with ${mentor.name} on ${fmtDay(slot.start)} at ${fmtTime(slot.start)}.`;

  return (
    <MenteeAppLayout>
      <div className="px-4 sm:px-6 lg:px-8 py-10">
        <div className="max-w-2xl mx-auto text-center">
          <CheckCircle2 className="mx-auto h-16 w-16 text-emerald-500" />
          <h1 className="mt-3 text-2xl font-bold">Booking confirmed</h1>
          <p className="mt-1 text-sm text-[#5E66A6] dark:text-[#A7B0FF]/85">
            We’ve emailed you the details. You can add this session to your calendar below.
          </p>
        </div>

        <div className="mt-6 max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className={`${card} p-4`}>
            <div className="text-sm font-semibold">Session details</div>
            <div className="mt-2 text-sm">
              <div className="flex items-center justify-between"><span>Mentor</span><span className="font-semibold">{mentor.name}</span></div>
              <div className="flex items-center justify-between"><span>Date</span><span className="font-semibold">{fmtDay(slot.start)}</span></div>
              <div className="flex items-center justify-between"><span>Time</span><span className="font-semibold">{fmtTime(slot.start)} – {fmtTime(slot.end)}</span></div>
              <div className="flex items-center justify-between"><span>Duration</span><span className="font-semibold">{slot.durationMin} min</span></div>
            </div>
          </div>

          <div className={`${card} p-4`}>
            <div className="text-sm font-semibold">Payment</div>
            <div className="mt-2 text-sm">
              <div className="flex items-center justify-between"><span>Subtotal</span><span className="font-semibold">${price.base.toFixed(2)}</span></div>
              <div className="flex items-center justify-between"><span>Fee</span><span className="font-semibold">${price.fee.toFixed(2)}</span></div>
              <div className="flex items-center justify-between"><span>Discount</span><span className="font-semibold">-{((price.base + price.fee) - price.total).toFixed(2)}</span></div>
              <hr className="my-2 border-[#E7E9FF] dark:border-[#2B2F55]" />
              <div className="flex items-center justify-between"><span>Total paid</span><span className="font-semibold">${price.total.toFixed(2)}</span></div>
            </div>
          </div>
        </div>

        <div className="mt-6 max-w-3xl mx-auto flex flex-wrap items-center justify-center gap-3">
          <button className={`${btnBase} ${btnGhost}`} onClick={downloadICS}>
            <CalendarPlus size={16}/> Add to calendar
          </button>
          <a
            className={`${btnBase} ${btnGhost}`}
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`}
            target="_blank" rel="noreferrer"
          >
            <Share2 size={16}/> Share
          </a>
          <Link to="/mentee/sessions" className={`${btnBase} ${btnSolid}`}>
            Go to My Sessions <ExternalLink size={16}/>
          </Link>
        </div>
      </div>
    </MenteeAppLayout>
  );
};

export default ME_Confirm;
