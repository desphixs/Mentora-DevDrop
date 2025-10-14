import React from "react";
import MenteeAppLayout from "./MenteeAppLayout";
import { Search, Filter, Star, ChevronLeft, ChevronRight, Calendar } from "lucide-react";

const ringIndigo = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#6366F1]/40";
const card = "rounded-2xl border border-[#E7E9FF] dark:border-[#2B2F55] bg-white/80 dark:bg-white/[0.05] backdrop-blur";
const btn = "inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-semibold transition " + ringIndigo;
const btnGhost = "border border-[#D9DBFF] dark:border-[#30345D] text-[#1B1F3A] dark:text-[#E6E9FF] bg-white/70 dark:bg-white/[0.05] hover:bg-white/90 dark:hover:bg-white/[0.08]";

type Review = {
  id: string;
  mentor: string;
  title: string;
  text: string;
  rating: number;
  date: string; // ISO
  response?: { at: string; text: string };
  tags: string[];
};

const DATA: Review[] = [
  { id:"r1", mentor:"Ada Lovette", title:"Performance deep-dive", text:"Clear guidance with actionable steps.", rating:5, date:new Date(Date.now()-86400e3*2).toISOString(), tags:["React","DX"], response:{at:new Date(Date.now()-86400e3).toISOString(), text:"Glad it helped! Share results next week."} },
  { id:"r2", mentor:"Rohan Bala", title:"K8s reliability", text:"Great tips on circuit breakers.", rating:5, date:new Date(Date.now()-86400e3*6).toISOString(), tags:["SRE","K8s"] },
  { id:"r3", mentor:"Sara Park", title:"Roadmap workshop", text:"Helped prioritize outcomes.", rating:4, date:new Date(Date.now()-86400e3*12).toISOString(), tags:["Product","PLG"] },
  { id:"r4", mentor:"Mason Cole", title:"Analytics & growth", text:"Useful attribution breakdown.", rating:4, date:new Date(Date.now()-86400e3*20).toISOString(), tags:["Growth","Analytics"] },
  { id:"r5", mentor:"Ijeoma Kay", title:"Design tokens", text:"Solid examples with Figma.", rating:5, date:new Date(Date.now()-86400e3*30).toISOString(), tags:["Design"] },
];

function fmtDate(iso:string){ return new Date(iso).toLocaleDateString([], {year:"numeric", month:"short", day:"numeric"}); }

const ME_Reviews: React.FC = () => {
  const [q, setQ] = React.useState("");
  const [minRating, setMinRating] = React.useState(0);
  const [range, setRange] = React.useState<"30d"|"90d"|"all">("90d");

  const [page, setPage] = React.useState(1);
  const perPage = 6;

  const filtered = DATA.filter(r=>{
    if (minRating && r.rating < minRating) return false;
    if (range!=="all") {
      const days = range==="30d" ? 30 : 90;
      const cutoff = Date.now() - days*86400e3;
      if (+new Date(r.date) < cutoff) return false;
    }
    const hay = `${r.mentor} ${r.title} ${r.text} ${r.tags.join(" ")}`.toLowerCase();
    return hay.includes(q.toLowerCase());
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const slice = filtered.slice((page-1)*perPage, (page-1)*perPage + perPage);

  React.useEffect(()=>{ setPage(1); }, [q, minRating, range]);

  return (
    <MenteeAppLayout>
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold">Your reviews</h1>
            <p className="text-sm text-[#5E66A6] dark:text-[#A7B0FF]/85">Edit, filter, and revisit your feedback to mentors.</p>
          </div>
        </div>

        {/* Controls */}
        <div className="mt-4 grid lg:grid-cols-12 gap-3">
          <div className="lg:col-span-5">
            <div className={`flex items-center gap-2 ${card} h-11 px-3.5`}>
              <Search size={16} className="text-[#5F679A] dark:text-[#A7B0FF]" />
              <input className="bg-transparent outline-none text-sm w-full" placeholder="Search reviews, mentors, tags…" value={q} onChange={(e)=>setQ(e.target.value)} />
            </div>
          </div>
          <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-3">
            <select className={`${card} h-11 px-3 text-sm`} value={minRating} onChange={(e)=>setMinRating(Number(e.target.value))}>
              <option value={0}>Rating: Any</option>
              <option value={4}>4★+</option>
              <option value={5}>5★ only</option>
            </select>
            <select className={`${card} h-11 px-3 text-sm`} value={range} onChange={(e)=>setRange(e.target.value as any)}>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="all">All time</option>
            </select>
            <button className={`${btn} ${btnGhost}`}><Filter size={16}/> More filters</button>
          </div>
        </div>

        {/* List */}
        <div className="mt-5 grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {slice.map(r=>(
            <div key={r.id} className={`${card} p-4`}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold">{r.title}</div>
                  <div className="text-xs text-[#6B72B3] dark:text-[#A7B0FF]/80">Mentor: {r.mentor}</div>
                </div>
                <div className="text-xs inline-flex items-center gap-1"><Calendar size={12}/> {fmtDate(r.date)}</div>
              </div>
              <div className="mt-2 flex items-center gap-1 text-xs">
                {Array.from({length:5}).map((_,i)=> <Star key={i} size={14} className={i<r.rating ? "text-amber-500" : "text-zinc-300 dark:text-zinc-700"} />)}
              </div>
              <p className="mt-2 text-sm">{r.text}</p>
              <div className="mt-2 flex flex-wrap gap-1">{r.tags.map(t=> <span key={t} className="text-[11px] px-2 py-0.5 rounded-full border border-[#E7E9FF] dark:border-[#2B2F55]">#{t}</span>)}</div>

              {r.response && (
                <div className="mt-3 rounded-xl border border-[#E7E9FF] dark:border-[#2B2F55] p-3 bg-white/60 dark:bg-white/[0.06]">
                  <div className="text-[11px] text-[#6B72B3] dark:text-[#A7B0FF]/80">Mentor response • {fmtDate(r.response.at)}</div>
                  <div className="text-sm mt-1">{r.response.text}</div>
                </div>
              )}

              <div className="mt-3 flex gap-2">
                <button className={`${btn} ${btnGhost}`}>Edit</button>
                <button className={`${btn} ${btnGhost}`}>Delete</button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-[#6B72B3] dark:text-[#A7B0FF]/80">Showing {slice.length} of {filtered.length}</div>
          <div className="flex items-center gap-2">
            <button className={`${btn} ${btnGhost}`} disabled={page<=1} onClick={()=>setPage(p=>Math.max(1,p-1))}><ChevronLeft size={16}/>Prev</button>
            <button className={`${btn} ${btnGhost}`} disabled={page>=totalPages} onClick={()=>setPage(p=>Math.min(totalPages,p+1))}>Next<ChevronRight size={16}/></button>
          </div>
        </div>
      </div>
    </MenteeAppLayout>
  );
};

export default ME_Reviews;
