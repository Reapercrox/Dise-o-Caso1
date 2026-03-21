import { useMemo } from 'react';
import { accessGuard } from '../../security/rbac/accessGuard';
import type { PermissionCode } from '../../security/rbac/permissions';

/**
 * Hook for component-level permission checks.
 * Re-evaluates whenever the component re-renders (store changes propagate
 * through Redux and trigger re-renders automatically).
 */
export const usePermission = (permission: PermissionCode): boolean =>
  useMemo(() => accessGuard.can(permission), [permission]);

export const usePermissions = (
  permissions: PermissionCode[]
): { canAll: boolean; canAny: boolean } =>
  useMemo(
    () => ({
      canAll: accessGuard.canAll(permissions),
      canAny: accessGuard.canAny(permissions),
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [permissions.join(',')]
  );
