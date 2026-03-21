import {
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
  GlobalSignOutCommand,
  type InitiateAuthCommandOutput,
} from '@aws-sdk/client-cognito-identity-provider';
import { sessionManager } from './sessionManager';
import type { AuthUser } from '../../domain/user/AuthUser';
import { cognitoConfig } from '../../shared/config/cognitoConfig';
import { parseJwtClaims } from '../../security/auth/tokenValidator';

const client = new CognitoIdentityProviderClient({
  region: cognitoConfig.region,
});

/**
 * Facade over AWS Cognito — exposes a simple signIn / signOut API
 * consumed by AuthProvider and auth use-cases.
 */
export const authService = {
  async signIn(username: string, password: string): Promise<AuthUser> {
    const command = new InitiateAuthCommand({
      AuthFlow: 'USER_PASSWORD_AUTH',
      ClientId: cognitoConfig.clientId,
      AuthParameters: {
        USERNAME: username,
        PASSWORD: password,
      },
    });

    const result: InitiateAuthCommandOutput = await client.send(command);
    const tokens = result.AuthenticationResult;

    if (!tokens?.AccessToken || !tokens.IdToken) {
      throw new Error('Authentication failed: no tokens returned');
    }

    const claims = parseJwtClaims(tokens.IdToken);

    const user: AuthUser = {
      id: claims.sub as string,
      username: claims['cognito:username'] as string,
      email: claims.email as string,
      role: claims['custom:role'] as AuthUser['role'],
      accessToken: tokens.AccessToken,
      expiresAt: Date.now() + (tokens.ExpiresIn ?? 3600) * 1000,
    };

    sessionManager.setSession(user);
    return user;
  },

  async signOut(): Promise<void> {
    const token = await sessionManager.getAccessToken();
    if (token) {
      await client.send(new GlobalSignOutCommand({ AccessToken: token }));
    }
    sessionManager.clearSession();
  },
};
