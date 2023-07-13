import {
  BadRequestException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import * as path from 'path';
import * as fs from 'fs/promises';
import { multerConfig } from 'config/multer.config';
import { ConfigType } from '@nestjs/config';
import { appConfig } from 'config/app.config';
import { InjectRepository } from '@nestjs/typeorm';
import { FileEntity } from './entities/file.entity';
import { Repository } from 'typeorm';
import { FileProducer } from './queue/file.producer';
import { NoSuchFileException } from 'src/exceptions/NoSuchFile.exception';
import { ProductEntity } from '../product/entities/product.entity';
import { NoSuchProductException } from 'src/exceptions/NoSuchProduct.exception';
import { FilePathAndName } from 'src/interfaces/file-path-and-name.interface';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { deleteFilesEvent } from './file-emitter-events';

@Injectable()
export class FileService {
  constructor(
    @Inject(multerConfig.KEY)
    private multerCfg: ConfigType<typeof multerConfig>,

    @Inject(appConfig.KEY)
    private appCfg: ConfigType<typeof appConfig>,

    @InjectRepository(FileEntity)
    private fileRepository: Repository<FileEntity>,

    @InjectRepository(ProductEntity)
    private productRepository: Repository<ProductEntity>,

    private fileProducer: FileProducer,

    private eventEmitter: EventEmitter2,
  ) {}

  async getFilePathAndName(
    id: number,
    fileName?: string,
  ): Promise<FilePathAndName> {
    if (!fileName) {
      const file = await this.findOne(id);
      fileName = file.name;
    }

    const staticFilesPath = path.join(
      process.cwd(),
      this.multerCfg.destination,
    );
    const filePath = path.join(staticFilesPath, fileName);
    try {
      await fs.access(filePath);
    } catch (e) {
      throw new NoSuchFileException();
    }

    return {
      path: filePath,
      name: fileName,
    };
  }

  async uploadFiles(
    fileNames: string[],
    productId: number,
    product?: ProductEntity,
  ) {
    if (productId) {
      product = await this.productRepository.findOneBy({ id: productId });
    }

    if (!product) {
      await this.eventEmitter.emit(deleteFilesEvent, fileNames);
      throw new NoSuchProductException();
    }

    if (fileNames.length !== 0) {
      for (const name of fileNames) {
        const file = await this.fileRepository.save({
          name,
          product,
        });
        if (!product.photos) {
          product.photos = [];
        }
        product.photos.push(file);
      }
    }

    return product.photos
      ? product.photos.map((photo) => new FileEntity(photo))
      : [];
  }

  async findAll() {
    return await this.fileRepository.find();
  }

  async findOne(id: number) {
    const file = await this.fileRepository.findOneBy({ id });
    if (!file) {
      throw new NoSuchFileException();
    }
    return file;
  }

  update(id: number, updateFileDto: UpdateFileDto) {
    return `This action updates a #${id} file`;
  }

  async remove(id: number) {
    const file = await this.fileRepository.findOneBy({ id });
    if (!file) {
      throw new NoSuchFileException();
    }
    await this.fileRepository.remove(file);
    this.eventEmitter.emit(deleteFilesEvent, [file.name]);
    return file;
  }

  @OnEvent(deleteFilesEvent, { async: true })
  async handlerDeleteFileEvent(fileNames: string[]) {
    const filePaths = [];
    for (const name of fileNames) {
      const filePath = (await this.getFilePathAndName(null, name)).path;
      filePaths.push(filePath);
    }
    await this.fileProducer.deleteFiles(filePaths);
  }
}
