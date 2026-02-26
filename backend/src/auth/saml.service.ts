import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SAML } from 'passport-saml';
import { AuthService } from './auth.service';
import { getAuthConfig } from './auth.config';

@Injectable()
export class SamlService {
  private saml: SAML | null = null;

  constructor(private readonly authService: AuthService) {}

  private getSaml(): SAML {
    if (this.saml) return this.saml;
    const config = getAuthConfig();
    if (config.mode !== 'saml' || !config.saml) {
      throw new UnauthorizedException('SAML is not configured');
    }
    const s = config.saml;
    this.saml = new SAML({
      entryPoint: s.entryPoint,
      issuer: s.issuer,
      cert: s.cert,
      callbackUrl: s.acsUrl,
    } as ConstructorParameters<typeof SAML>[0]);
    return this.saml;
  }

  async getRedirectUrl(): Promise<string> {
    const saml = this.getSaml();
    const relayState = '';
    const host = undefined;
    return saml.getAuthorizeUrlAsync(relayState, host, {});
  }

  async handlePostCallback(body: { SAMLResponse?: string }): Promise<{
    appUser: { id: string; email: string; roleName: string | null };
    token: string;
  }> {
    const saml = this.getSaml();
    const result = await saml.validatePostResponseAsync(
      body as Record<string, string>,
    );
    const profile = result.profile;
    if (!profile || result.loggedOut) {
      throw new UnauthorizedException('Invalid SAML response');
    }
    const config = getAuthConfig().saml!;
    const email =
      (profile[config.attrEmail] as string) ||
      (profile.email as string) ||
      (profile.mail as string);
    const name =
      (profile[config.attrName] as string) || (profile.name as string) || '';
    const roleClaim = profile[config.attrRoles];
    if (!email) {
      throw new UnauthorizedException('No email in SAML assertion');
    }
    const appUser = await this.authService.findOrCreateFromExternal(
      String(email),
      String(name),
      roleClaim as string | string[] | undefined,
    );
    const token = this.authService.issueToken(appUser);
    return {
      appUser: {
        id: appUser.id,
        email: appUser.email,
        roleName: appUser.roleName,
      },
      token,
    };
  }
}
