import { Exclude } from 'class-transformer';
import { AbstractBaseEntity } from 'src/realizations/AbstractBase.entity';
import { ProductEntity } from 'src/realizations/product/entities/product.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity('File')
export class FileEntity extends AbstractBaseEntity {
  @Column()
  name: string;

  @Exclude()
  @ManyToOne(() => ProductEntity, (product) => product.photos, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'product_id' })
  product: ProductEntity;

  constructor(partial: Partial<FileEntity>) {
    super();
    Object.assign(this, partial);
  }
}
