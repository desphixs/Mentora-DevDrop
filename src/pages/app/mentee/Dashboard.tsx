import React from "react";
import { Link } from "react-router-dom";
import MenteeAppLayout from "./MenteeAppLayout";
import {
  CalendarCheck2,
  Clock,
  Star,
  Search,
  Filter,
  Sparkles,
  TrendingUp,
  BadgeDollarSign,
  ChevronLeft,
  ChevronRight,
  Users,
  Video,
  ArrowRight,
} from "lucide-react";

/* Indigo glass tokens */
const ringIndigo = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#6366F1]/40";
const card = "rounded-2xl border border-[#E7E9FF] dark:border-[#2B2F55] bg-white/80 dark:bg-white/[0.05] backdrop-blur";
const chip = "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] border border-[#E7E9FF] dark:border-[#2B2F55] bg-white/60 dark:bg-white/[0.05]";
const btn = "inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-semibold transition " + ringIndigo;
const btnGhost = "border border-[#D9DBFF] dark:border-[#30345D] text-[#1B1F3A] dark:text-[#E6E9FF] bg-white/70 dark:bg-white/[0.05] hover:bg-white/90 dark:hover:bg-white/[0.08]";
const btnSolid = "text-white bg-gradient-to-r from-[#4F46E5] via-[#6366F1] to-[#8B5CF6] shadow-[0_10px_30px_rgba(79,70,229,0.35)] hover:shadow-[0_16px_40px_rgba(79,70,229,0.45)]";

type Mentor = {
  id: string;
  name: string;
  title: string;
  rating: number;
  reviews: number;
  hourly: number;
  tags: string[];
};

type Session = {
  id: string;
  mentor: string;
  topic: string;
  date: string; // ISO
  durationMin: number;
  status: "upcoming" | "completed" | "cancelled";
};

const mentors: Mentor[] = [
  { id: "m1", name: "Ada Lovette", title: "Frontend Architect", rating: 4.9, reviews: 182, hourly: 80, tags: ["React", "Design Systems", "DX"] },
  { id: "m2", name: "Rohan Bala", title: "System Design • SRE", rating: 4.8, reviews: 133, hourly: 95, tags: ["Distributed", "SRE", "Kubernetes"] },
  { id: "m3", name: "Sara Park", title: "Product Strategy", rating: 4.7, reviews: 89, hourly: 110, tags: ["Roadmaps", "GTM", "PLG"] },
];

const sessions: Session[] = [
  { id: "s1", mentor: "Ada Lovette", topic: "React performance audit", date: new Date(Date.now() + 36e5).toISOString(), durationMin: 45, status: "upcoming" },
  { id: "s2", mentor: "Rohan Bala", topic: "K8s reliability review", date: new Date(Date.now() + 72e5).toISOString(), durationMin: 60, status: "upcoming" },
  { id: "s3", mentor: "Sara Park", topic: "Q1 product strategy", date: new Date(Date.now() - 86400e3 * 3).toISOString(), durationMin: 45, status: "completed" },
];

function fmtShort(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

const ME_Dashboard: React.FC = () => {
  const [q, setQ] = React.useState("");
  const [range, setRange] = React.useState<"7d"|"30d"|"90d">("30d");

  const filteredMentors = mentors.filter(m => {
    const hay = `${m.name} ${m.title} ${m.tags.join(" ")}`.toLowerCase();
    return hay.includes(q.toLowerCase());
  });

  // simple activity (pagination)
  const activity = [
    { id: "a1", t: "Booked with Ada", d: "45m next week", ts: new Date().toISOString() },
    { id: "a2", t: "Review posted for Rohan", d: "5★ Great reliability tips", ts: new Date(Date.now()-3600e3).toISOString() },
    { id: "a3", t: "Saved Sara to favorites", d: "Product strategy", ts: new Date(Date.now()-5*3600e3).toISOString() },
    { id: "a4", t: "Credits topped up", d: "+$60", ts: new Date(Date.now()-3*86400e3).toISOString() },
    { id: "a5", t: "Joined group session", d: "Design Crit • Fri", ts: new Date(Date.now()-4*86400e3).toISOString() },
    { id: "a6", t: "Booked with Rohan", d: "60m on K8s", ts: new Date(Date.now()-6*86400e3).toISOString() },
  ];
  const [page, setPage] = React.useState(1);
  const perPage = 4;
  const totalPages = Math.max(1, Math.ceil(activity.length / perPage));
  const slice = activity.slice((page-1)*perPage, (page-1)*perPage + perPage);

  return (
    <MenteeAppLayout>
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        {/* Greeting + quick search */}
        <div className={`grid lg:grid-cols-12 gap-4`}>
          <div className={`${card} lg:col-span-8 p-5`}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1 rounded-full border border-[#E7E9FF] dark:border-[#2B2F55] bg-white/70 dark:bg-white/[0.05]">
                  <Sparkles size={14}/> Welcome back
                </div>
                <h1 className="mt-2 text-2xl font-bold">Find the right mentor faster</h1>
                <p className="text-sm text-[#5E66A6] dark:text-[#A7B0FF]/85">Search by skill, availability, or price—then book in one click.</p>
              </div>
              <div className="flex items-center gap-2">
                <select className={`${card} h-10 px-3 text-sm`} value={range} onChange={(e)=>setRange(e.target.value as any)}>
                  <option value="7d">Last 7 days</option>
                  <option value="30d">Last 30 days</option>
                  <option value="90d">Last 90 days</option>
                </select>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <div className={`flex items-center gap-2 ${card} h-11 px-3.5 flex-1 min-w-[240px]`}>
                <Search size={16} className="text-[#5F679A] dark:text-[#A7B0FF]" />
                <input
                  className="bg-transparent outline-none text-sm w-full"
                  placeholder="Search mentors, tags, titles…"
                  value={q}
                  onChange={(e)=>setQ(e.target.value)}
                />
              </div>
              <button className={`${btn} ${btnGhost}`}><Filter size={16}/> Filters</button>
              <Link to="/mentee/discover" className={`${btn} ${btnSolid}`}>Discover mentors <ArrowRight size={16}/></Link>
            </div>
          </div>

          {/* Stats */}
          <div className="lg:col-span-4 grid sm:grid-cols-3 lg:grid-cols-1 gap-4">
            <div className={`${card} p-4`}>
              <div className="text-sm font-semibold flex items-center gap-2"><BadgeDollarSign size={16}/> Credits</div>
              <div className="mt-2 text-3xl font-extrabold">$120</div>
              <div className="mt-2 text-xs text-[#6B72B3] dark:text-[#A7B0FF]/80">You can book ~90 minutes</div>
            </div>
            <div className={`${card} p-4`}>
              <div className="text-sm font-semibold flex items-center gap-2"><CalendarCheck2 size={16}/> Upcoming</div>
              <div className="mt-2 text-3xl font-extrabold">{sessions.filter(s=>s.status==="upcoming").length}</div>
              <div className="mt-2 text-xs text-[#6B72B3] dark:text-[#A7B0FF]/80">Next: {fmtShort(sessions[0].date)}</div>
            </div>
            <div className={`${card} p-4`}>
              <div className="text-sm font-semibold flex items-center gap-2"><TrendingUp size={16}/> Streak</div>
              <div className="mt-2 text-3xl font-extrabold">5</div>
              <div className="mt-2 text-xs text-[#6B72B3] dark:text-[#A7B0FF]/80">weeks booked</div>
            </div>
          </div>
        </div>

        {/* Upcoming sessions */}
        <div className="mt-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Upcoming sessions</h2>
            <Link to="/mentee/sessions" className="text-sm text-indigo-600 dark:text-indigo-300 font-semibold">View all</Link>
          </div>
          <div className="mt-3 grid md:grid-cols-2 xl:grid-cols-3 gap-4">
            {sessions.filter(s=>s.status==="upcoming").map(s=>(
              <div key={s.id} className={`${card} p-4`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-9 w-9 grid place-items-center rounded-xl border border-[#E7E9FF] dark:border-[#2B2F55] bg-white/60 dark:bg-white/[0.05]"><Users size={16}/></div>
                    <div>
                      <div className="text-sm font-semibold">{s.mentor}</div>
                      <div className="text-xs text-[#6B72B3] dark:text-[#A7B0FF]/80">{fmtShort(s.date)} • {s.durationMin}m</div>
                    </div>
                  </div>
                  <span className={chip}>confirmed</span>
                </div>
                <div className="mt-3 text-sm">{s.topic}</div>
                <div className="mt-3 flex gap-2">
                  <button className={`${btn} ${btnGhost}`}><Clock size={16}/> Reschedule</button>
                  <button className={`${btn} ${btnSolid}`}><Video size={16}/> Join when live</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recommended mentors (filtered by search) */}
        <div className="mt-8">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Recommended mentors</h2>
            <Link to="/mentee/discover" className="text-sm text-indigo-600 dark:text-indigo-300 font-semibold">Explore more</Link>
          </div>
          <div className="mt-3 grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredMentors.map(m=>(
              <div key={m.id} className={`${card} p-4`}>
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <div className="text-sm font-semibold">{m.name}</div>
                    <div className="text-xs text-[#6B72B3] dark:text-[#A7B0FF]/80">{m.title}</div>
                  </div>
                  <div className="text-sm font-semibold">${m.hourly}/h</div>
                </div>
                <div className="mt-2 flex items-center gap-2 text-xs">
                  <Star size={14} className="text-amber-500"/> {m.rating} ({m.reviews})
                </div>
                <div className="mt-3 flex flex-wrap gap-1">
                  {m.tags.map(t=> <span key={t} className={chip}>#{t}</span>)}
                </div>
                <div className="mt-3 flex gap-2">
                  <Link to={`/mentee/mentor/${m.id}`} className={`${btn} ${btnGhost}`}>View profile</Link>
                  <Link to="/mentee/booking/select-slot" className={`${btn} ${btnSolid}`}>Book</Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent activity with pagination */}
        <div className="mt-8">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Recent activity</h2>
            <div className="flex items-center gap-2">
              <button className={`${btn} ${btnGhost}`} disabled={page<=1} onClick={()=>setPage(p=>Math.max(1,p-1))}><ChevronLeft size={16}/>Prev</button>
              <button className={`${btn} ${btnGhost}`} disabled={page>=totalPages} onClick={()=>setPage(p=>Math.min(totalPages,p+1))}>Next<ChevronRight size={16}/></button>
            </div>
          </div>
          <div className="mt-3 grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {slice.map(a=>(
              <div key={a.id} className={`${card} p-4`}>
                <div className="text-sm font-semibold">{a.t}</div>
                <div className="mt-1 text-xs text-[#6B72B3] dark:text-[#A7B0FF]/80">{a.d}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MenteeAppLayout>
  );
};

export default ME_Dashboard;
