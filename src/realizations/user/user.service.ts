import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  Scope,
  forwardRef,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
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
import { HttpService } from '@nestjs/axios';
import { delay, firstValueFrom, lastValueFrom, map } from 'rxjs';
import { ProductEntity } from '../product/entities/product.entity';
import { NoSuchUserException } from 'src/exceptions/NoSuchUser.exception';
import { ProductService } from '../product/product.service';
import { deleteFilesEvent } from '../file/file-emitter-events';

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

    @InjectRepository(ProductEntity)
    private productRepository: Repository<ProductEntity>,

    private httpService: HttpService,

    private eventEmitter: EventEmitter2,

    // @Inject(REQUEST) private request,

    private notificationService: NotificationService,
  ) {}

  async findAll() {
    // console.log('--Request (tenant-strategy):', this.request);

    // return { data: await this.userRepository.find() } as MessageEvent;
    return await this.userRepository.find();
  }

  async findOne(id: number, name?: string) {
    this.eventEmitter.emit('user.printed', new UserPrintedEvent(id));
    return name
      ? await this.userRepository.findOneBy({ name })
      : await this.userRepository.findOneBy({ id });
  }

  async findProducts(id: number) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NoSuchUserException();
    }
    return await this.productRepository.findBy({ user: user });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NoSuchUserException();
    }
    await this.userRepository.update(id, updateUserDto);

    return await this.userRepository.findOneBy({ id });
  }

  async remove(id: number) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NoSuchUserException();
    }

    const products = await this.findProducts(user.id);
    if (products.length) {
      const files = products.map((prod) => prod.photos).flat();
      if (files.length) {
        const fileNames = files.map((file) => file.name);
        await this.eventEmitter.emit(deleteFilesEvent, fileNames);
      }
    }
    await this.userRepository.remove(user);

    return user;
  }

  @OnEvent('user.printed')
  handleUserPrintedEvent(payload: UserPrintedEvent) {
    this.logger.log(`User printed, userId: ${payload.userId}`);
  }
}
