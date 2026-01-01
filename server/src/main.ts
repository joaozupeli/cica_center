/* eslint-disable @typescript-eslint/no-var-requires */
import "dotenv/config";
const { name } = require("../package.json");

import { HttpExceptionFilter } from "@common/filters/http-exception.filter";
import { ValidationPipe } from "@common/pipes/validation.pipe";
import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { json, urlencoded } from "express";
import helmet from "helmet";
import {
  utilities as nestWinstonModuleUtilities,
  WinstonModule,
} from "nest-winston";
import { format, transports } from "winston";
import { AppModule } from "./app.module";
import ApiIGERP from "@common/helpers/api_igerp";

async function bootstrap() {
  // Inicializa a configuração da API IGERP antes de iniciar a aplicação
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({
      format: format.combine(
        format.timestamp(),
        nestWinstonModuleUtilities.format.nestLike(name.toUpperCase(), {
          colors: true,
        })
      ),
      transports: [new transports.Console()],
    }),
  });

  app.use(helmet({ contentSecurityPolicy: false }));
  app.setGlobalPrefix("api");
  app.enableCors();
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(ValidationPipe);
  app.use(json({ limit: "50mb" }));
  app.use(urlencoded({ extended: true, limit: "50mb" }));

  await app.listen(
    process.env.APP_PORT ? parseInt(process.env.APP_PORT) : 3000
  );
  Logger.log(
    `Server started on port ${process.env.APP_PORT}`,
    "NestApplication"
  );
}

bootstrap();
