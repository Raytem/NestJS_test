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
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Roles } from '../../decorators/roles.decorator';
import { Role } from '../../enums/role.enum';
import { User } from '../../decorators/reqUser.decorator';
import { ConfigService } from '../../modules/config/config.service';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly cfg: ConfigService,
  ) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @Roles(Role.ADMIN)
  findAll(
    @User(new ValidationPipe({ validateCustomDecorators: true }))
    user: CreateUserDto,
  ) {
    console.log('--Current user: ', user);
    console.log('--NODE_ENV: ', this.cfg.get('TYPE'));
    return this.userService.findAll();
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.MANAGER)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findOne(id);
  }

  @Roles(Role.ADMIN, Role.MANAGER, Role.USER)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(id, updateUserDto);
  }

  @Roles(Role.ADMIN, Role.MANAGER, Role.USER)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.userService.remove(id);
  }
}
