import { Inject, Injectable } from '@nestjs/common';
import { ConfigService, ConfigType } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { databaseConfig } from 'config/database.config';
import { NodeEnv } from 'config/validation/env.validation';
import { TokenEntity } from 'src/auth/entities/token.entity';
import { ProductItemEntity } from 'src/realizations/product-item/entities/product-item.entity';
import { RoleEntity } from 'src/realizations/role/entities/role.entity';
import { UserEntity } from 'src/realizations/user/entities/user.entity';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(
    @Inject(databaseConfig.KEY)
    private dbConfig: ConfigType<typeof databaseConfig>,

    private configService: ConfigService,
  ) {}

  createTypeOrmOptions(): TypeOrmModuleOptions | Promise<TypeOrmModuleOptions> {
    return {
      type: 'postgres',
      host: this.dbConfig.host,
      port: this.dbConfig.port,
      database: this.dbConfig.database,
      username: this.dbConfig.username,
      password: this.dbConfig.password,
      synchronize:
        this.configService.get('nodeEnv') === NodeEnv.Production ? false : true,
      entities: [UserEntity, TokenEntity, RoleEntity, ProductItemEntity],
      retryAttempts: 1,
    };
  }
}
