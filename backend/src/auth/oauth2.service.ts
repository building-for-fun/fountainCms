import { Injectable, UnauthorizedException } from '@nestjs/common';
import {
  discovery,
  buildAuthorizationUrl,
  authorizationCodeGrant,
  fetchUserInfo,
  randomState,
  randomPKCECodeVerifier,
  calculatePKCECodeChallenge,
  skipSubjectCheck,
  type Configuration,
} from 'openid-client';
import { AuthService } from './auth.service';
import { getAuthConfig } from './auth.config';

const stateStore = new Map<
  string,
  { code_verifier: string; createdAt: number }
>();
const STATE_TTL_MS = 10 * 60 * 1000;

function cleanupState() {
  const now = Date.now();
  for (const [k, v] of stateStore.entries()) {
    if (now - v.createdAt > STATE_TTL_MS) stateStore.delete(k);
  }
}

@Injectable()
export class OAuth2Service {
  private config: Configuration | null = null;
  private initPromise: Promise<Configuration> | null = null;

  constructor(private readonly authService: AuthService) {}

  private async getConfig(): Promise<Configuration> {
    const config = getAuthConfig();
    if (config.mode !== 'oauth2' || !config.oauth2) {
      throw new UnauthorizedException('OAuth2 is not configured');
    }
    const oauth2 = config.oauth2;
    if (this.config) return this.config;
    if (this.initPromise) return this.initPromise;
    this.initPromise = discovery(
      new URL(oauth2.issuer),
      oauth2.clientId,
      oauth2.clientSecret,
    );
    this.config = await this.initPromise;
    return this.config;
  }

  async getRedirectUrl(): Promise<{ url: string; state: string }> {
    const config = await this.getConfig();
    const authConfig = getAuthConfig();
    const oauth2 = authConfig.oauth2!;
    const state = randomState();
    const code_verifier = randomPKCECodeVerifier();
    const code_challenge = await calculatePKCECodeChallenge(code_verifier);
    stateStore.set(state, { code_verifier, createdAt: Date.now() });
    cleanupState();
    const redirectTo = buildAuthorizationUrl(config, {
      redirect_uri: oauth2.redirectUri,
      scope: oauth2.scope,
      state,
      code_challenge,
      code_challenge_method: 'S256',
    });
    return { url: redirectTo.toString(), state };
  }

  async handleCallback(
    code: string,
    state: string,
    callbackUrl: string,
  ): Promise<{
    token: string;
    user: { id: string; email: string; role: string | null };
  }> {
    const stored = stateStore.get(state);
    stateStore.delete(state);
    if (!stored || Date.now() - stored.createdAt > STATE_TTL_MS) {
      throw new UnauthorizedException('Invalid or expired state');
    }
    const config = await this.getConfig();
    const authConfig = getAuthConfig();
    const oauth2 = authConfig.oauth2!;
    const tokenSet = await authorizationCodeGrant(
      config,
      new URL(callbackUrl),
      {
        expectedState: state,
        pkceCodeVerifier: stored.code_verifier,
      },
    );
    const claims = tokenSet.claims();
    const sub = claims?.sub ?? '';
    const accessToken = (tokenSet as { access_token?: string }).access_token;
    const userinfo = accessToken
      ? await fetchUserInfo(config, accessToken, sub || skipSubjectCheck)
      : (claims as Record<string, unknown>) || {};
    const email =
      (userinfo[oauth2.claimEmail] as string) ||
      (userinfo.email as string) ||
      (userinfo.sub as string);
    const name =
      (userinfo[oauth2.claimName] as string) || (userinfo.name as string) || '';
    const roleClaim = userinfo[oauth2.claimRoles];
    const appUser = await this.authService.findOrCreateFromExternal(
      String(email),
      String(name),
      roleClaim as string | string[] | undefined,
    );
    const token = this.authService.issueToken(appUser);
    return {
      token,
      user: { id: appUser.id, email: appUser.email, role: appUser.roleName },
    };
  }
}
