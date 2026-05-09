"use client";

import { useEffect, useState, useRef } from "react";
import { Loader2, AlertCircle, CheckCircle, Upload, Lock } from "lucide-react";
import Image from "next/image";

const API = process.env.NEXT_PUBLIC_API_URL;

interface Profile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: string;
}

export default function UserProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Profile form
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState("");

  // Avatar
  const fileRef = useRef<HTMLInputElement>(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  // Password
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState("");
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    fetch(`${API}/api/users/profile`, { credentials: "include" })
      .then(async (r) => {
        const json = await r.json();
        if (!json.success) throw new Error(json.message);
        const p: Profile = json.data;
        setProfile(p);
        setName(p.name);
        setPhone(p.phone ?? "");
        setAvatarPreview(p.avatar ?? "");
      })
      .catch((err: unknown) => setError(err instanceof Error ? err.message : "Failed to load"))
      .finally(() => setLoading(false));
  }, []);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingAvatar(true);
    try {
      const fd = new FormData();
      fd.append("image", file);
      const r = await fetch(`${API}/api/upload/avatar`, {
        method: "POST",
        credentials: "include",
        body: fd,
      });
      const json = await r.json();
      if (!json.success) throw new Error(json.message ?? "Upload failed");
      setAvatarPreview(json.data.url);
      setProfile((p) => p ? { ...p, avatar: json.data.url } : p);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploadingAvatar(false);
    }
  };

  const saveProfile = async () => {
    setSavingProfile(true);
    setProfileMsg("");
    try {
      const r = await fetch(`${API}/api/users/profile`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name: name || undefined, phone: phone || undefined }),
      });
      const json = await r.json();
      if (!json.success) throw new Error(json.message);
      setProfile((p) => p ? { ...p, name, phone } : p);
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
      const r = await fetch(`${API}/api/users/profile/password`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const json = await r.json();
      if (!json.success) throw new Error(json.message);
      setPasswordMsg("Password changed successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: unknown) {
      setPasswordError(err instanceof Error ? err.message : "Failed to change password");
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
        <h1 className="text-white font-bold text-xl mb-1">Profile</h1>
        <p className="text-white/40 text-sm">Manage your account details</p>
      </div>

      {/* Avatar */}
      <div
        className="rounded-2xl border border-white/5 p-5 flex items-center gap-5"
        style={{ background: "rgba(255,255,255,0.03)" }}
      >
        <div className="relative w-16 h-16 rounded-full overflow-hidden bg-white/5 shrink-0">
          {avatarPreview ? (
            <Image src={avatarPreview} alt="avatar" fill className="object-cover" />
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
        </div>
        <div>
          <p className="text-white font-semibold text-sm">{profile.name}</p>
          <p className="text-white/40 text-xs mb-2 capitalize">{profile.role.toLowerCase()}</p>
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

      {/* Profile form */}
      <div
        className="rounded-2xl border border-white/5 p-5 space-y-4"
        style={{ background: "rgba(255,255,255,0.03)" }}
      >
        <p className="text-white font-semibold text-sm">Personal Information</p>
        <div className="space-y-3">
          <div>
            <label className="block text-white/40 text-xs mb-1.5">Full Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-yellow-400/50"
            />
          </div>
          <div>
            <label className="block text-white/40 text-xs mb-1.5">Email (read-only)</label>
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
          <p className={`text-xs flex items-center gap-1.5 ${profileMsg.includes("success") ? "text-green-400" : "text-red-400"}`}>
            <CheckCircle size={12} /> {profileMsg}
          </p>
        )}
        <button
          onClick={saveProfile}
          disabled={savingProfile}
          className="flex items-center gap-2 px-4 py-2.5 bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-sm rounded-xl transition disabled:opacity-50"
        >
          {savingProfile ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle size={14} />}
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
        {passwordError && <p className="text-red-400 text-xs">{passwordError}</p>}
        {passwordMsg && <p className="text-green-400 text-xs">{passwordMsg}</p>}
        <button
          onClick={savePassword}
          disabled={savingPassword || !currentPassword || !newPassword}
          className="flex items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white font-semibold text-sm rounded-xl transition disabled:opacity-50"
        >
          {savingPassword ? <Loader2 size={14} className="animate-spin" /> : <Lock size={14} />}
          Update Password
        </button>
      </div>
    </div>
  );
}
