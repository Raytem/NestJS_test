import { ContextIdFactory, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { loggerMiddleware } from './middlewares/logger.middleware';
import { json } from 'express';
import { AggregateByTenantContextIdStrategy } from './strategys/tenant.strategy';
import 'dotenv/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableShutdownHooks();
  app.use(json(), loggerMiddleware);

  ContextIdFactory.apply(new AggregateByTenantContextIdStrategy());

  await app.listen(process.env.PORT);
  console.log(`--> Server started on port: ${process.env.PORT}`);
}
bootstrap();
