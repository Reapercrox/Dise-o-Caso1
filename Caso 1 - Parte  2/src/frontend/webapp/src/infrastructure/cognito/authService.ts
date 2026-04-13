/** Facade over AWS Cognito (MFA) — wire SDK in a later iteration. */

export type SignInResult = {
  accessToken: string;
  idToken: string;
  refreshToken: string;
};

export async function signInWithPassword(username: string, password: string): Promise<SignInResult> {
  void username;
  void password;
  throw new Error("Cognito integration not configured");
}

export async function signOutGlobal(): Promise<void> {
  return;
}
