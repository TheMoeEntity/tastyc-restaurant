"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  ChevronRight,
  ChevronLeft,
  Check,
  Loader2,
  UtensilsCrossed,
} from "lucide-react";
import apiFetch from "@/lib/api";
import { Toggle } from "@/components/ui/Toggle";
import type { ApiResponse } from "@/types/api.types";

// ── Types ─────────────────────────────────────────────────────

interface SetupData {
  // Step 1 — Identity
  name: string;
  tagline: string;
  email: string;
  phone: string;
  address: string;

  // Step 2 — Operations
  deliveryFee: number;
  minimumOrderAmount: number;
  deliveryEnabled: boolean;
  pickupEnabled: boolean;
  dineInEnabled: boolean;
  acceptingOrders: boolean;

  // Step 3 — Reservations
  totalCapacity: number;
  maxPartySize: number;
  maxAdvanceDays: number;
  acceptingReservations: boolean;

  // Step 4 — Loyalty
  loyaltyEnabled: boolean;
  pointsPerNaira: number;
  minimumRedemption: number;
}

const DEFAULTS: SetupData = {
  name: "",
  tagline: "",
  email: "",
  phone: "",
  address: "",
  deliveryFee: 1000,
  minimumOrderAmount: 0,
  deliveryEnabled: true,
  pickupEnabled: true,
  dineInEnabled: true,
  acceptingOrders: true,
  totalCapacity: 50,
  maxPartySize: 20,
  maxAdvanceDays: 30,
  acceptingReservations: true,
  loyaltyEnabled: true,
  pointsPerNaira: 0.1,
  minimumRedemption: 100,
};

const STEPS = [
  {
    title: "Restaurant Identity",
    description: "Basic info about your restaurant",
  },
  { title: "Order Settings", description: "How customers can order from you" },
  { title: "Reservations", description: "Table booking configuration" },
  { title: "Loyalty Program", description: "Reward your returning customers" },
];

// ── Field component ───────────────────────────────────────────

function Field({
  label,
  description,
  children,
}: {
  label: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-white/60 text-xs font-semibold uppercase tracking-wider">
        {label}
      </label>
      {description && <p className="text-white/30 text-xs">{description}</p>}
      {children}
    </div>
  );
}

const inputClass =
  "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 outline-none focus:border-yellow-400/50 transition";

// ── Steps ─────────────────────────────────────────────────────

function Step1({
  data,
  onChange,
}: {
  data: SetupData;
  onChange: (k: keyof SetupData, v: any) => void;
}) {
  return (
    <div className="space-y-4">
      <Field label="Restaurant Name *">
        <input
          className={inputClass}
          placeholder="e.g. Tastyc Restaurant"
          value={data.name}
          onChange={(e) => onChange("name", e.target.value)}
        />
      </Field>
      <Field
        label="Tagline"
        description="A short phrase that describes your restaurant"
      >
        <input
          className={inputClass}
          placeholder="e.g. Where every bite tells a story"
          value={data.tagline}
          onChange={(e) => onChange("tagline", e.target.value)}
        />
      </Field>
      <Field label="Contact Email *">
        <input
          className={inputClass}
          type="email"
          placeholder="hello@yourrestaurant.com"
          value={data.email}
          onChange={(e) => onChange("email", e.target.value)}
        />
      </Field>
      <Field label="Phone Number">
        <input
          className={inputClass}
          placeholder="+234 800 000 0000"
          value={data.phone}
          onChange={(e) => onChange("phone", e.target.value)}
        />
      </Field>
      <Field label="Address">
        <input
          className={inputClass}
          placeholder="123 Victoria Island, Lagos"
          value={data.address}
          onChange={(e) => onChange("address", e.target.value)}
        />
      </Field>
    </div>
  );
}

function Step2({
  data,
  onChange,
}: {
  data: SetupData;
  onChange: (k: keyof SetupData, v: any) => void;
}) {
  return (
    <div className="space-y-5">
      <div
        className="space-y-0 rounded-xl border border-white/5 px-4"
        style={{ background: "rgba(255,255,255,0.02)" }}
      >
        <Toggle
          label="Delivery"
          description="Accept delivery orders"
          checked={data.deliveryEnabled}
          onChange={(v) => onChange("deliveryEnabled", v)}
        />
        <Toggle
          label="Pickup"
          description="Accept pickup orders"
          checked={data.pickupEnabled}
          onChange={(v) => onChange("pickupEnabled", v)}
        />
        <Toggle
          label="Dine In"
          description="Accept dine-in orders"
          checked={data.dineInEnabled}
          onChange={(v) => onChange("dineInEnabled", v)}
        />
        <Toggle
          label="Currently Accepting Orders"
          description="Toggle off to pause all orders"
          checked={data.acceptingOrders}
          onChange={(v) => onChange("acceptingOrders", v)}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field
          label="Delivery Fee (₦)"
          description="Charged on delivery orders"
        >
          <input
            className={inputClass}
            type="number"
            value={data.deliveryFee}
            onChange={(e) => onChange("deliveryFee", Number(e.target.value))}
          />
        </Field>
        <Field label="Minimum Order (₦)" description="0 means no minimum">
          <input
            className={inputClass}
            type="number"
            value={data.minimumOrderAmount}
            onChange={(e) =>
              onChange("minimumOrderAmount", Number(e.target.value))
            }
          />
        </Field>
      </div>
    </div>
  );
}

function Step3({
  data,
  onChange,
}: {
  data: SetupData;
  onChange: (k: keyof SetupData, v: any) => void;
}) {
  return (
    <div className="space-y-5">
      <div
        className="rounded-xl border border-white/5 px-4"
        style={{ background: "rgba(255,255,255,0.02)" }}
      >
        <Toggle
          label="Accept Reservations"
          description="Allow customers to book tables"
          checked={data.acceptingReservations}
          onChange={(v) => onChange("acceptingReservations", v)}
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Field
          label="Total Capacity"
          description="Max seats in your restaurant"
        >
          <input
            className={inputClass}
            type="number"
            value={data.totalCapacity}
            onChange={(e) => onChange("totalCapacity", Number(e.target.value))}
          />
        </Field>
        <Field label="Max Party Size" description="Largest group you can seat">
          <input
            className={inputClass}
            type="number"
            value={data.maxPartySize}
            onChange={(e) => onChange("maxPartySize", Number(e.target.value))}
          />
        </Field>
        <Field
          label="Advance Days"
          description="How far ahead customers can book"
        >
          <input
            className={inputClass}
            type="number"
            value={data.maxAdvanceDays}
            onChange={(e) => onChange("maxAdvanceDays", Number(e.target.value))}
          />
        </Field>
      </div>
    </div>
  );
}

function Step4({
  data,
  onChange,
}: {
  data: SetupData;
  onChange: (k: keyof SetupData, v: any) => void;
}) {
  return (
    <div className="space-y-5">
      <div
        className="rounded-xl border border-white/5 px-4"
        style={{ background: "rgba(255,255,255,0.02)" }}
      >
        <Toggle
          label="Enable Loyalty Program"
          description="Customers earn points on every order"
          checked={data.loyaltyEnabled}
          onChange={(v) => onChange("loyaltyEnabled", v)}
        />
      </div>

      {data.loyaltyEnabled && (
        <div className="grid grid-cols-2 gap-4">
          <Field
            label="Points Per ₦1"
            description="e.g. 0.1 = 1 point per ₦10 spent"
          >
            <input
              className={inputClass}
              type="number"
              step="0.01"
              value={data.pointsPerNaira}
              onChange={(e) =>
                onChange("pointsPerNaira", Number(e.target.value))
              }
            />
          </Field>
          <Field
            label="Minimum Redemption"
            description="Minimum points needed to redeem"
          >
            <input
              className={inputClass}
              type="number"
              value={data.minimumRedemption}
              onChange={(e) =>
                onChange("minimumRedemption", Number(e.target.value))
              }
            />
          </Field>
        </div>
      )}

      <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-4">
        <p className="text-yellow-400 text-sm font-semibold mb-1">
          You're almost ready 🎉
        </p>
        <p className="text-white/40 text-xs leading-relaxed">
          These settings can all be changed later from your admin dashboard.
          Click <strong className="text-white/60">Complete Setup</strong> to
          launch your restaurant.
        </p>
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────

export default function SetupPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [data, setData] = useState<SetupData>(DEFAULTS);
  const [submitting, setSubmitting] = useState(false);

  const onChange = (key: keyof SetupData, value: any) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  const canProceed = () => {
    if (step === 0) return data.name.trim() !== "" && data.email.trim() !== "";
    return true;
  };

  const handleNext = () => {
    if (step < STEPS.length - 1) setStep((s) => s + 1);
  };

  const handleBack = () => {
    if (step > 0) setStep((s) => s - 1);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const res = await apiFetch<ApiResponse>("/api/config/onboarding", {
        method: "POST",
        data,
      });

      if (!res.success) throw new Error(res.message);

      // Update the onboarded cookie so middleware doesn't redirect back
      // Remove this:

      // Replace with this:
      const isProduction = window.location.hostname !== "localhost";
      const domain = isProduction ? "; domain=.mosesnwigberi.com" : "";
      document.cookie = `tastyc_is_onboarded=true; path=/${domain}; max-age=604800; SameSite=Lax${isProduction ? "; Secure" : ""}`;

      toast.success("Setup complete! Welcome to Tastyc.");
      router.push("/dashboard/admin");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Setup failed");
    } finally {
      setSubmitting(false);
    }
  };

  const stepComponents = [
    <Step1 key={0} data={data} onChange={onChange} />,
    <Step2 key={1} data={data} onChange={onChange} />,
    <Step3 key={2} data={data} onChange={onChange} />,
    <Step4 key={3} data={data} onChange={onChange} />,
  ];

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background: "#0a0a0a",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <div className="w-full max-w-xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 mb-4">
            <UtensilsCrossed size={24} className="text-yellow-400" />
          </div>
          <h1 className="text-white font-bold text-2xl mb-1">
            Welcome to Tastyc
          </h1>
          <p className="text-white/40 text-sm">
            Let's get your restaurant set up in a few steps
          </p>
        </div>

        {/* Progress steps */}
        <div className="flex items-center gap-2 mb-8">
          {STEPS.map((s, i) => (
            <div key={i} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    i < step
                      ? "bg-yellow-500 text-black"
                      : i === step
                        ? "bg-yellow-500/20 border-2 border-yellow-500 text-yellow-400"
                        : "bg-white/5 border border-white/10 text-white/20"
                  }`}
                >
                  {i < step ? <Check size={14} /> : i + 1}
                </div>
                <p
                  className={`text-[10px] mt-1 font-medium text-center hidden sm:block ${
                    i <= step ? "text-white/60" : "text-white/20"
                  }`}
                >
                  {s.title.split(" ")[0]}
                </p>
              </div>
              {i < STEPS.length - 1 && (
                <div
                  className={`h-px flex-1 mx-1 transition-colors ${
                    i < step ? "bg-yellow-500/50" : "bg-white/5"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Card */}
        <div
          className="rounded-2xl border border-white/5 p-6 mb-4"
          style={{ background: "rgba(255,255,255,0.03)" }}
        >
          <div className="mb-6">
            <h2 className="text-white font-bold text-lg">
              {STEPS[step].title}
            </h2>
            <p className="text-white/40 text-sm mt-0.5">
              {STEPS[step].description}
            </p>
          </div>

          {stepComponents[step]}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between gap-3">
          <button
            onClick={handleBack}
            disabled={step === 0}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/10 text-white/40 hover:text-white hover:border-white/20 text-sm transition disabled:opacity-0"
          >
            <ChevronLeft size={16} /> Back
          </button>

          {step < STEPS.length - 1 ? (
            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className="flex items-center gap-2 px-6 py-2.5 bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-sm rounded-xl transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next <ChevronRight size={16} />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="flex items-center gap-2 px-6 py-2.5 bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-sm rounded-xl transition disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Setting up...
                </>
              ) : (
                <>
                  <Check size={16} /> Complete Setup
                </>
              )}
            </button>
          )}
        </div>

        <p className="text-center text-white/20 text-xs mt-6">
          All settings can be changed later from your admin dashboard
        </p>
      </div>
    </div>
  );
}
