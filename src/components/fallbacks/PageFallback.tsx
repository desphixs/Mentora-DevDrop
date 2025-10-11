import React from "react";
import { Loader2 } from "lucide-react";

type SkeletonKind = "none" | "cards" | "article" | "table";

export default function FullScreenLoader({
    title = "Loading…",
    subtitle = "Fetching the page module",
    skeleton: skeletonKind = "cards",
    progress, // 0..100 (optional, when you have determinate progress)
    brandGradient = "bg-gradient-to-r from-[#3B82F6] via-[#6366F1] to-[#8B5CF6]",
}: {
    title?: string;
    subtitle?: string;
    skeleton?: SkeletonKind;
    progress?: number;
    brandGradient?: string;
}) {
    const surface = "bg-[#F9FAFB] dark:bg-[#0A0A0A]";
    const textPrimary = "text-[#312E81] dark:text-[#E0E7FF]";
    const textSubtle = "text-zinc-600 dark:text-zinc-300/80";

    const reduceMotion = typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    return (
        <div className={`${surface} fixed inset-0 z-[60] flex flex-col items-center justify-center px-6`} role="status" aria-live="polite" aria-busy="true">
            {/* Brand mark */}
            <div className={`h-14 w-14 rounded-2xl ${brandGradient} shadow-sm grid place-items-center`} aria-hidden>
                <Loader2 className={`h-7 w-7 text-white ${reduceMotion ? "" : "animate-spin"}`} />
            </div>

            {/* Titles */}
            <div className="mt-5 text-center">
                <h2 className={`text-lg sm:text-xl font-semibold ${textPrimary}`}>{title}</h2>
                {subtitle && <p className={`mt-1 text-xs sm:text-sm ${textSubtle}`}>{subtitle}</p>}
            </div>

            {/* Optional progress */}
            {typeof progress === "number" && (
                <div className="mt-4 w-full max-w-md rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden" aria-label="Loading progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.max(0, Math.min(100, Math.round(progress)))} role="progressbar">
                    <div className={`h-2 ${brandGradient}`} style={{ width: `${Math.max(0, Math.min(100, progress))}%` }} />
                </div>
            )}

            {/* Skeletons */}
            {/* <div className="mt-8 w-full max-w-6xl">
                {skeletonKind === "cards" && <CardsSkeleton brandGradient={brandGradient} />}
                {skeletonKind === "article" && <ArticleSkeleton />}
                {skeletonKind === "table" && <TableSkeleton />}
            </div> */}
        </div>
    );
}

function shimmer(base = "bg-zinc-200 dark:bg-zinc-800") {
    return `${base} relative overflow-hidden before:content-[''] before:absolute before:inset-0 before:-translate-x-full before:bg-gradient-to-r before:from-transparent before:via-white/40 before:to-transparent before:animate-[shimmer_1.2s_infinite] dark:before:via-white/10`;
}

/* cards skeleton */
function CardsSkeleton({ brandGradient }: { brandGradient: string }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="rounded-2xl border border-zinc-200/70 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/40 p-5 backdrop-blur">
                    <div className="flex items-center gap-3">
                        <div className={`h-10 w-10 rounded-xl ${brandGradient} opacity-40`} />
                        <div className={`h-4 w-32 rounded ${shimmer()}`} />
                    </div>
                    <div className={`mt-3 h-3 w-4/5 rounded ${shimmer()}`} />
                    <div className={`mt-2 h-3 w-3/5 rounded ${shimmer()}`} />
                    <div className={`mt-4 h-24 w-full rounded-xl ${shimmer("bg-zinc-200/70 dark:bg-zinc-800/60")}`} />
                    <div className="mt-4 flex gap-2">
                        <div className={`h-9 w-24 rounded-xl ${brandGradient} opacity-40`} />
                        <div className={`h-9 w-24 rounded-xl ${shimmer()}`} />
                    </div>
                </div>
            ))}
        </div>
    );
}

/* article skeleton */
function ArticleSkeleton() {
    return (
        <div className="max-w-3xl mx-auto">
            <div className={`h-6 w-2/3 rounded ${shimmer()}`} />
            <div className={`mt-3 h-4 w-1/3 rounded ${shimmer()}`} />
            <div className="mt-6 space-y-3">
                {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className={`h-3 w-full rounded ${shimmer()}`} />
                ))}
            </div>
        </div>
    );
}

/* table skeleton */
function TableSkeleton() {
    return (
        <div className="rounded-2xl border border-zinc-200/70 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/40 p-5">
            <div className={`h-5 w-40 rounded ${shimmer()}`} />
            <div className="mt-4 space-y-3">
                {Array.from({ length: 6 }).map((_, r) => (
                    <div key={r} className="grid grid-cols-4 gap-3">
                        {Array.from({ length: 4 }).map((_, c) => (
                            <div key={c} className={`h-8 rounded ${shimmer()}`} />
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}
