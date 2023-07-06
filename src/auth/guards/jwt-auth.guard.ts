/* eslint-disable @typescript-eslint/no-unused-vars */
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { TokenService } from 'src/auth/token/token.service';
import { ApiConfigService } from '../../api/apiConfig.service';
import { PayloadDto } from '../dto/payload.dto';
import { UserService } from 'src/realizations/user/user.service';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC } from 'src/decorators/public-route.decorator';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private tokenService: TokenService,
    private apiConfigService: ApiConfigService,
    private userService: UserService,
    private reflector: Reflector,
  ) {}

  async canActivate(ctx: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC, [
      ctx.getHandler(),
      ctx.getClass(),
    ]);

    if (!this.apiConfigService.isAuthEnabled || isPublic) {
      return true;
    }

    const req = ctx.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(req);
    if (!token) {
      return false;
    }

    const payloadDecoded: PayloadDto =
      await this.tokenService.validateAccessToken(token);
    if (!payloadDecoded) {
      return false;
    }

    const user = await this.userService.findOne(payloadDecoded.userId);
    if (!user) {
      return false;
    }

    req.user = user;

    return true;
  }

  extractTokenFromHeader(req) {
    const [type, token] = req.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
