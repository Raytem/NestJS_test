import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';

@Injectable()
export class FileProducer {
  constructor(
    @InjectQueue('file-operation')
    private fileQueue: Queue,
  ) {}

  async deleteFile(fileName: string) {
    const path = `/Users/daniil/Desktop/nest/nest-test_1/files/${fileName}`;
    await this.fileQueue.add(
      'delete-file',
      {
        path: path,
      },
      {
        delay: 10000,
      },
    );
    return {
      info: `File has been deleted`,
      fileName: fileName,
    };
  }

  async uploadFiles(files: Array<Express.Multer.File>) {
    await this.fileQueue.add(
      'upload-files',
      {
        files: files,
      },
      {
        delay: 0,
      },
    );

    const totalSize = files.reduce((sum, cur) => sum + cur.size, 0);
    const fileNames = files.map((file) => file.originalname);

    return {
      info: `Files has been uploaded`,
      totalSize_bytes: totalSize,
      fileNames,
    };
  }
}
