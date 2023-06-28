import { PartialType } from '@nestjs/mapped-types';
import { CreateRoleDto } from './create-role.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { Role } from 'src/enums/role.enum';

export class UpdateRoleDto extends PartialType(CreateRoleDto) {
}
