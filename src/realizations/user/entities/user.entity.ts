import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { AbstractBaseEntity } from 'src/realizations/AbstractBase.entity';
import { RoleEntity } from 'src/realizations/role/entities/role.entity';
import { Exclude, Transform } from 'class-transformer';
import { ProductEntity } from 'src/realizations/product/entities/product.entity';
import { TokenEntity } from 'src/auth/entities/token.entity';

@Entity('User')
export class UserEntity extends AbstractBaseEntity {
  @Column('varchar', {
    unique: true,
  })
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

  @OneToMany(() => ProductEntity, (product) => product.user)
  products: ProductEntity[];

  @OneToMany(() => TokenEntity, (token) => token.user)
  tokens: TokenEntity[];

  constructor(partial: Partial<UserEntity>) {
    super();
    Object.assign(this, partial);
  }
}
