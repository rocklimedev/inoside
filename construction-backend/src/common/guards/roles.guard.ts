import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    // ✅ If no roles are defined → allow access
    if (!requiredRoles || requiredRoles.length === 0) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // 🔥 FIX: Sequelize may return "role" OR "Role"
    const roleName = user?.role?.name || user?.Role?.name || user?.role; // if JWT flattened role

    if (!roleName) {
      throw new ForbiddenException('Role information missing');
    }

    const hasRole = requiredRoles.includes(roleName);

    if (!hasRole) {
      throw new ForbiddenException('You do not have permission');
    }

    return true;
  }
}
