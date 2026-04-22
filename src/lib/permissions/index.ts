import type { RoleKey } from "@/types";

export function isAdminRole(role?: string | null): role is Extract<RoleKey, "ADMIN"> {
  return role === "ADMIN";
}
