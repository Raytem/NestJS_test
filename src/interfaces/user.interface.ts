import { Role } from 'src/enums/role.enum';

export interface IUser {
  name: string;
  age: number;
  roles: Array<Role>;
}
