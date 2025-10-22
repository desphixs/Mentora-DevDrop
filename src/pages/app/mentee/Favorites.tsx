import React from "react";
import MenteeAppLayout from "./MenteeAppLayout";
import { Link } from "react-router-dom";
import { Search, Filter, Star, Trash2, ChevronLeft, ChevronRight, Tag, Heart } from "lucide-react";

const ringIndigo = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#6366F1]/40";
const card = "rounded-2xl border border-[#E7E9FF] dark:border-[#2B2F55] bg-white/80 dark:bg-white/[0.05] backdrop-blur";
const btn = "inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-semibold transition " + ringIndigo;
const btnGhost = "border border-[#D9DBFF] dark:border-[#30345D] text-[#1B1F3A] dark:text-[#E6E9FF] bg-white/70 dark:bg-white/[0.05] hover:bg-white/90 dark:hover:bg-white/[0.08]";
const btnSolid = "text-white bg-gradient-to-r from-[#4F46E5] via-[#6366F1] to-[#8B5CF6]";

type Fav = {
  id: string;
  name: string;
  title: string;
  rating: number;
  reviews: number;
  hourly: number;
  tags: string[];
  folder: string; // e.g., "Frontend", "Leadership"
};

const DATA: Fav[] = [
  { id:"m1", name:"Ada Lovette", title:"Frontend Architect", rating:4.9, reviews:182, hourly:80, tags:["React","DX"], folder:"Frontend" },
  { id:"m2", name:"Rohan Bala", title:"SRE • Systems", rating:4.8, reviews:133, hourly:95, tags:["K8s","Tracing"], folder:"Backend" },
  { id:"m3", name:"Sara Park", title:"Product Strategy", rating:4.7, reviews:89, hourly:110, tags:["Roadmaps","PLG"], folder:"Product" },
  { id:"m4", name:"Mason Cole", title:"Growth • Analytics", rating:4.6, reviews:64, hourly:70, tags:["Attribution","SEO"], folder:"Growth" },
  { id:"m5", name:"Ijeoma Kay", title:"Design Systems", rating:4.8, reviews:77, hourly:85, tags:["Figma","Tokens"], folder:"Design" },
  { id:"m6", name:"Kenji Ito", title:"Mobile @ Scale", rating:4.9, reviews:141, hourly:90, tags:["Android","Compose"], folder:"Mobile" },
];

const ME_Favorites: React.FC = () => {
  const [q, setQ] = React.useState("");
  const [folder, setFolder] = React.useState("all");
  const [minRating, setMinRating] = React.useState(0);
  const [page, setPage] = React.useState(1);
  const perPage = 6;

  const folders = ["all", ...Array.from(new Set(DATA.map(d=>d.folder)))];

  const filtered = DATA.filter(d=>{
    if (folder!=="all" && d.folder!==folder) return false;
    if (minRating && d.rating < minRating) return false;
    const hay = `${d.name} ${d.title} ${d.tags.join(" ")} ${d.folder}`.toLowerCase();
    return hay.includes(q.toLowerCase());
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const slice = filtered.slice((page-1)*perPage, (page-1)*perPage + perPage);

  React.useEffect(()=>{ setPage(1); }, [q, folder, minRating]);

  return (
    <MenteeAppLayout>
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold">Favorites</h1>
            <p className="text-sm text-[#5E66A6] dark:text-[#A7B0FF]/85">Organize mentors into folders, filter by rating, and book fast.</p>
          </div>
        </div>

        {/* Controls */}
        <div className="mt-4 grid lg:grid-cols-12 gap-3">
          <div className="lg:col-span-5">
            <div className={`flex items-center gap-2 ${card} h-11 px-3.5`}>
              <Search size={16} className="text-[#5F679A] dark:text-[#A7B0FF]" />
              <input className="bg-transparent outline-none text-sm w-full" placeholder="Search favorites…" value={q} onChange={(e)=>setQ(e.target.value)} />
            </div>
          </div>
          <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-4 gap-3">
            <select className={`${card} h-11 px-3 text-sm`} value={folder} onChange={(e)=>setFolder(e.target.value)}>
              {folders.map(f=> <option key={f} value={f}>{f[0].toUpperCase()+f.slice(1)}</option>)}
            </select>
            <select className={`${card} h-11 px-3 text-sm`} value={minRating} onChange={(e)=>setMinRating(Number(e.target.value))}>
              <option value={0}>Rating: Any</option>
              <option value={4}>4.0+</option>
              <option value={4.5}>4.5+</option>
              <option value={4.8}>4.8+</option>
            </select>
            <button className={`${btn} ${btnGhost}`}><Filter size={16}/> More filters</button>
            <button className={`${btn} ${btnSolid}`}><Heart size={16}/> New folder</button>
          </div>
        </div>

        {/* Grid */}
        <div className="mt-5 grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {slice.map(d=>(
            <div key={d.id} className={`${card} p-4`}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold">{d.name}</div>
                  <div className="text-xs text-[#6B72B3] dark:text-[#A7B0FF]/80">{d.title}</div>
                </div>
                <span className="inline-flex items-center gap-1 text-xs border border-[#E7E9FF] dark:border-[#2B2F55] rounded-full px-2 py-0.5"><Tag size={12}/> {d.folder}</span>
              </div>
              <div className="mt-2 flex items-center gap-2 text-xs">
                <Star size={14} className="text-amber-500"/> {d.rating} ({d.reviews})
              </div>
              <div className="mt-2 flex flex-wrap gap-1">{d.tags.map(t=> <span key={t} className="text-[11px] px-2 py-0.5 rounded-full border border-[#E7E9FF] dark:border-[#2B2F55]">#{t}</span>)}</div>
              <div className="mt-3 flex gap-2">
                <Link to={`/mentee/mentor/${d.id}`} className={`${btn} ${btnGhost}`}>Profile</Link>
                <Link to="/mentee/booking/select-slot" className={`${btn} ${btnSolid}`}>Book</Link>
                <button className={`${btn} ${btnGhost}`}><Trash2 size={16}/> Remove</button>
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

export default ME_Favorites;
