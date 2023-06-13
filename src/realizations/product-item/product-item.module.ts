import { Module } from '@nestjs/common';
import { ProductItemService } from './product-item.service';
import { ProductItemController } from './product-item.controller';
import { UserService } from '../user/user.service';

@Module({
  controllers: [ProductItemController],
  providers: [ProductItemService, UserService],
})
export class ProductItemModule {}
