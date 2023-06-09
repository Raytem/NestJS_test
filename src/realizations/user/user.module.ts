import { Module, forwardRef } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { ProductItemModule } from 'src/realizations/product-item/product-item.module';

@Module({
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
