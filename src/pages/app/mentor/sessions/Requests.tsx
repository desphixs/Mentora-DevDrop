import React from "react";
import MentorAppLayout from "../MentorAppLayout";
import {
  Search,
  Filter,
  Users,
  User,
  Clock,
  Video,
  MapPin,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  XCircle,
} from "lucide-react";

const card =
  "rounded-2xl border border-[#E7E9FF] dark:border-[#2B2F55] bg-white/80 dark:bg-white/[0.05] backdrop-blur";
const btnBase =
  "inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#6366F1]/40";
const btnSolid =
  "text-white bg-gradient-to-r from-[#4F46E5] via-[#6366F1] to-[#8B5CF6]";
const btnGhost =
  "border border-[#D9DBFF] dark:border-[#30345D] text-[#1B1F3A] dark:text-[#E6E9FF] bg-white/70 dark:bg-white/[0.05]";

type Session = {
  id: string;
  title: string;
  mentee: string;
  type: "1:1" | "group";
  durationMin: number;
  provider: "Google Meet" | "Zoom";
  tz: string;
  startISO: string;
  price: number;
  currency: string;
};
const fmtDay = (iso: string) =>
  new Date(iso).toLocaleDateString([], {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
const fmtTime = (iso: string) =>
  new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

const seed: Session[] = (
  JSON.parse(localStorage.getItem("mentora.sessions") || "[]") as any[]
)
  .filter((s) => s.status === "requested")
  .map((s) => ({
    id: s.id,
    title: s.title,
    mentee: s.mentee,
    type: s.type,
    durationMin: s.durationMin,
    provider: s.provider,
    tz: s.tz,
    startISO: s.startISO,
    price: s.price,
    currency: s.currency,
  }));

export default function SessionsRequests() {
  const [items, setItems] = React.useState<Session[]>(seed);
  const [q, setQ] = React.useState("");
  const [type, setType] = React.useState<"all" | "1:1" | "group">("all");
  const [provider, setProvider] = React.useState<
    "all" | "Google Meet" | "Zoom"
  >("all");

  const filtered = items.filter((s) => {
    if (type !== "all" && s.type !== type) return false;
    if (provider !== "all" && s.provider !== provider) return false;
    if (q.trim()) {
      const hay = `${s.title} ${s.mentee} ${s.tz}`.toLowerCase();
      if (!hay.includes(q.toLowerCase())) return false;
    }
    return true;
  });

  const perPage = 6;
  const [page, setPage] = React.useState(1);
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paged = filtered.slice((page - 1) * perPage, page * perPage);
  React.useEffect(() => setPage(1), [q, type, provider]);

  // approve/decline (update global store if present)
  const act = (id: string, approve: boolean) => {
    const store = JSON.parse(
      localStorage.getItem("mentora.sessions") || "null"
    );
    if (store) {
      const next = store.map((s: any) =>
        s.id === id ? { ...s, status: approve ? "scheduled" : "cancelled" } : s
      );
      localStorage.setItem("mentora.sessions", JSON.stringify(next));
    }
    setItems((p) => p.filter((x) => x.id !== id));
  };

  return (
    <MentorAppLayout>
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-2xl font-bold text-[#0F132E] dark:text-[#E9ECFF]">
            Requests
          </h1>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <div
            className={`flex items-center gap-2 ${card} h-11 px-3.5 flex-1 min-w-[220px]`}
          >
            <Search size={16} className="text-[#5F679A] dark:text-[#A7B0FF]" />
            <input
              className="bg-transparent outline-none text-sm w-full"
              placeholder="Search title, mentee…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
          <div
            className={`flex items-center gap-2 ${card} h-11 px-3 flex-wrap`}
          >
            <Filter size={16} />
            <select
              className="bg-transparent text-sm outline-none"
              value={type}
              onChange={(e) => setType(e.target.value as any)}
            >
              <option value="all">Type: All</option>
              <option value="1:1">1:1</option>
              <option value="group">Group</option>
            </select>
            <span className="h-4 w-px bg-[#E7E9FF] dark:bg-[#2B2F55]" />
            <select
              className="bg-transparent text-sm outline-none"
              value={provider}
              onChange={(e) => setProvider(e.target.value as any)}
            >
              <option value="all">Provider: Any</option>
              <option value="Google Meet">Google Meet</option>
              <option value="Zoom">Zoom</option>
            </select>
          </div>
        </div>

        <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {paged.map((s) => (
            <div key={s.id} className={`${card} p-3`}>
              <div className="text-sm font-semibold">{s.title}</div>
              <div className="mt-1 text-[12px] text-[#5E66A6] dark:text-[#A7B0FF]/80">
                from {s.mentee}
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
                <span className="inline-flex items-center gap-2">
                  <Clock size={14} /> {fmtDay(s.startISO)} ·{" "}
                  {fmtTime(s.startISO)}
                </span>
                <span className="inline-flex items-center gap-2">
                  <Video size={14} /> {s.provider}
                </span>
                <span className="inline-flex items-center gap-2">
                  <MapPin size={14} /> {s.tz}
                </span>
                <span className="inline-flex items-center gap-2">
                  {s.type === "group" ? (
                    <Users size={14} />
                  ) : (
                    <User size={14} />
                  )}{" "}
                  {s.type} · {s.durationMin}m
                </span>
              </div>
              <div className="mt-2 text-sm">
                {s.currency} {s.price}
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  className={`${btnBase} ${btnSolid}`}
                  onClick={() => act(s.id, true)}
                >
                  <CheckCircle2 size={16} /> Approve
                </button>
                <button
                  className={`${btnBase} ${btnGhost}`}
                  onClick={() => act(s.id, false)}
                >
                  <XCircle size={16} /> Decline
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-3 flex items-center justify-between">
          <div className="text-[12px] text-[#6B72B3] dark:text-[#A7B0FF]/80">
            Page {page} / {totalPages}
          </div>
          <div className="flex items-center gap-2">
            <button
              className={`${btnBase} ${btnGhost} px-2 py-1`}
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              <ChevronLeft size={16} />
            </button>
            <button
              className={`${btnBase} ${btnGhost} px-2 py-1`}
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </MentorAppLayout>
  );
}
