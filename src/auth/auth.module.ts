import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/realizations/user/user.module';
import { TokenModule } from './token/token.module';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { ApiConfigService } from 'src/api/apiConfig.service';

@Module({
  imports: [UserModule, TokenModule],
  providers: [AuthService, JwtAuthGuard, RolesGuard, ApiConfigService],
  controllers: [AuthController],
})
export class AuthModule {}
