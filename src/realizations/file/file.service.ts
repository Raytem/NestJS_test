import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import * as path from 'path';
import * as fs from 'fs/promises';

@Injectable()
export class FileService {
  async getDownloadPath(fileOriginalName: string) {
    // eslint-disable-next-line prettier/prettier
    const staticFilesPath = path.join(process.cwd(), 'staticFiles');
    const filePath = path.join(staticFilesPath, fileOriginalName);
    try {
      await fs.access(filePath);
    } catch (e) {
      throw new BadRequestException(`No such file "${fileOriginalName}"`);
    }
    return filePath;
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
