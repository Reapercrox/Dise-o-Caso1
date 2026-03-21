import { store } from '../../app/store';
import { ROLE_PERMISSIONS } from './roles';
import type { PermissionCode } from './permissions';

/**
 * Proxy guard — intercepts access checks at route and component level.
 * All permission enforcement goes through this single object.
 */
export const accessGuard = {
  /** Returns true if the current user has the given permission. */
  can(permission: PermissionCode): boolean {
    const { user } = store.getState().auth;
    if (!user) return false;

    const allowed = ROLE_PERMISSIONS[user.role] ?? [];
    return allowed.includes(permission);
  },

  /** Returns true if the user has ALL the listed permissions. */
  canAll(permissions: PermissionCode[]): boolean {
    return permissions.every((p) => this.can(p));
  },

  /** Returns true if the user has AT LEAST ONE of the permissions. */
  canAny(permissions: PermissionCode[]): boolean {
    return permissions.some((p) => this.can(p));
  },
};
