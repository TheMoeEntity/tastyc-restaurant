"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { io, Socket } from "socket.io-client";
import apiFetch from "@/lib/api";
import type { ApiResponse } from "@/types/api.types";
import { Hash, Send, Pin, Loader2, MessageSquare, Shield } from "lucide-react";
import {
  type ChatMessage,
  CHAT_CHANNELS,
  CHAT_ROLE_COLORS,
} from "@/types/chat.types";
import { getCookieToken } from "@/lib/Helper";
import Avatar from "@/components/ui/Avatar";
import MessageBubble from "@/components/ui/MessageBubble";

const API = process.env.NEXT_PUBLIC_API_URL!;

export default function ChatPage() {
  const { user } = useAuth();
  const [activeChannel, setActiveChannel] = useState("general");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>({
    general: [],
    kitchen: [],
    floor: [],
  });
  const [pinnedMessages, setPinnedMessages] = useState<
    Record<string, ChatMessage | null>
  >({ general: null, kitchen: null, floor: null });
  const [unread, setUnread] = useState<Record<string, number>>({
    general: 0,
    kitchen: 0,
    floor: 0,
  });
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const role = user?.role ?? "";
  const accessibleChannels = Object.entries(CHAT_CHANNELS).filter(([, config]) =>
    config.roles.includes(role),
  );

  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const loadMessages = useCallback(async (channel: string) => {
    try {
      const r = await apiFetch<ApiResponse<{ messages: ChatMessage[] }>>(`/api/chat/${channel}/messages`);
      if (r.success) setMessages((prev) => ({ ...prev, [channel]: r.data.messages }));
    } catch { /* silent */ }
  }, []);

  const loadPinned = useCallback(async (channel: string) => {
    try {
      const r = await apiFetch<ApiResponse<{ message: ChatMessage }>>(`/api/chat/${channel}/pinned`);
      if (r.success) setPinnedMessages((prev) => ({ ...prev, [channel]: r.data.message }));
    } catch { /* silent */ }
  }, []);

  useEffect(() => {
    const loadAll = async () => {
      setLoading(true);
      await Promise.all(
        accessibleChannels.map(([channel]) =>
          Promise.all([loadMessages(channel), loadPinned(channel)]),
        ),
      );
      setLoading(false);
    };
    if (role) loadAll();
  }, [role]);

  useEffect(() => {
    if (!role) return;

    const token = getCookieToken();
    const socket = io(API, { auth: { token }, transports: ["websocket"] });
    socketRef.current = socket;

    socket.on("connect", () => { setConnected(true); socket.emit("join-chat"); });
    socket.on("disconnect", () => setConnected(false));

    socket.on("chat:message", (msg: ChatMessage) => {
      setMessages((prev) => ({
        ...prev,
        [msg.channel]: [...(prev[msg.channel] ?? []), msg],
      }));
      if (msg.channel !== activeChannel && msg.user.id !== user?.id) {
        setUnread((prev) => ({ ...prev, [msg.channel]: (prev[msg.channel] ?? 0) + 1 }));
      }
    });

    socket.on("chat:unpin", (data: { channel: string }) => {
      setPinnedMessages((prev) => ({ ...prev, [data.channel]: null }));
    });

    socket.on("chat:pinned", (msg: ChatMessage) => {
      setPinnedMessages((prev) => ({ ...prev, [msg.channel]: msg }));
    });

    return () => { socket.disconnect(); };
  }, [role]);

  useEffect(() => { scrollToBottom(); }, [messages[activeChannel]]);

  useEffect(() => {
    setUnread((prev) => ({ ...prev, [activeChannel]: 0 }));
    inputRef.current?.focus();
  }, [activeChannel]);

  const handleSend = async () => {
    if (!input.trim() || sending) return;
    setSending(true);
    const text = input.trim();
    setInput("");
    try {
      await apiFetch(`/api/chat/${activeChannel}/messages`, {
        method: "POST",
        data: { message: text },
      });
    } catch {
      setInput(text);
    } finally {
      setSending(false);
    }
  };

  const handlePin = async (messageId: string) => {
    try {
      await apiFetch(`/api/chat/${activeChannel}/messages/${messageId}/pin`, {
        method: "PATCH",
      });
    } catch { /* silent */ }
  };

  const canPin = ["MANAGER", "SUPERADMIN"].includes(role);
  const currentMessages = messages[activeChannel] ?? [];
  const pinnedMessage = pinnedMessages[activeChannel];
  const channelConfig = CHAT_CHANNELS[activeChannel];

  return (
    <div className="flex h-[calc(100vh-4rem)] -m-4 md:-m-6 overflow-hidden">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <div
        className={`fixed lg:relative inset-y-0 left-0 z-30 w-56 shrink-0 border-r border-white/5 flex flex-col transition-transform duration-200 ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
        style={{ background: "rgba(255,255,255,0.02)" }}
      >
        <div className="p-4 border-b border-white/5 flex items-center justify-between">
          <div>
            <h2 className="text-white font-bold text-sm">Staff Chat</h2>
            <div className="flex items-center gap-1.5 mt-1">
              <span className={`w-1.5 h-1.5 rounded-full ${connected ? "bg-green-400" : "bg-red-400"}`} />
              <span className="text-white/30 text-xs">
                {connected ? "Connected" : "Disconnected"}
              </span>
            </div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-white/30 hover:text-white transition">
            ✕
          </button>
        </div>

        <div className="flex-1 p-2 space-y-1">
          {accessibleChannels.map(([channel, config]) => {
            const isActive = channel === activeChannel;
            const count = unread[channel] ?? 0;
            return (
              <button
                key={channel}
                onClick={() => { setActiveChannel(channel); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left transition ${isActive ? "bg-yellow-500/15 border border-yellow-500/20" : "hover:bg-white/5 border border-transparent"}`}
              >
                <Hash size={14} className={isActive ? "text-yellow-400" : "text-white/30"} />
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-semibold truncate ${isActive ? "text-yellow-400" : "text-white/60"}`}>
                    {config.label}
                  </p>
                </div>
                {count > 0 && (
                  <span className="w-5 h-5 bg-yellow-500 text-black text-[10px] font-bold rounded-full flex items-center justify-center shrink-0">
                    {count > 9 ? "9+" : count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="p-3 border-t border-white/5">
          <div className="flex items-center gap-2">
            <Avatar name={user?.name ?? "?"} size={7} />
            <div className="flex-1 min-w-0">
              <p className="text-white/70 text-xs font-semibold truncate">{user?.name}</p>
              <p className={`text-[10px] ${CHAT_ROLE_COLORS[role] ?? "text-white/30"}`}>{role}</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main chat area ── */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="px-4 py-3 border-b border-white/5 flex items-center gap-3 shrink-0">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-white/40 hover:text-white transition">
            <Hash size={16} />
          </button>
          <Hash size={16} className="text-yellow-400 shrink-0" />
          <div>
            <p className="text-white font-semibold text-sm">{channelConfig?.label}</p>
            <p className="text-white/30 text-xs">{channelConfig?.description}</p>
          </div>
          {canPin && (
            <div className="ml-auto flex items-center gap-1.5 text-white/20 text-xs">
              <Shield size={12} /> Can pin messages
            </div>
          )}
        </div>

        {pinnedMessage && (
          <div className="mx-4 mt-3 px-3 py-2 rounded-xl bg-yellow-500/5 border border-yellow-500/20 flex items-start gap-2 shrink-0">
            <Pin size={12} className="text-yellow-400 mt-0.5 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-yellow-400 text-[10px] font-semibold mb-0.5">
                Pinned by {pinnedMessage.pinnedBy?.name ?? "Manager"}
              </p>
              <p className="text-white/60 text-xs truncate">{pinnedMessage.message}</p>
            </div>
            {canPin && (
              <button
                onClick={async () => {
                  try {
                    await apiFetch(`/api/chat/${activeChannel}/pinned`, { method: "DELETE" });
                    setPinnedMessages((prev) => ({ ...prev, [activeChannel]: null }));
                  } catch { /* silent */ }
                }}
                className="text-white/20 hover:text-red-400 transition shrink-0 text-[10px]"
                title="Unpin"
              >
                ✕
              </button>
            )}
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 size={20} className="text-yellow-400 animate-spin" />
            </div>
          ) : currentMessages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <MessageSquare size={32} className="text-white/10 mb-3" />
              <p className="text-white/30 text-sm">No messages yet</p>
              <p className="text-white/20 text-xs mt-1">
                Be the first to say something in #{channelConfig?.label.toLowerCase()}
              </p>
            </div>
          ) : (
            currentMessages.map((msg) => (
              <MessageBubble
                key={msg.id}
                msg={msg}
                isOwn={msg.user.id === user?.id}
                canPin={canPin}
                onPin={handlePin}
              />
            ))
          )}
          <div ref={bottomRef} />
        </div>

        <div className="p-4 border-t border-white/5 shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder={`Message #${channelConfig?.label.toLowerCase()}...`}
                maxLength={1000}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/20 outline-none focus:border-yellow-400/50 transition pr-12"
              />
              {input.length > 800 && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-white/30">
                  {1000 - input.length}
                </span>
              )}
            </div>
            <button
              onClick={handleSend}
              disabled={!input.trim() || sending}
              className="w-10 h-10 bg-yellow-500 hover:bg-yellow-400 text-black rounded-xl flex items-center justify-center transition disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
            >
              {sending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
            </button>
          </div>
          <p className="text-white/20 text-[10px] mt-1.5 ml-1">
            Press Enter to send · Shift+Enter for new line
          </p>
        </div>
      </div>
    </div>
  );
}
