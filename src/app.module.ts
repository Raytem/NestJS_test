import {
  ClassSerializerInterceptor,
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './realizations/user/user.module';
import { ProductItemModule } from './realizations/product-item/product-item.module';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { HttpExceptionFilter } from './exception-filters/http-exception.filter';
import { RolesGuard } from './auth/guards/roles.guard';
import { LoggingInterceptor } from './interceptors/logging.interceptor';
import { TransformInterceptor } from './interceptors/transform.interceptor';
import { ConfigModule, registerAs } from '@nestjs/config';
import { appConfig } from '../config/app.config';
import { databaseConfig } from 'config/database.config';
import { validateConfig } from '../config/validation/env.validation';
import { TypeOrmModule } from '@nestjs/typeorm';
import { apiConfig } from '../config/api.config';
import { ApiConfigService } from './api/apiConfig.service';
import { RoleModule } from './realizations/role/role.module';
import { CacheModule } from '@nestjs/cache-manager';
import { ScheduleModule } from '@nestjs/schedule';
import { NotificationService } from './schedule/notification.service';
import { redisConfig } from 'config/redis.config';
import { BullModule } from '@nestjs/bull';
import { TypeOrmConfigService } from 'config/cfgClasses/typeORM/typeorm-config.service';
import { CacheConfigService } from 'config/cfgClasses/cache/cache-config.service';
import { BullConfigService } from 'config/cfgClasses/bull/bull-config.service';
import { TimeoutInterceptor } from './interceptors/timeout.interceptor';
import { FileModule } from './realizations/file/file.module';
import { MyLoggerModule } from './my-logger/my-logger.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { HttpModule } from '@nestjs/axios';
import { HttpConfigService } from 'config/cfgClasses/http/http-config.service';
import { GetawayModule } from './getaway/getaway.module';
import { AuthModule } from './auth/auth.module';
import { jwtConfig } from 'config/jwt.config';
import { TokenModule } from './auth/token/token.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { MulterModule } from '@nestjs/platform-express';
import { MulterConfigService } from 'config/cfgClasses/multer/multer-config.service';
import { multerConfig } from 'config/multer.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      expandVariables: true,
      load: [
        appConfig,
        databaseConfig,
        redisConfig,
        apiConfig,
        jwtConfig,
        multerConfig,
      ],
      validate: validateConfig,
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
    }),
    BullModule.forRootAsync({
      useClass: BullConfigService,
    }),
    CacheModule.registerAsync({
      useClass: CacheConfigService,
      isGlobal: true,
    }),
    HttpModule.registerAsync({
      useClass: HttpConfigService,
    }),
    EventEmitterModule.forRoot({
      wildcard: true,
    }),
    ScheduleModule.forRoot(),
    AuthModule,
    TokenModule,
    UserModule,
    ProductItemModule,
    RoleModule,
    FileModule,
    MyLoggerModule,
    GetawayModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    ApiConfigService,
    NotificationService,
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
    { provide: APP_INTERCEPTOR, useClass: TimeoutInterceptor },
    { provide: APP_INTERCEPTOR, useClass: LoggingInterceptor },
    { provide: APP_INTERCEPTOR, useClass: TransformInterceptor },
    { provide: APP_INTERCEPTOR, useClass: ClassSerializerInterceptor },
    { provide: APP_FILTER, useClass: HttpExceptionFilter },
    // { provide: APP_INTERCEPTOR, useClass: HttpCacheInterceptor },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(TimeoutInterceptor)
      .exclude({ path: 'file', method: RequestMethod.POST });
  }
}
