"use client";

import { useEffect, useState, useRef } from "react";
import {
  Loader2,
  Save,
  Upload,
  Store,
  ShoppingBag,
  Calendar,
  Star,
  Clock,
} from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import apiFetch from "@/lib/api";
import { Toggle } from "@/components/ui/Toggle";
import type { ApiResponse } from "@/types/api.types";

// ── Types ─────────────────────────────────────────────────────

interface RestaurantConfig {
  name: string;
  tagline: string | null;
  logo: string | null;
  address: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  timezone: string;
  currency: string;
  currencySymbol: string;
  acceptingOrders: boolean;
  minimumOrderAmount: number;
  deliveryFee: number;
  deliveryEnabled: boolean;
  pickupEnabled: boolean;
  dineInEnabled: boolean;
  totalCapacity: number;
  slotDurationMinutes: number;
  reminderHoursBefore: number;
  maxAdvanceDays: number;
  maxPartySize: number;
  acceptingReservations: boolean;
  pointsPerNaira: number;
  pointsRedemptionRate: number;
  minimumRedemption: number;
  loyaltyEnabled: boolean;
  openingHours: Record<
    string,
    { open: string; close: string; closed: boolean }
  > | null;
}

const DAYS = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

const DEFAULT_HOURS = DAYS.reduce(
  (acc, day) => ({
    ...acc,
    [day]: { open: "10:00", close: "22:00", closed: false },
  }),
  {} as Record<string, { open: string; close: string; closed: boolean }>,
);

// ── Reusable components ───────────────────────────────────────

function SectionCard({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: typeof Store;
  children: React.ReactNode;
}) {
  return (
    <div
      className="rounded-2xl border border-white/5 p-6 space-y-5"
      style={{ background: "rgba(255,255,255,0.03)" }}
    >
      <div className="flex items-center gap-3 pb-3 border-b border-white/5">
        <div className="w-8 h-8 rounded-lg bg-yellow-500/10 flex items-center justify-center">
          <Icon size={16} className="text-yellow-400" />
        </div>
        <h2 className="text-white font-semibold text-sm">{title}</h2>
      </div>
      {children}
    </div>
  );
}

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
  "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/20 outline-none focus:border-yellow-400/50 transition";

// ── Main page ─────────────────────────────────────────────────

export default function AdminSettingsPage() {
  const [config, setConfig] = useState<RestaurantConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [logoUploading, setLogoUploading] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const logoRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    apiFetch<ApiResponse<{ config: RestaurantConfig }>>("/api/config")
      .then((r) => {
        if (r.success) {
          setConfig(r.data.config);
          setLogoPreview(r.data.config.logo);
        }
      })
      .catch(() => toast.error("Failed to load settings"))
      .finally(() => setLoading(false));
  }, []);

  const update = (key: keyof RestaurantConfig, value: RestaurantConfig[keyof RestaurantConfig]) => {
    setConfig((prev) => (prev ? { ...prev, [key]: value } : prev));
  };

  const saveSection = async (
    section: string,
    data: Partial<RestaurantConfig>,
  ) => {
    setSaving(section);
    try {
      const r = await apiFetch<ApiResponse<{ config: RestaurantConfig }>>("/api/config", {
        method: "PATCH",
        data,
      });
      if (!r.success) throw new Error(r.message);
      toast.success("Settings saved");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(null);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLogoPreview(URL.createObjectURL(file));
    setLogoUploading(true);

    try {
      const fd = new FormData();
      fd.append("image", file);
      const up = await apiFetch<ApiResponse<{ url: string }>>("/api/upload/menu", {
        method: "POST",
        data: fd,
      });
      if (!up.success) throw new Error(up.message);

      const logoUrl = up.data.url;
      update("logo", logoUrl);
      setLogoPreview(logoUrl);

      // Save immediately
      await apiFetch<ApiResponse<{ config: RestaurantConfig }>>("/api/config", {
        method: "PATCH",
        data: { logo: logoUrl },
      });
      toast.success("Logo updated");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
      setLogoPreview(config?.logo ?? null);
    } finally {
      setLogoUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 size={24} className="text-yellow-400 animate-spin" />
      </div>
    );
  }

  if (!config) return null;

  const hours = config.openingHours ?? DEFAULT_HOURS;

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-white font-bold text-xl mb-1">Settings</h1>
        <p className="text-white/40 text-sm">
          Manage your restaurant configuration
        </p>
      </div>

      {/* ── General ── */}
      <SectionCard title="General" icon={Store}>
        {/* Logo */}
        <Field label="Restaurant Logo">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl border border-white/10 bg-white/5 overflow-hidden flex items-center justify-center shrink-0">
              {logoPreview ? (
                <Image
                  src={logoPreview}
                  alt="Logo"
                  width={64}
                  height={64}
                  className="object-cover w-full h-full"
                />
              ) : (
                <Store size={24} className="text-white/20" />
              )}
            </div>
            <div>
              <input
                ref={logoRef}
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
              />
              <button
                onClick={() => logoRef.current?.click()}
                disabled={logoUploading}
                className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white/60 hover:text-white text-xs transition disabled:opacity-50"
              >
                {logoUploading ? (
                  <Loader2 size={12} className="animate-spin" />
                ) : (
                  <Upload size={12} />
                )}
                {logoUploading ? "Uploading..." : "Upload Logo"}
              </button>
              <p className="text-white/20 text-xs mt-1">PNG, JPG up to 2MB</p>
            </div>
          </div>
        </Field>

        <div className="grid grid-cols-1 gap-4">
          <Field label="Restaurant Name">
            <input
              className={inputClass}
              value={config.name}
              onChange={(e) => update("name", e.target.value)}
              placeholder="Tastyc Restaurant"
            />
          </Field>
          <Field label="Tagline">
            <input
              className={inputClass}
              value={config.tagline ?? ""}
              onChange={(e) => update("tagline", e.target.value)}
              placeholder="Where every bite tells a story"
            />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Phone">
              <input
                className={inputClass}
                value={config.phone ?? ""}
                onChange={(e) => update("phone", e.target.value)}
                placeholder="+234 800 000 0000"
              />
            </Field>
            <Field label="Email">
              <input
                className={inputClass}
                value={config.email ?? ""}
                onChange={(e) => update("email", e.target.value)}
                placeholder="hello@restaurant.com"
              />
            </Field>
          </div>
          <Field label="Address">
            <input
              className={inputClass}
              value={config.address ?? ""}
              onChange={(e) => update("address", e.target.value)}
              placeholder="123 Victoria Island, Lagos"
            />
          </Field>
          <Field label="Website">
            <input
              className={inputClass}
              value={config.website ?? ""}
              onChange={(e) => update("website", e.target.value)}
              placeholder="https://yourrestaurant.com"
            />
          </Field>
        </div>

        <button
          onClick={() =>
            saveSection("general", {
              name: config.name,
              tagline: config.tagline,
              phone: config.phone,
              email: config.email,
              address: config.address,
              website: config.website,
            })
          }
          disabled={saving === "general"}
          className="flex items-center gap-2 px-4 py-2.5 bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-sm rounded-xl transition disabled:opacity-50"
        >
          {saving === "general" ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <Save size={14} />
          )}
          Save General
        </button>
      </SectionCard>

      {/* ── Opening Hours ── */}
      <SectionCard title="Opening Hours" icon={Clock}>
        <div className="space-y-3">
          {DAYS.map((day) => {
            const dayHours = (hours as any)[day] ?? {
              open: "10:00",
              close: "22:00",
              closed: false,
            };
            return (
              <div key={day} className="flex items-center gap-3">
                <div className="w-24 shrink-0">
                  <p className="text-white/60 text-xs font-semibold capitalize">
                    {day}
                  </p>
                </div>
                <div
                  className={`flex items-center gap-3 flex-1 ${dayHours.closed ? "opacity-40" : ""}`}
                >
                  <input
                    type="time"
                    value={dayHours.open}
                    disabled={dayHours.closed}
                    onChange={(e) => {
                      const updated = {
                        ...hours,
                        [day]: { ...dayHours, open: e.target.value },
                      };
                      update("openingHours", updated);
                    }}
                    className="bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white outline-none focus:border-yellow-400/50 disabled:cursor-not-allowed"
                  />
                  <span className="text-white/30 text-xs">to</span>
                  <input
                    type="time"
                    value={dayHours.close}
                    disabled={dayHours.closed}
                    onChange={(e) => {
                      const updated = {
                        ...hours,
                        [day]: { ...dayHours, close: e.target.value },
                      };
                      update("openingHours", updated);
                    }}
                    className="bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white outline-none focus:border-yellow-400/50 disabled:cursor-not-allowed"
                  />
                </div>
                <button
                  onClick={() => {
                    const updated = {
                      ...hours,
                      [day]: { ...dayHours, closed: !dayHours.closed },
                    };
                    update("openingHours", updated);
                  }}
                  className={`text-xs px-2.5 py-1 rounded-lg font-semibold transition shrink-0 ${dayHours.closed ? "bg-red-500/20 text-red-400 hover:bg-red-500/30" : "bg-white/5 text-white/40 hover:text-white"}`}
                >
                  {dayHours.closed ? "Closed" : "Open"}
                </button>
              </div>
            );
          })}
        </div>

        <button
          onClick={() => saveSection("hours", { openingHours: hours })}
          disabled={saving === "hours"}
          className="flex items-center gap-2 px-4 py-2.5 bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-sm rounded-xl transition disabled:opacity-50"
        >
          {saving === "hours" ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <Save size={14} />
          )}
          Save Hours
        </button>
      </SectionCard>

      {/* ── Orders ── */}
      <SectionCard title="Order Settings" icon={ShoppingBag}>
        <div
          className="rounded-xl border border-white/5 px-4"
          style={{ background: "rgba(255,255,255,0.02)" }}
        >
          <Toggle
            label="Accepting Orders"
            description="Toggle off to pause all incoming orders"
            checked={config.acceptingOrders}
            onChange={(v) => update("acceptingOrders", v)}
          />
          <Toggle
            label="Delivery"
            description="Accept delivery orders"
            checked={config.deliveryEnabled}
            onChange={(v) => update("deliveryEnabled", v)}
          />
          <Toggle
            label="Pickup"
            description="Accept pickup orders"
            checked={config.pickupEnabled}
            onChange={(v) => update("pickupEnabled", v)}
          />
          <Toggle
            label="Dine In"
            description="Accept dine-in orders"
            checked={config.dineInEnabled}
            onChange={(v) => update("dineInEnabled", v)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Delivery Fee (₦)">
            <input
              type="number"
              className={inputClass}
              value={config.deliveryFee}
              onChange={(e) => update("deliveryFee", Number(e.target.value))}
            />
          </Field>
          <Field label="Minimum Order (₦)" description="0 means no minimum">
            <input
              type="number"
              className={inputClass}
              value={config.minimumOrderAmount}
              onChange={(e) =>
                update("minimumOrderAmount", Number(e.target.value))
              }
            />
          </Field>
        </div>

        <button
          onClick={() =>
            saveSection("orders", {
              acceptingOrders: config.acceptingOrders,
              deliveryEnabled: config.deliveryEnabled,
              pickupEnabled: config.pickupEnabled,
              dineInEnabled: config.dineInEnabled,
              deliveryFee: config.deliveryFee,
              minimumOrderAmount: config.minimumOrderAmount,
            })
          }
          disabled={saving === "orders"}
          className="flex items-center gap-2 px-4 py-2.5 bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-sm rounded-xl transition disabled:opacity-50"
        >
          {saving === "orders" ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <Save size={14} />
          )}
          Save Order Settings
        </button>
      </SectionCard>

      {/* ── Reservations ── */}
      <SectionCard title="Reservations" icon={Calendar}>
        <div
          className="rounded-xl border border-white/5 px-4"
          style={{ background: "rgba(255,255,255,0.02)" }}
        >
          <Toggle
            label="Accepting Reservations"
            description="Toggle off to pause all bookings"
            checked={config.acceptingReservations}
            onChange={(v) => update("acceptingReservations", v)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field
            label="Total Capacity"
            description="Max seats in your restaurant"
          >
            <input
              type="number"
              className={inputClass}
              value={config.totalCapacity}
              onChange={(e) => update("totalCapacity", Number(e.target.value))}
            />
          </Field>
          <Field label="Max Party Size">
            <input
              type="number"
              className={inputClass}
              value={config.maxPartySize}
              onChange={(e) => update("maxPartySize", Number(e.target.value))}
            />
          </Field>
          <Field label="Slot Duration (mins)">
            <input
              type="number"
              className={inputClass}
              value={config.slotDurationMinutes}
              onChange={(e) =>
                update("slotDurationMinutes", Number(e.target.value))
              }
            />
          </Field>
          <Field
            label="Max Advance Days"
            description="How far ahead customers can book"
          >
            <input
              type="number"
              className={inputClass}
              value={config.maxAdvanceDays}
              onChange={(e) => update("maxAdvanceDays", Number(e.target.value))}
            />
          </Field>
          <Field
            label="Reminder Hours Before"
            description="When to send reminder email"
          >
            <input
              type="number"
              className={inputClass}
              value={config.reminderHoursBefore}
              onChange={(e) =>
                update("reminderHoursBefore", Number(e.target.value))
              }
            />
          </Field>
        </div>

        <button
          onClick={() =>
            saveSection("reservations", {
              acceptingReservations: config.acceptingReservations,
              totalCapacity: config.totalCapacity,
              maxPartySize: config.maxPartySize,
              slotDurationMinutes: config.slotDurationMinutes,
              maxAdvanceDays: config.maxAdvanceDays,
              reminderHoursBefore: config.reminderHoursBefore,
            })
          }
          disabled={saving === "reservations"}
          className="flex items-center gap-2 px-4 py-2.5 bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-sm rounded-xl transition disabled:opacity-50"
        >
          {saving === "reservations" ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <Save size={14} />
          )}
          Save Reservation Settings
        </button>
      </SectionCard>

      {/* ── Loyalty ── */}
      <SectionCard title="Loyalty Program" icon={Star}>
        <div
          className="rounded-xl border border-white/5 px-4"
          style={{ background: "rgba(255,255,255,0.02)" }}
        >
          <Toggle
            label="Enable Loyalty Program"
            description="Customers earn points on every order"
            checked={config.loyaltyEnabled}
            onChange={(v) => update("loyaltyEnabled", v)}
          />
        </div>

        {config.loyaltyEnabled && (
          <div className="grid grid-cols-2 gap-4">
            <Field
              label="Points Per ₦1"
              description="e.g. 0.1 = 1 point per ₦10"
            >
              <input
                type="number"
                step="0.01"
                className={inputClass}
                value={config.pointsPerNaira}
                onChange={(e) =>
                  update("pointsPerNaira", Number(e.target.value))
                }
              />
            </Field>
            <Field label="Redemption Rate" description="₦ value per point">
              <input
                type="number"
                step="0.001"
                className={inputClass}
                value={config.pointsRedemptionRate}
                onChange={(e) =>
                  update("pointsRedemptionRate", Number(e.target.value))
                }
              />
            </Field>
            <Field
              label="Minimum Redemption"
              description="Minimum points to redeem"
            >
              <input
                type="number"
                className={inputClass}
                value={config.minimumRedemption}
                onChange={(e) =>
                  update("minimumRedemption", Number(e.target.value))
                }
              />
            </Field>
          </div>
        )}

        <button
          onClick={() =>
            saveSection("loyalty", {
              loyaltyEnabled: config.loyaltyEnabled,
              pointsPerNaira: config.pointsPerNaira,
              pointsRedemptionRate: config.pointsRedemptionRate,
              minimumRedemption: config.minimumRedemption,
            })
          }
          disabled={saving === "loyalty"}
          className="flex items-center gap-2 px-4 py-2.5 bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-sm rounded-xl transition disabled:opacity-50"
        >
          {saving === "loyalty" ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <Save size={14} />
          )}
          Save Loyalty Settings
        </button>
      </SectionCard>
    </div>
  );
}
