import React from "react";
import MentorAppLayout from "../MentorAppLayout";
import {
  Save, Eye, Layers, Users, Clock, DollarSign, Star, Tag, Loader2
} from "lucide-react";

/* Indigo glass tokens */
const ringIndigo =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#6366F1]/40";
const card =
  "rounded-2xl border border-[#E7E9FF] dark:border-[#2B2F55] bg-white/80 dark:bg-white/[0.05] backdrop-blur";
const btnBase =
  "inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-semibold transition " + ringIndigo;
const btnSolid =
  "text-white bg-gradient-to-r from-[#4F46E5] via-[#6366F1] to-[#8B5CF6]";
const btnGhost =
  "border border-[#D9DBFF] dark:border-[#30345D] text-[#1B1F3A] dark:text-[#E6E9FF] bg-white/70 dark:bg-white/[0.05]";

type OfferType = "1:1" | "group";
type Visibility = "public" | "private" | "draft";
type Currency = "USD" | "NGN" | "INR" | "EUR";

type Form = {
  title: string;
  type: OfferType;
  durationMin: number;
  price: number;
  currency: Currency;
  visibility: Visibility;
  description: string;
  sessionsIncluded: number;
  capacity?: number; // for group
  tags: string;
};

export default function NewOffer() {
  const [form, setForm] = React.useState<Form>({
    title: "",
    type: "1:1",
    durationMin: 60,
    price: 50,
    currency: "USD",
    visibility: "draft",
    description: "",
    sessionsIncluded: 1,
    capacity: 10,
    tags: "",
  });
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!form.title.trim()) return setError("Title is required.");
    if (!form.price || form.price < 0) return setError("Price must be positive.");
    if (form.type === "group" && (!form.capacity || form.capacity < 2)) return setError("Group capacity must be at least 2.");
    setSaving(true);
    setTimeout(() => {
      const existing = JSON.parse(localStorage.getItem("mentora.offers.list") || "[]");
      const payload = {
        id: "of_" + Math.random().toString(36).slice(2,7),
        createdISO: new Date().toISOString(),
        ...form,
        tags: form.tags.split(",").map(s=>s.trim()).filter(Boolean),
      };
      localStorage.setItem("mentora.offers.list", JSON.stringify([payload, ...existing]));
      setSaving(false);
      alert("Offer created!");
    }, 650);
  };

  return (
    <MentorAppLayout>
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-[#0F132E] dark:text-[#E9ECFF]">Create New Offer</h1>
            <p className="text-sm text-[#5E66A6] dark:text-[#A7B0FF]/85">Craft a high-converting session or package.</p>
          </div>
        </div>

        <form onSubmit={onSubmit} className="mt-4 grid lg:grid-cols-12 gap-4">
          {/* Form */}
          <div className="lg:col-span-7">
            <div className={`${card} p-4 space-y-4`}>
              <div>
                <label className="text-sm font-semibold">Title</label>
                <input
                  className="mt-1 w-full h-11 px-3 rounded-xl border border-[#E7E9FF] dark:border-[#2B2F55] bg-white/70 dark:bg-white/[0.05] outline-none"
                  value={form.title}
                  onChange={(e)=>setForm({...form, title: e.target.value})}
                  placeholder="e.g., Frontend Deep-dive"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-semibold">Type</label>
                  <select
                    className="mt-1 w-full h-11 px-3 rounded-xl border border-[#E7E9FF] dark:border-[#2B2F55] bg-transparent"
                    value={form.type}
                    onChange={(e)=>setForm({...form, type: e.target.value as OfferType})}
                  >
                    <option value="1:1">1:1</option>
                    <option value="group">Group</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-semibold">Visibility</label>
                  <select
                    className="mt-1 w-full h-11 px-3 rounded-xl border border-[#E7E9FF] dark:border-[#2B2F55] bg-transparent"
                    value={form.visibility}
                    onChange={(e)=>setForm({...form, visibility: e.target.value as Visibility})}
                  >
                    <option value="draft">Draft</option>
                    <option value="public">Public</option>
                    <option value="private">Private</option>
                  </select>
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-sm font-semibold">Duration (min)</label>
                  <input type="number" min={15}
                    className="mt-1 w-full h-11 px-3 rounded-xl border border-[#E7E9FF] dark:border-[#2B2F55] bg-white/70 dark:bg-white/[0.05] outline-none"
                    value={form.durationMin}
                    onChange={(e)=>setForm({...form, durationMin: Number(e.target.value)})}
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold">Price</label>
                  <input type="number" min={0}
                    className="mt-1 w-full h-11 px-3 rounded-xl border border-[#E7E9FF] dark:border-[#2B2F55]"
                    value={form.price}
                    onChange={(e)=>setForm({...form, price: Number(e.target.value)})}
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold">Currency</label>
                  <select
                    className="mt-1 w-full h-11 px-3 rounded-xl border border-[#E7E9FF] dark:border-[#2B2F55]"
                    value={form.currency}
                    onChange={(e)=>setForm({...form, currency: e.target.value as any})}
                  >
                    <option>USD</option><option>NGN</option><option>INR</option><option>EUR</option>
                  </select>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-semibold">Sessions included</label>
                  <input type="number" min={1}
                    className="mt-1 w-full h-11 px-3 rounded-xl border border-[#E7E9FF] dark:border-[#2B2F55]"
                    value={form.sessionsIncluded}
                    onChange={(e)=>setForm({...form, sessionsIncluded: Number(e.target.value)})}
                  />
                </div>
                {form.type === "group" && (
                  <div>
                    <label className="text-sm font-semibold">Capacity (group)</label>
                    <input type="number" min={2}
                      className="mt-1 w-full h-11 px-3 rounded-xl border border-[#E7E9FF] dark:border-[#2B2F55]"
                      value={form.capacity}
                      onChange={(e)=>setForm({...form, capacity: Number(e.target.value)})}
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="text-sm font-semibold">Tags (comma-separated)</label>
                <input
                  className="mt-1 w-full h-11 px-3 rounded-xl border border-[#E7E9FF] dark:border-[#2B2F55]"
                  value={form.tags}
                  onChange={(e)=>setForm({...form, tags: e.target.value})}
                  placeholder="frontend, performance, design"
                />
              </div>

              <div>
                <label className="text-sm font-semibold">Description</label>
                <textarea
                  className="mt-1 w-full min-h-[120px] px-3 py-2 rounded-xl border border-[#E7E9FF] dark:border-[#2B2F55]"
                  value={form.description}
                  onChange={(e)=>setForm({...form, description: e.target.value})}
                  placeholder="What mentees get, outcomes, and expectations."
                />
              </div>

              {error && <div className="text-sm text-rose-600">{error}</div>}

              <div className="flex flex-wrap items-center gap-2">
                <button className={`${btnBase} ${btnSolid}`} type="submit" disabled={saving}>
                  {saving ? <Loader2 size={16} className="animate-spin"/> : <Save size={16}/>} Save Offer
                </button>
                <button type="button" className={`${btnBase} ${btnGhost}`}>
                  <Eye size={16}/> Preview
                </button>
              </div>
            </div>
          </div>

          {/* Live Preview */}
          <div className="lg:col-span-5">
            <div className={`${card} p-4 sticky top-4`}>
              <div className="text-sm font-semibold">Preview</div>
              <div className="mt-3 rounded-2xl border border-[#E7E9FF] dark:border-[#2B2F55] p-4">
                <div className="flex items-center gap-2">
                  <div className="h-9 w-9 rounded-xl grid place-items-center bg-[#EEF2FF] dark:bg-white/[0.08] border border-[#E7E9FF] dark:border-[#2B2F55]">
                    {form.type === "group" ? <Users size={16}/> : <Layers size={16}/>}
                  </div>
                  <div className="font-semibold">{form.title || "Offer title"}</div>
                </div>
                <div className="mt-1 text-[12px] text-[#6B72B3] dark:text-[#A7B0FF]/80">
                  {form.description || "Your description will appear here."}
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2 text-[12px]">
                  <div className="rounded-xl border border-[#E7E9FF] dark:border-[#2B2F55] p-2 inline-flex items-center gap-2">
                    <Clock size={14}/> {form.durationMin}m
                  </div>
                  <div className="rounded-xl border border-[#E7E9FF] dark:border-[#2B2F55] p-2 inline-flex items-center gap-2">
                    <Layers size={14}/> {form.sessionsIncluded} session{form.sessionsIncluded>1?"s":""}
                  </div>
                </div>
                <div className="mt-3 text-lg font-extrabold inline-flex items-center gap-2">
                  <DollarSign size={18}/>{form.currency} {form.price.toFixed(2)}
                </div>
                <div className="mt-2 flex flex-wrap gap-1">
                  {(form.tags ? form.tags.split(",").map(s=>s.trim()).filter(Boolean) : ["tag"]).map((t)=>(
                    <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-[#EEF2FF] dark:bg-white/[0.06] border border-[#E7E9FF] dark:border-[#2B2F55] inline-flex items-center gap-1">
                      <Tag size={12}/> {t}
                    </span>
                  ))}
                </div>
                <div className="mt-4">
                  <button className={`${btnBase} ${btnSolid}`}>
                    {form.type === "group" ? "Reserve your spot" : "Book now"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </MentorAppLayout>
  );
}
