import React from "react";
import { useNavigate } from "react-router-dom";
import MentorAppLayout from "../MentorAppLayout";
import {
  Search, Filter, MoreVertical, ChevronLeft, ChevronRight,
  Star, Clock, Users, Globe, Eye, Pause, Play, Trash2, Tag, PlusCircle
} from "lucide-react";

/* --------------------------- Indigo glass UI tokens --------------------------- */
const ringIndigo = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#6366F1]/40";
const card = "rounded-2xl border border-[#E7E9FF] dark:border-[#2B2F55] bg-white/80 dark:bg-white/[0.05] backdrop-blur";
const btnBase = "inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-semibold transition " + ringIndigo;
const btnSolid = "text-white bg-gradient-to-r from-[#4F46E5] via-[#6366F1] to-[#8B5CF6]";
const btnGhost = "border border-[#D9DBFF] dark:border-[#30345D] text-[#1B1F3A] dark:text-[#E6E9FF] bg-white/70 dark:bg-white/[0.05]";
const pill = "inline-flex items-center gap-2 rounded-full border border-[#E7E9FF] dark:border-[#2B2F55] bg-white/70 dark:bg-white/[0.05] px-3 py-1 text-[11px] font-semibold";

/* --------------------------------- Types ------------------------------------ */
type Visibility = "public" | "unlisted";
type Status = "active" | "paused" | "draft";
type Mode = "online" | "in-person";
type Offer = {
  id: string;
  title: string;
  category: "Frontend" | "Backend" | "Design" | "Growth" | "Career";
  price: number;
  currency: "USD" | "NGN" | "INR" | "EUR";
  durationMin: number;
  mode: Mode;
  visibility: Visibility;
  status: Status;
  rating: number; // 0-5
  bookings: number;
  tags: string[];
  createdAt: string; // ISO
  updatedAt: string; // ISO
};

/* --------------------------------- Data ------------------------------------- */
const daysAgoISO = (d: number) => new Date(Date.now() - d * 864e5).toISOString();
const DUMMY: Offer[] = [
  { id: "o1", title: "Next.js Performance Deep-dive", category: "Frontend", price: 45, currency: "USD", durationMin: 60, mode: "online", visibility: "public", status: "active", rating: 4.9, bookings: 128, tags: ["React", "Vite", "WebVitals"], createdAt: daysAgoISO(80), updatedAt: daysAgoISO(2) },
  { id: "o2", title: "Observability for APIs", category: "Backend", price: 60, currency: "USD", durationMin: 60, mode: "online", visibility: "public", status: "active", rating: 4.8, bookings: 92, tags: ["Tracing", "p95", "Grafana"], createdAt: daysAgoISO(60), updatedAt: daysAgoISO(6) },
  { id: "o3", title: "Design Crit & Portfolio Review", category: "Design", price: 50, currency: "USD", durationMin: 45, mode: "online", visibility: "public", status: "paused", rating: 4.7, bookings: 77, tags: ["Figma", "UX"], createdAt: daysAgoISO(55), updatedAt: daysAgoISO(10) },
  { id: "o4", title: "Growth Strategy Sprint", category: "Growth", price: 90, currency: "USD", durationMin: 90, mode: "online", visibility: "unlisted", status: "draft", rating: 0, bookings: 0, tags: ["Funnels", "Retention"], createdAt: daysAgoISO(20), updatedAt: daysAgoISO(20) },
  { id: "o5", title: "Career Planning (Tech)", category: "Career", price: 35, currency: "USD", durationMin: 30, mode: "online", visibility: "public", status: "active", rating: 4.6, bookings: 150, tags: ["Interview", "Resume"], createdAt: daysAgoISO(90), updatedAt: daysAgoISO(8) },
];

type Filters = {
  q: string;
  category: "all" | Offer["category"];
  status: "all" | Status;
  visibility: "all" | Visibility;
  mode: "all" | Mode;
  sort: "updatedDesc" | "priceDesc" | "priceAsc" | "ratingDesc" | "bookingsDesc";
  minPrice?: string;
  maxPrice?: string;
};

const perPage = 8;

/* -------------------------------- Helpers ----------------------------------- */
function applyFilters(list: Offer[], f: Filters) {
  let out = list.filter((x) => {
    if (f.category !== "all" && x.category !== f.category) return false;
    if (f.status !== "all" && x.status !== f.status) return false;
    if (f.visibility !== "all" && x.visibility !== f.visibility) return false;
    if (f.mode !== "all" && x.mode !== f.mode) return false;
    const min = f.minPrice ? Number(f.minPrice) : -Infinity;
    const max = f.maxPrice ? Number(f.maxPrice) : Infinity;
    if (!(x.price >= min && x.price <= max)) return false;
    if (f.q.trim()) {
      const q = f.q.toLowerCase();
      const hay = `${x.title} ${x.category} ${x.tags.join(" ")}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
  if (f.sort === "updatedDesc") out.sort((a, b) => +new Date(b.updatedAt) - +new Date(a.updatedAt));
  if (f.sort === "priceDesc") out.sort((a, b) => b.price - a.price);
  if (f.sort === "priceAsc") out.sort((a, b) => a.price - b.price);
  if (f.sort === "ratingDesc") out.sort((a, b) => b.rating - a.rating);
  if (f.sort === "bookingsDesc") out.sort((a, b) => b.bookings - a.bookings);
  return out;
}

const fmtDay = (iso: string) => new Date(iso).toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" });

/* ------------------------------- Dropdown ----------------------------------- */
function useOnClickOutside<T extends HTMLElement>(ref: React.RefObject<T>, cb: () => void) {
  React.useEffect(() => {
    const on = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) cb(); };
    const onEsc = (e: KeyboardEvent) => e.key === "Escape" && cb();
    document.addEventListener("mousedown", on); document.addEventListener("keydown", onEsc);
    return () => { document.removeEventListener("mousedown", on); document.removeEventListener("keydown", onEsc); };
  }, [cb, ref]);
}

function RowActions({
  onView, onToggle, onDelete, status
}: { onView: () => void; onToggle: () => void; onDelete: () => void; status: Status }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [open, setOpen] = React.useState(false);
  useOnClickOutside(ref, () => setOpen(false));
  return (
    <div className="relative" ref={ref}>
      <button className={`${btnBase} ${btnGhost} px-2 py-1`} onClick={() => setOpen((v) => !v)} aria-haspopup="menu" aria-expanded={open}>
        <MoreVertical size={16} />
      </button>
      {open && (
        <div className="absolute right-0 mt-2 z-40 w-44 rounded-xl border border-[#E7E9FF] dark:border-[#2B2F55] bg-white dark:bg-[#0B0F2A] shadow-lg p-1">
          <button className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-[#EEF2FF] dark:hover:bg-white/[0.06] inline-flex items-center gap-2" onClick={() => { setOpen(false); onView(); }}>
            <Eye size={16} /> View details
          </button>
          <button className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-[#EEF2FF] dark:hover:bg-white/[0.06] inline-flex items-center gap-2" onClick={() => { setOpen(false); onToggle(); }}>
            {status === "active" ? <Pause size={16} /> : <Play size={16} />} {status === "active" ? "Pause" : "Activate"}
          </button>
          <button className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-rose-50 dark:hover:bg-rose-900/20 inline-flex items-center gap-2 text-rose-600 dark:text-rose-300" onClick={() => { setOpen(false); onDelete(); }}>
            <Trash2 size={16} /> Delete
          </button>
        </div>
      )}
    </div>
  );
}

/* -------------------------------- Component --------------------------------- */
export default function OffersList() {
  const navigate = useNavigate();
  const [rows, setRows] = React.useState<Offer[]>(
    () => JSON.parse(localStorage.getItem("mentora.offers") || "null") ?? DUMMY
  );
  React.useEffect(() => localStorage.setItem("mentora.offers", JSON.stringify(rows)), [rows]);

  const [filters, setFilters] = React.useState<Filters>({
    q: "", category: "all", status: "all", visibility: "all", mode: "all", sort: "updatedDesc", minPrice: "", maxPrice: ""
  });

  const [page, setPage] = React.useState(1);
  const filtered = React.useMemo(() => applyFilters(rows, filters), [rows, filters]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paged = React.useMemo(() => filtered.slice((page - 1) * perPage, page * perPage), [filtered, page]);
  React.useEffect(() => setPage(1), [filters]);

  const toggleStatus = (id: string) =>
    setRows((p) =>
      p.map((r) => r.id === id ? { ...r, status: r.status === "active" ? "paused" : "active", updatedAt: new Date().toISOString() } : r)
    );
  const deleteRow = (id: string) =>
    setRows((p) => p.filter((r) => r.id !== id));

  return (
    <MentorAppLayout>
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-[#0F132E] dark:text-[#E9ECFF]">Offers</h1>
            <p className="text-sm text-[#5E66A6] dark:text-[#A7B0FF]/85">Manage 1:1s, consults, and more.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button className={`${btnBase} ${btnSolid}`} onClick={() => navigate("/dashboard/offers/new")}>
              <PlusCircle size={16} /> New offer
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="mt-4 flex flex-wrap gap-2">
          <div className={`flex items-center gap-2 ${card} h-11 px-3.5 flex-1 min-w-[220px]`}>
            <Search size={16} />
            <input className="bg-transparent outline-none text-sm w-full" placeholder="Search title, tag, category…" value={filters.q} onChange={(e) => setFilters((f) => ({ ...f, q: e.target.value }))} />
          </div>
          <div className={`flex items-center gap-2 ${card} h-11 px-3 flex-wrap`}>
            <Filter size={16} />
            <select className="bg-transparent text-sm outline-none" value={filters.category} onChange={(e) => setFilters((f) => ({ ...f, category: e.target.value as any }))}>
              <option value="all">Category: All</option>
              <option value="Frontend">Frontend</option>
              <option value="Backend">Backend</option>
              <option value="Design">Design</option>
              <option value="Growth">Growth</option>
              <option value="Career">Career</option>
            </select>
            <span className="h-4 w-px bg-[#E7E9FF] dark:bg-[#2B2F55]" />
            <select className="bg-transparent text-sm outline-none" value={filters.status} onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value as any }))}>
              <option value="all">Status: All</option>
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="draft">Draft</option>
            </select>
            <span className="h-4 w-px bg-[#E7E9FF] dark:bg-[#2B2F55]" />
            <select className="bg-transparent text-sm outline-none" value={filters.visibility} onChange={(e) => setFilters((f) => ({ ...f, visibility: e.target.value as any }))}>
              <option value="all">Visibility: All</option>
              <option value="public">Public</option>
              <option value="unlisted">Unlisted</option>
            </select>
            <span className="h-4 w-px bg-[#E7E9FF] dark:bg-[#2B2F55]" />
            <select className="bg-transparent text-sm outline-none" value={filters.mode} onChange={(e) => setFilters((f) => ({ ...f, mode: e.target.value as any }))}>
              <option value="all">Mode: All</option>
              <option value="online">Online</option>
              <option value="in-person">In-person</option>
            </select>
            <span className="hidden sm:inline h-4 w-px bg-[#E7E9FF] dark:bg-[#2B2F55]" />
            <input className="bg-transparent text-sm border rounded-lg px-2 h-8 border-[#E7E9FF] dark:border-[#2B2F55] w-24" placeholder="Min $" value={filters.minPrice} onChange={(e) => setFilters((f) => ({ ...f, minPrice: e.target.value }))} />
            <input className="bg-transparent text-sm border rounded-lg px-2 h-8 border-[#E7E9FF] dark:border-[#2B2F55] w-24" placeholder="Max $" value={filters.maxPrice} onChange={(e) => setFilters((f) => ({ ...f, maxPrice: e.target.value }))} />
            <span className="h-4 w-px bg-[#E7E9FF] dark:bg-[#2B2F55]" />
            <select className="bg-transparent text-sm outline-none" value={filters.sort} onChange={(e) => setFilters((f) => ({ ...f, sort: e.target.value as any }))}>
              <option value="updatedDesc">Sort: Updated ↓</option>
              <option value="priceDesc">Sort: Price ↓</option>
              <option value="priceAsc">Sort: Price ↑</option>
              <option value="ratingDesc">Sort: Rating ↓</option>
              <option value="bookingsDesc">Sort: Bookings ↓</option>
            </select>
          </div>
        </div>

        {/* Content */}
        <div className="mt-4">
          {/* Cards (mobile) */}
          <div className="md:hidden grid grid-cols-1 gap-3">
            {paged.map((r) => (
              <div key={r.id} className={`${card} p-3`}>
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="font-semibold text-sm text-[#0F1536] dark:text-[#E7E9FF] truncate">{r.title}</div>
                    <div className="mt-1 text-[12px] text-[#5E66A6] dark:text-[#A7B0FF]/80">
                      {r.category} · {r.durationMin}m · {r.currency} {r.price}
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-1">
                      <span className={`${pill} !py-0.5`}><Globe size={14} /> {r.visibility}</span>
                      <span className={`${pill} !py-0.5`}><Users size={14} /> {r.bookings} bookings</span>
                      <span className={`${pill} !py-0.5`}><Star size={14} /> {r.rating || "–"}</span>
                      {r.tags.slice(0, 2).map((t) => <span key={t} className={`${pill} !py-0.5`}><Tag size={12} /> {t}</span>)}
                    </div>
                    <div className="mt-1 text-[11px] text-[#6B72B3] dark:text-[#A7B0FF]/80">Updated {fmtDay(r.updatedAt)}</div>
                  </div>
                  <RowActions
                    status={r.status}
                    onView={() => navigate(`/dashboard/offers/${r.id}`)}
                    onToggle={() => toggleStatus(r.id)}
                    onDelete={() => deleteRow(r.id)}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Table (md+) */}
          <div className="hidden md:block overflow-x-auto">
            <table className={`min-w-full ${card}`}>
              <thead>
                <tr className="text-left text-[12px] text-[#6B72B3] dark:text-[#A7B0FF]/80">
                  <th className="px-4 py-3">Offer</th>
                  <th className="px-4 py-3">Pricing</th>
                  <th className="px-4 py-3">Meta</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E7E9FF] dark:divide-[#2B2F55]">
                {paged.map((r) => (
                  <tr key={r.id}>
                    <td className="px-4 py-3 text-sm">
                      <div className="font-semibold">{r.title}</div>
                      <div className="text-[12px] text-[#6B72B3] dark:text-[#A7B0FF]/80">
                        {r.category} · {r.durationMin}m · {r.mode}
                      </div>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {r.tags.slice(0, 3).map((t) => <span key={t} className={`${pill} !py-0.5`}><Tag size={12} /> {t}</span>)}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">{r.currency} {r.price.toFixed(2)}</td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex items-center gap-3">
                        <span className="inline-flex items-center gap-1"><Users size={14} /> {r.bookings}</span>
                        <span className="inline-flex items-center gap-1"><Star size={14} /> {r.rating || "–"}</span>
                        <span className="inline-flex items-center gap-1"><Clock size={14} /> {fmtDay(r.updatedAt)}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm capitalize">{r.status}</td>
                    <td className="px-4 py-3 text-right">
                      <RowActions
                        status={r.status}
                        onView={() => navigate(`/dashboard/offers/${r.id}`)}
                        onToggle={() => toggleStatus(r.id)}
                        onDelete={() => deleteRow(r.id)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="mt-3 flex items-center justify-between">
            <div className="text-[12px] text-[#6B72B3] dark:text-[#A7B0FF]/80">
              Page {page} / {totalPages} · {filtered.length} total
            </div>
            <div className="flex items-center gap-2">
              <button className={`${btnBase} ${btnGhost} px-2 py-1`} disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}><ChevronLeft size={16} /></button>
              <button className={`${btnBase} ${btnGhost} px-2 py-1`} disabled={page >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}><ChevronRight size={16} /></button>
            </div>
          </div>
        </div>
      </div>
    </MentorAppLayout>
  );
}
