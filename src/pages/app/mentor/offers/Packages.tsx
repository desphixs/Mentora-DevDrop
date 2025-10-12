import React from "react";
import MentorAppLayout from "../MentorAppLayout";
import {
  Search, Filter, MoreVertical, ChevronLeft, ChevronRight, Layers, Star, Tag,
  Copy, Archive, ArchiveRestore, Trash2, Edit3, DollarSign
} from "lucide-react";

/* Indigo glass tokens */
const ringIndigo =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#6366F1]/40";
const card =
  "rounded-2xl border border-[#E7E9FF] dark:border-[#2B2F55] bg-white/80 dark:bg-white/[0.05] backdrop-blur";
const btnBase =
  "inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-semibold transition " + ringIndigo;
const btnGhost =
  "border border-[#D9DBFF] dark:border-[#30345D] text-[#1B1F3A] dark:text-[#E6E9FF] bg-white/70 dark:bg-white/[0.05] hover:bg-white/90 dark:hover:bg-white/[0.08]";
const pill =
  "inline-flex items-center gap-2 rounded-full border border-[#E7E9FF] dark:border-[#2B2F55] bg-white/70 dark:bg-white/[0.05] px-3 py-1 text-[11px] font-semibold";

type Visibility = "public" | "private" | "draft" | "archived";
type Pkg = {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: "USD" | "NGN" | "INR" | "EUR";
  sessions: number;
  tags: string[];
  rating: number; // 0-5
  sold: number;
  visibility: Visibility;
  updatedISO: string;
};

const daysAgoISO = (d: number) => new Date(Date.now() - d * 864e5).toISOString();

const DUMMY: Pkg[] = [
  { id: "pk_1", name: "Career Sprint (3x 45m)", description: "Goal mapping + weekly accountability.", price: 120, currency: "USD", sessions: 3, tags: ["career","accountability"], rating: 4.9, sold: 86, visibility: "public", updatedISO: daysAgoISO(2) },
  { id: "pk_2", name: "Frontend Deep-dive (5x 60m)", description: "Perf, DX, and production readiness.", price: 350, currency: "USD", sessions: 5, tags: ["frontend","perf"], rating: 4.8, sold: 41, visibility: "public", updatedISO: daysAgoISO(4) },
  { id: "pk_3", name: "Design Crit Shots (3x 30m)", description: "Rapid critiques + next steps.", price: 90, currency: "USD", sessions: 3, tags: ["design"], rating: 4.7, sold: 59, visibility: "private", updatedISO: daysAgoISO(9) },
  { id: "pk_4", name: "Backend Accelerator (4x 60m)", description: "Tracing, scaling, and data flows.", price: 300, currency: "USD", sessions: 4, tags: ["backend","ops"], rating: 4.8, sold: 33, visibility: "draft", updatedISO: daysAgoISO(13) },
  { id: "pk_5", name: "Group Bootcamp (6x 90m)", description: "Cohort-based FE mastery.", price: 600, currency: "USD", sessions: 6, tags: ["group","frontend"], rating: 4.9, sold: 18, visibility: "archived", updatedISO: daysAgoISO(40) },
];

type Filters = {
  q: string;
  status: "all" | Visibility;
  sessions: "all" | "1-3" | "4-6" | "7+";
  price: "all" | "lt100" | "100-300" | "gt300";
  sort: "updatedDesc" | "updatedAsc" | "priceDesc" | "priceAsc" | "soldDesc";
};

const perPage = 6;

function inBucket(n: number, bucket: Filters["sessions"]) {
  if (bucket === "all") return true;
  if (bucket === "1-3") return n >= 1 && n <= 3;
  if (bucket === "4-6") return n >= 4 && n <= 6;
  return n >= 7;
}
function inPrice(p: number, tag: Filters["price"]) {
  if (tag === "all") return true;
  if (tag === "lt100") return p < 100;
  if (tag === "100-300") return p >= 100 && p <= 300;
  return p > 300;
}
function applyFilters(list: Pkg[], f: Filters) {
  let out = list.filter((x) => {
    if (f.status !== "all" && x.visibility !== f.status) return false;
    if (!inBucket(x.sessions, f.sessions)) return false;
    if (!inPrice(x.price, f.price)) return false;
    if (f.q.trim()) {
      const q = f.q.toLowerCase();
      const hay = `${x.name} ${x.description} ${x.tags.join(" ")}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
  if (f.sort === "updatedDesc") out.sort((a,b) => +new Date(b.updatedISO) - +new Date(a.updatedISO));
  if (f.sort === "updatedAsc") out.sort((a,b) => +new Date(a.updatedISO) - +new Date(b.updatedISO));
  if (f.sort === "priceDesc") out.sort((a,b) => b.price - a.price);
  if (f.sort === "priceAsc") out.sort((a,b) => a.price - b.price);
  if (f.sort === "soldDesc") out.sort((a,b) => b.sold - a.sold);
  return out;
}

export default function Packages() {
  const [rows, setRows] = React.useState<Pkg[]>(
    () => JSON.parse(localStorage.getItem("mentora.offers.packages") || "null") ?? DUMMY
  );
  React.useEffect(() => localStorage.setItem("mentora.offers.packages", JSON.stringify(rows)), [rows]);

  const [filters, setFilters] = React.useState<Filters>({
    q: "", status: "all", sessions: "all", price: "all", sort: "updatedDesc"
  });

  const [page, setPage] = React.useState(1);
  const filtered = React.useMemo(() => applyFilters(rows, filters), [rows, filters]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paged = React.useMemo(() => filtered.slice((page - 1) * perPage, page * perPage), [filtered, page]);
  React.useEffect(() => setPage(1), [filters]);

  // Row menu
  const [menuFor, setMenuFor] = React.useState<string | null>(null);
  const menuRef = React.useRef<HTMLDivElement | null>(null);
  React.useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!menuRef.current) return;
      if (!(e.target instanceof Node)) return;
      if (!menuRef.current.contains(e.target)) setMenuFor(null);
    };
    const onEsc = (e: KeyboardEvent) => e.key === "Escape" && setMenuFor(null);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, []);

  const duplicate = (id: string) => {
    const src = rows.find((r) => r.id === id)!;
    const copy: Pkg = { ...src, id: "pk_" + Math.random().toString(36).slice(2,7), name: src.name + " (Copy)", updatedISO: new Date().toISOString(), visibility: "draft", sold: 0 };
    setRows((p) => [copy, ...p]);
  };
  const toggleArchive = (id: string) => {
    setRows((p) => p.map((r) => r.id === id ? ({ ...r, visibility: r.visibility === "archived" ? "public" : "archived", updatedISO: new Date().toISOString() }) : r));
  };
  const deleteRow = (id: string) => setRows((p) => p.filter((r) => r.id !== id));

  const activeCount = rows.filter((r) => r.visibility === "public").length;
  const revenueGuess = rows.reduce((s,x) => s + x.sold * x.price, 0);

  return (
    <MentorAppLayout>
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        {/* Header + chips */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-[#0F132E] dark:text-[#E9ECFF]">Packages</h1>
            <p className="text-sm text-[#5E66A6] dark:text-[#A7B0FF]/85">Bundle sessions into high-converting offers.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className={pill}><Layers size={14}/> {rows.length} packages</span>
            <span className={pill}><Star size={14}/> {activeCount} public</span>
            <span className={pill}><DollarSign size={14}/> est. ${revenueGuess.toFixed(0)}</span>
          </div>
        </div>

        {/* Filters / Search */}
        <div className="mt-4 flex flex-wrap gap-2">
          <div className={`flex items-center gap-2 ${card} h-11 px-3.5 flex-1 min-w-[220px]`}>
            <Search size={16}/>
            <input
              className="bg-transparent outline-none text-sm w-full"
              placeholder="Search name, tags, description…"
              value={filters.q}
              onChange={(e) => setFilters((f) => ({ ...f, q: e.target.value }))}
            />
          </div>
          <div className={`flex items-center gap-2 ${card} h-11 px-3 flex-wrap`}>
            <Filter size={16}/>
            <select className="bg-transparent text-sm outline-none" value={filters.status} onChange={(e)=>setFilters((f)=>({...f, status: e.target.value as any}))}>
              <option value="all">Status: All</option>
              <option value="public">Public</option>
              <option value="private">Private</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
            <span className="h-4 w-px bg-[#E7E9FF] dark:bg-[#2B2F55]" />
            <select className="bg-transparent text-sm outline-none" value={filters.sessions} onChange={(e)=>setFilters((f)=>({...f, sessions: e.target.value as any}))}>
              <option value="all">Sessions: Any</option>
              <option value="1-3">1–3</option>
              <option value="4-6">4–6</option>
              <option value="7+">7+</option>
            </select>
            <span className="h-4 w-px bg-[#E7E9FF] dark:bg-[#2B2F55]" />
            <select className="bg-transparent text-sm outline-none" value={filters.price} onChange={(e)=>setFilters((f)=>({...f, price: e.target.value as any}))}>
              <option value="all">Price: Any</option>
              <option value="lt100">&lt; $100</option>
              <option value="100-300">$100–$300</option>
              <option value="gt300">&gt; $300</option>
            </select>
            <span className="h-4 w-px bg-[#E7E9FF] dark:bg-[#2B2F55]" />
            <select className="bg-transparent text-sm outline-none" value={filters.sort} onChange={(e)=>setFilters((f)=>({...f, sort: e.target.value as any}))}>
              <option value="updatedDesc">Sort: Updated ↓</option>
              <option value="updatedAsc">Sort: Updated ↑</option>
              <option value="priceDesc">Sort: Price ↓</option>
              <option value="priceAsc">Sort: Price ↑</option>
              <option value="soldDesc">Sort: Sold ↓</option>
            </select>
          </div>
        </div>

        {/* Content: cards (mobile) + table (md+) */}
        <div className="mt-4">
          {/* Cards */}
          <div className="md:hidden grid grid-cols-1 gap-3">
            {paged.map((r) => (
              <div key={r.id} className={`${card} p-3 relative`}>
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-xl grid place-items-center bg-[#EEF2FF] dark:bg-white/[0.08] border border-[#E7E9FF] dark:border-[#2B2F55]">
                        <Layers size={14}/>
                      </div>
                      <div className="font-semibold text-sm truncate">{r.name}</div>
                    </div>
                    <div className="mt-1 text-[12px] text-[#5E66A6] dark:text-[#A7B0FF]/80">{r.description}</div>
                    <div className="mt-2 flex flex-wrap items-center gap-1">
                      <span className={`${pill} !py-0.5`}>{r.currency} {r.price.toFixed(2)}</span>
                      <span className={`${pill} !py-0.5`}><Tag size={14}/> {r.sessions} sessions</span>
                      <span className={`${pill} !py-0.5`}><Star size={14}/> {r.rating.toFixed(1)}</span>
                      <span className={`${pill} !py-0.5`}>{r.visibility}</span>
                    </div>
                  </div>
                  <div className="relative" ref={menuRef}>
                    <button
                      className={`${btnBase} ${btnGhost} px-2 py-1`}
                      aria-haspopup="menu"
                      aria-expanded={menuFor === r.id}
                      onClick={() => setMenuFor(menuFor === r.id ? null : r.id)}
                    >
                      <MoreVertical size={16}/>
                    </button>
                    {menuFor === r.id && (
                      <div role="menu" className={`${card} absolute right-0 top-10 w-44 p-1 z-40`}>
                        <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/70 dark:hover:bg-white/[0.06] inline-flex items-center gap-2">
                          <Edit3 size={14}/> Edit
                        </button>
                        <button onClick={()=>duplicate(r.id)} className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/70 dark:hover:bg-white/[0.06] inline-flex items-center gap-2">
                          <Copy size={14}/> Duplicate
                        </button>
                        <button onClick={()=>toggleArchive(r.id)} className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/70 dark:hover:bg-white/[0.06] inline-flex items-center gap-2">
                          {r.visibility === "archived" ? <ArchiveRestore size={14}/> : <Archive size={14}/> }
                          {r.visibility === "archived" ? "Unarchive" : "Archive"}
                        </button>
                        <button onClick={()=>deleteRow(r.id)} className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/70 dark:hover:bg-white/[0.06] inline-flex items-center gap-2 text-rose-600">
                          <Trash2 size={14}/> Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className={`min-w-full ${card}`}>
              <thead>
                <tr className="text-left text-[12px] text-[#6B72B3] dark:text-[#A7B0FF]/80">
                  <th className="px-4 py-3">Package</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="px-4 py-3">Sessions</th>
                  <th className="px-4 py-3">Tags</th>
                  <th className="px-4 py-3">Rating</th>
                  <th className="px-4 py-3">Sold</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E7E9FF] dark:divide-[#2B2F55]">
                {paged.map((r) => (
                  <tr key={r.id} className="relative">
                    <td className="px-4 py-3 text-sm font-semibold">
                      {r.name}
                      <div className="text-[12px] text-[#6B72B3] dark:text-[#A7B0FF]/80 truncate">{r.description}</div>
                    </td>
                    <td className="px-4 py-3 text-sm">{r.currency} {r.price.toFixed(2)}</td>
                    <td className="px-4 py-3 text-sm">{r.sessions}</td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex flex-wrap gap-1">
                        {r.tags.map((t) => <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-[#EEF2FF] dark:bg-white/[0.06] border border-[#E7E9FF] dark:border-[#2B2F55]">{t}</span>)}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">{r.rating.toFixed(1)}</td>
                    <td className="px-4 py-3 text-sm">{r.sold}</td>
                    <td className="px-4 py-3 text-sm capitalize">{r.visibility}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="relative" ref={menuRef}>
                        <button
                          className={`${btnBase} ${btnGhost} px-2 py-1`}
                          aria-haspopup="menu"
                          aria-expanded={menuFor === r.id}
                          onClick={() => setMenuFor(menuFor === r.id ? null : r.id)}
                        >
                          <MoreVertical size={16}/>
                        </button>
                        {menuFor === r.id && (
                          <div role="menu" className={`${card} absolute right-0 top-10 w-44 p-1 z-40`}>
                            <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/70 dark:hover:bg-white/[0.06] inline-flex items-center gap-2">
                              <Edit3 size={14}/> Edit
                            </button>
                            <button onClick={()=>duplicate(r.id)} className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/70 dark:hover:bg-white/[0.06] inline-flex items-center gap-2">
                              <Copy size={14}/> Duplicate
                            </button>
                            <button onClick={()=>toggleArchive(r.id)} className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/70 dark:hover:bg-white/[0.06] inline-flex items-center gap-2">
                              {r.visibility === "archived" ? <ArchiveRestore size={14}/> : <Archive size={14}/> }
                              {r.visibility === "archived" ? "Unarchive" : "Archive"}
                            </button>
                            <button onClick={()=>deleteRow(r.id)} className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/70 dark:hover:bg-white/[0.06] inline-flex items-center gap-2 text-rose-600">
                              <Trash2 size={14}/> Delete
                            </button>
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
