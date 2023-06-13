import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { ProductItemService } from '../product-item/product-item.service';
import { ProductItemModule } from '../product-item/product-item.module';

@Module({
  controllers: [UserController],
  providers: [UserService, ProductItemService],
})
export class UserModule {}
