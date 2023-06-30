import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from '@hapi/joi';

import { AppService } from './app.service';
import { AppController } from './app.controller';
import AuthenticationModule from './authentication/authentication.module';
import { DatabaseModule } from './database/database.module';
import UserModule from './users/user.module';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ResponseFormatInterceptor } from './utils/responseFormat.interceptor';
import { CustomExceptionFilter } from './exceptions/CustomExceptionFilters';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        POSTGRES_HOST: Joi.string().required(),
        POSTGRES_PORT: Joi.number().required(),
        POSTGRES_USER: Joi.string().required(),
        POSTGRES_PASSWORD: Joi.string().required(),
        POSTGRES_DB: Joi.string().required(),
        PORT: Joi.number(),
        JWT_EXPIRATION_TIME: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
      }),
    }),
    DatabaseModule,
    UserModule,
    AuthenticationModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: CustomExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseFormatInterceptor,
    },
  ],
})
export class AppModule {}
