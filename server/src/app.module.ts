import { AuthenticationGuard } from '@common/guards/authentication.guard';
import { LogMiddleware } from '@common/middlewares/log.middleware';
import { LoggerMiddleware } from '@common/middlewares/logger.middleware';
import { DatabaseModule } from '@config/database/database.module';
import { AuthenticationModule } from '@modules/authentication/authentication.module';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ServeStaticModule } from '@nestjs/serve-static';
import { RequestContextModule } from 'nestjs-request-context';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { S3Module } from '@common/helpers/s3/s3.module';


@Module({
  imports: [
    ConfigModule.forRoot(),
    RequestContextModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    DatabaseModule,
    AuthenticationModule,
    S3Module,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthenticationGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*').apply(LogMiddleware).forRoutes('*');
  }
}
