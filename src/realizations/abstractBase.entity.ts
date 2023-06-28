import { CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export abstract class AbstractBaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    // @CreateDateColumn()
    // createdAt: Date;
  
    // @UpdateDateColumn()
    // updatedAt: Date
}