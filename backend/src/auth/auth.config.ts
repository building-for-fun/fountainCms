/**
 * Auth configuration driven by AUTH_MODE and mode-specific env vars.
 * Used to select strategy (local | oauth2 | saml) and supply endpoints/mapping.
 */
export type AuthMode = 'local' | 'oauth2' | 'saml';

export interface AuthConfig {
  mode: AuthMode;
  /** For admin UI: base URL of the app (e.g. http://localhost:5173) */
  appUrl: string;
  /** JWT settings (used by all modes after identity is established) */
  jwt: {
    secret: string;
    expiresIn: string;
    cookieName: string;
  };
  /** Local auth: none beyond JWT */
  local?: Record<string, never>;
  /** OAuth2 / OIDC */
  oauth2?: {
    issuer: string;
    clientId: string;
    clientSecret: string;
    redirectUri: string;
    scope: string;
    claimEmail: string;
    claimName: string;
    claimRoles: string;
  };
  /** SAML 2.0 */
  saml?: {
    entryPoint: string;
    issuer: string;
    acsUrl: string;
    cert: string;
    attrEmail: string;
    attrName: string;
    attrRoles: string;
  };
}

function getAuthMode(): AuthMode {
  const raw = process.env.AUTH_MODE?.toLowerCase();
  if (raw === 'oauth2' || raw === 'saml') return raw;
  return 'local';
}

export function getAuthConfig(): AuthConfig {
  const mode = getAuthMode();
  const appUrl = (
    process.env.APP_URL ||
    process.env.PUBLIC_URL ||
    'http://localhost:5173'
  ).replace(/\/$/, '');
  const apiUrl =
    process.env.API_URL || `http://localhost:${process.env.PORT ?? 4000}`;

  const config: AuthConfig = {
    mode,
    appUrl,
    jwt: {
      secret: process.env.JWT_SECRET || 'change-me-in-production',
      expiresIn: process.env.JWT_EXPIRY || '7d',
      cookieName: process.env.JWT_COOKIE_NAME || 'hc_token',
    },
  };

  if (mode === 'oauth2') {
    config.oauth2 = {
      issuer: process.env.OAUTH2_ISSUER!,
      clientId: process.env.OAUTH2_CLIENT_ID!,
      clientSecret: process.env.OAUTH2_CLIENT_SECRET!,
      redirectUri:
        process.env.OAUTH2_REDIRECT_URI || `${apiUrl}/api/auth/callback/oauth2`,
      scope: process.env.OAUTH2_SCOPE || 'openid profile email',
      claimEmail: process.env.OAUTH2_CLAIM_EMAIL || 'email',
      claimName: process.env.OAUTH2_CLAIM_NAME || 'name',
      claimRoles: process.env.OAUTH2_CLAIM_ROLES || 'groups',
    };
  }

  if (mode === 'saml') {
    config.saml = {
      entryPoint: process.env.SAML_ENTRY_POINT!,
      issuer: process.env.SAML_ISSUER || 'fountaincms',
      acsUrl: process.env.SAML_ACS_URL || `${apiUrl}/api/auth/callback/saml`,
      cert: process.env.SAML_IDP_CERT || '',
      attrEmail: process.env.SAML_ATTR_EMAIL || 'email',
      attrName: process.env.SAML_ATTR_NAME || 'displayName',
      attrRoles: process.env.SAML_ATTR_ROLES || 'memberOf',
    };
  }

  return config;
}
