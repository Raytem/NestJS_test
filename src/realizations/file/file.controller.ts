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
} from '@nestjs/common';
import { FileService } from './file.service';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { FileProducer } from './queue/file.producer';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { createReadStream } from 'fs';
import { Response } from 'express';
import { HttpCacheInterceptor } from 'src/interceptors/httpCache.interceptor';

@Controller('file')
export class FileController {
  constructor(
    private readonly fileService: FileService,
    private fileProducer: FileProducer,
  ) {}

  @Post()
  @UseInterceptors(FilesInterceptor('file'))
  async uploadFile(
    @UploadedFiles(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /png|jpg|jpeg|/i,
        })
        .addMaxSizeValidator({ maxSize: 10e7 })
        .build(),
    )
    files: Express.Multer.File[],
  ) {
    return this.fileProducer.uploadFiles(files);
  }

  @Get(':fileOriginalName')
  async findOne(
    @Res() res,
    @Param('fileOriginalName') fileOriginalName: string,
  ) {
    const filePath = await this.fileService.getDownloadPath(fileOriginalName);
    const file = createReadStream(filePath);
    res.set({
      'Content-disposition': `inline; filename="${fileOriginalName}"`,
    });
    file.pipe(res);
  }

  @Get('/download/:fileOriginalName')
  async downloadOne(
    @Res() res: Response,
    @Param('fileOriginalName') fileOriginalName: string,
  ) {
    const filePath = await this.fileService.getDownloadPath(fileOriginalName);
    const file = createReadStream(filePath);
    res.set({
      'Content-disposition': `attachment; filename="${fileOriginalName}"`,
    });
    file.pipe(res);
  }

  @Delete(':filename')
  remove(@Param('filename') filename: string) {
    return this.fileProducer.deleteFile(filename);
  }
}
