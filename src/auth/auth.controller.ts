import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  Res,
} from '@nestjs/common';
import { CreateUserDto } from 'src/realizations/user/dto/create-user.dto';
import { AuthService } from './auth.service';
import { SingInDto } from './dto/singIn.dto';
import { Cookies } from 'src/decorators/cookies.decorator';
import { TokenService } from './token/token.service';
import { Response } from 'express';
import { jwtConfig } from 'config/jwt.config';
import { ConfigType } from '@nestjs/config';
import { Public } from 'src/decorators/public-route.decorator';

@Public()
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private tokenService: TokenService,

    @Inject(jwtConfig.KEY)
    private jwtCfg: ConfigType<typeof jwtConfig>,
  ) {}

  @Post('signup')
  async signUp(
    @Body() createUserDto: CreateUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const userData = await this.authService.signUp(createUserDto);
    res.cookie('refreshToken', userData.tokens.refreshToken, {
      httpOnly: true,
      maxAge: this.jwtCfg.refreshCookieLifetime,
    });
    return userData;
  }

  @HttpCode(HttpStatus.OK)
  @Post('signin')
  async singIn(
    @Body() singInDto: SingInDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const tokens = await this.authService.signIn(singInDto);
    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      maxAge: this.jwtCfg.refreshCookieLifetime,
    });
    return await this.authService.signIn(singInDto);
  }

  @Get('logout')
  async logout(@Cookies('refreshToken') refreshToken: string) {
    return await this.authService.logout(refreshToken);
  }

  @Get('refresh')
  async refresh(
    @Cookies('refreshToken') refreshToken: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const tokens = await this.authService.refresh(refreshToken);
    res.cookie('refreshToken', tokens.refreshToken);
    return tokens;
  }
}
