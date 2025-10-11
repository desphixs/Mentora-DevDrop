// src/components/TopBarFlash.tsx
import * as React from "react";
import { X, Info, ShoppingCart, ExternalLink, Mail, MessageCircle, Check, DollarSign, Package, Rocket, Wrench, Instagram } from "lucide-react";

/** —— Mentora tokens —— */
const GRADIENT = "from-[#3D81F6] to-[#3D81F6]";
const PANEL = "bg-white/90 dark:bg-[#0d0e10]/90 backdrop-blur-lg";
const BORDER = "border border-black/5 dark:border-white/10";
const SOFT_HO = "hover:bg-black/[0.03] dark:hover:bg-white/[0.06]";
const TEXT_SO = "text-gray-600 dark:text-neutral-400";

/** —— Config (edit these) —— */
const DEFAULT_CONFIG = {
    label: "Mentora SaaS Kit",
    currencySymbol: "$",
    price: 49,
    buyCta: "Buy now",
    learnCta: "Learn more",
    contactCta: "Contact us",
    links: {
        patreon: "https://www.patreon.com/posts/mentora-saas-139960957", // PayPal or cards
        selar: "https://selar.com/mentora", // Cards, mobile money, bank xfer
    },
    contact: {
        email: "desphixs@gmail.com",
        whatsapp: "https://wa.me/2347040747760",
        instagram: "https://instagram.com/desphixs__",
    },
    tabs: {
        kit: {
            title: "What's inside?",
            icon: <Package className="h-4 w-4" />,
            items: ["Fullstack Codebase", "Monetization Plan", "Branding", "Mentorship till launch", "3 ads design", "6 email onboarding", "ROI calculator", "Free Domain and Hosting", "Free Database and Storae"],
        },
        features: {
            title: "SaaS Features",
            icon: <Rocket className="h-4 w-4" />,
            items: [
                "Mentor profiles with availability",
                "One-click booking + reminders",
                "Credits/subscriptions + secure payouts",
                "Ratings, reviews, and revenue reports",

                // new adds
                "Calendar sync (Google/Outlook/Apple) with timezone handling",
                "Sessions hub: requests, upcoming, and past",
                "In-app messaging for mentors & mentees",
                "Mentees management (lists, search, filters, notes)",
                "Offer builder: 1:1, packages, and group sessions",
                "Promo tools: coupons & discounts",
                "Finance suite: earnings, payouts, invoices, and taxes",
                "KYC/verification and profile controls",
            ],
        },
        tools: {
            title: "Dev Tools",
            icon: <Wrench className="h-4 w-4" />,
            items: ["Python & Django", "Django Restframework API", "React & Typescript", "PostgreSQL", "Tailwind + Shadcn", "Stripe, Paystack & Flutterwave"],
        },
    },
} as const;

type TopBarFlashProps = {
    config?: Partial<typeof DEFAULT_CONFIG>;
    localStorageKey?: string; // override if you want separate bars on diff pages
    sticky?: boolean;
};

export default function TopBarFlash({ config, localStorageKey = "lm_flashbar_dismissed_v1", sticky = true }: TopBarFlashProps) {
    const cfg = deepMerge(DEFAULT_CONFIG, config || {});
    const [open, setOpen] = React.useState(true);
    const [buyOpen, setBuyOpen] = React.useState(false);
    const [learnOpen, setLearnOpen] = React.useState(false);
    const [contactOpen, setContactOpen] = React.useState(false);
    const [activeTab, setActiveTab] = React.useState<"kit" | "features" | "tools">("kit");

    React.useEffect(() => {
        try {
            const dismissed = localStorage.getItem(localStorageKey);
            if (dismissed === "1") setOpen(false);
        } catch {}
    }, [localStorageKey]);

    const dismiss = () => {
        setOpen(false);
        try {
            localStorage.setItem(localStorageKey, "1");
        } catch {}
    };

    if (!open) return null;

    const Wrapper: any = sticky ? "div" : React.Fragment;
    const wrapperProps = sticky ? { className: "sticky top-0 z-50" } : {};

    return (
        <Wrapper {...(wrapperProps as any)}>
            <div role="region" aria-label="Mentora promo" className={`w-full bg-gradient-to-r ${GRADIENT} text-white`}>
                <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-2.5 sm:px-6 lg:px-8">
                    <Info className="hidden h-5 w-5 sm:block opacity-90" />
                    <div className="min-w-0 flex-1 truncate">
                        <span className="font-medium">{cfg.label}</span>
                        <span className="mx-2 opacity-70">—</span>
                        <span className="inline-flex items-center gap-1">
                            <DollarSign className="h-4 w-4 opacity-85" />
                            <span className="font-semibold">
                                {cfg.currencySymbol}
                                {cfg.price}
                            </span>
                            <span className="opacity-80">/ one-time</span>
                        </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <button onClick={() => setBuyOpen(true)} className="inline-flex items-center gap-2 rounded-lg bg-white px-3 py-1.5 text-sm font-medium text-gray-900 shadow-sm transition hover:opacity-95">
                            <ShoppingCart className="h-4 w-4" />
                            {cfg.buyCta}
                        </button>

                        <button
                            onClick={() => {
                                setActiveTab("kit");
                                setLearnOpen(true);
                            }}
                            className="inline-flex items-center gap-2 rounded-lg border border-white/25 bg-white/10 px-3 py-1.5 text-sm backdrop-blur-lg transition hover:bg-white/15"
                        >
                            {DEFAULT_CONFIG.tabs.kit.icon}
                            {cfg.learnCta}
                        </button>

                        {/* Contact (mobile = icon-only, desktop = full button) */}
                        <button onClick={() => setContactOpen(true)} aria-label={cfg.contactCta} className="inline-flex items-center justify-center rounded-lg border border-white/25 bg-white/10 p-2 text-sm backdrop-blur transition hover:bg-white/15 sm:hidden">
                            <Mail className="h-4 w-4" />
                        </button>

                        <button onClick={() => setContactOpen(true)} className="hidden sm:inline-flex items-center gap-2 rounded-lg border border-white/25 bg-white/10 px-3 py-1.5 text-sm backdrop-blur transition hover:bg-white/15">
                            <Mail className="h-4 w-4" />
                            {cfg.contactCta}
                        </button>

                        {/* <button aria-label="Dismiss promo" onClick={dismiss} className="ml-1 inline-grid h-8 w-8 place-items-center rounded-lg border border-white/20 bg-white/10 backdrop-blur-lg transition hover:bg-white/20">
                            <X className="h-4 w-4" />
                        </button> */}
                    </div>
                </div>
            </div>

            {/* Buy modal */}
            <Modal open={buyOpen} onClose={() => setBuyOpen(false)} title="Get the Mentora SaaS Kit">
                <div className="space-y-3 text-sm">
                    <p className={TEXT_SO}>Choose your preferred checkout:</p>
                    <a target="_blank" rel="noreferrer" href={cfg.links.patreon} className={`flex items-center justify-between rounded-xl px-3 shadow-lg py-2 ${PANEL} ${BORDER} ${SOFT_HO}`}>
                        <span className="inline-flex items-center gap-2">
                            <ShoppingCart className="h-4 w-4" />
                            Buy on Patreon
                        </span>
                        <span className={TEXT_SO}>(PayPal or credit/debit)</span>
                        <ExternalLink className="h-4 w-4 opacity-70" />
                    </a>

                    <a target="_blank" rel="noreferrer" href={cfg.links.selar} className={`flex items-center justify-between rounded-xl px-3 py-2 shadow-lg ${PANEL} ${BORDER} ${SOFT_HO}`}>
                        <span className="inline-flex items-center gap-2">
                            <ShoppingCart className="h-4 w-4" />
                            Buy on Selar
                        </span>
                        <span className={TEXT_SO}>(Card, mobile money, bank transfer)</span>
                        <ExternalLink className="h-4 w-4 opacity-70" />
                    </a>

                    <div className="mt-2 text-xs text-gray-400 dark:text-neutral-500">After purchase you’ll receive the repo access + onboarding checklist in minutes.</div>
                </div>
            </Modal>

            {/* Learn modal with Tabs */}
            <Modal open={learnOpen} onClose={() => setLearnOpen(false)} title="What you’ll get">
                <Tabs
                    active={activeTab}
                    onChange={(t) => setActiveTab(t as any)}
                    tabs={[
                        { key: "kit", label: cfg.tabs.kit.title, icon: DEFAULT_CONFIG.tabs.kit.icon },
                        { key: "features", label: cfg.tabs.features.title, icon: DEFAULT_CONFIG.tabs.features.icon },
                        { key: "tools", label: cfg.tabs.tools.title, icon: DEFAULT_CONFIG.tabs.tools.icon },
                    ]}
                />
                <div className="mt-4 space-y-2">
                    {getTabItems(cfg, activeTab).map((item, i) => (
                        <div key={i} className={`flex items-start gap-2 rounded-xl px-3 py-2 ${PANEL} ${BORDER}`}>
                            <Check className="mt-0.5 h-4 w-4 text-emerald-500" />
                            <span className="text-sm">{item}</span>
                        </div>
                    ))}
                </div>
                <div className="mt-4 flex justify-end">
                    <button
                        onClick={() => {
                            setLearnOpen(false);
                            setBuyOpen(true);
                        }}
                        className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#8060F5]  to-[#8060F5] px-3 py-2 text-sm font-medium text-white hover:opacity-95"
                    >
                        <ShoppingCart className="h-4 w-4" /> Buy now
                    </button>
                </div>
            </Modal>

            {/* Contact modal */}
            <Modal open={contactOpen} onClose={() => setContactOpen(false)} title="Contact us">
                <div className="grid gap-3 text-sm sm:grid-cols-1">
                    <a href={`mailto:${cfg.contact.email}`} className={`flex items-center justify-between rounded-xl px-3 py-2 ${PANEL} ${BORDER} ${SOFT_HO}`}>
                        <span className="inline-flex items-center gap-2">
                            <Mail className="h-4 w-4" /> Email - {cfg.contact.email}
                        </span>
                        <ExternalLink className="h-4 w-4 opacity-70" />
                    </a>
                    <a href={cfg.contact.whatsapp} target="_blank" rel="noreferrer" className={`flex items-center justify-between rounded-xl px-3 py-2 ${PANEL} ${BORDER} ${SOFT_HO}`}>
                        <span className="inline-flex items-center gap-2">
                            <MessageCircle className="h-4 w-4" /> WhatsApp chat - +2347040747760
                        </span>
                        <ExternalLink className="h-4 w-4 opacity-70" />
                    </a>

                    <a href={cfg.contact.instagram} target="_blank" rel="noreferrer" className={`flex items-center justify-between rounded-xl px-3 py-2 ${PANEL} ${BORDER} ${SOFT_HO}`}>
                        <span className="inline-flex items-center gap-2">
                            <Instagram className="h-4 w-4" /> Instagram DM
                        </span>
                        <ExternalLink className="h-4 w-4 opacity-70" />
                    </a>
                </div>
            </Modal>
        </Wrapper>
    );
}

import { createPortal } from "react-dom";

function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
    // ESC to close
    React.useEffect(() => {
        const onEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        if (open) document.addEventListener("keydown", onEsc);
        return () => document.removeEventListener("keydown", onEsc);
    }, [open, onClose]);

    // lock scroll while modal is open
    React.useEffect(() => {
        if (!open) return;
        const prev = document.documentElement.style.overflow;
        document.documentElement.style.overflow = "hidden";
        return () => {
            document.documentElement.style.overflow = prev;
        };
    }, [open]);

    if (!open) return null;

    // render at <body> level so it sits above the sticky Header/TopBar
    return createPortal(
        <div className="fixed inset-0 z-[80]" role="dialog" aria-modal="true">
            {/* FULL-PAGE OVERLAY with blur */}
            <div
                onClick={onClose}
                aria-hidden
                className="absolute inset-0 bg-black/55 dark:bg-black/70
                   backdrop-blur-lg sm:backdrop-blur-lg backdrop-saturate-150
                   transition-opacity"
            />
            {/* modal panel */}
            <div className="absolute inset-0 grid place-items-center p-4">
                <div
                    className={`w-full max-w-lg rounded-2xl p-4 shadow-xl
                      bg-white/90 dark:bg-[#0d0e10]/90 backdrop-blur-lg
                      border border-black/5 dark:border-white/10`}
                >
                    <div className="mb-2 flex items-center justify-between">
                        <div className="text-lg font-semibold">{title}</div>
                        <button
                            aria-label="Close"
                            onClick={onClose}
                            className="inline-grid h-8 w-8 place-items-center rounded-lg
                         text-gray-600 hover:bg-black/5
                         dark:text-neutral-300 dark:hover:bg-white/10"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none">
                                <path stroke="currentColor" strokeWidth="1.5" d="M6 6l12 12M18 6L6 18" />
                            </svg>
                        </button>
                    </div>
                    {children}
                </div>
            </div>
        </div>,
        document.body
    );
}

/** —— Tabs primitive —— */
function Tabs({ tabs, active, onChange }: { tabs: { key: string; label: string; icon?: React.ReactNode }[]; active: string; onChange: (key: string) => void }) {
    return (
        <div className="grid grid-cols-3 gap-2">
            {tabs.map((t) => (
                <button key={t.key} onClick={() => onChange(t.key)} className={`inline-flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm ${PANEL} ${BORDER} ${active === t.key ? "ring-2 ring-[#B47645]/30" : "hover:bg-white dark:hover:bg-[#101216]"}`}>
                    {t.icon}
                    {t.label}
                </button>
            ))}
        </div>
    );
}

/** —— helpers —— */
function getTabItems(cfg: typeof DEFAULT_CONFIG, tab: "kit" | "features" | "tools"): string[] {
    return tab === "kit" ? cfg.tabs.kit.items : tab === "features" ? cfg.tabs.features.items : cfg.tabs.tools.items;
}
function deepMerge<T extends object>(base: T, patch: Partial<T>): T {
    const out: any = Array.isArray(base) ? [...(base as any)] : { ...base };
    for (const k in patch) {
        const v: any = (patch as any)[k];
        if (v && typeof v === "object" && !Array.isArray(v)) out[k] = deepMerge((base as any)[k] ?? {}, v);
        else out[k] = v;
    }
    return out;
}
