import React from "react";
import MentorAppLayout from "../MentorAppLayout";
import {
  Search,
  Filter,
  Star,
  StarHalf,
  Video,
  Clock,
  ChevronLeft,
  ChevronRight,
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
  rating?: number;
  startISO: string;
  provider: "Google Meet" | "Zoom";
  durationMin: number;
  status: "completed" | "cancelled" | "refunded" | "no-show";
};
const fmtDay = (iso: string) =>
  new Date(iso).toLocaleDateString([], {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
const fmtTime = (iso: string) =>
  new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

const seed: Item[] = (
  JSON.parse(localStorage.getItem("mentora.sessions") || "[]") as any[]
)
  .filter((s) =>
    ["completed", "cancelled", "refunded", "no-show"].includes(s.status)
  )
  .map((s) => ({
    id: s.id,
    title: s.title,
    mentee: s.mentee,
    rating: s.rating,
    startISO: s.startISO,
    provider: s.provider,
    durationMin: s.durationMin,
    status: s.status,
  }));

function Stars({ rating }: { rating?: number }) {
  if (!rating)
    return (
      <span className="text-[12px] text-[#6B72B3] dark:text-[#A7B0FF]/80">
        Unrated
      </span>
    );
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);
  return (
    <div className="flex items-center">
      {Array.from({ length: full }).map((_, i) => (
        <Star
          key={"f" + i}
          size={14}
          className="text-[#F59E0B] fill-[#F59E0B]"
        />
      ))}
      {half && <StarHalf size={14} className="text-[#F59E0B] fill-[#F59E0B]" />}
      {Array.from({ length: empty }).map((_, i) => (
        <Star key={"e" + i} size={14} className="text-[#D6DAFF]" />
      ))}
    </div>
  );
}

export default function SessionsPast() {
  const [q, setQ] = React.useState("");
  const [status, setStatus] = React.useState<
    "all" | "completed" | "cancelled" | "refunded" | "no-show"
  >("all");
  const [list] = React.useState<Item[]>(seed);

  const filtered = list.filter((s) => {
    if (status !== "all" && s.status !== status) return false;
    if (q.trim()) {
      const hay = `${s.title} ${s.mentee}`.toLowerCase();
      if (!hay.includes(q.toLowerCase())) return false;
    }
    return true;
  });

  const perPage = 10;
  const [page, setPage] = React.useState(1);
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paged = filtered.slice((page - 1) * perPage, page * perPage);
  React.useEffect(() => setPage(1), [q, status]);

  return (
    <MentorAppLayout>
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <h1 className="text-2xl font-bold text-[#0F132E] dark:text-[#E9ECFF]">
          Past Sessions
        </h1>

        <div className="mt-4 flex flex-wrap gap-2">
          <div
            className={`flex items-center gap-2 ${card} h-11 px-3.5 flex-1 min-w-[220px]`}
          >
            <Search size={16} />
            <input
              className="bg-transparent outline-none text-sm w-full"
              placeholder="Search title or mentee…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
          <div className={`flex items-center gap-2 ${card} h-11 px-3`}>
            <Filter size={16} />
            <select
              className="bg-transparent text-sm outline-none"
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
            >
              <option value="all">Status: All</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
              <option value="refunded">Refunded</option>
              <option value="no-show">No-show</option>
            </select>
          </div>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className={`min-w-full ${card}`}>
            <thead>
              <tr className="text-left text-[12px] text-[#6B72B3] dark:text-[#A7B0FF]/80">
                <th className="px-4 py-3">Session</th>
                <th className="px-4 py-3">When</th>
                <th className="px-4 py-3">Duration</th>
                <th className="px-4 py-3">Provider</th>
                <th className="px-4 py-3">Rating</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E7E9FF] dark:divide-[#2B2F55]">
              {paged.map((s) => (
                <tr key={s.id}>
                  <td className="px-4 py-3 text-sm">
                    {s.title}
                    <div className="text-[12px] text-[#6B72B3] dark:text-[#A7B0FF]/80">
                      with {s.mentee}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <Clock size={14} className="inline mr-2" />
                    {fmtDay(s.startISO)} · {fmtTime(s.startISO)}
                  </td>
                  <td className="px-4 py-3 text-sm">{s.durationMin}m</td>
                  <td className="px-4 py-3 text-sm">
                    <Video size={14} className="inline mr-2" />
                    {s.provider}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <Stars rating={s.rating} />
                  </td>
                  <td className="px-4 py-3 text-sm capitalize">{s.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
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
