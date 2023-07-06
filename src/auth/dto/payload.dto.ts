import { UserEntity } from 'src/realizations/user/entities/user.entity';

export class PayloadDto {
  userId: number;
  name: string;
  device: string;

  constructor(user: UserEntity, device: string) {
    this.userId = user.id;
    this.name = user.name;
    this.device = device;
  }
}
