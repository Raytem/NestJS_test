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

@Roles(Role.USER)
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
        // .addMaxSizeValidator({ maxSize: 10e7 })
        .build(),
    )
    files: Express.Multer.File[],
  ) {
    return this.fileService.uploadFiles(files);
  }

  @Get(':fileOriginalName')
  async findOne(
    @Res() res,
    @Param('fileOriginalName') fileOriginalName: string,
  ) {
    const filePath = await this.fileService.getFilePath(fileOriginalName);
    const file = createReadStream(filePath);
    file.pipe(res);
  }

  @Get('/download/:fileOriginalName')
  async downloadOne(
    @Res() res: Response,
    @Param('fileOriginalName') fileOriginalName: string,
  ) {
    const filePath = await this.fileService.getFilePath(fileOriginalName);
    const file = createReadStream(filePath);

    const parsedFileName =
      fileOriginalName.length > 37
        ? fileOriginalName.substring(37)
        : fileOriginalName;
    res.set({
      'Content-disposition': `attachment; filename="${parsedFileName}"`,
    });
    file.pipe(res);
  }

  @Delete(':fileOriginalName')
  async remove(@Param('fileOriginalName') fileOriginalName: string) {
    const filePath = await this.fileService.getFilePath(fileOriginalName);
    return this.fileProducer.deleteFile(filePath);
  }
}
