import { Type } from 'class-transformer';
import { IsArray, IsInt, IsString } from 'class-validator';
import { Role } from '../../../enums/role.enum';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsInt()
  age: number;

  @IsArray()
  @Type(() => String)
  roles: Role[];
}
