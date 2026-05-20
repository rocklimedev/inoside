// auth/strategies/jwt.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '@/modules/auth/auth.service';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
  ) {
    super({
      // Try Bearer token first, then fall back to cookie
      jwtFromRequest: (req: Request) => {
        // 1. Try Authorization header
        const fromBearer = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
        if (fromBearer) return fromBearer;

        // 2. Try cookies
        return req.cookies?.access_token || null;
      },
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    // validateUser now returns AuthUserResponse (formatted data)
    const user = await this.authService.validateUser(payload.sub);
    return user;
  }
}
