import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import * as path from 'path';
import * as fs from 'fs/promises';
import { multerConfig } from 'config/multer.config';
import { ConfigType } from '@nestjs/config';

@Injectable()
export class FileService {
  constructor(
    @Inject(multerConfig.KEY)
    private multerCfg: ConfigType<typeof multerConfig>,
  ) {}

  async getFilePath(fileOriginalName: string) {
    const staticFilesPath = path.join(
      process.cwd(),
      this.multerCfg.destination,
    );
    const filePath = path.join(staticFilesPath, decodeURI(fileOriginalName));
    try {
      await fs.access(filePath);
    } catch (e) {
      throw new BadRequestException(`No such file "${fileOriginalName}"`);
    }
    return filePath;
  }

  async uploadFiles(files: Express.Multer.File[]) {
    const totalSize = files.reduce((sum, cur) => sum + cur.size, 0);
    const fileNames = files.map((file) => file.originalname);
    return {
      info: `Files has been uploaded`,
      totalSize_bytes: totalSize,
      fileNames,
    };
  }

  create(createFileDto: CreateFileDto) {
    return 'This action adds a new file';
  }

  findAll() {
    return `This action returns all file`;
  }

  findOne(id: number) {
    return `This action returns a #${id} file`;
  }

  update(id: number, updateFileDto: UpdateFileDto) {
    return `This action updates a #${id} file`;
  }

  remove(fileName: string) {
    return `File ${fileName} has been successfully removed`;
  }
}
