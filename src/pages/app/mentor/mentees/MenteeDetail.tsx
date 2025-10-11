import React from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Mail, Phone, Globe, Edit, Trash2, Save, X, Star, CalendarCheck2, CreditCard, MessageSquare } from "lucide-react";
import MentorAppLayout from "../MentorAppLayout";
// Brand tokens
const gradientBrand = "bg-gradient-to-r from-[#3B82F6] via-[#6366F1] to-[#8B5CF6]";
const ringBrand = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#8B5CF6]/40";
const surface = "bg-[#F9FAFB] dark:bg-[#0A0A0A]";
const textPrimary = "text-[#312E81] dark:text-[#E0E7FF]";

type Mentee = {
    id: string;
    name: string;
    email: string;
    phone?: string;
    timezone: string;
    plan: "Free" | "Pro" | "Team";
    status: "active" | "paused" | "banned";
    rating: number;
    skills: string[];
    bio?: string;
};

// lightweight in-file fallback (in a real app, fetch by id)
const fallback: Mentee = {
    id: "mn_fallback",
    name: "Sample Mentee",
    email: "sample@mentora.dev",
    timezone: "GMT+1",
    plan: "Pro",
    status: "active",
    rating: 4.7,
    skills: ["React", "TypeScript", "Design"],
    bio: "Learning frontend and design systems. Focused on landing pages and dashboards.",
};

const Stat = ({ label, value, icon: Icon }: any) => (
    <div className="rounded-2xl border border-zinc-200/70 dark:border-zinc-800 p-4 bg-white/70 dark:bg-zinc-900/40">
        <div className="flex items-center justify-between">
            <div className="text-sm text-zinc-500">{label}</div>
            <div className={`h-9 w-9 rounded-lg grid place-items-center text-white ${gradientBrand}`}>
                <Icon size={18} />
            </div>
        </div>
        <div className="mt-2 text-xl font-semibold">{value}</div>
    </div>
);

const ConfirmModal: React.FC<{
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    desc: string;
}> = ({ open, onClose, onConfirm, title, desc }) => {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 bg-black/50 grid place-items-center px-4">
            <div className="w-full max-w-md rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">{title}</h3>
                    <button onClick={onClose} className="p-1 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800">
                        <X size={18} />
                    </button>
                </div>
                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300/80">{desc}</p>
                <div className="mt-5 flex items-center justify-end gap-2">
                    <button onClick={onClose} className="rounded-xl border border-zinc-200 dark:border-zinc-800 px-4 py-2 text-sm">
                        Cancel
                    </button>
                    <button onClick={onConfirm} className={`rounded-xl px-4 py-2 text-sm text-white ${gradientBrand}`}>
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
};

const MenteeDetail: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // Simulated fetched record
    const [mentee, setMentee] = React.useState<Mentee>({
        ...fallback,
        id: id || fallback.id,
        name: id ? "Dynamic Mentee " + id.slice(-4) : fallback.name,
    });

    const [edit, setEdit] = React.useState(false);
    const [busy, setBusy] = React.useState(false);
    const [showDelete, setShowDelete] = React.useState(false);

    const [form, setForm] = React.useState<Mentee>(mentee);
    React.useEffect(() => setForm(mentee), [edit]); // sync on open

    async function saveChanges() {
        setBusy(true);
        const prev = mentee;
        setMentee(form); // optimistic
        try {
            await new Promise((r) => setTimeout(r, 800));
            setEdit(false);
        } catch {
            setMentee(prev); // rollback
            alert("Update failed. Reverted.");
        } finally {
            setBusy(false);
        }
    }

    async function deleteMentee() {
        setBusy(true);
        try {
            await new Promise((r) => setTimeout(r, 700));
            navigate("/dashboard/mentees");
        } finally {
            setBusy(false);
        }
    }

    // dummy session & billing data
    const sessions = [
        { id: "s_01", title: "Frontend career chat", date: "2025-08-01", status: "Completed", amount: "$45" },
        { id: "s_02", title: "UI review", date: "2025-07-28", status: "Completed", amount: "$60" },
        { id: "s_03", title: "No-show follow up", date: "2025-07-14", status: "No-show", amount: "$0" },
    ];

    const payments = [
        { id: "p_01", date: "2025-08-01", method: "Card", amount: "$45" },
        { id: "p_02", date: "2025-07-28", method: "Card", amount: "$60" },
    ];

    const StarRow = ({ v }: { v: number }) => (
        <div className="inline-flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={14} className={i < Math.round(v) ? "text-yellow-500" : "text-zinc-300 dark:text-zinc-700"} />
            ))}
            <span className="ml-1 text-xs text-zinc-500">{v.toFixed(1)}</span>
        </div>
    );

    const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => <input {...props} className={`w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-2 text-sm ${ringBrand} ${props.className || ""}`} />;

    return (
        <MentorAppLayout>
            <main className={`${surface} min-h-screen`}>
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <div>
                            <h1 className={`text-2xl sm:text-3xl font-bold tracking-tight ${textPrimary}`}>{mentee.name}</h1>
                            <div className="mt-1 text-sm text-zinc-600 dark:text-zinc-300/80 flex items-center gap-3">
                                <span className="inline-flex items-center gap-1">
                                    <Mail size={14} /> {mentee.email}
                                </span>
                                <span className="inline-flex items-center gap-1">
                                    <Globe size={14} /> {mentee.timezone}
                                </span>
                                <StarRow v={mentee.rating} />
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            {!edit ? (
                                <>
                                    <button onClick={() => setEdit(true)} className={`rounded-xl px-3 py-2 text-sm text-white ${gradientBrand} ${ringBrand}`}>
                                        <Edit size={16} className="inline mr-1" /> Edit
                                    </button>
                                    <button onClick={() => setShowDelete(true)} className="rounded-xl px-3 py-2 text-sm border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900">
                                        <Trash2 size={16} className="inline mr-1" /> Delete
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button disabled={busy} onClick={saveChanges} className={`rounded-xl px-3 py-2 text-sm text-white ${gradientBrand} disabled:opacity-60`}>
                                        <Save size={16} className="inline mr-1" /> Save
                                    </button>
                                    <button disabled={busy} onClick={() => setEdit(false)} className="rounded-xl px-3 py-2 text-sm border border-zinc-200 dark:border-zinc-800">
                                        <X size={16} className="inline mr-1" /> Cancel
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Top stats */}
                    <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <Stat label="Sessions" value="32" icon={CalendarCheck2} />
                        <Stat label="Spend" value="$165" icon={CreditCard} />
                        <Stat label="Plan" value={mentee.plan} icon={MessageSquare} />
                        <Stat label="Status" value={mentee.status} icon={Mail} />
                    </div>

                    {/* Content grid */}
                    <div className="mt-6 grid lg:grid-cols-3 gap-4">
                        {/* Left: profile + edit */}
                        <div className="lg:col-span-1 rounded-2xl border border-zinc-200/70 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/40 p-5">
                            {!edit ? (
                                <>
                                    <div className={`h-16 w-16 rounded-2xl ${gradientBrand}`} />
                                    <div className="mt-3">
                                        <div className="text-sm text-zinc-500">Bio</div>
                                        <p className="mt-1 text-sm">{mentee.bio}</p>
                                    </div>
                                    <div className="mt-3">
                                        <div className="text-sm text-zinc-500">Skills</div>
                                        <div className="mt-1 flex flex-wrap gap-2">
                                            {mentee.skills.map((s) => (
                                                <span key={s} className="text-xs rounded-full px-2.5 py-0.5 bg-zinc-100 dark:bg-zinc-800">
                                                    {s}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="grid gap-3">
                                    <div>
                                        <label className="text-xs text-zinc-500">Name</label>
                                        <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                                    </div>
                                    <div>
                                        <label className="text-xs text-zinc-500">Email</label>
                                        <Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="text-xs text-zinc-500">Timezone</label>
                                            <Input value={form.timezone} onChange={(e) => setForm({ ...form, timezone: e.target.value })} />
                                        </div>
                                        <div>
                                            <label className="text-xs text-zinc-500">Rating</label>
                                            <Input type="number" step="0.1" min={0} max={5} value={form.rating} onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })} />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="text-xs text-zinc-500">Plan</label>
                                            <select value={form.plan} onChange={(e) => setForm({ ...form, plan: e.target.value as any })} className={`w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-2 text-sm ${ringBrand}`}>
                                                <option>Free</option>
                                                <option>Pro</option>
                                                <option>Team</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-xs text-zinc-500">Status</label>
                                            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as any })} className={`w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-2 text-sm ${ringBrand}`}>
                                                <option>active</option>
                                                <option>paused</option>
                                                <option>banned</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-xs text-zinc-500">Skills (comma separated)</label>
                                        <Input
                                            value={form.skills.join(", ")}
                                            onChange={(e) =>
                                                setForm({
                                                    ...form,
                                                    skills: e.target.value
                                                        .split(",")
                                                        .map((s) => s.trim())
                                                        .filter(Boolean),
                                                })
                                            }
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs text-zinc-500">Bio</label>
                                        <textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} className={`mt-1 w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-2 text-sm ${ringBrand}`} rows={4} />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Right: sessions + payments + actions */}
                        <div className="lg:col-span-2 grid gap-4">
                            {/* Sessions */}
                            <div className="rounded-2xl border border-zinc-200/70 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/40 p-5">
                                <div className="flex items-center justify-between">
                                    <div className="text-lg font-semibold">Sessions</div>
                                    <div className="flex items-center gap-2">
                                        <button className={`rounded-xl px-3 py-2 text-sm text-white ${gradientBrand}`}>New Session</button>
                                        <button className="rounded-xl px-3 py-2 text-sm border border-zinc-200 dark:border-zinc-800">Export</button>
                                    </div>
                                </div>
                                <div className="mt-3 overflow-x-auto">
                                    <table className="min-w-full text-sm">
                                        <thead className="text-left text-zinc-500">
                                            <tr>
                                                <th className="py-2 pr-3">Title</th>
                                                <th className="py-2 pr-3">Date</th>
                                                <th className="py-2 pr-3">Status</th>
                                                <th className="py-2 text-right">Amount</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {sessions.map((s) => (
                                                <tr key={s.id} className="border-t border-zinc-200/70 dark:border-zinc-800">
                                                    <td className="py-2 pr-3">{s.title}</td>
                                                    <td className="py-2 pr-3">{s.date}</td>
                                                    <td className="py-2 pr-3">
                                                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs ${s.status === "Completed" ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300" : "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300"}`}>{s.status}</span>
                                                    </td>
                                                    <td className="py-2 text-right font-medium">{s.amount}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Billing */}
                            <div className="rounded-2xl border border-zinc-200/70 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/40 p-5">
                                <div className="text-lg font-semibold">Payments</div>
                                <div className="mt-3 overflow-x-auto">
                                    <table className="min-w-full text-sm">
                                        <thead className="text-left text-zinc-500">
                                            <tr>
                                                <th className="py-2 pr-3">Date</th>
                                                <th className="py-2 pr-3">Method</th>
                                                <th className="py-2 text-right">Amount</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {payments.map((p) => (
                                                <tr key={p.id} className="border-t border-zinc-200/70 dark:border-zinc-800">
                                                    <td className="py-2 pr-3">{p.date}</td>
                                                    <td className="py-2 pr-3">{p.method}</td>
                                                    <td className="py-2 text-right font-medium">{p.amount}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Contact quick actions */}
                            <div className="rounded-2xl border border-zinc-200/70 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/40 p-5">
                                <div className="text-lg font-semibold">Quick Actions</div>
                                <div className="mt-3 flex flex-wrap gap-2">
                                    <Link to={`mailto:${mentee.email}`} className={`rounded-xl px-3 py-2 text-sm text-white ${gradientBrand}`}>
                                        <Mail size={16} className="inline mr-1" /> Email
                                    </Link>
                                    <button className="rounded-xl px-3 py-2 text-sm border border-zinc-200 dark:border-zinc-800">
                                        <MessageSquare size={16} className="inline mr-1" /> Message
                                    </button>
                                    <button className="rounded-xl px-3 py-2 text-sm border border-zinc-200 dark:border-zinc-800">
                                        <CreditCard size={16} className="inline mr-1" /> Add Credit
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <ConfirmModal open={showDelete} onClose={() => setShowDelete(false)} onConfirm={deleteMentee} title="Delete mentee?" desc="This will remove the mentee and their records. You can’t undo this action." />
            </main>
        </MentorAppLayout>
    );
};

export default MenteeDetail;
