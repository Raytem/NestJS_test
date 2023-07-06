import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import { FileConsumer } from './queue/file.consumer';
import { FileProducer } from './queue/file.producer';
import { BullModule } from '@nestjs/bull';
import { MulterModule } from '@nestjs/platform-express';
import { MulterConfigService } from 'config/cfgClasses/multer/multer-config.service';

@Module({
  imports: [
    BullModule.registerQueue({ name: 'file-operation' }),
    MulterModule.registerAsync({
      useClass: MulterConfigService,
    }),
  ],
  controllers: [FileController],
  providers: [FileService, FileConsumer, FileProducer],
})
export class FileModule {}
