import { Injectable, OnModuleInit } from '@nestjs/common';
import { CreateProductItemDto } from './dto/create-product-item.dto';
import { UpdateProductItemDto } from './dto/update-product-item.dto';
import { UserService } from '../user/user.service';
import { ModuleRef } from '@nestjs/core';

@Injectable()
export class ProductItemService implements OnModuleInit {
  constructor(private moduleRef: ModuleRef) {}

  async onModuleInit() {}

  create(createProductItemDto: CreateProductItemDto) {
    return 'This action adds a new productItem';
  }

  findAll() {
    // console.log(this.userService.findAll());
    return `This action returns all productItem`;
  }

  findOne(id: number) {
    return `This action returns a #${id} productItem`;
  }

  update(id: number, updateProductItemDto: UpdateProductItemDto) {
    return `This action updates a #${id} productItem`;
  }

  remove(id: number) {
    return `This action removes a #${id} productItem`;
  }
}
