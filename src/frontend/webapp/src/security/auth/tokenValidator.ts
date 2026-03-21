/**
 * Encapsulates JWT validation rules (Strategy pattern).
 * Rules can evolve here without touching any UI or infrastructure code.
 */

export interface JwtClaims {
  sub: string;
  exp: number;
  iat: number;
  email?: string;
  'cognito:username'?: string;
  'custom:role'?: string;
  [key: string]: unknown;
}

/** Decode a JWT payload without verifying the signature (client-side only). */
export function parseJwtClaims(token: string): JwtClaims {
  const parts = token.split('.');
  if (parts.length !== 3) throw new Error('Invalid JWT format');

  const payload = parts[1];
  const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
  return JSON.parse(decoded) as JwtClaims;
}

/** Check if a token is structurally valid and not expired. */
export function isTokenValid(token: string): boolean {
  try {
    const claims = parseJwtClaims(token);
    const nowSeconds = Math.floor(Date.now() / 1000);
    return claims.exp > nowSeconds;
  } catch {
    return false;
  }
}

/** Extract the expiry timestamp (ms) from a JWT. */
export function getTokenExpiry(token: string): number {
  const claims = parseJwtClaims(token);
  return claims.exp * 1000;
}
