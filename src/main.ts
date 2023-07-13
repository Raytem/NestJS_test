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
import * as session from 'express-session';
import sessionOptions from 'config/cfgClasses/session.options';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as path from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
  });
  app.useLogger(app.get(MyLoggerService));

  app.enableVersioning({
    type: VersioningType.URI,
  });
  // app.enableShutdownHooks();

  const configService = app.get(ConfigService);
  app.enableCors({
    origin: ['*', configService.get('app.clientUrl')],
    credentials: true,
  });

  app.use(
    json(),
    cookieParser(),
    compression(),
    session(sessionOptions),
    loggerMiddleware,
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  ContextIdFactory.apply(new AggregateByTenantContextIdStrategy());

  const port = configService.get('app.port');
  await app.listen(port);
  console.log(`--> Server started on port: ${port}`);
}
bootstrap();
