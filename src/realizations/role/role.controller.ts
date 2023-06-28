import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ValidationPipe,
  ParseEnumPipe,
  ParseIntPipe,
} from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from 'src/enums/role.enum';

@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Patch('/:roleName/:userId')
  async addRole(
    @Param('roleName', new ParseEnumPipe(Role)) roleName: Role,
    @Param('userId', ParseIntPipe) userId: number,
  ) {
    return await this.roleService.addRole(roleName, userId);
  }

  @Delete('/:roleName/:userId')
  async deleteRole(
    @Param('roleName', new ParseEnumPipe(Role)) roleName: Role,
    @Param('userId', ParseIntPipe) userId: number,
  ) {
    return await this.roleService.deleteRole(roleName, userId);
  }

  @Post()
  async create(@Body() createRoleDto: CreateRoleDto) {
    return await this.roleService.create(createRoleDto);
  }

  @Get()
  async findAll() {
    return await this.roleService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.roleService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRoleDto: UpdateRoleDto,
  ) {
    return await this.roleService.update(id, updateRoleDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.roleService.remove(id);
  }
}
