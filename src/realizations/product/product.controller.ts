import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UploadedFiles,
  ValidationPipe,
  UsePipes,
  UseInterceptors,
  Req,
  ParseFilePipeBuilder,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

import { UploadedFileNames } from 'src/decorators/uploadedFileNames.decorator';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/enums/role.enum';
import { Public } from 'src/decorators/public-route.decorator';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Roles(Role.USER)
  @Post()
  @UseInterceptors(FilesInterceptor('file'))
  async create(
    @UploadedFiles()
    files: Express.Multer.File[],
    @UploadedFileNames() fileNames: string[],
    @Body() createProductDto: CreateProductDto,
  ) {
    return await this.productService.create(createProductDto, fileNames);
  }

  @Public()
  @Get()
  async findAll() {
    return await this.productService.findAll();
  }

  @Public()
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.productService.findOne(id);
  }

  @Roles(Role.USER)
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return await this.productService.update(id, updateProductDto);
  }

  @Roles(Role.USER)
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.productService.remove(+id);
  }
}
