import { Module, forwardRef } from '@nestjs/common';
import { ProductItemService } from './product-item.service';
import { ProductItemController } from './product-item.controller';
import { UserModule } from '../user/user.module';
import { UserService } from '../user/user.service';

@Module({
  controllers: [ProductItemController],
  providers: [ProductItemService],
})
export class ProductItemModule {}
