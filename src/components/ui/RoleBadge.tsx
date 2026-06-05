import { type UserRole, ROLE_COLORS } from "@/types/user.types";

export default function RoleBadge({ role }: { role: UserRole }) {
  return (
    <span
      className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold border ${ROLE_COLORS[role]}`}
    >
      {role}
    </span>
  );
}
