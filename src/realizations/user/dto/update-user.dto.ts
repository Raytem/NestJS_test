import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsArray, IsDateString, IsInt, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { Role } from 'src/enums/role.enum';

export class UpdateUserDto extends PartialType(CreateUserDto) {
}
