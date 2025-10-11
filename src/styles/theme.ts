// src/styles/theme.ts
export const THEME = {
    name: "Mentora",
    brand: {
        // Core hues (inspired by your reference UI)
        blue: "#5B72F6", // primary blue/indigo bridge
        indigo: "#6366F1", // indigo 500
        violet: "#8B5CF6", // violet 500
        dark: "#1F2546",
    },
    surfaces: {
        // soft app backgrounds
        base: "bg-[#F6F7FF] dark:bg-[#0B0B12]",
        panelLight: "bg-white/75 dark:bg-zinc-900/50 backdrop-blur",
        panelSolid: "bg-white dark:bg-zinc-900",
        border: "border-zinc-200/70 dark:border-zinc-800",
    },
    text: {
        primary: "text-[#0F172A] dark:text-[#E0E7FF]",
        subtle: "text-zinc-600 dark:text-zinc-300/80",
        muted: "text-zinc-500 dark:text-zinc-400",
    },
    gradients: {
        brand: "from-[#5B72F6] via-[#6366F1] to-[#8B5CF6]",
        brandSoft: "from-[#EEF2FF] via-[#F5F6FF] to-[#FFFFFF]",
        glowBlue: "from-[#C7D2FE] via-[#E0E7FF] to-transparent",
    },
    rings: {
        brand: "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#8B5CF6]/40",
    },
    shadows: {
        sm: "shadow-[0_8px_24px_rgba(17,24,39,0.06)]",
        md: "shadow-[0_20px_40px_rgba(17,24,39,0.08)]",
    },
};
