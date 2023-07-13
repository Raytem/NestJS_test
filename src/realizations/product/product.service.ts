/* eslint-disable prefer-const */
import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from './entities/product.entity';
import { Repository } from 'typeorm';
import { FileEntity } from '../file/entities/file.entity';
import { UserEntity } from '../user/entities/user.entity';
import { NoSuchUserException } from 'src/exceptions/NoSuchUser.exception';
import { NoSuchProductException } from 'src/exceptions/NoSuchProduct.exception';
import { FileService } from '../file/file.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { deleteFilesEvent } from '../file/file-emitter-events';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private productRepository: Repository<ProductEntity>,

    @InjectRepository(FileEntity)
    private fileRepository: Repository<FileEntity>,

    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,

    private fileService: FileService,

    private eventEmitter: EventEmitter2,
  ) {}

  async create(createProductDto: CreateProductDto, fileNames: string[]) {
    const user = await this.userRepository.findOneBy({
      id: createProductDto.userId,
    });
    if (!user) {
      await this.eventEmitter.emit(deleteFilesEvent, fileNames);
      throw new NoSuchUserException();
    }

    const product = await this.productRepository.save({
      name: createProductDto.name,
      description: createProductDto.description,
      price: createProductDto.price,
      user,
    });

    await this.fileService.uploadFiles(fileNames, null, product);

    return new ProductEntity(product);
  }

  async findAll() {
    return await this.productRepository.find({
      relations: { user: true },
    });
  }

  async findOne(id: number) {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: { user: true },
    });
    if (!product) {
      throw new NoSuchProductException();
    }
    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const product = await this.productRepository.findOneBy({ id });
    if (!product) {
      throw new NoSuchProductException();
    }
    await this.productRepository.update(id, updateProductDto);

    return await this.productRepository.findOne({
      where: { id },
      relations: { user: true },
    });
  }

  async remove(id: number) {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: { user: true },
    });
    if (!product) {
      throw new NoSuchProductException();
    }

    const fileNames = product.photos.map((file) => file.name);
    this.eventEmitter.emit(deleteFilesEvent, fileNames);

    await this.productRepository.remove(product);
    return product;
  }
}
