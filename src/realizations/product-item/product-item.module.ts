import { Module } from '@nestjs/common';
import { ProductItemService } from './product-item.service';
import { ProductItemController } from './product-item.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductItemEntity } from './entities/product-item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProductItemEntity])],
  controllers: [ProductItemController],
  providers: [ProductItemService],
  exports: [TypeOrmModule],
})
export class ProductItemModule {}
