import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  UpdateDateColumn,
} from 'typeorm';
import { Role } from '../../../enums/role.enum';
import { ProductItemEntity } from 'src/realizations/product-item/entities/product-item.entity';
import { AbstractBaseEntity } from 'src/realizations/AbstractBase.entity';
import { RoleEntity } from 'src/realizations/role/entities/role.entity';
import { Exclude, Transform } from 'class-transformer';

@Entity('User')
export class UserEntity extends AbstractBaseEntity {
  @Column('varchar')
  name: string;

  @Column('varchar')
  surname: string;

  @Column('date')
  birthday: Date;

  @Exclude()
  @Column('varchar')
  password: string;

  @Transform(({ value }) => value.map((role) => role.name))
  @ManyToMany(() => RoleEntity, (role) => role.users, { eager: true })
  @JoinTable()
  roles: RoleEntity[];

  constructor(partial: Partial<UserEntity>) {
    super();
    Object.assign(this, partial);
  }
}
