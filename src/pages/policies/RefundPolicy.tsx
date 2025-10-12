import React from "react";
import Header from "@/layout/Header";
import Footer from "@/layout/Footer";
import { BadgeDollarSign, Clock, Search, Download, Printer, Link as LinkIcon } from "lucide-react";

const ringIndigo =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#6366F1]/40";
const card =
  "rounded-2xl border border-[#E7E9FF] dark:border-[#2B2F55] bg-white/80 dark:bg-white/[0.05] backdrop-blur";
const chip =
  "inline-flex items-center gap-2 rounded-full border border-[#E7E9FF] dark:border-[#2B2F55] bg-white/60 dark:bg-white/[0.06] px-3 py-1 text-[11px] font-semibold";

type Section = { id: string; title: string; body: React.ReactNode };

const SECTIONS: Section[] = [
  {
    id: "scope",
    title: "1. Scope",
    body: <p className="text-sm text-[#2C3157] dark:text-[#C9D1FF]/85">This Refund Policy covers bookings and packages purchased through Mentora’s marketplace.</p>,
  },
  {
    id: "eligibility",
    title: "2. Eligibility",
    body: (
      <ul className="list-disc pl-5 text-sm text-[#2C3157] dark:text-[#C9D1FF]/85 space-y-1">
        <li>No-show by mentor or technical failure attributable to us.</li>
        <li>Session cancelled within the refundable window (see rules at checkout).</li>
        <li>Duplicate charge or unauthorized payment.</li>
      </ul>
    ),
  },
  {
    id: "nonrefundable",
    title: "3. Non-refundable cases",
    body: (
      <ul className="list-disc pl-5 text-sm text-[#2C3157] dark:text-[#C9D1FF]/85 space-y-1">
        <li>Missed sessions by mentee outside the grace or reschedule window.</li>
        <li>Completed sessions and delivered services.</li>
        <li>Abuse of the policy or excessive refund requests.</li>
      </ul>
    ),
  },
  {
    id: "process",
    title: "4. How to request a refund",
    body: (
      <ol className="list-decimal pl-5 text-sm text-[#2C3157] dark:text-[#C9D1FF]/85 space-y-1">
        <li>Open a dispute from the booking or invoice page within 7 days.</li>
        <li>Provide context and evidence (messages, attachments, screenshots).</li>
        <li>We aim to resolve within 5–10 business days.</li>
      </ol>
    ),
  },
  {
    id: "payouts",
    title: "5. Effects on payouts",
    body: <p className="text-sm text-[#2C3157] dark:text-[#C9D1FF]/85">Refunds may reverse or hold mentor payouts until the case is closed. Chargebacks may incur fees.</p>,
  },
  {
    id: "contact",
    title: "6. Contact",
    body: <p className="text-sm text-[#2C3157] dark:text-[#C9D1FF]/85">billing@mentora.example</p>,
  },
];

export default function RefundPolicy() {
  const [q, setQ] = React.useState("");
  const filtered = React.useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return SECTIONS;
    return SECTIONS.filter((sec) => sec.title.toLowerCase().includes(s) || (typeof sec.body === "string" && sec.body.toLowerCase().includes(s)));
  }, [q]);

  const lastUpdated = "Jan 7, 2025";
  const downloadTxt = () => {
    const text = SECTIONS.map((s) => `## ${s.title}\n\n${stripHtml(s.body)}`).join("\n\n");
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "mentora-refund-policy.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <Header/>
        <div className="flex flex-wrap items-center justify-between gap-3 pt-10">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-2xl grid place-items-center border border-[#E7E9FF] dark:border-[#2B2F55] bg-white/70 dark:bg-white/[0.05]">
              <BadgeDollarSign className="text-indigo-500" size={18} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#0F132E] dark:text-[#E9ECFF]">Refund Policy</h1>
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
                placeholder="Search policy"
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

        {/* Body */}
        <div className="mt-6 grid lg:grid-cols-12 gap-6">
          {/* TOC */}
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
          <main className="lg:col-span-9 grid gap-4">
            {filtered.map((s) => (
              <section key={s.id} id={s.id} className={`${card} p-5 scroll-mt-24`}>
                <h2 className="text-lg font-semibold text-[#0F1536] dark:text-[#E7E9FF]">{s.title}</h2>
                <div className="mt-2">{s.body}</div>
                <div className="mt-4 text-right">
                  <a href="#top" className="text-[12px] font-semibold text-[#4F46E5] hover:underline">
                    Back to top
                  </a>
                </div>
              </section>
            ))}
          </main>
        </div>
        <Footer/>
      </div>
  );
}

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
