import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';

@Injectable()
export class FileProducer {
  constructor(
    @InjectQueue('file-operation')
    private fileQueue: Queue,
  ) {}

  async deleteFile(filePath: string) {
    await this.fileQueue.add('delete-file', {
      path: filePath,
    });

    const fileName = filePath.split('/').at(-1);
    return {
      info: `File has been deleted`,
      fileName,
    };
  }

  // async uploadFiles(files: Array<Express.Multer.File>) {
  //   await this.fileQueue.add('upload-files', {
  //     files: files,
  //   });

  //   const totalSize = files.reduce((sum, cur) => sum + cur.size, 0);
  //   const fileNames = files.map((file) => file.originalname);

  //   return {
  //     info: `Files has been uploaded`,
  //     totalSize_bytes: totalSize,
  //     fileNames,
  //   };
  // }
}
