import React from "react";
import MenteeAppLayout from "./MenteeAppLayout";
import { Link } from "react-router-dom";
import { Search, Filter, Star, MapPin, Clock, ChevronLeft, ChevronRight, DollarSign } from "lucide-react";

const ringIndigo = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#6366F1]/40";
const card = "rounded-2xl border border-[#E7E9FF] dark:border-[#2B2F55] bg-white/80 dark:bg-white/[0.05] backdrop-blur";
const btn = "inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-semibold transition " + ringIndigo;
const btnGhost = "border border-[#D9DBFF] dark:border-[#30345D] text-[#1B1F3A] dark:text-[#E6E9FF] bg-white/70 dark:bg-white/[0.05] hover:bg-white/90 dark:hover:bg-white/[0.08]";
const btnSolid = "text-white bg-gradient-to-r from-[#4F46E5] via-[#6366F1] to-[#8B5CF6]";

type Mentor = {
  id: string;
  name: string;
  title: string;
  rating: number;
  reviews: number;
  hourly: number;
  timezone: string;
  tags: string[];
  nextSlots: string[]; // e.g. "Today 14:00"
};

const DATA: Mentor[] = Array.from({length: 28}).map((_,i)=>({
  id: "m"+(i+1),
  name: ["Ada Lovette","Rohan Bala","Sara Park","Mason Cole","Ijeoma Kay","Kenji Ito"][i%6],
  title: ["Frontend Architect","SRE • Systems","Product Strategy","Growth • Analytics","Design Systems","Mobile @ Scale"][i%6],
  rating: [4.9,4.8,4.7,4.6,4.8,4.9][i%6],
  reviews: [182,133,89,64,77,141][i%6],
  hourly: [80,95,110,70,85,90][i%6],
  timezone: ["UTC+1","UTC-5","UTC+9","UTC+1","UTC+1","UTC+9"][i%6],
  tags: [["React","DX"],["Kubernetes","Tracing"],["Roadmaps","PLG"],["SEO","Attribution"],["Figma","Tokens"],["Kotlin","Compose"]][i%6],
  nextSlots: ["Today 14:00","Today 18:30","Tomorrow 09:00"].slice(0,(i%3)+1)
}));

const ME_Discover: React.FC = () => {
  const [q, setQ] = React.useState("");
  const [price, setPrice] = React.useState<[number,number]>([0,200]);
  const [rating, setRating] = React.useState<0|4|4.5|4.8>(0);
  const [tag, setTag] = React.useState<string>("all");

  const [page, setPage] = React.useState(1);
  const perPage = 9;

  const tags = Array.from(new Set(DATA.flatMap(m=>m.tags)));

  const filtered = DATA.filter(m=>{
    if (rating && m.rating < rating) return false;
    if (tag !== "all" && !m.tags.includes(tag)) return false;
    if (m.hourly < price[0] || m.hourly > price[1]) return false;
    const hay = `${m.name} ${m.title} ${m.tags.join(" ")}`.toLowerCase();
    return hay.includes(q.toLowerCase());
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const slice = filtered.slice((page-1)*perPage, (page-1)*perPage + perPage);

  React.useEffect(()=>{ setPage(1); }, [q, price, rating, tag]);

  return (
    <MenteeAppLayout>
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold">Discover mentors</h1>
            <p className="text-sm text-[#5E66A6] dark:text-[#A7B0FF]/85">Filter by price, rating, tags, and availability.</p>
          </div>
        </div>

        {/* Controls */}
        <div className="mt-4 grid lg:grid-cols-12 gap-3">
          <div className="lg:col-span-5">
            <div className={`flex items-center gap-2 ${card} h-11 px-3.5`}>
              <Search size={16} className="text-[#5F679A] dark:text-[#A7B0FF]" />
              <input
                className="bg-transparent outline-none text-sm w-full"
                placeholder="Search mentors, skills, titles…"
                value={q}
                onChange={(e)=>setQ(e.target.value)}
              />
            </div>
          </div>
          <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-4 gap-3">
            <select className={`${card} h-11 px-3 text-sm`} value={tag} onChange={(e)=>setTag(e.target.value)}>
              <option value="all">All tags</option>
              {tags.map(t=><option key={t} value={t}>{t}</option>)}
            </select>
            <select className={`${card} h-11 px-3 text-sm`} value={rating} onChange={(e)=>setRating(Number(e.target.value) as any)}>
              <option value={0}>Rating: Any</option>
              <option value={4}>4.0+</option>
              <option value={4.5}>4.5+</option>
              <option value={4.8}>4.8+</option>
            </select>
            <select className={`${card} h-11 px-3 text-sm`} value={price.join("-")} onChange={(e)=>{
              const [a,b] = e.target.value.split("-").map(Number);
              setPrice([a,b]);
            }}>
              <option value="0-200">Price: Any</option>
              <option value="0-80">$0–$80</option>
              <option value="80-100">$80–$100</option>
              <option value="100-200">$100–$200</option>
            </select>
            <button className={`${btn} ${btnGhost}`}><Filter size={16}/> More filters</button>
          </div>
        </div>

        {/* Results */}
        <div className="mt-5 grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {slice.map(m=>(
            <div key={m.id} className={`${card} p-4 flex flex-col`}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold">{m.name}</div>
                  <div className="text-xs text-[#6B72B3] dark:text-[#A7B0FF]/80">{m.title}</div>
                </div>
                <div className="text-sm font-semibold inline-flex items-center gap-1"><DollarSign size={14}/>{m.hourly}/h</div>
              </div>
              <div className="mt-2 flex items-center gap-2 text-xs">
                <Star size={14} className="text-amber-500"/> {m.rating} ({m.reviews})
                <span className="ml-2 inline-flex items-center gap-1 text-[#6B72B3] dark:text-[#A7B0FF]/80"><MapPin size={12}/>{m.timezone}</span>
              </div>
              <div className="mt-2 flex flex-wrap gap-1">
                {m.tags.map(t=> <span key={t} className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] border border-[#E7E9FF] dark:border-[#2B2F55] bg-white/60 dark:bg-white/[0.05]">#{t}</span>)}
              </div>
              <div className="mt-3 text-xs text-[#6B72B3] dark:text-[#A7B0FF]/80 flex flex-wrap gap-2">
                <Clock size={12}/> Next: {m.nextSlots.join(" • ")}
              </div>
              <div className="mt-3 flex gap-2">
                <Link to={`/mentee/mentor/${m.id}`} className={`${btn} ${btnGhost}`}>Profile</Link>
                <Link to="/mentee/booking/select-slot" className={`${btn} ${btnSolid}`}>Book</Link>
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

export default ME_Discover;
