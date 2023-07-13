import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import { FileConsumer } from './queue/file.consumer';
import { FileProducer } from './queue/file.producer';
import { BullModule } from '@nestjs/bull';
import { MulterModule } from '@nestjs/platform-express';
import { MulterConfigService } from 'config/cfgClasses/multer-config.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileEntity } from './entities/file.entity';
import { ProductEntity } from '../product/entities/product.entity';

@Module({
  imports: [
    BullModule.registerQueue({ name: 'file-operation' }),
    MulterModule.registerAsync({
      useClass: MulterConfigService,
      imports: [FileModule],
    }),
    TypeOrmModule.forFeature([FileEntity, ProductEntity]),
  ],
  controllers: [FileController],
  providers: [FileService, FileConsumer, FileProducer],
  exports: [FileService],
})
export class FileModule {}
