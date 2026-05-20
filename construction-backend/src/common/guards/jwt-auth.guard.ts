// common/guards/jwt-auth.guard.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err: any, user: any, info: any) {
    if (err || !user) {
      // Log the error for debugging
      if (err) console.error('JWT Guard Error:', err.message);
      if (info) console.error('JWT Guard Info:', info.message);

      throw (
        err ||
        new UnauthorizedException({
          error: 'Unauthorized',
          message: info?.message || 'Invalid or expired token',
        })
      );
    }

    return user;
  }
}
