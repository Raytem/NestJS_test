import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { ProductItemService } from './product-item.service';
import { CreateProductItemDto } from './dto/create-product-item.dto';
import { UpdateProductItemDto } from './dto/update-product-item.dto';
import { Roles } from '../../decorators/roles.decorator';
import { Role } from '../../enums/role.enum';

@Roles(Role.USER)
@Controller('product-item')
export class ProductItemController {
  constructor(private readonly productItemService: ProductItemService) {}

  @Post()
  create(@Body() createProductItemDto: CreateProductItemDto) {
    return this.productItemService.create(createProductItemDto);
  }

  @Get()
  findAll() {
    return this.productItemService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: string) {
    return this.productItemService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: string,
    @Body() updateProductItemDto: UpdateProductItemDto,
  ) {
    return this.productItemService.update(+id, updateProductItemDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: string) {
    return this.productItemService.remove(+id);
  }
}
