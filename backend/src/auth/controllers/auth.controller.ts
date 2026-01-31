import {
  Controller,
  Post,
  Body,
  Res,
  HttpCode,
  UseGuards,
  Req,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { AuthService } from '../services/auth.service';
import { LoginDto } from '../dto/login.dto';
import { RegisterDto } from '../dto/register.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { RefreshTokenStrategy } from '../strategies/refresh-token.strategy';
import { UseGuards as UseNestGuard } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiCookieAuth,
} from '@nestjs/swagger';

/**
 * Controller exposing auth endpoints. Cookies are httpOnly and secure.
 */
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  /**
   * Register endpoint.
   */
  @Post('register')
  @ApiOperation({ summary: 'Register new user' })
  @ApiResponse({ status: 201, description: 'Created' })
  async register(@Body() dto: RegisterDto) {
    const user = await this.authService.register(
      dto.email,
      dto.name,
      dto.password,
    );
    return user;
  }

  /**
   * Login with email/password. Sets httpOnly cookies for refresh token.
   */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login and set tokens as cookie' })
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.authService.validateUser(dto.email, dto.password);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const { accessToken, refreshToken } = await this.authService.login({
      id: user.id,
      email: user.email,
      roles: (user as any).role ? [(user as any).role.name] : [],
    });

    // Set httpOnly secure refresh cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: this.config.get<string>('NODE_ENV') === 'production',
      sameSite: 'lax',
      path: '/auth/refresh',
      maxAge: parseInt(
        this.config.get<string>('REFRESH_TOKEN_COOKIE_MAX_AGE', '604800000'),
        10,
      ), // ms
    });

    return { accessToken };
  }

  /**
   * Refresh endpoint using cookie refresh token. Rotates tokens.
   */
  @Post('refresh')
  @UseNestGuard(RefreshTokenStrategy)
  @ApiOperation({ summary: 'Rotate refresh token and issue new access token' })
  @ApiCookieAuth('refreshToken')
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const currentRefresh = req.cookies?.refreshToken;
    if (!currentRefresh)
      throw new UnauthorizedException('No refresh token provided');

    const { tokens } =
      await this.authService.rotateRefreshToken(currentRefresh);

    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: this.config.get<string>('NODE_ENV') === 'production',
      sameSite: 'lax',
      path: '/auth/refresh',
      maxAge: parseInt(
        this.config.get<string>('REFRESH_TOKEN_COOKIE_MAX_AGE', '604800000'),
        10,
      ),
    });

    return { accessToken: tokens.accessToken };
  }

  /**
   * Logout - clears refresh cookie and revokes stored refresh token.
   */
  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(@Req() req: Request, @Res() res: Response) {
    const user = (req as any).user as { id: string } | undefined;
    if (user) {
      await this.authService.logout(user.id);
    }
    res.clearCookie('refreshToken', { path: '/auth/refresh' });
    return res.status(HttpStatus.NO_CONTENT).send();
  }
}
