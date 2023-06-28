import { AbstractBaseEntity } from "src/realizations/AbstractBase.entity";
import { Column, Entity } from "typeorm";

@Entity('ProductItem')
export class ProductItemEntity extends AbstractBaseEntity {
    @Column()
    name: string;

    @Column()
    description: string

    @Column({default: 0})
    count: number
}
