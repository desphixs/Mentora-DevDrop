import React from "react";
import { Mail, Phone, MapPin, Send, CheckCircle2, AlertTriangle, Clock, Twitter, Github, Linkedin } from "lucide-react";
import Header from "@/layout/Header";
import Footer from "@/layout/Footer";
/* Tokens */
const ringIndigo =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#6366F1]/40";
const card =
  "rounded-2xl border border-[#E7E9FF] dark:border-[#2B2F55] bg-white/80 dark:bg-white/[0.05] backdrop-blur";
const btn =
  "inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition " + ringIndigo;
const btnSolid =
  "text-white bg-gradient-to-r from-[#4F46E5] via-[#6366F1] to-[#8B5CF6] shadow-[0_10px_30px_rgba(79,70,229,0.35)] hover:shadow-[0_16px_40px_rgba(79,70,229,0.45)]";

type Form = {
  name: string;
  email: string;
  topic: "support" | "sales" | "billing" | "other";
  message: string;
};

export default function Contact() {
  const [form, setForm] = React.useState<Form>({
    name: "",
    email: "",
    topic: "support",
    message: "",
  });
  const [state, setState] = React.useState<"idle" | "sending" | "success" | "error">("idle");
  const [errors, setErrors] = React.useState<Partial<Record<keyof Form, string>>>({});

  const validate = (): boolean => {
    const e: Partial<Record<keyof Form, string>> = {};
    if (!form.name.trim()) e.name = "Your name is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email.";
    if (!form.message.trim()) e.message = "Please add a short message.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setState("sending");
    // Simulate async
    setTimeout(() => {
      try {
        const inbox = JSON.parse(localStorage.getItem("mentora.contact") || "[]");
        inbox.push({ ...form, at: new Date().toISOString() });
        localStorage.setItem("mentora.contact", JSON.stringify(inbox));
        setState("success");
        setForm({ name: "", email: "", topic: "support", message: "" });
      } catch {
        setState("error");
      }
    }, 700);
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(1000px_500px_at_10%_-10%,rgba(79,70,229,0.12),transparent),radial-gradient(900px_500px_at_90%_-10%,rgba(99,102,241,0.12),transparent)]">
      <Header />

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        {/* Hero */}
        <div className="text-center">
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight text-[#0F132E] dark:text-[#E9ECFF]">
            Let’s talk
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-sm sm:text-base text-[#5E66A6] dark:text-[#A7B0FF]/85">
            Questions about pricing, integrations, or getting started? We’ll get back within one business day.
          </p>
        </div>

        {/* Content */}
        <div className="mt-10 grid lg:grid-cols-3 gap-6">
          {/* Form */}
          <div className={`lg:col-span-2 ${card} p-6`}>
            {state === "success" && (
              <div className="mb-4 flex items-center gap-2 rounded-xl border border-emerald-300/50 dark:border-emerald-700/40 bg-emerald-50/70 dark:bg-emerald-900/20 px-3 py-2 text-sm text-emerald-700 dark:text-emerald-300">
                <CheckCircle2 size={16} /> Thanks! We’ve received your message.
              </div>
            )}
            {state === "error" && (
              <div className="mb-4 flex items-center gap-2 rounded-xl border border-rose-300/50 dark:border-rose-700/40 bg-rose-50/70 dark:bg-rose-900/20 px-3 py-2 text-sm text-rose-700 dark:text-rose-300">
                <AlertTriangle size={16} /> Something went wrong. Please try again.
              </div>
            )}

            <form onSubmit={onSubmit} className="grid gap-3">
              <div className="grid sm:grid-cols-2 gap-3">
                <Field
                  label="Your name"
                  error={errors.name}
                  input={
                    <input
                      value={form.name}
                      onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                      className={`h-11 w-full rounded-xl border border-[#E7E9FF] dark:border-[#2B2F55] bg-white/70 dark:bg-white/[0.06] px-3 text-sm ${ringIndigo}`}
                      placeholder="Ada Lovelace"
                    />
                  }
                />
                <Field
                  label="Email"
                  error={errors.email}
                  input={
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                      className={`h-11 w-full rounded-xl border border-[#E7E9FF] dark:border-[#2B2F55] bg-white/70 dark:bg-white/[0.06] px-3 text-sm ${ringIndigo}`}
                      placeholder="you@company.com"
                    />
                  }
                />
              </div>

              <Field
                label="Topic"
                input={
                  <select
                    value={form.topic}
                    onChange={(e) => setForm((p) => ({ ...p, topic: e.target.value as Form["topic"] }))}
                    className={`h-11 w-full rounded-xl border border-[#E7E9FF] dark:border-[#2B2F55] bg-white/70 dark:bg-white/[0.06] px-3 text-sm ${ringIndigo}`}
                  >
                    <option value="support">Product support</option>
                    <option value="sales">Sales</option>
                    <option value="billing">Billing</option>
                    <option value="other">Other</option>
                  </select>
                }
              />

              <Field
                label="Message"
                error={errors.message}
                input={
                  <textarea
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
                    className={`w-full rounded-xl border border-[#E7E9FF] dark:border-[#2B2F55] bg-white/70 dark:bg-white/[0.06] px-3 py-2 text-sm ${ringIndigo}`}
                    placeholder="How can we help?"
                  />
                }
              />

              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="text-xs text-[#6B72B3] dark:text-[#A7B0FF]/80 inline-flex items-center gap-2">
                  <Clock size={14} /> Response time: within 1 business day
                </div>
                <button
                  type="submit"
                  disabled={state === "sending"}
                  className={`${btn} ${btnSolid} disabled:opacity-60`}
                >
                  {state === "sending" ? "Sending…" : (<><Send size={16} /> Send message</>)}
                </button>
              </div>
            </form>
          </div>

          {/* Contact cards */}
          <div className="grid gap-3">
            <div className={`${card} p-4`}>
              <div className="flex items-center gap-2 text-sm font-semibold">
                <Mail className="text-indigo-500" size={16} /> Email
              </div>
              <div className="mt-1 text-sm text-[#2C3157] dark:text-[#C9D1FF]/85">hello@mentora.example</div>
            </div>
            <div className={`${card} p-4`}>
              <div className="flex items-center gap-2 text-sm font-semibold">
                <Phone className="text-indigo-500" size={16} /> Phone
              </div>
              <div className="mt-1 text-sm text-[#2C3157] dark:text-[#C9D1FF]/85">+234 (0) 800 000 0000</div>
            </div>
            <div className={`${card} p-4`}>
              <div className="flex items-center gap-2 text-sm font-semibold">
                <MapPin className="text-indigo-500" size={16} /> Office
              </div>
              <div className="mt-1 text-sm text-[#2C3157] dark:text-[#C9D1FF]/85">
                123 Market Street, Lagos, NG
              </div>
            </div>

            {/* Social */}
            <div className={`${card} p-4`}>
              <div className="text-sm font-semibold">Follow</div>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <a className="inline-flex items-center gap-2 text-sm" href="#" aria-label="Twitter">
                  <Twitter size={16} /> Twitter
                </a>
                <a className="inline-flex items-center gap-2 text-sm" href="#" aria-label="GitHub">
                  <Github size={16} /> GitHub
                </a>
                <a className="inline-flex items-center gap-2 text-sm" href="#" aria-label="LinkedIn">
                  <Linkedin size={16} /> LinkedIn
                </a>
              </div>
            </div>

            {/* Map placeholder */}
            <div className={`${card} p-0 overflow-hidden`}>
              <div className="h-40 bg-[radial-gradient(200px_80px_at_50%_30%,rgba(79,70,229,0.25),transparent),linear-gradient(180deg,rgba(99,102,241,0.2),transparent)] grid place-items-center">
                <div className="rounded-xl bg-white/80 dark:bg-white/[0.06] border border-[#E7E9FF] dark:border-[#2B2F55] px-3 py-1 text-xs">
                  We’re here → Lagos
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

/* Small Field component */
function Field({
  label,
  input,
  error,
}: {
  label: string;
  input: React.ReactNode;
  error?: string;
}) {
  return (
    <label className="block">
      <div className="mb-1 text-xs font-semibold text-[#6065A6] dark:text-[#A7B0FF]/80">{label}</div>
      {input}
      {error && <div className="mt-1 text-[11px] text-rose-600 dark:text-rose-300">{error}</div>}
    </label>
  );
}
