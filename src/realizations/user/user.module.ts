import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { RoleEntity } from '../role/entities/role.entity';
import { NotificationService } from 'src/schedule/notification.service';
import { HttpModule } from '@nestjs/axios';
import { ProductEntity } from '../product/entities/product.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, RoleEntity, ProductEntity]),
    HttpModule,
  ],
  controllers: [UserController],
  providers: [UserService, NotificationService, UserService],
  exports: [UserService, TypeOrmModule],
})
export class UserModule {}
