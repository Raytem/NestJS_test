import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../enums/role.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(ctx: ExecutionContext): boolean {
    const roles = this.reflector.getAllAndMerge<Role[]>('roles', [
      ctx.getHandler(),
      ctx.getClass(),
    ]);
    if (!roles) {
      return true;
    }
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    return this.matchRoles(roles, user?.roles || []);
  }

  private matchRoles(routeRoles: Role[], userRoles: Role[]) {
    return userRoles.some((role) => routeRoles.includes(role));
  }
}
