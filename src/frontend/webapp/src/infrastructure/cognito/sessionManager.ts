import type { AuthUser } from '../../domain/user/AuthUser';

type SessionState = 'valid' | 'refreshing' | 'expired' | 'unauthenticated';

/**
 * Centralises token storage (in-memory only — no localStorage/sessionStorage).
 * Implements the State pattern: tracks session lifecycle and exposes
 * a single `getAccessToken()` that auto-refreshes when near expiry.
 */
class SessionManager {
  private user: AuthUser | null = null;
  private state: SessionState = 'unauthenticated';
  private refreshThresholdMs = 5 * 60 * 1000; // 5 min

  setSession(user: AuthUser): void {
    this.user = user;
    this.state = 'valid';
  }

  clearSession(): void {
    this.user = null;
    this.state = 'unauthenticated';
  }

  async getCurrentUser(): Promise<AuthUser | null> {
    if (!this.user) return null;
    await this.ensureValid();
    return this.user;
  }

  async getAccessToken(): Promise<string | null> {
    if (!this.user) return null;
    await this.ensureValid();
    return this.user?.accessToken ?? null;
  }

  getState(): SessionState {
    return this.state;
  }

  private async ensureValid(): Promise<void> {
    if (!this.user) return;

    const isExpired = Date.now() >= this.user.expiresAt;
    const isNearExpiry = Date.now() >= this.user.expiresAt - this.refreshThresholdMs;

    if (isExpired) {
      this.state = 'expired';
      this.clearSession();
      return;
    }

    if (isNearExpiry && this.state !== 'refreshing') {
      this.state = 'refreshing';
      try {
        // Refresh logic would call Cognito REFRESH_TOKEN_AUTH here
        // Placeholder: extend expiry (replace with real refresh call)
        this.user = {
          ...this.user,
          expiresAt: Date.now() + 3600 * 1000,
        };
        this.state = 'valid';
      } catch {
        this.state = 'expired';
        this.clearSession();
      }
    }
  }
}

export const sessionManager = new SessionManager();
