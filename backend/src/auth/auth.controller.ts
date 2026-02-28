import {
  Controller,
  Get,
  Post,
  Body,
  Res,
  Req,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { OAuth2Service } from './oauth2.service';
import { SamlService } from './saml.service';
import { LoginDto } from './dto/login.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Public } from './decorators/public.decorator';
import { getAuthConfig } from './auth.config';
import type { AuthConfigResponse } from './auth.types';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly oauth2Service: OAuth2Service,
    private readonly samlService: SamlService,
  ) {}

  @Get('config')
  @Public()
  @ApiOperation({ summary: 'Get auth configuration for the client' })
  @ApiResponse({ status: 200, description: 'Auth mode and optional login URL' })
  getConfig(): AuthConfigResponse {
    const config = this.authService.getConfig();
    const apiUrl =
      process.env.API_URL || `http://localhost:${process.env.PORT ?? 4000}`;
    const res: AuthConfigResponse = { mode: config.mode };
    if (config.mode === 'oauth2') {
      res.loginUrl = `${apiUrl}/api/auth/oauth2/redirect`;
    }
    if (config.mode === 'saml') {
      res.loginUrl = `${apiUrl}/api/auth/saml/redirect`;
    }
    return res;
  }

  @Post('login')
  @Public()
  @ApiOperation({ summary: 'Local login (only when AUTH_MODE=local)' })
  @ApiResponse({
    status: 201,
    description: 'Login success; token in cookie and body',
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{
    token: string;
    user: { id: string; email: string; role: string | null };
  }> {
    const config = getAuthConfig();
    if (config.mode !== 'local') {
      throw new UnauthorizedException('Local login is not enabled');
    }
    const appUser = await this.authService.validateLocalUser(
      dto.login,
      dto.password,
    );
    const token = this.authService.issueToken(appUser);
    const cookieName = this.authService.getCookieName();
    res.cookie(cookieName, token, this.authService.getCookieOptions());
    return {
      token,
      user: {
        id: appUser.id,
        email: appUser.email,
        role: appUser.roleName,
      },
    };
  }

  @Post('logout')
  @Public()
  @ApiOperation({ summary: 'Logout (clear auth cookie)' })
  @ApiResponse({ status: 200, description: 'Logged out' })
  logout(@Res({ passthrough: true }) res: Response): { ok: boolean } {
    const cookieName = this.authService.getCookieName();
    res.clearCookie(cookieName, { path: '/', httpOnly: true, sameSite: 'lax' });
    return { ok: true };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get current user from JWT' })
  @ApiResponse({ status: 200, description: 'Current user' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async me(
    @Req()
    req: Request & {
      user?: { sub: string; email: string; role: string | null };
    },
  ) {
    const payload = req.user;
    if (!payload) throw new UnauthorizedException();
    const profile = await this.authService.getMeProfile(payload.sub);
    const permissions = await this.authService.getPermissionsForUser(
      payload.sub,
    );
    if (!profile) {
      return {
        id: payload.sub,
        email: payload.email,
        role: payload.role ?? null,
        permissions,
      };
    }
    return {
      id: profile.id,
      email: profile.email,
      username: profile.username,
      firstName: profile.firstName,
      lastName: profile.lastName,
      isActive: profile.isActive,
      role: profile.role?.name ?? null,
      roleId: profile.roleId,
      permissions,
    };
  }

  @Post('me/password')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Change current user password' })
  @ApiResponse({ status: 200, description: 'Password updated' })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized or wrong current password',
  })
  async changePassword(
    @Req()
    req: Request & {
      user?: { sub: string };
    },
    @Body() dto: ChangePasswordDto,
  ): Promise<{ ok: boolean }> {
    const userId = req.user?.sub;
    if (!userId) throw new UnauthorizedException();
    await this.authService.changePassword(
      userId,
      dto.currentPassword,
      dto.newPassword,
    );
    return { ok: true };
  }

  @Get('oauth2/redirect')
  @Public()
  @ApiOperation({ summary: 'Start OAuth2 flow (redirect to IdP)' })
  async oauth2Redirect(@Res() res: Response) {
    const config = getAuthConfig();
    if (config.mode !== 'oauth2') {
      throw new UnauthorizedException('OAuth2 is not configured');
    }
    const { url } = await this.oauth2Service.getRedirectUrl();
    res.redirect(url);
  }

  @Get('callback/oauth2')
  @Public()
  @ApiOperation({ summary: 'OAuth2 callback' })
  async oauth2Callback(
    @Req() req: Request & { query: { code?: string; state?: string } },
    @Res() res: Response,
  ) {
    const config = getAuthConfig();
    const { code, state } = req.query;
    if (!code || !state) {
      res.redirect(`${config.appUrl}/login?error=missing_params`);
      return;
    }
    const apiUrl =
      process.env.API_URL || `http://localhost:${process.env.PORT ?? 4000}`;
    const callbackUrl = `${apiUrl}/api/auth/callback/oauth2?code=${encodeURIComponent(code)}&state=${encodeURIComponent(state)}`;
    try {
      const result = await this.oauth2Service.handleCallback(
        code,
        state,
        callbackUrl,
      );
      const cookieName = this.authService.getCookieName();
      res.cookie(cookieName, result.token, this.authService.getCookieOptions());
      res.redirect(config.appUrl + '/admin');
    } catch {
      res.redirect(`${config.appUrl}/login?error=callback_failed`);
    }
  }

  @Get('saml/redirect')
  @Public()
  @ApiOperation({ summary: 'Start SAML flow (redirect to IdP)' })
  async samlRedirect(@Res() res: Response) {
    const config = getAuthConfig();
    if (config.mode !== 'saml') {
      throw new UnauthorizedException('SAML is not configured');
    }
    const url = await this.samlService.getRedirectUrl();
    res.redirect(url);
  }

  @Post('callback/saml')
  @Public()
  @ApiOperation({ summary: 'SAML ACS callback' })
  async samlCallback(
    @Body() body: { SAMLResponse?: string },
    @Res() res: Response,
  ) {
    const config = getAuthConfig();
    if (!body.SAMLResponse) {
      res.redirect(`${config.appUrl}/login?error=missing_saml_response`);
      return;
    }
    try {
      const result = await this.samlService.handlePostCallback(body);
      const cookieName = this.authService.getCookieName();
      res.cookie(cookieName, result.token, this.authService.getCookieOptions());
      res.redirect(config.appUrl + '/admin');
    } catch {
      res.redirect(`${config.appUrl}/login?error=callback_failed`);
    }
  }
}
