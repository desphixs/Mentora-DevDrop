import React from "react";
import MentorAppLayout from "../MentorAppLayout";
import {
  Search,
  Filter,
  Video,
  MapPin,
  Clock,
  Users,
  User,
  ChevronLeft,
  ChevronRight,
  Bell,
} from "lucide-react";

const card =
  "rounded-2xl border border-[#E7E9FF] dark:border-[#2B2F55] bg-white/80 dark:bg-white/[0.05] backdrop-blur";
const btnBase =
  "inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#6366F1]/40";
const btnGhost =
  "border border-[#D9DBFF] dark:border-[#30345D] text-[#1B1F3A] dark:text-[#E6E9FF] bg-white/70 dark:bg-white/[0.05]";

type Item = {
  id: string;
  title: string;
  mentee: string;
  type: "1:1" | "group";
  provider: "Google Meet" | "Zoom";
  tz: string;
  startISO: string;
  durationMin: number;
  meetingLink: string;
};
const fmtDay = (iso: string) =>
  new Date(iso).toLocaleDateString([], {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
const fmtTime = (iso: string) =>
  new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

const seed: Item[] = (
  JSON.parse(localStorage.getItem("mentora.sessions") || "[]") as any[]
)
  .filter((s) => s.status === "scheduled")
  .map((s) => ({
    id: s.id,
    title: s.title,
    mentee: s.mentee,
    type: s.type,
    provider: s.provider,
    tz: s.tz,
    startISO: s.startISO,
    durationMin: s.durationMin,
    meetingLink: s.meetingLink,
  }));

export default function SessionsUpcoming() {
  const [q, setQ] = React.useState("");
  const [provider, setProvider] = React.useState<
    "all" | "Google Meet" | "Zoom"
  >("all");
  const [list, setList] = React.useState<Item[]>(seed);

  const filtered = list.filter((s) => {
    if (provider !== "all" && s.provider !== provider) return false;
    if (q.trim()) {
      const hay = `${s.title} ${s.mentee} ${s.tz}`.toLowerCase();
      if (!hay.includes(q.toLowerCase())) return false;
    }
    return true;
  });

  const perPage = 8;
  const [page, setPage] = React.useState(1);
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paged = filtered.slice((page - 1) * perPage, page * perPage);
  React.useEffect(() => setPage(1), [q, provider]);

  return (
    <MentorAppLayout>
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <h1 className="text-2xl font-bold text-[#0F132E] dark:text-[#E9ECFF]">
          Upcoming
        </h1>

        <div className="mt-4 flex flex-wrap gap-2">
          <div
            className={`flex items-center gap-2 ${card} h-11 px-3.5 flex-1 min-w-[220px]`}
          >
            <Search size={16} />
            <input
              className="bg-transparent outline-none text-sm w-full"
              placeholder="Search…"
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
              value={provider}
              onChange={(e) => setProvider(e.target.value as any)}
            >
              <option value="all">Provider: Any</option>
              <option value="Google Meet">Google Meet</option>
              <option value="Zoom">Zoom</option>
            </select>
          </div>
        </div>

        <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {paged.map((s) => (
            <div key={s.id} className={`${card} p-3`}>
              <div className="text-sm font-semibold">{s.title}</div>
              <div className="mt-1 text-[12px] text-[#5E66A6] dark:text-[#A7B0FF]/80">
                with {s.mentee}
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-3 text-sm">
                <span className="inline-flex items-center gap-2">
                  <Clock size={14} /> {fmtDay(s.startISO)} ·{" "}
                  {fmtTime(s.startISO)} · {s.durationMin}m
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
                  {s.type}
                </span>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <a className={`${btnBase} ${btnGhost}`} href={s.meetingLink}>
                  Join
                </a>
                <button
                  className={`${btnBase} ${btnGhost}`}
                  onClick={() => alert("Reminder sent!")}
                >
                  <Bell size={16} /> Remind
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
