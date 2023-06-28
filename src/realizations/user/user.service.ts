import { Inject, Injectable, Logger, Scope, forwardRef } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ProductItemService } from '../product-item/product-item.service';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { RoleEntity } from '../role/entities/role.entity';
import { Role } from 'src/enums/role.enum';
import { ConfigService } from '@nestjs/config';
import { NotificationService } from 'src/schedule/notification.service';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { UserPrintedEvent } from './events/user-printed.event';
import { MyLoggerService } from 'src/my-logger/my-logger.service';

@Injectable({
  // scope: Scope.REQUEST,
  // durable: true,
})
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,

    @InjectRepository(RoleEntity)
    private roleRepository: Repository<RoleEntity>,

    private eventEmitter: EventEmitter2,

    // @Inject(REQUEST) private request,

    private configService: ConfigService,

    private notificationService: NotificationService,

    private productItemService: ProductItemService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const defaultUserRole = await this.roleRepository.findOneBy({
      name: Role.USER,
    });

    const newUser = await this.userRepository.save({
      ...createUserDto,
      roles: [defaultUserRole],
    });
    return new UserEntity(newUser);
  }

  async findAll() {
    // console.log(this.productItemService.findOne(1));
    // console.log('--Request (tenant-strategy):', this.request);
    return await this.userRepository.find();
  }

  async findOne(id: number) {
    this.eventEmitter.emit('user.printed', new UserPrintedEvent(id));
    return await this.userRepository.findBy({ id });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOneBy({ id });

    await this.userRepository.update(id, updateUserDto);

    return await this.userRepository.findOneBy({ id });
  }

  async remove(id: number) {
    const user = await this.userRepository.findOneBy({ id });
    await this.userRepository.delete(id);
    return user;
  }

  @OnEvent('user.printed')
  handleUserPrintedEvent(payload: UserPrintedEvent) {
    this.logger.log(`User printed, userId: ${payload.userId}`);
  }
}
