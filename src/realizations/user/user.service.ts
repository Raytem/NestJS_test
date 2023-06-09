import { Inject, Injectable, OnModuleInit, Scope } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ProductItemService } from 'src/realizations/product-item/product-item.service';
import { ContextIdFactory, ModuleRef, REQUEST } from '@nestjs/core';

@Injectable({ scope: Scope.REQUEST, durable: true })
export class UserService implements OnModuleInit {
  private productItemService: ProductItemService;

  constructor(private moduleRef: ModuleRef, @Inject(REQUEST) private request) {}

  onModuleInit() {
    this.productItemService = this.moduleRef.get(ProductItemService);
  }

  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  findAll() {
    console.log(this.productItemService.findAll());
    console.log(this.request);
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
