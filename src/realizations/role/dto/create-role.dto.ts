import { IsEnum } from 'class-validator';
import { Role } from 'src/enums/role.enum';

export class CreateRoleDto {
  @IsEnum(Role)
  name: Role;
}
