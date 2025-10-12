import React from "react";
import MentorAppLayout from "../MentorAppLayout";
import {
  ShieldCheck,
  Lock,
  Eye,
  EyeOff,
  KeyRound,
  Smartphone,
  CheckCheck,
  RefreshCcw,
  Globe2,
  MonitorSmartphone,
  MapPin,
  X,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
  Trash2,
  LogOut,
} from "lucide-react";

/* tokens */
const ringIndigo =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#6366F1]/40";
const card =
  "rounded-2xl border border-[#E7E9FF] dark:border-[#2B2F55] bg-white/80 dark:bg-white/[0.05] backdrop-blur";
const btnBase =
  "inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-semibold transition " + ringIndigo;
const btnSolid =
  "text-white bg-gradient-to-r from-[#4F46E5] via-[#6366F1] to-[#8B5CF6] shadow-[0_10px_30px_rgba(79,70,229,0.35)] hover:shadow-[0_16px_40px_rgba(79,70,229,0.45)]";
const btnGhost =
  "border border-[#D9DBFF] dark:border-[#30345D] text-[#1B1F3A] dark:text-[#E6E9FF] bg-white/70 dark:bg-white/[0.05] hover:bg-white/90 dark:hover:bg-white/[0.08]";
const pill =
  "inline-flex items-center gap-2 rounded-full border border-[#E7E9FF] dark:border-[#2B2F55] bg-white/70 dark:bg-white/[0.05] px-3 py-1 text-[11px] font-semibold";

/* dummy */
type Session = {
  id: string;
  ua: string;
  os: string;
  ip: string;
  location: string;
  last: string; // ISO
  current: boolean;
};

const isoAgo = (m: number) => new Date(Date.now() - m * 60000).toISOString();
const D_SESSIONS: Session[] = [
  { id: "s1", ua: "Chrome 127", os: "Windows 11", ip: "105.112.4.18", location: "Lagos, NG", last: isoAgo(5), current: true },
  { id: "s2", ua: "Safari 17", os: "macOS 14", ip: "2A03:2880:10FF", location: "Dublin, IE", last: isoAgo(240), current: false },
  { id: "s3", ua: "Mobile Chrome", os: "Android 14", ip: "41.190.22.3", location: "Abuja, NG", last: isoAgo(1380), current: false },
];

/* helpers */
const rel = (iso: string) => {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.round(diff / 60000);
  if (m < 1) return "now";
  if (m < 60) return `${m}m`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h`;
  const d = Math.round(h / 24);
  return `${d}d`;
};
const PER_PAGE = 5;

const Security: React.FC = () => {
  const [showPw, setShowPw] = React.useState(false);
  const [pw, setPw] = React.useState({ current: "", next: "", confirm: "" });
  const [twoFA, setTwoFA] = React.useState(true);
  const [codes, setCodes] = React.useState<string[]>(["A1C3-7XEP", "K9Q2-LMDD", "TR4Z-PTV1", "M0N8-QQ23", "C7YD-22PA"]);
  const regenCodes = () => setCodes(["FN2Q-9Z8C", "ABCD-1EFG", "LMNO-2PQR", "STUV-3WXY", "ZZ99-77KK"]);

  /* sessions */
  const [sessions, setSessions] = React.useState<Session[]>(() => JSON.parse(localStorage.getItem("mentora.sec.sessions") || "null") ?? D_SESSIONS);
  React.useEffect(() => localStorage.setItem("mentora.sec.sessions", JSON.stringify(sessions)), [sessions]);
  const [query, setQuery] = React.useState("");
  const [page, setPage] = React.useState(1);

  const filtered = sessions.filter((s) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return `${s.ua} ${s.os} ${s.ip} ${s.location}`.toLowerCase().includes(q);
  });
  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  React.useEffect(() => setPage(1), [query]);

  const revoke = (id: string) => setSessions((prev) => prev.filter((s) => s.id !== id));
  const revokeOthers = () => setSessions((prev) => prev.filter((s) => s.current));

  /* API Tokens (inline form; no modal) */
  type Token = { id: string; name: string; last4: string; created: string; };
  const [tokens, setTokens] = React.useState<Token[]>([
    { id: "tkn1", name: "CLI Dev", last4: "9F2A", created: "2025-04-20" },
  ]);
  const [newName, setNewName] = React.useState("");
  const addToken = () => {
    if (!newName.trim()) return;
    const last4 = Math.random().toString(16).slice(2, 6).toUpperCase();
    setTokens((p) => [{ id: cryptoRandom(), name: newName.trim(), last4, created: new Date().toISOString().slice(0, 10) }, ...p]);
    setNewName("");
  };
  const delToken = (id: string) => setTokens((p) => p.filter((t) => t.id !== id));

  const pwStrength = strength(pw.next);

  return (
    <MentorAppLayout>
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-[#0F132E] dark:text-[#E9ECFF]">Security</h1>
            <p className="text-sm text-[#5E66A6] dark:text-[#A7B0FF]/85">
              Manage password, MFA, sessions, and developer tokens.
            </p>
          </div>
          <span className={pill}><ShieldCheck size={14}/> Secure by default</span>
        </div>

        <div className="mt-4 grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Password & MFA */}
          <div className={`lg:col-span-6 ${card} p-4`}>
            <div className="text-sm font-semibold flex items-center gap-2">
              <Lock size={16}/> Password & 2FA
            </div>

            <div className="mt-3 space-y-3">
              {/* Change password */}
              <div className="p-3 rounded-xl border border-[#E7E9FF] dark:border-[#2B2F55]">
                <div className="text-sm font-semibold">Change password</div>
                <div className="mt-2 grid sm:grid-cols-2 gap-3">
                  <Input label="Current password" type={showPw ? "text" : "password"} value={pw.current} onChange={(v) => setPw((p) => ({ ...p, current: v }))} />
                  <div className="flex items-end gap-2">
                    <Input className="flex-1" label="New password" type={showPw ? "text" : "password"} value={pw.next} onChange={(v) => setPw((p) => ({ ...p, next: v }))} />
                    <button className={`h-[45px] ${btnBase} ${btnGhost}`} onClick={() => setShowPw((s) => !s)} aria-label="Toggle visibility">
                      {showPw ? <EyeOff size={16}/> : <Eye size={16}/>}
                    </button>
                  </div>
                  <Input label="Confirm new password" type={showPw ? "text" : "password"} value={pw.confirm} onChange={(v) => setPw((p) => ({ ...p, confirm: v }))} />
                </div>
                <div className="mt-2 text-xs flex items-center gap-2">
                  <span className={`inline-flex h-2 w-2 rounded-full ${pwStrength.color}`}></span>
                  Strength: <b className="text-[#0F1536] dark:text-[#E7E9FF]">{pwStrength.label}</b>
                </div>
                <button className={`mt-3 ${btnBase} ${btnSolid}`} onClick={() => alert("Password updated (demo)")}>
                  Update password
                </button>
              </div>

              {/* 2FA */}
              <div className="p-3 rounded-xl border border-[#E7E9FF] dark:border-[#2B2F55]">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold">Two-factor authentication (TOTP)</div>
                  <Switch checked={twoFA} onChange={setTwoFA}/>
                </div>
                <div className="mt-3 text-xs text-[#5E66A6] dark:text-[#A7B0FF]/85">
                  Scan this QR in your authenticator app and enter the generated code on login.
                </div>
                <div className="mt-3 grid sm:grid-cols-2 gap-3">
                  <div className="h-32 rounded-xl border border-dashed border-[#E7E9FF] dark:border-[#2B2F55] grid place-items-center text-xs text-[#6B72B3] dark:text-[#A7B0FF]/80">
                    QR CODE
                  </div>
                  <div className="text-sm">
                    <div className="font-semibold">Secret</div>
                    <div className="mt-1 px-3 py-2 rounded-lg border border-[#E7E9FF] dark:border-[#2B2F55] bg-white/70 dark:bg-white/[0.05] select-all">
                      JBSWY3DPEHPK3PXP
                    </div>
                    <button className={`mt-2 ${btnBase} ${btnGhost}`} onClick={() => alert("Verified (demo)")}>Verify code</button>
                  </div>
                </div>

                {/* backup codes */}
                <div className="mt-3">
                  <div className="text-sm font-semibold">Backup codes</div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {codes.map((c) => (
                      <span key={c} className="px-2 py-1 rounded-lg border border-[#E7E9FF] dark:border-[#2B2F55] text-xs bg-white/70 dark:bg-white/[0.06]">
                        {c}
                      </span>
                    ))}
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <button className={`${btnBase} ${btnGhost}`} onClick={regenCodes}><RefreshCcw size={16}/> Regenerate</button>
                    <button className={`${btnBase} ${btnGhost}`} onClick={() => alert("Downloaded (demo)")}>Download</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sessions & Tokens */}
          <div className={`lg:col-span-6 ${card} p-4`}>
            <div className="text-sm font-semibold flex items-center gap-2">
              <MonitorSmartphone size={16}/> Sessions & Devices
            </div>

            {/* Search */}
            <div className="mt-3 flex flex-wrap gap-2">
              <div className={`flex items-center gap-2 ${card} h-11 px-3.5 flex-1 min-w-[220px]`}>
                <Search size={16} className="text-[#5F679A] dark:text-[#A7B0FF]" />
                <input
                  className="bg-transparent outline-none text-sm w-full text-[#101436] dark:text-[#EEF0FF] placeholder-[#7A81B4] dark:placeholder-[#A7B0FF]/80"
                  placeholder="Find a device by IP, OS, location…"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
              <button className={`${btnBase} ${btnGhost}`} onClick={revokeOthers}>
                <LogOut size={16}/> Sign out others
              </button>
            </div>

            {/* List */}
            <div className="mt-3 divide-y divide-[#E7E9FF] dark:divide-[#2B2F55]">
              {paged.map((s) => (
                <div key={s.id} className="py-3">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <span className="h-8 w-8 grid place-items-center rounded-xl bg-[#EEF2FF] dark:bg-white/[0.08] border border-[#E7E9FF] dark:border-[#2B2F55]">
                        <Globe2 size={16}/>
                      </span>
                      <div>
                        <div className="text-sm font-semibold text-[#0F1536] dark:text-[#E7E9FF]">
                          {s.ua} • {s.os} {s.current && <b className="ml-1 text-[#4F46E5]">(current)</b>}
                        </div>
                        <div className="text-xs text-[#5E66A6] dark:text-[#A7B0FF]/85 flex flex-wrap gap-3">
                          <span className="inline-flex items-center gap-1"><MapPin size={12}/> {s.location}</span>
                          <span>{s.ip}</span>
                          <span>last active {rel(s.last)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="relative">
                      <button className={`${btnBase} ${btnGhost} px-2 py-1`} onClick={() => revoke(s.id)}>
                        <Trash2 size={16}/> Revoke
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-3 flex items-center justify-between">
              <div className="text-[12px] text-[#6B72B3] dark:text-[#A7B0FF]/80">
                Page {page} / {totalPages} • {filtered.length} total
              </div>
              <div className="flex items-center gap-2">
                <button className={`${btnBase} ${btnGhost} px-2 py-1`} disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
                  <ChevronLeft size={16}/>
                </button>
                <button className={`${btnBase} ${btnGhost} px-2 py-1`} disabled={page >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>
                  <ChevronRight size={16}/>
                </button>
              </div>
            </div>

            {/* API Tokens */}
            <div className="mt-6">
              <div className="text-sm font-semibold flex items-center gap-2">
                <KeyRound size={16}/> API tokens
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                <input
                  className={`h-11 px-3 rounded-xl border border-[#E7E9FF] dark:border-[#2B2F55] bg-white/70 dark:bg-white/[0.05] outline-none text-sm flex-1 min-w-[220px] ${ringIndigo}`}
                  placeholder="Token name (e.g., CI pipeline)"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                />
                <button className={`${btnBase} ${btnSolid}`} onClick={addToken}>Create token</button>
              </div>

              <div className="mt-3 grid sm:grid-cols-2 gap-3">
                {tokens.map((t) => (
                  <div key={t.id} className="p-3 rounded-xl border border-[#E7E9FF] dark:border-[#2B2F55]">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-semibold">{t.name}</div>
                      <button className={`${btnBase} ${btnGhost} px-2 py-1`} onClick={() => delToken(t.id)}>
                        <Trash2 size={16}/> Delete
                      </button>
                    </div>
                    <div className="mt-1 text-xs text-[#5E66A6] dark:text-[#A7B0FF]/85">
                      Created {t.created} • key …{t.last4}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </MentorAppLayout>
  );
};

/* small ui */
function Switch({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-5 w-9 items-center rounded-full transition ${checked ? "bg-[#6366F1]" : "bg-zinc-300 dark:bg-zinc-700"} ${ringIndigo}`}
      aria-pressed={checked}
    >
      <span className={`inline-block h-4 w-4 rounded-full bg-white transform transition ${checked ? "translate-x-4" : "translate-x-1"}`} />
    </button>
  );
}

function Input({
  label,
  type = "text",
  value,
  onChange,
  className = "",
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  className?: string;
}) {
  return (
    <label className={`text-sm ${className}`}>
      <div className="text-[#0F1536] dark:text-[#E7E9FF]">{label}</div>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`mt-1 h-11 w-full px-3 rounded-xl border border-[#E7E9FF] dark:border-[#2B2F55] bg-white/70 dark:bg-white/[0.05] outline-none text-sm ${ringIndigo}`}
      />
    </label>
  );
}

function strength(pw: string) {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[a-z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  const labels = ["very weak", "weak", "ok", "good", "strong"];
  const colors = ["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-emerald-500", "bg-indigo-600"];
  return { label: labels[Math.min(score - 1, labels.length - 1)] || "very weak", color: colors[Math.min(score - 1, colors.length - 1)] || "bg-red-500" };
}

function cryptoRandom() {
  return "id-" + Math.random().toString(36).slice(2);
}

export default Security;
