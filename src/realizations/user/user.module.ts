import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { ProductItemService } from '../product-item/product-item.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { ProductItemEntity } from '../product-item/entities/product-item.entity';
import { RoleEntity } from '../role/entities/role.entity';
import { UserSubscriber } from 'src/typeorm_subscribers/user.subscriber';
import { NotificationService } from 'src/schedule/notification.service';
import { ProductItemModule } from '../product-item/product-item.module';
import { MyLoggerService } from 'src/my-logger/my-logger.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    TypeOrmModule.forFeature([ProductItemEntity]),
    TypeOrmModule.forFeature([RoleEntity]),
    ProductItemModule,
    HttpModule,
    UserModule,
  ],
  controllers: [UserController],
  providers: [
    UserService,
    ProductItemService,
    UserSubscriber,
    NotificationService,
    UserService,
  ],
  exports: [UserService, TypeOrmModule],
})
export class UserModule {}
