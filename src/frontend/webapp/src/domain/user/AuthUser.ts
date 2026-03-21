import type { Role } from '../permissions/Role';

export interface AuthUser {
  id: string;
  username: string;
  email: string;
  role: Role;
  /** JWT access token — stored only in memory, never in localStorage */
  accessToken: string;
  /** Expiry timestamp (ms since epoch) */
  expiresAt: number;
}
