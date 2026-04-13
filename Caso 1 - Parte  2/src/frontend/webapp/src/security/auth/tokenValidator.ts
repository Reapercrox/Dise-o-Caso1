/** Placeholder for JWT claim validation strategies (Cognito). */

export type JwtClaims = {
  sub: string;
  exp: number;
  "cognito:groups"?: string[];
};

export function isExpired(claims: JwtClaims, nowSec: number): boolean {
  return claims.exp <= nowSec;
}
