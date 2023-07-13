import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { MulterModule } from '@nestjs/platform-express';
import { MulterConfigService } from 'config/cfgClasses/multer-config.service';
import { FileModule } from '../file/file.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from './entities/product.entity';
import { FileEntity } from '../file/entities/file.entity';
import { UserEntity } from '../user/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductEntity, FileEntity, UserEntity]),
    MulterModule.registerAsync({
      useClass: MulterConfigService,
      imports: [FileModule],
    }),
    FileModule,
  ],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
