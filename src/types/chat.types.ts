export interface ChatUser {
  id: string;
  name: string;
  role: string;
  avatar?: string | null;
}

export interface ChatMessage {
  id: string;
  channel: string;
  message: string;
  isPinned: boolean;
  createdAt: string;
  pinnedBy?: { name: string } | null;
  user: ChatUser;
}

export interface ChannelConfig {
  label: string;
  description: string;
  roles: string[];
  color: string;
}

export const CHAT_CHANNELS: Record<string, ChannelConfig> = {
  general: {
    label: "General",
    description: "Visible to all staff",
    roles: ["KITCHEN", "STAFF", "MANAGER", "SUPERADMIN"],
    color: "yellow",
  },
  kitchen: {
    label: "Kitchen",
    description: "Kitchen and management",
    roles: ["KITCHEN", "MANAGER", "SUPERADMIN"],
    color: "orange",
  },
  floor: {
    label: "Floor",
    description: "Front of house and management",
    roles: ["STAFF", "MANAGER", "SUPERADMIN"],
    color: "blue",
  },
};

export const CHAT_ROLE_COLORS: Record<string, string> = {
  SUPERADMIN: "text-red-400",
  MANAGER: "text-yellow-400",
  KITCHEN: "text-orange-400",
  STAFF: "text-purple-400",
  CUSTOMER: "text-blue-400",
};
