import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import MentorAppLayout from "../MentorAppLayout";
import { ArrowLeft, Users, Star, Globe, Clock, CalendarDays, MoreVertical, Pause, Play, Trash2, Tag, Edit3 } from "lucide-react";

const ringIndigo = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#6366F1]/40";
const card = "rounded-2xl border border-[#E7E9FF] dark:border-[#2B2F55] bg-white/80 dark:bg-white/[0.05] backdrop-blur";
const btnBase = "inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-semibold transition " + ringIndigo;
const btnSolid = "text-white bg-gradient-to-r from-[#4F46E5] via-[#6366F1] to-[#8B5CF6]";
const btnGhost = "border border-[#D9DBFF] dark:border-[#30345D] text-[#1B1F3A] dark:text-[#E6E9FF] bg-white/70 dark:bg-white/[0.05]";
const pill = "inline-flex items-center gap-2 rounded-full border border-[#E7E9FF] dark:border-[#2B2F55] bg-white/70 dark:bg-white/[0.05] px-3 py-1 text-[11px] font-semibold";

type Status = "active" | "paused" | "draft";
type Offer = {
  id: string; title: string; price: number; currency: "USD" | "NGN" | "INR" | "EUR";
  durationMin: number; category: string; tags: string[]; mode: "online" | "in-person";
  visibility: "public" | "unlisted"; status: Status;
  rating: number; bookings: number; updatedAt: string; createdAt: string; description: string;
};

const fmtDay = (iso: string) => new Date(iso).toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" });

function useOffers() {
  const [rows, setRows] = React.useState<Offer[]>(
    () => JSON.parse(localStorage.getItem("mentora.offers") || "null") ?? []
  );
  React.useEffect(() => localStorage.setItem("mentora.offers", JSON.stringify(rows)), [rows]);
  return [rows, setRows] as const;
}

function useOnClickOutside<T extends HTMLElement>(ref: React.RefObject<T>, cb: () => void) {
  React.useEffect(() => {
    const on = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) cb(); };
    const onEsc = (e: KeyboardEvent) => e.key === "Escape" && cb();
    document.addEventListener("mousedown", on); document.addEventListener("keydown", onEsc);
    return () => { document.removeEventListener("mousedown", on); document.removeEventListener("keydown", onEsc); };
  }, [cb, ref]);
}

export default function OfferDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [rows, setRows] = useOffers();
  const offer = React.useMemo(() => rows.find((r) => r.id === id), [rows, id]);

  const [menuOpen, setMenuOpen] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);
  useOnClickOutside(menuRef, () => setMenuOpen(false));

  if (!offer) {
    return (
      <MentorAppLayout>
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          <button className={`${btnBase} ${btnGhost}`} onClick={() => navigate(-1)}><ArrowLeft size={16} /> Back</button>
          <div className="mt-4">Offer not found.</div>
        </div>
      </MentorAppLayout>
    );
  }

  const toggleStatus = () =>
    setRows((p) => p.map((r) => r.id === offer.id ? { ...r, status: r.status === "active" ? "paused" : "active", updatedAt: new Date().toISOString() } : r));

  const remove = () => { if (confirm("Delete this offer?")) { setRows((p) => p.filter((r) => r.id !== offer.id)); navigate("/dashboard/offers"); } };

  return (
    <MentorAppLayout>
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button className={`${btnBase} ${btnGhost}`} onClick={() => navigate(-1)}><ArrowLeft size={16} /> Back</button>
            <h1 className="text-2xl font-bold text-[#0F132E] dark:text-[#E9ECFF]">{offer.title}</h1>
          </div>
          <div className="relative" ref={menuRef}>
            <button className={`${btnBase} ${btnGhost}`} onClick={() => setMenuOpen((v) => !v)}><MoreVertical size={16} /></button>
            {menuOpen && (
              <div className="absolute right-0 mt-2 z-40 w-48 rounded-xl border border-[#E7E9FF] dark:border-[#2B2F55] bg-white dark:bg-[#0B0F2A] shadow-lg p-1">
                <button className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-[#EEF2FF] dark:hover:bg-white/[0.06] inline-flex items-center gap-2" onClick={() => navigate(`/dashboard/offers/new?clone=${offer.id}`)}>
                  <Edit3 size={16} /> Duplicate
                </button>
                <button className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-[#EEF2FF] dark:hover:bg-white/[0.06] inline-flex items-center gap-2" onClick={toggleStatus}>
                  {offer.status === "active" ? <Pause size={16} /> : <Play size={16} />} {offer.status === "active" ? "Pause" : "Activate"}
                </button>
                <button className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-rose-50 dark:hover:bg-rose-900/20 text-rose-600 dark:text-rose-300 inline-flex items-center gap-2" onClick={remove}>
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Meta + stats */}
        <div className="mt-4 grid lg:grid-cols-3 gap-3">
          <div className={`${card} p-4 lg:col-span-2`}>
            <div className="flex flex-wrap items-center gap-2">
              <span className={`${pill}`}>{offer.category}</span>
              {offer.tags.map((t) => <span key={t} className={`${pill}`}><Tag size={12} /> {t}</span>)}
            </div>
            <p className="mt-3 text-sm text-[#101436] dark:text-[#EEF0FF]">{offer.description || "Short description of the offer and what mentees get."}</p>

            <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <div className={`${card} p-3`}>
                <div className="text-[12px] text-[#6B72B3] dark:text-[#A7B0FF]/80">Duration</div>
                <div className="text-lg font-semibold">{offer.durationMin} minutes</div>
              </div>
              <div className={`${card} p-3`}>
                <div className="text-[12px] text-[#6B72B3] dark:text-[#A7B0FF]/80">Price</div>
                <div className="text-lg font-semibold">{offer.currency} {offer.price.toFixed(2)}</div>
              </div>
              <div className={`${card} p-3`}>
                <div className="text-[12px] text-[#6B72B3] dark:text-[#A7B0FF]/80">Mode</div>
                <div className="text-lg font-semibold capitalize">{offer.mode}</div>
              </div>
              <div className={`${card} p-3`}>
                <div className="text-[12px] text-[#6B72B3] dark:text-[#A7B0FF]/80">Visibility</div>
                <div className="text-lg font-semibold capitalize">{offer.visibility}</div>
              </div>
              <div className={`${card} p-3`}>
                <div className="text-[12px] text-[#6B72B3] dark:text-[#A7B0FF]/80">Status</div>
                <div className="text-lg font-semibold capitalize">{offer.status}</div>
              </div>
              <div className={`${card} p-3`}>
                <div className="text-[12px] text-[#6B72B3] dark:text-[#A7B0FF]/80">Created</div>
                <div className="text-lg font-semibold">{fmtDay(offer.createdAt)}</div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className={`${card} p-4`}>
              <div className="text-sm font-semibold">Performance</div>
              <div className="mt-2 flex flex-wrap gap-3 text-sm">
                <span className="inline-flex items-center gap-1"><Users size={14} /> {offer.bookings} bookings</span>
                <span className="inline-flex items-center gap-1"><Star size={14} /> {offer.rating || "–"}</span>
                <span className="inline-flex items-center gap-1"><Clock size={14} /> Updated {fmtDay(offer.updatedAt)}</span>
                <span className="inline-flex items-center gap-1"><Globe size={14} /> {offer.visibility}</span>
              </div>
            </div>

            <div className={`${card} p-4`}>
              <div className="text-sm font-semibold">Upcoming windows</div>
              <div className="mt-2 space-y-2 text-sm">
                {["Tue 3:00 PM – 6:00 PM", "Thu 9:00 AM – 12:00 PM", "Sat 11:00 AM – 2:00 PM"].map((w, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-2"><CalendarDays size={14} /> {w}</span>
                    <span className="text-[11px] px-2 py-0.5 rounded-full border border-[#E7E9FF] dark:border-[#2B2F55]">3 slots</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Recent bookings (dummy) */}
        <div className="mt-4">
          <div className={`${card} p-4`}>
            <div className="text-sm font-semibold mb-2">Recent bookings</div>
            <div className="grid md:grid-cols-2 gap-3">
              {[
                { who: "Tunde", when: "Yesterday", note: "Perf audit focus" },
                { who: "Riya", when: "3 days ago", note: "Tracing deep dive" },
                { who: "Ada", when: "Last week", note: "Portfolio crit" },
                { who: "Mason", when: "2 weeks ago", note: "Growth funnel" },
              ].map((b, i) => (
                <div key={i} className="rounded-xl border border-[#E7E9FF] dark:border-[#2B2F55] p-3">
                  <div className="font-semibold text-sm">{b.who}</div>
                  <div className="text-[12px] text-[#6B72B3] dark:text-[#A7B0FF]/80">{b.when}</div>
                  <div className="mt-1 text-sm">{b.note}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </MentorAppLayout>
  );
}
