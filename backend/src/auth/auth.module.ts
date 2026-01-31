import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './services/auth.service';
import { PatService } from './services/pat.service';
import { AuthController } from './controllers/auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { RefreshTokenStrategy } from './strategies/refresh-token.strategy';
import { RolesGuard } from './guards/roles.guard';
import { UserModule } from '../user/user.module';

/**
 * Auth module wiring JWT + refresh strategies and PAT service.
 */
@Module({
  imports: [
    ConfigModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        secret: config.get<string>('JWT_ACCESS_SECRET', 'change-me'),
        signOptions: {
          expiresIn: config.get<string>('JWT_ACCESS_EXPIRATION', '15m'),
        },
      }),
    }),
    UserModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    PatService,
    JwtStrategy,
    RefreshTokenStrategy,
    RolesGuard,
  ],
  exports: [AuthService, PatService],
})
export class AuthModule {}
