import React from "react";
import MenteeAppLayout from "../MenteeAppLayout";
import { CreditCard, Tag, ShieldCheck, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";

const ringIndigo =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#6366F1]/40";
const card =
  "rounded-2xl border border-[#E7E9FF] dark:border-[#2B2F55] bg-white/80 dark:bg-white/[0.05] backdrop-blur";
const btnBase =
  "inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-semibold transition " + ringIndigo;
const btnSolid =
  "text-white bg-gradient-to-r from-[#4F46E5] via-[#6366F1] to-[#8B5CF6]";
const btnGhost =
  "border border-[#D9DBFF] dark:border-[#30345D] text-[#1B1F3A] dark:text-[#E6E9FF] bg-white/70 dark:bg-white/[0.05] hover:bg-white/90 dark:hover:bg-white/[0.08]";

function fmtDay(s: string) {
  const d = new Date(s);
  return d.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" });
}
function fmtTime(s: string) {
  const d = new Date(s);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

type Selection = {
  mentor: { id: string; name: string; title: string; hourly: number; rating: number; reviews: number; mode: string[]; skills: string[] };
  slot: { id: string; mentorId: string; start: string; end: string; durationMin: number };
};

const ME_Checkout: React.FC = () => {
  const navigate = useNavigate();
  const stored = React.useMemo<Selection | null>(() => {
    try {
      const raw = localStorage.getItem("mentee.booking.selection");
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  }, []);

  React.useEffect(() => {
    if (!stored) navigate("/mentee/booking/select-slot");
  }, [stored, navigate]);

  const [coupon, setCoupon] = React.useState("");
  const [discount, setDiscount] = React.useState(0); // %
  const [method, setMethod] = React.useState<"card" | "transfer" | "wallet">("card");

  if (!stored) return null;

  const base = Math.round((stored.mentor.hourly * stored.slot.durationMin / 60) * 100) / 100;
  const fee = Math.round((base * 0.05) * 100) / 100;
  const off = Math.round((base * (discount / 100)) * 100) / 100;
  const total = Math.max(0, Math.round((base + fee - off) * 100) / 100);

  const applyCoupon = () => {
    const code = coupon.trim().toUpperCase();
    if (code === "WELCOME10") setDiscount(10);
    else if (code === "STUDENT15") setDiscount(15);
    else setDiscount(0);
  };

  const confirmPay = () => {
    // mock "payment"
    const payload = { ...stored, price: { base, fee, discountPct: discount, total } };
    localStorage.setItem("mentee.booking.confirmed", JSON.stringify(payload));
    navigate("/mentee/booking/confirm");
  };

  return (
    <MenteeAppLayout>
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold">Checkout</h1>
            <p className="text-sm text-[#5E66A6] dark:text-[#A7B0FF]/85">
              Review details and complete your booking.
            </p>
          </div>
          <Link to="/mentee/booking/select-slot" className={`${btnBase} ${btnGhost}`}>
            <ChevronLeft size={16}/> Back to slots
          </Link>
        </div>

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Summary */}
          <div className="lg:col-span-7 space-y-4">
            <div className={`${card} p-4`}>
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-xl grid place-items-center border border-[#E7E9FF] dark:border-[#2B2F55]">
                  <span className="text-xs font-bold">{stored.mentor.name.split(" ").map(x => x[0]).join("").slice(0,2)}</span>
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold">{stored.mentor.name}</div>
                  <div className="text-xs text-[#6B72B3] dark:text-[#A7B0FF]/80">{stored.mentor.title}</div>
                  <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                    <div className="rounded-lg border border-[#E7E9FF] dark:border-[#2B2F55] p-2">
                      <div className="opacity-70">Date</div>
                      <div className="font-semibold">{fmtDay(stored.slot.start)}</div>
                    </div>
                    <div className="rounded-lg border border-[#E7E9FF] dark:border-[#2B2F55] p-2">
                      <div className="opacity-70">Time</div>
                      <div className="font-semibold">{fmtTime(stored.slot.start)} – {fmtTime(stored.slot.end)}</div>
                    </div>
                    <div className="rounded-lg border border-[#E7E9FF] dark:border-[#2B2F55] p-2">
                      <div className="opacity-70">Duration</div>
                      <div className="font-semibold">{stored.slot.durationMin} min</div>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => { localStorage.removeItem("mentee.booking.selection"); navigate("/mentee/booking/select-slot"); }}
                  className={`${btnBase} ${btnGhost}`}
                  title="Change selection"
                >
                  <Trash2 size={16}/> Change
                </button>
              </div>
            </div>

            <div className={`${card} p-4`}>
              <div className="text-sm font-semibold mb-2">Payment method</div>
              <div className="grid sm:grid-cols-3 gap-2">
                {(["card","transfer","wallet"] as const).map(k => (
                  <button
                    key={k}
                    onClick={() => setMethod(k)}
                    className={`rounded-xl border px-3 py-2 text-left text-sm ${method===k ? "bg-[#EEF2FF] border-[#AAB4FF]" : "bg-white/70 dark:bg-white/[0.05]"} border-[#E7E9FF] dark:border-[#2B2F55] ${ringIndigo}`}
                  >
                    {k === "card" && <span className="inline-flex items-center gap-2"><CreditCard size={16}/> Card</span>}
                    {k === "transfer" && <span className="inline-flex items-center gap-2"><ShieldCheck size={16}/> Bank transfer</span>}
                    {k === "wallet" && <span className="inline-flex items-center gap-2"><ShieldCheck size={16}/> Wallet</span>}
                  </button>
                ))}
              </div>

              {/* Minimal card fields (mock) */}
              {method === "card" && (
                <div className="mt-3 grid sm:grid-cols-2 gap-2">
                  <input className={`h-11 rounded-xl border px-3 bg-white/70 dark:bg-white/[0.05] border-[#E7E9FF] dark:border-[#2B2F55] ${ringIndigo}`} placeholder="Card number 4242 4242 4242 4242"/>
                  <input className={`h-11 rounded-xl border px-3 bg-white/70 dark:bg-white/[0.05] border-[#E7E9FF] dark:border-[#2B2F55] ${ringIndigo}`} placeholder="MM/YY"/>
                  <input className={`h-11 rounded-xl border px-3 bg-white/70 dark:bg-white/[0.05] border-[#E7E9FF] dark:border-[#2B2F55] ${ringIndigo}`} placeholder="CVC"/>
                  <input className={`h-11 rounded-xl border px-3 bg-white/70 dark:bg-white/[0.05] border-[#E7E9FF] dark:border-[#2B2F55] ${ringIndigo}`} placeholder="Name on card"/>
                </div>
              )}
            </div>
          </div>

          {/* Pricing */}
          <div className="lg:col-span-5 space-y-4">
            <div className={`${card} p-4`}>
              <div className="text-sm font-semibold mb-2">Promo code</div>
              <div className="flex gap-2">
                <div className="flex-1 h-11">
                  <input
                    value={coupon}
                    onChange={e => setCoupon(e.target.value)}
                    placeholder="WELCOME10 / STUDENT15"
                    className={`w-full h-11 rounded-xl border px-3 bg-white/70 dark:bg-white/[0.05] border-[#E7E9FF] dark:border-[#2B2F55] ${ringIndigo}`}
                  />
                </div>
                <button className={`${btnBase} ${btnGhost}`} onClick={applyCoupon}><Tag size={16}/> Apply</button>
              </div>
              {discount > 0 && <div className="mt-2 text-xs text-emerald-600">Coupon applied: {discount}% off</div>}
            </div>

            <div className={`${card} p-4`}>
              <div className="text-sm font-semibold mb-2">Price breakdown</div>
              <div className="space-y-2 text-sm">
                <Row label="Session price" value={`$${base.toFixed(2)}`} />
                <Row label="Platform fee (5%)" value={`$${fee.toFixed(2)}`} />
                <Row label="Discount" value={`-$${off.toFixed(2)}`} />
                <hr className="border-[#E7E9FF] dark:border-[#2B2F55]" />
                <Row label="Total" value={`$${total.toFixed(2)}`} strong />
              </div>
              <button className={`mt-4 w-full ${btnBase} ${btnSolid}`} onClick={confirmPay}>
                Pay ${total.toFixed(2)}
              </button>
              <div className="mt-2 text-[11px] text-[#6B72B3] dark:text-[#A7B0FF]/80 flex items-center gap-2">
                <ShieldCheck size={12}/> Payments are secured & encrypted
              </div>
            </div>

            <Link to="/mentee/sessions" className={`${btnBase} ${btnGhost} w-full justify-center`}>
              View My Sessions <ChevronRight size={16}/>
            </Link>
          </div>
        </div>
      </div>
    </MenteeAppLayout>
  );
};

function Row({label, value, strong}: {label: string; value: string; strong?: boolean}) {
  return (
    <div className="flex items-center justify-between">
      <span className="opacity-70">{label}</span>
      <span className={strong ? "font-semibold" : ""}>{value}</span>
    </div>
  );
}

export default ME_Checkout;
