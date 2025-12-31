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
import { UsuarioModule } from './modules/cadastro/usuario/usuario.module';
import { ClienteModule } from './modules/cliente/cliente.module';
import { GanhadoresModule } from './modules/ganhadores/ganhadores.module';
import { RelatorioModule } from './modules/relatorio/relatorio.module';
import { HistoricoModule } from './modules/historico/historico.module';
import { CampanhaModule } from './modules/cadastro/campanha/campanha.module';
import { S3Module } from '@common/helpers/s3/s3.module';
import { PaginaInicioModule } from './modules/pagina_inicio/pagina_inicio.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    RequestContextModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    DatabaseModule,
    AuthenticationModule,
    UsuarioModule,
    CampanhaModule,
    HistoricoModule,
    ClienteModule,
    GanhadoresModule,
    RelatorioModule,
    S3Module,
    PaginaInicioModule,
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
