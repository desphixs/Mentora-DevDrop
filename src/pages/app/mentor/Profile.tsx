import React from "react";
import MentorAppLayout from "./MentorAppLayout";
import {
  User, Camera, Save, Loader2, Link as LinkIcon, AtSign, Globe, MapPin, Phone, Mail,
  Tag, Clock, Users, Star, MessageSquare, MoreVertical, Trash2, Edit3,
  ChevronLeft, ChevronRight, Search, Filter, CheckCircle2, XCircle
} from "lucide-react";

/* ---------------------------
   Indigo glass UI tokens
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
const pill =
  "inline-flex items-center gap-2 rounded-full border border-[#E7E9FF] dark:border-[#2B2F55] bg-white/70 dark:bg-white/[0.05] px-3 py-1 text-[11px] font-semibold";

/* ---------------------------
   Types & Dummy
---------------------------- */
type ProfileForm = {
  avatar?: string; // data URL
  fullName: string;
  username: string;
  email: string;
  phone?: string;
  country?: string;
  city?: string;
  timezone: string;
  website?: string;
  twitter?: string;
  github?: string;
  linkedin?: string;
  bio: string;
  tags: string[];
  notifyEmail: boolean;
  notifySMS: boolean;
  hourlyRate: number;
  responseTimeMin: number;
  languages: string[];
};

type LogType = "profile_update" | "social_link" | "location" | "preference" | "security";
type AuditLog = {
  id: string;
  atISO: string;
  type: LogType;
  summary: string;
  details?: string;
  status: "success" | "warning";
};

const daysAgoISO = (d: number) => new Date(Date.now() - d * 864e5).toISOString();

const DUMMY_PROFILE: ProfileForm = {
  avatar: "",
  fullName: "Ada Lovelace",
  username: "ada-frontend",
  email: "ada@example.com",
  phone: "+1 202 555 0120",
  country: "USA",
  city: "San Francisco",
  timezone: "America/Los_Angeles",
  website: "https://adalabs.dev",
  twitter: "ada_frontend",
  github: "ada-labs",
  linkedin: "ada-labs",
  bio: "Frontend mentor focused on performance, DX, and production-readiness.",
  tags: ["frontend", "performance", "react", "design-systems"],
  notifyEmail: true,
  notifySMS: false,
  hourlyRate: 120,
  responseTimeMin: 45,
  languages: ["English", "French"],
};

const DUMMY_AUDIT: AuditLog[] = [
  { id: "a1", atISO: daysAgoISO(0.6), type: "profile_update", summary: "Edited bio & tags", details: "Added ‘design-systems’", status: "success" },
  { id: "a2", atISO: daysAgoISO(1.3), type: "location", summary: "Changed timezone", details: "UTC-8 → America/Los_Angeles", status: "success" },
  { id: "a3", atISO: daysAgoISO(3), type: "social_link", summary: "Linked GitHub", details: "github.com/ada-labs", status: "success" },
  { id: "a4", atISO: daysAgoISO(12), type: "preference", summary: "Notifications toggled", details: "Email ON, SMS OFF", status: "success" },
  { id: "a5", atISO: daysAgoISO(40), type: "security", summary: "New device login", details: "Chrome · MacOS", status: "warning" },
];

/* ---------------------------
   Helpers
---------------------------- */
const rel = (iso: string) => {
  const diff = Date.now() - +new Date(iso);
  const m = Math.round(diff / 60000);
  if (m < 1) return "now";
  if (m < 60) return `${m}m`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h`;
  const d = Math.round(h / 24);
  return `${d}d`;
};
const fmtDay = (iso: string) => new Date(iso).toLocaleString([], { month: "short", day: "numeric", year: "numeric" });
const fmtTime = (iso: string) => new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

/* ---------------------------
   Component
---------------------------- */
const perPage = 6;

export default function Profile() {
  const [form, setForm] = React.useState<ProfileForm>(
    () => JSON.parse(localStorage.getItem("mentora.account.profile") || "null") ?? DUMMY_PROFILE
  );
  const [audit, setAudit] = React.useState<AuditLog[]>(
    () => JSON.parse(localStorage.getItem("mentora.account.audit") || "null") ?? DUMMY_AUDIT
  );
  React.useEffect(() => {
    localStorage.setItem("mentora.account.profile", JSON.stringify(form));
  }, [form]);
  React.useEffect(() => {
    localStorage.setItem("mentora.account.audit", JSON.stringify(audit));
  }, [audit]);

  const [saving, setSaving] = React.useState(false);
  const [menuFor, setMenuFor] = React.useState<string | null>(null);
  const menuRef = React.useRef<HTMLDivElement | null>(null);
  React.useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && e.target instanceof Node && !menuRef.current.contains(e.target)) setMenuFor(null);
    };
    const onEsc = (e: KeyboardEvent) => e.key === "Escape" && setMenuFor(null);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onEsc);
    return () => { document.removeEventListener("mousedown", onClick); document.removeEventListener("keydown", onEsc); };
  }, []);

  // Audit filters/search/paging
  const [query, setQuery] = React.useState("");
  const [typeFilter, setTypeFilter] = React.useState<"all" | LogType>("all");
  const [statusFilter, setStatusFilter] = React.useState<"all" | "success" | "warning">("all");
  const [page, setPage] = React.useState(1);

  const filtered = React.useMemo(() => {
    let out = audit.filter((a) => {
      if (typeFilter !== "all" && a.type !== typeFilter) return false;
      if (statusFilter !== "all" && a.status !== statusFilter) return false;
      if (query.trim()) {
        const q = query.toLowerCase();
        const hay = `${a.summary} ${a.details ?? ""} ${a.type}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
    out.sort((a, b) => +new Date(b.atISO) - +new Date(a.atISO));
    return out;
  }, [audit, query, typeFilter, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paged = React.useMemo(() => filtered.slice((page - 1) * perPage, page * perPage), [filtered, page]);
  React.useEffect(() => setPage(1), [query, typeFilter, statusFilter]);

  const onAvatarChange = async (file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setForm((f) => ({ ...f, avatar: String(reader.result) }));
    reader.readAsDataURL(file);
  };

  const saveProfile = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setAudit((p) => [
        { id: "a" + Math.random().toString(36).slice(2), atISO: new Date().toISOString(), type: "profile_update", summary: "Profile saved", details: "Updated fields & preferences", status: "success" },
        ...p,
      ]);
      alert("Profile saved!");
    }, 650);
  };

  const completeness = Math.min(
    100,
    [
      form.fullName, form.username, form.email, form.timezone, form.bio,
      form.tags.length > 0 ? "ok" : "", form.avatar ? "ok" : "",
    ].filter(Boolean).length / 7 * 100
  );

  // Stats
  const sessions = 182;
  const rating = 4.9;
  const responseTime = form.responseTimeMin;

  return (
    <MentorAppLayout>
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-[#0F132E] dark:text-[#E9ECFF]">Profile</h1>
            <p className="text-sm text-[#5E66A6] dark:text-[#A7B0FF]/85">Your public presence, preferences, and identity.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className={pill}><Users size={14}/> {sessions} sessions</span>
            <span className={pill}><Star size={14}/> {rating.toFixed(1)} rating</span>
            <span className={pill}><Clock size={14}/> ~{responseTime}m response</span>
          </div>
        </div>

        {/* Main grid */}
        <div className="mt-4 grid lg:grid-cols-12 gap-4">
          {/* Left: profile editor */}
          <div className="lg:col-span-8 space-y-4">
            {/* Identity card */}
            <div className={`${card} p-4`}>
              <div className="flex flex-wrap items-center gap-4">
                <div className="relative">
                  <div className="h-20 w-20 rounded-2xl overflow-hidden border border-[#E7E9FF] dark:border-[#2B2F55] bg-[#EEF2FF] dark:bg-white/[0.08] grid place-items-center">
                    {form.avatar ? (
                      <img src={form.avatar} alt="avatar" className="h-full w-full object-cover" />
                    ) : (
                      <User size={28} className="text-[#5E66A6]" />
                    )}
                  </div>
                  <label className={`${btnBase} ${btnGhost} absolute -bottom-2 -right-2 px-2 py-1 cursor-pointer`}>
                    <Camera size={14} /> Change
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => onAvatarChange(e.target.files?.[0])} />
                  </label>
                </div>
                <div className="flex-1 min-w-[220px] grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-semibold">Full name</label>
                    <input className="mt-1 w-full h-11 px-3 rounded-xl border border-[#E7E9FF] dark:border-[#2B2F55] bg-white/70 dark:bg-white/[0.05] outline-none"
                      value={form.fullName} onChange={(e)=>setForm({...form, fullName: e.target.value})}/>
                  </div>
                  <div>
                    <label className="text-sm font-semibold">Username</label>
                    <div className="mt-1 flex items-center gap-2 h-11 px-3 rounded-xl border border-[#E7E9FF] dark:border-[#2B2F55] bg-white/70 dark:bg-white/[0.05]">
                      <AtSign size={14} className="text-[#7077B3]" />
                      <input className="bg-transparent outline-none text-sm w-full"
                        value={form.username} onChange={(e)=>setForm({...form, username: e.target.value.toLowerCase()})}/>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-semibold">Email</label>
                    <div className="mt-1 flex items-center gap-2 h-11 px-3 rounded-xl border border-[#E7E9FF] dark:border-[#2B2F55] bg-white/70 dark:bg-white/[0.05]">
                      <Mail size={14} className="text-[#7077B3]" />
                      <input className="bg-transparent outline-none text-sm w-full" value={form.email} onChange={(e)=>setForm({...form, email: e.target.value})}/>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-semibold">Phone</label>
                    <div className="mt-1 flex items-center gap-2 h-11 px-3 rounded-xl border border-[#E7E9FF] dark:border-[#2B2F55] bg-white/70 dark:bg-white/[0.05]">
                      <Phone size={14} className="text-[#7077B3]" />
                      <input className="bg-transparent outline-none text-sm w-full" value={form.phone ?? ""} onChange={(e)=>setForm({...form, phone: e.target.value})}/>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-semibold">Country</label>
                    <div className="mt-1 flex items-center gap-2 h-11 px-3 rounded-xl border border-[#E7E9FF] dark:border-[#2B2F55] bg-white/70 dark:bg-white/[0.05]">
                      <Globe size={14} className="text-[#7077B3]" />
                      <input className="bg-transparent outline-none text-sm w-full" value={form.country ?? ""} onChange={(e)=>setForm({...form, country: e.target.value})}/>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-semibold">City</label>
                    <div className="mt-1 flex items-center gap-2 h-11 px-3 rounded-xl border border-[#E7E9FF] dark:border-[#2B2F55] bg-white/70 dark:bg-white/[0.05]">
                      <MapPin size={14} className="text-[#7077B3]" />
                      <input className="bg-transparent outline-none text-sm w-full" value={form.city ?? ""} onChange={(e)=>setForm({...form, city: e.target.value})}/>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 grid sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-sm font-semibold">Timezone</label>
                  <select className="mt-1 w-full h-11 px-3 rounded-xl border border-[#E7E9FF] dark:border-[#2B2F55] bg-transparent"
                    value={form.timezone} onChange={(e)=>setForm({...form, timezone: e.target.value})}>
                    {["America/Los_Angeles","America/New_York","Europe/London","Africa/Lagos","Asia/Kolkata","Asia/Dubai"].map(tz=>(
                      <option key={tz} value={tz}>{tz}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-semibold">Languages</label>
                  <input className="mt-1 w-full h-11 px-3 rounded-xl border border-[#E7E9FF] dark:border-[#2B2F55]" placeholder="Comma-separated"
                    value={form.languages.join(", ")} onChange={(e)=>setForm({...form, languages: e.target.value.split(",").map(s=>s.trim()).filter(Boolean)})}/>
                </div>
                <div>
                  <label className="text-sm font-semibold">Hourly rate (USD)</label>
                  <input type="number" min={0} className="mt-1 w-full h-11 px-3 rounded-xl border border-[#E7E9FF] dark:border-[#2B2F55]"
                    value={form.hourlyRate} onChange={(e)=>setForm({...form, hourlyRate: Number(e.target.value)})}/>
                </div>
              </div>

              <div className="mt-4">
                <label className="text-sm font-semibold">Bio</label>
                <textarea className="mt-1 w-full min-h-[120px] px-3 py-2 rounded-xl border border-[#E7E9FF] dark:border-[#2B2F55]"
                  value={form.bio} onChange={(e)=>setForm({...form, bio: e.target.value})} />
              </div>

              <div className="mt-4">
                <label className="text-sm font-semibold">Expertise tags</label>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  {form.tags.map((t, i) => (
                    <span key={i} className={`${pill} !py-0.5`}><Tag size={12}/> {t}</span>
                  ))}
                </div>
                <input
                  className="mt-2 w-full h-11 px-3 rounded-xl border border-[#E7E9FF] dark:border-[#2B2F55]"
                  placeholder="Add tags (comma-separated)"
                  onBlur={(e) => {
                    const next = e.target.value
                      .split(",")
                      .map((s) => s.trim())
                      .filter(Boolean);
                    if (next.length) setForm((f) => ({ ...f, tags: Array.from(new Set([...f.tags, ...next])) }));
                    e.currentTarget.value = "";
                  }}
                />
              </div>

              <div className="mt-4 grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-semibold">Website</label>
                  <div className="mt-1 flex items-center gap-2 h-11 px-3 rounded-xl border border-[#E7E9FF] dark:border-[#2B2F55]">
                    <LinkIcon size={14} className="text-[#7077B3]" />
                    <input className="bg-transparent outline-none text-sm w-full" value={form.website ?? ""} onChange={(e)=>setForm({...form, website: e.target.value})}/>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-semibold">Twitter</label>
                  <div className="mt-1 flex items-center gap-2 h-11 px-3 rounded-xl border border-[#E7E9FF] dark:border-[#2B2F55]">
                    <AtSign size={14} className="text-[#7077B3]" />
                    <input className="bg-transparent outline-none text-sm w-full" value={form.twitter ?? ""} onChange={(e)=>setForm({...form, twitter: e.target.value})}/>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-semibold">GitHub</label>
                  <div className="mt-1 flex items-center gap-2 h-11 px-3 rounded-xl border border-[#E7E9FF] dark:border-[#2B2F55]">
                    <Globe size={14} className="text-[#7077B3]" />
                    <input className="bg-transparent outline-none text-sm w-full" value={form.github ?? ""} onChange={(e)=>setForm({...form, github: e.target.value})}/>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-semibold">LinkedIn</label>
                  <div className="mt-1 flex items-center gap-2 h-11 px-3 rounded-xl border border-[#E7E9FF] dark:border-[#2B2F55]">
                    <Globe size={14} className="text-[#7077B3]" />
                    <input className="bg-transparent outline-none text-sm w-full" value={form.linkedin ?? ""} onChange={(e)=>setForm({...form, linkedin: e.target.value})}/>
                  </div>
                </div>
              </div>

              <div className="mt-4 grid sm:grid-cols-2 gap-3">
                <label className="inline-flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={form.notifyEmail} onChange={(e)=>setForm({...form, notifyEmail: e.target.checked})}/>
                  Email notifications
                </label>
                <label className="inline-flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={form.notifySMS} onChange={(e)=>setForm({...form, notifySMS: e.target.checked})}/>
                  SMS notifications
                </label>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <button className={`${btnBase} ${btnSolid}`} onClick={saveProfile} disabled={saving}>
                  {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} Save changes
                </button>
                <span className={pill}>Profile completeness: {Math.round(completeness)}%</span>
              </div>
            </div>

            {/* Audit logs (table on md+, cards on mobile) */}
            <div className={`${card} p-4`}>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="text-sm font-semibold">Activity & audit</div>
                <div className="flex flex-wrap gap-2">
                  <div className={`flex items-center gap-2 ${card} h-10 px-3 min-w-[220px]`}>
                    <Search size={16} />
                    <input className="bg-transparent outline-none text-sm w-full" placeholder="Search activity…" value={query} onChange={(e)=>setQuery(e.target.value)} />
                  </div>
                  <div className={`flex items-center gap-2 ${card} h-10 px-3`}>
                    <Filter size={16}/>
                    <select className="bg-transparent text-sm outline-none" value={typeFilter} onChange={(e)=>setTypeFilter(e.target.value as any)}>
                      <option value="all">Type: All</option>
                      <option value="profile_update">Profile</option>
                      <option value="social_link">Social</option>
                      <option value="location">Location</option>
                      <option value="preference">Preference</option>
                      <option value="security">Security</option>
                    </select>
                    <span className="h-4 w-px bg-[#E7E9FF] dark:bg-[#2B2F55]"/>
                    <select className="bg-transparent text-sm outline-none" value={statusFilter} onChange={(e)=>setStatusFilter(e.target.value as any)}>
                      <option value="all">Status: All</option>
                      <option value="success">Success</option>
                      <option value="warning">Warning</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Cards for mobile */}
              <div className="md:hidden mt-4 grid grid-cols-1 gap-3">
                {paged.map((a) => (
                  <div key={a.id} className="p-3 rounded-2xl border border-[#E7E9FF] dark:border-[#2B2F55]">
                    <div className="flex items-center justify-between gap-2">
                      <div className="font-semibold text-sm">{a.summary}</div>
                      <span className={`inline-flex items-center gap-1 text-[11px] ${a.status==="success"?"text-emerald-600":"text-amber-600"}`}>
                        {a.status==="success"?<CheckCircle2 size={14}/>:<XCircle size={14}/>} {a.status}
                      </span>
                    </div>
                    <div className="mt-1 text-[12px] text-[#6B72B3] dark:text-[#A7B0FF]/80">{a.details}</div>
                    <div className="mt-2 text-[11px] text-[#6B72B3] dark:text-[#A7B0FF]/80">{fmtDay(a.atISO)} · {fmtTime(a.atISO)} ({rel(a.atISO)})</div>
                  </div>
                ))}
              </div>

              {/* Table for md+ */}
              <div className="hidden md:block overflow-x-auto mt-3">
                <table className="min-w-full">
                  <thead>
                    <tr className="text-left text-[12px] text-[#6B72B3] dark:text-[#A7B0FF]/80">
                      <th className="px-3 py-2">Summary</th>
                      <th className="px-3 py-2">Details</th>
                      <th className="px-3 py-2">Type</th>
                      <th className="px-3 py-2">When</th>
                      <th className="px-3 py-2 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E7E9FF] dark:divide-[#2B2F55]">
                    {paged.map((a) => (
                      <tr key={a.id} className="relative">
                        <td className="px-3 py-2 text-sm font-semibold">{a.summary}</td>
                        <td className="px-3 py-2 text-sm">{a.details ?? "-"}</td>
                        <td className="px-3 py-2 text-sm">{a.type}</td>
                        <td className="px-3 py-2 text-sm">{fmtDay(a.atISO)} · {fmtTime(a.atISO)} ({rel(a.atISO)})</td>
                        <td className="px-3 py-2 text-right">
                          <div className="relative" ref={menuRef}>
                            <button className={`${btnBase} ${btnGhost} px-2 py-1`} aria-haspopup="menu" aria-expanded={menuFor===a.id} onClick={()=>setMenuFor(menuFor===a.id?null:a.id)}>
                              <MoreVertical size={16}/>
                            </button>
                            {menuFor===a.id && (
                              <div role="menu" className={`${card} absolute right-0 top-10 w-44 p-1 z-40`}>
                                <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/70 dark:hover:bg-white/[0.06] inline-flex items-center gap-2"><Edit3 size={14}/> Note</button>
                                <button onClick={()=>setAudit(p=>p.filter(x=>x.id!==a.id))} className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/70 dark:hover:bg-white/[0.06] inline-flex items-center gap-2 text-rose-600"><Trash2 size={14}/> Delete</button>
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
                <div className="text-[12px] text-[#6B72B3] dark:text-[#A7B0FF]/80">Page {page} / {totalPages} · {filtered.length} events</div>
                <div className="flex items-center gap-2">
                  <button className={`${btnBase} ${btnGhost} px-2 py-1`} disabled={page<=1} onClick={()=>setPage(p=>Math.max(1,p-1))}><ChevronLeft size={16}/></button>
                  <button className={`${btnBase} ${btnGhost} px-2 py-1`} disabled={page>=totalPages} onClick={()=>setPage(p=>Math.min(totalPages,p+1))}><ChevronRight size={16}/></button>
                </div>
              </div>
            </div>
          </div>

          {/* Right: meta & connected */}
          <div className="lg:col-span-4 space-y-4">
            <div className={`${card} p-4`}>
              <div className="text-sm font-semibold">Profile completeness</div>
              <div className="mt-3 h-2 rounded-full bg-[#E8EAFF] dark:bg-[#2B2F55] overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-[#4F46E5] via-[#6366F1] to-[#8B5CF6]"
                  style={{ width: `${Math.round(completeness)}%` }} />
              </div>
              <div className="mt-2 text-[12px] text-[#6B72B3] dark:text-[#A7B0FF]/80">
                Tip: Add an avatar and more tags to reach 100%.
              </div>
            </div>

            <div className={`${card} p-4`}>
              <div className="text-sm font-semibold">Connected accounts</div>
              <div className="mt-3 grid gap-2">
                {[
                  { name: "Google Calendar", connected: true },
                  { name: "Stripe", connected: true },
                  { name: "Outlook Calendar", connected: false },
                ].map((c) => (
                  <div key={c.name} className="flex items-center justify-between gap-2">
                    <div className="text-sm">{c.name}</div>
                    <span className={`${pill} ${c.connected ? "text-emerald-600" : ""}`}>
                      {c.connected ? <CheckCircle2 size={14}/> : <XCircle size={14}/> } {c.connected ? "Connected" : "Not connected"}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className={`${card} p-4`}>
              <div className="text-sm font-semibold">Mentions</div>
              <div className="mt-3 text-[13px] text-[#5E66A6] dark:text-[#A7B0FF]/80">
                Your profile link: <span className="underline">mentora.app/{form.username || "username"}</span>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                <span className={pill}><MessageSquare size={14}/> Visible in search</span>
                <span className={pill}><Star size={14}/> Top-rated</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MentorAppLayout>
  );
}
