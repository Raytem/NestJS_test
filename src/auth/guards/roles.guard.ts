import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../../enums/role.enum';
import { ApiConfigService } from 'src/api/apiConfig.service';
import { UserEntity } from 'src/realizations/user/entities/user.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private apiConfigService: ApiConfigService,
  ) {}

  canActivate(ctx: ExecutionContext): boolean {
    if (!this.apiConfigService.isAuthEnabled) {
      return true;
    }

    const roles = this.reflector.getAllAndMerge<Role[]>('roles', [
      ctx.getHandler(),
      ctx.getClass(),
    ]);
    if (!roles) {
      return true;
    }
    const request = ctx.switchToHttp().getRequest();
    const user: UserEntity = request.user;
    const userRoles = user?.roles.map((role) => role.name);

    return this.matchRoles(roles, userRoles || []);
  }

  private matchRoles(routeRoles: Role[], userRoles: Role[]) {
    return (
      userRoles.some((role) => routeRoles.includes(role)) ||
      routeRoles.length === 0
    );
  }
}
