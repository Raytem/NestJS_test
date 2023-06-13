import { Test, TestingModule } from '@nestjs/testing';
import { ProductItemController } from './product-item.controller';
import { ProductItemService } from './product-item.service';
import { UserService } from '../user/user.service';

describe('ProductItemController', () => {
  let controller: ProductItemController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductItemController],
      providers: [ProductItemService, UserService],
    }).compile();

    controller = module.get<ProductItemController>(ProductItemController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
