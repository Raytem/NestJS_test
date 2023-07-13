import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const UploadedFileNames = createParamDecorator(
  (key: string, context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest();
    return req.fileNames;
  },
);
