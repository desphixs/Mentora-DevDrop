// src/pages/admin/Dashboard.tsx
import React from "react";
import AppLayout from "./AppLayout";
import { Users2, CalendarCheck2, CreditCard, Star, TrendingUp, Bell, ArrowUpRight, ArrowDownRight, Clock4, Search } from "lucide-react";

// --- Brand tokens (match your COLORPALLETE) ---
const gradientBrand = "bg-gradient-to-r from-[#3B82F6] via-[#6366F1] to-[#8B5CF6]";
const ringBrand = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#8B5CF6]/40";
const surface = "bg-[#F9FAFB] dark:bg-[#0A0A0A]";
const textPrimary = "text-[#312E81] dark:text-[#E0E7FF]";

// --- Tiny helpers ---
function cn(...a: (string | undefined | false)[]) {
    return a.filter(Boolean).join(" ");
}

const formatCurrency = (n: number) => n.toLocaleString(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 0 });

// --- Pure SVG Line Chart (no deps) ---
type Pt = { x: number; y: number };
function LineChart({ data, height = 180, stroke = "#6366F1", area = true }: { data: number[]; height?: number; stroke?: string; area?: boolean }) {
    const pad = 8;
    const w = 520;
    const max = Math.max(...data) || 1;
    const min = Math.min(...data) || 0;
    const range = Math.max(max - min, 1);
    const pts: Pt[] = data.map((v, i) => ({
        x: pad + (i * (w - pad * 2)) / (data.length - 1 || 1),
        y: pad + (height - pad * 2) * (1 - (v - min) / range),
    }));
    const d =
        pts.length > 0
            ? `M ${pts[0].x},${pts[0].y} ` +
              pts
                  .slice(1)
                  .map((p) => `L ${p.x},${p.y}`)
                  .join(" ")
            : "";

    const areaPath = pts.length > 1 ? `${d} L ${pts[pts.length - 1].x},${height - pad} L ${pts[0].x},${height - pad} Z` : "";

    return (
        <svg viewBox={`0 0 ${w} ${height}`} className="w-full h-auto">
            {/* grid */}
            <g opacity={0.08}>
                {[0, 1, 2, 3].map((i) => (
                    <line key={i} x1={pad} x2={w - pad} y1={pad + ((height - pad * 2) / 3) * i} y2={pad + ((height - pad * 2) / 3) * i} stroke="currentColor" />
                ))}
            </g>
            {area && <path d={areaPath} fill={stroke} opacity={0.12} />}
            <path d={d} fill="none" stroke={stroke} strokeWidth={2.5} />
            {pts.map((p, idx) => (
                <circle key={idx} cx={p.x} cy={p.y} r={2} fill={stroke} />
            ))}
        </svg>
    );
}

// --- Donut (conic-gradient) ---
function Donut({
    value,
    label,
}: {
    value: number; // 0..100
    label: string;
}) {
    const clamped = Math.max(0, Math.min(100, value));
    return (
        <div className="flex items-center gap-4">
            <div
                className="h-16 w-16 rounded-full grid place-items-center"
                style={{
                    background: `conic-gradient(#6366F1 ${clamped * 3.6}deg, rgba(99,102,241,0.15) 0deg)`,
                }}
            >
                <div className="h-12 w-12 rounded-full bg-white dark:bg-zinc-900 grid place-items-center text-xs font-semibold">{clamped}%</div>
            </div>
            <div className="text-sm text-zinc-600 dark:text-zinc-300">{label}</div>
        </div>
    );
}

const Dashboard: React.FC = () => {
    // mock datasets (wire to real API later)
    const bookings = [28, 34, 31, 45, 42, 55, 61, 59, 63, 70, 68, 75];
    const revenue = [8200, 9100, 8800, 10200, 11000, 12300, 13500, 12900, 14200, 15600, 15100, 16900];

    const stats = [
        {
            label: "Total Revenue",
            value: formatCurrency(16900),
            delta: "+11.9%",
            up: true,
            icon: CreditCard,
        },
        {
            label: "Sessions Booked",
            value: "752",
            delta: "+8.2%",
            up: true,
            icon: CalendarCheck2,
        },
        {
            label: "Active Mentors",
            value: "218",
            delta: "+2.1%",
            up: true,
            icon: Users2,
        },
        {
            label: "Avg Rating",
            value: "4.8",
            delta: "-0.1",
            up: false,
            icon: Star,
        },
    ];

    const notifications = [
        { id: 1, title: "New mentor application", body: "Sophia • Senior Data Engineer", time: "4m" },
        { id: 2, title: "High demand: Frontend", body: "Searches up 22% this week", time: "1h" },
        { id: 3, title: "Dispute resolved", body: "Refund issued for #INV-58321", time: "3h" },
        { id: 4, title: "Payout run complete", body: "63 mentors paid successfully", time: "Yesterday" },
    ];

    return (
        <AppLayout>
            <main className={cn(surface, "min-h-screen")}>
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
                    {/* Page header */}
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <h1 className={cn("text-2xl sm:text-3xl font-bold tracking-tight", textPrimary)}>Dashboard</h1>
                            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300/80">Snapshot of your marketplace — bookings, revenue, supply, and trends.</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <button className={cn(ringBrand, "inline-flex items-center gap-2 rounded-xl border border-zinc-200 dark:border-zinc-800 px-3 py-2 text-sm hover:bg-zinc-50 dark:hover:bg-zinc-900")}>
                                <Clock4 size={16} />
                                Last 30 days
                            </button>
                            <button className={cn(gradientBrand, "text-white rounded-xl px-3 py-2 text-sm shadow-sm hover:shadow")}>Export</button>
                        </div>
                    </div>

                    {/* Search + quick filters */}
                    <div className="mt-6 flex flex-col sm:flex-row gap-3">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                            <input className={cn(ringBrand, "w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 pl-9 pr-3 py-2 text-sm")} placeholder="Search mentors, mentees, sessions, invoices…" />
                        </div>
                        <div className="flex gap-2">
                            {["7d", "30d", "90d", "YTD"].map((r) => (
                                <button key={r} className="rounded-xl border border-zinc-200 dark:border-zinc-800 px-3 py-2 text-sm hover:bg-zinc-50 dark:hover:bg-zinc-900">
                                    {r}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* KPI cards */}
                    <section className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {stats.map(({ label, value, delta, up, icon: Icon }) => (
                            <div key={label} className="rounded-2xl border border-zinc-200/70 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/40 p-5 backdrop-blur">
                                <div className="flex items-center justify-between">
                                    <div className="text-sm text-zinc-500">{label}</div>
                                    <div className={cn("h-9 w-9 rounded-lg grid place-items-center text-white", gradientBrand)}>
                                        <Icon size={18} />
                                    </div>
                                </div>
                                <div className="mt-2 text-xl font-semibold">{value}</div>
                                <div className={cn("mt-1 inline-flex items-center gap-1 text-xs font-medium", up ? "text-emerald-600" : "text-rose-600")}>
                                    {up ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                                    {delta} vs prev.
                                </div>
                                {/* Mini sparkline */}
                                <div className="mt-3 h-10 w-full overflow-hidden">
                                    <LineChart data={[3, 6, 5, 7, 8, 12, 10, 14]} height={40} stroke={up ? "#10B981" : "#F43F5E"} area />
                                </div>
                            </div>
                        ))}
                    </section>

                    {/* Charts + notifications */}
                    <section className="mt-6 grid lg:grid-cols-3 gap-4">
                        {/* Bookings trend */}
                        <div className="lg:col-span-2 rounded-2xl border border-zinc-200/70 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/40 p-5">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-sm text-zinc-500">Bookings</div>
                                    <div className="text-lg font-semibold">Last 12 months</div>
                                </div>
                                <div className="hidden sm:flex items-center gap-3">
                                    <Donut value={72} label="Slot utilization" />
                                    <Donut value={58} label="Repeat mentees" />
                                </div>
                            </div>
                            <div className="mt-4">
                                <LineChart data={bookings} stroke="#3B82F6" />
                            </div>
                            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                                <div className="rounded-xl border border-zinc-200/70 dark:border-zinc-800 p-3">
                                    <div className="text-zinc-500">Total</div>
                                    <div className="font-semibold">7,524</div>
                                </div>
                                <div className="rounded-xl border border-zinc-200/70 dark:border-zinc-800 p-3">
                                    <div className="text-zinc-500">No-shows</div>
                                    <div className="font-semibold">1.8%</div>
                                </div>
                                <div className="rounded-xl border border-zinc-200/70 dark:border-zinc-800 p-3">
                                    <div className="text-zinc-500">Group ratio</div>
                                    <div className="font-semibold">34%</div>
                                </div>
                                <div className="rounded-xl border border-zinc-200/70 dark:border-zinc-800 p-3">
                                    <div className="text-zinc-500">Top timezone</div>
                                    <div className="font-semibold">GMT+1</div>
                                </div>
                            </div>
                        </div>

                        {/* Notifications */}
                        <div className="rounded-2xl border border-zinc-200/70 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/40 p-5">
                            <div className="flex items-center justify-between">
                                <div className="text-lg font-semibold">Notifications</div>
                                <button className={cn("text-xs rounded-lg px-2 py-1 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900", ringBrand)}>Mark all read</button>
                            </div>
                            <ul className="mt-4 space-y-3">
                                {notifications.map((n) => (
                                    <li key={n.id} className="flex gap-3">
                                        <div className={cn("h-9 w-9 rounded-lg text-white grid place-items-center flex-shrink-0", gradientBrand)}>
                                            <Bell size={16} />
                                        </div>
                                        <div className="min-w-0">
                                            <div className="text-sm font-medium">{n.title}</div>
                                            <div className="text-xs text-zinc-500">{n.body}</div>
                                        </div>
                                        <div className="ml-auto text-xs text-zinc-400">{n.time}</div>
                                    </li>
                                ))}
                            </ul>
                            <button className={cn("mt-4 w-full text-center text-sm rounded-xl border border-zinc-200 dark:border-zinc-800 py-2 hover:bg-zinc-50 dark:hover:bg-zinc-900", ringBrand)}>View all</button>
                        </div>
                    </section>

                    {/* Revenue chart + recent bookings table */}
                    <section className="mt-6 grid lg:grid-cols-3 gap-4">
                        <div className="lg:col-span-2 rounded-2xl border border-zinc-200/70 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/40 p-5">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-sm text-zinc-500">Revenue</div>
                                    <div className="text-lg font-semibold">Mentor earnings + marketplace commission</div>
                                </div>
                                <div className={cn("h-9 w-9 rounded-lg grid place-items-center text-white", gradientBrand)}>
                                    <TrendingUp size={18} />
                                </div>
                            </div>
                            <div className="mt-4">
                                <LineChart data={revenue} stroke="#8B5CF6" />
                            </div>
                            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                                <div className="rounded-xl border border-zinc-200/70 dark:border-zinc-800 p-3">
                                    <div className="text-zinc-500">Gross</div>
                                    <div className="font-semibold">{formatCurrency(16900)}</div>
                                </div>
                                <div className="rounded-xl border border-zinc-200/70 dark:border-zinc-800 p-3">
                                    <div className="text-zinc-500">Commission</div>
                                    <div className="font-semibold">{formatCurrency(3560)}</div>
                                </div>
                                <div className="rounded-xl border border-zinc-200/70 dark:border-zinc-800 p-3">
                                    <div className="text-zinc-500">Refunds</div>
                                    <div className="font-semibold">{formatCurrency(420)}</div>
                                </div>
                                <div className="rounded-xl border border-zinc-200/70 dark:border-zinc-800 p-3">
                                    <div className="text-zinc-500">Payout delay</div>
                                    <div className="font-semibold">~1.1 days</div>
                                </div>
                            </div>
                        </div>

                        {/* Recent sessions */}
                        <div className="rounded-2xl border border-zinc-200/70 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/40 p-5">
                            <div className="text-lg font-semibold">Recent Sessions</div>
                            <div className="mt-3 overflow-x-auto">
                                <table className="min-w-full text-sm">
                                    <thead className="text-left text-zinc-500">
                                        <tr>
                                            <th className="py-2 pr-3">Mentor</th>
                                            <th className="py-2 pr-3">Mentee</th>
                                            <th className="py-2 pr-3">Type</th>
                                            <th className="py-2 pr-3">Status</th>
                                            <th className="py-2 text-right">Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody className="align-top">
                                        {[
                                            ["Ada F.", "Ugo", "1:1 · 45m", "Completed", "$45"],
                                            ["Riya S.", "Chinedu", "Group · 60m", "Completed", "$19"],
                                            ["Mason K.", "Ife", "1:1 · 30m", "No-show", "$0"],
                                            ["Zara A.", "Tomi", "1:1 · 60m", "Completed", "$60"],
                                        ].map((r, i) => (
                                            <tr key={i} className="border-t border-zinc-200/70 dark:border-zinc-800">
                                                <td className="py-2 pr-3">{r[0]}</td>
                                                <td className="py-2 pr-3">{r[1]}</td>
                                                <td className="py-2 pr-3">{r[2]}</td>
                                                <td className="py-2 pr-3">
                                                    <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-xs", r[3] === "Completed" ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300" : "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300")}>{r[3]}</span>
                                                </td>
                                                <td className="py-2 text-right font-medium">{r[4]}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <button className={cn("mt-4 w-full text-center text-sm rounded-xl border border-zinc-200 dark:border-zinc-800 py-2 hover:bg-zinc-50 dark:hover:bg-zinc-900", ringBrand)}>View sessions</button>
                        </div>
                    </section>
                </div>
            </main>
        </AppLayout>
    );
};

export default Dashboard;
