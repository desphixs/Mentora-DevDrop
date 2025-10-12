import React from "react";
import { NavLink } from "react-router-dom";
import MentorAppLayout from "./MentorAppLayout";
import {
  Save, Loader2, Camera, Globe, DollarSign, Clock, MapPin, Link as LinkIcon,
  Settings as SettingsIcon, Layout, Eye, ShieldCheck, Edit3
} from "lucide-react";

/* Indigo Glass Tokens */
const ringIndigo = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#6366F1]/40";
const card = "rounded-2xl border border-[#E7E9FF] dark:border-[#2B2F55] bg-white/80 dark:bg-white/[0.05] backdrop-blur";
const btnBase = "inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-semibold transition " + ringIndigo;
const btnSolid = "text-white bg-gradient-to-r from-[#4F46E5] via-[#6366F1] to-[#8B5CF6] shadow-[0_10px_30px_rgba(79,70,229,0.35)] hover:shadow-[0_16px_40px_rgba(79,70,229,0.45)]";
const btnGhost = "border border-[#D9DBFF] dark:border-[#30345D] text-[#1B1F3A] dark:text-[#E6E9FF] bg-white/70 dark:bg-white/[0.05] hover:bg-white/90 dark:hover:bg-white/[0.08]";
const pill = "inline-flex items-center gap-2 rounded-full border border-[#E7E9FF] dark:border-[#2B2F55] bg-white/70 dark:bg-white/[0.05] px-3 py-1 text-[11px] font-semibold";

/** Tabs (router-aware) */
function SettingsTabs() {
  const base = "px-3.5 py-2 rounded-xl text-sm font-semibold transition";
  const active = "text-white bg-[#4F46E5]";
  const idle = "text-[#1B1F3A] dark:text-[#E6E9FF] border border-transparent hover:bg-white/60 dark:hover:bg-white/[0.06]";
  return (
    <div className="w-full overflow-x-auto">
      <div className="inline-flex gap-2">
        <NavLink to="/dashboard/settings" end className={({isActive})=>`${base} ${isActive?active:idle}`}>General</NavLink>
        <NavLink to="/dashboard/settings/notifications" className={({isActive})=>`${base} ${isActive?active:idle}`}>Notifications</NavLink>
        <NavLink to="/dashboard/settings/security" className={({isActive})=>`${base} ${isActive?active:idle}`}>Security</NavLink>
        <NavLink to="/dashboard/settings/integrations" className={({isActive})=>`${base} ${isActive?active:idle}`}>Integrations</NavLink>
      </div>
    </div>
  );
}

/* Types & Dummy */
type GeneralForm = {
  logo?: string;
  orgName: string;
  domain: string;       // mentora.app/<slug>
  website?: string;
  timezone: string;
  weekStart: "Sun"|"Mon";
  currency: "USD"|"EUR"|"GBP"|"NGN"|"INR";
  location?: string;
  brandColor: string;   // hex
  accentColor: string;  // hex
  meetingLengths: number[]; // minutes
  bufferMin: number;
  minNoticeHrs: number;
  publicProfile: boolean;
  showReviews: boolean;
  seoTitle: string;
  seoDescription: string;
};

const DUMMY: GeneralForm = {
  orgName: "Mentora Studio",
  domain: "ada-frontend",
  website: "https://mentora.dev",
  timezone: "America/Los_Angeles",
  weekStart: "Mon",
  currency: "USD",
  location: "San Francisco, USA",
  brandColor: "#4F46E5",
  accentColor: "#8B5CF6",
  meetingLengths: [30, 45, 60],
  bufferMin: 10,
  minNoticeHrs: 3,
  publicProfile: true,
  showReviews: true,
  seoTitle: "Ada — Senior Frontend Mentor",
  seoDescription: "Performance, DX, and design-systems mentorship. Book 1:1 or group sessions.",
};

export default function General() {
  const [form, setForm] = React.useState<GeneralForm>(() => JSON.parse(localStorage.getItem("mentora.settings.general")||"null") ?? DUMMY);
  const [saving, setSaving] = React.useState(false);

  React.useEffect(()=>localStorage.setItem("mentora.settings.general", JSON.stringify(form)),[form]);

  const onLogo = (f?: File) => {
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => setForm((s)=>({ ...s, logo: String(reader.result) }));
    reader.readAsDataURL(f);
  };

  const completeness = Math.min(100, [
    form.orgName, form.domain, form.timezone, form.currency, form.brandColor, form.seoTitle, form.seoDescription
  ].filter(Boolean).length / 7 * 100);

  const save = () => {
    setSaving(true);
    setTimeout(()=>{
      setSaving(false);
      alert("General settings saved");
    }, 650);
  };

  const toggleLen = (m: number) => {
    setForm((s)=>{
      const has = s.meetingLengths.includes(m);
      return { ...s, meetingLengths: has ? s.meetingLengths.filter(x=>x!==m) : [...s.meetingLengths, m].sort((a,b)=>a-b) };
    });
  };

  return (
    <MentorAppLayout>
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-[#0F132E] dark:text-[#E9ECFF]">Settings</h1>
            <p className="text-sm text-[#5E66A6] dark:text-[#A7B0FF]/85">Manage branding, locale, booking rules, and SEO.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className={pill}><Eye size={14}/> Public {form.publicProfile ? "enabled" : "hidden"}</span>
            <span className={pill}><ShieldCheck size={14}/> Reviews {form.showReviews ? "shown" : "hidden"}</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-4"><SettingsTabs/></div>

        {/* Grid */}
        <div className="mt-4 grid lg:grid-cols-12 gap-4">
          {/* Left column */}
          <div className="lg:col-span-8 space-y-4">
            {/* Branding */}
            <div className={`${card} p-4`}>
              <div className="text-sm font-semibold flex items-center gap-2"><Layout size={16}/> Branding</div>
              <div className="mt-3 flex flex-wrap items-center gap-4">
                <div className="relative">
                  <div className="h-20 w-20 rounded-2xl overflow-hidden border border-[#E7E9FF] dark:border-[#2B2F55] bg-[#EEF2FF] dark:bg-white/[0.08] grid place-items-center">
                    {form.logo ? <img src={form.logo} alt="logo" className="h-full w-full object-cover"/> : <SettingsIcon size={28} className="text-[#5E66A6]"/>}
                  </div>
                  <label className={`${btnBase} ${btnGhost} absolute -bottom-2 -right-2 px-2 py-1 cursor-pointer`}>
                    <Camera size={14}/> Upload
                    <input type="file" accept="image/*" className="hidden" onChange={(e)=>onLogo(e.target.files?.[0])}/>
                  </label>
                </div>
                <div className="flex-1 min-w-[220px] grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-semibold">Organization name</label>
                    <input className="mt-1 w-full h-11 px-3 rounded-xl border border-[#E7E9FF] dark:border-[#2B2F55]"
                      value={form.orgName} onChange={(e)=>setForm({...form, orgName:e.target.value})}/>
                  </div>
                  <div>
                    <label className="text-sm font-semibold">Public slug</label>
                    <div className="mt-1 flex items-center gap-2 h-11 px-3 rounded-xl border border-[#E7E9FF] dark:border-[#2B2F55]">
                      <LinkIcon size={14} className="text-[#7077B3]"/>
                      <span className="text-xs text-[#6B72B3] dark:text-[#A7B0FF]/80">mentora.app/</span>
                      <input className="bg-transparent outline-none text-sm w-full" value={form.domain} onChange={(e)=>setForm({...form, domain: e.target.value.toLowerCase().replace(/\s+/g,"-")})}/>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-semibold">Website</label>
                    <input className="mt-1 w-full h-11 px-3 rounded-xl border border-[#E7E9FF] dark:border-[#2B2F55]"
                      value={form.website ?? ""} onChange={(e)=>setForm({...form, website:e.target.value})}/>
                  </div>
                  <div>
                    <label className="text-sm font-semibold">Location</label>
                    <div className="mt-1 flex items-center gap-2 h-11 px-3 rounded-xl border border-[#E7E9FF] dark:border-[#2B2F55]">
                      <MapPin size={14} className="text-[#7077B3]"/>
                      <input className="bg-transparent outline-none text-sm w-full" value={form.location ?? ""} onChange={(e)=>setForm({...form, location:e.target.value})}/>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-semibold">Brand color</label>
                  <div className="mt-1 flex items-center gap-2">
                    <input type="color" value={form.brandColor} onChange={(e)=>setForm({...form, brandColor:e.target.value})}/>
                    <input className="flex-1 h-11 px-3 rounded-xl border border-[#E7E9FF] dark:border-[#2B2F55]" value={form.brandColor} onChange={(e)=>setForm({...form, brandColor:e.target.value})}/>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-semibold">Accent color</label>
                  <div className="mt-1 flex items-center gap-2">
                    <input type="color" value={form.accentColor} onChange={(e)=>setForm({...form, accentColor:e.target.value})}/>
                    <input className="flex-1 h-11 px-3 rounded-xl border border-[#E7E9FF] dark:border-[#2B2F55]" value={form.accentColor} onChange={(e)=>setForm({...form, accentColor:e.target.value})}/>
                  </div>
                </div>
              </div>
            </div>

            {/* Locale & Booking */}
            <div className={`${card} p-4`}>
              <div className="text-sm font-semibold flex items-center gap-2"><Globe size={16}/> Locale & Booking</div>
              <div className="mt-3 grid sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-sm font-semibold">Timezone</label>
                  <select className="mt-1 w-full h-11 px-3 rounded-xl border bg-transparent"
                    value={form.timezone} onChange={(e)=>setForm({...form, timezone:e.target.value})}>
                    {["America/Los_Angeles","America/New_York","Europe/London","Africa/Lagos","Asia/Kolkata","Asia/Dubai"].map(tz=><option key={tz} value={tz}>{tz}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-semibold">Week starts</label>
                  <select className="mt-1 w-full h-11 px-3 rounded-xl border bg-transparent"
                    value={form.weekStart} onChange={(e)=>setForm({...form, weekStart:e.target.value as any})}>
                    <option value="Mon">Monday</option>
                    <option value="Sun">Sunday</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-semibold">Currency</label>
                  <div className="mt-1 flex items-center gap-2 h-11 px-3 rounded-xl border">
                    <DollarSign size={14} className="text-[#7077B3]"/>
                    <select className="bg-transparent outline-none text-sm w-full"
                      value={form.currency} onChange={(e)=>setForm({...form, currency:e.target.value as any})}>
                      {["USD","EUR","GBP","NGN","INR"].map(c=> <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              <div className="mt-4 grid sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-sm font-semibold">Allowed lengths</label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {[15, 30, 45, 60, 90].map(m=>(
                      <label key={m} className={`px-3 py-1 rounded-xl border text-sm cursor-pointer ${form.meetingLengths.includes(m) ? "bg-[#EEF2FF] dark:bg-white/[0.08]" : ""}`}>
                        <input type="checkbox" className="mr-2 accent-[#6366F1]" checked={form.meetingLengths.includes(m)} onChange={()=>toggleLen(m)}/>
                        {m}m
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-semibold">Buffer between sessions (min)</label>
                  <div className="mt-1 flex items-center gap-2 h-11 px-3 rounded-xl border">
                    <Clock size={14} className="text-[#7077B3]"/>
                    <input type="number" min={0} className="bg-transparent outline-none text-sm w-full" value={form.bufferMin} onChange={(e)=>setForm({...form, bufferMin:Number(e.target.value)})}/>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-semibold">Min notice to book (hrs)</label>
                  <div className="mt-1 flex items-center gap-2 h-11 px-3 rounded-xl border">
                    <Clock size={14} className="text-[#7077B3]"/>
                    <input type="number" min={0} className="bg-transparent outline-none text-sm w-full" value={form.minNoticeHrs} onChange={(e)=>setForm({...form, minNoticeHrs:Number(e.target.value)})}/>
                  </div>
                </div>
              </div>
            </div>

            {/* Visibility & SEO */}
            <div className={`${card} p-4`}>
              <div className="text-sm font-semibold flex items-center gap-2"><Eye size={16}/> Visibility & SEO</div>
              <div className="mt-3 grid sm:grid-cols-2 gap-3">
                <label className="inline-flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={form.publicProfile} onChange={(e)=>setForm({...form, publicProfile:e.target.checked})}/>
                  Public profile visible in search
                </label>
                <label className="inline-flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={form.showReviews} onChange={(e)=>setForm({...form, showReviews:e.target.checked})}/>
                  Show ratings & reviews
                </label>
                <div className="sm:col-span-2">
                  <label className="text-sm font-semibold">SEO title</label>
                  <input className="mt-1 w-full h-11 px-3 rounded-xl border" value={form.seoTitle} onChange={(e)=>setForm({...form, seoTitle:e.target.value})}/>
                </div>
                <div className="sm:col-span-2">
                  <label className="text-sm font-semibold">SEO description</label>
                  <textarea className="mt-1 w-full min-h-[90px] px-3 py-2 rounded-xl border" value={form.seoDescription} onChange={(e)=>setForm({...form, seoDescription:e.target.value})}/>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <button className={`${btnBase} ${btnSolid}`} onClick={save} disabled={saving}>
                  {saving ? <Loader2 size={16} className="animate-spin"/> : <Save size={16}/>} Save changes
                </button>
                <span className={pill}>Completeness: {Math.round(completeness)}%</span>
              </div>
            </div>
          </div>

          {/* Right column: Preview card */}
          <div className="lg:col-span-4 space-y-4">
            <div className={`${card} p-4`}>
              <div className="text-sm font-semibold flex items-center gap-2"><Edit3 size={16}/> Preview</div>
              <div className="mt-3 rounded-2xl border border-[#E7E9FF] dark:border-[#2B2F55] overflow-hidden">
                <div className="h-2" style={{ background: `linear-gradient(90deg, ${form.brandColor}, ${form.accentColor})` }}/>
                <div className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl border border-[#E7E9FF] dark:border-[#2B2F55] overflow-hidden bg-[#EEF2FF] dark:bg-white/[0.06]">
                      {form.logo ? <img src={form.logo} className="h-full w-full object-cover" /> : null}
                    </div>
                    <div>
                      <div className="font-semibold">{form.orgName}</div>
                      <div className="text-[12px] text-[#6B72B3] dark:text-[#A7B0FF]/80">mentora.app/{form.domain}</div>
                    </div>
                  </div>
                  <div className="mt-3 text-sm">{form.seoTitle}</div>
                  <div className="text-[12px] text-[#6B72B3] dark:text-[#A7B0FF]/80">{form.seoDescription}</div>
                </div>
              </div>
            </div>
            <div className={`${card} p-4`}>
              <div className="text-sm font-semibold flex items-center gap-2"><ShieldCheck size={16}/> Tips</div>
              <ul className="mt-2 text-sm list-disc pl-5 space-y-1 text-[#5E66A6] dark:text-[#A7B0FF]/85">
                <li>Short, specific SEO title improves CTR.</li>
                <li>Keep brand & accent contrasting for readability.</li>
                <li>Set minimum notice to avoid last-minute rush.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </MentorAppLayout>
  );
}
