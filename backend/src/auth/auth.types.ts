/**
 * Normalized app user after any auth strategy (local, OAuth2, SAML).
 * Used to create/update DB user and to build JWT payload.
 */
export interface AppAuthUser {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  roleName: string | null;
}

export interface JwtPayload {
  sub: string;
  email: string;
  username: string;
  role: string | null;
  iat?: number;
  exp?: number;
}

export interface AuthConfigResponse {
  mode: 'local' | 'oauth2' | 'saml';
  /** For oauth2/saml: URL to redirect user to start login */
  loginUrl?: string;
}
