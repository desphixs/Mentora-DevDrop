import React from "react";
import MentorAppLayout from "./MentorAppLayout";
import {
  Search,
  Filter,
  Star,
  StarHalf,
  Flag,
  FlagOff,
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
  Image as ImageIcon,
  Pin,
  PinOff,
  CheckCircle2,
} from "lucide-react";

/* ---------------------------------
   Indigo glass UI tokens (local)
---------------------------------- */
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
type Participant = "mentor" | "reviewer";
type ReviewStatus =
  | "published"
  | "pending"
  | "flagged"
  | "archived"
  | "resolved";

type ReviewReply = {
  id: string;
  at: string; // ISO
  from: Participant;
  text?: string;
  attachments?: { name: string; type: "file" | "image" }[];
  status?: "sent" | "delivered" | "read";
};

type Review = {
  id: string;
  reviewer: string;
  isTeam?: boolean;
  rating: number; // 1..5
  title: string;
  text: string;
  tags: string[]; // e.g. ["frontend","career"]
  createdAt: string; // ISO
  sessionType: string; // "1:1 · 45m", "Group · 60m"
  status: ReviewStatus;
  featured: boolean; // like "pin"
  hasMedia: boolean;
  replies: ReviewReply[];
  lastAt: string; // ISO (last activity)
};

const nowIso = () => new Date().toISOString();
const isoAgo = (mins: number) =>
  new Date(Date.now() - mins * 60 * 1000).toISOString();

const DUMMY_REVIEWS: Review[] = [
  {
    id: "r1",
    reviewer: "Tunde",
    rating: 5,
    title: "Great depth, clear action plan",
    text: "We dug into Next.js perf and image strategy. Left with a tactical plan and benchmarks.",
    tags: ["frontend", "performance"],
    createdAt: isoAgo(60 * 6),
    sessionType: "1:1 · 45m",
    status: "published",
    featured: true,
    hasMedia: true,
    replies: [
      {
        id: "rp1",
        at: isoAgo(60 * 6 - 5),
        from: "mentor",
        text: "Thanks Tunde! Happy shipping 🚀",
        status: "read",
      },
    ],
    lastAt: isoAgo(60 * 6 - 5),
  },
  {
    id: "r2",
    reviewer: "Riya",
    rating: 4,
    title: "Solid debugging session",
    text: "Traces + indexes helped. Will follow up after load test.",
    tags: ["backend", "observability"],
    createdAt: isoAgo(60 * 23),
    sessionType: "1:1 · 60m",
    status: "published",
    featured: false,
    hasMedia: false,
    replies: [],
    lastAt: isoAgo(60 * 23),
  },
  {
    id: "r3",
    reviewer: "Design Roundtable",
    isTeam: true,
    rating: 5,
    title: "Loved the critique framework",
    text: "Clear heuristics and examples. Team knows what to fix before next review.",
    tags: ["design", "ux"],
    createdAt: isoAgo(60 * 10),
    sessionType: "Group · 60m",
    status: "published",
    featured: false,
    hasMedia: true,
    replies: [
      {
        id: "rp2",
        at: isoAgo(60 * 10 - 20),
        from: "mentor",
        text: "Stoked it helped! 👏",
        status: "read",
      },
    ],
    lastAt: isoAgo(60 * 10 - 20),
  },
  {
    id: "r4",
    reviewer: "Mason",
    rating: 3,
    title: "Good, could be faster",
    text: "Useful, but we spent too long on setup. Next time jump to campaign structure sooner.",
    tags: ["growth", "ads"],
    createdAt: isoAgo(60 * 50),
    sessionType: "1:1 · 45m",
    status: "pending",
    featured: false,
    hasMedia: false,
    replies: [],
    lastAt: isoAgo(60 * 50),
  },
  {
    id: "r5",
    reviewer: "Kelechi",
    rating: 5,
    title: "Actionable and friendly",
    text: "Clear steps, new perspective. Already shipped 2 items from the list.",
    tags: ["career", "planning"],
    createdAt: isoAgo(60 * 3),
    sessionType: "1:1 · 30m",
    status: "published",
    featured: false,
    hasMedia: false,
    replies: [],
    lastAt: isoAgo(60 * 3),
  },
  {
    id: "r6",
    reviewer: "Olivia",
    rating: 2,
    title: "Not a fit",
    text: "Expectations mismatch for ML roadmap. Refunding would be fair.",
    tags: ["ml", "career"],
    createdAt: isoAgo(60 * 70),
    sessionType: "1:1 · 60m",
    status: "flagged",
    featured: false,
    hasMedia: false,
    replies: [
      {
        id: "rp3",
        at: isoAgo(60 * 65),
        from: "mentor",
        text: "Sorry about this—DMing to resolve.",
        status: "delivered",
      },
    ],
    lastAt: isoAgo(60 * 65),
  },
  {
    id: "r7",
    reviewer: "Noah",
    rating: 4,
    title: "Booking handoff was smooth",
    text: "Loved the reminders + doc template. Great value.",
    tags: ["ops"],
    createdAt: isoAgo(60 * 4),
    sessionType: "1:1 · 30m",
    status: "published",
    featured: false,
    hasMedia: true,
    replies: [],
    lastAt: isoAgo(60 * 4),
  },
  {
    id: "r8",
    reviewer: "Mina",
    rating: 1,
    title: "Audio issues",
    text: "We had connection problems for half the time.",
    tags: ["support"],
    createdAt: isoAgo(60 * 90),
    sessionType: "1:1 · 30m",
    status: "archived",
    featured: false,
    hasMedia: false,
    replies: [],
    lastAt: isoAgo(60 * 90),
  },
  {
    id: "r9",
    reviewer: "Arjun",
    rating: 5,
    title: "Perfect for interviews",
    text: "Mock went great; feedback was dense and honest.",
    tags: ["interview", "frontend"],
    createdAt: isoAgo(60 * 7),
    sessionType: "1:1 · 60m",
    status: "published",
    featured: true,
    hasMedia: false,
    replies: [
      {
        id: "rp4",
        at: isoAgo(60 * 7 - 10),
        from: "mentor",
        text: "You’ll crush the onsite 💪",
        status: "read",
      },
    ],
    lastAt: isoAgo(60 * 7 - 10),
  },
  {
    id: "r10",
    reviewer: "Sofia",
    rating: 4,
    title: "Clear roadmap",
    text: "We mapped the next 6 weeks and milestones.",
    tags: ["planning", "career"],
    createdAt: isoAgo(60 * 14),
    sessionType: "1:1 · 45m",
    status: "resolved",
    featured: false,
    hasMedia: false,
    replies: [
      {
        id: "rp5",
        at: isoAgo(60 * 13),
        from: "mentor",
        text: "Rooting for you!",
        status: "read",
      },
    ],
    lastAt: isoAgo(60 * 13),
  },
];

/* ---------------------------
   Helpers
---------------------------- */
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

const perPage = 8;
const repliesPageSize = 10;

/* ---------------------------
   Component
---------------------------- */
const Reviews: React.FC = () => {
  const [reviews, setReviews] = React.useState<Review[]>(
    () =>
      JSON.parse(localStorage.getItem("mentora.reviews") || "null") ??
      DUMMY_REVIEWS
  );
  React.useEffect(() => {
    localStorage.setItem("mentora.reviews", JSON.stringify(reviews));
  }, [reviews]);

  const [activeId, setActiveId] = React.useState<string>(reviews[0]?.id ?? "");

  // < lg: show list OR detail
  const [isNarrow, setIsNarrow] = React.useState<boolean>(() =>
    typeof window !== "undefined" ? window.innerWidth < 1500 : true
  );
  const [showDetailMobile, setShowDetailMobile] =
    React.useState<boolean>(false);
  React.useEffect(() => {
    const onResize = () => setIsNarrow(window.innerWidth < 1500);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  React.useEffect(() => {
    if (!isNarrow) setShowDetailMobile(false);
  }, [isNarrow]);

  // Filters / search / sort
  const [query, setQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<"all" | ReviewStatus>(
    "all"
  );
  const [ratingFilter, setRatingFilter] = React.useState<
    "all" | "5" | "4plus" | "3plus" | "below3"
  >("all");
  const [withMedia, setWithMedia] = React.useState<"all" | "yes" | "no">("all");
  const [hasReply, setHasReply] = React.useState<"all" | "yes" | "no">("all");
  const [dateFrom, setDateFrom] = React.useState<string>("");
  const [dateTo, setDateTo] = React.useState<string>("");
  const [sortMode, setSortMode] = React.useState<
    "recent" | "ratingHigh" | "ratingLow" | "flaggedFirst" | "featuredFirst"
  >("recent");

  // Paging
  const [page, setPage] = React.useState(1);
  const totalFiltered = React.useMemo(() => {
    return filterReviews(reviews, {
      query,
      statusFilter,
      ratingFilter,
      withMedia,
      hasReply,
      dateFrom,
      dateTo,
      sortMode,
    }).length;
  }, [
    reviews,
    query,
    statusFilter,
    ratingFilter,
    withMedia,
    hasReply,
    dateFrom,
    dateTo,
    sortMode,
  ]);
  const totalPages = Math.max(1, Math.ceil(totalFiltered / perPage));
  const filteredPaged = React.useMemo(() => {
    const all = filterReviews(reviews, {
      query,
      statusFilter,
      ratingFilter,
      withMedia,
      hasReply,
      dateFrom,
      dateTo,
      sortMode,
    });
    const start = (page - 1) * perPage;
    return all.slice(start, start + perPage);
  }, [
    reviews,
    query,
    statusFilter,
    ratingFilter,
    withMedia,
    hasReply,
    dateFrom,
    dateTo,
    sortMode,
    page,
  ]);
  React.useEffect(
    () => setPage(1),
    [
      query,
      statusFilter,
      ratingFilter,
      withMedia,
      hasReply,
      dateFrom,
      dateTo,
      sortMode,
    ]
  );

  // Active review
  const active = React.useMemo(
    () => reviews.find((r) => r.id === activeId) ?? null,
    [reviews, activeId]
  );

  // Reply pagination per review
  const [visibleRepliesById, setVisibleRepliesById] = React.useState<
    Record<string, number>
  >({});
  const visibleReplies = active
    ? visibleRepliesById[active.id] ?? repliesPageSize
    : repliesPageSize;
  const setVisibleReplies = (rid: string, n: number) =>
    setVisibleRepliesById((p) => ({
      ...p,
      [rid]: Math.max(repliesPageSize, n),
    }));
  React.useEffect(() => {
    if (!active) return;
    if (visibleRepliesById[active.id] == null)
      setVisibleReplies(active.id, repliesPageSize);
  }, [active]); // eslint-disable-line

  // Selection for bulk
  const [selected, setSelected] = React.useState<Record<string, boolean>>({});
  const selectedIds = React.useMemo(
    () => Object.keys(selected).filter((k) => selected[k]),
    [selected]
  );
  const clearSelection = () => setSelected({});

  // Compose reply
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  React.useEffect(
    () => inputRef.current?.focus(),
    [activeId, showDetailMobile]
  );
  const [draft, setDraft] = React.useState("");
  const onSend = () => {
    const text = draft.trim();
    if (!text || !active) return;
    const reply: ReviewReply = {
      id: "rp" + Math.random().toString(36).slice(2),
      at: nowIso(),
      from: "mentor",
      text,
      status: "sent",
    };
    setReviews((prev) =>
      prev.map((r) =>
        r.id === active.id
          ? { ...r, lastAt: reply.at, replies: [...r.replies, reply] }
          : r
      )
    );
    setDraft("");
    // simulate delivery/read
    setTimeout(() => {
      setReviews((prev) =>
        prev.map((r) =>
          r.id === active.id
            ? {
                ...r,
                replies: r.replies.map((m) =>
                  m.id === reply.id ? { ...m, status: "delivered" } : m
                ),
              }
            : r
        )
      );
      setTimeout(() => {
        setReviews((prev) =>
          prev.map((r) =>
            r.id === active.id
              ? {
                  ...r,
                  replies: r.replies.map((m) =>
                    m.id === reply.id ? { ...m, status: "read" } : m
                  ),
                }
              : r
          )
        );
      }, 600);
    }, 400);
  };

  // Actions + modal
  const [actionsFor, setActionsFor] = React.useState<string | null>(null);
  const toggleFeatured = (rid: string) =>
    setReviews((prev) =>
      prev.map((r) => (r.id === rid ? { ...r, featured: !r.featured } : r))
    );
  const toggleArchive = (rid: string) =>
    setReviews((prev) =>
      prev.map((r) =>
        r.id === rid
          ? { ...r, status: r.status === "archived" ? "published" : "archived" }
          : r
      )
    );
  const toggleFlag = (rid: string) =>
    setReviews((prev) =>
      prev.map((r) =>
        r.id === rid
          ? { ...r, status: r.status === "flagged" ? "published" : "flagged" }
          : r
      )
    );
  const toggleResolved = (rid: string) =>
    setReviews((prev) =>
      prev.map((r) =>
        r.id === rid
          ? { ...r, status: r.status === "resolved" ? "published" : "resolved" }
          : r
      )
    );
  const deleteReview = (rid: string) =>
    setReviews((prev) => prev.filter((r) => r.id !== rid));

  const bulkArchive = () => {
    if (selectedIds.length === 0) return;
    setReviews((prev) =>
      prev.map((r) =>
        selectedIds.includes(r.id) ? { ...r, status: "archived" } : r
      )
    );
    clearSelection();
  };
  const bulkDelete = () => {
    if (selectedIds.length === 0) return;
    if (
      !window.confirm(
        `Delete ${selectedIds.length} review(s)? This cannot be undone.`
      )
    )
      return;
    setReviews((prev) => prev.filter((r) => !selectedIds.includes(r.id)));
    clearSelection();
    if (selectedIds.includes(activeId)) {
      setActiveId((prev) => {
        const remaining = reviews.filter((r) => !selectedIds.includes(r.id));
        return remaining[0]?.id ?? "";
      });
    }
  };

  return (
    <MentorAppLayout>
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-[#0F132E] dark:text-[#E9ECFF]">
              Reviews
            </h1>
            <p className="text-sm text-[#5E66A6] dark:text-[#A7B0FF]/85">
              Manage feedback, reply publicly, and feature your best work.
            </p>
          </div>
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

        {/* Filters / Search */}
        {(!isNarrow || (isNarrow && !showDetailMobile)) && (
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
                placeholder="Search reviewer, title, text… (⌘/Ctrl+K)"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
                    (e.target as HTMLInputElement).select();
                  }
                }}
              />
            </div>

            {/* Filter rail */}
            <div
              className={`flex items-center gap-2 ${card} h-11 px-3 flex-wrap`}
            >
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
                <option value="published">Published</option>
                <option value="pending">Pending</option>
                <option value="flagged">Flagged</option>
                <option value="resolved">Resolved</option>
                <option value="archived">Archived</option>
              </select>
              <span className="h-4 w-px bg-[#E7E9FF] dark:bg-[#2B2F55]" />
              <select
                className="bg-transparent text-sm outline-none"
                value={ratingFilter}
                onChange={(e) => setRatingFilter(e.target.value as any)}
              >
                <option value="all">Rating: All</option>
                <option value="5">Only 5★</option>
                <option value="4plus">≥ 4★</option>
                <option value="3plus">≥ 3★</option>
                <option value="below3">Below 3★</option>
              </select>
              <span className="h-4 w-px bg-[#E7E9FF] dark:bg-[#2B2F55]" />
              <select
                className="bg-transparent text-sm outline-none"
                value={withMedia}
                onChange={(e) => setWithMedia(e.target.value as any)}
              >
                <option value="all">Media: Any</option>
                <option value="yes">With media</option>
                <option value="no">No media</option>
              </select>
              <span className="h-4 w-px bg-[#E7E9FF] dark:bg-[#2B2F55]" />
              <select
                className="bg-transparent text-sm outline-none"
                value={hasReply}
                onChange={(e) => setHasReply(e.target.value as any)}
              >
                <option value="all">Replies: Any</option>
                <option value="yes">Has reply</option>
                <option value="no">No reply</option>
              </select>
              <span className="h-4 w-px bg-[#E7E9FF] dark:bg-[#2B2F55]" />
              <input
                type="date"
                className="bg-transparent text-sm outline-none"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                aria-label="From date"
              />
              <span className="text-[#6B72B3] dark:text-[#A7B0FF]/80 text-xs">
                →
              </span>
              <input
                type="date"
                className="bg-transparent text-sm outline-none"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                aria-label="To date"
              />
              <span className="h-4 w-px bg-[#E7E9FF] dark:bg-[#2B2F55]" />
              <select
                className="bg-transparent text-sm outline-none"
                value={sortMode}
                onChange={(e) => setSortMode(e.target.value as any)}
              >
                <option value="recent">Sort: Recent</option>
                <option value="ratingHigh">Rating: High → Low</option>
                <option value="ratingLow">Rating: Low → High</option>
                <option value="flaggedFirst">Flagged first</option>
                <option value="featuredFirst">Featured first</option>
              </select>
            </div>
          </div>
        )}

        {/* Desktop: side-by-side; Mobile: list OR detail */}
        {!isNarrow ? (
          <div className="mt-4 grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* List */}
            <div className={`lg:col-span-5 ${card}`}>
              <ListPanel
                items={filteredPaged}
                selected={selected}
                setSelected={setSelected}
                totalFiltered={totalFiltered}
                page={page}
                setPage={setPage}
                totalPages={totalPages}
                onOpen={(id) => setActiveId(id)}
                onMore={(id) => setActionsFor(id)}
              />
            </div>

            {/* Detail + Discussion */}
            <div
              className={`lg:col-span-7 ${card} flex flex-col min-h-[560px]`}
            >
              <DetailPanel
                review={active}
                visibleReplies={visibleReplies}
                onLoadOlder={() =>
                  active &&
                  setVisibleReplies(active.id, visibleReplies + repliesPageSize)
                }
                draft={draft}
                setDraft={setDraft}
                inputRef={inputRef}
                onSend={onSend}
                onActions={() => active && setActionsFor(active.id)}
              />
            </div>
          </div>
        ) : (
          <div className="mt-4">
            {!showDetailMobile ? (
              <div className={`${card}`}>
                <ListPanel
                  items={filteredPaged}
                  selected={selected}
                  setSelected={setSelected}
                  totalFiltered={totalFiltered}
                  page={page}
                  setPage={setPage}
                  totalPages={totalPages}
                  onOpen={(id) => {
                    setActiveId(id);
                    setShowDetailMobile(true);
                  }}
                  onMore={(id) => setActionsFor(id)}
                />
              </div>
            ) : (
              <div className={`${card} flex flex-col min-h-[560px]`}>
                <DetailPanel
                  review={active}
                  visibleReplies={visibleReplies}
                  onLoadOlder={() =>
                    active &&
                    setVisibleReplies(
                      active.id,
                      visibleReplies + repliesPageSize
                    )
                  }
                  draft={draft}
                  setDraft={setDraft}
                  inputRef={inputRef}
                  onSend={onSend}
                  backTitle="Back"
                  onBack={() => setShowDetailMobile(false)}
                  onActions={() => active && setActionsFor(active.id)}
                />
              </div>
            )}
          </div>
        )}

        {/* Actions Modal */}
        {actionsFor && (
          <ActionsModal
            review={reviews.find((r) => r.id === actionsFor)!}
            onClose={() => setActionsFor(null)}
            onFeature={() => {
              toggleFeatured(actionsFor);
              setActionsFor(null);
            }}
            onArchive={() => {
              toggleArchive(actionsFor);
              setActionsFor(null);
            }}
            onFlag={() => {
              toggleFlag(actionsFor);
              setActionsFor(null);
            }}
            onResolve={() => {
              toggleResolved(actionsFor);
              setActionsFor(null);
            }}
            onDelete={() => {
              if (window.confirm("Delete review?")) deleteReview(actionsFor);
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
  items,
  selected,
  setSelected,
  totalFiltered,
  page,
  setPage,
  totalPages,
  onOpen,
  onMore,
}: {
  items: Review[];
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
          All reviews
        </div>
        <span className={`${pill} text-[#6065A6] dark:text-[#A7B0FF]/80`}>
          <MessageSquare size={14} /> {totalFiltered} found
        </span>
      </div>

      <div className="divide-y divide-[#E7E9FF] dark:divide-[#2B2F55]">
        {items.map((r) => (
          <div
            key={r.id}
            className="p-3 hover:bg-white/70 dark:hover:bg-white/[0.06] transition"
          >
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                className="mt-1 accent-[#6366F1]"
                checked={!!selected[r.id]}
                onChange={(e) =>
                  setSelected((p) => ({ ...p, [r.id]: e.target.checked }))
                }
                aria-label="Select"
              />

              <button
                className="flex-1 text-left min-w-0"
                onClick={() => onOpen(r.id)}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <Avatar name={r.reviewer} isGroup={r.isTeam} />
                    <div className="font-semibold text-sm text-[#0F1536] dark:text-[#E7E9FF] truncate">
                      {r.reviewer}
                    </div>
                    {r.featured && (
                      <Pin
                        size={14}
                        className="text-indigo-500"
                        title="Featured"
                      />
                    )}
                    {r.status === "flagged" && (
                      <Flag
                        size={14}
                        className="text-amber-500"
                        title="Flagged"
                      />
                    )}
                    {r.status === "archived" && (
                      <Archive
                        size={14}
                        className="text-[#7A81B4]"
                        title="Archived"
                      />
                    )}
                  </div>
                  <div className="text-[11px] text-[#6B72B3] dark:text-[#A7B0FF]/80 shrink-0">
                    {rel(r.createdAt)}
                  </div>
                </div>

                <div className="mt-1 flex items-center gap-1">
                  <Stars rating={r.rating} />
                  <div className="text-[12px] text-[#5E66A6] dark:text-[#A7B0FF]/80 truncate ml-2">
                    {r.title}
                  </div>
                </div>

                <div className="mt-1 text-[12px] text-[#5E66A6] dark:text-[#A7B0FF]/80 line-clamp-2">
                  {r.text}
                </div>

                <div className="mt-2 flex flex-wrap items-center gap-1">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#EEF2FF] dark:bg-white/[0.06] text-[#1B1F3A] dark:text-[#E6E9FF] border border-[#E7E9FF] dark:border-[#2B2F55]">
                    {r.sessionType}
                  </span>
                  {r.tags.map((t) => (
                    <span
                      key={t}
                      className="text-[10px] px-2 py-0.5 rounded-full bg-[#EEF2FF] dark:bg-white/[0.06] text-[#1B1F3A] dark:text-[#E6E9FF] border border-[#E7E9FF] dark:border-[#2B2F55]"
                    >
                      #{t}
                    </span>
                  ))}
                  {r.hasMedia && (
                    <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-[#E7E9FF]/60 dark:bg-white/[0.06] text-[#1B1F3A] dark:text-[#E6E9FF] border border-[#E7E9FF] dark:border-[#2B2F55]">
                      <ImageIcon size={12} /> media
                    </span>
                  )}
                </div>
              </button>

              <div className="shrink-0">
                <button
                  className={`${btnBase} ${btnGhost} px-2 py-1`}
                  onClick={() => onMore(r.id)}
                  aria-label="More"
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

function DetailPanel({
  review,
  visibleReplies,
  onLoadOlder,
  draft,
  setDraft,
  inputRef,
  onSend,
  onActions,
  backTitle,
  onBack,
}: {
  review: Review | null;
  visibleReplies: number;
  onLoadOlder: () => void;
  draft: string;
  setDraft: (v: string) => void;
  inputRef: React.RefObject<HTMLInputElement>;
  onSend: () => void;
  onActions: () => void;
  backTitle?: string;
  onBack?: () => void;
}) {
  if (!review) {
    return (
      <div className="flex flex-1 items-center justify-center text-sm text-[#6B72B3] dark:text-[#A7B0FF]/80">
        Select a review.
      </div>
    );
  }

  const canLoadOlder = review.replies.length > visibleReplies;
  return (
    <>
      {/* Header */}
      <div className="p-3 flex flex-wrap items-center justify-between gap-3 border-b border-[#E7E9FF] dark:border-[#2B2F55]">
        <div className="flex items-center gap-2 min-w-0">
          {onBack && (
            <button className={`${btnBase} ${btnGhost}`} onClick={onBack}>
              <ChevronLeft size={16} /> {backTitle || "Back"}
            </button>
          )}
          <Avatar name={review.reviewer} isGroup={review.isTeam} />
          <div className="min-w-0">
            <div className="text-sm font-semibold text-[#0F1536] dark:text-[#E7E9FF] truncate">
              {review.reviewer}
            </div>
            <div className="text-[11px] text-[#6B72B3] dark:text-[#A7B0FF]/80 flex items-center gap-2">
              <Clock size={12} /> {fmtDay(review.createdAt)}{" "}
              {fmtTime(review.createdAt)} · {review.sessionType}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status={review.status} />
          <button
            className={`${btnBase} ${btnGhost}`}
            onClick={onActions}
            aria-label="Review actions"
          >
            <MoreVertical size={16} />
          </button>
        </div>
      </div>

      {/* Review body */}
      <div className="p-4">
        <div className="flex flex-wrap items-center gap-2">
          <Stars rating={review.rating} />
          <div className="text-sm font-semibold text-[#0F1536] dark:text-[#E7E9FF]">
            {review.title}
          </div>
          {review.featured && (
            <span
              className={`${pill} !py-0.5 text-indigo-600 dark:text-indigo-300`}
            >
              <Pin size={14} /> Featured
            </span>
          )}
        </div>
        <p className="mt-2 text-sm text-[#1B1F3A] dark:text-[#E6E9FF]/90">
          {review.text}
        </p>

        <div className="mt-3 flex flex-wrap items-center gap-1">
          {review.tags.map((t) => (
            <span
              key={t}
              className="text-[10px] px-2 py-0.5 rounded-full bg-[#EEF2FF] dark:bg-white/[0.06] text-[#1B1F3A] dark:text-[#E6E9FF] border border-[#E7E9FF] dark:border-[#2B2F55]"
            >
              #{t}
            </span>
          ))}
          {review.hasMedia && (
            <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-[#E7E9FF]/60 dark:bg-white/[0.06] text-[#1B1F3A] dark:text-[#E6E9FF] border border-[#E7E9FF] dark:border-[#2B2F55]">
              <ImageIcon size={12} /> media included
            </span>
          )}
        </div>
      </div>

      {/* Discussion thread */}
      <div className="px-4 pt-2 pb-3 text-xs text-[#6B72B3] dark:text-[#A7B0FF]/80">
        Public replies
      </div>
      <div className="flex-1 overflow-auto px-4 pb-2 space-y-6">
        {canLoadOlder && (
          <div className="flex justify-center">
            <button className={`${btnBase} ${btnGhost}`} onClick={onLoadOlder}>
              Load older
            </button>
          </div>
        )}
        {review.replies.slice(-visibleReplies).map((msg) => {
          const mine = msg.from === "mentor";
          return (
            <div
              key={msg.id}
              className={`flex ${mine ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] sm:max-w-[70%] rounded-2xl px-4 py-2 border ${
                  mine
                    ? "border-[#E7E9FF] dark:bg-white/[0.08] dark:border-[#2B2F55]"
                    : "bg-white/70 border-[#E7E9FF] dark:bg-white/[0.05] dark:border-[#2B2F55]"
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
                  {mine && <CheckStatus status={msg.status ?? "read"} />}
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
            placeholder="Write a public reply…"
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
            <Send size={16} /> Reply
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
  review,
  onClose,
  onFeature,
  onArchive,
  onFlag,
  onResolve,
  onDelete,
}: {
  review: Review;
  onClose: () => void;
  onFeature: () => void;
  onArchive: () => void;
  onFlag: () => void;
  onResolve: () => void;
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
          <Avatar name={review.reviewer} isGroup={review.isTeam} />
          <div className="min-w-0">
            <div className="text-sm font-semibold text-[#0F1536] dark:text-[#E7E9FF] truncate">
              {review.reviewer}
            </div>
            <div className="text-[11px] text-[#6B72B3] dark:text-[#A7B0FF]/80">
              Review actions
            </div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <button className={`${btnBase} ${btnGhost}`} onClick={onFeature}>
            {review.featured ? <Pin size={16} /> : <PinOff size={16} />}{" "}
            {review.featured ? "Unfeature" : "Feature"}
          </button>
          <button className={`${btnBase} ${btnGhost}`} onClick={onArchive}>
            {review.status === "archived" ? (
              <ArchiveRestore size={16} />
            ) : (
              <Archive size={16} />
            )}{" "}
            {review.status === "archived" ? "Unarchive" : "Archive"}
          </button>
          <button className={`${btnBase} ${btnGhost}`} onClick={onFlag}>
            {review.status === "flagged" ? (
              <FlagOff size={16} />
            ) : (
              <Flag size={16} />
            )}{" "}
            {review.status === "flagged" ? "Unflag" : "Flag"}
          </button>
          <button className={`${btnBase} ${btnGhost}`} onClick={onResolve}>
            <CheckCircle2 size={16} />{" "}
            {review.status === "resolved" ? "Unresolve" : "Mark resolved"}
          </button>
          <button
            className={`${btnBase} ${btnGhost} col-span-2 !text-rose-600 dark:!text-rose-400`}
            onClick={onDelete}
          >
            <Trash2 size={16} /> Delete review
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

function Stars({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);
  return (
    <div className="flex items-center">
      {Array.from({ length: full }).map((_, i) => (
        <Star
          key={"f" + i}
          size={14}
          className="fill-[#F59E0B] text-[#F59E0B]"
        />
      ))}
      {half && <StarHalf size={14} className="fill-[#F59E0B] text-[#F59E0B]" />}
      {Array.from({ length: empty }).map((_, i) => (
        <Star key={"e" + i} size={14} className="text-[#D6DAFF]" />
      ))}
    </div>
  );
}

function StatusBadge({ status }: { status: ReviewStatus }) {
  const map: Record<ReviewStatus, { text: string; cls: string }> = {
    published: {
      text: "Published",
      cls: "text-emerald-700 bg-emerald-50 border-emerald-100 dark:text-emerald-300/90 dark:bg-emerald-900/20 dark:border-emerald-900/30",
    },
    pending: {
      text: "Pending",
      cls: "text-amber-700 bg-amber-50 border-amber-100 dark:text-amber-300/90 dark:bg-amber-900/20 dark:border-amber-900/30",
    },
    flagged: {
      text: "Flagged",
      cls: "text-rose-700 bg-rose-50 border-rose-100 dark:text-rose-300/90 dark:bg-rose-900/20 dark:border-rose-900/30",
    },
    resolved: {
      text: "Resolved",
      cls: "text-sky-700 bg-sky-50 border-sky-100 dark:text-sky-300/90 dark:bg-sky-900/20 dark:border-sky-900/30",
    },
    archived: {
      text: "Archived",
      cls: "text-[#6065A6] bg-[#EEF2FF] border-[#E7E9FF] dark:text-[#A7B0FF]/90 dark:bg-white/[0.06] dark:border-[#2B2F55]",
    },
  };
  const item = map[status];
  return (
    <span
      className={`text-[11px] rounded-full px-2.5 py-0.5 border ${item.cls}`}
    >
      {item.text}
    </span>
  );
}

function CheckStatus({ status }: { status: "sent" | "delivered" | "read" }) {
  if (status === "read")
    return <CheckCheck size={14} className="text-indigo-500" title="Read" />;
  if (status === "delivered")
    return (
      <CheckCheck size={14} className="text-[#7A81B4]" title="Delivered" />
    );
  return <CheckCheck size={14} className="text-[#A7A9C2]" title="Sent" />;
}

/* ---------------------------
   Filtering
---------------------------- */
function filterReviews(
  list: Review[],
  opts: {
    query: string;
    statusFilter: "all" | ReviewStatus;
    ratingFilter: "all" | "5" | "4plus" | "3plus" | "below3";
    withMedia: "all" | "yes" | "no";
    hasReply: "all" | "yes" | "no";
    dateFrom: string;
    dateTo: string;
    sortMode:
      | "recent"
      | "ratingHigh"
      | "ratingLow"
      | "flaggedFirst"
      | "featuredFirst";
  }
) {
  const q = opts.query.trim().toLowerCase();
  const from = opts.dateFrom ? new Date(opts.dateFrom).getTime() : null;
  const to = opts.dateTo ? new Date(opts.dateTo).getTime() : null;

  let out = list.filter((r) => {
    if (opts.statusFilter !== "all" && r.status !== opts.statusFilter)
      return false;

    if (opts.ratingFilter !== "all") {
      const v = r.rating;
      if (opts.ratingFilter === "5" && v !== 5) return false;
      if (opts.ratingFilter === "4plus" && v < 4) return false;
      if (opts.ratingFilter === "3plus" && v < 3) return false;
      if (opts.ratingFilter === "below3" && v >= 3) return false;
    }

    if (opts.withMedia !== "all") {
      if (opts.withMedia === "yes" && !r.hasMedia) return false;
      if (opts.withMedia === "no" && r.hasMedia) return false;
    }

    if (opts.hasReply !== "all") {
      const any = r.replies.length > 0;
      if (opts.hasReply === "yes" && !any) return false;
      if (opts.hasReply === "no" && any) return false;
    }

    if (from && new Date(r.createdAt).getTime() < from) return false;
    if (to && new Date(r.createdAt).getTime() > to) return false;

    if (q) {
      const hay = `${r.reviewer} ${r.title} ${r.text} ${r.tags.join(
        " "
      )} ${r.replies.map((m) => m.text ?? "").join(" ")}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });

  // Sorts
  if (opts.sortMode === "recent") {
    out.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
  } else if (opts.sortMode === "ratingHigh") {
    out.sort(
      (a, b) =>
        b.rating - a.rating || +new Date(b.createdAt) - +new Date(a.createdAt)
    );
  } else if (opts.sortMode === "ratingLow") {
    out.sort(
      (a, b) =>
        a.rating - b.rating || +new Date(b.createdAt) - +new Date(a.createdAt)
    );
  } else if (opts.sortMode === "flaggedFirst") {
    out
      .sort(
        (a, b) =>
          (b.status === "flagged" ? 1 : 0) - (a.status === "flagged" ? 1 : 0)
      )
      .reverse();
  } else if (opts.sortMode === "featuredFirst") {
    out.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0)).reverse();
  }

  return out;
}

export default Reviews;
