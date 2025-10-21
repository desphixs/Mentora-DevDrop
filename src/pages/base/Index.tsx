// src/pages/marketing/MentoraLanding.tsx
import React from "react";
import { Link } from "react-router-dom";
import { Rocket, PlayCircle, CalendarCheck2, Users2, CreditCard, MessageSquare, Star, ShieldCheck, Bell, BarChart3, CheckCircle2, Wallet, Video, Sparkles, ArrowRight, Globe2 } from "lucide-react";
import Header from "@/layout/Header";
import { THEME } from "@/styles/theme";

// quick shorthands
const G = THEME.gradients;
const S = THEME.surfaces;
const T = THEME.text;
const R = THEME.rings;
const SH = THEME.shadows;

/** Modern blurred brand blobs */
function BgBlobs({ variant = "hero", className = "" }: { variant?: "hero" | "section" | "footer"; className?: string }) {
    const base = "pointer-events-none absolute inset-0 -z-10 overflow-hidden";
    const blur = "blur-3xl sm:blur-[80px]";
    const common = "opacity-40 dark:opacity-25 mix-blend-normal dark:mix-blend-screen";
    if (variant === "hero") {
        return (
            <div aria-hidden className={`${base} ${className}`}>
                <div className={`${blur} ${common} bg-gradient-to-tr ${G.brandSoft}`} style={{ position: "absolute", inset: "-15% -10% auto -10%", height: "60%", borderRadius: "9999px" }} />
                <div className={`${blur} ${common} bg-gradient-to-tr from-[#C7D2FE] via-[#E0E7FF] to-transparent`} style={{ position: "absolute", right: "-15%", top: "-10%", width: "50rem", height: "50rem", borderRadius: "9999px" }} />
                <div className={`${blur} ${common} bg-gradient-to-tr from-[#D1D5FF] via-transparent to-transparent`} style={{ position: "absolute", left: "10%", bottom: "-25%", width: "55rem", height: "30rem", borderRadius: "9999px" }} />
            </div>
        );
    }
    return (
        <div aria-hidden className={`${base} ${className}`}>
            <div className={`${blur} ${common} bg-gradient-to-tr ${G.brandSoft}`} style={{ position: "absolute", left: "5%", top: "-25%", width: "35rem", height: "35rem", borderRadius: "9999px" }} />
            <div className={`${blur} ${common} bg-gradient-to-tr ${G.glowBlue}`} style={{ position: "absolute", right: "0%", bottom: "-30%", width: "40rem", height: "32rem", borderRadius: "9999px" }} />
        </div>
    );
}

/** Buttons */
function ButtonPrimary(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
    const { className = "", ...rest } = props;
    return <button className={`bg-gradient-to-r ${G.brand} ${R.brand} inline-flex items-center justify-center rounded-2xl px-5 py-3 text-sm font-semibold text-white ${SH.sm} hover:shadow-md transition w-full sm:w-auto ${className}`} {...rest} />;
}
function ButtonGhost(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
    const { className = "", ...rest } = props;
    return <button className={`${R.brand} inline-flex items-center justify-center rounded-2xl px-5 py-3 text-sm font-semibold border ${S.border} text-zinc-900 dark:text-zinc-100 hover:bg-white/60 dark:hover:bg-zinc-900/60 transition w-full sm:w-auto ${className}`} {...rest} />;
}

/** Chip badge */
function Badge({ children, className = "" }: { children: React.ReactNode; className?: string }) {
    return <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs text-white bg-gradient-to-r ${G.brand} ${SH.sm} ${className}`}>{children}</span>;
}

/** Small stat */
const Stat = ({ icon: Icon, label, value }: { icon: React.ComponentType<any>; label: string; value: string }) => (
    <div className="flex items-center gap-3">
        <div className={`h-9 w-9 rounded-xl grid place-items-center border ${S.border} ${S.panelSolid}`}>
            <Icon size={18} className="text-zinc-700 dark:text-zinc-200" />
        </div>
        <div>
            <div className={`text-sm ${T.muted}`}>{label}</div>
            <div className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">{value}</div>
        </div>
    </div>
);

/** Logo pill */
const LogoPill = ({ name }: { name: string }) => <span className={`px-3 py-1 rounded-xl border ${S.border} text-xs text-zinc-700 dark:text-zinc-300 ${S.panelLight}`}>{name}</span>;

const MentoraLanding: React.FC = () => {
    return (
        <div className={`${S.base} ${T.primary} antialiased relative`}>
            <Header />
            {/* ===== HERO (indigo neon) ===== */}
            <section className="relative isolate overflow-hidden">
                {/* base bg */}
                <div className="absolute inset-0 -z-10 bg-[#F6F7FF] dark:bg-[#0A0B14]" />

                {/* indigo glows */}
                <div
                    aria-hidden
                    className="pointer-events-none absolute -top-40 -left-32 h-[32rem] w-[32rem] rounded-full blur-[100px] opacity-60 dark:opacity-40"
                    style={{
                        background: "radial-gradient(50% 50% at 50% 50%, rgba(99,102,241,0.55) 0%, rgba(99,102,241,0.18) 60%, rgba(99,102,241,0) 100%)",
                    }}
                />
                <div
                    aria-hidden
                    className="pointer-events-none absolute -right-40 -top-10 h-[36rem] w-[36rem] rounded-full blur-[120px] opacity-60 dark:opacity-40"
                    style={{
                        background: "radial-gradient(50% 50% at 50% 50%, rgba(91,114,246,0.55) 0%, rgba(91,114,246,0.16) 60%, rgba(91,114,246,0) 100%)",
                    }}
                />
                <div
                    aria-hidden
                    className="pointer-events-none absolute left-1/2 top-[65%] -translate-x-1/2 h-[40rem] w-[60rem] rounded-[9999px] blur-[130px] opacity-60 dark:opacity-40"
                    style={{
                        background: "radial-gradient(60% 60% at 50% 50%, rgba(139,92,246,0.42) 0%, rgba(139,92,246,0.12) 60%, rgba(139,92,246,0) 100%)",
                    }}
                />

                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 sm:pt-28 pb-12">
                    <div className="grid lg:grid-cols-12 gap-10 items-center">
                        {/* headline */}
                        <div className="lg:col-span-6 text-center lg:text-left">
                            <span className="inline-flex items-center gap-2 rounded-full border border-white/60 dark:border-white/10 bg-white/70 dark:bg-white/5 px-3 py-1 text-[11px] font-semibold text-[#1B1F3A] dark:text-indigo-100 backdrop-blur">
                                <span className="inline-block h-2 w-2 rounded-full bg-[#5B72F6] shadow-[0_0_12px_2px_rgba(91,114,246,0.7)]" />
                                Launch-ready SaaS Kit
                            </span>

                            <h1 className="mt-6 text-[2.5rem] sm:text-6xl font-extrabold leading-[1.05] tracking-tight text-[#0F1228] dark:text-transparent bg-clip-text bg-gradient-to-br from-[#ffffff] via-[#cfd6ff] to-[#cfd6ff]">
                                Build a mentorship marketplace
                                <span className="block">that converts.</span>
                            </h1>

                            <p className="mt-4 max-w-xl mx-auto lg:mx-0 text-[15px] sm:text-[16px] text-[#2C3157] dark:text-[#C9D1FF]/85">Discovery, booking, payments, live sessions—tight and polished. Ship in hours, not quarters.</p>

                            <div className="mt-7 flex flex-col sm:flex-row items-center lg:items-start gap-3">
                                <Link to="/checkout" className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-white bg-gradient-to-r from-[#4F46E5] via-[#6366F1] to-[#8B5CF6] shadow-[0_10px_30px_rgba(79,70,229,0.35)] hover:shadow-[0_16px_40px_rgba(79,70,229,0.45)] transition">
                                    Get the Kit
                                    <Sparkles size={18} />
                                </Link>
                                <Link to="/demo" className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold border border-[#D9DBFF] dark:border-[#30345D] text-[#1B1F3A] dark:text-[#E6E9FF] bg-white/70 dark:bg-white/[0.05] hover:bg-white/90 dark:hover:bg-white/[0.08] backdrop-blur transition">
                                    <PlayCircle size={18} />
                                    Watch demo
                                </Link>
                            </div>

                            {/* micro stats */}
                            <div className="mt-8 grid grid-cols-3 gap-4 max-w-md mx-auto lg:mx-0">
                                {[
                                    { label: "Active mentors", value: "1–5000+" },
                                    { label: "Deploy time", value: "~90 mins" },
                                    { label: "Gateways", value: "20+ global" },
                                ].map((s) => (
                                    <div key={s.label} className="rounded-xl border border-[#E5E7FF] dark:border-[#2B2F55] bg-white/70 dark:bg-white/[0.04] backdrop-blur p-3 text-left">
                                        <div className="text-[11px] text-[#6065A6] dark:text-[#A7B0FF]/80">{s.label}</div>
                                        <div className="text-[15px] font-semibold text-[#101436] dark:text-[#F1F3FF]">{s.value}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* preview widget */}
                        <div className="lg:col-span-6">
                            <div className="relative">
                                <div className="absolute inset-0 -z-10 rounded-[28px] bg-gradient-to-br from-[#EEF2FF] to-white dark:from-[#111633] dark:to-[#0B0F26] opacity-70 blur-sm" />
                                <div className="rounded-[28px] border border-[#E7E9FF] dark:border-[#2B2F55] bg-white/80 dark:bg-white/[0.06] backdrop-blur-xl shadow-[0_24px_60px_rgba(17,24,39,0.10)] overflow-hidden">
                                    <div className="h-12 bg-gradient-to-r from-[#E9ECFF] to-[#F5F6FF] dark:from-[#141A3B] dark:to-[#0E1230]" />
                                    <div className="p-6">
                                        <div className="grid sm:grid-cols-2 gap-6">
                                            <div className="rounded-2xl border border-[#E7E9FF] dark:border-[#2B2F55] p-4">
                                                <div className="text-sm font-semibold text-[#0F1536] dark:text-[#E7E9FF]">Ada · Senior Frontend</div>
                                                <div className="mt-1 text-xs text-[#5F679A]">₦18k / $25 · 45 min</div>
                                                <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
                                                    {["Mon", "Tue", "Wed"].map((d) => (
                                                        <button key={d} className="rounded-lg py-2 border border-[#E7E9FF] dark:border-[#2B2F55] bg-white/70 dark:bg-white/[0.04] hover:bg-white/90 dark:hover:bg-white/[0.07]">
                                                            {d}
                                                        </button>
                                                    ))}
                                                </div>
                                                <button className="mt-4 w-full rounded-lg py-2 text-sm text-white bg-gradient-to-r from-[#4F46E5] to-[#8B5CF6] shadow-[0_10px_24px_rgba(79,70,229,0.35)]">Book 45 min</button>
                                            </div>

                                            <div className="rounded-2xl border border-[#E7E9FF] dark:border-[#2B2F55] p-4">
                                                <div className="text-sm font-semibold text-[#0F1536] dark:text-[#E7E9FF]">Pick a time</div>
                                                <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
                                                    {["09:30", "12:00", "14:30", "17:00", "18:30", "20:00"].map((t) => (
                                                        <button key={t} className="rounded-lg py-2 border border-[#E7E9FF] dark:border-[#2B2F55] hover:bg-[#F5F6FF] dark:hover:bg-white/[0.06]">
                                                            {t}
                                                        </button>
                                                    ))}
                                                </div>
                                                <div className="mt-4 flex gap-2">
                                                    <button className="w-full rounded-lg py-2 text-sm border border-[#E7E9FF] dark:border-[#2B2F55]">Suggest later</button>
                                                    <button className="w-full rounded-lg py-2 text-sm text-white bg-gradient-to-r from-[#6366F1] to-[#8B5CF6]">Confirm</button>
                                                </div>
                                            </div>
                                        </div>

                                        {/* tiny rail */}
                                        <div className="mt-6 grid sm:grid-cols-3 gap-4">
                                            {[
                                                { t: "Secure Messages", d: "Follow-ups & action items" },
                                                { t: "Smart Reminders", d: "Email & WhatsApp" },
                                                { t: "Recordings", d: "Optional post-call access" },
                                            ].map((x) => (
                                                <div key={x.t} className="rounded-xl border border-[#E7E9FF] dark:border-[#2B2F55] p-3 text-xs bg-white/70 dark:bg-white/[0.04]">
                                                    <div className="font-semibold text-[#0F1536] dark:text-[#E7E9FF]">{x.t}</div>
                                                    <div className="mt-1 text-[#5F679A] dark:text-[#A7B0FF]/85">{x.d}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* glow halo */}
                                <div className="pointer-events-none absolute -inset-5 -z-10 blur-3xl opacity-50 bg-gradient-to-tr from-[#CAD1FF] via-[#E6E9FF] to-transparent dark:from-[#212759] dark:via-transparent dark:to-transparent" />
                            </div>
                        </div>
                    </div>

                    {/* integrations */}
                    <div className="flex flex-wrap items-center justify-center gap-2 mt-16">
                        <span className="text-xs text-[#6B72B3] dark:text-[#A7B0FF]/80 mr-2">Payments & Calendars:</span>
                        {["Stripe", "Paystack", "Flutterwave", "Razorpay", "UPI", "Google Calendar", "Outlook", "Apple Calendar"].map((n) => (
                            <span key={n} className="px-3 py-1 rounded-xl border border-[#E7E9FF] dark:border-[#2B2F55] text-xs text-[#1B1F3A] dark:text-[#E6E9FF] bg-white/70 dark:bg-white/[0.05] backdrop-blur">
                                {n}
                            </span>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== VALUE STRIP (indigo mosaic) ===== */}
            <section className="relative isolate overflow-hidden py-16 sm:py-22">
                {/* background wash */}
                <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[#F3F5FF] to-white dark:from-[#0C1024] dark:to-[#0A0B14]" />
                <div aria-hidden className="pointer-events-none absolute left-[-10%] top-[-20%] h-[28rem] w-[28rem] blur-[110px] rounded-full opacity-60 dark:opacity-40" style={{ background: "radial-gradient(50% 50% at 50% 50%, rgba(99,102,241,0.5) 0%, rgba(99,102,241,0) 70%)" }} />
                <div aria-hidden className="pointer-events-none absolute right-[-10%] bottom-[-30%] h-[32rem] w-[32rem] blur-[120px] rounded-full opacity-60 dark:opacity-40" style={{ background: "radial-gradient(50% 50% at 50% 50%, rgba(139,92,246,0.45) 0%, rgba(139,92,246,0) 70%)" }} />

                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h2 className="text-2xl sm:text-3xl font-bold text-[#0F132E] dark:text-[#E9ECFF]">Why teams pick Mentora</h2>
                        <p className="mt-2 text-[15px] text-[#5E66A6] dark:text-[#A7B0FF]/85">Clean rails for growth—no chaos, no bloat.</p>
                    </div>

                    {/* mosaic */}
                    <div className="mt-10 grid lg:grid-cols-12 gap-6">
                        {/* tall hero tile */}
                        <div className="lg:col-span-5 rounded-3xl border border-[#E4E6FF] dark:border-[#2B2F55] bg-white/75 dark:bg-white/[0.05] backdrop-blur p-6">
                            <div className="inline-flex items-center gap-2 text-[11px] font-semibold px-3 py-1 rounded-full border border-[#E4E6FF] dark:border-[#2B2F55] bg-white/60 dark:bg-white/[0.03] text-[#1B1F3A] dark:text-[#E6E9FF]">Conversion wins</div>
                            <h3 className="mt-3 text-xl font-bold text-[#0F132E] dark:text-[#EEF0FF]">Discovery → Booking in 3 clicks</h3>
                            <p className="mt-2 text-sm text-[#5E66A6] dark:text-[#A7B0FF]/85">Search by skill, timezone, price. Clear availability. Fewer dead ends, more sessions booked.</p>

                            {/* progress */}
                            <div className="mt-6 space-y-4">
                                <div>
                                    <div className="flex items-end gap-2">
                                        <span className="text-xs text-[#6B72B3] dark:text-[#A7B0FF]/75">Search → booking</span>
                                        <span className="ml-auto text-sm font-semibold text-[#0F132E] dark:text-[#F1F3FF]">34%</span>
                                    </div>
                                    <div className="mt-2 h-2 rounded-full bg-[#E9EBFF] dark:bg-[#1A1F3D] overflow-hidden">
                                        <div className="h-full w-[34%] bg-gradient-to-r from-[#4F46E5] via-[#6366F1] to-[#8B5CF6]" />
                                    </div>
                                </div>

                                <div>
                                    <div className="flex items-end gap-2">
                                        <span className="text-xs text-[#6B72B3] dark:text-[#A7B0FF]/75">First-week activation</span>
                                        <span className="ml-auto text-sm font-semibold text-[#0F132E] dark:text-[#F1F3FF]">92%</span>
                                    </div>
                                    <div className="mt-2 h-2 rounded-full bg-[#E9EBFF] dark:bg-[#1A1F3D] overflow-hidden">
                                        <div className="h-full w-[92%] bg-gradient-to-r from-[#5B72F6] to-[#8B5CF6]" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* two mid tiles */}
                        <div className="lg:col-span-4 grid gap-6">
                            <div className="rounded-3xl border border-[#E4E6FF] dark:border-[#2B2F55] bg-white/75 dark:bg-white/[0.05] backdrop-blur p-6">
                                <div className="text-sm font-semibold text-[#0F132E] dark:text-[#EAEFFF]">Offer builder</div>
                                <p className="mt-1 text-sm text-[#5E66A6] dark:text-[#A7B0FF]/85">1:1, packages, group sessions + coupons. Price testing ready.</p>
                                <div className="mt-4 h-28 rounded-2xl border border-[#E4E6FF] dark:border-[#2B2F55] bg-gradient-to-br from-[#EEF2FF] to-white dark:from-[#141A3B] dark:to-[#0E1230]" />
                            </div>

                            <div className="rounded-3xl border border-[#E4E6FF] dark:border-[#2B2F55] bg-white/75 dark:bg-white/[0.05] backdrop-blur p-6">
                                <div className="text-sm font-semibold text-[#0F132E] dark:text-[#EAEFFF]">Finance suite</div>
                                <p className="mt-1 text-sm text-[#5E66A6] dark:text-[#A7B0FF]/85">Earnings, payouts, invoices, and taxes—clear & exportable.</p>
                                <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
                                    {["Earnings", "Payouts", "Invoices"].map((t) => (
                                        <div key={t} className="rounded-xl border border-[#E4E6FF] dark:border-[#2B2F55] p-3 text-center">
                                            {t}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* skinny stack */}
                        <div className="lg:col-span-3 grid gap-6">
                            <div className="rounded-3xl border border-[#E4E6FF] dark:border-[#2B2F55] bg-white/75 dark:bg-white/[0.05] backdrop-blur p-6">
                                <div className="text-sm font-semibold text-[#0F132E] dark:text-[#EAEFFF]">Messaging</div>
                                <p className="mt-1 text-sm text-[#5E66A6] dark:text-[#A7B0FF]/85">Pre/post-session comms with reminders.</p>
                            </div>
                            <div className="rounded-3xl border border-[#E4E6FF] dark:border-[#2B2F55] bg-white/75 dark:bg-white/[0.05] backdrop-blur p-6">
                                <div className="text-sm font-semibold text-[#0F132E] dark:text-[#EAEFFF]">KYC & Security</div>
                                <p className="mt-1 text-sm text-[#5E66A6] dark:text-[#A7B0FF]/85">Verification and granular controls.</p>
                            </div>
                            <div className="rounded-3xl border border-[#E4E6FF] dark:border-[#2B2F55] bg-white/75 dark:bg-white/[0.05] backdrop-blur p-6">
                                <div className="text-sm font-semibold text-[#0F132E] dark:text-[#EAEFFF]">Integrations</div>
                                <p className="mt-1 text-sm text-[#5E66A6] dark:text-[#A7B0FF]/85">Payments, calendars, and webhooks ready.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== HERO (glass board) ===== */}
            <section className="relative">
                <BgBlobs variant="hero" />
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-14 sm:pt-20 pb-10">
                    <div className="text-center">
                        <Badge className="mx-auto">
                            <Rocket size={14} />
                            Launch-ready SaaS Kit
                        </Badge>

                        <h1 className="mt-6 text-[2.3rem] sm:text-5xl font-extrabold tracking-tight leading-tight">
                            AI-calibrated mentorship marketplaces,
                            <span className="block">designed to convert.</span>
                        </h1>

                        <p className={`mt-4 max-w-2xl mx-auto ${T.subtle} text-base sm:text-lg`}>A polished stack for discovery, booking, payments, and live sessions. Ship a real marketplace this weekend—no duct tape.</p>

                        <div className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-3">
                            <ButtonPrimary>
                                <Link to="/checkout" className="inline-flex items-center gap-2">
                                    Get the Kit <Sparkles size={18} />
                                </Link>
                            </ButtonPrimary>
                            <ButtonGhost>
                                <Link to="/demo" className="inline-flex items-center gap-2">
                                    <PlayCircle size={18} />
                                    Watch demo
                                </Link>
                            </ButtonGhost>
                        </div>
                    </div>

                    {/* Glass booking board (inspired by screenshot) */}
                    <div className="mt-12 relative">
                        <div className={`rounded-[28px] border ${S.border} ${S.panelLight} ${SH.md} overflow-hidden`}>
                            {/* board header strip */}
                            <div className={`h-12 w-full bg-gradient-to-r ${G.brandSoft}`} />
                            <div className="p-6 sm:p-8">
                                <div className="grid md:grid-cols-3 gap-6">
                                    {/* Calendar widget */}
                                    <div className={`rounded-2xl border ${S.border} ${S.panelSolid} p-4`}>
                                        <div className="flex items-center justify-between">
                                            <div className="text-sm font-semibold">January 2025</div>
                                            <div className="flex gap-2">
                                                <button className={`h-8 w-8 rounded-lg border ${S.border}`}>‹</button>
                                                <button className={`h-8 w-8 rounded-lg border ${S.border}`}>›</button>
                                            </div>
                                        </div>
                                        <div className="mt-3 grid grid-cols-7 gap-1 text-[11px] text-zinc-500">
                                            {["S", "M", "T", "W", "T", "F", "S"].map((d) => (
                                                <div key={d} className="text-center py-1">
                                                    {d}
                                                </div>
                                            ))}
                                        </div>
                                        <div className="mt-1 grid grid-cols-7 gap-1 text-[12px]">
                                            {Array.from({ length: 35 }).map((_, i) => (
                                                <button key={i} className={`py-2 rounded-lg ${i === 17 ? `bg-gradient-to-r ${G.brand} text-white` : "hover:bg-zinc-100 dark:hover:bg-zinc-900"}`}>
                                                    {i + 1}
                                                </button>
                                            ))}
                                        </div>
                                        <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
                                            {["12:30", "02:00", "03:30"].map((t) => (
                                                <button key={t} className={`rounded-lg py-2 border ${S.border} hover:bg-white/60 dark:hover:bg-zinc-900/60`}>
                                                    {t}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Booking type */}
                                    <div className={`rounded-2xl border ${S.border} ${S.panelSolid} p-4`}>
                                        <div className="text-sm font-semibold">Type of Booking</div>
                                        <div className="mt-3 space-y-3 text-sm">
                                            <label className="flex items-center gap-3">
                                                <span className={`h-5 w-5 rounded-full border ${S.border} grid place-items-center`}>
                                                    <span className={`h-2.5 w-2.5 rounded-full bg-gradient-to-r ${G.brand}`} />
                                                </span>
                                                Regular booking
                                            </label>
                                            <label className="flex items-center gap-3">
                                                <span className={`h-5 w-5 rounded-full border ${S.border}`} />
                                                Instant checkout
                                            </label>
                                        </div>

                                        <div className="mt-5 grid grid-cols-2 gap-2 text-xs">
                                            <div>
                                                <div className={`${T.muted}`}>Booking Page</div>
                                                <div className={`mt-1 rounded-lg h-9 border ${S.border} grid place-items-center`}>/ada-frontend</div>
                                            </div>
                                            <div>
                                                <div className={`${T.muted}`}>Accent</div>
                                                <div className="mt-1 rounded-lg h-9 border border-transparent bg-gradient-to-r from-[#E0E7FF] via-[#EEF2FF] to-white" />
                                            </div>
                                        </div>

                                        <button className={`mt-5 w-full rounded-xl py-2.5 text-sm text-white bg-gradient-to-r ${G.brand} ${SH.sm}`}>Start your journey</button>
                                    </div>

                                    {/* Book a 30m meeting */}
                                    <div className={`rounded-2xl border ${S.border} ${S.panelSolid} p-4`}>
                                        <div className="flex items-center justify-between">
                                            <div className="text-sm font-semibold">Book a 30m meeting</div>
                                            <label className="inline-flex items-center gap-2 text-xs">
                                                <span>AI assist</span>
                                                <span className="relative inline-flex h-4 w-7 items-center rounded-full bg-zinc-200 dark:bg-zinc-800">
                                                    <span className={`absolute left-3 h-3.5 w-3.5 rounded-full bg-gradient-to-r ${G.brand}`} />
                                                </span>
                                            </label>
                                        </div>
                                        <div className="mt-3 grid grid-cols-3 gap-2">
                                            {["09:30", "10:30", "12:00", "14:00", "15:30", "17:00"].map((s) => (
                                                <button key={s} className={`rounded-lg py-2 text-sm border ${S.border} hover:bg-zinc-100 dark:hover:bg-zinc-900`}>
                                                    {s}
                                                </button>
                                            ))}
                                        </div>
                                        <div className="mt-4 flex gap-2">
                                            <button className={`w-full rounded-lg py-2 text-sm border ${S.border}`}>Suggest later</button>
                                            <button className={`w-full rounded-lg py-2 text-sm text-white bg-gradient-to-r ${G.brand}`}>Confirm slot</button>
                                        </div>
                                    </div>
                                </div>

                                {/* bottom rail */}
                                <div className="mt-6 grid sm:grid-cols-3 gap-4 p-2">
                                    {[
                                        { t: "Secure Messages", d: "Follow-ups, links, action items", i: MessageSquare },
                                        { t: "Smart Reminders", d: "Email & WhatsApp natively", i: Bell },
                                        { t: "Recordings", d: "Optional post-call access", i: Video },
                                    ].map((b) => (
                                        <div key={b.t} className={`rounded-xl border ${S.border} p-3 text-xs ${S.panelSolid}`}>
                                            <div className="flex items-center gap-2 font-semibold text-sm">
                                                <b.i size={16} /> {b.t}
                                            </div>
                                            <div className={`mt-1 ${T.muted}`}>{b.d}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* warm halo */}
                        <div className={`pointer-events-none absolute -inset-6 -z-10 blur-3xl opacity-40 bg-gradient-to-tr ${G.brandSoft}`} />
                    </div>

                    {/* integrations */}
                    <div className="flex flex-wrap items-center justify-center gap-2 mt-16">
                        <span className={`text-xs ${T.muted} mr-2`}>Payments & Calendars:</span>
                        {["Stripe", "Paystack", "Flutterwave", "Razorpay", "UPI", "Google Calendar", "Outlook", "Apple Calendar"].map((n) => (
                            <LogoPill key={n} name={n} />
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== VALUE STRIP (unique rail) ===== */}
            <section className="py-14 sm:py-20 relative">
                <BgBlobs variant="section" />
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-6">
                        {/* Left: narrative card */}
                        <div className={`rounded-3xl border ${S.border} ${S.panelLight} p-6 sm:p-8 ${SH.md}`}>
                            <div className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1 rounded-full border ${S.border}">
                                <Globe2 size={14} /> One-stop solution
                            </div>
                            <h2 className="mt-4 text-2xl sm:text-3xl font-bold">Why Mentora?</h2>
                            <p className={`mt-2 ${T.subtle}`}>Whether you’re an indie builder or a studio, Mentora streamlines your supply, booking, and cashflow in a single, consistent stack.</p>
                            <ul className="mt-6 space-y-3 text-sm">
                                {["Effortless discovery & filters", "Timezone-aware scheduling", "Clean payment rails & payouts", "Reviews that boost conversion"].map((x) => (
                                    <li key={x} className="flex items-center gap-2">
                                        <CheckCircle2 className="text-emerald-500" size={16} /> {x}
                                    </li>
                                ))}
                            </ul>
                            <Link to="/features" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 dark:text-indigo-300">
                                Explore features <ArrowRight size={16} />
                            </Link>
                        </div>

                        {/* Right: review showcase */}
                        <div className={`rounded-3xl border ${S.border} ${S.panelSolid} p-6 flex flex-col`}>
                            <div className="flex items-center gap-2 text-sm font-semibold">
                                <Star className="text-yellow-500" size={16} />
                                Reviews that sell for you
                            </div>
                            <div className="mt-4 grid gap-3 text-sm">
                                {["“Deployed in one evening. Booking + payments just worked.”", "“Mentors love the UX. Reviews boosted conversions.”"].map((q, i) => (
                                    <div key={i} className={`rounded-2xl border ${S.border} p-4 ${S.panelLight}`}>
                                        {q}
                                        <div className={`mt-2 text-xs ${T.muted}`}>— {i ? "Mason · Growth" : "Kelechi · Indie founder"}</div>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-auto pt-4">
                                <Link to="/testimonials" className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 dark:text-indigo-300">
                                    See all stories <ArrowRight size={16} />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== FEATURE SHOWCASE (staggered) ===== */}
            {/* ===== FEATURE SHOWCASE (staggered) ===== */}
            <section className="py-14 sm:py-20 relative border-t border-b border-zinc-200/70 dark:border-zinc-800">
                <BgBlobs variant="section" />
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h2 className="text-2xl sm:text-3xl font-bold">Everything you actually need</h2>
                        <p className={`mt-2 ${T.subtle}`}>No bloat—just the rails to run a mentorship marketplace.</p>
                    </div>

                    <div className="mt-10 grid lg:grid-cols-3 gap-6">
                        {/* ── Tall: Booking ───────────────────────────────── */}
                        <div className={`rounded-3xl border ${S.border} ${S.panelLight} p-6 lg:row-span-2`}>
                            <div className="flex items-center gap-2 text-sm font-semibold">
                                <CalendarCheck2 size={18} /> 1:1 & Group Booking
                            </div>
                            <p className={`mt-2 ${T.subtle}`}>Timezone aware. Calendar sync. Edge cases handled.</p>

                            {/* mini calendar + timezone hint */}
                            <div className={`mt-6 rounded-2xl border ${S.border} p-4`}>
                                {/* header */}
                                <div className="flex items-center justify-between">
                                    <div className="text-sm font-medium">Mar 10 – Mar 16</div>
                                    <div className="flex items-center gap-2">
                                        <span className="rounded-full border px-2 py-0.5 text-xs">UTC+01:00</span>
                                        <span className="rounded-full border px-2 py-0.5 text-xs">Auto-detect</span>
                                    </div>
                                </div>

                                {/* weekday row */}
                                <div className="mt-3 grid grid-cols-7 gap-2 text-[11px] text-center">
                                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
                                        <div key={d} className={`rounded-lg border ${S.border} py-1`}>
                                            {d}
                                        </div>
                                    ))}
                                </div>

                                {/* time slots */}
                                <div className="mt-2 grid grid-cols-7 gap-2">
                                    {[...Array(7)].map((_, col) => (
                                        <div key={col} className="space-y-2">
                                            {/* sample availability blocks */}
                                            <div className="h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30" />
                                            {col % 2 === 0 ? <div className="h-8 rounded-lg bg-blue-500/10 border border-blue-500/30" /> : null}
                                            {col === 2 ? <div className="h-12 rounded-lg bg-amber-500/10 border border-amber-500/30" /> : null}
                                        </div>
                                    ))}
                                </div>

                                {/* footer: avatars + ICS/GCal */}
                                <div className="mt-4 flex items-center justify-between">
                                    <div className="flex -space-x-2">
                                        <div className="h-6 w-6 rounded-full border border-white dark:border-zinc-900 bg-gradient-to-br from-pink-400 to-rose-400" />
                                        <div className="h-6 w-6 rounded-full border border-white dark:border-zinc-900 bg-gradient-to-br from-indigo-400 to-cyan-400" />
                                        <div className="h-6 w-6 rounded-full border border-white dark:border-zinc-900 bg-gradient-to-br from-amber-400 to-orange-500" />
                                    </div>
                                    <div className="flex gap-2">
                                        <button className="rounded-lg border px-2 py-1 text-xs">Add to Google</button>
                                        <button className="rounded-lg border px-2 py-1 text-xs">Export .ics</button>
                                    </div>
                                </div>
                            </div>

                            {/* tiny edge-case strip */}
                            <div className="mt-4 grid grid-cols-3 gap-2 text-[11px]">
                                {["DST handled", "No-show buffer", "Double-book guard"].map((t) => (
                                    <div key={t} className="rounded-lg border px-2 py-1 text-center">
                                        {t}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* ── Medium: Payments ────────────────────────────── */}
                        <div className={`rounded-3xl border ${S.border} ${S.panelSolid} p-6`}>
                            <div className="flex items-center gap-2 text-sm font-semibold">
                                <CreditCard size={18} /> Global Payments
                            </div>
                            <p className={`mt-2 ${T.subtle}`}>Stripe, Paystack, Flutterwave, Razorpay, UPI.</p>

                            <div className="mt-4 grid grid-cols-4 gap-2 text-xs">
                                {["Visa", "Mastercard", "UPI", "Bank"].map((p) => (
                                    <div key={p} className={`rounded-xl border ${S.border} p-3 text-center`}>
                                        {p}
                                    </div>
                                ))}
                            </div>

                            {/* payout summary */}
                            <div className={`mt-4 rounded-2xl border ${S.border} p-4`}>
                                <div className="flex items-center justify-between text-sm">
                                    <span>Next payout</span>
                                    <span className="font-medium">$1,842.00</span>
                                </div>
                                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-zinc-200/60 dark:bg-zinc-800">
                                    <div className="h-full w-2/3 bg-gradient-to-r from-emerald-400/80 to-emerald-500/80" />
                                </div>
                                <div className={`mt-2 text-[11px] ${T.subtle}`}>Processing settlements across gateways</div>
                            </div>
                        </div>

                        {/* ── Medium: Credits & Packages ──────────────────── */}
                        <div className={`rounded-3xl border ${S.border} ${S.panelSolid} p-6`}>
                            <div className="flex items-center gap-2 text-sm font-semibold">
                                <Wallet size={18} /> Credits & Packages
                            </div>
                            <p className={`mt-2 ${T.subtle}`}>One-offs, bundles, subscriptions—pick your model.</p>

                            {/* mini pack shelf */}
                            <div className="mt-4 grid grid-cols-3 gap-3">
                                {[
                                    { name: "Starter", note: "10 credits", price: "$9" },
                                    { name: "Pro", note: "50 credits", price: "$35" },
                                    { name: "Studio", note: "Monthly sub", price: "$29/mo" },
                                ].map((p) => (
                                    <div key={p.name} className={`rounded-2xl border ${S.border} p-3`}>
                                        <div className="text-sm font-semibold">{p.name}</div>
                                        <div className={`text-xs ${T.subtle}`}>{p.note}</div>
                                        <div className="mt-2 text-sm font-medium">{p.price}</div>
                                        <button className="mt-2 w-full rounded-lg border px-2 py-1 text-xs">Select</button>
                                    </div>
                                ))}
                            </div>

                            {/* usage bar */}
                            <div className={`mt-4 h-24 rounded-2xl border ${S.border} bg-gradient-to-r ${G.brandSoft}`} aria-hidden />
                        </div>

                        {/* ── Bottom: Secure Messages ─────────────────────── */}
                        <div className={`rounded-3xl border ${S.border} ${S.panelSolid} p-6`}>
                            <div className="flex items-center gap-2 text-sm font-semibold">
                                <MessageSquare size={18} /> Secure Messages
                            </div>
                            <p className={`mt-2 ${T.subtle}`}>Attachments, follow-ups, and reminders built-in.</p>

                            {/* chat preview */}
                            <div className={`mt-4 rounded-2xl border ${S.border} p-3`}>
                                <div className="space-y-2">
                                    <div className="flex items-start gap-2">
                                        <div className="h-6 w-6 shrink-0 rounded-full bg-gradient-to-br from-indigo-400 to-cyan-400" />
                                        <div className="max-w-[75%] rounded-2xl border px-3 py-2 text-xs">Hey! Sharing my availability for next week. Also attached the brief.</div>
                                    </div>
                                    <div className="flex items-start gap-2 justify-end">
                                        <div className="max-w-[75%] rounded-2xl border px-3 py-2 text-xs bg-emerald-500/10 border-emerald-500/30">Got it—Tuesday 2pm works. I’ll send the Zoom link.</div>
                                        <div className="h-6 w-6 shrink-0 rounded-full bg-gradient-to-br from-amber-400 to-orange-500" />
                                    </div>
                                </div>

                                {/* attachments row */}
                                <div className="mt-3 flex items-center gap-2">
                                    <div className="rounded-lg border px-2 py-1 text-[11px]">brief.pdf</div>
                                    <div className="rounded-lg border px-2 py-1 text-[11px]">portfolio.zip</div>
                                    <div className="ml-auto text-[11px] rounded-lg border px-2 py-1">Remind in 24h</div>
                                </div>
                            </div>
                        </div>

                        {/* ── Bottom: Disputes & KYC ──────────────────────── */}
                        <div className={`rounded-3xl border ${S.border} ${S.panelSolid} p-6`}>
                            <div className="flex items-center gap-2 text-sm font-semibold">
                                <ShieldCheck size={18} /> Disputes & KYC
                            </div>
                            <p className={`mt-2 ${T.subtle}`}>Admin controls to keep the marketplace safe.</p>

                            {/* status + checklist */}
                            <div className="mt-4 grid grid-cols-2 gap-3">
                                <div className={`rounded-2xl border ${S.border} p-3`}>
                                    <div className="text-xs font-medium">KYC Status</div>
                                    <div className="mt-2 flex items-center gap-2">
                                        <span className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px]">
                                            <span className="h-2 w-2 rounded-full bg-emerald-500" /> Verified
                                        </span>
                                        <span className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px]">Risk: Low</span>
                                    </div>
                                    <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-zinc-200/60 dark:bg-zinc-800">
                                        <div className="h-full w-4/5 bg-gradient-to-r from-emerald-400/80 to-emerald-500/80" />
                                    </div>
                                    <div className={`mt-2 text-[11px] ${T.subtle}`}>Proof of ID • Proof of Address • Liveness</div>
                                </div>

                                <div className={`rounded-2xl border ${S.border} p-3`}>
                                    <div className="text-xs font-medium">Dispute Center</div>
                                    <ul className="mt-2 space-y-2 text-[11px]">
                                        <li className="flex items-center justify-between rounded-lg border px-2 py-1">
                                            Chargeback • <span className="rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-300 px-2 py-0.5">Investigating</span>
                                        </li>
                                        <li className="flex items-center justify-between rounded-lg border px-2 py-1">
                                            Content violation • <span className="rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 px-2 py-0.5">Resolved</span>
                                        </li>
                                        <li className="flex items-center justify-between rounded-lg border px-2 py-1">
                                            Refund request • <span className="rounded-full bg-blue-500/15 text-blue-600 dark:text-blue-300 px-2 py-0.5">Pending</span>
                                        </li>
                                    </ul>
                                    <div className="mt-2 flex gap-2">
                                        <button className="w-full rounded-lg border px-2 py-1 text-[11px]">Open case</button>
                                        <button className="w-full rounded-lg border px-2 py-1 text-[11px]">Download log</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* ─────────────────────────────────────────────────── */}
                    </div>
                </div>
            </section>

            {/* ===== PRICING ===== */}
            <section className="py-14 sm:py-20 relative">
                <BgBlobs variant="section" />
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h2 className="text-2xl sm:text-3xl font-bold">Pick your license</h2>
                        <p className={`mt-2 ${T.subtle}`}>One-time license + mentorship until launch.</p>
                    </div>

                    <div className="mt-10 grid md:grid-cols-3 gap-6">
                        {[
                            { title: "Indie", price: "$249", popular: false, points: ["Single project", "All core features", "Email support"] },
                            { title: "Studio", price: "$499", popular: true, points: ["3 projects", "Priority support", "GTM playbook"] },
                            { title: "Enterprise", price: "Let’s talk", popular: false, points: ["Unlimited projects", "Custom clauses", "SLA & onboarding"] },
                        ].map((p) => (
                            <div key={p.title} className={`rounded-3xl border ${S.border} ${p.popular ? `${S.panelLight} ${SH.md}` : S.panelSolid} p-6`}>
                                {p.popular && <div className="inline-flex text-[10px] font-semibold px-2 py-1 rounded-full bg-gradient-to-r from-[#E0E7FF] to-white border border-white/60">Most popular</div>}
                                <div className="mt-2 flex items-baseline justify-between">
                                    <h3 className="text-lg font-semibold">{p.title}</h3>
                                    <div className="text-xl font-extrabold">{p.price}</div>
                                </div>
                                <ul className="mt-4 space-y-2 text-sm">
                                    {p.points.map((pt) => (
                                        <li key={pt} className="flex items-center gap-2">
                                            <CheckCircle2 size={16} className="text-emerald-500" />
                                            <span className="text-zinc-700 dark:text-zinc-300">{pt}</span>
                                        </li>
                                    ))}
                                </ul>
                                <Link to="/checkout" className={`mt-6 block w-full text-center rounded-2xl py-2 text-sm text-white bg-gradient-to-r ${G.brand} hover:shadow-sm`}>
                                    Choose {p.title}
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== CTA ===== */}
            <section className="py-16 sm:py-24 relative">
                <BgBlobs variant="section" className="opacity-25" />
                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
                    <h3 className={`text-2xl sm:text-3xl font-extrabold ${T.primary}`}>Build a real business that connects knowledge with curiosity.</h3>
                    <p className={`mt-3 ${T.subtle}`}>Grab the kit, follow the playbook, and have your marketplace ready tonight.</p>
                    <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
                        <ButtonPrimary>
                            <Link to="/checkout" className="inline-flex items-center gap-2">
                                Get Mentora <Rocket size={18} />
                            </Link>
                        </ButtonPrimary>
                        <ButtonGhost>
                            <Link to="/docs/mentora" className="inline-flex items-center gap-2">
                                Read Docs
                            </Link>
                        </ButtonGhost>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="relative border-t border-zinc-200/70 dark:border-zinc-800 py-8 text-center text-xs text-zinc-500 dark:text-zinc-400">© {new Date().getFullYear()} Mentora · Built by Desphixs</footer>
        </div>
    );
};

export default MentoraLanding;
