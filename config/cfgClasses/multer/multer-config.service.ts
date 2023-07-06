import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { MulterOptionsFactory } from '@nestjs/platform-express';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { multerConfig } from 'config/multer.config';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class MulterConfigService implements MulterOptionsFactory {
  constructor(
    @Inject(multerConfig.KEY)
    private multerCfg: ConfigType<typeof multerConfig>,
  ) {}

  createMulterOptions(): MulterOptions | Promise<MulterOptions> {
    return {
      storage: diskStorage({
        destination: this.multerCfg.destination,
        filename: (req, file: Express.Multer.File, fn) => {
          const resFileName = `${uuidv4()}_${file.originalname}`;
          fn(null, resFileName);
        },
      }),
    };
  }
}
