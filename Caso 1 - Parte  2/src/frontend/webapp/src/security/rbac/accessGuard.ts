import type { PermissionCode } from "@/security/rbac/permissions";
import type { Role } from "@/security/rbac/roles";

const rolePermissions: Record<Role, PermissionCode[]> = {
  ADMIN: ["MANAGE_USER", "VIEW_REPORTS", "EDIT_TEMPLATES", "DOWNLOAD_DUA"],
  USER_AGENT: ["LOAD_FILES", "GENERATE_DUA", "DOWNLOAD_DUA"],
  SUPPORT: [
    "VIEW_ERROR_REPORTS",
    "EDIT_TEMPLATES",
    "LOAD_FILES",
    "DOWNLOAD_DUA",
    "GENERATE_DUA",
  ],
  AUDIT: ["VIEW_REPORTS", "DOWNLOAD_DUA"],
};

export function can(role: Role, permission: PermissionCode): boolean {
  return rolePermissions[role]?.includes(permission) ?? false;
}
