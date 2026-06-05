"use client";

import { useState } from "react";
import { Pin } from "lucide-react";
import type { ChatMessage } from "@/types/chat.types";
import { CHAT_ROLE_COLORS } from "@/types/chat.types";
import { timeAgo } from "@/lib/Helper";
import Avatar from "./Avatar";

interface MessageBubbleProps {
  msg: ChatMessage;
  isOwn: boolean;
  canPin: boolean;
  onPin: (id: string) => void;
}

export default function MessageBubble({ msg, isOwn, canPin, onPin }: MessageBubbleProps) {
  const [showPin, setShowPin] = useState(false);

  return (
    <div
      className={`flex gap-2.5 group ${isOwn ? "flex-row-reverse" : "flex-row"}`}
      onMouseEnter={() => setShowPin(true)}
      onMouseLeave={() => setShowPin(false)}
    >
      <Avatar name={msg.user.name} src={msg.user.avatar} size={8} />

      <div className={`max-w-[70%] ${isOwn ? "items-end" : "items-start"} flex flex-col gap-1`}>
        <div className={`flex items-center gap-2 ${isOwn ? "flex-row-reverse" : "flex-row"}`}>
          <span className={`text-xs font-semibold ${CHAT_ROLE_COLORS[msg.user.role] ?? "text-white/60"}`}>
            {isOwn ? "You" : msg.user.name}
          </span>
          <span className="text-white/20 text-[10px]">{timeAgo(msg.createdAt)}</span>
          {msg.isPinned && (
            <span className="flex items-center gap-0.5 text-[10px] text-yellow-400">
              <Pin size={10} /> pinned
            </span>
          )}
        </div>

        <div
          className={`relative px-3 py-2 rounded-2xl text-sm leading-relaxed ${
            isOwn
              ? "bg-yellow-500 text-black rounded-tr-sm"
              : "bg-white/8 text-white/90 border border-white/5 rounded-tl-sm"
          }`}
        >
          {msg.message}

          {canPin && showPin && (
            <button
              onClick={() => onPin(msg.id)}
              className="absolute -top-2 -right-2 w-6 h-6 bg-white/10 hover:bg-yellow-500/20 border border-white/10 rounded-full flex items-center justify-center transition"
              title="Pin message"
            >
              <Pin size={10} className="text-white/60" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
