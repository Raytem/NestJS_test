import { Exclude, Transform } from 'class-transformer';
import { AbstractBaseEntity } from 'src/realizations/AbstractBase.entity';
import { FileEntity } from 'src/realizations/file/entities/file.entity';
import { UserEntity } from 'src/realizations/user/entities/user.entity';
import {
  BeforeRemove,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';

export function toUrl(id: number) {
  return `http://${process.env.SERVER_URL}/file/${id}`;
}

@Entity('Product')
export class ProductEntity extends AbstractBaseEntity {
  @Transform(({ value }) => value.map((file: FileEntity) => toUrl(file.id)))
  @OneToMany(() => FileEntity, (file) => file.product, {
    eager: true,
    onUpdate: 'CASCADE',
    cascade: true,
  })
  photos: FileEntity[];

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  price: number;

  @ManyToOne(() => UserEntity, (user) => user.id, {
    onDelete: 'CASCADE',
    // eager: true,
  })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  constructor(partial: Partial<ProductEntity>) {
    super();
    Object.assign(this, partial);
  }
}
