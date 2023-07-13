import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  UsePipes,
  ParseFilePipe,
  BadRequestException,
  ParseFilePipeBuilder,
  UploadedFiles,
  Res,
  StreamableFile,
  CacheTTL,
  ParseUUIDPipe,
  Req,
  ParseIntPipe,
} from '@nestjs/common';
import { FileService } from './file.service';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { FileProducer } from './queue/file.producer';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { createReadStream } from 'fs';
import { Response } from 'express';
import { HttpCacheInterceptor } from 'src/interceptors/httpCache.interceptor';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/enums/role.enum';
import { Public } from 'src/decorators/public-route.decorator';
import { UploadedFileNames } from 'src/decorators/uploadedFileNames.decorator';

@Controller('file')
export class FileController {
  constructor(
    private readonly fileService: FileService,
    private fileProducer: FileProducer,
  ) {}

  @Roles(Role.ADMIN, Role.MANAGER)
  @Get('json')
  async getAll() {
    return await this.fileService.findAll();
  }

  @Roles(Role.ADMIN, Role.MANAGER)
  @Get('json/:id')
  async getOne(@Param('id', ParseIntPipe) id: number) {
    return await this.fileService.findOne(id);
  }

  @Roles(Role.USER)
  @Post(':productId')
  @UseInterceptors(FilesInterceptor('file'))
  async uploadFile(
    @UploadedFiles(ParseFilePipe) files: Express.Multer.File[],
    @Param('productId', ParseIntPipe) productId: number,
    @UploadedFileNames() fileNames: string[],
  ) {
    return this.fileService.uploadFiles(fileNames, productId, null);
  }

  @Public()
  @Get(':id')
  async findOne(@Res() res, @Param('id', ParseIntPipe) id: number) {
    const filePathAndName = await this.fileService.getFilePathAndName(id);
    const file = createReadStream(filePathAndName.path);
    file.pipe(res);
  }

  @Public()
  @Roles(Role.ADMIN)
  @Get('/download/:id')
  async downloadOne(
    @Res() res: Response,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const filePathAndName = await this.fileService.getFilePathAndName(id);
    const file = createReadStream(filePathAndName.path);

    res.set({
      'Content-disposition': `attachment; filename="${filePathAndName.name}"`,
    });
    file.pipe(res);
  }

  @Roles(Role.USER)
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.fileService.remove(id);
  }
}
