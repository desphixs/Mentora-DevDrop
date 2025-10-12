import React from "react";
import MentorAppLayout from "../MentorAppLayout";
import {
  Search, Filter, MoreVertical, ChevronLeft, ChevronRight, Percent, CalendarRange, Hash, Copy, CheckCircle2, XCircle, Trash2, Plus
} from "lucide-react";

/* Tokens */
const ringIndigo =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#6366F1]/40";
const card =
  "rounded-2xl border border-[#E7E9FF] dark:border-[#2B2F55] bg-white/80 dark:bg-white/[0.05] backdrop-blur";
const btnBase =
  "inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-semibold transition " + ringIndigo;
const btnSolid =
  "text-white bg-gradient-to-r from-[#4F46E5] via-[#6366F1] to-[#8B5CF6]";
const btnGhost =
  "border border-[#D9DBFF] dark:border-[#30345D] text-[#1B1F3A] dark:text-[#E6E9FF] bg-white/70 dark:bg-white/[0.05]";
const pill =
  "inline-flex items-center gap-2 rounded-full border border-[#E7E9FF] dark:border-[#2B2F55] bg-white/70 dark:bg-white/[0.05] px-3 py-1 text-[11px] font-semibold";

type CStatus = "active" | "scheduled" | "expired" | "disabled";
type CType = "percent" | "fixed";
type AppliesTo = "all" | "packages" | "1:1" | "group";

type Coupon = {
  id: string; // cp_xxx
  code: string; // SAVE20
  name: string;
  type: CType;
  amount: number;
  currency?: "USD" | "NGN" | "INR" | "EUR"; // for fixed
  status: CStatus;
  startsISO: string;
  endsISO: string;
  minSpend?: number;
  maxUses?: number;
  used: number;
  appliesTo: AppliesTo;
};

const daysAfterISO = (d: number) => new Date(Date.now() + d * 864e5).toISOString();
const daysAgoISO = (d: number) => new Date(Date.now() - d * 864e5).toISOString();

const DUMMY: Coupon[] = [
  { id: "cp_1", code: "SAVE20", name: "Spring 20%", type: "percent", amount: 20, status: "active", startsISO: daysAgoISO(5), endsISO: daysAfterISO(20), used: 14, appliesTo: "all", maxUses: 100 },
  { id: "cp_2", code: "BUNDLE50", name: "Bundle $50 off", type: "fixed", amount: 50, currency: "USD", status: "scheduled", startsISO: daysAfterISO(2), endsISO: daysAfterISO(35), used: 0, appliesTo: "packages", minSpend: 200 },
  { id: "cp_3", code: "GROUP15", name: "Group 15%", type: "percent", amount: 15, status: "active", startsISO: daysAgoISO(1), endsISO: daysAfterISO(60), used: 8, appliesTo: "group" },
  { id: "cp_4", code: "LEGACY10", name: "Legacy 10%", type: "percent", amount: 10, status: "expired", startsISO: daysAgoISO(60), endsISO: daysAgoISO(2), used: 52, appliesTo: "1:1" },
];

type Filters = {
  q: string;
  status: "all" | CStatus;
  type: "all" | CType;
  applies: "all" | AppliesTo;
  sort: "endSoon" | "recent" | "usageDesc";
};

const perPage = 8;
const fmtDay = (iso: string) => new Date(iso).toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" });

function applyFilters(list: Coupon[], f: Filters) {
  let out = list.filter((x) => {
    if (f.status !== "all" && x.status !== f.status) return false;
    if (f.type !== "all" && x.type !== f.type) return false;
    if (f.applies !== "all" && x.appliesTo !== f.applies) return false;
    if (f.q.trim()) {
      const q = f.q.toLowerCase();
      const hay = `${x.code} ${x.name}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
  if (f.sort === "endSoon") out.sort((a,b)=>+new Date(a.endsISO)-+new Date(b.endsISO));
  if (f.sort === "recent") out.sort((a,b)=>+new Date(b.startsISO)-+new Date(a.startsISO));
  if (f.sort === "usageDesc") out.sort((a,b)=>b.used-(a.used));
  return out;
}

export default function Coupons() {
  const [rows, setRows] = React.useState<Coupon[]>(
    () => JSON.parse(localStorage.getItem("mentora.offers.coupons") || "null") ?? DUMMY
  );
  React.useEffect(()=>localStorage.setItem("mentora.offers.coupons", JSON.stringify(rows)),[rows]);

  const [filters, setFilters] = React.useState<Filters>({ q:"", status:"all", type:"all", applies:"all", sort:"endSoon" });

  const [page, setPage] = React.useState(1);
  const filtered = React.useMemo(()=>applyFilters(rows, filters),[rows, filters]);
  const totalPages = Math.max(1, Math.ceil(filtered.length/perPage));
  const paged = React.useMemo(()=>filtered.slice((page-1)*perPage, page*perPage),[filtered, page]);
  React.useEffect(()=>setPage(1),[filters]);

  // row menu
  const [menuFor, setMenuFor] = React.useState<string | null>(null);
  const menuRef = React.useRef<HTMLDivElement | null>(null);
  React.useEffect(() => {
    const onClick = (e: MouseEvent) => { if (menuRef.current && e.target instanceof Node && !menuRef.current.contains(e.target)) setMenuFor(null); };
    const onEsc = (e: KeyboardEvent) => e.key === "Escape" && setMenuFor(null);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onEsc);
    return () => { document.removeEventListener("mousedown", onClick); document.removeEventListener("keydown", onEsc); };
  }, []);

  // actions
  const copyCode = (c: string) => { navigator.clipboard.writeText(c); alert("Code copied"); };
  const toggleStatus = (id: string) => setRows((p)=>p.map((r)=>r.id===id?{...r,status:r.status==="disabled"?"active":"disabled"}:r));
  const deleteRow = (id: string) => setRows((p)=>p.filter((r)=>r.id!==id));
  const duplicate = (id: string) => {
    const src = rows.find((r)=>r.id===id)!;
    const copy: Coupon = { ...src, id: "cp_"+Math.random().toString(36).slice(2,7), code: src.code+"2", name: src.name+" (Copy)", status:"scheduled", startsISO: new Date().toISOString(), endsISO: new Date(Date.now()+14*864e5).toISOString(), used: 0 };
    setRows((p)=>[copy,...p]);
  };

  // Create coupon (inline)
  const [createOpen, setCreateOpen] = React.useState(false);
  const [draft, setDraft] = React.useState<Coupon>({
    id: "", code: "", name: "", type:"percent", amount:10, status:"scheduled", startsISO:new Date().toISOString(), endsISO:new Date(Date.now()+30*864e5).toISOString(), used:0, appliesTo:"all", currency:"USD"
  });

  const onCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.code.trim()) return alert("Code is required");
    if (new Date(draft.endsISO) < new Date(draft.startsISO)) return alert("End date must be after start date");
    const payload = { ...draft, id: "cp_"+Math.random().toString(36).slice(2,7) };
    setRows((p)=>[payload, ...p]);
    setCreateOpen(false);
  };

  const active = rows.filter((r)=>r.status==="active").length;
  const expired = rows.filter((r)=>r.status==="expired").length;

  return (
    <MentorAppLayout>
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-[#0F132E] dark:text-[#E9ECFF]">Coupons</h1>
            <p className="text-sm text-[#5E66A6] dark:text-[#A7B0FF]/85">Run promotions and track usage.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className={pill}><Percent size={14}/> {rows.length} total</span>
            <span className={pill}><CheckCircle2 size={14}/> {active} active</span>
            <span className={pill}><XCircle size={14}/> {expired} expired</span>
          </div>
        </div>

        {/* Quick creator */}
        <div className="mt-4">
          <button className={`${btnBase} ${btnSolid}`} onClick={()=>setCreateOpen((v)=>!v)}><Plus size={16}/> {createOpen?"Close":"Create coupon"}</button>
          {createOpen && (
            <form onSubmit={onCreate} className={`${card} p-4 mt-3 grid sm:grid-cols-2 lg:grid-cols-4 gap-3`}>
              <div>
                <label className="text-sm font-semibold">Code</label>
                <input className="mt-1 w-full h-11 px-3 rounded-xl border border-[#E7E9FF] dark:border-[#2B2F55]" value={draft.code} onChange={(e)=>setDraft({...draft, code: e.target.value.toUpperCase()})} placeholder="SAVE20"/>
              </div>
              <div>
                <label className="text-sm font-semibold">Name</label>
                <input className="mt-1 w-full h-11 px-3 rounded-xl border border-[#E7E9FF] dark:border-[#2B2F55]" value={draft.name} onChange={(e)=>setDraft({...draft, name: e.target.value})} placeholder="Summer Promo"/>
              </div>
              <div>
                <label className="text-sm font-semibold">Type</label>
                <select className="mt-1 w-full h-11 px-3 rounded-xl border border-[#E7E9FF] dark:border-[#2B2F55]" value={draft.type} onChange={(e)=>setDraft({...draft, type: e.target.value as any})}>
                  <option value="percent">Percent</option>
                  <option value="fixed">Fixed</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-semibold">Amount</label>
                <input type="number" min={0} className="mt-1 w-full h-11 px-3 rounded-xl border border-[#E7E9FF] dark:border-[#2B2F55]" value={draft.amount} onChange={(e)=>setDraft({...draft, amount: Number(e.target.value)})}/>
              </div>
              {draft.type==="fixed" && (
                <div>
                  <label className="text-sm font-semibold">Currency</label>
                  <select className="mt-1 w-full h-11 px-3 rounded-xl border border-[#E7E9FF] dark:border-[#2B2F55]" value={draft.currency} onChange={(e)=>setDraft({...draft, currency: e.target.value as any})}>
                    <option>USD</option><option>NGN</option><option>INR</option><option>EUR</option>
                  </select>
                </div>
              )}
              <div>
                <label className="text-sm font-semibold">Applies to</label>
                <select className="mt-1 w-full h-11 px-3 rounded-xl border border-[#E7E9FF] dark:border-[#2B2F55]" value={draft.appliesTo} onChange={(e)=>setDraft({...draft, appliesTo: e.target.value as any})}>
                  <option value="all">All</option>
                  <option value="packages">Packages</option>
                  <option value="1:1">1:1</option>
                  <option value="group">Group</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-semibold">Start</label>
                <input type="date" className="mt-1 w-full h-11 px-3 rounded-xl border border-[#E7E9FF] dark:border-[#2B2F55]"
                  value={draft.startsISO.slice(0,10)} onChange={(e)=>setDraft({...draft, startsISO: new Date(e.target.value).toISOString()})}/>
              </div>
              <div>
                <label className="text-sm font-semibold">End</label>
                <input type="date" className="mt-1 w-full h-11 px-3 rounded-xl border border-[#E7E9FF] dark:border-[#2B2F55]"
                  value={draft.endsISO.slice(0,10)} onChange={(e)=>setDraft({...draft, endsISO: new Date(e.target.value).toISOString()})}/>
              </div>
              <div>
                <label className="text-sm font-semibold">Min spend</label>
                <input type="number" min={0} className="mt-1 w-full h-11 px-3 rounded-xl border border-[#E7E9FF] dark:border-[#2B2F55]" value={draft.minSpend ?? 0} onChange={(e)=>setDraft({...draft, minSpend: Number(e.target.value) || undefined})}/>
              </div>
              <div>
                <label className="text-sm font-semibold">Max uses</label>
                <input type="number" min={0} className="mt-1 w-full h-11 px-3 rounded-xl border border-[#E7E9FF] dark:border-[#2B2F55]" value={draft.maxUses ?? 0} onChange={(e)=>setDraft({...draft, maxUses: Number(e.target.value) || undefined})}/>
              </div>
              <div className="sm:col-span-2 lg:col-span-4 flex items-end">
                <button className={`${btnBase} ${btnSolid}`} type="submit"><Plus size={16}/> Add coupon</button>
              </div>
            </form>
          )}
        </div>

        {/* Filters/Search */}
        <div className="mt-4 flex flex-wrap gap-2">
          <div className={`flex items-center gap-2 ${card} h-11 px-3.5 flex-1 min-w-[220px]`}>
            <Search size={16}/>
            <input className="bg-transparent outline-none text-sm w-full" placeholder="Search code or name…" value={filters.q} onChange={(e)=>setFilters((f)=>({...f,q:e.target.value}))}/>
          </div>
          <div className={`flex items-center gap-2 ${card} h-11 px-3 flex-wrap`}>
            <Filter size={16}/>
            <select className="bg-transparent text-sm outline-none" value={filters.status} onChange={(e)=>setFilters((f)=>({...f,status:e.target.value as any}))}>
              <option value="all">Status: All</option>
              <option value="active">Active</option>
              <option value="scheduled">Scheduled</option>
              <option value="expired">Expired</option>
              <option value="disabled">Disabled</option>
            </select>
            <span className="h-4 w-px bg-[#E7E9FF] dark:bg-[#2B2F55]"/>
            <select className="bg-transparent text-sm outline-none" value={filters.type} onChange={(e)=>setFilters((f)=>({...f,type:e.target.value as any}))}>
              <option value="all">Type: Any</option>
              <option value="percent">Percent</option>
              <option value="fixed">Fixed</option>
            </select>
            <span className="h-4 w-px bg-[#E7E9FF] dark:bg-[#2B2F55]"/>
            <select className="bg-transparent text-sm outline-none" value={filters.applies} onChange={(e)=>setFilters((f)=>({...f,applies:e.target.value as any}))}>
              <option value="all">Applies: All</option>
              <option value="packages">Packages</option>
              <option value="1:1">1:1</option>
              <option value="group">Group</option>
            </select>
            <span className="h-4 w-px bg-[#E7E9FF] dark:bg-[#2B2F55]"/>
            <select className="bg-transparent text-sm outline-none" value={filters.sort} onChange={(e)=>setFilters((f)=>({...f,sort:e.target.value as any}))}>
              <option value="endSoon">Sort: Ending soon</option>
              <option value="recent">Sort: Recent</option>
              <option value="usageDesc">Sort: Usage ↓</option>
            </select>
          </div>
        </div>

        {/* Content */}
        <div className="mt-4">
          {/* Cards (mobile) */}
          <div className="md:hidden grid grid-cols-1 gap-3">
            {paged.map((c)=>(
              <div key={c.id} className={`${card} p-3 relative`}>
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-xl grid place-items-center bg-[#EEF2FF] dark:bg-white/[0.08] border border-[#E7E9FF] dark:border-[#2B2F55]">
                        <Percent size={14}/>
                      </div>
                      <div className="font-semibold text-sm truncate">{c.code} — {c.name}</div>
                    </div>
                    <div className="mt-1 text-[12px] text-[#5E66A6] dark:text-[#A7B0FF]/80">
                      {c.type === "percent" ? `${c.amount}%` : `${c.currency} ${c.amount}`} · {c.appliesTo}
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-1">
                      <span className={pill}><CalendarRange size={14}/> {fmtDay(c.startsISO)} → {fmtDay(c.endsISO)}</span>
                      {c.minSpend != null && <span className={pill}>Min ${c.minSpend}</span>}
                      {c.maxUses != null && <span className={pill}>Uses {c.used}/{c.maxUses}</span>}
                      {c.maxUses == null && <span className={pill}>Uses {c.used}</span>}
                      <span className={pill}>{c.status}</span>
                    </div>
                  </div>
                  <RowMenu
                    open={menuFor===c.id}
                    onToggle={()=>setMenuFor(menuFor===c.id?null:c.id)}
                    menuRef={menuRef}
                    items={[
                      { label:"Copy code", icon:<Hash size={14}/>, onClick:()=>copyCode(c.code) },
                      { label:c.status==="disabled"?"Activate":"Disable", icon: c.status==="disabled"?<CheckCircle2 size={14}/>:<XCircle size={14}/>, onClick:()=>toggleStatus(c.id) },
                      { label:"Duplicate", icon:<Copy size={14}/>, onClick:()=>duplicate(c.id) },
                      { label:"Delete", icon:<Trash2 size={14}/>, danger:true, onClick:()=>deleteRow(c.id) },
                    ]}
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
                  <th className="px-4 py-3">Code</th>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Applies</th>
                  <th className="px-4 py-3">Window</th>
                  <th className="px-4 py-3">Usage</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E7E9FF] dark:divide-[#2B2F55]">
                {paged.map((c)=>(
                  <tr key={c.id} className="relative">
                    <td className="px-4 py-3 text-sm font-semibold">{c.code}</td>
                    <td className="px-4 py-3 text-sm">{c.name}</td>
                    <td className="px-4 py-3 text-sm">{c.type==="percent"?`${c.amount}%`:`${c.currency} ${c.amount.toFixed(2)}`}</td>
                    <td className="px-4 py-3 text-sm">{c.appliesTo}</td>
                    <td className="px-4 py-3 text-sm">{fmtDay(c.startsISO)} → {fmtDay(c.endsISO)}</td>
                    <td className="px-4 py-3 text-sm">{c.used}{c.maxUses!=null?`/${c.maxUses}`:""}</td>
                    <td className="px-4 py-3 text-sm capitalize">{c.status}</td>
                    <td className="px-4 py-3 text-right">
                      <RowMenu
                        open={menuFor===c.id}
                        onToggle={()=>setMenuFor(menuFor===c.id?null:c.id)}
                        menuRef={menuRef}
                        items={[
                          { label:"Copy code", icon:<Hash size={14}/>, onClick:()=>copyCode(c.code) },
                          { label:c.status==="disabled"?"Activate":"Disable", icon: c.status==="disabled"?<CheckCircle2 size={14}/>:<XCircle size={14}/>, onClick:()=>toggleStatus(c.id) },
                          { label:"Duplicate", icon:<Copy size={14}/>, onClick:()=>duplicate(c.id) },
                          { label:"Delete", icon:<Trash2 size={14}/>, danger:true, onClick:()=>deleteRow(c.id) },
                        ]}
                      />
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

/* Reusable absolute dropdown (no modal) */
function RowMenu({
  open, onToggle, items, menuRef
}: {
  open: boolean;
  onToggle: () => void;
  items: { label: string; icon: React.ReactNode; onClick: () => void; danger?: boolean }[];
  menuRef: React.RefObject<HTMLDivElement>;
}) {
  return (
    <div className="relative" ref={menuRef}>
      <button className={`${btnBase} ${btnGhost} px-2 py-1`} aria-haspopup="menu" aria-expanded={open} onClick={onToggle}>
        <MoreVertical size={16}/>
      </button>
      {open && (
        <div role="menu" className={`${card} absolute right-0 top-10 w-48 p-1 z-40`}>
          {items.map((it, i)=>(
            <button key={i} onClick={it.onClick}
              className={`w-full text-left px-3 py-2 rounded-lg hover:bg-white/70 dark:hover:bg-white/[0.06] inline-flex items-center gap-2 ${it.danger?"text-rose-600":""}`}>
              {it.icon} {it.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
