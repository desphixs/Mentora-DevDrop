import React from "react";
import MenteeAppLayout from "./MenteeAppLayout";
import {
  Search,
  Filter,
  Inbox,
  Pin,
  PinOff,
  Bell,
  BellOff,
  Archive,
  ArchiveRestore,
  Trash2,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  CheckCheck,
  Send,
  Paperclip,
  Users,
  Clock,
  MessageSquare,
} from "lucide-react";

const ringIndigo =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#6366F1]/40";
const card =
  "rounded-2xl border border-[#E7E9FF] dark:border-[#2B2F55] bg-white/80 dark:bg-white/[0.05] backdrop-blur";
const btnBase =
  "inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-semibold transition " +
  ringIndigo;
const btnSolid =
  "text-white bg-gradient-to-r from-[#4F46E5] via-[#6366F1] to-[#8B5CF6]";
const btnGhost =
  "border border-[#D9DBFF] dark:border-[#30345D] text-[#1B1F3A] dark:text-[#E6E9FF] bg-white/70 dark:bg-white/[0.05] hover:bg-white/90 dark:hover:bg-white/[0.08]";
const pill =
  "inline-flex items-center gap-2 rounded-full border border-[#E7E9FF] dark:border-[#2B2F55] bg-white/70 dark:bg-white/[0.05] px-3 py-1 text-[11px] font-semibold";

type MessageStatus = "sent" | "delivered" | "read";
type Participant = "me" | "them";
type Label = "support" | "billing" | "sessions" | "general";

type ChatMessage = {
  id: string;
  at: string;
  from: Participant;
  text?: string;
  attachments?: { name: string; type: "file" | "image" }[];
  status: MessageStatus;
};

type Thread = {
  id: string;
  name: string; // mentor or group
  isGroup?: boolean;
  labels: Label[];
  unread: number;
  archived: boolean;
  muted: boolean;
  pinned: boolean;
  lastAt: string;
  lastMessage: string;
  messages: ChatMessage[];
};

const nowIso = () => new Date().toISOString();
const isoAgo = (mins: number) =>
  new Date(Date.now() - mins * 60 * 1000).toISOString();

const DUMMY_THREADS: Thread[] = [
  {
    id: "t1",
    name: "Ada Lovette • Frontend",
    labels: ["sessions"],
    unread: 1,
    archived: false,
    muted: false,
    pinned: true,
    lastAt: isoAgo(8),
    lastMessage: "Shared pre-read doc.",
    messages: [
      {
        id: "m1",
        at: isoAgo(180),
        from: "them",
        text: "Let’s focus on RSC today.",
        status: "read",
      },
      {
        id: "m2",
        at: isoAgo(120),
        from: "me",
        text: "Awesome. I’ve prepped questions.",
        status: "read",
      },
      {
        id: "m3",
        at: isoAgo(8),
        from: "them",
        text: "Shared pre-read doc.",
        status: "delivered",
      },
    ],
  },
  {
    id: "t2",
    name: "Rohan Bala • SRE",
    labels: ["support", "sessions"],
    unread: 0,
    archived: false,
    muted: true,
    pinned: false,
    lastAt: isoAgo(35),
    lastMessage: "Add a circuit breaker.",
    messages: [
      {
        id: "m1",
        at: isoAgo(400),
        from: "me",
        text: "We’re seeing p95 spikes.",
        status: "read",
      },
      {
        id: "m2",
        at: isoAgo(35),
        from: "them",
        text: "Add a circuit breaker.",
        status: "read",
      },
    ],
  },
  {
    id: "t3",
    name: "Design Roundtable",
    isGroup: true,
    labels: ["general"],
    unread: 4,
    archived: false,
    muted: false,
    pinned: false,
    lastAt: isoAgo(12),
    lastMessage: "Uploaded references.",
    messages: [
      {
        id: "m1",
        at: isoAgo(600),
        from: "them",
        text: "Collect references.",
        status: "read",
      },
      {
        id: "m2",
        at: isoAgo(12),
        from: "them",
        text: "Uploaded references.",
        status: "delivered",
      },
    ],
  },
];

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
function fmtTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}
function fmtDay(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString([], { month: "short", day: "numeric" });
}

const perPage = 6;
const messagesPageSize = 12;

const ME_Messages: React.FC = () => {
  const [threads, setThreads] = React.useState<Thread[]>(
    () =>
      JSON.parse(localStorage.getItem("mentee.threads") || "null") ??
      DUMMY_THREADS
  );
  React.useEffect(() => {
    localStorage.setItem("mentee.threads", JSON.stringify(threads));
  }, [threads]);

  const [activeId, setActiveId] = React.useState<string>(threads[0]?.id ?? "");
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
  const totalFiltered = React.useMemo(
    () =>
      filterThreads(threads, {
        query,
        statusFilter,
        labelFilter,
        hasAttachments,
        sortMode,
      }).length,
    [threads, query, statusFilter, labelFilter, hasAttachments, sortMode]
  );
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

  React.useEffect(() => {
    setPage(1);
  }, [query, statusFilter, labelFilter, hasAttachments, sortMode]);

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
    // eslint-disable-next-line
  }, [activeThread]);

  const [selected, setSelected] = React.useState<Record<string, boolean>>({});
  const selectedIds = React.useMemo(
    () => Object.keys(selected).filter((k) => selected[k]),
    [selected]
  );

  const inputRef = React.useRef<HTMLInputElement | null>(null);
  React.useEffect(() => {
    inputRef.current?.focus();
  }, [activeId]);

  // actions
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
    setSelected({});
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
    setSelected({});
    if (selectedIds.includes(activeId)) {
      const remaining = threads.filter((t) => !selectedIds.includes(t.id));
      setActiveId(remaining[0]?.id ?? "");
    }
  };

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

  // small-screen state: 'list' or 'chat'
  const [pane, setPane] = React.useState<"list" | "chat">("list");
  React.useEffect(() => {
    if (activeThread)
      setPane((prev) =>
        window.matchMedia("(max-width: 1023px)").matches ? "chat" : "list"
      );
  }, [activeThread]);

  return (
    <MenteeAppLayout>
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold">Messages</h1>
            <p className="text-sm text-[#5E66A6] dark:text-[#A7B0FF]/85">
              Chat with mentors, share files, and follow up.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button className={`${btnBase} ${btnGhost}`} onClick={bulkArchive}>
              <Archive size={16} /> Archive selected
            </button>
            <button className={`${btnBase} ${btnGhost}`} onClick={bulkDelete}>
              <Trash2 size={16} /> Delete selected
            </button>
          </div>
        </div>

        {/* Filters / Search (responsive) */}
        <div className="flex xl:flex-row flex-col gap-3 mt-4">
          {/* Search */}
          <div className="lg:col-span-5 w-full xl:w-[30%]">
            <div className={`flex items-center gap-2 ${card} h-13 px-3.5 w-full`}>
              <Search size={16} className="text-[#5F679A] dark:text-[#A7B0FF]" />
              <input
                className="bg-transparent outline-none text-sm w-full"
                placeholder="Search mentors, labels, message…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Filter group – stacks on mobile, inline on md+ */}
          <div className="lg:col-span-7 w-full xl:w-[70%]">
            <div
              className={`${card} p-2 lg:h-13 sm:px-3 flex flex-col lg:flex-row lg:items-center gap-2`}
            >
              <div className="flex items-center xl:hidden gap-2 shrink-0">
                <Filter size={16} className="text-[#5F679A] dark:text-[#A7B0FF]" />
                <span className="text-xs sm:text-sm font-semibold text-[#6065A6] dark:text-[#A7B0FF]/80">
                  Filters
                </span>
              </div>
              <div className="grid grid-cols-2 lg:flex sm:flex-wrap gap-2 flex-1 min-w-0">
                <select
                  className="bg-transparent text-sm outline-none border border-[#E7E9FF] dark:border-[#2B2F55] rounded-xl h-9 px-2 w-full sm:w-auto"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                >
                  <option value="all">Status: All</option>
                  <option value="unread">Unread</option>
                  <option value="archived">Archived</option>
                  <option value="muted">Muted</option>
                  <option value="pinned">Pinned</option>
                </select>

                <select
                  className="bg-transparent text-sm outline-none border border-[#E7E9FF] dark:border-[#2B2F55] rounded-xl h-9 px-2 w-full sm:w-auto"
                  value={labelFilter}
                  onChange={(e) => setLabelFilter(e.target.value as any)}
                >
                  <option value="all">Label: All</option>
                  <option value="sessions">Sessions</option>
                  <option value="support">Support</option>
                  <option value="billing">Billing</option>
                  <option value="general">General</option>
                </select>

                <select
                  className="bg-transparent text-sm outline-none border border-[#E7E9FF] dark:border-[#2B2F55] rounded-xl h-9 px-2 w-full sm:w-auto"
                  value={hasAttachments}
                  onChange={(e) => setHasAttachments(e.target.value as any)}
                >
                  <option value="all">Attachments: Any</option>
                  <option value="yes">Has attachments</option>
                  <option value="no">No attachments</option>
                </select>

                <select
                  className="bg-transparent text-sm outline-none border border-[#E7E9FF] dark:border-[#2B2F55] rounded-xl h-9 px-2 w-full sm:w-auto"
                  value={sortMode}
                  onChange={(e) => setSortMode(e.target.value as any)}
                >
                  <option value="recent">Sort: Recent</option>
                  <option value="unreadFirst">Sort: Unread first</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Main area: list + conversation (responsive) */}
        <div className="mt-4 grid grid-cols-1 xl:grid-cols-12 gap-4">
          {/* Left column: thread list */}
          <div className={`${card} ${
              pane === "chat" ? "hidden xl:block" : "block"
            } xl:col-span-4`}
          >
            <div className="flex items-center justify-between p-3">
              <div className="text-sm font-semibold">Conversations</div>
              <span className={`${pill}`}>
                <MessageSquare size={14} /> {totalFiltered} found
              </span>
            </div>

            <div className="divide-y divide-[#E7E9FF] dark:divide-[#2B2F55]">
              {filteredPaged.map((t) => (
                <ThreadRow
                  key={t.id}
                  t={t}
                  selected={!!selected[t.id]}
                  onSelectCheck={(c) =>
                    setSelected((p) => ({ ...p, [t.id]: c }))
                  }
                  onOpen={() => {
                    setActiveId(t.id);
                    markRead(t.id);
                    setPane("chat"); // small screens → move to chat view
                  }}
                  onPin={() => togglePin(t.id)}
                  onMute={() => toggleMute(t.id)}
                  onArchive={() => toggleArchive(t.id)}
                  onDelete={() => deleteThread(t.id)}
                />
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
          </div>

          {/* Right column: conversation */}
          <div
            className={`${card} ${
              pane === "list" ? "hidden xl:flex" : "flex"
            } xl:col-span-8 flex-col min-h-[520px]`}
          >
            {!activeThread ? (
              <div className="flex flex-1 items-center justify-center text-sm text-[#6B72B3] dark:text-[#A7B0FF]/80">
                Select a conversation.
              </div>
            ) : (
              <>
                {/* Header */}
                <div className="p-3 flex flex-wrap items-center justify-between gap-3 border-b border-[#E7E9FF] dark:border-[#2B2F55]">
                  {/* back on small screens */}
                  <div className="flex items-center gap-3 min-w-0">
                    <button
                      className="lg:hidden inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#E7E9FF] dark:border-[#2B2F55]"
                      onClick={() => setPane("list")}
                      aria-label="Back"
                    >
                      <ChevronLeft />
                    </button>
                    <div className="h-8 w-8 rounded-xl grid place-items-center bg-[#EEF2FF] dark:bg-white/[0.08] border border-[#E7E9FF] dark:border-[#2B2F55]">
                      <Users size={14} />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-semibold truncate">
                        {activeThread.name}
                      </div>
                      <div className="text-[11px] text-[#6B72B3] dark:text-[#A7B0FF]/80 flex items-center gap-2">
                        <Clock size={12} /> Last active {rel(activeThread.lastAt)} ·{" "}
                        {fmtDay(activeThread.lastAt)} {fmtTime(activeThread.lastAt)}
                      </div>
                    </div>
                  </div>

                  {/* quick actions with dropdown (not modal) */}
                  <RowActions
                    t={activeThread}
                    onPin={() => togglePin(activeThread.id)}
                    onMute={() => toggleMute(activeThread.id)}
                    onArchive={() => toggleArchive(activeThread.id)}
                    onMarkUnread={() => markUnread(activeThread.id)}
                    onDelete={() => deleteThread(activeThread.id)}
                  />
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-auto p-3 space-y-6">
                  {activeThread.messages.length > visibleCount && (
                    <div className="flex justify-center">
                      <button
                        className={`${btnBase} ${btnGhost}`}
                        onClick={() =>
                          setVisibleCount(
                            activeThread.id,
                            visibleCount + messagesPageSize
                          )
                        }
                      >
                        Load older
                      </button>
                    </div>
                  )}

                  {activeThread.messages.slice(-visibleCount).map((msg) => {
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
                              : "bg-white/70 border-[#E7E9FF] dark:bg-white/[0.05] dark:border-[#2B2F55]"
                          }`}
                        >
                          {msg.text && <div className="text-sm">{msg.text}</div>}
                          {msg.attachments?.length ? (
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
                          ) : null}
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
                    <button className={`${btnBase} ${btnGhost}`}>
                      <Paperclip size={16} /> Attach
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
            )}
          </div>
        </div>
      </div>
    </MenteeAppLayout>
  );
};

function ThreadRow({
  t,
  selected,
  onSelectCheck,
  onOpen,
  onPin,
  onMute,
  onArchive,
  onDelete,
}: {
  t: Thread;
  selected: boolean;
  onSelectCheck: (c: boolean) => void;
  onOpen: () => void;
  onPin: () => void;
  onMute: () => void;
  onArchive: () => void;
  onDelete: () => void;
}) {
  const [menu, setMenu] = React.useState(false);
  const ref = React.useRef<HTMLDivElement | null>(null);

  // Close dropdown on outside click / Esc
  React.useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setMenu(false);
    };
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenu(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onEsc);
    };
  }, []);

  return (
    <div className="p-3 hover:bg-white/70 dark:hover:bg-white/[0.06] transition">
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          className="mt-1 accent-[#6366F1] shrink-0"
          checked={selected}
          onChange={(e) => onSelectCheck(e.target.checked)}
          aria-label="Select"
        />
        <button className="flex-1 min-w-0 text-left" onClick={onOpen}>
          <div className="flex items-center justify-between min-w-0">
            <div className="flex items-center gap-2 min-w-0">
              <div className="h-8 w-8 shrink-0 rounded-xl grid place-items-center bg-[#EEF2FF] dark:bg-white/[0.08] border border-[#E7E9FF] dark:border-[#2B2F55]">
                <Users size={14} />
              </div>
              <div className="font-semibold text-sm truncate">{t.name}</div>
              {t.pinned && <Pin size={14} className="text-indigo-500 shrink-0" />}
              {t.muted && <BellOff size={14} className="text-[#7A81B4] shrink-0" />}
              {t.archived && <Archive size={14} className="text-[#7A81B4] shrink-0" />}
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

        {/* More menu (absolute dropdown) */}
        <div className="relative ml-2 shrink-0" ref={ref}>
          <button
            className={`${btnBase} ${btnGhost} h-9 w-9 p-0 justify-center`}
            onClick={() => setMenu((v) => !v)}
            aria-haspopup="menu"
            aria-expanded={menu}
            aria-label="More actions"
          >
            <MoreVertical size={16} />
          </button>
          <div
            className={`absolute right-0 mt-2 w-44 ${card} bg-white dark:bg-zinc-900 shadow-xl p-1 z-20 transition ${
              menu
                ? "opacity-100 translate-y-0"
                : "opacity-0 -translate-y-1 pointer-events-none"
            }`}
            role="menu"
          >
            <button
              className="w-full text-left px-3 py-2 rounded-lg hover:bg-zinc-100/80 dark:hover:bg-zinc-800"
              onClick={() => {
                onPin();
                setMenu(false);
              }}
            >
              {t.pinned ? (
                <span className="inline-flex items-center gap-2">
                  <PinOff size={14} /> Unpin
                </span>
              ) : (
                <span className="inline-flex items-center gap-2">
                  <Pin size={14} /> Pin
                </span>
              )}
            </button>
            <button
              className="w-full text-left px-3 py-2 rounded-lg hover:bg-zinc-100/80 dark:hover:bg-zinc-800"
              onClick={() => {
                onMute();
                setMenu(false);
              }}
            >
              {t.muted ? (
                <span className="inline-flex items-center gap-2">
                  <Bell size={14} /> Unmute
                </span>
              ) : (
                <span className="inline-flex items-center gap-2">
                  <BellOff size={14} /> Mute
                </span>
              )}
            </button>
            <button
              className="w-full text-left px-3 py-2 rounded-lg hover:bg-zinc-100/80 dark:hover:bg-zinc-800"
              onClick={() => {
                onArchive();
                setMenu(false);
              }}
            >
              {t.archived ? (
                <span className="inline-flex items-center gap-2">
                  <ArchiveRestore size={14} /> Unarchive
                </span>
              ) : (
                <span className="inline-flex items-center gap-2">
                  <Archive size={14} /> Archive
                </span>
              )}
            </button>
            <button
              className="w-full text-left px-3 py-2 rounded-lg hover:bg-zinc-100/80 dark:hover:bg-zinc-800"
              onClick={() => {
                if (window.confirm("Delete conversation?")) onDelete();
                setMenu(false);
              }}
            >
              <span className="inline-flex items-center gap-2 text-red-600">
                <Trash2 size={14} /> Delete
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function RowActions({
  t,
  onPin,
  onMute,
  onArchive,
  onMarkUnread,
  onDelete,
}: {
  t: Thread;
  onPin: () => void;
  onMute: () => void;
  onArchive: () => void;
  onMarkUnread: () => void;
  onDelete: () => void;
}) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, []);

  return (
    <div className="relative shrink-0" ref={ref}>
      <button
        className={`${btnBase} ${btnGhost} h-9 w-9 p-0 justify-center`}
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="More actions"
      >
        <MoreVertical size={16} />
      </button>

      <div
        role="menu"
        className={`absolute right-0 mt-2 w-48 ${card} bg-white dark:bg-zinc-900 shadow-xl p-1 z-20 transition ${
          open
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-1 pointer-events-none"
        }`}
      >
        <button
          className="w-full text-left px-3 py-2 rounded-lg hover:bg-zinc-100/80 dark:hover:bg-zinc-800"
          onClick={() => {
            onPin();
            setOpen(false);
          }}
        >
          {t.pinned ? (
            <span className="inline-flex items-center gap-2">
              <PinOff size={14} /> Unpin
            </span>
          ) : (
            <span className="inline-flex items-center gap-2">
              <Pin size={14} /> Pin
            </span>
          )}
        </button>

        <button
          className="w-full text-left px-3 py-2 rounded-lg hover:bg-zinc-100/80 dark:hover:bg-zinc-800"
          onClick={() => {
            onMute();
            setOpen(false);
          }}
        >
          {t.muted ? (
            <span className="inline-flex items-center gap-2">
              <Bell size={14} /> Unmute
            </span>
          ) : (
            <span className="inline-flex items-center gap-2">
              <BellOff size={14} /> Mute
            </span>
          )}
        </button>

        <button
          className="w-full text-left px-3 py-2 rounded-lg hover:bg-zinc-100/80 dark:hover:bg-zinc-800"
          onClick={() => {
            onArchive();
            setOpen(false);
          }}
        >
          {t.archived ? (
            <span className="inline-flex items-center gap-2">
              <ArchiveRestore size={14} /> Unarchive
            </span>
          ) : (
            <span className="inline-flex items-center gap-2">
              <Archive size={14} /> Archive
            </span>
          )}
        </button>

        <button
          className="w-full text-left px-3 py-2 rounded-lg hover:bg-zinc-100/80 dark:hover:bg-zinc-800"
          onClick={() => {
            onMarkUnread();
            setOpen(false);
          }}
        >
          <span className="inline-flex items-center gap-2">
            <Inbox size={14} /> Mark unread
          </span>
        </button>

        <button
          className="w-full text-left px-3 py-2 rounded-lg hover:bg-zinc-100/80 dark:hover:bg-zinc-800"
          onClick={() => {
            if (window.confirm("Delete conversation?")) onDelete();
            setOpen(false);
          }}
        >
          <span className="inline-flex items-center gap-2 text-red-600">
            <Trash2 size={14} /> Delete
          </span>
        </button>
      </div>
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
  if (opts.sortMode === "unreadFirst")
    out = out
      .sort((a, b) => (b.unread > 0 ? 1 : 0) - (a.unread > 0 ? 1 : 0))
      .reverse();
  out = out.sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0)).reverse();
  return out;
}

export default ME_Messages;
