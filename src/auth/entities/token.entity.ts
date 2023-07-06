import { AbstractBaseEntity } from 'src/realizations/AbstractBase.entity';
import { UserEntity } from 'src/realizations/user/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity('Token')
export class TokenEntity extends AbstractBaseEntity {
  @ManyToOne(() => UserEntity, (user) => user.id)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column()
  refreshToken: string;

  @Column()
  device: string;
}
