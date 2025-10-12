import React from "react";
import MentorAppLayout from "./MentorAppLayout";
import {
  Search,
  Filter,
  Inbox,
  Pin,
  PinOff,
  BellOff,
  Bell,
  Archive,
  ArchiveRestore,
  Trash2,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  CheckCheck,
  Send,
  Paperclip,
  User,
  Users,
  Clock,
  MessageSquare,
} from "lucide-react";

/* ---------------------------
   Indigo glass UI tokens (local)
---------------------------- */
const ringIndigo =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#6366F1]/40";
const card =
  "rounded-2xl border border-[#E7E9FF] dark:border-[#2B2F55] bg-white/80 dark:bg-white/[0.05] backdrop-blur";
const btnBase =
  "inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-semibold transition " +
  ringIndigo;
const btnSolid =
  "text-white bg-gradient-to-r from-[#4F46E5] via-[#6366F1] to-[#8B5CF6] shadow-[0_10px_30px_rgba(79,70,229,0.35)] hover:shadow-[0_16px_40px_rgba(79,70,229,0.45)]";
const btnGhost =
  "border border-[#D9DBFF] dark:border-[#30345D] text-[#1B1F3A] dark:text-[#E6E9FF] bg-white/70 dark:bg-white/[0.05] hover:bg-white/90 dark:hover:bg-white/[0.08]";
const pill =
  "inline-flex items-center gap-2 rounded-full border border-[#E7E9FF] dark:border-[#2B2F55] bg-white/70 dark:bg-white/[0.05] px-3 py-1 text-[11px] font-semibold";

/* ---------------------------
   Types + dummy data
---------------------------- */
type MessageStatus = "sent" | "delivered" | "read";
type Participant = "me" | "them";
type Label = "support" | "billing" | "sessions" | "general";

type ChatMessage = {
  id: string;
  at: string; // ISO
  from: Participant;
  text?: string;
  attachments?: { name: string; type: "file" | "image" }[];
  status: MessageStatus;
};

type Thread = {
  id: string;
  name: string; // mentee or group name
  avatar?: string;
  isGroup?: boolean;
  labels: Label[];
  unread: number;
  archived: boolean;
  muted: boolean;
  pinned: boolean;
  lastAt: string; // ISO
  lastMessage: string;
  members?: string[]; // for group
  messages: ChatMessage[];
};

const nowIso = () => new Date().toISOString();
const isoAgo = (mins: number) =>
  new Date(Date.now() - mins * 60 * 1000).toISOString();

const DUMMY_THREADS: Thread[] = [
  {
    id: "t1",
    name: "Tunde • Frontend",
    labels: ["sessions"],
    unread: 2,
    archived: false,
    muted: false,
    pinned: true,
    lastAt: isoAgo(6),
    lastMessage: "Shared Figma link + prep notes.",
    messages: [
      {
        id: "m1",
        at: isoAgo(120),
        from: "them",
        text: "Hey, can we focus on performance today?",
        status: "read",
      },
      {
        id: "m2",
        at: isoAgo(119),
        from: "me",
        text: "Yep, Lighthouse + bundle split. Sharing plan.",
        status: "read",
      },
      {
        id: "m3",
        at: isoAgo(65),
        from: "them",
        text: "Perfect—also image optimization?",
        status: "delivered",
      },
      {
        id: "m4",
        at: isoAgo(6),
        from: "them",
        text: "Shared Figma link + prep notes.",
        status: "delivered",
      },
    ],
  },
  {
    id: "t2",
    name: "Riya • Backend",
    labels: ["support", "sessions"],
    unread: 0,
    archived: false,
    muted: true,
    pinned: false,
    lastAt: isoAgo(35),
    lastMessage: "Pushed tracing instrumentation.",
    messages: [
      {
        id: "m1",
        at: isoAgo(180),
        from: "them",
        text: "Struggling with p95 latency.",
        status: "read",
      },
      {
        id: "m2",
        at: isoAgo(175),
        from: "me",
        text: "Add traces + look at N+1 queries.",
        status: "read",
      },
      {
        id: "m3",
        at: isoAgo(35),
        from: "them",
        text: "Pushed tracing instrumentation.",
        status: "read",
      },
    ],
  },
  {
    id: "t3",
    name: "Design Roundtable",
    isGroup: true,
    members: ["Ada", "Chidi", "Mason"],
    labels: ["general"],
    unread: 5,
    archived: false,
    muted: false,
    pinned: false,
    lastAt: isoAgo(10),
    lastMessage: "Uploaded the moodboard.",
    messages: [
      {
        id: "m1",
        at: isoAgo(300),
        from: "them",
        text: "Let’s collect references.",
        status: "read",
      },
      {
        id: "m2",
        at: isoAgo(12),
        from: "them",
        text: "Uploaded the moodboard.",
        attachments: [{ name: "moodboard.png", type: "image" }],
        status: "delivered",
      },
    ],
  },
  {
    id: "t4",
    name: "Mason • Growth",
    labels: ["billing"],
    unread: 0,
    archived: true,
    muted: false,
    pinned: false,
    lastAt: isoAgo(1440),
    lastMessage: "Invoice settled. Thanks!",
    messages: [
      {
        id: "m1",
        at: isoAgo(3000),
        from: "them",
        text: "Invoice sent.",
        status: "read",
      },
      {
        id: "m2",
        at: isoAgo(2800),
        from: "me",
        text: "Received. Thanks!",
        status: "read",
      },
      {
        id: "m3",
        at: isoAgo(1440),
        from: "them",
        text: "Invoice settled. Thanks!",
        status: "read",
      },
    ],
  },
];

function fmtTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}
function fmtDay(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString([], { month: "short", day: "numeric" });
}
function rel(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.round(diff / 60000);
  if (m < 1) return "now";
  if (m < 60) return `${m}m`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h`;
  const d = Math.round(h / 24);
  return `${d}d`;
}

const perPage = 6; // list page size
const messagesPageSize = 12;

/* ---------------------------
   Component
---------------------------- */
const Messages: React.FC = () => {
  const [threads, setThreads] = React.useState<Thread[]>(
    () =>
      JSON.parse(localStorage.getItem("mentora.threads") || "null") ??
      DUMMY_THREADS
  );
  React.useEffect(() => {
    localStorage.setItem("mentora.threads", JSON.stringify(threads));
  }, [threads]);

  const [activeId, setActiveId] = React.useState<string>(threads[0]?.id ?? "");

  // < lg behavior
  const [isNarrow, setIsNarrow] = React.useState<boolean>(() =>
    typeof window !== "undefined" ? window.innerWidth < 1500 : true
  );
  const [showChatMobile, setShowChatMobile] = React.useState<boolean>(false);
  React.useEffect(() => {
    const onResize = () => setIsNarrow(window.innerWidth < 1500);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  React.useEffect(() => {
    if (!isNarrow) setShowChatMobile(false);
  }, [isNarrow]);

  const [query, setQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<
    "all" | "unread" | "archived" | "muted" | "pinned"
  >("all");
  const [labelFilter, setLabelFilter] = React.useState<"all" | Label>("all");
  const [hasAttachments, setHasAttachments] = React.useState<
    "all" | "yes" | "no"
  >("all");
  const [sortMode, setSortMode] = React.useState<"recent" | "unreadFirst">(
    "recent"
  );

  const [page, setPage] = React.useState(1);
  const totalFiltered = React.useMemo(() => {
    return filterThreads(threads, {
      query,
      statusFilter,
      labelFilter,
      hasAttachments,
      sortMode,
    }).length;
  }, [threads, query, statusFilter, labelFilter, hasAttachments, sortMode]);
  const totalPages = Math.max(1, Math.ceil(totalFiltered / perPage));
  const filteredPaged = React.useMemo(() => {
    const all = filterThreads(threads, {
      query,
      statusFilter,
      labelFilter,
      hasAttachments,
      sortMode,
    });
    const start = (page - 1) * perPage;
    return all.slice(start, start + perPage);
  }, [
    threads,
    query,
    statusFilter,
    labelFilter,
    hasAttachments,
    sortMode,
    page,
  ]);
  React.useEffect(
    () => setPage(1),
    [query, statusFilter, labelFilter, hasAttachments, sortMode]
  );

  const activeThread = React.useMemo(
    () => threads.find((t) => t.id === activeId) ?? null,
    [threads, activeId]
  );

  const [visibleCountByThread, setVisibleCountByThread] = React.useState<
    Record<string, number>
  >({});
  const visibleCount = activeThread
    ? visibleCountByThread[activeThread.id] ?? messagesPageSize
    : messagesPageSize;
  const setVisibleCount = (tid: string, n: number) =>
    setVisibleCountByThread((p) => ({
      ...p,
      [tid]: Math.max(messagesPageSize, n),
    }));
  React.useEffect(() => {
    if (!activeThread) return;
    if (visibleCountByThread[activeThread.id] == null)
      setVisibleCount(activeThread.id, messagesPageSize);
  }, [activeThread]); // eslint-disable-line

  const [selected, setSelected] = React.useState<Record<string, boolean>>({});
  const selectedIds = React.useMemo(
    () => Object.keys(selected).filter((k) => selected[k]),
    [selected]
  );
  const clearSelection = () => setSelected({});

  const inputRef = React.useRef<HTMLInputElement | null>(null);
  React.useEffect(() => inputRef.current?.focus(), [activeId, showChatMobile]);

  // Actions
  const markRead = (tid: string) =>
    setThreads((prev) =>
      prev.map((t) => (t.id === tid ? { ...t, unread: 0 } : t))
    );
  const markUnread = (tid: string) =>
    setThreads((prev) =>
      prev.map((t) =>
        t.id === tid ? { ...t, unread: Math.max(1, t.unread || 1) } : t
      )
    );
  const togglePin = (tid: string) =>
    setThreads((prev) =>
      prev.map((t) => (t.id === tid ? { ...t, pinned: !t.pinned } : t))
    );
  const toggleMute = (tid: string) =>
    setThreads((prev) =>
      prev.map((t) => (t.id === tid ? { ...t, muted: !t.muted } : t))
    );
  const toggleArchive = (tid: string) =>
    setThreads((prev) =>
      prev.map((t) => (t.id === tid ? { ...t, archived: !t.archived } : t))
    );
  const deleteThread = (tid: string) =>
    setThreads((prev) => prev.filter((t) => t.id !== tid));
  const bulkArchive = () => {
    if (selectedIds.length === 0) return;
    setThreads((prev) =>
      prev.map((t) =>
        selectedIds.includes(t.id) ? { ...t, archived: true } : t
      )
    );
    clearSelection();
  };
  const bulkDelete = () => {
    if (selectedIds.length === 0) return;
    if (
      !window.confirm(
        `Delete ${selectedIds.length} conversation(s)? This cannot be undone.`
      )
    )
      return;
    setThreads((prev) => prev.filter((t) => !selectedIds.includes(t.id)));
    clearSelection();
    if (selectedIds.includes(activeId)) {
      setActiveId((prev) => {
        const remaining = threads.filter((t) => !selectedIds.includes(t.id));
        return remaining[0]?.id ?? "";
      });
    }
  };

  // Sending
  const [draft, setDraft] = React.useState("");
  const onSend = () => {
    const text = draft.trim();
    if (!text || !activeThread) return;
    const newMsg: ChatMessage = {
      id: "m" + Math.random().toString(36).slice(2),
      at: nowIso(),
      from: "me",
      text,
      status: "sent",
    };
    setThreads((prev) =>
      prev.map((t) =>
        t.id === activeThread.id
          ? {
              ...t,
              lastAt: newMsg.at,
              lastMessage: text,
              messages: [...t.messages, newMsg],
            }
          : t
      )
    );
    setDraft("");
    setTimeout(() => {
      setThreads((prev) =>
        prev.map((t) =>
          t.id === activeThread.id
            ? {
                ...t,
                messages: t.messages.map((m) =>
                  m.id === newMsg.id ? { ...m, status: "delivered" } : m
                ),
              }
            : t
        )
      );
      setTimeout(() => {
        setThreads((prev) =>
          prev.map((t) =>
            t.id === activeThread.id
              ? {
                  ...t,
                  messages: t.messages.map((m) =>
                    m.id === newMsg.id ? { ...m, status: "read" } : m
                  ),
                }
              : t
          )
        );
      }, 600);
    }, 400);
  };

  const leftList = filteredPaged;
  const canLoadOlder = activeThread
    ? activeThread.messages.length > visibleCount
    : false;

  // Modal state for actions (row or header)
  const [actionsFor, setActionsFor] = React.useState<string | null>(null);

  return (
    <MentorAppLayout>
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-[#0F132E] dark:text-[#E9ECFF]">
              Messages
            </h1>
            <p className="text-sm text-[#5E66A6] dark:text-[#A7B0FF]/85">
              Chat with mentees, share files, and keep the momentum.
            </p>
          </div>

          {/* Bulk actions */}
          {!isNarrow && (
            <div className="flex flex-wrap items-center gap-2">
              <button
                className={`${btnBase} ${btnGhost}`}
                onClick={bulkArchive}
              >
                <Archive size={16} /> Archive selected
              </button>
              <button className={`${btnBase} ${btnGhost}`} onClick={bulkDelete}>
                <Trash2 size={16} /> Delete selected
              </button>
            </div>
          )}
        </div>

        {/* Filters / Search (show also on mobile list view) */}
        {(!isNarrow || (isNarrow && !showChatMobile)) && (
          <div className="mt-4 flex flex-wrap gap-2">
            {/* Search */}
            <div
              className={`flex items-center gap-2 ${card} h-11 px-3.5 flex-1 min-w-[220px]`}
            >
              <Search
                size={16}
                className="text-[#5F679A] dark:text-[#A7B0FF]"
              />
              <input
                className="bg-transparent outline-none text-sm w-full text-[#101436] dark:text-[#EEF0FF] placeholder-[#7A81B4] dark:placeholder-[#A7B0FF]/80"
                placeholder="Search name, message, label… (⌘/Ctrl+K)"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
                    (e.target as HTMLInputElement).select();
                  }
                }}
              />
            </div>

            {/* Filter pills */}
            <div className={`flex items-center gap-2 ${card} h-11 px-3`}>
              <Filter
                size={16}
                className="text-[#5F679A] dark:text-[#A7B0FF]"
              />
              <select
                className="bg-transparent text-sm outline-none"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
              >
                <option value="all">Status: All</option>
                <option value="unread">Unread</option>
                <option value="archived">Archived</option>
                <option value="muted">Muted</option>
                <option value="pinned">Pinned</option>
              </select>
              <span className="h-4 w-px bg-[#E7E9FF] dark:bg-[#2B2F55]" />
              <select
                className="bg-transparent text-sm outline-none"
                value={labelFilter}
                onChange={(e) => setLabelFilter(e.target.value as any)}
              >
                <option value="all">Label: All</option>
                <option value="sessions">Sessions</option>
                <option value="support">Support</option>
                <option value="billing">Billing</option>
                <option value="general">General</option>
              </select>
              <span className="h-4 w-px bg-[#E7E9FF] dark:bg-[#2B2F55]" />
              <select
                className="bg-transparent text-sm outline-none"
                value={hasAttachments}
                onChange={(e) => setHasAttachments(e.target.value as any)}
              >
                <option value="all">Attachments: Any</option>
                <option value="yes">Has attachments</option>
                <option value="no">No attachments</option>
              </select>
              <span className="h-4 w-px bg-[#E7E9FF] dark:bg-[#2B2F55]" />
              <select
                className="bg-transparent text-sm outline-none"
                value={sortMode}
                onChange={(e) => setSortMode(e.target.value as any)}
              >
                <option value="recent">Sort: Recent</option>
                <option value="unreadFirst">Sort: Unread first</option>
              </select>
            </div>
          </div>
        )}

        {/* Desktop: side-by-side; Mobile: conditional rendering */}
        {!isNarrow ? (
          <div className="mt-4 grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* List */}
            <div className={`lg:col-span-4 ${card}`}>
              <ListPanel
                threads={leftList}
                selected={selected}
                setSelected={setSelected}
                totalFiltered={totalFiltered}
                page={page}
                setPage={setPage}
                totalPages={totalPages}
                onOpen={(id) => {
                  setActiveId(id);
                  markRead(id);
                }}
                onMore={(id) => setActionsFor(id)}
              />
            </div>

            {/* Chat */}
            <div
              className={`lg:col-span-8 ${card} flex flex-col min-h-[520px]`}
            >
              <ChatPanel
                thread={activeThread}
                visibleCount={visibleCount}
                canLoadOlder={canLoadOlder}
                onLoadOlder={() =>
                  activeThread &&
                  setVisibleCount(
                    activeThread.id,
                    visibleCount + messagesPageSize
                  )
                }
                draft={draft}
                setDraft={setDraft}
                inputRef={inputRef}
                onSend={onSend}
                onActions={() => activeThread && setActionsFor(activeThread.id)}
                // back controls not needed on desktop
              />
            </div>
          </div>
        ) : (
          <div className="mt-4">
            {/* Mobile: show either list OR chat */}
            {!showChatMobile ? (
              <div className={`${card}`}>
                <ListPanel
                  threads={leftList}
                  selected={selected}
                  setSelected={setSelected}
                  totalFiltered={totalFiltered}
                  page={page}
                  setPage={setPage}
                  totalPages={totalPages}
                  onOpen={(id) => {
                    setActiveId(id);
                    markRead(id);
                    setShowChatMobile(true);
                  }}
                  onMore={(id) => setActionsFor(id)}
                />
              </div>
            ) : (
              <div className={`${card} flex flex-col min-h-[520px]`}>
                <ChatPanel
                  thread={activeThread}
                  visibleCount={visibleCount}
                  canLoadOlder={canLoadOlder}
                  onLoadOlder={() =>
                    activeThread &&
                    setVisibleCount(
                      activeThread.id,
                      visibleCount + messagesPageSize
                    )
                  }
                  draft={draft}
                  setDraft={setDraft}
                  inputRef={inputRef}
                  onSend={onSend}
                  onActions={() =>
                    activeThread && setActionsFor(activeThread.id)
                  }
                  backTitle="Back"
                  onBack={() => setShowChatMobile(false)}
                />
              </div>
            )}
          </div>
        )}

        {/* Actions Modal */}
        {actionsFor && (
          <ActionsModal
            thread={threads.find((t) => t.id === actionsFor)!}
            onClose={() => setActionsFor(null)}
            onPin={() => {
              togglePin(actionsFor);
              setActionsFor(null);
            }}
            onMute={() => {
              toggleMute(actionsFor);
              setActionsFor(null);
            }}
            onArchive={() => {
              toggleArchive(actionsFor);
              setActionsFor(null);
            }}
            onUnread={() => {
              markUnread(actionsFor);
              setActionsFor(null);
            }}
            onDelete={() => {
              if (window.confirm("Delete conversation?"))
                deleteThread(actionsFor);
              setActionsFor(null);
            }}
          />
        )}
      </div>
    </MentorAppLayout>
  );
};

/* ---------------------------
   Panels
---------------------------- */
function ListPanel({
  threads,
  selected,
  setSelected,
  totalFiltered,
  page,
  setPage,
  totalPages,
  onOpen,
  onMore,
}: {
  threads: Thread[];
  selected: Record<string, boolean>;
  setSelected: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  totalFiltered: number;
  page: number;
  setPage: (n: number | ((p: number) => number)) => void;
  totalPages: number;
  onOpen: (id: string) => void;
  onMore: (id: string) => void;
}) {
  return (
    <>
      <div className="flex items-center justify-between p-3">
        <div className="text-sm font-semibold text-[#0F1536] dark:text-[#E7E9FF]">
          Conversations
        </div>
        <div className="flex items-center gap-2">
          <span className={`${pill} text-[#6065A6] dark:text-[#A7B0FF]/80`}>
            <MessageSquare size={14} /> {totalFiltered} found
          </span>
        </div>
      </div>

      <div className="divide-y divide-[#E7E9FF] dark:divide-[#2B2F55]">
        {threads.map((t) => (
          <div
            key={t.id}
            className="p-3 hover:bg-white/70 dark:hover:bg-white/[0.06] transition"
          >
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                className="mt-1 accent-[#6366F1]"
                checked={!!selected[t.id]}
                onChange={(e) =>
                  setSelected((p) => ({ ...p, [t.id]: e.target.checked }))
                }
                aria-label="Select"
              />

              <button
                className="flex-1 text-left min-w-0"
                onClick={() => onOpen(t.id)}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <Avatar name={t.name} isGroup={t.isGroup} />
                    <div className="font-semibold text-sm text-[#0F1536] dark:text-[#E7E9FF] truncate">
                      {t.name}
                    </div>
                  </div>
                  <div className="text-[11px] text-[#6B72B3] dark:text-[#A7B0FF]/80 shrink-0">
                    {rel(t.lastAt)}
                  </div>
                </div>
                <div className="mt-1 text-[12px] text-[#5E66A6] dark:text-[#A7B0FF]/80 truncate">
                  {t.lastMessage}
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-1">
                  {t.labels.map((l) => (
                    <span
                      key={l}
                      className="text-[10px] px-2 py-0.5 rounded-full bg-[#EEF2FF] dark:bg-white/[0.06] text-[#1B1F3A] dark:text-[#E6E9FF] border border-[#E7E9FF] dark:border-[#2B2F55]"
                    >
                      {l}
                    </span>
                  ))}
                  {t.unread > 0 && (
                    <span className="ml-auto inline-flex items-center gap-1 text-[11px] font-semibold text-[#4F46E5]">
                      <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#4F46E5]" />{" "}
                      {t.unread}
                    </span>
                  )}
                </div>
              </button>

              {/* More menu -> modal */}
              <div className="shrink-0">
                <button
                  className={`${btnBase} ${btnGhost} px-2 py-1`}
                  onClick={() => onMore(t.id)}
                  aria-label="More actions"
                >
                  <MoreVertical size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="p-3 flex items-center justify-between">
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
    </>
  );
}

function ChatPanel({
  thread,
  visibleCount,
  canLoadOlder,
  onLoadOlder,
  draft,
  setDraft,
  inputRef,
  onSend,
  onActions,
  backTitle,
  onBack,
}: {
  thread: Thread | null;
  visibleCount: number;
  canLoadOlder: boolean;
  onLoadOlder: () => void;
  draft: string;
  setDraft: (v: string) => void;
  inputRef: React.RefObject<HTMLInputElement>;
  onSend: () => void;
  onActions: () => void;
  backTitle?: string;
  onBack?: () => void;
}) {
  if (!thread) {
    return (
      <div className="flex flex-1 items-center justify-center text-sm text-[#6B72B3] dark:text-[#A7B0FF]/80">
        Select a conversation.
      </div>
    );
  }

  return (
    <>
      {/* Header (mobile shows Back + More) */}
      <div className="p-3 flex flex-wrap items-center justify-between gap-3 border-b border-[#E7E9FF] dark:border-[#2B2F55]">
        <div className="flex items-center gap-2">
          {onBack && (
            <button className={`${btnBase} ${btnGhost}`} onClick={onBack}>
              <ChevronLeft size={16} /> {backTitle || "Back"}
            </button>
          )}
          <Avatar name={thread.name} isGroup={thread.isGroup} />
          <div>
            <div className="text-sm font-semibold text-[#0F1536] dark:text-[#E7E9FF]">
              {thread.name}
            </div>
            <div className="text-[11px] text-[#6B72B3] dark:text-[#A7B0FF]/80 flex items-center gap-2">
              <Clock size={12} />
              Last active {rel(thread.lastAt)} · {fmtDay(thread.lastAt)}{" "}
              {fmtTime(thread.lastAt)}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            className={`${btnBase} ${btnGhost}`}
            onClick={onActions}
            aria-label="Conversation actions"
          >
            <MoreVertical size={16} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-auto p-3 space-y-6">
        {canLoadOlder && (
          <div className="flex justify-center">
            <button className={`${btnBase} ${btnGhost}`} onClick={onLoadOlder}>
              Load older
            </button>
          </div>
        )}

        {thread.messages.slice(-visibleCount).map((msg) => {
          const mine = msg.from === "me";
          return (
            <div
              key={msg.id}
              className={`flex ${mine ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] sm:max-w-[70%] rounded-2xl px-4 py-2 border ${
                  mine
                    ? "border-[#E7E9FF] dark:bg-white/[0.06] dark:border-[#2B2F55]"
                    : "bg-white/70 border-[#E7E9FF] dark:bg-white/[0.09] dark:border-[#2B2F55]"
                }`}
              >
                {msg.text && (
                  <div className="text-sm text-[#0F1536] dark:text-[#E7E9FF]">
                    {msg.text}
                  </div>
                )}
                {msg.attachments && msg.attachments.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2 text-[12px]">
                    {msg.attachments.map((a) => (
                      <span
                        key={a.name}
                        className="px-2 py-1 rounded-lg border border-[#E7E9FF] dark:border-[#2B2F55] bg-white/70 dark:bg-white/[0.06] inline-flex items-center gap-2"
                      >
                        <Paperclip size={14} /> {a.name}
                      </span>
                    ))}
                  </div>
                )}
                <div className="mt-1 flex items-center justify-end gap-2 text-[11px] text-[#6B72B3] dark:text-[#A7B0FF]/80">
                  <span>
                    {fmtDay(msg.at)} {fmtTime(msg.at)}
                  </span>
                  {mine && <CheckIcon status={msg.status} />}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Composer */}
      <div className="p-3 border-t border-[#E7E9FF] dark:border-[#2B2F55]">
        <div className="flex items-center gap-2">
          <button className={`${btnBase} ${btnGhost}`} title="Attach">
            <Paperclip size={16} />
            Attach
          </button>
          <input
            ref={inputRef}
            className={`flex-1 h-11 px-3 rounded-xl border border-[#E7E9FF] dark:border-[#2B2F55] bg-white/70 dark:bg-white/[0.05] outline-none text-sm ${ringIndigo}`}
            placeholder="Write a message…"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                onSend();
              }
            }}
          />
          <button className={`${btnBase} ${btnSolid}`} onClick={onSend}>
            <Send size={16} /> Send
          </button>
        </div>
      </div>
    </>
  );
}

/* ---------------------------
   Modal for actions
---------------------------- */
function ActionsModal({
  thread,
  onClose,
  onPin,
  onMute,
  onArchive,
  onUnread,
  onDelete,
}: {
  thread: Thread;
  onClose: () => void;
  onPin: () => void;
  onMute: () => void;
  onArchive: () => void;
  onUnread: () => void;
  onDelete: () => void;
}) {
  React.useEffect(() => {
    const onEsc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
      <div
        className="relative mx-auto mt-24 w-full max-w-sm rounded-2xl border border-[#E7E9FF] dark:border-[#2B2F55] bg-white/95 dark:bg-[#0B0F2A]/95 p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3">
          <Avatar name={thread.name} isGroup={thread.isGroup} />
          <div className="min-w-0">
            <div className="text-sm font-semibold text-[#0F1536] dark:text-[#E7E9FF] truncate">
              {thread.name}
            </div>
            <div className="text-[11px] text-[#6B72B3] dark:text-[#A7B0FF]/80">
              Quick actions
            </div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <button className={`${btnBase} ${btnGhost}`} onClick={onPin}>
            {thread.pinned ? <Pin size={16} /> : <PinOff size={16} />}{" "}
            {thread.pinned ? "Unpin" : "Pin"}
          </button>
          <button className={`${btnBase} ${btnGhost}`} onClick={onMute}>
            {thread.muted ? <Bell size={16} /> : <BellOff size={16} />}{" "}
            {thread.muted ? "Unmute" : "Mute"}
          </button>
          <button className={`${btnBase} ${btnGhost}`} onClick={onArchive}>
            {thread.archived ? (
              <ArchiveRestore size={16} />
            ) : (
              <Archive size={16} />
            )}{" "}
            {thread.archived ? "Unarchive" : "Archive"}
          </button>
          <button className={`${btnBase} ${btnGhost}`} onClick={onUnread}>
            <Inbox size={16} /> Mark unread
          </button>
          <button
            className={`${btnBase} ${btnGhost} col-span-2 !text-rose-600 dark:!text-rose-400`}
            onClick={onDelete}
          >
            <Trash2 size={16} /> Delete conversation
          </button>
        </div>

        <div className="mt-4 flex justify-end">
          <button className={`${btnBase} ${btnSolid}`} onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------
   Small components & helpers
---------------------------- */
function Avatar({ name, isGroup }: { name: string; isGroup?: boolean }) {
  const initials = name
    .split(" ")
    .map((s) => s[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return (
    <div className="h-8 w-8 rounded-xl grid place-items-center bg-[#EEF2FF] dark:bg-white/[0.08] border border-[#E7E9FF] dark:border-[#2B2F55] text-[11px] text-[#1B1F3A] dark:text-[#E6E9FF]">
      {isGroup ? <Users size={14} /> : initials || <User size={14} />}
    </div>
  );
}

function CheckIcon({ status }: { status: MessageStatus }) {
  if (status === "read")
    return <CheckCheck size={14} className="text-indigo-500" title="Read" />;
  if (status === "delivered")
    return (
      <CheckCheck size={14} className="text-[#7A81B4]" title="Delivered" />
    );
  return <CheckCheck size={14} className="text-[#A7A9C2]" title="Sent" />;
}

function filterThreads(
  list: Thread[],
  opts: {
    query: string;
    statusFilter: "all" | "unread" | "archived" | "muted" | "pinned";
    labelFilter: "all" | Label;
    hasAttachments: "all" | "yes" | "no";
    sortMode: "recent" | "unreadFirst";
  }
) {
  const q = opts.query.trim().toLowerCase();
  let out = list.filter((t) => {
    if (opts.statusFilter === "unread" && t.unread <= 0) return false;
    if (opts.statusFilter === "archived" && !t.archived) return false;
    if (opts.statusFilter === "muted" && !t.muted) return false;
    if (opts.statusFilter === "pinned" && !t.pinned) return false;
    if (opts.labelFilter !== "all" && !t.labels.includes(opts.labelFilter))
      return false;

    if (opts.hasAttachments !== "all") {
      const anyAttach = t.messages.some(
        (m) => m.attachments && m.attachments.length > 0
      );
      if (opts.hasAttachments === "yes" && !anyAttach) return false;
      if (opts.hasAttachments === "no" && anyAttach) return false;
    }

    if (q) {
      const hay = `${t.name} ${t.labels.join(" ")} ${t.lastMessage} ${t.messages
        .map((m) => m.text ?? "")
        .join(" ")}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });

  out.sort((a, b) => +new Date(b.lastAt) - +new Date(a.lastAt));
  if (opts.sortMode === "unreadFirst") {
    out = out
      .sort((a, b) => (b.unread > 0 ? 1 : 0) - (a.unread > 0 ? 1 : 0))
      .reverse();
  }
  out = out.sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0)).reverse();
  return out;
}

export default Messages;
