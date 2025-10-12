import React from "react";
import MentorAppLayout from "./MentorAppLayout";
import {
  Clock,
  Globe2,
  Plus,
  Trash2,
  Edit3,
  Save,
  RefreshCw,
  Check,
  ChevronRight,
  ChevronLeft,
  Search,
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
const chip =
  "inline-flex items-center gap-2 rounded-lg border border-[#E7E9FF] dark:border-[#2B2F55] px-2 py-1 text-[11px] bg-white/60 dark:bg-white/[0.04]";

/* ---------------------------
   Types & dummy state
---------------------------- */
type DayKey = "Sun" | "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat";
type Range = { id: string; start: string; end: string }; // "09:00".."17:30"

type AvailabilityState = Record<DayKey, Range[]>;

const defaultAvail: AvailabilityState = {
  Sun: [],
  Mon: [
    { id: "m1", start: "09:00", end: "12:00" },
    { id: "m2", start: "14:00", end: "17:30" },
  ],
  Tue: [{ id: "t1", start: "10:00", end: "13:00" }],
  Wed: [{ id: "w1", start: "11:00", end: "16:00" }],
  Thu: [{ id: "th1", start: "09:00", end: "12:30" }],
  Fri: [{ id: "f1", start: "13:00", end: "17:00" }],
  Sat: [],
};

const dayOrder: DayKey[] = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/* ---------------------------
   Helpers
---------------------------- */
function id() {
  return Math.random().toString(36).slice(2);
}

function timeToMinutes(t: string) {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

function overlaps(a: Range, b: Range) {
  return timeToMinutes(a.start) < timeToMinutes(b.end) && timeToMinutes(b.start) < timeToMinutes(a.end);
}

/* ---------------------------
   Component
---------------------------- */
const Availability: React.FC = () => {
  // persist to localStorage
  const [avail, setAvail] = React.useState<AvailabilityState>(() => {
    const raw = localStorage.getItem("mentora.availability");
    return raw ? JSON.parse(raw) : defaultAvail;
  });
  React.useEffect(() => {
    localStorage.setItem("mentora.availability", JSON.stringify(avail));
  }, [avail]);

  // global settings
  const [tz, setTz] = React.useState("Africa/Lagos");
  const [slot, setSlot] = React.useState(45); // minutes per session
  const [buffer, setBuffer] = React.useState(10); // minutes
  const [notice, setNotice] = React.useState(6); // hours min notice
  const [search, setSearch] = React.useState(""); // filter days by name

  // inline add/edit UI state
  const [editing, setEditing] = React.useState<
    { day: DayKey; rangeId?: string; start: string; end: string } | null
  >(null);

  const applyToAll = (sourceDay: DayKey) => {
    const ranges = [...avail[sourceDay]];
    const next: AvailabilityState = { ...avail };
    dayOrder.forEach((d) => (next[d] = d === sourceDay ? next[d] : JSON.parse(JSON.stringify(ranges))));
    setAvail(next);
  };

  const clearDay = (day: DayKey) => {
    setAvail((prev) => ({ ...prev, [day]: [] }));
  };

  const addRange = (day: DayKey) => {
    setEditing({ day, start: "09:00", end: "12:00" });
  };

  const editRange = (day: DayKey, r: Range) => {
    setEditing({ day, rangeId: r.id, start: r.start, end: r.end });
  };

  const removeRange = (day: DayKey, rid: string) => {
    setAvail((prev) => ({ ...prev, [day]: prev[day].filter((r) => r.id !== rid) }));
  };

  const saveRange = () => {
    if (!editing) return;
    const { day, rangeId, start, end } = editing;
    if (timeToMinutes(end) <= timeToMinutes(start)) {
      alert("End time must be after start time.");
      return;
    }

    setAvail((prev) => {
      const list = [...prev[day]];
      const newRange: Range = { id: rangeId || id(), start, end };

      // overlap check
      const conflict = list.some((r) => (rangeId ? r.id !== rangeId : true) && overlaps(r, newRange));
      if (conflict) {
        alert("This range overlaps an existing one.");
        return prev;
      }

      const nextList = rangeId ? list.map((r) => (r.id === rangeId ? newRange : r)) : [...list, newRange];
      // sort by start
      nextList.sort((a, b) => timeToMinutes(a.start) - timeToMinutes(b.start));

      return { ...prev, [day]: nextList };
    });

    setEditing(null);
  };

  // preview slots (next two weeks)
  const [weekCursor, setWeekCursor] = React.useState(0); // 0 = current week
  const startOfWeek = React.useMemo(() => {
    const now = new Date();
    const start = new Date(now);
    const day = start.getDay(); // 0 Sun
    start.setDate(start.getDate() - day + weekCursor * 7);
    start.setHours(0, 0, 0, 0);
    return start;
  }, [weekCursor]);

  const previewSlots = React.useMemo(() => {
    // naive slot generation for the visible week
    const slots: { day: DayKey; date: Date; start: string; end: string }[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      const key = dayOrder[i];
      const ranges = avail[key] || [];
      ranges.forEach((r) => {
        // break into slot-length chunks with buffer
        let cur = timeToMinutes(r.start);
        const endM = timeToMinutes(r.end);
        while (cur + slot <= endM) {
          const sH = Math.floor(cur / 60);
          const sM = cur % 60;
          const eMins = cur + slot;
          const eH = Math.floor(eMins / 60);
          const eM = eMins % 60;
          slots.push({
            day: key,
            date: new Date(d),
            start: `${String(sH).padStart(2, "0")}:${String(sM).padStart(2, "0")}`,
            end: `${String(eH).padStart(2, "0")}:${String(eM).padStart(2, "0")}`,
          });
          cur = eMins + buffer;
        }
      });
    }
    return slots;
  }, [avail, slot, buffer, startOfWeek]);

  // Filter days by search (optional)
  const dayMatches = (key: DayKey) =>
    !search.trim() || key.toLowerCase().includes(search.trim().toLowerCase());

  return (
    <MentorAppLayout>
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        {/* Title */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-[#0F132E] dark:text-[#E9ECFF]">Availability</h1>
            <p className="text-sm text-[#5E66A6] dark:text-[#A7B0FF]/85">
              Define when mentees can book you. Weekly schedule, slots, and buffers.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button className={`${btnBase} ${btnGhost}`} onClick={() => applyToAll("Mon")}>
              <RefreshCw size={16} /> Copy Monday to all
            </button>
            <button className={`${btnBase} ${btnSolid}`}>
              <Save size={16} /> Publish changes
            </button>
          </div>
        </div>

        {/* Global controls */}
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <span className={`${chip}`}>
            <Globe2 size={14} /> Timezone
          </span>
          <select className={`${card} h-11 px-3 text-sm ${ringIndigo}`} value={tz} onChange={(e) => setTz(e.target.value)}>
            {["Africa/Lagos","UTC","America/New_York","Europe/London","Asia/Kolkata"].map((z) => (
              <option key={z} value={z}>{z}</option>
            ))}
          </select>

          <span className={`${chip}`}>
            <Clock size={14} /> Slot
          </span>
          <select className={`${card} h-11 px-3 text-sm ${ringIndigo}`} value={slot} onChange={(e) => setSlot(parseInt(e.target.value,10))}>
            {[30, 45, 60, 90].map((n) => (
              <option key={n} value={n}>{n} min</option>
            ))}
          </select>

          <span className={`${chip}`}>Buffer</span>
          <select className={`${card} h-11 px-3 text-sm ${ringIndigo}`} value={buffer} onChange={(e) => setBuffer(parseInt(e.target.value,10))}>
            {[0, 5, 10, 15, 30].map((n) => (
              <option key={n} value={n}>{n} min</option>
            ))}
          </select>

          <span className={`${chip}`}>Min notice</span>
          <select className={`${card} h-11 px-3 text-sm ${ringIndigo}`} value={notice} onChange={(e) => setNotice(parseInt(e.target.value,10))}>
            {[2, 6, 12, 24, 48].map((n) => (
              <option key={n} value={n}>{n} hours</option>
            ))}
          </select>

          {/* search days */}
          <div className={`ml-auto flex items-center gap-2 ${card} h-11 px-3.5`}>
            <Search size={16} className="text-[#5F679A] dark:text-[#A7B0FF]" />
            <input
              className="bg-transparent outline-none text-sm text-[#101436] dark:text-[#EEF0FF] placeholder-[#7A81B4] dark:placeholder-[#A7B0FF]/80"
              placeholder="Filter days… (e.g. Mon, Fri)"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Days grid */}
        <div className="mt-6 grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {dayOrder.filter(dayMatches).map((day) => (
            <div key={day} className={`${card} p-4`}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="text-sm font-semibold text-[#0F1536] dark:text-[#E7E9FF]">{day}</div>
                <div className="flex flex-wrap items-center gap-2">
                  <button className={`${btnBase} ${btnGhost}`} onClick={() => addRange(day)}>
                    <Plus size={14} /> Add range
                  </button>
                  <button className={`${btnBase} ${btnGhost}`} onClick={() => clearDay(day)}>
                    <Trash2 size={14} /> Clear
                  </button>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {avail[day].length === 0 && (
                  <span className="text-xs text-[#6B72B3] dark:text-[#A7B0FF]/80">No ranges for {day}. Add one.</span>
                )}
                {avail[day].map((r) => (
                  <div key={r.id} className="flex items-center gap-2 px-3 py-2 rounded-xl border border-[#E7E9FF] dark:border-[#2B2F55] bg-white/60 dark:bg-white/[0.04] text-xs">
                    <span className="font-semibold text-[#101436] dark:text-[#EEF0FF]">{r.start}–{r.end}</span>
                    <button className="text-[#4F46E5]" onClick={() => editRange(day, r)} title="Edit">
                      <Edit3 size={14} />
                    </button>
                    <button className="text-rose-500" onClick={() => removeRange(day, r.id)} title="Delete">
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Inline editor */}
              {editing && editing.day === day && (
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <input
                    className={`${card} h-10 px-3 text-sm w-28`}
                    type="time"
                    value={editing.start}
                    onChange={(e) => setEditing({ ...editing, start: e.target.value })}
                  />
                  <span className="text-xs text-[#6B72B3] dark:text-[#A7B0FF]/80">to</span>
                  <input
                    className={`${card} h-10 px-3 text-sm w-28`}
                    type="time"
                    value={editing.end}
                    onChange={(e) => setEditing({ ...editing, end: e.target.value })}
                  />
                  <button className={`${btnBase} ${btnSolid}`} onClick={saveRange}>
                    <Check size={14} /> Save
                  </button>
                  <button className={`${btnBase} ${btnGhost}`} onClick={() => setEditing(null)}>
                    Cancel
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Preview slots rail (week pagination) */}
        <div className={`${card} mt-6 p-4`}>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="text-sm font-semibold text-[#0F1536] dark:text-[#E7E9FF]">Preview (week)</div>
            <div className="flex items-center gap-2">
              <button className={`${btnBase} ${btnGhost}`} onClick={() => setWeekCursor((n) => n - 1)}>
                <ChevronLeft size={16} /> Prev week
              </button>
              <button className={`${btnBase} ${btnGhost}`} onClick={() => setWeekCursor(0)}>
                This week
              </button>
              <button className={`${btnBase} ${btnGhost}`} onClick={() => setWeekCursor((n) => n + 1)}>
                Next week <ChevronRight size={16} />
              </button>
            </div>
          </div>

          <div className="mt-4 grid md:grid-cols-2 xl:grid-cols-3 gap-3">
            {previewSlots.length === 0 && (
              <div className="text-xs text-[#6B72B3] dark:text-[#A7B0FF]/80 p-3">No slots generated for this week.</div>
            )}
            {previewSlots.map((s, idx) => (
              <div key={idx} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[#E7E9FF] dark:border-[#2B2F55] bg-white/70 dark:bg-white/[0.04] px-3 py-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-[#101436] dark:text-[#EEF0FF]">{s.day}</span>
                  <span className="text-[#6B72B3] dark:text-[#A7B0FF]/80">
                    {s.date.toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 rounded-lg border border-[#E7E9FF] dark:border-[#2B2F55]">{s.start}–{s.end}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MentorAppLayout>
  );
};

export default Availability;
