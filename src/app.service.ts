import { Injectable } from '@nestjs/common';
import { UserService } from './realizations/user/user.service';
import { ProductItemService } from './realizations/product-item/product-item.service';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Welcome to the nest-test_1 project!';
  }
}
