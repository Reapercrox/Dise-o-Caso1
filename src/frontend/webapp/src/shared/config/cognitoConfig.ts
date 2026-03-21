/**
 * Reads Cognito configuration from environment variables injected at build-time
 * (or at SSR boot from AWS Secrets Manager).
 */
export const cognitoConfig = {
  region: import.meta.env.VITE_COGNITO_REGION ?? 'us-east-1',
  userPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID ?? '',
  clientId: import.meta.env.VITE_COGNITO_CLIENT_ID ?? '',
} as const;
