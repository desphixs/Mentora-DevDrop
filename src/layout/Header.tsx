import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Moon, Sun, Home, TrendingUp, Boxes, Target } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/hooks/useTheme";
import TopBarFlash from "@/devdrop/TopBarFlash";

// src/theme/colors.ts
export const COLORPALLETE = {
    name: "Mentora",
    color: {
        // Blue–Indigo–Violet pulled from the logo
        primary: "#3B82F6", // bright blue
        primaryDark: "#4F46E5", // indigo
        primaryDeep: "#3730A3", // deep indigo
        accent: "#8B5CF6", // violet
        accentLite: "#A78BFA", // soft violet
        surface: "#F9FAFB", // neutral light surface
        darkBg: "#0A0A0A", // app dark background
    },
    gradient: {
        brand: "from-[#3B82F6] via-[#6366F1] to-[#8B5CF6]", // blue → indigo → violet
        brandSoft: "from-[#E0EAFF] via-[#EEF2FF] to-[#F5F3FF]", // soft tints of same hues
    },
    ring: "focus-visible:ring-[#8B5CF6]/40", // violet ring for focus states
    textPrimaryClass: "text-[#312E81] dark:text-[#E0E7FF]", // deep indigo on light, indigo-100 on dark
};

type HeaderProps = {
    logoText?: string;
    logoSrc?: string; // optional explicit logo
    sticky?: boolean;
};

const NAV_ITEMS = [
    { label: "Home", to: "/" },
    { label: "Pricing", to: "/pricing" },
    { label: "Contact", to: "/contact" },
    { label: "Mentee Dashboard", to: "/mentee" },
    { label: "Mentor Dashboard", to: "/dashboard" },
];

const CTA = { label: "Login", to: "/login" };

export default function Header({ logoText = "Mentora", logoSrc = "logoPng", sticky = true }: HeaderProps) {
    const [open, setOpen] = React.useState(false);
    const { isLoggedIn, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const isDark = theme === "dark";
    const navigate = useNavigate();

    const onLogout = async () => {
        try {
            logout();
            navigate("/login");
            toast.success("Logout successful");
        } catch (error) {
            console.log(error);
        }
    };

    // close mobile menu on resize
    React.useEffect(() => {
        const onResize = () => window.innerWidth >= 768 && setOpen(false);
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, []);

    const Wrapper: any = sticky ? "div" : React.Fragment;
    const wrapperProps = sticky
        ? {
              className: "sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-white/70 dark:supports-[backdrop-filter]:bg-[#0b0b0c]/70 shadow-[0_1px_0_0_rgba(17,24,39,0.06)] dark:shadow-[0_1px_0_0_rgba(255,255,255,0.06)]",
          }
        : {};

    return (
        <Wrapper {...(wrapperProps as any)}>
            <TopBarFlash />
            <header className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between gap-3">
                    {/* Brand */}
                    <Link to="/" className={`group inline-flex items-center gap-2 rounded-lg focus-visible:outline-none ${COLORPALLETE.ring}`}>
                        <span className={`text-[18px] font-semibold tracking-tight ${COLORPALLETE.textPrimaryClass}`}>
                            {logoText}
                            <span className="ml-1 inline-block rounded px-1.5 py-0.5 text-xs font-semibold text-white bg-gradient-to-r from-[#3D81F5] to-[#6965F2] translate-y-[-1px]">SaaS</span>
                        </span>
                    </Link>

                    {/* Desktop nav */}
                    <nav className="hidden md:flex md:items-center md:gap-1">
                        {NAV_ITEMS.map((item) => (
                            <NavLink key={item.label} to={item.to} className={({ isActive }) => ["relative rounded-xl px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none", COLORPALLETE.ring, isActive ? "text-gray-900 dark:text-white" : "text-gray-600 hover:text-gray-900 dark:text-neutral-300 dark:hover:text-white"].join(" ")}>
                                {({ isActive }) => (
                                    <>
                                        {item.label}
                                        <span className={["absolute left-3 right-3 -bottom-[2px] h-[2px] rounded-full bg-gradient-to-r", "from-[#3D81F5] to-[#6965F2] transition-opacity duration-300", isActive ? "opacity-100" : "opacity-0 group-hover:opacity-60"].join(" ")} />
                                    </>
                                )}
                            </NavLink>
                        ))}
                        {isLoggedIn && (
                            <NavLink to="/dashboard" className="rounded-xl px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-neutral-200 dark:hover:text-white">
                                Dashboard
                            </NavLink>
                        )}
                    </nav>

                    {/* Right actions */}
                    <div className="flex items-center gap-2">
                        {/* Theme toggle */}
                        <button onClick={toggleTheme} aria-label="Toggle theme" title="Toggle theme" className={`inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-black/5 bg-white text-gray-700 shadow-sm transition hover:bg-gray-50 focus-visible:outline-none ${COLORPALLETE.ring} dark:border-white/10 dark:bg-[#101113] dark:text-white dark:hover:bg-[#131416]`}>
                            {isDark ? <Moon className="h-5 w-5 text-gray-300" /> : <Sun className="h-5 w-5 text-gray-500" />}
                        </button>

                        {/* Auth / CTA (desktop) */}
                        {isLoggedIn ? (
                            <button onClick={onLogout} className={`hidden md:inline-flex items-center justify-center rounded-2xl px-4 py-2.5 text-sm font-medium text-white shadow-sm transition bg-gradient-to-r ${COLORPALLETE.gradient.brand} hover:opacity-95 focus-visible:outline-none ${COLORPALLETE.ring}`}>
                                Logout
                            </button>
                        ) : (
                            <Link to={CTA.to} className={`hidden md:inline-flex items-center justify-center rounded-2xl px-4 py-2.5 text-sm font-medium text-white shadow-sm transition bg-gradient-to-r ${COLORPALLETE.gradient.brand} hover:opacity-95 focus-visible:outline-none ${COLORPALLETE.ring}`}>
                                {CTA.label}
                            </Link>
                        )}

                        {/* Mobile menu btn */}
                        <button onClick={() => setOpen((s) => !s)} aria-label="Toggle navigation" className={`inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-black/5 bg-white text-gray-700 shadow-sm transition hover:bg-gray-50 focus-visible:outline-none md:hidden dark:border-white/10 dark:bg-[#101113] dark:text-white dark:hover:bg-[#131416] ${COLORPALLETE.ring}`}>
                            <span className="text-lg">{open ? "✕" : "☰"}</span>
                        </button>
                    </div>
                </div>

                {/* Mobile drawer (animated) */}
                <AnimatePresence initial={false}>
                    {open && (
                        <motion.div key="mobile-drawer" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25, ease: "easeOut" }} className="md:hidden overflow-hidden">
                            <div className="mb-3 rounded-2xl border border-black/5 bg-white p-3 shadow-lg dark:border-white/10 dark:bg-[#0f0f10]">
                                <nav className="flex flex-col">
                                    {NAV_ITEMS.map((item) => (
                                        <NavLink key={item.label} to={item.to} onClick={() => setOpen(false)} className={({ isActive }) => ["rounded-xl px-3 py-2 text-sm font-medium focus-visible:outline-none", COLORPALLETE.ring, isActive ? "bg-[#FFF1E6] text-gray-900 dark:bg-white/5 dark:text-white" : "text-gray-800 hover:bg-[#FFF1E6] dark:text-neutral-200 dark:hover:bg-white/5"].join(" ")}>
                                            {item.label}
                                        </NavLink>
                                    ))}
                                    {isLoggedIn ? (
                                        <button
                                            onClick={() => {
                                                onLogout?.();
                                                setOpen(false);
                                            }}
                                            className={`mt-2 inline-flex items-center justify-center rounded-2xl px-4 py-2.5 text-sm font-medium text-white shadow-sm transition bg-gradient-to-r from-[#C4470E] to-[#3D81F5] hover:opacity-95 focus-visible:outline-none ${COLORPALLETE.ring}`}
                                        >
                                            Logout
                                        </button>
                                    ) : (
                                        <Link to={CTA.to} onClick={() => setOpen(false)} className={`mt-2 inline-flex items-center justify-center rounded-2xl px-4 py-2.5 text-sm font-medium text-white shadow-sm transition bg-gradient-to-r from-[#3D81F5] via-[#F18324] to-[#6965F2] hover:opacity-95 focus-visible:outline-none ${COLORPALLETE.ring}`}>
                                            {CTA.label}
                                        </Link>
                                    )}
                                </nav>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </header>
            {/* subtle gradient border */}
            <div className={`h-[2px] w-full bg-gradient-to-r ${COLORPALLETE.gradient.brand}`} />
        </Wrapper>
    );
}
