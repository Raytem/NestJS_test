import { ContextIdFactory, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { loggerMiddleware } from './middlewares/logger.middleware';
import { json } from 'express';
import { AggregateByTenantContextIdStrategy } from './strategys/tenant.strategy';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(json(), loggerMiddleware);
  ContextIdFactory.apply(new AggregateByTenantContextIdStrategy());
  await app.listen(3000);
}
bootstrap();
