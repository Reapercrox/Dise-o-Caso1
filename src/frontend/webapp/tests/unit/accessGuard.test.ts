import { accessGuard } from '../../src/security/rbac/accessGuard';
import { PERMISSIONS } from '../../src/security/rbac/permissions';
import { store } from '../../src/app/store';
import { setUser, clearUser } from '../../src/domain/user/authSlice';
import type { AuthUser } from '../../src/domain/user/AuthUser';

const makeUser = (role: AuthUser['role']): AuthUser => ({
  id: 'u-1',
  username: 'testuser',
  email: 'test@example.com',
  role,
  accessToken: 'fake-token',
  expiresAt: Date.now() + 3600 * 1000,
});

describe('accessGuard', () => {
  afterEach(() => store.dispatch(clearUser()));

  describe('can()', () => {
    it('returns false when no user is authenticated', () => {
      expect(accessGuard.can(PERMISSIONS.GENERATE_DUA)).toBe(false);
    });

    it('ADMIN can MANAGE_USER', () => {
      store.dispatch(setUser(makeUser('ADMIN')));
      expect(accessGuard.can(PERMISSIONS.MANAGE_USER)).toBe(true);
    });

    it('ADMIN cannot GENERATE_DUA', () => {
      store.dispatch(setUser(makeUser('ADMIN')));
      expect(accessGuard.can(PERMISSIONS.GENERATE_DUA)).toBe(false);
    });

    it('USER_AGENT can GENERATE_DUA and LOAD_FILES', () => {
      store.dispatch(setUser(makeUser('USER_AGENT')));
      expect(accessGuard.can(PERMISSIONS.GENERATE_DUA)).toBe(true);
      expect(accessGuard.can(PERMISSIONS.LOAD_FILES)).toBe(true);
    });

    it('USER_AGENT cannot MANAGE_USER', () => {
      store.dispatch(setUser(makeUser('USER_AGENT')));
      expect(accessGuard.can(PERMISSIONS.MANAGE_USER)).toBe(false);
    });

    it('AUDIT can VIEW_REPORTS and DOWNLOAD_DUA only', () => {
      store.dispatch(setUser(makeUser('AUDIT')));
      expect(accessGuard.can(PERMISSIONS.VIEW_REPORTS)).toBe(true);
      expect(accessGuard.can(PERMISSIONS.DOWNLOAD_DUA)).toBe(true);
      expect(accessGuard.can(PERMISSIONS.GENERATE_DUA)).toBe(false);
      expect(accessGuard.can(PERMISSIONS.MANAGE_USER)).toBe(false);
    });

    it('SUPPORT can EDIT_TEMPLATES, LOAD_FILES, GENERATE_DUA, DOWNLOAD_DUA', () => {
      store.dispatch(setUser(makeUser('SUPPORT')));
      expect(accessGuard.can(PERMISSIONS.EDIT_TEMPLATES)).toBe(true);
      expect(accessGuard.can(PERMISSIONS.LOAD_FILES)).toBe(true);
      expect(accessGuard.can(PERMISSIONS.GENERATE_DUA)).toBe(true);
      expect(accessGuard.can(PERMISSIONS.DOWNLOAD_DUA)).toBe(true);
    });
  });

  describe('canAll()', () => {
    it('returns true when user has all permissions', () => {
      store.dispatch(setUser(makeUser('USER_AGENT')));
      expect(
        accessGuard.canAll([PERMISSIONS.GENERATE_DUA, PERMISSIONS.LOAD_FILES])
      ).toBe(true);
    });

    it('returns false when user is missing one permission', () => {
      store.dispatch(setUser(makeUser('USER_AGENT')));
      expect(
        accessGuard.canAll([PERMISSIONS.GENERATE_DUA, PERMISSIONS.MANAGE_USER])
      ).toBe(false);
    });
  });

  describe('canAny()', () => {
    it('returns true when user has at least one permission', () => {
      store.dispatch(setUser(makeUser('AUDIT')));
      expect(
        accessGuard.canAny([PERMISSIONS.MANAGE_USER, PERMISSIONS.VIEW_REPORTS])
      ).toBe(true);
    });

    it('returns false when user has none of the permissions', () => {
      store.dispatch(setUser(makeUser('AUDIT')));
      expect(
        accessGuard.canAny([PERMISSIONS.MANAGE_USER, PERMISSIONS.GENERATE_DUA])
      ).toBe(false);
    });
  });
});
