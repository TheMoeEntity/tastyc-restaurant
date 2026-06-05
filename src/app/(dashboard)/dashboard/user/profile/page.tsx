"use client";
import apiFetch from "@/lib/api";
import { useEffect, useState, useRef } from "react";
import type { ApiResponse } from "@/types/api.types";
import type { UserUserProfile } from "@/types/user.types";
import {
  Loader2,
  AlertCircle,
  CheckCircle,
  Upload,
  Lock,
  X,
} from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { AnimatePresence, motion } from "framer-motion";

export default function UserProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState("");

  // Avatar
  const fileRef = useRef<HTMLInputElement>(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [avatarModalOpen, setAvatarModalOpen] = useState(false);

  // Password
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState("");
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setAvatarModalOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    apiFetch<ApiResponse<{ user: UserProfile }>>(`/api/users/profile`)
      .then(async (r) => {
        const json = await r;
        if (!json.success) throw new Error(json.message);
        const p: UserProfile = json.data.user;
        setProfile(p);
        setName(p.name);
        setPhone(p.phone ?? "");
        setAvatarPreview(p.avatar ?? "");
      })
      .catch((err: unknown) =>
        setError(err instanceof Error ? err.message : "Failed to load"),
      )
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingAvatar(true);
    try {
      const fd = new FormData();
      fd.append("image", file); // match upload.single("avatar")

      const json = await apiFetch<ApiResponse<{ user: UserProfile; url: string }>>(`/api/upload/avatar`, {
        method: "POST",
        data: fd, // use data, not body — so apiFetch can detect FormData
      });

      if (!json.success) throw new Error(json.message ?? "Upload failed");
      setAvatarPreview(json.data.user.avatar);
      setProfile((p) => (p ? { ...p, avatar: json.data.url } : p));
      toast.success("Profile updated successfully.");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploadingAvatar(false);
    }
  };

  const saveProfile = async () => {
    setSavingProfile(true);
    setProfileMsg("");
    try {
      const json = await apiFetch<ApiResponse<{ user: UserProfile }>>(`/api/users/profile`, {
        method: "PATCH",
        data: {
          name: name || undefined,
          phone: phone || undefined,
        },
      });
      if (!json.success) throw new Error(json.message);
      setProfile((p) => (p ? { ...p, name, phone } : p));
      setProfileMsg("Profile updated successfully.");
    } catch (err: unknown) {
      setProfileMsg(err instanceof Error ? err.message : "Update failed");
    } finally {
      setSavingProfile(false);
    }
  };

  const savePassword = async () => {
    setPasswordError("");
    setPasswordMsg("");
    if (newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match.");
      return;
    }
    setSavingPassword(true);
    try {
      const json = await apiFetch<ApiResponse>(`/api/users/profile/password`, {
        method: "PATCH",
        data: {
          currentPassword,
          newPassword,
        },
      });
      if (!json.success) throw new Error(json.message);
      setPasswordMsg("Password changed successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: unknown) {
      setPasswordError(
        err instanceof Error ? err.message : "Failed to change password",
      );
    } finally {
      setSavingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 size={24} className="text-yellow-400 animate-spin" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-center">
        <AlertCircle size={24} className="text-red-400" />
        <p className="text-white/40 text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-lg">
      <div>
        <h1 className="text-white font-bold text-xl mb-1">UserProfile</h1>
        <p className="text-white/40 text-sm">Manage your account details</p>
      </div>

      {/* Avatar */}
      <div
        className="rounded-2xl border border-white/5 p-5 flex items-center gap-5"
        style={{ background: "rgba(255,255,255,0.03)" }}
      >
        <button
          type="button"
          onClick={() => avatarPreview && setAvatarModalOpen(true)}
          className={`relative w-16 h-16 rounded-full overflow-hidden bg-white/5 shrink-0 group ${avatarPreview ? "cursor-pointer" : "cursor-default"}`}
          aria-label="View profile photo"
        >
          {avatarPreview ? (
            <>
              <Image
                src={avatarPreview}
                alt="avatar"
                fill
                quality={100}
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition flex items-center justify-center">
                <span className="text-white text-[10px] font-medium opacity-0 group-hover:opacity-100 transition">
                  View
                </span>
              </div>
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white font-bold text-xl">
              {profile.name[0]?.toUpperCase()}
            </div>
          )}
          {uploadingAvatar && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Loader2 size={16} className="text-white animate-spin" />
            </div>
          )}
        </button>
        <div>
          <p className="text-white font-semibold text-sm">{profile.name}</p>
          <p className="text-white/40 text-xs mb-2 capitalize">
            {profile.role.toLowerCase()}
          </p>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="hidden"
          />
          <button
            onClick={() => fileRef.current?.click()}
            disabled={uploadingAvatar}
            className="flex items-center gap-1.5 text-xs text-white/50 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-1.5 rounded-lg transition disabled:opacity-50"
          >
            <Upload size={12} /> Change Photo
          </button>
        </div>
      </div>

      {/* UserProfile form */}
      <div
        className="rounded-2xl border border-white/5 p-5 space-y-4"
        style={{ background: "rgba(255,255,255,0.03)" }}
      >
        <p className="text-white font-semibold text-sm">Personal Information</p>
        <div className="space-y-3">
          <div>
            <label className="block text-white/40 text-xs mb-1.5">
              Full Name
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-yellow-400/50"
            />
          </div>
          <div>
            <label className="block text-white/40 text-xs mb-1.5">
              Email (read-only)
            </label>
            <input
              value={profile.email}
              readOnly
              className="w-full bg-white/5 border border-white/5 rounded-xl px-3 py-2.5 text-sm text-white/30 outline-none cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-white/40 text-xs mb-1.5">Phone</label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+234..."
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-white/20 outline-none focus:border-yellow-400/50"
            />
          </div>
        </div>
        {profileMsg && (
          <p
            className={`text-xs flex items-center gap-1.5 ${profileMsg.includes("success") ? "text-green-400" : "text-red-400"}`}
          >
            <CheckCircle size={12} /> {profileMsg}
          </p>
        )}
        <button
          onClick={saveProfile}
          disabled={savingProfile}
          className="flex items-center gap-2 px-4 py-2.5 bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-sm rounded-xl transition disabled:opacity-50"
        >
          {savingProfile ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <CheckCircle size={14} />
          )}
          Save Changes
        </button>
      </div>

      {/* Change password */}
      <div
        className="rounded-2xl border border-white/5 p-5 space-y-4"
        style={{ background: "rgba(255,255,255,0.03)" }}
      >
        <div className="flex items-center gap-2">
          <Lock size={14} className="text-white/40" />
          <p className="text-white font-semibold text-sm">Change Password</p>
        </div>
        <div className="space-y-3">
          <input
            type="password"
            placeholder="Current password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-white/20 outline-none focus:border-yellow-400/50"
          />
          <input
            type="password"
            placeholder="New password (min 8 characters)"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-white/20 outline-none focus:border-yellow-400/50"
          />
          <input
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={`w-full bg-white/5 border rounded-xl px-3 py-2.5 text-sm text-white placeholder-white/20 outline-none focus:border-yellow-400/50 ${
              confirmPassword && confirmPassword !== newPassword
                ? "border-red-500/40"
                : "border-white/10"
            }`}
          />
        </div>
        {passwordError && (
          <p className="text-red-400 text-xs">{passwordError}</p>
        )}
        {passwordMsg && <p className="text-green-400 text-xs">{passwordMsg}</p>}
        <button
          onClick={savePassword}
          disabled={savingPassword || !currentPassword || !newPassword}
          className="flex items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white font-semibold text-sm rounded-xl transition disabled:opacity-50"
        >
          {savingPassword ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <Lock size={14} />
          )}
          Update Password
        </button>
      </div>

      {/* Avatar preview modal */}
      <AnimatePresence>
        {avatarModalOpen && avatarPreview && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setAvatarModalOpen(false)}
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

            {/* Image card */}
            <motion.div
              className="relative z-10 flex flex-col items-center gap-4"
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative w-72 h-72 rounded-2xl overflow-hidden ring-1 ring-white/10 shadow-2xl">
                <Image
                  src={avatarPreview}
                  alt="UserProfile photo"
                  fill
                  className="object-cover"
                  sizes="288px"
                />
              </div>
              <div className="text-center">
                <p className="text-white font-semibold text-sm">
                  {profile.name}
                </p>
                <p className="text-white/40 text-xs capitalize">
                  {profile.role.toLowerCase()}
                </p>
              </div>
              <button
                onClick={() => setAvatarModalOpen(false)}
                className="flex items-center gap-1.5 text-xs text-white/50 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-xl transition"
              >
                <X size={12} /> Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
