// src/pages/mentee/MenteeAppLayout.tsx
import React from "react";
import { NavLink, useLocation, Link } from "react-router-dom";
import { useTheme } from "@/hooks/useTheme";
import TopBarFlash from "@/devdrop/TopBarFlash";

import { Menu, X, Search, Moon, Sun, LogOut, Home, Bell, MessageSquare, Star, User, CalendarCheck2, CreditCard, CheckCircle2, ClipboardList, Receipt, Coins, BadgeDollarSign, PlugZap, BellDot, KeyRound, Settings as SettingsIcon, HelpCircle, Ticket, Heart, Compass, ChevronDown, ChevronRight } from "lucide-react";

/* ---------------------------------
   Nav typing (MENTEE keys)
---------------------------------- */
export type NavKey =
    | "Dashboard"
    | "Discover"
    | "Messages"
    | "Favorites"
    | "Reviews"
    // booking
    | "BookingSelectSlot"
    | "BookingCheckout"
    | "BookingConfirm"
    // sessions
    | "Sessions"
    // billing
    | "BillingInvoices"
    | "BillingPaymentMethods"
    | "BillingSubscriptions"
    | "BillingCredits"
    // settings
    | "Settings"
    | "SettingsProfile"
    // | "SettingsIntegrations"
    // | "SettingsNotifications"
    // | "SettingsSecurity"
    // support
    // | "Support"
    // | "SupportTickets";

type Brand = { initials?: string; name?: string };

type Props = {
    children: React.ReactNode;
    active?: NavKey;
    brand?: Brand;
    searchPlaceholder?: string;
    onLogout?: () => void;
};

const BRAND_DEFAULT: Brand = { initials: "ME", name: "Mentora · Mentee" };

/* ---------------------------------
   Grouped NAV structure (MENTEE)
---------------------------------- */
type NavLeaf = {
    key: NavKey;
    label: string;
    to: string;
    icon?: React.ComponentType<any>;
    end?: boolean;
};

type NavGroup = {
    label: string;
    icon?: React.ComponentType<any>;
    to?: string;
    key?: NavKey;
    children?: Array<NavLeaf | NavGroup>;
};

export const NAV_GROUPS: NavGroup[] = [
    { label: "Dashboard", icon: Home, to: "/mentee", key: "Dashboard" },
    { label: "Discover", icon: Compass, to: "/mentee/discover", key: "Discover" },
    { label: "Messages", icon: MessageSquare, to: "/mentee/messages", key: "Messages" },
    { label: "Favorites", icon: Heart, to: "/mentee/favorites", key: "Favorites" },
    { label: "Reviews", icon: Star, to: "/mentee/reviews", key: "Reviews" },

    // Booking
    {
        label: "Booking",
        icon: CalendarCheck2,
        to: "/mentee/booking/select-slot",
        children: [
            { key: "BookingSelectSlot", label: "Select Slot", to: "/mentee/booking/select-slot", icon: CalendarCheck2 },
            { key: "BookingCheckout", label: "Checkout", to: "/mentee/booking/checkout", icon: CreditCard },
            { key: "BookingConfirm", label: "Confirmation", to: "/mentee/booking/confirm", icon: CheckCircle2 },
        ],
    },

    // Sessions (list + detail exists, nav links to list)
    {
        label: "Sessions",
        icon: ClipboardList,
        to: "/mentee/sessions",
        children: [{ key: "Sessions", label: "My Sessions", to: "/mentee/sessions", icon: ClipboardList }],
    },

    // Billing
    {
        label: "Billing",
        icon: BadgeDollarSign,
        to: "/mentee/billing/invoices",
        children: [
            { key: "BillingInvoices", label: "Invoices", to: "/mentee/billing/invoices", icon: Receipt },
            { key: "BillingPaymentMethods", label: "Payment Methods", to: "/mentee/billing/payment-methods", icon: CreditCard },
            { key: "BillingSubscriptions", label: "Subscriptions", to: "/mentee/billing/subscriptions", icon: BadgeDollarSign },
            { key: "BillingCredits", label: "Credits", to: "/mentee/billing/credits", icon: Coins },
        ],
    },

    // Settings (overview + tabs)
    {
        label: "Settings",
        icon: SettingsIcon,
        to: "/mentee/settings",
        children: [
            { key: "Settings", label: "General", to: "/mentee/settings", icon: SettingsIcon },
            { key: "SettingsProfile", label: "Profile", to: "/mentee/settings/profile", icon: User },
            // { key: "SettingsIntegrations", label: "Integrations", to: "/mentee/settings/integrations", icon: PlugZap },
            // { key: "SettingsNotifications", label: "Notifications", to: "/mentee/settings/notifications", icon: BellDot },
            // { key: "SettingsSecurity", label: "Security", to: "/mentee/settings/security", icon: KeyRound },
        ],
    },

    // Support
    // {
    //     label: "Support",
    //     icon: HelpCircle,
    //     to: "/mentee/support",
    //     children: [
    //         { key: "Support", label: "Help Center", to: "/mentee/support", icon: HelpCircle },
    //         { key: "SupportTickets", label: "Tickets", to: "/mentee/support/tickets", icon: Ticket },
    //     ],
    // },
    
];

/* ---------------------------------
   Shared UI bits
---------------------------------- */
const IconButton = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(({ className = "", ...props }, ref) => <button ref={ref} {...props} className={"rounded-lg p-2 hover:bg-zinc-100 dark:hover:bg-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 " + className} />);
IconButton.displayName = "IconButton";

/* ---------------------------------
   Sidebar components
---------------------------------- */
type SidebarMenuProps = {
    groups: NavGroup[];
    activeKey?: NavKey;
    onSelect?: () => void;
};

const SidebarMenu: React.FC<SidebarMenuProps> = ({ groups, activeKey, onSelect }) => {
    const location = useLocation();
    const [open, setOpen] = React.useState<Record<string, boolean>>({});

    React.useEffect(() => {
        const next: Record<string, boolean> = {};
        const mark = (items: NavGroup[], prefix = "") => {
            items.forEach((g, idx) => {
                const id = `${prefix}${g.label}-${idx}`;
                const anyActive = groupHasActive(g, location.pathname, activeKey);
                if (g.children?.length) next[id] = anyActive || open[id] || false;
                if (g.children?.length) mark(g.children.filter(isGroup) as NavGroup[], id + ">");
            });
        };
        mark(groups);
        setOpen((prev) => ({ ...prev, ...next }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location.pathname, activeKey]);

    const toggle = (id: string) => setOpen((s) => ({ ...s, [id]: !s[id] }));

    const renderGroups = (items: NavGroup[], depth = 0, prefix = "") =>
        items.map((g, idx) => {
            const id = `${prefix}${g.label}-${idx}`;
            const isOpen = !!open[id];
            const Icon = g.icon ?? ChevronRight;

            // Leaf-like group
            if (!g.children || g.children.length === 0) {
                return <SidebarLeaf key={id} item={{ key: (g.key as NavKey) ?? ("Dashboard" as NavKey), label: g.label, to: g.to || "#", icon: g.icon }} depth={depth} onSelect={onSelect} />;
            }

            return (
                <div key={id}>
                    <div className="flex items-center justify-between">
                        <div
                            className="flex-1 flex items-center gap-3 rounded-xl px-3 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-900"
                            onClick={() => {
                                if (!g.to) toggle(id);
                            }}
                        >
                            {Icon && <Icon className="h-4 w-4 text-zinc-500" />}
                            {g.to ? (
                                <NavLink to={g.to} className={({ isActive }) => `block ${isActive ? "text-zinc-900 dark:text-zinc-100" : ""}`} onClick={onSelect}>
                                    {g.label}
                                </NavLink>
                            ) : (
                                <span>{g.label}</span>
                            )}
                        </div>
                        <button className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900" aria-expanded={isOpen} aria-controls={`${id}-sub`} onClick={() => toggle(id)} aria-label={`Toggle ${g.label}`}>
                            <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                        </button>
                    </div>

                    <div id={`${id}-sub`} className={`pl-3 ml-2 border-l border-zinc-200/60 dark:border-zinc-800 overflow-hidden transition-[max-height,opacity] ${isOpen ? "max-h-[1200px] opacity-100" : "max-h-0 opacity-0"}`}>
                        <div className="py-1 space-y-1">
                            {g.children?.map((child, cidx) =>
                                isGroup(child) ? (
                                    <div key={`${id}-g-${cidx}`} className="mt-0.5">
                                        {renderGroups([child], depth + 1, id + ">")}
                                    </div>
                                ) : (
                                    <SidebarLeaf key={`${id}-l-${cidx}`} item={child as NavLeaf} depth={depth + 1} onSelect={onSelect} />
                                )
                            )}
                        </div>
                    </div>
                </div>
            );
        });

    return <div>{renderGroups(groups)}</div>;
};

const SidebarLeaf: React.FC<{ item: NavLeaf; depth: number; onSelect?: () => void }> = ({ item, depth, onSelect }) => {
    const location = useLocation();
    const isOn = matchPathStart(item.to, location.pathname);
    const Icon = item.icon;

    return (
        <NavLink
            to={item.to}
            end={item.end}
            onClick={onSelect}
            className={`group flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500
        ${isOn ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100" : "hover:bg-zinc-100 dark:hover:bg-zinc-900"}
        ${depth ? "ml-2" : ""}`}
        >
            {Icon && <Icon className={`h-4 w-4 ${isOn ? "text-zinc-900 dark:text-zinc-100" : "text-zinc-500"}`} />}
            <span>{item.label}</span>
        </NavLink>
    );
};

/* ---------------------------------
   utils
---------------------------------- */
const isGroup = (n: NavLeaf | NavGroup): n is NavGroup => (n as NavGroup).children !== undefined;

const matchPathStart = (to: string, pathname: string) => pathname === to || pathname.startsWith(to + "/");

const groupHasActive = (g: NavGroup, pathname: string, activeKey?: NavKey): boolean => {
    if (g.to && matchPathStart(g.to, pathname)) return true;
    if (g.children) {
        for (const c of g.children) {
            if (isGroup(c)) {
                if (groupHasActive(c, pathname, activeKey)) return true;
            } else {
                if (matchPathStart(c.to, pathname)) return true;
                if (activeKey && c.key === activeKey) return true;
            }
        }
    }
    return false;
};

/* ---------------------------------
   Layout (MENTEE)
---------------------------------- */
const MenteeAppLayout: React.FC<Props> = ({ children, active, brand = BRAND_DEFAULT, searchPlaceholder = "Search mentors, sessions, invoices…", onLogout = () => console.log("Logout clicked") }) => {
    const { theme, toggleTheme } = useTheme();
    const isDark = theme === "dark";

    const [sidebarOpen, setSidebarOpen] = React.useState(false);
    const [notifOpen, setNotifOpen] = React.useState(false);
    const [avatarOpen, setAvatarOpen] = React.useState(false);

    const notifRef = React.useRef<HTMLDivElement | null>(null);
    const avatarRef = React.useRef<HTMLDivElement | null>(null);
    const menuBtnRef = React.useRef<HTMLButtonElement | null>(null);

    React.useEffect(() => {
        const onEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                setSidebarOpen(false);
                setNotifOpen(false);
                setAvatarOpen(false);
                setTimeout(() => menuBtnRef.current?.focus(), 0);
            }
        };
        const onClick = (e: MouseEvent) => {
            if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
            if (avatarRef.current && !avatarRef.current.contains(e.target as Node)) setAvatarOpen(false);
        };
        document.addEventListener("keydown", onEsc);
        document.addEventListener("mousedown", onClick);
        return () => {
            document.removeEventListener("keydown", onEsc);
            document.removeEventListener("mousedown", onClick);
        };
    }, []);

    const RightControls = (
        <div className="flex items-center gap-2">
            <IconButton onClick={toggleTheme} aria-label="Toggle theme" title="Toggle theme">
                {isDark ? <Moon className="w-5 h-5 text-gray-300" /> : <Sun className="w-5 h-5 text-gray-600" />}
            </IconButton>

            <div className="relative" ref={notifRef}>
                <IconButton aria-expanded={notifOpen} aria-controls="notif-popover" aria-label="Notifications" onClick={() => setNotifOpen((v) => !v)}>
                    <Bell className="w-5 h-5" />
                </IconButton>
                <div id="notif-popover" role="menu" className={`absolute right-0 mt-2 w-80 rounded-2xl border border-zinc-200/60 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/70 backdrop-blur shadow-lg p-3 transition ${notifOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-1 pointer-events-none"}`}>
                    <div className="text-sm font-medium px-1">Notifications</div>
                    <ul className="mt-2 space-y-2 text-sm">
                        <li className="rounded-xl p-3 bg-zinc-50/80 dark:bg-zinc-950/40 border border-zinc-200/60 dark:border-zinc-800">Session reminder in 2 hours</li>
                        <li className="rounded-xl p-3 bg-zinc-50/80 dark:bg-zinc-950/40 border border-zinc-200/60 dark:border-zinc-800">Invoice #INV-204 paid</li>
                    </ul>
                </div>
            </div>

            <div className="relative" ref={avatarRef}>
                <button onClick={() => setAvatarOpen((v) => !v)} aria-expanded={avatarOpen} aria-controls="avatar-menu" aria-label="Open user menu" className="h-8 w-8 rounded-full bg-gradient-to-br from-zinc-900 to-zinc-700 dark:from-zinc-200 dark:to-zinc-400 text-white dark:text-zinc-900 text-sm font-semibold flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500">
                    {brand.initials || "ME"}
                </button>
                <div id="avatar-menu" role="menu" className={`absolute right-0 mt-2 w-44 rounded-2xl border border-zinc-200/60 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/70 backdrop-blur shadow-lg p-2 transition ${avatarOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-1 pointer-events-none"}`}>
                    <NavLink to="/mentee/settings/profile" className="block rounded-lg px-3 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800">
                        Profile
                    </NavLink>
                    <NavLink to="/mentee/settings" className="block rounded-lg px-3 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800">
                        Settings
                    </NavLink>
                    <button onClick={onLogout} className="w-full text-left rounded-lg px-3 py-2 text-sm hover:bg-red-50 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400">
                        Sign out
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen text-zinc-900 dark:text-zinc-100 bg-gradient-to-b from-white to-zinc-50 dark:from-zinc-950 dark:to-black">
            <TopBarFlash />

            {/* subtle glow accents */}
            <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10">
                <div className="mx-auto max-w-7xl blur-3xl opacity-30 dark:opacity-20">
                    <div className="h-72 w-72 rounded-full bg-zinc-200/60 dark:bg-zinc-700/40 absolute -top-10 -left-10" />
                    <div className="h-64 w-64 rounded-full bg-zinc-200/50 dark:bg-zinc-700/30 absolute top-40 right-0" />
                </div>
            </div>

            <div className="flex min-h-screen">
                {/* Sidebar (desktop) */}
                <aside
                    className="
            hidden lg:flex lg:w-[280px] lg:flex-col lg:justify-between
            lg:sticky lg:top-0 lg:h-screen lg:self-start
            lg:overflow-y-auto
            lg:border-r lg:border-zinc-200/60 dark:lg:border-zinc-800
            supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-zinc-950/40
            bg-white/70 dark:bg-zinc-900/60 backdrop-blur
          "
                >
                    <div>
                        <div className="h-16 flex items-center px-4 border-b border-zinc-200/60 dark:border-zinc-800">
                            <Link to={"/"}>
                                <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 text-white dark:bg-zinc-200 dark:text-zinc-900 shadow-sm">{brand.initials || "ME"}</span>
                            </Link>
                            <Link to={"/mentee"}>
                                <span className="ml-2 font-semibold tracking-tight">{brand.name || "Mentora · Mentee"}</span>
                            </Link>
                        </div>

                        <nav className="p-4 space-y-1.5" aria-label="Sidebar">
                            <SidebarMenu groups={NAV_GROUPS} activeKey={active} onSelect={() => {}} />
                        </nav>
                    </div>

                    {/* Bottom logout */}
                    <div className="p-4 border-t border-zinc-200/60 dark:border-zinc-800">
                        <button onClick={onLogout} className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 hover:bg-red-700 active:bg-red-800 text-white py-2.5 text-sm font-medium shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500">
                            <LogOut className="h-4 w-4" />
                            Logout
                        </button>
                    </div>
                </aside>

                {/* Mobile Sidebar (slide-over)
           NOTE: no aria-hidden here to avoid the “blocked aria-hidden” warning.
           We instead manage pointer events + opacity and return focus to the burger. */}
                <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? "" : "pointer-events-none"}`}>
                    <div
                        className={`absolute inset-0 bg-black/40 transition-opacity ${sidebarOpen ? "opacity-100" : "opacity-0"}`}
                        onClick={() => {
                            setSidebarOpen(false);
                            setTimeout(() => menuBtnRef.current?.focus(), 0);
                        }}
                    />
                    <div
                        className={`absolute left-0 top-0 h-full w-[88%] max-w-[320px]
              supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-zinc-950/40
              bg-white/70 dark:bg-zinc-900/60 backdrop-blur border-r border-zinc-200/60 dark:border-zinc-800 p-4
              transition-transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
                        role="dialog"
                        aria-modal="true"
                        aria-label="Navigation"
                    >
                        <div className="flex items-center justify-between h-12">
                            <div className="flex items-center">
                                <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 text-white dark:bg-zinc-200 dark:text-zinc-900 shadow-sm">{brand.initials || "ME"}</span>
                                <span className="ml-2 font-semibold tracking-tight">{brand.name || "Mentora · Mentee"}</span>
                            </div>
                            <IconButton
                                onClick={() => {
                                    setSidebarOpen(false);
                                    setTimeout(() => menuBtnRef.current?.focus(), 0);
                                }}
                                aria-label="Close menu"
                            >
                                <X className="h-5 w-5" />
                            </IconButton>
                        </div>

                        <nav className="mt-4 space-y-1.5 flex-1 overflow-y-auto pr-2 pb-24" aria-label="Mobile Sidebar">
                            <SidebarMenu
                                groups={NAV_GROUPS}
                                activeKey={active}
                                onSelect={() => {
                                    setSidebarOpen(false);
                                    setTimeout(() => menuBtnRef.current?.focus(), 0);
                                }}
                            />
                        </nav>

                        {/* Mobile logout pinned bottom */}
                        <div className="absolute shrink-0 sticky left-0 right-0 bottom-0 p-4 border-t border-zinc-200/60 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/60 backdrop-blur">
                            <button
                                onClick={() => {
                                    setSidebarOpen(false);
                                    setTimeout(() => menuBtnRef.current?.focus(), 0);
                                    onLogout();
                                }}
                                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 hover:bg-red-700 active:bg-red-800 text-white py-2.5 text-sm font-medium shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                            >
                                <LogOut className="h-4 w-4" />
                                Logout
                            </button>
                        </div>
                    </div>
                </div>

                {/* Main column */}
                <div className="flex-1 min-w-0">
                    {/* Header */}
                    <header className="sticky top-0 z-40 border-b border-zinc-200/60 dark:border-zinc-800 supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-zinc-950/40 bg-white/70 dark:bg-zinc-900/60 backdrop-blur">
                        {/* Mobile row */}
                        <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between lg:hidden">
                            <IconButton ref={menuBtnRef} onClick={() => setSidebarOpen(true)} aria-label="Open menu" aria-controls="mobile-sidebar" aria-expanded={sidebarOpen}>
                                <Menu className="h-6 w-6" />
                            </IconButton>
                            {RightControls}
                        </div>

                        {/* Desktop row */}
                        <div className="hidden lg:grid mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8 h-16 grid-cols-3 items-center gap-4">
                            <div className="flex items-center" />
                            <div className="col-span-1">
                                <label className="relative block">
                                    <span className="sr-only">Search</span>
                                    <span className="absolute inset-y-0 left-3 flex items-center">
                                        <Search className="h-4 w-4 text-zinc-500" />
                                    </span>
                                    <input type="search" placeholder={searchPlaceholder} className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white/70 dark:bg-zinc-900/60 pl-9 pr-3 py-2 text-sm placeholder-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500" />
                                </label>
                            </div>
                            <div className="flex justify-end items-center">{RightControls}</div>
                        </div>
                    </header>

                    {/* Content */}
                    <main className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8 py-6 lg:py-8">{children}</main>
                </div>
            </div>
        </div>
    );
};

export default MenteeAppLayout;
