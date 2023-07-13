import { Role } from 'src/enums/role.enum';
import { AbstractBaseEntity } from 'src/realizations/AbstractBase.entity';
import { UserEntity } from 'src/realizations/user/entities/user.entity';
import { Column, Entity, ManyToMany } from 'typeorm';

@Entity('Role')
export class RoleEntity extends AbstractBaseEntity {
  @ManyToMany(() => UserEntity, (user) => user.roles)
  users: UserEntity[];

  @Column({
    type: 'enum',
    enum: Role,
  })
  name: Role;
}
