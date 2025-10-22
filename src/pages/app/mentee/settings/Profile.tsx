import React from "react";
import MenteeAppLayout from "../MenteeAppLayout";
import {
  User,
  Image as ImageIcon,
  Link2,
  Globe,
  Hash,
  Pencil,
  Plus,
  Trash2,
  ChevronDown,
  Check,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

/** Theme tokens */
const surface = "bg-white/80 dark:bg-zinc-900/60";
const surfaceSolid = "bg-white dark:bg-zinc-900";
const surfaceElev = "bg-white/95 dark:bg-zinc-900/95 backdrop-blur";
const border = "border-zinc-200/60 dark:border-zinc-800";
const text = "text-zinc-900 dark:text-zinc-100";
const subtext = "text-zinc-600 dark:text-zinc-400";
const ringIndigo =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500/40";

const Card: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className = "",
  ...rest
}) => (
  <div
    className={`rounded-2xl ${surface} ${border} border ${className}`}
    {...rest}
  />
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
    chip: "border border-zinc-200/60 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 bg-white/60 dark:bg-zinc-900/40 hover:bg-white/80 dark:hover:bg-zinc-900/60",
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

const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (
  props
) => (
  <div
    className={`h-11 ${surfaceSolid} ${border} border rounded-xl px-3 flex items-center ${ringIndigo}`}
  >
    <input
      className={`flex-1 bg-transparent outline-none text-sm ${text} placeholder-zinc-500`}
      {...props}
    />
  </div>
);
const TextArea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = (
  props
) => (
  <textarea
    className={`min-h-[88px] ${surfaceSolid} ${border} border rounded-xl px-3 py-2 text-sm ${text} placeholder-zinc-500 ${ringIndigo} w-full`}
    {...props}
  />
);

/** Dropdown (non-native select) */
type Option = { value: string; label: string; icon?: React.ReactNode };
const SelectMenu: React.FC<{
  value: string;
  onChange: (v: string) => void;
  options: Option[];
  className?: string;
}> = ({ value, onChange, options, className = "" }) => {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement | null>(null);
  React.useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
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
          open
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-1 pointer-events-none"
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

/** Paginator */
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

/** Dummy lists for tables (search + paginate) */
type Social = {
  id: string;
  network: "twitter" | "linkedin" | "website";
  url: string;
};
const SOCIALS: Social[] = [
  { id: "s1", network: "twitter", url: "https://twitter.com/mentee" },
  { id: "s2", network: "linkedin", url: "https://linkedin.com/in/mentee" },
  { id: "s3", network: "website", url: "https://mentee.dev" },
  ...Array.from({ length: 15 }).map((_, i) => ({
    id: "sx" + i,
    network: (["twitter", "linkedin", "website"] as const)[i % 3],
    url: `https://example.com/${i}`,
  })),
];

type Portfolio = { id: string; title: string; tag: string; link: string };
const PORTFOLIO: Portfolio[] = [
  {
    id: "p1",
    title: "CSS Grid Cheatsheet",
    tag: "frontend",
    link: "https://example.com/grid",
  },
  {
    id: "p2",
    title: "API Proxy Demo",
    tag: "backend",
    link: "https://example.com/proxy",
  },
  ...Array.from({ length: 18 }).map((_, i) => ({
    id: "px" + i,
    title: `Sample Project ${i + 1}`,
    tag: i % 2 ? "frontend" : "backend",
    link: `https://work.example.com/${i}`,
  })),
];

const ME_SettingsProfile: React.FC = () => {
  // Basic info
  const [first, setFirst] = React.useState("Aisha");
  const [last, setLast] = React.useState("Bello");
  const [display, setDisplay] = React.useState("Aisha B.");
  const [pronouns, setPronouns] = React.useState("she/her");
  const [headline, setHeadline] = React.useState("Aspiring frontend engineer");
  const [bio, setBio] = React.useState(
    "I’m exploring React, TypeScript, and UI animations. Open to mentorship!"
  );
  const bioMax = 280;

  // Avatar/banner (mock)
  const [avatarUrl, setAvatarUrl] = React.useState<string | null>(null);
  const fileRef = React.useRef<HTMLInputElement | null>(null);

  // Socials filter/pagination
  const [qS, setQS] = React.useState("");
  const [pS, setPS] = React.useState(1);
  const perS = 6;

  // Portfolio filter/pagination
  const [qP, setQP] = React.useState("");
  const [tag, setTag] = React.useState<"all" | "frontend" | "backend">("all");
  const [pP, setPP] = React.useState(1);
  const perP = 6;

  const socialsFiltered = SOCIALS.filter((s) => {
    const q = qS.trim().toLowerCase();
    return q
      ? s.url.toLowerCase().includes(q) || s.network.includes(q as any)
      : true;
  });
  const sPages = Math.max(1, Math.ceil(socialsFiltered.length / perS));
  const sRows = socialsFiltered.slice((pS - 1) * perS, pS * perS);

  const portfolioFiltered = PORTFOLIO.filter((p) => {
    const q = qP.trim().toLowerCase();
    if (tag !== "all" && p.tag !== tag) return false;
    return q ? `${p.title} ${p.tag} ${p.link}`.toLowerCase().includes(q) : true;
  });
  const pPages = Math.max(1, Math.ceil(portfolioFiltered.length / perP));
  const pRows = portfolioFiltered.slice((pP - 1) * perP, pP * perP);

  return (
    <MenteeAppLayout>
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h1 className={`text-2xl font-bold ${text}`}>Settings · Profile</h1>
            <p className={`text-sm ${subtext}`}>
              Control your public profile and links.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button>
              <Check className="h-4 w-4" /> Save profile
            </Button>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 xl:grid-cols-12 gap-4">
          {/* Left: forms */}
          <div className="xl:col-span-7 space-y-4">
            <Card className="p-4  h-fit">
              <div className="flex items-center gap-3">
                <div className="h-14 w-14 rounded-xl overflow-hidden border border-zinc-200/60 dark:border-zinc-800 grid place-items-center bg-zinc-100/80 dark:bg-zinc-800/50">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt="avatar"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <User className="h-6 w-6 opacity-60" />
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    ref={fileRef}
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (!f) return;
                      const reader = new FileReader();
                      reader.onload = () =>
                        setAvatarUrl(reader.result as string);
                      reader.readAsDataURL(f);
                    }}
                  />
                  <Button
                    variant="chip"
                    onClick={() => fileRef.current?.click()}
                  >
                    <ImageIcon className="h-4 w-4" /> Change avatar
                  </Button>
                  <Button variant="chip" onClick={() => setAvatarUrl(null)}>
                    <Trash2 className="h-4 w-4" /> Remove
                  </Button>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <span className={`text-xs font-medium ${subtext}`}>
                    First name
                  </span>
                  <Input
                    value={first}
                    onChange={(e) => setFirst(e.target.value)}
                    placeholder="First name"
                  />
                </div>
                <div>
                  <span className={`text-xs font-medium ${subtext}`}>
                    Last name
                  </span>
                  <Input
                    value={last}
                    onChange={(e) => setLast(e.target.value)}
                    placeholder="Last name"
                  />
                </div>
                <div>
                  <span className={`text-xs font-medium ${subtext}`}>
                    Display name
                  </span>
                  <Input
                    value={display}
                    onChange={(e) => setDisplay(e.target.value)}
                    placeholder="Display name"
                  />
                </div>
                <div>
                  <span className={`text-xs font-medium ${subtext}`}>
                    Pronouns
                  </span>
                  <SelectMenu
                    value={pronouns}
                    onChange={(v) => setPronouns(v)}
                    options={[
                      { value: "she/her", label: "she/her" },
                      { value: "he/him", label: "he/him" },
                      { value: "they/them", label: "they/them" },
                    ]}
                  />
                </div>
                <div className="sm:col-span-2">
                  <span className={`text-xs font-medium ${subtext}`}>
                    Headline
                  </span>
                  <Input
                    value={headline}
                    onChange={(e) => setHeadline(e.target.value)}
                    placeholder="Short headline"
                  />
                </div>
                <div className="sm:col-span-2">
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-medium ${subtext}`}>
                      Bio
                    </span>
                    <span className={`text-xs ${subtext}`}>
                      {bio.length}/{bioMax}
                    </span>
                  </div>
                  <TextArea
                    maxLength={bioMax}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell mentors about your interests and goals…"
                  />
                </div>
              </div>

              {/* Skills / tags */}
              <div className="mt-4">
                <span className={`text-xs font-medium ${subtext}`}>
                  Skills (tags)
                </span>
                <TagEditor />
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div className={`text-sm font-semibold ${text}`}>Portfolio</div>
                <div className="flex items-center gap-2">
                  <SelectMenu
                    value={tag}
                    onChange={(v) => {
                      setPP(1);
                      setTag(v as any);
                    }}
                    options={[
                      { value: "all", label: "All tags" },
                      { value: "frontend", label: "Frontend" },
                      { value: "backend", label: "Backend" },
                    ]}
                  />
                  <Button variant="chip">
                    <Plus className="h-4 w-4" /> Add
                  </Button>
                </div>
              </div>

              <div className="mt-3">
                <div
                  className={`h-11 ${surfaceSolid} ${border} border rounded-xl px-3 flex items-center gap-2 ${ringIndigo}`}
                >
                  <Search className="h-4 w-4 opacity-70" />
                  <input
                    className={`flex-1 bg-transparent outline-none text-sm ${text} placeholder-zinc-500`}
                    placeholder="Search portfolio…"
                    value={qP}
                    onChange={(e) => {
                      setQP(e.target.value);
                      setPP(1);
                    }}
                  />
                </div>
              </div>

              {/* Table (md+) */}
              <div className="hidden md:block mt-3 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className={`text-left ${subtext}`}>
                      <th className="px-3 py-2">Title</th>
                      <th className="px-3 py-2">Tag</th>
                      <th className="px-3 py-2">Link</th>
                      <th className="px-3 py-2"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200/60 dark:divide-zinc-800">
                    {pRows.map((r) => (
                      <tr key={r.id}>
                        <td className="px-3 py-2 font-semibold">{r.title}</td>
                        <td className="px-3 py-2">
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg border border-zinc-200/60 dark:border-zinc-800 text-[11px]">
                            <Hash className="h-3.5 w-3.5" /> {r.tag}
                          </span>
                        </td>
                        <td className="px-3 py-2">
                          <a
                            href={r.link}
                            target="_blank"
                            rel="noreferrer"
                            className="text-indigo-600 dark:text-indigo-400 hover:underline"
                          >
                            {r.link}
                          </a>
                        </td>
                        <td className="px-3 py-2 text-right">
                          <Button variant="chip">
                            <Pencil className="h-4 w-4" /> Edit
                          </Button>
                        </td>
                      </tr>
                    ))}
                    {pRows.length === 0 && (
                      <tr>
                        <td
                          colSpan={4}
                          className={`px-3 py-4 text-center ${subtext}`}
                        >
                          No portfolio matches your filters.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Cards (mobile) */}
              <div className="grid md:hidden grid-cols-1 gap-3 mt-3">
                {pRows.map((r) => (
                  <div
                    key={r.id}
                    className={`${surfaceSolid} ${border} border rounded-xl p-3`}
                  >
                    <div className="text-sm font-semibold">{r.title}</div>
                    <div
                      className={`text-xs ${subtext} mt-0.5 inline-flex items-center gap-1`}
                    >
                      <Hash className="h-3.5 w-3.5" /> {r.tag}
                    </div>
                    <div className="mt-2">
                      <a
                        href={r.link}
                        target="_blank"
                        rel="noreferrer"
                        className="text-indigo-600 dark:text-indigo-400 text-sm hover:underline"
                      >
                        {r.link}
                      </a>
                    </div>
                    <div className="mt-2">
                      <Button variant="chip">
                        <Pencil className="h-4 w-4" /> Edit
                      </Button>
                    </div>
                  </div>
                ))}
                {pRows.length === 0 && (
                  <div className={`text-sm text-center ${subtext}`}>
                    No portfolio matches your filters.
                  </div>
                )}
              </div>

              <Paginator
                page={pP}
                totalPages={pPages}
                onPrev={() => setPP((p) => Math.max(1, p - 1))}
                onNext={() => setPP((p) => Math.min(pPages, p + 1))}
              />
            </Card>
          </div>
          {/* Right: lists with search & pagination */}
          <div className="xl:col-span-5 space-y-4">
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div className={`text-sm font-semibold ${text}`}>
                  Social links
                </div>
                <Button variant="chip">
                  <Plus className="h-4 w-4" /> Add
                </Button>
              </div>

              <div className="mt-3 h-11 bg-transparent">
                <div
                  className={`h-11 ${surfaceSolid} ${border} border rounded-xl px-3 flex items-center gap-2 ${ringIndigo}`}
                >
                  <Search className="h-4 w-4 opacity-70" />
                  <input
                    className={`flex-1 bg-transparent outline-none text-sm ${text} placeholder-zinc-500`}
                    placeholder="Search links…"
                    value={qS}
                    onChange={(e) => {
                      setQS(e.target.value);
                      setPS(1);
                    }}
                  />
                </div>
              </div>

              <div className="mt-3 grid grid-cols-1 gap-2">
                {sRows.map((s) => (
                  <div
                    key={s.id}
                    className={`${surfaceSolid} ${border} border rounded-xl px-3 py-2 flex flex-col gap-2 items-start justify-between`}
                  >
                    <div className="text-sm">
                      <span className="inline-flex items-center gap-2">
                        {s.network === "website" ? (
                          <Globe className="h-4 w-4 opacity-70" />
                        ) : (
                          <Link2 className="h-4 w-4 opacity-70" />
                        )}
                        <a
                          href={s.url}
                          className="hover:underline"
                          target="_blank"
                          rel="noreferrer"
                        >
                          {s.url}
                        </a>
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="chip">
                        <Pencil className="h-4 w-4" /> Edit
                      </Button>
                      <Button variant="chip">
                        <Trash2 className="h-4 w-4" /> Remove
                      </Button>
                    </div>
                  </div>
                ))}
                {sRows.length === 0 && (
                  <div className={`text-sm text-center ${subtext}`}>
                    No results.
                  </div>
                )}
              </div>

              <Paginator
                page={pS}
                totalPages={sPages}
                onPrev={() => setPS((p) => Math.max(1, p - 1))}
                onNext={() => setPS((p) => Math.min(sPages, p + 1))}
              />
            </Card>
          </div>
        </div>
      </div>
    </MenteeAppLayout>
  );
};

/** Simple tag editor for skills */
const TagEditor: React.FC = () => {
  const [tags, setTags] = React.useState<string[]>(["react", "typescript"]);
  const [value, setValue] = React.useState("");

  const add = () => {
    const v = value.trim().toLowerCase();
    if (!v) return;
    if (tags.includes(v)) return;
    setTags((t) => [...t, v]);
    setValue("");
  };
  const remove = (t: string) => setTags((x) => x.filter((i) => i !== t));

  return (
    <div className={`${surfaceSolid} ${border} border rounded-xl p-3`}>
      <div className="flex flex-wrap gap-2">
        {tags.map((t) => (
          <span
            key={t}
            className="inline-flex items-center gap-2 px-2 py-1 rounded-lg border border-zinc-200/60 dark:border-zinc-800 text-sm"
          >
            #{t}
            <button
              className="px-1 py-0.5 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800"
              onClick={() => remove(t)}
              aria-label={`Remove ${t}`}
            >
              <Trash2 className="h-3.5 w-3.5 opacity-70" />
            </button>
          </span>
        ))}
      </div>
      <div className="mt-2 flex items-center gap-2">
        <div className="h-10 flex-1 bg-transparent">
          <input
            className="h-10 w-full bg-transparent outline-none text-sm px-3 rounded-lg border border-dashed border-zinc-300 dark:border-zinc-700"
            placeholder="Add a skill and press Enter"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                add();
              }
            }}
          />
        </div>
        <Button variant="chip" onClick={add}>
          <Plus className="h-4 w-4" /> Add
        </Button>
      </div>
    </div>
  );
};

export default ME_SettingsProfile;
