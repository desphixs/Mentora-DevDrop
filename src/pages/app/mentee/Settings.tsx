import React from "react";
import MenteeAppLayout from "./MenteeAppLayout";
import {
  Settings,
  Globe,
  Calendar,
  Clock,
  MapPin,
  Check,
  ChevronDown,
  X,
  Loader2,
  Filter,
  Power,
  Link2,
  RefreshCw,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Search,
} from "lucide-react";

/** ──────────────────────────────────────────────────────────────────────────
 *  THEME TOKENS (dark-mode accurate)
 *  ────────────────────────────────────────────────────────────────────────── */
const surface = "bg-white/80 dark:bg-zinc-900/60";
const surfaceSolid = "bg-white dark:bg-zinc-900";
const surfaceElev = "bg-white/95 dark:bg-zinc-900/95 backdrop-blur";
const border = "border-zinc-200/60 dark:border-zinc-800";
const text = "text-zinc-900 dark:text-zinc-100";
const subtext = "text-zinc-600 dark:text-zinc-400";
const ringIndigo =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500/40";

/** ──────────────────────────────────────────────────────────────────────────
 *  LIGHT Helpers
 *  ────────────────────────────────────────────────────────────────────────── */
const Card: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className = "",
  ...props
}) => (
  <div
    className={`rounded-2xl ${surface} ${border} border ${className}`}
    {...props}
  />
);

const SectionTitle: React.FC<{ title: string; desc?: string }> = ({
  title,
  desc,
}) => (
  <div>
    <h2 className={`text-lg font-semibold ${text}`}>{title}</h2>
    {desc && <p className={`text-sm ${subtext}`}>{desc}</p>}
  </div>
);

const FieldRow: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">{children}</div>
);

const Label: React.FC<{ children: React.ReactNode; htmlFor?: string }> = ({
  children,
  htmlFor,
}) => (
  <label
    htmlFor={htmlFor}
    className={`text-xs font-medium ${subtext} select-none`}
  >
    {children}
  </label>
);

const Input: React.FC<
  React.InputHTMLAttributes<HTMLInputElement> & { right?: React.ReactNode }
> = ({ right, className = "", ...rest }) => (
  <div
    className={`h-11 ${surfaceSolid} ${border} border rounded-xl flex items-center px-3 ${ringIndigo}`}
  >
    <input
      className={`flex-1 bg-transparent outline-none text-sm ${text} placeholder-zinc-500 ${className}`}
      {...rest}
    />
    {right}
  </div>
);

const TextArea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = ({
  className = "",
  ...rest
}) => (
  <textarea
    className={`min-h-[84px] ${surfaceSolid} ${border} border rounded-xl px-3 py-2 text-sm ${text} placeholder-zinc-500 ${ringIndigo} w-full ${className}`}
    {...rest}
  />
);

const Switch: React.FC<{ checked: boolean; onChange: (v: boolean) => void }> = ({
  checked,
  onChange,
}) => (
  <button
    type="button"
    onClick={() => onChange(!checked)}
    className={`h-6 w-11 rounded-full transition relative ${
      checked ? "bg-indigo-600" : "bg-zinc-300 dark:bg-zinc-700"
    } ${ringIndigo}`}
    aria-pressed={checked}
  >
    <span
      className={`absolute top-[3px] left-[3px] h-[18px] w-[18px] rounded-full bg-white dark:bg-zinc-100 transition-transform ${
        checked ? "translate-x-5" : "translate-x-0"
      }`}
    />
  </button>
);

const Button: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "solid" | "ghost" | "chip";
  }
> = ({ variant = "solid", className = "", children, ...rest }) => {
  const map = {
    solid:
      "text-white bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-500 shadow-sm hover:brightness-[.98]",
    ghost:
      "border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 bg-white/60 dark:bg-zinc-900/40 hover:bg-white/80 dark:hover:bg-zinc-900/60",
    chip:
      "border border-zinc-200/60 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 bg-white/60 dark:bg-zinc-900/40 hover:bg-white/80 dark:hover:bg-zinc-900/60",
  };
  return (
    <button
      className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-semibold transition ${ringIndigo} ${map[variant]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
};

/** Custom dropdown (dark-friendly) */
type Option = { value: string; label: string; icon?: React.ReactNode };
const SelectMenu: React.FC<{
  value: string;
  onChange: (v: string) => void;
  options: Option[];
  className?: string;
  label?: string;
}> = ({ value, onChange, options, className = "" }) => {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement | null>(null);
  React.useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);
  const active = options.find((o) => o.value === value) || options[0];
  return (
    <div className={`relative ${className}`} ref={ref}>
      <button
        type="button"
        className={`h-11 w-full ${surfaceSolid} ${border} border rounded-xl px-3 text-left text-sm ${text} flex items-center justify-between ${ringIndigo}`}
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <span className="inline-flex items-center gap-2">
          {active?.icon}
          {active?.label}
        </span>
        <ChevronDown className="h-4 w-4 opacity-70" />
      </button>
      <div
        className={`absolute z-30 mt-2 w-full ${surfaceElev} ${border} border rounded-xl p-1 shadow-lg transition ${
          open ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-1 pointer-events-none"
        }`}
        role="menu"
      >
        {options.map((o) => (
          <button
            key={o.value}
            className={`w-full text-left px-3 py-2 rounded-lg hover:bg-zinc-50/90 dark:hover:bg-zinc-800/70 text-sm flex items-center gap-2 ${
              o.value === value ? "font-semibold" : ""
            }`}
            onClick={() => {
              onChange(o.value);
              setOpen(false);
            }}
          >
            {o.icon}
            {o.label}
            {o.value === value && <Check className="ml-auto h-4 w-4" />}
          </button>
        ))}
      </div>
    </div>
  );
};

/** Small paginator */
const Paginator: React.FC<{
  page: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
}> = ({ page, totalPages, onPrev, onNext }) => (
  <div className="flex items-center justify-between mt-4">
    <span className={`text-xs ${subtext}`}>
      Page {page} / {Math.max(1, totalPages)}
    </span>
    <div className="flex items-center gap-2">
      <Button variant="ghost" onClick={onPrev} disabled={page <= 1}>
        <ChevronLeft className="h-4 w-4" /> Prev
      </Button>
      <Button
        variant="ghost"
        onClick={onNext}
        disabled={page >= totalPages || totalPages === 0}
      >
        Next <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  </div>
);

/** ──────────────────────────────────────────────────────────────────────────
 *  DUMMY DATA
 *  ────────────────────────────────────────────────────────────────────────── */
type AppConn = {
  id: string;
  name: string;
  type: "calendar" | "video" | "dev" | "comms";
  status: "connected" | "error" | "disconnected";
  lastSync: string; // ISO
};

const APPS: AppConn[] = [
  { id: "a1", name: "Google Calendar", type: "calendar", status: "connected", lastSync: isoAgo(0.5) },
  { id: "a2", name: "Zoom", type: "video", status: "connected", lastSync: isoAgo(2) },
  { id: "a3", name: "Slack", type: "comms", status: "error", lastSync: isoAgo(12) },
  { id: "a4", name: "GitHub", type: "dev", status: "connected", lastSync: isoAgo(3) },
  { id: "a5", name: "Outlook Calendar", type: "calendar", status: "disconnected", lastSync: isoAgo(48) },
  // Make it paginatable
  ...Array.from({ length: 18 }).map((_, i) => ({
    id: "x" + i,
    name: `Integration ${i + 1}`,
    type: (["calendar", "video", "dev", "comms"] as const)[i % 4],
    status: (["connected", "error", "disconnected"] as const)[i % 3],
    lastSync: isoAgo(6 + (i % 72)),
  })),
];

type Address = {
  id: string;
  label: string;
  line1: string;
  city: string;
  country: string;
  default?: boolean;
};
const ADDRS: Address[] = [
  { id: "ad1", label: "Primary", line1: "23 Herbert Macaulay Way", city: "Yaba", country: "NG", default: true },
  { id: "ad2", label: "Work", line1: "11 Marina Rd", city: "Lagos Island", country: "NG" },
  ...Array.from({ length: 14 }).map((_, i) => ({
    id: "ax" + i,
    label: `Alt ${i + 1}`,
    line1: `${10 + i} Example Street`,
    city: i % 2 ? "Abuja" : "Lagos",
    country: i % 3 ? "NG" : "US",
  })),
];

function isoAgo(hours: number) {
  const d = new Date(Date.now() - hours * 3600 * 1000);
  return d.toISOString();
}
function rel(iso: string) {
  const diff = (Date.now() - new Date(iso).getTime()) / 3600000;
  if (diff < 1) return `${Math.round(diff * 60)}m ago`;
  if (diff < 24) return `${Math.round(diff)}h ago`;
  return `${Math.round(diff / 24)}d ago`;
}

/** ──────────────────────────────────────────────────────────────────────────
 *  MAIN COMPONENT
 *  ────────────────────────────────────────────────────────────────────────── */
const ME_SettingsGeneral: React.FC = () => {
  // Tabs within "General"
  const [tab, setTab] = React.useState<"prefs" | "apps" | "addresses">("prefs");

  // Preferences form state
  const [locale, setLocale] = React.useState("en-NG");
  const [tz, setTz] = React.useState("Africa/Lagos");
  const [weekStart, setWeekStart] = React.useState("mon");
  const [dateFmt, setDateFmt] = React.useState("dd/MM/yyyy");
  const [currency, setCurrency] = React.useState("NGN");
  const [units, setUnits] = React.useState("metric");
  const [a11yReduceMotion, setReduceMotion] = React.useState(false);
  const [autoAddCal, setAutoAddCal] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [savedAt, setSavedAt] = React.useState<number | null>(null);

  // Connected apps filters
  const [qApp, setQApp] = React.useState("");
  const [fType, setFType] = React.useState<"all" | AppConn["type"]>("all");
  const [fStatus, setFStatus] = React.useState<"all" | AppConn["status"]>("all");
  const [pApp, setPApp] = React.useState(1);
  const perApp = 8;

  // Addresses filters
  const [qAddr, setQAddr] = React.useState("");
  const [country, setCountry] = React.useState<"all" | "NG" | "US">("all");
  const [pAddr, setPAddr] = React.useState(1);
  const perAddr = 6;

  React.useEffect(() => {
    // Load persisted prefs (optional)
    const st = localStorage.getItem("mentee.settings.general");
    if (st) {
      try {
        const s = JSON.parse(st);
        setLocale(s.locale ?? "en-NG");
        setTz(s.tz ?? "Africa/Lagos");
        setWeekStart(s.weekStart ?? "mon");
        setDateFmt(s.dateFmt ?? "dd/MM/yyyy");
        setCurrency(s.currency ?? "NGN");
        setUnits(s.units ?? "metric");
        setReduceMotion(!!s.a11yReduceMotion);
        setAutoAddCal(!!s.autoAddCal);
      } catch {}
    }
  }, []);

  const onSave = async () => {
    setSaving(true);
    // pretend to save
    await new Promise((r) => setTimeout(r, 600));
    localStorage.setItem(
      "mentee.settings.general",
      JSON.stringify({
        locale,
        tz,
        weekStart,
        dateFmt,
        currency,
        units,
        a11yReduceMotion,
        autoAddCal,
      })
    );
    setSaving(false);
    setSavedAt(Date.now());
    setTimeout(() => setSavedAt(null), 1800);
  };

  // Connected apps derived
  const appsFiltered = APPS.filter((a) => {
    const q = qApp.trim().toLowerCase();
    if (fType !== "all" && a.type !== fType) return false;
    if (fStatus !== "all" && a.status !== fStatus) return false;
    if (q && !`${a.name} ${a.type} ${a.status}`.toLowerCase().includes(q))
      return false;
    return true;
  });
  const appsPages = Math.max(1, Math.ceil(appsFiltered.length / perApp));
  const appsRows = appsFiltered.slice((pApp - 1) * perApp, pApp * perApp);

  // Addresses derived
  const addrFiltered = ADDRS.filter((a) => {
    const q = qAddr.trim().toLowerCase();
    if (country !== "all" && a.country !== country) return false;
    if (
      q &&
      !`${a.label} ${a.line1} ${a.city} ${a.country}`.toLowerCase().includes(q)
    )
      return false;
    return true;
  });
  const addrPages = Math.max(1, Math.ceil(addrFiltered.length / perAddr));
  const addrRows = addrFiltered.slice((pAddr - 1) * perAddr, pAddr * perAddr);

  return (
    <MenteeAppLayout>
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h1 className={`text-2xl font-bold ${text}`}>Settings · General</h1>
            <p className={`text-sm ${subtext}`}>
              Configure language, time, and default booking behaviour.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={onSave} disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Saving…
                </>
              ) : (
                <>
                  <Check className="h-4 w-4" /> Save changes
                </>
              )}
            </Button>
            {savedAt && (
              <span className="text-xs text-emerald-600 dark:text-emerald-400">
                Saved
              </span>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-4 overflow-x-auto">
          <div
            className={`inline-flex items-center gap-2 ${surface} ${border} border rounded-xl p-1`}
          >
            {[
              { id: "prefs", label: "Preferences" },
              { id: "apps", label: "Connected Apps" },
              { id: "addresses", label: "Addresses" },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id as any)}
                className={`px-3 py-1.5 rounded-lg text-sm transition ${
                  tab === t.id
                    ? "bg-indigo-600 text-white"
                    : "hover:bg-zinc-100 dark:hover:bg-zinc-800"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab content */}
        <div className="mt-6 space-y-6">
          {tab === "prefs" && (
            <Card className="p-4">
              <SectionTitle
                title="Regional & Booking"
                desc="Your default locale, timezone and how bookings behave."
              />
              <div className="mt-4 space-y-4">
                <FieldRow>
                  <div className="space-y-1">
                    <Label>Locale</Label>
                    <SelectMenu
                      value={locale}
                      onChange={setLocale}
                      options={[
                        { value: "en-NG", label: "English (Nigeria)", icon: <Globe className="h-4 w-4 opacity-70" /> },
                        { value: "en-US", label: "English (United States)", icon: <Globe className="h-4 w-4 opacity-70" /> },
                        { value: "en-GB", label: "English (United Kingdom)", icon: <Globe className="h-4 w-4 opacity-70" /> },
                      ]}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label>Timezone</Label>
                    <SelectMenu
                      value={tz}
                      onChange={setTz}
                      options={[
                        { value: "Africa/Lagos", label: "Africa/Lagos (GMT+1)", icon: <Clock className="h-4 w-4 opacity-70" /> },
                        { value: "Africa/Nairobi", label: "Africa/Nairobi (GMT+3)", icon: <Clock className="h-4 w-4 opacity-70" /> },
                        { value: "UTC", label: "UTC", icon: <Clock className="h-4 w-4 opacity-70" /> },
                      ]}
                    />
                  </div>
                </FieldRow>

                <FieldRow>
                  <div className="space-y-1">
                    <Label>Week starts on</Label>
                    <SelectMenu
                      value={weekStart}
                      onChange={setWeekStart}
                      options={[
                        { value: "mon", label: "Monday", icon: <Calendar className="h-4 w-4 opacity-70" /> },
                        { value: "sun", label: "Sunday", icon: <Calendar className="h-4 w-4 opacity-70" /> },
                      ]}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label>Date format</Label>
                    <SelectMenu
                      value={dateFmt}
                      onChange={setDateFmt}
                      options={[
                        { value: "dd/MM/yyyy", label: "DD/MM/YYYY" },
                        { value: "MM/dd/yyyy", label: "MM/DD/YYYY" },
                        { value: "yyyy-MM-dd", label: "YYYY-MM-DD" },
                      ]}
                    />
                  </div>
                </FieldRow>

                <FieldRow>
                  <div className="space-y-1">
                    <Label>Currency</Label>
                    <SelectMenu
                      value={currency}
                      onChange={setCurrency}
                      options={[
                        { value: "NGN", label: "NGN (₦)" },
                        { value: "USD", label: "USD ($)" },
                        { value: "GBP", label: "GBP (£)" },
                      ]}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label>Units</Label>
                    <SelectMenu
                      value={units}
                      onChange={setUnits}
                      options={[
                        { value: "metric", label: "Metric (km, kg)" },
                        { value: "imperial", label: "Imperial (mile, lb)" },
                      ]}
                    />
                  </div>
                </FieldRow>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex items-center justify-between rounded-xl px-3 py-2.5 border border-zinc-200/60 dark:border-zinc-800">
                    <div>
                      <div className={`text-sm ${text}`}>Reduce motion</div>
                      <div className={`text-xs ${subtext}`}>
                        Limit large animations for accessibility.
                      </div>
                    </div>
                    <Switch
                      checked={a11yReduceMotion}
                      onChange={setReduceMotion}
                    />
                  </div>

                  <div className="flex items-center justify-between rounded-xl px-3 py-2.5 border border-zinc-200/60 dark:border-zinc-800">
                    <div>
                      <div className={`text-sm ${text}`}>Auto add to calendar</div>
                      <div className={`text-xs ${subtext}`}>
                        New bookings will be added to your calendar.
                      </div>
                    </div>
                    <Switch checked={autoAddCal} onChange={setAutoAddCal} />
                  </div>
                </div>
              </div>
            </Card>
          )}

          {tab === "apps" && (
            <Card className="p-4">
              <SectionTitle
                title="Connected Apps"
                desc="Manage integrations like calendars, conferencing, and dev tools."
              />

              {/* Filter bar (responsive, non-pushing) */}
              <div className="mt-4 grid grid-cols-1 md:grid-cols-12 gap-2">
                <div className="md:col-span-5">
                  <div
                    className={`h-11 ${surfaceSolid} ${border} border rounded-xl px-3 flex items-center gap-2 ${ringIndigo}`}
                  >
                    <Search className="h-4 w-4 opacity-70" />
                    <input
                      className={`flex-1 bg-transparent outline-none text-sm ${text} placeholder-zinc-500`}
                      value={qApp}
                      onChange={(e) => {
                        setPApp(1);
                        setQApp(e.target.value);
                      }}
                      placeholder="Search integrations…"
                    />
                  </div>
                </div>
                <div className="md:col-span-7">
                  <div className="flex flex-wrap items-center gap-2">
                    <div className={`h-11 px-3 w-full sm:w-auto ${surfaceSolid} ${border} border rounded-xl flex items-center gap-2`}>
                      <Filter className="h-4 w-4 opacity-70" />
                      <SelectMenu
                        value={fType}
                        onChange={(v) => {
                          setPApp(1);
                          setFType(v as any);
                        }}
                        options={[
                          { value: "all", label: "Type: All" },
                          { value: "calendar", label: "Calendar" },
                          { value: "video", label: "Video" },
                          { value: "dev", label: "Dev" },
                          { value: "comms", label: "Comms" },
                        ]}
                        className="min-w-[140px]"
                      />
                      <SelectMenu
                        value={fStatus}
                        onChange={(v) => {
                          setPApp(1);
                          setFStatus(v as any);
                        }}
                        options={[
                          { value: "all", label: "Status: All" },
                          { value: "connected", label: "Connected" },
                          { value: "error", label: "Error" },
                          { value: "disconnected", label: "Disconnected" },
                        ]}
                        className="min-w-[160px]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Grid */}
              <div className="mt-4 grid sm:grid-cols-2 xl:grid-cols-3 gap-3">
                {appsRows.map((a) => (
                  <div
                    key={a.id}
                    className={`rounded-xl ${surfaceSolid} ${border} border p-3`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className={`text-sm font-semibold ${text}`}>
                          {a.name}
                        </div>
                        <div className={`text-xs ${subtext}`}>
                          {a.type} • last sync {rel(a.lastSync)}
                        </div>
                      </div>
                      <span
                        className={`px-2 py-1 rounded-lg border text-[11px] ${
                          a.status === "connected"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900"
                            : a.status === "error"
                            ? "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900"
                            : "bg-zinc-100 text-zinc-700 border-zinc-200 dark:bg-zinc-800/50 dark:text-zinc-300 dark:border-zinc-700"
                        }`}
                      >
                        {a.status}
                      </span>
                    </div>

                    <div className="mt-3 flex items-center gap-2">
                      <Button variant="chip">
                        <Link2 className="h-4 w-4" /> Manage
                      </Button>
                      <Button variant="chip">
                        <RefreshCw className="h-4 w-4" /> Re-auth
                      </Button>
                      <Button variant="chip">
                        <Power className="h-4 w-4" /> Disconnect
                      </Button>
                    </div>

                    {a.status === "error" && (
                      <div className="mt-3 text-xs inline-flex items-center gap-1 text-amber-600 dark:text-amber-400">
                        <AlertCircle className="h-4 w-4" />
                        Needs attention
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <Paginator
                page={pApp}
                totalPages={appsPages}
                onPrev={() => setPApp((p) => Math.max(1, p - 1))}
                onNext={() => setPApp((p) => Math.min(appsPages, p + 1))}
              />
            </Card>
          )}

          {tab === "addresses" && (
            <Card className="p-4">
              <SectionTitle
                title="Addresses"
                desc="Used for billing and receipts."
              />

              {/* Filters */}
              <div className="mt-4 grid grid-cols-1 md:grid-cols-12 gap-2">
                <div className="md:col-span-6">
                  <div
                    className={`h-11 ${surfaceSolid} ${border} border rounded-xl px-3 flex items-center gap-2 ${ringIndigo}`}
                  >
                    <Search className="h-4 w-4 opacity-70" />
                    <input
                      className={`flex-1 bg-transparent outline-none text-sm ${text} placeholder-zinc-500`}
                      value={qAddr}
                      onChange={(e) => {
                        setPAddr(1);
                        setQAddr(e.target.value);
                      }}
                      placeholder="Search address…"
                    />
                  </div>
                </div>
                <div className="md:col-span-6">
                  <div className="flex flex-wrap gap-2">
                    <SelectMenu
                      value={country}
                      onChange={(v) => {
                        setPAddr(1);
                        setCountry(v as any);
                      }}
                      options={[
                        { value: "all", label: "Country: All", icon: <MapPin className="h-4 w-4 opacity-70" /> },
                        { value: "NG", label: "Nigeria (NG)" },
                        { value: "US", label: "United States (US)" },
                      ]}
                      className="min-w-[180px]"
                    />
                    <Button variant="chip" onClick={() => { setQAddr(""); setCountry("all"); setPAddr(1); }}>
                      <X className="h-4 w-4" /> Reset
                    </Button>
                  </div>
                </div>
              </div>

              {/* Table (md+) */}
              <div className="hidden md:block mt-4 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className={`text-left ${subtext}`}>
                      <th className="px-3 py-2">Label</th>
                      <th className="px-3 py-2">Address</th>
                      <th className="px-3 py-2">City</th>
                      <th className="px-3 py-2">Country</th>
                      <th className="px-3 py-2"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200/60 dark:divide-zinc-800">
                    {addrRows.map((a) => (
                      <tr key={a.id}>
                        <td className="px-3 py-2 font-semibold">
                          {a.label}{" "}
                          {a.default && (
                            <span className="ml-2 text-[11px] px-2 py-0.5 rounded-lg border border-emerald-200 dark:border-emerald-900 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300">
                              default
                            </span>
                          )}
                        </td>
                        <td className="px-3 py-2">{a.line1}</td>
                        <td className="px-3 py-2">{a.city}</td>
                        <td className="px-3 py-2">{a.country}</td>
                        <td className="px-3 py-2 text-right">
                          <Button variant="chip">Edit</Button>
                        </td>
                      </tr>
                    ))}
                    {addrRows.length === 0 && (
                      <tr>
                        <td
                          className={`px-3 py-4 text-center ${subtext}`}
                          colSpan={5}
                        >
                          No addresses match your filters.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Cards (mobile) */}
              <div className="grid md:hidden grid-cols-1 gap-3 mt-4">
                {addrRows.map((a) => (
                  <div key={a.id} className={`${surfaceSolid} ${border} border rounded-xl p-3`}>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className={`text-sm font-semibold ${text}`}>
                          {a.label}{" "}
                          {a.default && (
                            <span className="ml-2 text-[11px] px-2 py-0.5 rounded-lg border border-emerald-200 dark:border-emerald-900 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300">
                              default
                            </span>
                          )}
                        </div>
                        <div className={`text-xs ${subtext}`}>
                          {a.line1} • {a.city} • {a.country}
                        </div>
                      </div>
                      <Button variant="chip">Edit</Button>
                    </div>
                  </div>
                ))}
                {addrRows.length === 0 && (
                  <div className={`text-sm text-center ${subtext}`}>
                    No addresses match your filters.
                  </div>
                )}
              </div>

              <Paginator
                page={pAddr}
                totalPages={addrPages}
                onPrev={() => setPAddr((p) => Math.max(1, p - 1))}
                onNext={() => setPAddr((p) => Math.min(addrPages, p + 1))}
              />
            </Card>
          )}
        </div>
      </div>
    </MenteeAppLayout>
  );
};

export default ME_SettingsGeneral;
