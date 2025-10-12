import React from "react";
import MentorAppLayout from "../MentorAppLayout";
import {
  Bell,
  Mail,
  Smartphone,
  MessageSquare,
  Clock,
  Filter,
  Search,
  MoreVertical,
  CheckCheck,
  Archive,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Inbox,
} from "lucide-react";

/* ---------- Indigo glass UI tokens ---------- */
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

/* ---------- Types & dummy data ---------- */
type Channel = "email" | "push" | "whatsapp";
type Category = "sessions" | "payouts" | "reviews" | "system" | "marketing";

type Pref = {
  category: Category;
  label: string;
  channels: Channel[];
  frequency: "immediate" | "hourly" | "daily" | "weekly" | "off";
};

type Item = {
  id: string;
  at: string; // ISO
  title: string;
  detail: string;
  category: Category;
  channel: Channel;
  read: boolean;
  archived: boolean;
};

const nowIso = () => new Date().toISOString();
const isoAgo = (mins: number) =>
  new Date(Date.now() - mins * 60 * 1000).toISOString();

const INITIAL_PREFS: Pref[] = [
  { category: "sessions", label: "Session activity", channels: ["email", "push"], frequency: "immediate" },
  { category: "payouts", label: "Payouts & earnings", channels: ["email"], frequency: "daily" },
  { category: "reviews", label: "New reviews", channels: ["push"], frequency: "hourly" },
  { category: "system", label: "System & policy", channels: ["email"], frequency: "weekly" },
  { category: "marketing", label: "Announcements", channels: [], frequency: "off" },
];

const DUMMY_ITEMS: Item[] = [
  {
    id: "n1",
    at: isoAgo(6),
    title: "New session request",
    detail: "Ada requested a 45-min slot tomorrow.",
    category: "sessions",
    channel: "push",
    read: false,
    archived: false,
  },
  {
    id: "n2",
    at: isoAgo(30),
    title: "Payout scheduled",
    detail: "₦125,000 scheduled to your bank (Tue).",
    category: "payouts",
    channel: "email",
    read: true,
    archived: false,
  },
  {
    id: "n3",
    at: isoAgo(90),
    title: "New review",
    detail: "Riya rated your last session ★★★★★",
    category: "reviews",
    channel: "push",
    read: true,
    archived: false,
  },
  {
    id: "n4",
    at: isoAgo(240),
    title: "Status update",
    detail: "Maintenance window scheduled for Sunday.",
    category: "system",
    channel: "email",
    read: false,
    archived: false,
  },
  {
    id: "n5",
    at: isoAgo(1440),
    title: "Launch notes",
    detail: "Group sessions beta is now open.",
    category: "marketing",
    channel: "email",
    read: true,
    archived: true,
  },
];

/* ---------- Helpers ---------- */
const fmtTime = (iso: string) =>
  new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
const fmtDay = (iso: string) =>
  new Date(iso).toLocaleDateString([], { month: "short", day: "numeric" });
const rel = (iso: string) => {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.round(diff / 60000);
  if (m < 1) return "now";
  if (m < 60) return `${m}m`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h`;
  const d = Math.round(h / 24);
  return `${d}d`;
};

const PER_PAGE = 5;

/* ---------- Component ---------- */
const Notifications: React.FC = () => {
  const [prefs, setPrefs] = React.useState<Pref[]>(
    () => JSON.parse(localStorage.getItem("mentora.notif.prefs") || "null") ?? INITIAL_PREFS
  );
  const [items, setItems] = React.useState<Item[]>(
    () => JSON.parse(localStorage.getItem("mentora.notif.items") || "null") ?? DUMMY_ITEMS
  );
  React.useEffect(() => {
    localStorage.setItem("mentora.notif.prefs", JSON.stringify(prefs));
  }, [prefs]);
  React.useEffect(() => {
    localStorage.setItem("mentora.notif.items", JSON.stringify(items));
  }, [items]);

  const [query, setQuery] = React.useState("");
  const [category, setCategory] = React.useState<"all" | Category>("all");
  const [channel, setChannel] = React.useState<"all" | Channel>("all");
  const [status, setStatus] = React.useState<"all" | "unread" | "archived">("all");
  const [page, setPage] = React.useState(1);
  const [toast, setToast] = React.useState<string | null>(null);
  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 1500);
  };

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((n) => {
      if (category !== "all" && n.category !== category) return false;
      if (channel !== "all" && n.channel !== channel) return false;
      if (status === "unread" && n.read) return false;
      if (status === "archived" && !n.archived) return false;
      if (q) {
        const hay = `${n.title} ${n.detail}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [items, query, category, channel, status]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  React.useEffect(() => setPage(1), [query, category, channel, status]);

  const toggleChannel = (cat: Category, ch: Channel) =>
    setPrefs((prev) =>
      prev.map((p) =>
        p.category === cat
          ? {
              ...p,
              channels: p.channels.includes(ch)
                ? p.channels.filter((c) => c !== ch)
                : [...p.channels, ch],
            }
          : p
      )
    );
  const setFrequency = (cat: Category, f: Pref["frequency"]) =>
    setPrefs((prev) => prev.map((p) => (p.category === cat ? { ...p, frequency: f } : p)));

  const markRead = (id: string, v = true) =>
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, read: v } : n)));
  const toggleArchive = (id: string) =>
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, archived: !n.archived } : n)));
  const remove = (id: string) => setItems((prev) => prev.filter((n) => n.id !== id));

  /* Dropdown per row */
  const [openMenu, setOpenMenu] = React.useState<string | null>(null);

  /* Quiet hours (demo) */
  const [dnd, setDnd] = React.useState(false);
  const [quietStart, setQuietStart] = React.useState("22:00");
  const [quietEnd, setQuietEnd] = React.useState("07:00");

  return (
    <MentorAppLayout>
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        {/* Toast */}
        {toast && (
          <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-[#4F46E5]/90 shadow-lg">
            {toast}
          </div>
        )}

        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-[#0F132E] dark:text-[#E9ECFF]">Notifications</h1>
            <p className="text-sm text-[#5E66A6] dark:text-[#A7B0FF]/85">
              Choose channels, frequencies, and manage your notification inbox.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className={pill}><Bell size={14}/> Preferences</span>
            <span className={pill}><Inbox size={14}/> Inbox</span>
          </div>
        </div>

        {/* Preferences + Inbox grid */}
        <div className="mt-4 grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Preferences */}
          <div className={`lg:col-span-5 ${card} p-4`}>
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Bell size={16} /> Preferences
            </div>

            <div className="mt-4 space-y-4">
              {prefs.map((p) => (
                <div key={p.category} className={`p-3 rounded-xl border border-[#E7E9FF] dark:border-[#2B2F55]`}>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="font-semibold text-sm text-[#0F1536] dark:text-[#E7E9FF]">
                      {p.label}
                    </div>
                    <select
                      className={`h-9 px-3 rounded-lg border border-[#D9DBFF] dark:border-[#30345D] bg-white/70 dark:bg-white/[0.05] text-sm ${ringIndigo}`}
                      value={p.frequency}
                      onChange={(e) => setFrequency(p.category, e.target.value as Pref["frequency"])}
                    >
                      <option value="immediate">Immediate</option>
                      <option value="hourly">Hourly</option>
                      <option value="daily">Daily digest</option>
                      <option value="weekly">Weekly</option>
                      <option value="off">Off</option>
                    </select>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <ChannelToggle
                      label="Email"
                      icon={<Mail size={14} />}
                      active={p.channels.includes("email")}
                      onClick={() => toggleChannel(p.category, "email")}
                    />
                    <ChannelToggle
                      label="In-app"
                      icon={<Smartphone size={14} />}
                      active={p.channels.includes("push")}
                      onClick={() => toggleChannel(p.category, "push")}
                    />
                    <ChannelToggle
                      label="WhatsApp"
                      icon={<MessageSquare size={14} />}
                      active={p.channels.includes("whatsapp")}
                      onClick={() => toggleChannel(p.category, "whatsapp")}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Quiet hours */}
            <div className="mt-4 p-3 rounded-xl border border-[#E7E9FF] dark:border-[#2B2F55]">
              <div className="flex items-center justify-between">
                <label className="inline-flex items-center gap-2 text-sm font-semibold">
                  <Clock size={16} /> Quiet hours (Do Not Disturb)
                </label>
                <Switch checked={dnd} onChange={setDnd} />
              </div>
              <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-16 text-[#6B72B3] dark:text-[#A7B0FF]/80">Start</span>
                  <input
                    type="time"
                    className={`h-9 flex-1 px-3 rounded-lg border border-[#D9DBFF] dark:border-[#30345D] bg-white/70 dark:bg-white/[0.05] ${ringIndigo}`}
                    value={quietStart}
                    onChange={(e) => setQuietStart(e.target.value)}
                    disabled={!dnd}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-16 text-[#6B72B3] dark:text-[#A7B0FF]/80">End</span>
                  <input
                    type="time"
                    className={`h-9 flex-1 px-3 rounded-lg border border-[#D9DBFF] dark:border-[#30345D] bg-white/70 dark:bg-white/[0.05] ${ringIndigo}`}
                    value={quietEnd}
                    onChange={(e) => setQuietEnd(e.target.value)}
                    disabled={!dnd}
                  />
                </div>
              </div>
              <button className={`mt-3 ${btnBase} ${btnSolid}`} onClick={() => showToast("Preferences saved")}>
                Save changes
              </button>
            </div>
          </div>

          {/* Inbox */}
          <div className={`lg:col-span-7 ${card} p-4`}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <Inbox size={16} /> Inbox
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  className={`${btnBase} ${btnGhost}`}
                  onClick={() => {
                    const unread = items.find((i) => !i.read);
                    if (unread) markRead(unread.id, true);
                  }}
                >
                  <CheckCheck size={16} /> Mark one read
                </button>
                <button
                  className={`${btnBase} ${btnGhost}`}
                  onClick={() => {
                    setItems((prev) => prev.map((i) => ({ ...i, read: true })));
                  }}
                >
                  <CheckCheck size={16} /> Mark all read
                </button>
              </div>
            </div>

            {/* Filters/Search */}
            <div className="mt-3 flex flex-wrap gap-2">
              <div className={`flex items-center gap-2 ${card} h-11 px-3.5 flex-1 min-w-[220px]`}>
                <Search size={16} className="text-[#5F679A] dark:text-[#A7B0FF]" />
                <input
                  className="bg-transparent outline-none text-sm w-full text-[#101436] dark:text-[#EEF0FF] placeholder-[#7A81B4] dark:placeholder-[#A7B0FF]/80"
                  placeholder="Search notifications…"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>

              <div className={`flex items-center gap-2 ${card} h-11 px-3`}>
                <Filter size={16} className="text-[#5F679A] dark:text-[#A7B0FF]" />
                <select className="bg-transparent text-sm outline-none" value={category} onChange={(e) => setCategory(e.target.value as any)}>
                  <option value="all">Category: All</option>
                  <option value="sessions">Sessions</option>
                  <option value="payouts">Payouts</option>
                  <option value="reviews">Reviews</option>
                  <option value="system">System</option>
                  <option value="marketing">Marketing</option>
                </select>
                <span className="h-4 w-px bg-[#E7E9FF] dark:bg-[#2B2F55]" />
                <select className="bg-transparent text-sm outline-none" value={channel} onChange={(e) => setChannel(e.target.value as any)}>
                  <option value="all">Channel: All</option>
                  <option value="email">Email</option>
                  <option value="push">In-app</option>
                  <option value="whatsapp">WhatsApp</option>
                </select>
                <span className="h-4 w-px bg-[#E7E9FF] dark:bg-[#2B2F55]" />
                <select className="bg-transparent text-sm outline-none" value={status} onChange={(e) => setStatus(e.target.value as any)}>
                  <option value="all">Status: All</option>
                  <option value="unread">Unread</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>

            {/* List */}
            <div className="mt-3 divide-y divide-[#E7E9FF] dark:divide-[#2B2F55]">
              {paged.map((n) => (
                <div key={n.id} className="py-3">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <ChannelBadge ch={n.channel} />
                      <div>
                        <div className="flex items-center gap-2">
                          <div className={`text-sm font-semibold ${n.read ? "text-[#0F1536] dark:text-[#E7E9FF]" : "text-[#4F46E5]"}`}>
                            {n.title}
                          </div>
                          {n.archived && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#EEF2FF] dark:bg-white/[0.06] text-[#1B1F3A] dark:text-[#E6E9FF] border border-[#E7E9FF] dark:border-[#2B2F55]">
                              archived
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-[#5E66A6] dark:text-[#A7B0FF]/85">{n.detail}</div>
                        <div className="mt-1 text-[11px] text-[#6B72B3] dark:text-[#A7B0FF]/80">
                          {n.category} • {fmtDay(n.at)} {fmtTime(n.at)} • {rel(n.at)}
                        </div>
                      </div>
                    </div>

                    <div className="relative">
                      <button
                        className={`${btnBase} ${btnGhost} px-2 py-1`}
                        onClick={() => setOpenMenu((m) => (m === n.id ? null : n.id))}
                        aria-expanded={openMenu === n.id}
                        aria-haspopup="menu"
                      >
                        <MoreVertical size={16} />
                      </button>

                      {openMenu === n.id && (
                        <div className="absolute right-0 mt-2 w-44 z-20 rounded-xl border border-[#E7E9FF] dark:border-[#2B2F55] bg-white dark:bg-[#0c0f27] shadow-lg p-1">
                          <button className="w-full text-left text-sm px-3 py-2 rounded-lg hover:bg-zinc-50/70 dark:hover:bg-white/[0.06]"
                            onClick={() => { markRead(n.id, !n.read); setOpenMenu(null); }}>
                            {n.read ? "Mark as unread" : "Mark as read"}
                          </button>
                          <button className="w-full text-left text-sm px-3 py-2 rounded-lg hover:bg-zinc-50/70 dark:hover:bg-white/[0.06]"
                            onClick={() => { toggleArchive(n.id); setOpenMenu(null); }}>
                            {n.archived ? "Unarchive" : "Archive"}
                          </button>
                          <button className="w-full text-left text-sm px-3 py-2 rounded-lg hover:bg-zinc-50/70 dark:hover:bg-white/[0.06] text-red-600"
                            onClick={() => { remove(n.id); setOpenMenu(null); }}>
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-3 flex items-center justify-between">
              <div className="text-[12px] text-[#6B72B3] dark:text-[#A7B0FF]/80">
                Page {page} / {totalPages} • {filtered.length} total
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
        </div>
      </div>
    </MentorAppLayout>
  );
};

/* ---------- small UI pieces ---------- */
function Switch({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-5 w-9 items-center rounded-full transition ${checked ? "bg-[#6366F1]" : "bg-zinc-300 dark:bg-zinc-700"} ${ringIndigo}`}
      aria-pressed={checked}
    >
      <span
        className={`inline-block h-4 w-4 rounded-full bg-white transform transition ${checked ? "translate-x-4" : "translate-x-1"}`}
      />
    </button>
  );
}

function ChannelToggle({
  label,
  icon,
  active,
  onClick,
}: {
  label: string;
  icon: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs ${active ? "bg-[#EEF2FF] border-[#E7E9FF] dark:bg-white/[0.08] dark:border-[#2B2F55] text-[#1B1F3A] dark:text-[#E6E9FF]" : "bg-white/70 border-[#E7E9FF] dark:bg-white/[0.05] dark:border-[#2B2F55] text-[#6065A6] dark:text-[#A7B0FF]/80"}`}
    >
      {icon} {label}
    </button>
  );
}

function ChannelBadge({ ch }: { ch: Channel }) {
  const map: Record<Channel, { label: string; icon: React.ReactNode }> = {
    email: { label: "Email", icon: <Mail size={12} /> },
    push: { label: "In-app", icon: <Smartphone size={12} /> },
    whatsapp: { label: "WhatsApp", icon: <MessageSquare size={12} /> },
  };
  const v = map[ch];
  return (
    <span className="h-7 w-7 grid place-items-center rounded-lg bg-[#EEF2FF] dark:bg-white/[0.08] border border-[#E7E9FF] dark:border-[#2B2F55] text-[#1B1F3A] dark:text-[#E6E9FF]">
      {v.icon}
    </span>
  );
}

export default Notifications;
