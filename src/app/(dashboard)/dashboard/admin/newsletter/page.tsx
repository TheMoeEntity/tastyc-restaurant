"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Loader2,
  AlertCircle,
  RefreshCw,
  Send,
  Users,
  Mail,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Clock,
  Eye,
} from "lucide-react";
import apiFetch from "@/lib/api";
import { toast } from "sonner";
import TiptapEditor from "@/components/ui/TipTapEditor";
import { useConfirmModal } from "@/hooks/useConfirmModal";

// ── Types ─────────────────────────────────────────────────────

interface Subscriber {
  id: string;
  email: string;
  name?: string;
  subscribedAt: string;
}

interface Campaign {
  id: string;
  subject: string;
  sentAt: string;
  recipientCount: number;
}

interface Stats {
  total: number;
  page: number;
  totalPages: number;
}

type Tab = "compose" | "campaigns" | "subscribers";

// ── Simple rich text toolbar ──────────────────────────────────
// We use a contentEditable div instead of a full Tiptap install
// to keep dependencies light. Tiptap can replace this in v2.

function RichTextEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: string) => void;
}) {
  const exec = (cmd: string, val?: string) => {
    document.execCommand(cmd, false, val);
  };

  return (
    <div className="border border-white/10 rounded-xl overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center gap-1 px-3 py-2 border-b border-white/10 bg-white/5 flex-wrap">
        {[
          { cmd: "bold", label: "B", style: "font-bold" },
          { cmd: "italic", label: "I", style: "italic" },
          { cmd: "underline", label: "U", style: "underline" },
        ].map(({ cmd, label, style }) => (
          <button
            key={cmd}
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              exec(cmd);
            }}
            className={`w-7 h-7 rounded text-white/60 hover:text-white hover:bg-white/10 text-xs transition ${style}`}
          >
            {label}
          </button>
        ))}
        <div className="w-px h-4 bg-white/10 mx-1" />
        {[
          { cmd: "insertUnorderedList", label: "• List" },
          { cmd: "insertOrderedList", label: "1. List" },
        ].map(({ cmd, label }) => (
          <button
            key={cmd}
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              exec(cmd);
            }}
            className="px-2 h-7 rounded text-white/60 hover:text-white hover:bg-white/10 text-xs transition"
          >
            {label}
          </button>
        ))}
        <div className="w-px h-4 bg-white/10 mx-1" />
        <select
          onChange={(e) => exec("fontSize", e.target.value)}
          className="bg-transparent text-white/60 text-xs outline-none"
          defaultValue=""
        >
          <option value="" disabled>
            Size
          </option>
          {["1", "2", "3", "4", "5"].map((s) => (
            <option key={s} value={s} className="bg-gray-900">
              {s}
            </option>
          ))}
        </select>
      </div>

      {/* Editor */}
      <div
        contentEditable
        suppressContentEditableWarning
        onInput={(e) => onChange(e.currentTarget.innerHTML)}
        className="min-h-48 p-4 text-white/80 text-sm outline-none focus:bg-white/3 transition"
        style={{ background: "rgba(255,255,255,0.02)" }}
        dangerouslySetInnerHTML={{ __html: value }}
      />
    </div>
  );
}

// ── Compose tab ───────────────────────────────────────────────

function ComposeTab({ subscriberCount }: { subscriberCount: number }) {
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const { confirm, modal } = useConfirmModal();

  const handleSend = async () => {
    if (!subject.trim() || !body.trim()) {
      toast.error("Subject and body are required");
      return;
    }

    const ok = await confirm({
      title: "Send Newsletter?",
      message: `This will send to ${subscriberCount} active subscribers. This action cannot be undone.`,
      confirmLabel: "Send Now",
      cancelLabel: "Cancel",
    });

    if (!ok) return;

    setSending(true);
    try {
      const res = await apiFetch<any>("/api/newsletter/send", {
        method: "POST",
        data: { subject: subject.trim(), body },
      });
      if (!res.success) throw new Error(res.message);
      toast.success(res.message);
      setSent(true);
      setSubject("");
      setBody("");
      setTimeout(() => setSent(false), 5000);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to send");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-5 max-w-2xl">
      {modal}
      {sent && (
        <div className="flex items-center gap-3 bg-green-500/10 border border-green-500/20 rounded-xl px-4 py-3">
          <CheckCircle size={16} className="text-green-400 shrink-0" />
          <p className="text-green-400 text-sm">
            Campaign queued successfully. Emails are being sent.
          </p>
        </div>
      )}

      {subscriberCount === 0 && (
        <div className="flex items-center gap-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl px-4 py-3">
          <AlertCircle size={16} className="text-yellow-400 shrink-0" />
          <p className="text-yellow-400 text-sm">
            No active subscribers. Newsletter will fail to send.
          </p>
        </div>
      )}

      <div>
        <label className="block text-white/40 text-xs mb-1.5">Subject *</label>
        <input
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="e.g. New items on our menu this week!"
          className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-white/20 outline-none focus:border-yellow-400/50 transition"
        />
      </div>

      <div>
        <label className="block text-white/40 text-xs mb-1.5">Body *</label>
        <TiptapEditor
          value={body}
          onChange={setBody}
          placeholder="Write your newsletter content here..."
        />
      </div>
      {/* Preview panel */}
      {showPreview && (
        <div className="rounded-xl border border-white/10 overflow-hidden">
          <div
            className="flex items-center justify-between px-4 py-2 border-b border-white/10"
            style={{ background: "rgba(255,255,255,0.04)" }}
          >
            <p className="text-white/40 text-xs font-semibold uppercase tracking-wider">
              Email Preview
            </p>
            <button
              onClick={() => setShowPreview(false)}
              className="text-white/30 hover:text-white text-xs transition"
            >
              Close
            </button>
          </div>
          {/* Render in an iframe-like white box to simulate email client */}
          <div className="bg-white p-6 max-h-96 overflow-y-auto">
            {/* Email header */}
            <div className="border-b border-gray-200 pb-4 mb-4">
              <p className="text-xs text-gray-400 mb-1">FROM</p>
              <p className="text-sm text-gray-700 font-medium">
                Tastyc 🍽 &lt;
                {process.env.NEXT_PUBLIC_FROM_EMAIL ?? "noreply@tastyc.com"}&gt;
              </p>
              <p className="text-xs text-gray-400 mt-2 mb-1">SUBJECT</p>
              <p className="text-sm font-bold text-gray-900">
                {subject || (
                  <span className="text-gray-400 font-normal italic">
                    No subject
                  </span>
                )}
              </p>
            </div>
            {/* Email body */}
            {body ? (
              <div
                className="prose prose-sm max-w-none text-gray-800"
                dangerouslySetInnerHTML={{ __html: body }}
              />
            ) : (
              <p className="text-gray-400 text-sm italic">No content yet.</p>
            )}
            {/* Unsubscribe footer */}
            <div className="border-t border-gray-200 mt-6 pt-4 text-center">
              <p className="text-gray-400 text-xs">
                You're receiving this because you subscribed to Tastyc updates.{" "}
                <span className="text-gray-400 underline cursor-default">
                  Unsubscribe
                </span>
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between pt-2 flex-wrap gap-3">
        <p className="text-white/30 text-xs">
          Sending to{" "}
          <span className="text-white/60 font-semibold">{subscriberCount}</span>{" "}
          active subscribers
        </p>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowPreview((p) => !p)}
            disabled={!subject && !body}
            className="flex items-center gap-2 px-4 py-2.5 bg-white/5 border border-white/10 hover:bg-white/10 text-white/60 hover:text-white font-semibold text-sm rounded-xl transition disabled:opacity-30"
          >
            <Eye size={14} />
            {showPreview ? "Hide Preview" : "Preview"}
          </button>
          <button
            onClick={handleSend}
            disabled={sending || !subject.trim() || !body.trim()}
            className="flex items-center gap-2 px-5 py-2.5 bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-sm rounded-xl transition disabled:opacity-50"
          >
            {sending ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Send size={14} />
            )}
            {sending ? "Sending..." : "Send Campaign"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Campaigns tab ─────────────────────────────────────────────

function CampaignsTab() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [pagination, setPagination] = useState<Stats>({
    total: 0,
    page: 1,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);

  const fetchCampaigns = useCallback(() => {
    setLoading(true);
    apiFetch<any>(`/api/newsletter/campaigns?page=${page}&limit=10`)
      .then((r) => {
        if (!r.success) throw new Error(r.message);
        setCampaigns(r.data.campaigns);
        setPagination(r.data.pagination);
      })
      .catch((err: unknown) =>
        setError(err instanceof Error ? err.message : "Failed to load"),
      )
      .finally(() => setLoading(false));
  }, [page]);

  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);

  if (loading)
    return (
      <div className="flex justify-center py-16">
        <Loader2 size={24} className="text-yellow-400 animate-spin" />
      </div>
    );

  if (error)
    return (
      <div className="flex flex-col items-center gap-3 py-12">
        <AlertCircle size={24} className="text-red-400" />
        <p className="text-white/40 text-sm">{error}</p>
        <button
          onClick={fetchCampaigns}
          className="flex items-center gap-1.5 text-xs text-yellow-400"
        >
          <RefreshCw size={12} /> Retry
        </button>
      </div>
    );

  if (campaigns.length === 0)
    return (
      <div className="text-center py-16">
        <Clock size={32} className="text-white/10 mx-auto mb-3" />
        <p className="text-white/30 text-sm">No campaigns sent yet.</p>
      </div>
    );

  return (
    <div className="space-y-4">
      <div
        className="rounded-2xl border border-white/5 overflow-hidden"
        style={{ background: "rgba(255,255,255,0.03)" }}
      >
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/5">
              {["Subject", "Sent", "Recipients"].map((h) => (
                <th
                  key={h}
                  className="px-4 py-3 text-left text-white/30 text-xs font-semibold uppercase tracking-wider"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {campaigns.map((c) => (
              <tr key={c.id} className="hover:bg-white/3 transition-colors">
                <td className="px-4 py-3 text-white/80 text-xs font-medium">
                  {c.subject}
                </td>
                <td className="px-4 py-3 text-white/40 text-xs">
                  {new Date(c.sentAt).toLocaleDateString("en-NG", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </td>
                <td className="px-4 py-3 text-white/60 text-xs">
                  {c.recipientCount} subscribers
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-white/30 text-xs">
            {pagination.total} campaigns total
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white disabled:opacity-30 transition"
            >
              <ChevronLeft size={14} />
            </button>
            <span className="text-white/40 text-xs">
              {page} / {pagination.totalPages}
            </span>
            <button
              onClick={() =>
                setPage((p) => Math.min(pagination.totalPages, p + 1))
              }
              disabled={page === pagination.totalPages}
              className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white disabled:opacity-30 transition"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Subscribers tab ───────────────────────────────────────────

function SubscribersTab() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [pagination, setPagination] = useState<Stats>({
    total: 0,
    page: 1,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);

  const fetchSubscribers = useCallback(() => {
    setLoading(true);
    apiFetch<any>(`/api/newsletter/subscribers?page=${page}&limit=20`)
      .then((r) => {
        if (!r.success) throw new Error(r.message);
        setSubscribers(r.data.subscribers);
        setPagination(r.data.pagination);
      })
      .catch((err: unknown) =>
        setError(err instanceof Error ? err.message : "Failed to load"),
      )
      .finally(() => setLoading(false));
  }, [page]);

  useEffect(() => {
    fetchSubscribers();
  }, [fetchSubscribers]);

  if (loading)
    return (
      <div className="flex justify-center py-16">
        <Loader2 size={24} className="text-yellow-400 animate-spin" />
      </div>
    );

  if (error)
    return (
      <div className="flex flex-col items-center gap-3 py-12">
        <AlertCircle size={24} className="text-red-400" />
        <p className="text-white/40 text-sm">{error}</p>
        <button
          onClick={fetchSubscribers}
          className="flex items-center gap-1.5 text-xs text-yellow-400"
        >
          <RefreshCw size={12} /> Retry
        </button>
      </div>
    );

  return (
    <div className="space-y-4">
      <div
        className="rounded-2xl border border-white/5 overflow-hidden"
        style={{ background: "rgba(255,255,255,0.03)" }}
      >
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/5">
              {["Email", "Name", "Subscribed"].map((h) => (
                <th
                  key={h}
                  className="px-4 py-3 text-left text-white/30 text-xs font-semibold uppercase tracking-wider"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {subscribers.map((s) => (
              <tr key={s.id} className="hover:bg-white/3 transition-colors">
                <td className="px-4 py-3 text-white/80 text-xs">{s.email}</td>
                <td className="px-4 py-3 text-white/40 text-xs">
                  {s.name ?? "—"}
                </td>
                <td className="px-4 py-3 text-white/30 text-xs">
                  {new Date(s.subscribedAt).toLocaleDateString("en-NG", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-white/30 text-xs">
            {pagination.total} subscribers total
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white disabled:opacity-30 transition"
            >
              <ChevronLeft size={14} />
            </button>
            <span className="text-white/40 text-xs">
              {page} / {pagination.totalPages}
            </span>
            <button
              onClick={() =>
                setPage((p) => Math.min(pagination.totalPages, p + 1))
              }
              disabled={page === pagination.totalPages}
              className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white disabled:opacity-30 transition"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────

export default function AdminNewsletterPage() {
  const [tab, setTab] = useState<Tab>("compose");
  const [subscriberCount, setSubscriberCount] = useState(0);

  // Fetch subscriber count for compose tab warning
  useEffect(() => {
    apiFetch<any>("/api/newsletter/subscribers?page=1&limit=1")
      .then((r) => {
        if (r.success) setSubscriberCount(r.data.pagination.total);
      })
      .catch(() => {});
  }, []);

  const TABS: { key: Tab; label: string; icon: typeof Mail }[] = [
    { key: "compose", label: "Compose", icon: Send },
    { key: "campaigns", label: "Campaigns", icon: Clock },
    {
      key: "subscribers",
      label: `Subscribers (${subscriberCount})`,
      icon: Users,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-white font-bold text-xl mb-1">Newsletter</h1>
        <p className="text-white/40 text-sm">
          Compose and send newsletters to your subscribers
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white/5 border border-white/10 rounded-xl p-1 w-fit">
        {TABS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-semibold transition ${
              tab === key
                ? "bg-yellow-500 text-black"
                : "text-white/40 hover:text-white"
            }`}
          >
            <Icon size={14} />
            {label}
          </button>
        ))}
      </div>

      {tab === "compose" && <ComposeTab subscriberCount={subscriberCount} />}
      {tab === "campaigns" && <CampaignsTab />}
      {tab === "subscribers" && <SubscribersTab />}
    </div>
  );
}
