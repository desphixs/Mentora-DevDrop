import React from "react";
import Header from "@/layout/Header";
import Footer from "@/layout/Footer";
import { Search, Download, Printer, ShieldCheck, Clock, Link as LinkIcon } from "lucide-react";

/* === Local UI tokens (indigo glass) === */
const ringIndigo =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#6366F1]/40";
const card =
  "rounded-2xl border border-[#E7E9FF] dark:border-[#2B2F55] bg-white/80 dark:bg-white/[0.05] backdrop-blur";
const chip =
  "inline-flex items-center gap-2 rounded-full border border-[#E7E9FF] dark:border-[#2B2F55] bg-white/60 dark:bg-white/[0.06] px-3 py-1 text-[11px] font-semibold";

type Section = { id: string; title: string; body: React.ReactNode; tags?: string[] };

const SECTIONS: Section[] = [
  {
    id: "overview",
    title: "Overview",
    tags: ["intro", "scope"],
    body: (
      <>
        <p className="text-sm text-[#2C3157] dark:text-[#C9D1FF]/85">
          This Privacy Policy explains how Mentora collects, uses, and shares information when you use our websites,
          marketplace, mobile apps, and services (collectively, the “Services”). By using the Services, you agree to
          this Policy.
        </p>
        <ul className="mt-3 list-disc pl-5 text-sm text-[#2C3157] dark:text-[#C9D1FF]/85 space-y-1">
          <li>Controller: DevDrop Labs Ltd. (“Mentora”).</li>
          <li>Applies to mentors, mentees, and visitors.</li>
          <li>Contact: privacy@mentora.example</li>
        </ul>
      </>
    ),
  },
  {
    id: "data-we-collect",
    title: "Data we collect",
    tags: ["data", "collection"],
    body: (
      <>
        <ul className="grid sm:grid-cols-2 gap-2">
          {[
            ["Account data", "Name, email, password, profile details, role and preferences."],
            ["Usage data", "Pages viewed, actions, session telemetry, device & browser info (approx.)."],
            ["Transaction data", "Bookings, invoices, payouts, currencies, tax info and references."],
            ["Comms data", "Messages, attachments, call metadata, support interactions."],
            ["Integrations", "Calendar & payment providers’ tokens/ids minimal for functionality."],
            ["Cookies", "Analytics and essential cookies (see Cookie Policy)."],
          ].map(([k, v]) => (
            <li key={k} className={`${card} p-3`}>
              <div className="text-sm font-semibold">{k}</div>
              <div className="text-xs mt-1 text-[#5E66A6] dark:text-[#A7B0FF]/85">{v}</div>
            </li>
          ))}
        </ul>
      </>
    ),
  },
  {
    id: "how-we-use",
    title: "How we use data",
    tags: ["processing", "purposes"],
    body: (
      <ul className="list-disc pl-5 text-sm text-[#2C3157] dark:text-[#C9D1FF]/85 space-y-1">
        <li>Provide and improve booking, messaging, and payment experiences.</li>
        <li>Secure the marketplace (fraud/KYC checks, abuse prevention).</li>
        <li>Analytics and product development (aggregated and/or de-identified where possible).</li>
        <li>Communications: reminders, updates, transactional emails and optional marketing (you can opt out).</li>
        <li>Legal compliance and enforcing our Terms.</li>
      </ul>
    ),
  },
  {
    id: "legal-bases",
    title: "Legal bases (GDPR/UK GDPR)",
    tags: ["gdpr"],
    body: (
      <ul className="list-disc pl-5 text-sm text-[#2C3157] dark:text-[#C9D1FF]/85 space-y-1">
        <li>Contract (to deliver the Services you request).</li>
        <li>Legitimate interests (security, analytics, product quality).</li>
        <li>Consent (where required, e.g., marketing cookies).</li>
        <li>Legal obligation (e.g., tax and accounting).</li>
      </ul>
    ),
  },
  {
    id: "sharing",
    title: "How we share information",
    tags: ["sharing", "processors"],
    body: (
      <ul className="list-disc pl-5 text-sm text-[#2C3157] dark:text-[#C9D1FF]/85 space-y-1">
        <li>Service providers (hosting, analytics, payments, KYC, communications).</li>
        <li>Other users as needed to fulfil bookings (mentor ↔ mentee profiles, messages, availability).</li>
        <li>Corporate transactions (merger/acquisition) subject to this Policy.</li>
        <li>Legal and safety reasons.</li>
      </ul>
    ),
  },
  {
    id: "retention",
    title: "Retention & security",
    tags: ["retention", "security"],
    body: (
      <p className="text-sm text-[#2C3157] dark:text-[#C9D1FF]/85">
        We keep data only as long as necessary for the purposes stated, then delete or anonymize it. We use encryption
        in transit, strict access controls, audits, and industry-standard practices. No method is 100% secure; please
        keep your credentials safe.
      </p>
    ),
  },
  {
    id: "your-rights",
    title: "Your rights",
    tags: ["rights", "access", "erasure", "portability"],
    body: (
      <ul className="list-disc pl-5 text-sm text-[#2C3157] dark:text-[#C9D1FF]/85 space-y-1">
        <li>Access, correction, deletion, restriction, portability.</li>
        <li>Object to certain processing; withdraw consent where applicable.</li>
        <li>File a complaint with your local supervisory authority.</li>
        <li>Contact: privacy@mentora.example</li>
      </ul>
    ),
  },
  {
    id: "international",
    title: "International transfers",
    tags: ["transfers"],
    body: (
      <p className="text-sm text-[#2C3157] dark:text-[#C9D1FF]/85">
        Where data moves across borders, we use appropriate safeguards such as Standard Contractual Clauses and
        supplementary measures.
      </p>
    ),
  },
  {
    id: "children",
    title: "Children",
    tags: ["underage"],
    body: (
      <p className="text-sm text-[#2C3157] dark:text-[#C9D1FF]/85">
        Our Services aren’t directed to children under 13 (or as defined by local law). We don’t knowingly collect
        personal data from children.
      </p>
    ),
  },
  {
    id: "changes",
    title: "Changes to this Policy",
    tags: ["updates"],
    body: (
      <p className="text-sm text-[#2C3157] dark:text-[#C9D1FF]/85">
        We may update this Policy from time to time. We’ll post changes here and update the “Last updated” date.
      </p>
    ),
  },
];

function useFilteredSections() {
  const [q, setQ] = React.useState("");
  const filtered = React.useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return SECTIONS;
    return SECTIONS.filter(
      (sec) =>
        sec.title.toLowerCase().includes(s) ||
        sec.tags?.some((t) => t.toLowerCase().includes(s)) ||
        (typeof sec.body === "string" && sec.body.toLowerCase().includes(s))
    );
  }, [q]);
  return { q, setQ, filtered };
}

export default function Privacy() {
  const { q, setQ, filtered } = useFilteredSections();
  const lastUpdated = "Jan 7, 2025";

  const downloadTxt = () => {
    const text = SECTIONS.map((s) => `## ${s.title}\n\n${stripHtml(s.body)}`).join("\n\n");
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "mentora-privacy.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <Header/>
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-10">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-2xl grid place-items-center border border-[#E7E9FF] dark:border-[#2B2F55] bg-white/70 dark:bg-white/[0.05]">
              <ShieldCheck className="text-indigo-500" size={18} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#0F132E] dark:text-[#E9ECFF]">Privacy Policy</h1>
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
                placeholder="Search sections, e.g. transfers"
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
            </div>
            <button className={`${chip}`} onClick={() => window.print()}>
              <Printer size={14} /> Print
            </button>
            <button className={`${chip}`} onClick={downloadTxt}>
              <Download size={14} /> Download
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="mt-6 grid lg:grid-cols-12 gap-6">
          {/* Sidebar TOC */}
          <aside className="lg:col-span-3 hidden lg:block">
            <nav className={`${card} p-3 sticky top-6`}>
              <div className="text-xs font-semibold mb-2 text-[#6065A6] dark:text-[#A7B0FF]/80">Contents</div>
              <ul className="space-y-1">
                {SECTIONS.map((s) => (
                  <li key={s.id}>
                    <a
                      href={`#${s.id}`}
                      className="group flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 hover:bg-zinc-100 dark:hover:bg-zinc-900"
                    >
                      <LinkIcon size={14} className="opacity-60 group-hover:opacity-100" />
                      <span className="truncate">{s.title}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>

          {/* Main */}
          <main className="lg:col-span-9">
            {filtered.length === 0 ? (
              <div className={`${card} p-5 text-sm text-[#5E66A6] dark:text-[#A7B0FF]/85`}>No matching sections.</div>
            ) : (
              <div className="grid gap-4">
                {filtered.map((s) => (
                  <article key={s.id} id={s.id} className={`${card} p-5 scroll-mt-24`}>
                    <h2 className="text-lg font-semibold text-[#0F1536] dark:text-[#E7E9FF]">{s.title}</h2>
                    <div className="mt-2">{s.body}</div>

                    {s.tags && s.tags.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {s.tags.map((t) => (
                          <span key={t} className={chip}>
                            #{t}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="mt-4 text-right">
                      <a href="#top" className="text-[12px] font-semibold text-[#4F46E5] hover:underline">
                        Back to top
                      </a>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </main>
        </div>
        <Footer/>
      </div>
  );
}

/* Helpers */
function stripHtml(node: React.ReactNode): string {
  if (typeof node === "string") return node;
  if (!node) return "";
  if (Array.isArray(node)) return node.map(stripHtml).join("\n");
  if (typeof node === "object" && "props" in (node as any)) {
    const children = (node as any).props?.children;
    return stripHtml(children);
  }
  return "";
}
