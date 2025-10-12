import React from "react";
import Header from "@/layout/Header";
import Footer from "@/layout/Footer";
import { Cookie, Clock, Search, Download, Printer, ToggleLeft, ToggleRight } from "lucide-react";

const ringIndigo =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#6366F1]/40";
const card =
  "rounded-2xl border border-[#E7E9FF] dark:border-[#2B2F55] bg-white/80 dark:bg-white/[0.05] backdrop-blur";
const chip =
  "inline-flex items-center gap-2 rounded-full border border-[#E7E9FF] dark:border-[#2B2F55] bg-white/60 dark:bg-white/[0.06] px-3 py-1 text-[11px] font-semibold";

type CookieRow = { name: string; purpose: string; category: "essential" | "analytics" | "marketing"; duration: string };

const COOKIE_ROWS: CookieRow[] = [
  { name: "_session", purpose: "Authenticate user session", category: "essential", duration: "Session" },
  { name: "mt_pref", purpose: "UI/theme preferences", category: "essential", duration: "12 months" },
  { name: "_ga", purpose: "Analytics (aggregate usage)", category: "analytics", duration: "24 months" },
  { name: "_ga_session", purpose: "Analytics session", category: "analytics", duration: "30 minutes" },
  { name: "_mkid", purpose: "Attribution/marketing performance", category: "marketing", duration: "3 months" },
];

export default function CookiePolicy() {
  const [q, setQ] = React.useState("");
  const [prefs, setPrefs] = React.useState<{ analytics: boolean; marketing: boolean }>({ analytics: true, marketing: false });

  const filtered = React.useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return COOKIE_ROWS;
    return COOKIE_ROWS.filter(
      (r) =>
        r.name.toLowerCase().includes(s) ||
        r.purpose.toLowerCase().includes(s) ||
        r.category.toLowerCase().includes(s) ||
        r.duration.toLowerCase().includes(s)
    );
  }, [q]);

  const lastUpdated = "Jan 7, 2025";
  const downloadTxt = () => {
    const header = "name,purpose,category,duration\n";
    const rows = COOKIE_ROWS.map((r) => [r.name, r.purpose, r.category, r.duration].map(csv).join(",")).join("\n");
    const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "mentora-cookies.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const toggle = (k: "analytics" | "marketing") => setPrefs((p) => ({ ...p, [k]: !p[k] }));

  return (
      <div className="px-2 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <Header/>
        <div className="flex flex-wrap items-center justify-between gap-3 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-10">
          <div className="flex items-center gap-3 ">
            <div className="h-11 w-11 rounded-2xl grid place-items-center border border-[#E7E9FF] dark:border-[#2B2F55] bg-white/70 dark:bg-white/[0.05]">
              <Cookie className="text-indigo-500" size={18} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#0F132E] dark:text-[#E9ECFF]">Cookie Policy</h1>
              <div className="text-xs text-[#6B72B3] dark:text-[#A7B0FF]/80 inline-flex items-center gap-2">
                <Clock size={12} /> Last updated {lastUpdated}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className={`${card} h-11 px-3.5 flex items-center gap-2`}>
              <Search size={16} className="text-[#5F679A] dark:text-[#A7B0FF]" />
              <input
                className={`bg-transparent outline-none text-sm w-56 sm:w-72 text-[#101436] dark:text-[#EEF0FF] placeholder-[#7A81B4] dark:placeholder-[#A7B0FF]/80 ${ringIndigo}`}
                placeholder="Search cookies"
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
            </div>
            <button className={chip} onClick={() => window.print()}>
              <Printer size={14} /> Print
            </button>
            <button className={chip} onClick={downloadTxt}>
              <Download size={14} /> Download
            </button>
          </div>
        </div>

        {/* Preferences */}
        <div className="mt-6 grid gap-3 sm:grid-cols-2 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className={`${card} p-4 `}>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold">Analytics cookies</div>
                <div className="text-xs text-[#5E66A6] dark:text-[#A7B0FF]/85">
                  Help us understand usage. Turning off reduces insights but keeps core features working.
                </div>
              </div>
              <button
                className="inline-flex items-center gap-2 rounded-xl border border-[#E7E9FF] dark:border-[#2B2F55] px-3 py-2 text-sm"
                onClick={() => toggle("analytics")}
              >
                {prefs.analytics ? <ToggleRight /> : <ToggleLeft />} {prefs.analytics ? "On" : "Off"}
              </button>
            </div>
          </div>
          <div className={`${card} p-4`}>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold">Marketing cookies</div>
                <div className="text-xs text-[#5E66A6] dark:text-[#A7B0FF]/85">
                  Personalize offers and measure campaigns. Optional by default.
                </div>
              </div>
              <button
                className="inline-flex items-center gap-2 rounded-xl border border-[#E7E9FF] dark:border-[#2B2F55] px-3 py-2 text-sm"
                onClick={() => toggle("marketing")}
              >
                {prefs.marketing ? <ToggleRight /> : <ToggleLeft />} {prefs.marketing ? "On" : "Off"}
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="mt-6 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className={`${card} overflow-hidden`}>
            <div className="px-4 py-3 text-sm font-semibold border-b border-[#E7E9FF] dark:border-[#2B2F55]">
              Cookies we use
            </div>
            <div className="w-full overflow-auto">
              <table className="min-w-[720px] w-full text-sm">
                <thead className="text-left">
                  <tr className="border-b border-[#E7E9FF] dark:border-[#2B2F55]">
                    {["Name", "Purpose", "Category", "Duration"].map((h) => (
                      <th key={h} className="px-4 py-3 text-[#6065A6] dark:text-[#A7B0FF]/80">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((r) => (
                    <tr key={r.name} className="border-b border-[#E7E9FF] dark:border-[#2B2F55] hover:bg-white/60 dark:hover:bg-white/[0.06]">
                      <td className="px-4 py-3 font-medium text-[#0F1536] dark:text-[#E7E9FF]">{r.name}</td>
                      <td className="px-4 py-3 text-[#2C3157] dark:text-[#C9D1FF]/85">{r.purpose}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 rounded-lg border text-[11px] ${
                            r.category === "essential"
                              ? "border-emerald-200/60 dark:border-emerald-700/40 text-emerald-600 dark:text-emerald-300 bg-emerald-50/70 dark:bg-emerald-900/20"
                              : r.category === "analytics"
                              ? "border-indigo-200/60 dark:border-indigo-700/40 text-indigo-600 dark:text-indigo-300 bg-indigo-50/70 dark:bg-indigo-900/20"
                              : "border-amber-200/60 dark:border-amber-700/40 text-amber-600 dark:text-amber-300 bg-amber-50/70 dark:bg-amber-900/20"
                          }`}
                        >
                          {r.category}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-[#2C3157] dark:text-[#C9D1FF]/85">{r.duration}</td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td className="px-4 py-6 text-[#5E66A6] dark:text-[#A7B0FF]/85" colSpan={4}>
                        No cookies match your search.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="px-4 py-3 text-[12px] text-[#6B72B3] dark:text-[#A7B0FF]/80">
              Essential cookies are required for core functionality and cannot be disabled.
            </div>
          </div>
        </div>

        <Footer/>
      </div>
  );
}

/* helpers */
function csv(v: string) {
  return `"${v.replace(/"/g, '""')}"`;
}
