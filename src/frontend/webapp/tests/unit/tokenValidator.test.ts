import { parseJwtClaims, isTokenValid, getTokenExpiry } from '../../src/security/auth/tokenValidator';

/** Build a fake JWT with the given payload (no real signing). */
function makeToken(payload: object): string {
  const header  = btoa(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const body    = btoa(JSON.stringify(payload));
  return `${header}.${body}.fake_signature`;
}

describe('tokenValidator', () => {
  const futureExp = Math.floor(Date.now() / 1000) + 3600;
  const pastExp   = Math.floor(Date.now() / 1000) - 1;

  describe('parseJwtClaims', () => {
    it('decodes a valid JWT payload', () => {
      const token = makeToken({ sub: 'user-1', email: 'a@b.com', exp: futureExp });
      const claims = parseJwtClaims(token);
      expect(claims.sub).toBe('user-1');
      expect(claims.email).toBe('a@b.com');
    });

    it('throws on malformed JWT', () => {
      expect(() => parseJwtClaims('not.a.jwt.with.toomany.parts')).toThrow();
    });
  });

  describe('isTokenValid', () => {
    it('returns true for a future-expiry token', () => {
      const token = makeToken({ sub: 'u', exp: futureExp });
      expect(isTokenValid(token)).toBe(true);
    });

    it('returns false for an expired token', () => {
      const token = makeToken({ sub: 'u', exp: pastExp });
      expect(isTokenValid(token)).toBe(false);
    });

    it('returns false for a garbage string', () => {
      expect(isTokenValid('garbage')).toBe(false);
    });
  });

  describe('getTokenExpiry', () => {
    it('returns the expiry in milliseconds', () => {
      const token = makeToken({ sub: 'u', exp: futureExp });
      expect(getTokenExpiry(token)).toBe(futureExp * 1000);
    });
  });
});
