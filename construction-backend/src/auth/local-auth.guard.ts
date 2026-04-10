import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * LocalAuthGuard - Used for Login (Username/Password)
 * This guard uses the LocalStrategy to validate email + password
 */
@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {}
