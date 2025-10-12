import React from "react";
import MentorAppLayout from "./MentorAppLayout";
import {
  ShieldCheck, FileText, Image as ImageIcon, Upload, MapPin, Building2, CreditCard, Clock,
  MoreVertical, Trash2, CheckCircle2, XCircle, ChevronLeft, ChevronRight, Search, Filter, Eye
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

/* Types */
type KycStatus = "not_started" | "in_review" | "approved" | "rejected";
type DocStatus = "uploaded" | "verified" | "rejected";
type DocType = "identity" | "address" | "bank";

/* Data */
type KycProfile = {
  status: KycStatus;
  submittedISO?: string;
  reason?: string;
  firstName: string;
  lastName: string;
  dob: string; // YYYY-MM-DD
  idType: "Passport" | "Driver License" | "National ID";
  idNumber: string;
  idCountry: string;
  addrLine1: string;
  addrLine2?: string;
  city: string;
  state: string;
  postal: string;
  country: string;
  bankName: string;
  accountName: string;
  accountNumber: string;
  routing?: string; // or IFSC
};

type KycDoc = {
  id: string;
  type: DocType;
  name: string;
  sizeKB: number;
  url: string; // object URL
  uploadedISO: string;
  status: DocStatus;
  note?: string;
};

const daysAgoISO = (d: number) => new Date(Date.now() - d * 864e5).toISOString();

const DUMMY_KYC: KycProfile = {
  status: "not_started",
  firstName: "Ada",
  lastName: "Lovelace",
  dob: "1992-12-10",
  idType: "Passport",
  idNumber: "",
  idCountry: "USA",
  addrLine1: "123 Market St",
  city: "San Francisco",
  state: "CA",
  postal: "94103",
  country: "USA",
  bankName: "First Indigo Bank",
  accountName: "Ada Lovelace",
  accountNumber: "**** 5120",
  routing: "11000000",
};

const DUMMY_DOCS: KycDoc[] = [
  { id: "d1", type: "identity", name: "passport.jpg", sizeKB: 824, url: "", uploadedISO: daysAgoISO(3), status: "uploaded" },
  { id: "d2", type: "address", name: "utility-bill.pdf", sizeKB: 212, url: "", uploadedISO: daysAgoISO(2), status: "uploaded" },
];

/* Helpers */
const fmtDay = (iso: string) => new Date(iso).toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" });
const fmtTime = (iso: string) => new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

const perPage = 8;

export default function KYC() {
  const [kyc, setKyc] = React.useState<KycProfile>(
    () => JSON.parse(localStorage.getItem("mentora.account.kyc") || "null") ?? DUMMY_KYC
  );
  const [docs, setDocs] = React.useState<KycDoc[]>(
    () => JSON.parse(localStorage.getItem("mentora.account.kycDocs") || "null") ?? DUMMY_DOCS
  );
  React.useEffect(()=>localStorage.setItem("mentora.account.kyc", JSON.stringify(kyc)),[kyc]);
  React.useEffect(()=>localStorage.setItem("mentora.account.kycDocs", JSON.stringify(docs)),[docs]);

  const [saving, setSaving] = React.useState(false);

  // Documents filters/search/paging
  const [query, setQuery] = React.useState("");
  const [typeFilter, setTypeFilter] = React.useState<"all" | DocType>("all");
  const [statusFilter, setStatusFilter] = React.useState<"all" | DocStatus>("all");
  const [page, setPage] = React.useState(1);

  const filtered = React.useMemo(() => {
    let out = docs.filter((d) => {
      if (typeFilter !== "all" && d.type !== typeFilter) return false;
      if (statusFilter !== "all" && d.status !== statusFilter) return false;
      if (query.trim()) {
        const q = query.toLowerCase();
        if (!`${d.name} ${d.type}`.toLowerCase().includes(q)) return false;
      }
      return true;
    });
    out.sort((a,b)=>+new Date(b.uploadedISO)-+new Date(a.uploadedISO));
    return out;
  }, [docs, query, typeFilter, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paged = React.useMemo(() => filtered.slice((page - 1) * perPage, page * perPage), [filtered, page]);
  React.useEffect(() => setPage(1), [query, typeFilter, statusFilter]);

  // Row dropdown
  const [menuFor, setMenuFor] = React.useState<string | null>(null);
  const menuRef = React.useRef<HTMLDivElement | null>(null);
  React.useEffect(() => {
    const onClick = (e: MouseEvent) => { if (menuRef.current && e.target instanceof Node && !menuRef.current.contains(e.target)) setMenuFor(null); };
    const onEsc = (e: KeyboardEvent) => e.key === "Escape" && setMenuFor(null);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onEsc);
    return () => { document.removeEventListener("mousedown", onClick); document.removeEventListener("keydown", onEsc); };
  }, []);

  const uploadDoc = (type: DocType, file?: File) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    const row: KycDoc = {
      id: "d" + Math.random().toString(36).slice(2,7),
      type,
      name: file.name,
      sizeKB: Math.round(file.size / 1024),
      url,
      uploadedISO: new Date().toISOString(),
      status: "uploaded",
    };
    setDocs((p)=>[row, ...p]);
  };

  const markVerified = (id: string) => setDocs((p)=>p.map(d=>d.id===id?{...d,status:"verified"}:d));
  const markRejected = (id: string) => setDocs((p)=>p.map(d=>d.id===id?{...d,status:"rejected", note:"Blurry image"}:d));
  const deleteDoc = (id: string) => setDocs((p)=>p.filter(d=>d.id!==id));

  const submitForReview = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setKyc((k)=>({ ...k, status: "in_review", submittedISO: new Date().toISOString(), reason: undefined }));
      alert("KYC submitted for review.");
    }, 700);
  };

  const approveDemo = () => setKyc((k)=>({ ...k, status: "approved", reason: undefined }));
  const rejectDemo = () => setKyc((k)=>({ ...k, status: "rejected", reason: "Document mismatch — re-upload identity" }));

  return (
    <MentorAppLayout>
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-[#0F132E] dark:text-[#E9ECFF]">KYC / Verification</h1>
            <p className="text-sm text-[#5E66A6] dark:text-[#A7B0FF]/85">Verify identity & payouts to unlock withdrawals.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className={`${pill} ${kyc.status==="approved"?"text-emerald-600":kyc.status==="rejected"?"text-amber-600":""}`}>
              <ShieldCheck size={14}/> {kyc.status.replace("_"," ")}
            </span>
            {kyc.submittedISO && <span className={pill}><Clock size={14}/> submitted {fmtDay(kyc.submittedISO)}</span>}
          </div>
        </div>

        {/* Status rail */}
        <div className="mt-4 grid lg:grid-cols-12 gap-4">
          {/* Left: form */}
          <div className="lg:col-span-7 space-y-4">
            {/* Identity section */}
            <div className={`${card} p-4`}>
              <div className="text-sm font-semibold flex items-center gap-2"><FileText size={16}/> Identity</div>
              <div className="mt-3 grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-semibold">First name</label>
                  <input className="mt-1 w-full h-11 px-3 rounded-xl border border-[#E7E9FF] dark:border-[#2B2F55]" value={kyc.firstName} onChange={(e)=>setKyc({...kyc, firstName: e.target.value})}/>
                </div>
                <div>
                  <label className="text-sm font-semibold">Last name</label>
                  <input className="mt-1 w-full h-11 px-3 rounded-xl border" value={kyc.lastName} onChange={(e)=>setKyc({...kyc, lastName: e.target.value})}/>
                </div>
                <div>
                  <label className="text-sm font-semibold">Date of birth</label>
                  <input type="date" className="mt-1 w-full h-11 px-3 rounded-xl border" value={kyc.dob} onChange={(e)=>setKyc({...kyc, dob: e.target.value})}/>
                </div>
                <div>
                  <label className="text-sm font-semibold">ID type</label>
                  <select className="mt-1 w-full h-11 px-3 rounded-xl border bg-transparent" value={kyc.idType} onChange={(e)=>setKyc({...kyc, idType: e.target.value as any})}>
                    <option>Passport</option>
                    <option>Driver License</option>
                    <option>National ID</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-semibold">ID number</label>
                  <input className="mt-1 w-full h-11 px-3 rounded-xl border" value={kyc.idNumber} onChange={(e)=>setKyc({...kyc, idNumber: e.target.value})}/>
                </div>
                <div>
                  <label className="text-sm font-semibold">Issuing country</label>
                  <input className="mt-1 w-full h-11 px-3 rounded-xl border" value={kyc.idCountry} onChange={(e)=>setKyc({...kyc, idCountry: e.target.value})}/>
                </div>
              </div>
            </div>

            {/* Address */}
            <div className={`${card} p-4`}>
              <div className="text-sm font-semibold flex items-center gap-2"><MapPin size={16}/> Address</div>
              <div className="mt-3 grid sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="text-sm font-semibold">Address line 1</label>
                  <input className="mt-1 w-full h-11 px-3 rounded-xl border" value={kyc.addrLine1} onChange={(e)=>setKyc({...kyc, addrLine1: e.target.value})}/>
                </div>
                <div>
                  <label className="text-sm font-semibold">Address line 2</label>
                  <input className="mt-1 w-full h-11 px-3 rounded-xl border" value={kyc.addrLine2 ?? ""} onChange={(e)=>setKyc({...kyc, addrLine2: e.target.value})}/>
                </div>
                <div>
                  <label className="text-sm font-semibold">City</label>
                  <input className="mt-1 w-full h-11 px-3 rounded-xl border" value={kyc.city} onChange={(e)=>setKyc({...kyc, city: e.target.value})}/>
                </div>
                <div>
                  <label className="text-sm font-semibold">State/Region</label>
                  <input className="mt-1 w-full h-11 px-3 rounded-xl border" value={kyc.state} onChange={(e)=>setKyc({...kyc, state: e.target.value})}/>
                </div>
                <div>
                  <label className="text-sm font-semibold">Postal</label>
                  <input className="mt-1 w-full h-11 px-3 rounded-xl border" value={kyc.postal} onChange={(e)=>setKyc({...kyc, postal: e.target.value})}/>
                </div>
                <div>
                  <label className="text-sm font-semibold">Country</label>
                  <input className="mt-1 w-full h-11 px-3 rounded-xl border" value={kyc.country} onChange={(e)=>setKyc({...kyc, country: e.target.value})}/>
                </div>
              </div>
            </div>

            {/* Payout / Bank */}
            <div className={`${card} p-4`}>
              <div className="text-sm font-semibold flex items-center gap-2"><Building2 size={16}/> Payout account</div>
              <div className="mt-3 grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-semibold">Bank name</label>
                  <input className="mt-1 w-full h-11 px-3 rounded-xl border" value={kyc.bankName} onChange={(e)=>setKyc({...kyc, bankName: e.target.value})}/>
                </div>
                <div>
                  <label className="text-sm font-semibold">Account name</label>
                  <input className="mt-1 w-full h-11 px-3 rounded-xl border" value={kyc.accountName} onChange={(e)=>setKyc({...kyc, accountName: e.target.value})}/>
                </div>
                <div>
                  <label className="text-sm font-semibold">Account number</label>
                  <input className="mt-1 w-full h-11 px-3 rounded-xl border" value={kyc.accountNumber} onChange={(e)=>setKyc({...kyc, accountNumber: e.target.value})}/>
                </div>
                <div>
                  <label className="text-sm font-semibold">Routing / IFSC</label>
                  <input className="mt-1 w-full h-11 px-3 rounded-xl border" value={kyc.routing ?? ""} onChange={(e)=>setKyc({...kyc, routing: e.target.value})}/>
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className={`${card} p-4`}>
              <div className="flex flex-wrap items-center gap-2">
                <button className={`${btnBase} ${btnSolid}`} onClick={submitForReview} disabled={saving || kyc.status==="in_review" || kyc.status==="approved"}>
                  {saving ? <Clock size={16} className="animate-spin"/> : <Upload size={16}/>} Submit for review
                </button>
                {/* Demo admin controls */}
                <button className={`${btnBase} ${btnGhost}`} onClick={approveDemo} disabled={kyc.status==="approved"}><CheckCircle2 size={16}/> Mark approved (demo)</button>
                <button className={`${btnBase} ${btnGhost}`} onClick={rejectDemo} disabled={kyc.status==="rejected"}><XCircle size={16}/> Mark rejected (demo)</button>
              </div>
              {kyc.reason && <div className="mt-2 text-sm text-amber-600">Reason: {kyc.reason}</div>}
            </div>
          </div>

          {/* Right: documents & status */}
          <div className="lg:col-span-5 space-y-4">
            <div className={`${card} p-4`}>
              <div className="text-sm font-semibold flex items-center gap-2"><ImageIcon size={16}/> Documents</div>

              {/* Uploaders */}
              <div className="mt-3 grid sm:grid-cols-3 gap-2">
                {(["identity","address","bank"] as DocType[]).map((t)=>(
                  <label key={t} className={`${btnBase} ${btnGhost} justify-center cursor-pointer h-11`}>
                    <Upload size={16}/> Upload {t}
                    <input type="file" className="hidden" accept="image/*,.pdf" onChange={(e)=>uploadDoc(t, e.target.files?.[0])}/>
                  </label>
                ))}
              </div>

              {/* Filters & search */}
              <div className="mt-3 flex flex-wrap gap-2">
                <div className={`flex items-center gap-2 ${card} h-10 px-3 min-w-[220px]`}>
                  <Search size={16}/>
                  <input className="bg-transparent outline-none text-sm w-full" placeholder="Search filename…" value={query} onChange={(e)=>setQuery(e.target.value)}/>
                </div>
                <div className={`flex items-center gap-2 ${card} h-10 px-3`}>
                  <Filter size={16}/>
                  <select className="bg-transparent text-sm outline-none" value={typeFilter} onChange={(e)=>setTypeFilter(e.target.value as any)}>
                    <option value="all">Type: All</option>
                    <option value="identity">Identity</option>
                    <option value="address">Address</option>
                    <option value="bank">Bank</option>
                  </select>
                  <span className="h-4 w-px bg-[#E7E9FF] dark:bg-[#2B2F55]"/>
                  <select className="bg-transparent text-sm outline-none" value={statusFilter} onChange={(e)=>setStatusFilter(e.target.value as any)}>
                    <option value="all">Status: All</option>
                    <option value="uploaded">Uploaded</option>
                    <option value="verified">Verified</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>

              {/* Cards (mobile) */}
              <div className="md:hidden mt-3 grid grid-cols-1 gap-3">
                {paged.map((d) => (
                  <div key={d.id} className="p-3 rounded-2xl border border-[#E7E9FF] dark:border-[#2B2F55]">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="font-semibold text-sm">{d.name}</div>
                        <div className="mt-1 text-[12px] text-[#6B72B3] dark:text-[#A7B0FF]/80">
                          {d.type} · {d.sizeKB} KB · {fmtDay(d.uploadedISO)} {fmtTime(d.uploadedISO)}
                        </div>
                        <div className="mt-2 flex flex-wrap items-center gap-1">
                          <span className={`${pill} ${d.status==="verified"?"text-emerald-600":d.status==="rejected"?"text-amber-600":""}`}>{d.status}</span>
                          {d.note && <span className={`${pill} text-amber-600`}>{d.note}</span>}
                        </div>
                      </div>
                      <RowMenu
                        open={menuFor===d.id}
                        onToggle={()=>setMenuFor(menuFor===d.id?null:d.id)}
                        menuRef={menuRef}
                        items={[
                          { label: "Preview", icon: <Eye size={14}/>, onClick:()=>{ d.url ? window.open(d.url, "_blank") : alert("No preview available"); } },
                          { label: "Mark verified", icon: <CheckCircle2 size={14}/>, onClick:()=>markVerified(d.id) },
                          { label: "Reject", icon: <XCircle size={14}/>, onClick:()=>markRejected(d.id) },
                          { label: "Delete", icon: <Trash2 size={14}/>, danger:true, onClick:()=>deleteDoc(d.id) },
                        ]}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Table (md+) */}
              <div className="hidden md:block overflow-x-auto mt-2">
                <table className="min-w-full">
                  <thead>
                    <tr className="text-left text-[12px] text-[#6B72B3] dark:text-[#A7B0FF]/80">
                      <th className="px-3 py-2">File</th>
                      <th className="px-3 py-2">Type</th>
                      <th className="px-3 py-2">Size</th>
                      <th className="px-3 py-2">Uploaded</th>
                      <th className="px-3 py-2">Status</th>
                      <th className="px-3 py-2 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E7E9FF] dark:divide-[#2B2F55]">
                    {paged.map((d)=>(
                      <tr key={d.id} className="relative">
                        <td className="px-3 py-2 text-sm font-semibold">{d.name}</td>
                        <td className="px-3 py-2 text-sm">{d.type}</td>
                        <td className="px-3 py-2 text-sm">{d.sizeKB} KB</td>
                        <td className="px-3 py-2 text-sm">{fmtDay(d.uploadedISO)} · {fmtTime(d.uploadedISO)}</td>
                        <td className="px-3 py-2 text-sm capitalize">
                          <span className={`${pill} ${d.status==="verified"?"text-emerald-600":d.status==="rejected"?"text-amber-600":""}`}>{d.status}</span>
                        </td>
                        <td className="px-3 py-2 text-right">
                          <RowMenu
                            open={menuFor===d.id}
                            onToggle={()=>setMenuFor(menuFor===d.id?null:d.id)}
                            menuRef={menuRef}
                            items={[
                              { label: "Preview", icon: <Eye size={14}/>, onClick:()=>{ d.url ? window.open(d.url, "_blank") : alert("No preview available"); } },
                              { label: "Mark verified", icon: <CheckCircle2 size={14}/>, onClick:()=>markVerified(d.id) },
                              { label: "Reject", icon: <XCircle size={14}/>, onClick:()=>markRejected(d.id) },
                              { label: "Delete", icon: <Trash2 size={14}/>, danger:true, onClick:()=>deleteDoc(d.id) },
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
                <div className="text-[12px] text-[#6B72B3] dark:text-[#A7B0FF]/80">Page {page} / {totalPages} · {filtered.length} docs</div>
                <div className="flex items-center gap-2">
                  <button className={`${btnBase} ${btnGhost} px-2 py-1`} disabled={page<=1} onClick={()=>setPage(p=>Math.max(1,p-1))}><ChevronLeft size={16}/></button>
                  <button className={`${btnBase} ${btnGhost} px-2 py-1`} disabled={page>=totalPages} onClick={()=>setPage(p=>Math.min(totalPages,p+1))}><ChevronRight size={16}/></button>
                </div>
              </div>
            </div>

            {/* Status helper */}
            <div className={`${card} p-4`}>
              <div className="text-sm font-semibold flex items-center gap-2"><ShieldCheck size={16}/> What we verify</div>
              <ul className="mt-2 text-sm list-disc pl-5 space-y-1 text-[#5E66A6] dark:text-[#A7B0FF]/85">
                <li>Identity matches payouts beneficiary</li>
                <li>Address proof within last 3 months</li>
                <li>Bank details for withdrawals</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </MentorAppLayout>
  );
}

/* Reusable absolute dropdown for rows */
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
