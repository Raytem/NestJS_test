import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseFilters,
  HttpException,
  HttpStatus,
  ParseIntPipe,
  ParseUUIDPipe,
  ValidationPipe,
  SetMetadata,
  BadRequestException,
  Inject,
  UsePipes,
  UseInterceptors,
  ClassSerializerInterceptor,
  CacheTTL,
  Logger,
  Res,
  Query,
  Req,
  Session,
  Render,
  Sse,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { Roles } from '../../decorators/roles.decorator';
import { Role } from '../../enums/role.enum';
import { User } from '../../decorators/reqUser.decorator';
import { ConfigService, ConfigType } from '@nestjs/config';
import { databaseConfig } from 'config/database.config';
import { Cache } from 'cache-manager';
import { HttpCacheInterceptor } from 'src/interceptors/httpCache.interceptor';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { MyLoggerService } from 'src/my-logger/my-logger.service';
import { Cookies } from 'src/decorators/cookies.decorator';
import { Response } from 'express';
import { Observable, defer, interval, map, pipe, switchMap } from 'rxjs';
import * as fs from 'fs';
import * as path from 'path';
import { UserEntity } from './entities/user.entity';

@Controller({ path: 'user' })
@Roles(Role.USER)
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly cfg: ConfigService,

    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,

    @Inject(databaseConfig.KEY)
    private readonly dbConfig: ConfigType<typeof databaseConfig>,
  ) {}

  @Get('page')
  showUsersPage(@Res() res: Response) {
    res
      .type('text/html')
      .send(
        fs
          .readFileSync(path.join(process.cwd(), 'views', 'users.html'))
          .toString(),
      );
  }

  async getUsersMgEvent() {
    return { data: await this.userService.findAll() } as MessageEvent;
  }

  @Sse('sse')
  sse(): Observable<MessageEvent<any>> {
    return interval(3000).pipe(switchMap(() => this.getUsersMgEvent()));
  }

  @Get('session')
  async getSession(@Session() session: Record<string, any>) {
    session.autnticated = true;
    console.log(session);
    console.log(session.id);
    return session;
  }

  @Get()
  @Roles(Role.ADMIN)
  async findAll(
    @User(new ValidationPipe({ validateCustomDecorators: true }))
    user: UserEntity,
  ) {
    console.log('--Current user: ', user);
    return await this.userService.findAll();
  }

  @Get('setCookies')
  async setCookies(@Res({ passthrough: true }) res: Response) {
    res.cookie('name', 'some', { httpOnly: true, maxAge: 40000 });
    return 0;
  }

  // @UseInterceptors(HttpCacheInterceptor)
  // @CacheTTL(1000 * 10)
  @Get(':id')
  @Roles(Role.ADMIN, Role.MANAGER)
  async findOne(@Param('id', ParseIntPipe) id: number, @Cookies() cookies) {
    console.log(JSON.stringify(cookies));
    return await this.userService.findOne(id);
  }

  @Get(':id/cartItems')
  @Roles(Role.USER)
  async getCartItems(@Param('id', ParseIntPipe) id: number) {
    return 'cartItems';
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.MANAGER)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return await this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.MANAGER)
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.userService.remove(id);
  }
}
