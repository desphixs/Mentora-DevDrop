// src/pages/Signup.tsx
import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Header from "@/layout/Header";
import { Mail, User2, Lock, Eye, EyeOff, Loader2 } from "lucide-react";

/** Centralized color tokens (single source of truth) */
const COLORS = {
    // Brand / primary
    brandStart: "#3D81F6",
    brandEnd: "#865DF5",

    // Surfaces / borders
    panelLightBG: "rgba(255, 255, 255, 0.90)", // was bg-white/90
    panelDarkBG: "rgba(13, 14, 16, 0.90)", // was #0d0e10/90
    borderLight: "rgba(0, 0, 0, 0.05)", // was border-black/5
    borderDark: "rgba(255, 255, 255, 0.10)", // was white/10

    // Canvas accents (radials)
    canvasSoft1: "#FAF4ED",
    canvasSoft2: "#FFF8F0",

    // Ambient glows
    glow1: "rgba(217, 160, 102, 0.10)", // was #D9A066/10
    glow2: "rgba(180, 118, 69, 0.10)", // was #B47645/10
    glow3: "#3D81F6/15", // was #B47645/15
    glow4: "#3D81F6/15", // was #D9A066/15

    // Texts / links
    heading: "#3D81F6", // same as brandStart for header emphasis
    link: "#3D81F6",

    // Error (shared light/dark that still reads clean)
    errBg: "rgba(255, 71, 87, 0.10)",
    errBorder: "rgba(255, 71, 87, 0.35)",
    errText: "#FF8A8A",
};

/** Expose colors to Tailwind via CSS vars so we can use arbitrary values in classes */
const cssVars: React.CSSProperties = {
    // Brand stops
    ["--brand-start" as any]: COLORS.brandStart,
    ["--brand-end" as any]: COLORS.brandEnd,

    // Surfaces / borders
    ["--panel-light" as any]: COLORS.panelLightBG,
    ["--panel-dark" as any]: COLORS.panelDarkBG,
    ["--border-light" as any]: COLORS.borderLight,
    ["--border-dark" as any]: COLORS.borderDark,

    // Canvas accents
    ["--canvas-1" as any]: COLORS.canvasSoft1,
    ["--canvas-2" as any]: COLORS.canvasSoft2,

    // Glows
    ["--glow-1" as any]: COLORS.glow1,
    ["--glow-2" as any]: COLORS.glow2,
    ["--glow-3" as any]: COLORS.glow3,
    ["--glow-4" as any]: COLORS.glow4,

    // Text/link
    ["--heading" as any]: COLORS.heading,
    ["--link" as any]: COLORS.link,
};

/** Utility class tokens that read from the CSS vars above */
const GRADIENT = "from-[var(--brand-start)] to-[var(--brand-end)]"; // bg-gradient-to-r + these stops
const PANEL = "bg-[var(--panel-light)] dark:bg-[var(--panel-dark)] backdrop-blur-sm";
const BORDER = "border border-[var(--border-light)] dark:border-[var(--border-dark)]";
const INPUT = "w-full rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--brand-end)] " + PANEL + " " + BORDER;

const Login: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const redirect = searchParams.get("redirect") || "/dashboard";
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPw, setShowPw] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [err, setErr] = useState<string | null>(null);

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErr(null);

        if (!email.trim() || !password.trim()) {
            setErr("Email and password are required.");
            return;
        }

        // Simulate network + creation
        try {
            setSubmitting(true);
            await new Promise((r) => setTimeout(r, 900)); // fake latency
            const user = {
                email: email.trim(),
                username: username.trim() || null,
                createdAt: new Date().toISOString(),
            };
            navigate(redirect, { replace: true });
        } catch {
            setErr("Could not create account. Try a different email/username.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            <Header />
            <main
                className={
                    "relative grid min-h-[calc(100dvh-64px)] place-items-center overflow-hidden " +
                    // Light background with radial accents (uses vars)
                    "bg-[radial-gradient(90%_50%_at_10%_0%,var(--canvas-1)_0%,white_60%),radial-gradient(90%_50%_at_100%_100%,var(--canvas-2)_0%,white_60%)] " +
                    // Dark gradient canvas
                    "p-4 text-gray-900 dark:bg-gradient-to-b dark:from-black dark:via-neutral-950 dark:to-black dark:text-white"
                }
                style={cssVars}
            >
                {/* Ambient glows (read from vars) */}
                <div className="pointer-events-none absolute inset-0">
                    {/* Light-only */}
                    <div className="absolute -top-20 left-[-10%] hidden h-64 w-64 rounded-full blur-3xl sm:block dark:hidden bg-[var(--glow-1)]" />
                    <div className="absolute -bottom-24 right-[-10%] hidden h-64 w-64 rounded-full blur-3xl sm:block dark:hidden bg-[var(--glow-2)]" />
                    {/* Dark-only */}
                    <div className="absolute -top-40 left-1/2 hidden h-80 w-80 -translate-x-1/2 rounded-full bg-white/10 blur-3xl dark:block" />
                    <div className="absolute bottom-0 left-1/3 hidden h-64 w-64 -translate-x-1/2 rounded-full blur-3xl dark:block bg-[var(--glow-3)]" />
                    <div className="absolute -bottom-24 right-1/4 hidden h-64 w-64 translate-x-1/2 rounded-full blur-3xl dark:block bg-[var(--glow-4)]" />
                </div>

                <div className="w-full max-w-md">
                    {/* Header */}
                    <div className="mb-6 text-center">
                        <h1 className="text-3xl font-bold tracking-tight text-[var(--heading)]">Welcome Back 👋</h1>
                        <p className="mt-1 text-sm text-gray-600 dark:text-neutral-400">Login to continue to your dashboard</p>
                    </div>

                    {/* Card */}
                    <div className={`rounded-2xl p-6 shadow-xl ${PANEL} ${BORDER}`}>
                        {err && (
                            <div
                                className="mb-4 rounded-xl border p-3 text-sm"
                                style={{
                                    backgroundColor: COLORS.errBg,
                                    borderColor: COLORS.errBorder,
                                    color: COLORS.errText,
                                }}
                            >
                                {err}
                            </div>
                        )}

                        <form onSubmit={onSubmit} className="space-y-4">
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-neutral-300">Email</label>
                                <div className="relative">
                                    <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                    <input type="email" autoComplete="email" placeholder="you@leasemate.app" value={email} onChange={(e) => setEmail(e.target.value)} className={`${INPUT} pl-9`} />
                                </div>
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-neutral-300">Password</label>
                                <div className="relative">
                                    <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                    <input type={showPw ? "text" : "password"} autoComplete="new-password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className={`${INPUT} pl-9 pr-10`} />
                                    <button type="button" aria-label={showPw ? "Hide password" : "Show password"} onClick={() => setShowPw((s) => !s)} className="absolute inset-y-0 right-0 grid w-10 place-items-center text-gray-500 hover:text-gray-800 dark:text-neutral-400 dark:hover:text-neutral-200">
                                        {showPw ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                            </div>

                            <button type="submit" disabled={submitting} className={`group relative w-full overflow-hidden rounded-xl bg-gradient-to-r ${GRADIENT} px-4 py-2.5 text-white transition hover:opacity-95 disabled:opacity-60`}>
                                <span className="absolute inset-0 -z-10 bg-white/0 opacity-0 transition-opacity duration-300 group-hover:opacity-10" />
                                <span className="inline-flex items-center justify-center gap-2">
                                    {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                                    {submitting ? "Processing" : "Sign In"}
                                </span>
                            </button>
                        </form>

                        <p className="mt-6 text-center text-sm text-gray-600 dark:text-neutral-400">
                            Don't have an account yet?{" "}
                            <Link to="/signup" className="font-medium underline underline-offset-4 text-[var(--link)] hover:opacity-90">
                                Sign up
                            </Link>
                        </p>
                    </div>
                </div>
            </main>
        </>
    );
};

export default Login;
