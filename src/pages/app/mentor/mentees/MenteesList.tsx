import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Users2, Star, MessageSquare, MoreHorizontal, Search, Filter, Plus, X, CheckCircle2, Clock4 } from "lucide-react";
import MentorAppLayout from "../MentorAppLayout";

// --- Brand tokens (align with your COLORPALLETE) ---
const gradientBrand = "bg-gradient-to-r from-[#3B82F6] via-[#6366F1] to-[#8B5CF6]";
const ringBrand = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#8B5CF6]/40";
const surface = "bg-[#F9FAFB] dark:bg-[#0A0A0A]";
const textPrimary = "text-[#312E81] dark:text-[#E0E7FF]";

// --- Types ---
type Mentee = {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    skills: string[];
    timezone: string;
    plan: "Free" | "Pro" | "Team";
    status: "active" | "paused" | "banned";
    rating: number; // 0..5
    sessions: number;
    joined: string; // iso
};

// --- Dummy Data ---
const seed: Mentee[] = [
    {
        id: "mn_1001",
        name: "Ugo N.",
        email: "ugo@example.com",
        skills: ["React", "TypeScript", "UI"],
        timezone: "GMT+1",
        plan: "Pro",
        status: "active",
        rating: 4.8,
        sessions: 23,
        joined: "2025-07-04",
    },
    {
        id: "mn_1002",
        name: "Ife A.",
        email: "ife@example.com",
        skills: ["Python", "Data", "SQL"],
        timezone: "GMT+1",
        plan: "Free",
        status: "active",
        rating: 4.4,
        sessions: 9,
        joined: "2025-06-11",
    },
    {
        id: "mn_1003",
        name: "Chinedu O.",
        email: "chinedu@example.com",
        skills: ["DevOps", "AWS"],
        timezone: "GMT+3",
        plan: "Team",
        status: "paused",
        rating: 4.6,
        sessions: 31,
        joined: "2025-05-02",
    },
    {
        id: "mn_1004",
        name: "Tomi L.",
        email: "tomi@example.com",
        skills: ["Design", "Figma"],
        timezone: "GMT",
        plan: "Pro",
        status: "active",
        rating: 4.9,
        sessions: 44,
        joined: "2025-04-20",
    },
    {
        id: "mn_1005",
        name: "Sara K.",
        email: "sara@example.com",
        skills: ["Go", "APIs"],
        timezone: "GMT+1",
        plan: "Free",
        status: "active",
        rating: 4.1,
        sessions: 6,
        joined: "2025-06-28",
    },
    {
        id: "mn_1006",
        name: "Rafi M.",
        email: "rafi@example.com",
        skills: ["Next.js", "Auth"],
        timezone: "GMT+2",
        plan: "Team",
        status: "active",
        rating: 4.7,
        sessions: 28,
        joined: "2025-01-12",
    },
    {
        id: "mn_1007",
        name: "Zara A.",
        email: "zara@example.com",
        skills: ["iOS", "Swift"],
        timezone: "GMT+4",
        plan: "Pro",
        status: "active",
        rating: 4.5,
        sessions: 18,
        joined: "2025-03-15",
    },
    {
        id: "mn_1008",
        name: "Kelechi D.",
        email: "kelechi@example.com",
        skills: ["Security", "KYC"],
        timezone: "GMT",
        plan: "Team",
        status: "banned",
        rating: 3.2,
        sessions: 2,
        joined: "2025-02-07",
    },
    // add a few more for pagination feel
    {
        id: "mn_1009",
        name: "Mason K.",
        email: "mason@example.com",
        skills: ["Growth", "Analytics"],
        timezone: "GMT-1",
        plan: "Pro",
        status: "active",
        rating: 4.6,
        sessions: 21,
        joined: "2025-06-05",
    },
    {
        id: "mn_1010",
        name: "Ada F.",
        email: "ada@example.com",
        skills: ["Frontend", "Testing"],
        timezone: "GMT+1",
        plan: "Team",
        status: "active",
        rating: 4.9,
        sessions: 52,
        joined: "2025-05-18",
    },
    {
        id: "mn_1011",
        name: "Noah P.",
        email: "noah@example.com",
        skills: ["Android", "Kotlin"],
        timezone: "GMT+3",
        plan: "Free",
        status: "paused",
        rating: 4.0,
        sessions: 4,
        joined: "2025-07-14",
    },
    {
        id: "mn_1012",
        name: "Riya S.",
        email: "riya@example.com",
        skills: ["Product", "Roadmaps"],
        timezone: "GMT+5",
        plan: "Pro",
        status: "active",
        rating: 4.7,
        sessions: 35,
        joined: "2025-08-01",
    },
];

// --- Small UI atoms ---
const Badge = ({ children, className = "" }: any) => <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs ${className}`}>{children}</span>;
const Card = ({ children }: { children: React.ReactNode }) => <div className="rounded-2xl border border-zinc-200/70 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/40 p-5 backdrop-blur">{children}</div>;

function Avatar({ name }: { name: string }) {
    const initials = name
        .split(" ")
        .map((p) => p[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();
    return <div className={`h-12 w-12 rounded-xl text-white ${gradientBrand} grid place-items-center font-semibold`}>{initials}</div>;
}

function Pagination({ page, pages, onPage }: { page: number; pages: number; onPage: (p: number) => void }) {
    if (pages <= 1) return null;
    const items = Array.from({ length: pages }, (_, i) => i + 1);
    return (
        <div className="mt-6 flex flex-wrap items-center gap-2">
            <button disabled={page === 1} onClick={() => onPage(page - 1)} className={`rounded-xl border px-3 py-1.5 text-sm ${ringBrand} border-zinc-200 dark:border-zinc-800 disabled:opacity-40`}>
                Prev
            </button>
            {items.map((n) => (
                <button key={n} onClick={() => onPage(n)} className={`rounded-xl px-3 py-1.5 text-sm border ${n === page ? "text-white " + gradientBrand + " border-transparent" : "border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900"}`}>
                    {n}
                </button>
            ))}
            <button disabled={page === pages} onClick={() => onPage(page + 1)} className={`rounded-xl border px-3 py-1.5 text-sm ${ringBrand} border-zinc-200 dark:border-zinc-800 disabled:opacity-40`}>
                Next
            </button>
        </div>
    );
}

const CreateMenteeModal: React.FC<{
    open: boolean;
    onClose: () => void;
    onCreate: (payload: Partial<Mentee>) => Promise<void>;
    busy?: boolean;
}> = ({ open, onClose, onCreate, busy }) => {
    const [form, setForm] = React.useState<Partial<Mentee>>({
        name: "",
        email: "",
        plan: "Free",
        status: "active",
        timezone: "GMT+1",
        skills: [],
    });

    if (!open) return null;

    const set = (k: keyof Mentee, v: any) => setForm((f) => ({ ...f, [k]: v }));

    return (
        <div className="fixed inset-0 z-50 bg-black/50 grid place-items-center px-4">
            <div className="w-full max-w-lg rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Create Mentee</h3>
                    <button onClick={onClose} className="p-1 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800">
                        <X size={18} />
                    </button>
                </div>

                <div className="mt-4 grid sm:grid-cols-2 gap-3">
                    <div>
                        <label className="text-xs text-zinc-500">Name</label>
                        <input className={`mt-1 w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-2 text-sm ${ringBrand}`} value={form.name || ""} onChange={(e) => set("name", e.target.value)} placeholder="Full name" />
                    </div>
                    <div>
                        <label className="text-xs text-zinc-500">Email</label>
                        <input className={`mt-1 w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-2 text-sm ${ringBrand}`} value={form.email || ""} onChange={(e) => set("email", e.target.value)} placeholder="email@domain.com" />
                    </div>
                    <div>
                        <label className="text-xs text-zinc-500">Plan</label>
                        <select className={`mt-1 w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-2 text-sm ${ringBrand}`} value={form.plan} onChange={(e) => set("plan", e.target.value)}>
                            <option>Free</option>
                            <option>Pro</option>
                            <option>Team</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-xs text-zinc-500">Status</label>
                        <select className={`mt-1 w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-2 text-sm ${ringBrand}`} value={form.status} onChange={(e) => set("status", e.target.value)}>
                            <option>active</option>
                            <option>paused</option>
                            <option>banned</option>
                        </select>
                    </div>
                    <div className="sm:col-span-2">
                        <label className="text-xs text-zinc-500">Skills (comma separated)</label>
                        <input
                            className={`mt-1 w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-2 text-sm ${ringBrand}`}
                            onChange={(e) =>
                                set(
                                    "skills",
                                    e.target.value
                                        .split(",")
                                        .map((s) => s.trim())
                                        .filter(Boolean)
                                )
                            }
                            placeholder="React, SQL, Design"
                        />
                    </div>
                </div>

                <div className="mt-5 flex items-center justify-end gap-2">
                    <button onClick={onClose} className="rounded-xl border border-zinc-200 dark:border-zinc-800 px-4 py-2 text-sm">
                        Cancel
                    </button>
                    <button disabled={!form.name || !form.email || busy} onClick={() => onCreate(form)} className={`rounded-xl px-4 py-2 text-sm text-white ${gradientBrand} disabled:opacity-60`}>
                        {busy ? "Creating…" : "Create"}
                    </button>
                </div>
            </div>
        </div>
    );
};

const MenteeList: React.FC = () => {
    const navigate = useNavigate();
    const [mentees, setMentees] = React.useState<Mentee[]>(seed);
    const [query, setQuery] = React.useState("");
    const [status, setStatus] = React.useState<"all" | Mentee["status"]>("all");
    const [plan, setPlan] = React.useState<"all" | Mentee["plan"]>("all");
    const [minRating, setMinRating] = React.useState<number>(0);
    const [page, setPage] = React.useState(1);
    const [pageSize] = React.useState(8);
    const [open, setOpen] = React.useState(false);
    const [creating, setCreating] = React.useState(false);

    // Filtered
    const filtered = mentees.filter((m) => {
        const q = query.toLowerCase();
        const matchesQ = !q || m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q) || m.skills.some((s) => s.toLowerCase().includes(q));
        const matchesStatus = status === "all" || m.status === status;
        const matchesPlan = plan === "all" || m.plan === plan;
        const matchesRating = (m.rating || 0) >= minRating;
        return matchesQ && matchesStatus && matchesPlan && matchesRating;
    });

    const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
    const pageSlice = filtered.slice((page - 1) * pageSize, page * pageSize);

    React.useEffect(() => {
        setPage(1); // reset page when filters change
    }, [query, status, plan, minRating]);

    // Optimistic creator
    async function handleCreate(payload: Partial<Mentee>) {
        setCreating(true);
        const temp: Mentee = {
            id: "tmp_" + Math.random().toString(36).slice(2, 9),
            name: payload.name || "New Mentee",
            email: payload.email || "unknown@example.com",
            skills: (payload.skills as string[]) || [],
            timezone: payload.timezone || "GMT+1",
            plan: (payload.plan as Mentee["plan"]) || "Free",
            status: (payload.status as Mentee["status"]) || "active",
            rating: 0,
            sessions: 0,
            joined: new Date().toISOString().slice(0, 10),
        };

        setMentees((prev) => [temp, ...prev]); // optimistic add
        setOpen(false);

        try {
            await new Promise((r) => setTimeout(r, 800)); // simulate API
            // pretend server returns a real id
            setMentees((prev) => prev.map((m) => (m.id === temp.id ? { ...m, id: "mn_" + Date.now() } : m)));
        } catch (e) {
            // rollback
            setMentees((prev) => prev.filter((m) => m.id !== temp.id));
            alert("Failed to create mentee. Try again.");
        } finally {
            setCreating(false);
        }
    }

    // Toggle status (optimistic)
    function toggleStatus(id: string) {
        const prev = mentees;
        setMentees((ms) => ms.map((m) => (m.id === id ? { ...m, status: m.status === "active" ? "paused" : "active" } : m)));
        setTimeout(() => {
            // simulate occasional server error (10%)
            if (Math.random() < 0.1) {
                setMentees(prev); // rollback
                alert("Status update failed. Reverted.");
            }
        }, 600);
    }

    return (
        <MentorAppLayout>
            <main className={`${surface} min-h-screen`}>
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <div>
                            <h1 className={`text-2xl sm:text-3xl font-bold tracking-tight ${textPrimary}`}>Mentees</h1>
                            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300/80">Manage your learner base. Search, filter, and create mentees.</p>
                        </div>
                        <button onClick={() => setOpen(true)} className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm text-white ${gradientBrand} ${ringBrand} shadow-sm hover:shadow`}>
                            <Plus size={16} />
                            New Mentee
                        </button>
                    </div>

                    {/* Controls */}
                    <div className="mt-6 flex flex-col lg:flex-row gap-3">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                            <input value={query} onChange={(e) => setQuery(e.target.value)} className={`w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 pl-9 pr-3 py-2 text-sm ${ringBrand}`} placeholder="Search name, email, or skill…" />
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                            <div className="flex items-center gap-2">
                                <Filter size={16} className="text-zinc-500" />
                                <select value={status} onChange={(e) => setStatus(e.target.value as any)} className={`rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-2 text-sm ${ringBrand}`}>
                                    <option value="all">All status</option>
                                    <option value="active">Active</option>
                                    <option value="paused">Paused</option>
                                    <option value="banned">Banned</option>
                                </select>
                                <select value={plan} onChange={(e) => setPlan(e.target.value as any)} className={`rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-2 text-sm ${ringBrand}`}>
                                    <option value="all">All plans</option>
                                    <option value="Free">Free</option>
                                    <option value="Pro">Pro</option>
                                    <option value="Team">Team</option>
                                </select>
                                <select value={minRating} onChange={(e) => setMinRating(Number(e.target.value))} className={`rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-2 text-sm ${ringBrand}`}>
                                    <option value={0}>Any rating</option>
                                    <option value={3}>3.0+</option>
                                    <option value={4}>4.0+</option>
                                    <option value={4.5}>4.5+</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* KPI Summary */}
                    <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <Card>
                            <div className="text-xs text-zinc-500">Total</div>
                            <div className="mt-1 text-lg font-semibold">{mentees.length}</div>
                        </Card>
                        <Card>
                            <div className="text-xs text-zinc-500">Active</div>
                            <div className="mt-1 text-lg font-semibold">{mentees.filter((m) => m.status === "active").length}</div>
                        </Card>
                        <Card>
                            <div className="text-xs text-zinc-500">Avg rating</div>
                            <div className="mt-1 text-lg font-semibold">{(mentees.reduce((a, m) => a + (m.rating || 0), 0) / mentees.length).toFixed(2)}</div>
                        </Card>
                        <Card>
                            <div className="text-xs text-zinc-500">Sessions (30d)</div>
                            <div className="mt-1 text-lg font-semibold">{mentees.reduce((a, m) => a + m.sessions, 0)}</div>
                        </Card>
                    </div>

                    {/* Cards */}
                    <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
                        {pageSlice.map((m) => (
                            <Card key={m.id}>
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex items-center gap-3">
                                        <Avatar name={m.name} />
                                        <div>
                                            <Link to={`/dashboard/mentees/${m.id}`} className="font-semibold hover:underline">
                                                {m.name}
                                            </Link>
                                            <div className="text-xs text-zinc-500">{m.email}</div>
                                        </div>
                                    </div>
                                    <button className="p-1 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800">
                                        <MoreHorizontal size={18} />
                                    </button>
                                </div>

                                <div className="mt-3 flex flex-wrap items-center gap-1">
                                    {m.skills.slice(0, 3).map((s) => (
                                        <Badge key={s} className="bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                                            {s}
                                        </Badge>
                                    ))}
                                </div>

                                <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
                                    <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-2">
                                        <div className="text-zinc-500">Plan</div>
                                        <div className="font-medium">{m.plan}</div>
                                    </div>
                                    <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-2">
                                        <div className="text-zinc-500">Sessions</div>
                                        <div className="font-medium">{m.sessions}</div>
                                    </div>
                                    <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-2">
                                        <div className="text-zinc-500">Rating</div>
                                        <div className="flex items-center gap-1 font-medium">
                                            <Star size={14} className="text-yellow-500" /> {m.rating.toFixed(1)}
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-3 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Badge className={`${m.status === "active" ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300" : m.status === "paused" ? "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300" : "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300"}`}>
                                            <CheckCircle2 size={12} className="mr-1" />
                                            {m.status}
                                        </Badge>
                                        <div className="text-xs text-zinc-500 inline-flex items-center gap-1">
                                            <Clock4 size={12} /> {m.timezone}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button onClick={() => navigate(`/dashboard/mentees/${m.id}`)} className={`rounded-xl px-3 py-1.5 text-xs text-white ${gradientBrand} ${ringBrand}`}>
                                            View
                                        </button>
                                        <button onClick={() => toggleStatus(m.id)} className="rounded-xl px-3 py-1.5 text-xs border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900">
                                            {m.status === "active" ? "Pause" : "Activate"}
                                        </button>
                                        <button className="rounded-xl p-2 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900">
                                            <MessageSquare size={14} />
                                        </button>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>

                    <Pagination page={page} pages={pages} onPage={setPage} />
                </div>
            </main>

            <CreateMenteeModal open={open} onClose={() => setOpen(false)} onCreate={handleCreate} busy={creating} />
        </MentorAppLayout>
    );
};

export default MenteeList;
