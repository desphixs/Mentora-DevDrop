import React from "react";
import MenteeAppLayout from "../MenteeAppLayout";
import {
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Star,
  Clock,
  Video,
  MapPin,
  Tag,
  CalendarCheck2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

/* ---------- UI tokens ---------- */
const ringIndigo =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#6366F1]/40";
const card =
  "rounded-2xl border border-[#E7E9FF] dark:border-[#2B2F55] bg-white/80 dark:bg-white/[0.05] backdrop-blur";
const btnBase =
  "inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-semibold transition " + ringIndigo;
const btnSolid =
  "text-white bg-gradient-to-r from-[#4F46E5] via-[#6366F1] to-[#8B5CF6]";
const btnGhost =
  "border border-[#D9DBFF] dark:border-[#30345D] text-[#1B1F3A] dark:text-[#E6E9FF] bg-white/70 dark:bg-white/[0.05] hover:bg-white/90 dark:hover:bg-white/[0.08]";
const pill =
  "inline-flex items-center gap-2 rounded-full border border-[#E7E9FF] dark:border-[#2B2F55] bg-white/70 dark:bg-white/[0.05] px-3 py-1 text-[11px] font-semibold";

/* ---------- Types + Dummy Data ---------- */
type Mentor = {
  id: string;
  name: string;
  title: string;
  rating: number;
  reviews: number;
  hourly: number;
  mode: Array<"virtual" | "inperson">;
  skills: string[];
};

type Slot = {
  id: string;
  mentorId: string;
  start: string; // ISO
  end: string;   // ISO
  durationMin: number;
};

const MENTORS: Mentor[] = [
  {
    id: "m-ada", name: "Ada Lovette", title: "Senior Frontend Engineer",
    rating: 4.9, reviews: 112, hourly: 60, mode: ["virtual"], skills: ["React", "RSC", "UI"]
  },
  {
    id: "m-rohan", name: "Rohan Bala", title: "SRE / DevOps Lead",
    rating: 4.8, reviews: 89, hourly: 75, mode: ["virtual", "inperson"], skills: ["SRE", "AWS", "Kubernetes"]
  },
  {
    id: "m-maya", name: "Maya I.", title: "Product Design Lead",
    rating: 4.7, reviews: 54, hourly: 55, mode: ["virtual"], skills: ["Design", "Figma", "Critique"]
  },
];

const now = new Date();
function addDays(d: Date, n: number) {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
}
function atHour(d: Date, h: number) {
  const x = new Date(d);
  x.setHours(h, 0, 0, 0);
  return x;
}
function iso(d: Date) { return d.toISOString(); }

const SLOTS: Slot[] = (() => {
  const out: Slot[] = [];
  let idc = 1;
  for (let day = 0; day < 21; day++) {
    const base = addDays(now, day);
    for (const h of [9, 11, 14, 16]) {
      for (const mentor of MENTORS) {
        const start = atHour(base, h);
        const end = new Date(start.getTime() + 45 * 60000);
        out.push({
          id: "s-" + idc++,
          mentorId: mentor.id,
          start: iso(start),
          end: iso(end),
          durationMin: 45
        });
      }
    }
  }
  return out;
})();

/* ---------- Helpers ---------- */
function fmtDay(d: string) {
  const x = new Date(d);
  return x.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" });
}
function fmtTime(d: string) {
  const x = new Date(d);
  return x.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

/* ---------- Component ---------- */
const ME_SelectSlot: React.FC = () => {
  const navigate = useNavigate();

  // week cursor
  const [cursor, setCursor] = React.useState<Date>(() => {
    const c = new Date(); c.setHours(0, 0, 0, 0); return c;
  });

  // filters/search
  const [q, setQ] = React.useState("");
  const [mode, setMode] = React.useState<"all" | "virtual" | "inperson">("all");
  const [duration, setDuration] = React.useState<"all" | "30" | "45" | "60">("all");
  const [skill, setSkill] = React.useState<"all" | string>("all");

  // pagination for mentors list (if many)
  const [page, setPage] = React.useState(1);
  const perPage = 6;

  const weekDays = React.useMemo(() => {
    const startOfWeek = new Date(cursor);
    const day = startOfWeek.getDay();
    // make Monday the first day (adjust if you want Sunday)
    const mondayOffset = (day + 6) % 7;
    startOfWeek.setDate(startOfWeek.getDate() - mondayOffset);
    return Array.from({ length: 7 }).map((_, i) => addDays(startOfWeek, i));
  }, [cursor]);

  const mentorFiltered = React.useMemo(() => {
    const lower = q.trim().toLowerCase();
    return MENTORS.filter(m => {
      if (mode !== "all" && !m.mode.includes(mode)) return false;
      if (skill !== "all" && !m.skills.includes(skill)) return false;
      if (lower) {
        const hay = `${m.name} ${m.title} ${m.skills.join(" ")}`.toLowerCase();
        if (!hay.includes(lower)) return false;
      }
      return true;
    });
  }, [q, mode, skill]);

  const totalPages = Math.max(1, Math.ceil(mentorFiltered.length / perPage));
  const mentorsPage = mentorFiltered.slice((page - 1) * perPage, (page - 1) * perPage + perPage);

  const weekSlots = React.useMemo(() => {
    // slots in this 7-day window
    const start = weekDays[0].getTime();
    const end = addDays(weekDays[6], 1).getTime();
    return SLOTS.filter(s => {
      const t = new Date(s.start).getTime();
      if (t < start || t >= end) return false;
      if (duration !== "all" && s.durationMin !== Number(duration)) return false;
      return true;
    });
  }, [weekDays, duration]);

  const [selected, setSelected] = React.useState<Slot | null>(null);

  const onChoose = (slot: Slot) => setSelected(slot);

  const onContinue = () => {
    if (!selected) return;
    const mentor = MENTORS.find(m => m.id === selected.mentorId)!;
    const payload = { slot: selected, mentor };
    localStorage.setItem("mentee.booking.selection", JSON.stringify(payload));
    navigate("/mentee/booking/checkout");
  };

  const allSkills = Array.from(new Set(MENTORS.flatMap(m => m.skills)));

  return (
    <MenteeAppLayout>
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold">Select a Slot</h1>
            <p className="text-sm text-[#5E66A6] dark:text-[#A7B0FF]/85">
              Pick a mentor and a time that works for you.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button className={`${btnBase} ${btnGhost}`} onClick={() => setCursor(addDays(cursor, -7))}>
              <ChevronLeft size={16} /> Prev week
            </button>
            <button className={`${btnBase} ${btnGhost}`} onClick={() => setCursor(addDays(cursor, 7))}>
              Next week <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Filters/Search (mobile friendly) */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-12 gap-2">
          <div className="md:col-span-5">
            <div className={`flex items-center gap-2 ${card} h-11 px-3.5`}>
              <Search size={16} className="text-[#5F679A] dark:text-[#A7B0FF]" />
              <input
                value={q}
                onChange={(e) => { setQ(e.target.value); setPage(1); }}
                placeholder="Search mentor, skill, title…"
                className="bg-transparent outline-none text-sm w-full"
              />
            </div>
          </div>
          <div className="md:col-span-7">
            <div className="flex flex-wrap gap-2">
              <div className={`flex items-center gap-2 ${card} h-11 px-3 w-full sm:w-auto`}>
                <Filter size={16} className="text-[#5F679A] dark:text-[#A7B0FF]" />
                <select className="bg-transparent text-sm outline-none" value={mode} onChange={(e) => setMode(e.target.value as any)}>
                  <option value="all">Mode: Any</option>
                  <option value="virtual">Virtual</option>
                  <option value="inperson">In person</option>
                </select>
                <span className="h-4 w-px bg-[#E7E9FF] dark:bg-[#2B2F55]" />
                <select className="bg-transparent text-sm outline-none" value={duration} onChange={(e) => setDuration(e.target.value as any)}>
                  <option value="all">Duration: Any</option>
                  <option value="30">30 min</option>
                  <option value="45">45 min</option>
                  <option value="60">60 min</option>
                </select>
                <span className="h-4 w-px bg-[#E7E9FF] dark:bg-[#2B2F55]" />
                <select className="bg-transparent text-sm outline-none" value={skill} onChange={(e) => setSkill(e.target.value as any)}>
                  <option value="all">Skill: Any</option>
                  {allSkills.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Mentors + slots */}
        <div className="mt-6 grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {mentorsPage.map((m) => {
            const slots = weekSlots.filter(s => s.mentorId === m.id);
            return (
              <div key={m.id} className={`${card} p-4`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl grid place-items-center border border-[#E7E9FF] dark:border-[#2B2F55]">
                      <span className="text-xs font-bold">{m.name.split(" ").map(x => x[0]).join("").slice(0,2)}</span>
                    </div>
                    <div>
                      <div className="text-sm font-semibold">{m.name}</div>
                      <div className="text-xs text-[#6B72B3] dark:text-[#A7B0FF]/80">{m.title}</div>
                      <div className="mt-1 flex items-center gap-2 text-xs">
                        <Star size={14} className="text-amber-500" />
                        {m.rating} • {m.reviews} reviews
                      </div>
                    </div>
                  </div>
                  <div className="text-sm font-semibold">${m.hourly}/hr</div>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  {m.mode.includes("virtual") && <span className={pill}><Video size={14}/>Virtual</span>}
                  {m.mode.includes("inperson") && <span className={pill}><MapPin size={14}/>In person</span>}
                  {m.skills.slice(0,3).map(s => <span key={s} className={pill}><Tag size={14}/>{s}</span>)}
                </div>

                <div className="mt-4">
                  <div className="text-xs font-semibold flex items-center gap-2">
                    <CalendarCheck2 size={14} /> Available this week
                  </div>
                  {slots.length === 0 ? (
                    <div className="mt-2 text-xs text-[#6B72B3] dark:text-[#A7B0FF]/80">No availability in this window.</div>
                  ) : (
                    <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {slots.slice(0, 9).map(s => {
                        const sel = selected?.id === s.id;
                        return (
                          <button
                            key={s.id}
                            onClick={() => onChoose(s)}
                            className={`rounded-lg border px-2.5 py-2 text-left text-xs ${sel ? "bg-[#EEF2FF] border-[#AAB4FF]" : "bg-white/70 dark:bg-white/[0.05]"} border-[#E7E9FF] dark:border-[#2B2F55] ${ringIndigo}`}
                          >
                            <div className="font-semibold flex items-center gap-1"><Clock size={12}/>{fmtTime(s.start)}</div>
                            <div className="text-[11px] opacity-70">{fmtDay(s.start)}</div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Selected indicator */}
                {selected?.mentorId === m.id && (
                  <div className="mt-3 text-xs">
                    Selected: <span className="font-semibold">{fmtDay(selected.start)} • {fmtTime(selected.start)} – {fmtTime(selected.end)}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Empty */}
        {mentorsPage.length === 0 && (
          <div className="mt-8 text-sm text-center text-[#6B72B3] dark:text-[#A7B0FF]/80">No mentors match your filters.</div>
        )}

        {/* Pagination + Continue */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button className={`${btnBase} ${btnGhost}`} disabled={page <= 1} onClick={() => window.requestAnimationFrame(() => setPage(p => Math.max(1, p - 1)))}>
              <ChevronLeft size={16}/> Prev
            </button>
            <span className="text-xs text-[#6B72B3] dark:text-[#A7B0FF]/80">Page {page} / {totalPages}</span>
            <button className={`${btnBase} ${btnGhost}`} disabled={page >= totalPages} onClick={() => window.requestAnimationFrame(() => setPage(p => Math.min(totalPages, p + 1)))}>
              Next <ChevronRight size={16}/>
            </button>
          </div>

          <button
            className={`${btnBase} ${btnSolid}`}
            onClick={onContinue}
            disabled={!selected}
          >
            Continue to checkout
          </button>
        </div>
      </div>
    </MenteeAppLayout>
  );
};

export default ME_SelectSlot;
