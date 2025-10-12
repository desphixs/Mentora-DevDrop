import React from "react";
import MentorAppLayout from "../MentorAppLayout";
import {
  Search, Filter, MoreVertical, ChevronLeft, ChevronRight, Users, CalendarDays, Clock, Link as LinkIcon,
  CheckCircle2, XCircle, Copy, Edit3, Trash2
} from "lucide-react";

/* Tokens */
const ringIndigo =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#6366F1]/40";
const card =
  "rounded-2xl border border-[#E7E9FF] dark:border-[#2B2F55] bg-white/80 dark:bg-white/[0.05] backdrop-blur";
const btnBase =
  "inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-semibold transition " + ringIndigo;
const btnGhost =
  "border border-[#D9DBFF] dark:border-[#30345D] text-[#1B1F3A] dark:text-[#E6E9FF] bg-white/70 dark:bg-white/[0.05]";
const pill =
  "inline-flex items-center gap-2 rounded-full border border-[#E7E9FF] dark:border-[#2B2F55] bg-white/70 dark:bg-white/[0.05] px-3 py-1 text-[11px] font-semibold";

type Status = "upcoming" | "filled" | "completed" | "cancelled";
type GSession = {
  id: string;
  title: string;
  dateISO: string;
  durationMin: number;
  price: number;
  currency: "USD" | "NGN" | "INR" | "EUR";
  capacity: number;
  enrolled: number;
  meeting: "Zoom" | "Google Meet";
  status: Status;
  tags: string[];
};

const daysAfterISO = (d: number) => new Date(Date.now() + d * 864e5).toISOString();
const daysAgoISO = (d: number) => new Date(Date.now() - d * 864e5).toISOString();

const DUMMY: GSession[] = [
  { id: "gs_1", title: "FE Perf Cohort", dateISO: daysAfterISO(3), durationMin: 90, price: 99, currency: "USD", capacity: 20, enrolled: 18, meeting: "Zoom", status: "upcoming", tags: ["frontend","perf"] },
  { id: "gs_2", title: "Design Crit Live", dateISO: daysAfterISO(10), durationMin: 60, price: 49, currency: "USD", capacity: 15, enrolled: 15, meeting: "Google Meet", status: "filled", tags: ["design"] },
  { id: "gs_3", title: "Backend Tracing 101", dateISO: daysAgoISO(5), durationMin: 75, price: 79, currency: "USD", capacity: 25, enrolled: 22, meeting: "Zoom", status: "completed", tags: ["backend","ops"] },
  { id: "gs_4", title: "Cohort: Landing Pages", dateISO: daysAfterISO(20), durationMin: 120, price: 120, currency: "USD", capacity: 25, enrolled: 7, meeting: "Zoom", status: "upcoming", tags: ["growth"] },
  { id: "gs_5", title: "Intro to ML", dateISO: daysAfterISO(-2), durationMin: 90, price: 110, currency: "USD", capacity: 30, enrolled: 12, meeting: "Google Meet", status: "cancelled", tags: ["ml"] },
];

type Filters = {
  q: string;
  status: "all" | Status;
  capacity: "all" | "hasSlots" | "full";
  range: "30d" | "90d" | "all";
  sort: "dateAsc" | "dateDesc" | "priceDesc" | "priceAsc";
};

const perPage = 6;
const fmtDay = (iso: string) => new Date(iso).toLocaleString([], { month: "short", day: "numeric", year: "numeric" });
const fmtTime = (iso: string) => new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

function withinRange(iso: string, r: Filters["range"]) {
  if (r === "all") return true;
  const days = r === "30d" ? 30 : 90;
  const min = Date.now() - (r === "30d" || r === "90d" ? 0 : 0); // keep simple; show all
  return +new Date(iso) >= min - days * 864e5 && +new Date(iso) <= min + days * 864e5;
}
function applyFilters(list: GSession[], f: Filters) {
  let out = list.filter((x) => {
    if (f.status !== "all" && x.status !== f.status) return false;
    if (f.capacity === "hasSlots" && x.enrolled >= x.capacity) return false;
    if (f.capacity === "full" && x.enrolled < x.capacity) return false;
    if (!withinRange(x.dateISO, f.range)) return false;
    if (f.q.trim()) {
      const q = f.q.toLowerCase();
      const hay = `${x.title} ${x.tags.join(" ")} ${x.meeting}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
  if (f.sort === "dateAsc") out.sort((a,b)=>+new Date(a.dateISO)-+new Date(b.dateISO));
  if (f.sort === "dateDesc") out.sort((a,b)=>+new Date(b.dateISO)-+new Date(a.dateISO));
  if (f.sort === "priceDesc") out.sort((a,b)=>b.price-a.price);
  if (f.sort === "priceAsc") out.sort((a,b)=>a.price-b.price);
  return out;
}

export default function GroupSessions() {
  const [rows, setRows] = React.useState<GSession[]>(
    () => JSON.parse(localStorage.getItem("mentora.offers.groups") || "null") ?? DUMMY
  );
  React.useEffect(()=>localStorage.setItem("mentora.offers.groups", JSON.stringify(rows)),[rows]);

  const [filters, setFilters] = React.useState<Filters>({
    q: "", status: "all", capacity: "all", range: "all", sort: "dateAsc"
  });

  const [page, setPage] = React.useState(1);
  const filtered = React.useMemo(()=>applyFilters(rows, filters),[rows, filters]);
  const totalPages = Math.max(1, Math.ceil(filtered.length/perPage));
  const paged = React.useMemo(()=>filtered.slice((page-1)*perPage, page*perPage),[filtered, page]);
  React.useEffect(()=>setPage(1),[filters]);

  // row dropdown
  const [menuFor, setMenuFor] = React.useState<string | null>(null);
  const menuRef = React.useRef<HTMLDivElement | null>(null);
  React.useEffect(() => {
    const onClick = (e: MouseEvent) => { if (menuRef.current && e.target instanceof Node && !menuRef.current.contains(e.target)) setMenuFor(null); };
    const onEsc = (e: KeyboardEvent) => e.key === "Escape" && setMenuFor(null);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onEsc);
    return () => { document.removeEventListener("mousedown", onClick); document.removeEventListener("keydown", onEsc); };
  }, []);

  const copyId = (id: string) => { navigator.clipboard.writeText(id); alert("Session ID copied"); };
  const markCompleted = (id: string) => setRows((p)=>p.map((r)=>r.id===id?{...r,status:"completed"}:r));
  const cancel = (id: string) => setRows((p)=>p.map((r)=>r.id===id?{...r,status:"cancelled"}:r));
  const deleteRow = (id: string) => setRows((p)=>p.filter((r)=>r.id!==id));

  const upcoming = rows.filter((r)=>r.status==="upcoming").length;
  const filled = rows.filter((r)=>r.status==="filled").length;

  return (
    <MentorAppLayout>
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-[#0F132E] dark:text-[#E9ECFF]">Group Sessions</h1>
            <p className="text-sm text-[#5E66A6] dark:text-[#A7B0FF]/85">Cohorts & live workshops with capacity controls.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className={pill}><Users size={14}/> {rows.length} total</span>
            <span className={pill}><CheckCircle2 size={14}/> {upcoming} upcoming</span>
            <span className={pill}><XCircle size={14}/> {filled} filled</span>
          </div>
        </div>

        {/* Filters/Search */}
        <div className="mt-4 flex flex-wrap gap-2">
          <div className={`flex items-center gap-2 ${card} h-11 px-3.5 flex-1 min-w-[220px]`}>
            <Search size={16}/>
            <input className="bg-transparent outline-none text-sm w-full" placeholder="Search title, tags, platform…" value={filters.q} onChange={(e)=>setFilters((f)=>({...f,q:e.target.value}))}/>
          </div>
          <div className={`flex items-center gap-2 ${card} h-11 px-3 flex-wrap`}>
            <Filter size={16}/>
            <select className="bg-transparent text-sm outline-none" value={filters.status} onChange={(e)=>setFilters((f)=>({...f,status:e.target.value as any}))}>
              <option value="all">Status: All</option>
              <option value="upcoming">Upcoming</option>
              <option value="filled">Filled</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <span className="h-4 w-px bg-[#E7E9FF] dark:bg-[#2B2F55]"/>
            <select className="bg-transparent text-sm outline-none" value={filters.capacity} onChange={(e)=>setFilters((f)=>({...f,capacity:e.target.value as any}))}>
              <option value="all">Capacity: Any</option>
              <option value="hasSlots">Has slots</option>
              <option value="full">Full</option>
            </select>
            <span className="h-4 w-px bg-[#E7E9FF] dark:bg-[#2B2F55]"/>
            <select className="bg-transparent text-sm outline-none" value={filters.sort} onChange={(e)=>setFilters((f)=>({...f,sort:e.target.value as any}))}>
              <option value="dateAsc">Sort: Date ↑</option>
              <option value="dateDesc">Sort: Date ↓</option>
              <option value="priceAsc">Sort: Price ↑</option>
              <option value="priceDesc">Sort: Price ↓</option>
            </select>
          </div>
        </div>

        {/* Content */}
        <div className="mt-4">
          {/* Cards (mobile) */}
          <div className="md:hidden grid grid-cols-1 gap-3">
            {paged.map((s)=>(
              <div key={s.id} className={`${card} p-3 relative`}>
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-xl grid place-items-center bg-[#EEF2FF] dark:bg-white/[0.08] border border-[#E7E9FF] dark:border-[#2B2F55]">
                        <Users size={14}/>
                      </div>
                      <div className="font-semibold text-sm truncate">{s.title}</div>
                    </div>
                    <div className="mt-1 text-[12px] text-[#5E66A6] dark:text-[#A7B0FF]/80">
                      <CalendarDays size={12} className="inline mr-1"/>{fmtDay(s.dateISO)} {fmtTime(s.dateISO)} · {s.meeting}
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-1">
                      <span className={pill}>{s.currency} {s.price}</span>
                      <span className={pill}><Clock size={14}/> {s.durationMin}m</span>
                      <span className={pill}>{s.enrolled}/{s.capacity} seats</span>
                      <span className={pill}>{s.status}</span>
                    </div>
                  </div>
                  <div className="relative" ref={menuRef}>
                    <button className={`${btnBase} ${btnGhost} px-2 py-1`} aria-haspopup="menu" aria-expanded={menuFor===s.id} onClick={()=>setMenuFor(menuFor===s.id?null:s.id)}>
                      <MoreVertical size={16}/>
                    </button>
                    {menuFor===s.id && (
                      <div role="menu" className={`${card} absolute right-0 top-10 w-48 p-1 z-40`}>
                        <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/70 dark:hover:bg-white/[0.06] inline-flex items-center gap-2">
                          <LinkIcon size={14}/> Share link
                        </button>
                        <button onClick={()=>copyId(s.id)} className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/70 dark:hover:bg-white/[0.06] inline-flex items-center gap-2">
                          <Copy size={14}/> Copy ID
                        </button>
                        <button onClick={()=>markCompleted(s.id)} className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/70 dark:hover:bg-white/[0.06] inline-flex items-center gap-2">
                          <CheckCircle2 size={14}/> Mark completed
                        </button>
                        <button onClick={()=>cancel(s.id)} className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/70 dark:hover:bg-white/[0.06] inline-flex items-center gap-2">
                          <XCircle size={14}/> Cancel
                        </button>
                        <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/70 dark:hover:bg-white/[0.06] inline-flex items-center gap-2">
                          <Edit3 size={14}/> Edit
                        </button>
                        <button onClick={()=>deleteRow(s.id)} className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/70 dark:hover:bg-white/[0.06] inline-flex items-center gap-2 text-rose-600">
                          <Trash2 size={14}/> Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Table (md+) */}
          <div className="hidden md:block overflow-x-auto">
            <table className={`min-w-full ${card}`}>
              <thead>
                <tr className="text-left text-[12px] text-[#6B72B3] dark:text-[#A7B0FF]/80">
                  <th className="px-4 py-3">Title</th>
                  <th className="px-4 py-3">When</th>
                  <th className="px-4 py-3">Duration</th>
                  <th className="px-4 py-3">Seats</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E7E9FF] dark:divide-[#2B2F55]">
                {paged.map((s)=>(
                  <tr key={s.id} className="relative">
                    <td className="px-4 py-3 text-sm font-semibold">{s.title}</td>
                    <td className="px-4 py-3 text-sm">{fmtDay(s.dateISO)} · {fmtTime(s.dateISO)} · {s.meeting}</td>
                    <td className="px-4 py-3 text-sm">{s.durationMin}m</td>
                    <td className="px-4 py-3 text-sm">{s.enrolled}/{s.capacity}</td>
                    <td className="px-4 py-3 text-sm">{s.currency} {s.price.toFixed(2)}</td>
                    <td className="px-4 py-3 text-sm capitalize">{s.status}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="relative" ref={menuRef}>
                        <button className={`${btnBase} ${btnGhost} px-2 py-1`} aria-haspopup="menu" aria-expanded={menuFor===s.id} onClick={()=>setMenuFor(menuFor===s.id?null:s.id)}>
                          <MoreVertical size={16}/>
                        </button>
                        {menuFor===s.id && (
                          <div role="menu" className={`${card} absolute right-0 top-10 w-48 p-1 z-40`}>
                            <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/70 dark:hover:bg-white/[0.06] inline-flex items-center gap-2"><LinkIcon size={14}/> Share link</button>
                            <button onClick={()=>copyId(s.id)} className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/70 dark:hover:bg-white/[0.06] inline-flex items-center gap-2"><Copy size={14}/> Copy ID</button>
                            <button onClick={()=>markCompleted(s.id)} className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/70 dark:hover:bg-white/[0.06] inline-flex items-center gap-2"><CheckCircle2 size={14}/> Mark completed</button>
                            <button onClick={()=>cancel(s.id)} className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/70 dark:hover:bg-white/[0.06] inline-flex items-center gap-2"><XCircle size={14}/> Cancel</button>
                            <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/70 dark:hover:bg-white/[0.06] inline-flex items-center gap-2"><Edit3 size={14}/> Edit</button>
                            <button onClick={()=>deleteRow(s.id)} className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/70 dark:hover:bg-white/[0.06] inline-flex items-center gap-2 text-rose-600"><Trash2 size={14}/> Delete</button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="mt-3 flex items-center justify-between">
            <div className="text-[12px] text-[#6B72B3] dark:text-[#A7B0FF]/80">Page {page} / {totalPages} · {filtered.length} total</div>
            <div className="flex items-center gap-2">
              <button className={`${btnBase} ${btnGhost} px-2 py-1`} disabled={page<=1} onClick={()=>setPage(p=>Math.max(1,p-1))}><ChevronLeft size={16}/></button>
              <button className={`${btnBase} ${btnGhost} px-2 py-1`} disabled={page>=totalPages} onClick={()=>setPage(p=>Math.min(totalPages,p+1))}><ChevronRight size={16}/></button>
            </div>
          </div>
        </div>
      </div>
    </MentorAppLayout>
  );
}
