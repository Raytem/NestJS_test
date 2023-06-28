import { ContextIdFactory, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { loggerMiddleware } from './middlewares/logger.middleware';
import { json } from 'express';
import { AggregateByTenantContextIdStrategy } from './strategys/tenant.strategy';
import { ConfigService } from '@nestjs/config';
import {
  VERSION_NEUTRAL,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { MyLoggerService } from './my-logger/my-logger.service';
import * as cookieParser from 'cookie-parser';
import * as compression from 'compression';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });
  app.useLogger(app.get(MyLoggerService));

  // app.enableShutdownHooks();
  app.use(json(), cookieParser(), compression(), loggerMiddleware);
  app.enableVersioning({
    type: VersioningType.URI,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  ContextIdFactory.apply(new AggregateByTenantContextIdStrategy());

  const configService = app.get(ConfigService);
  const port = configService.get('port');
  await app.listen(port);
  console.log(`--> Server started on port: ${port}`);
}
bootstrap();
