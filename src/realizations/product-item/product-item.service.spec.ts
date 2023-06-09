import { Test, TestingModule } from '@nestjs/testing';
import { ProductItemService } from './product-item.service';

describe('ProductItemService', () => {
  let service: ProductItemService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductItemService],
    }).compile();

    service = module.get<ProductItemService>(ProductItemService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
