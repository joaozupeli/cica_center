import { Injectable, Logger, NestMiddleware } from '@nestjs/common';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  /**
   * @author João Zupeli
   *
   * @description Middleware para registrar no console as requisições
   *
   * @param {any} req
   * @param {any} res
   * @param {void} next
   *
   * @memberof LoggerMiddleware
   */
  use(req: any, res: any, next: () => void) {
    const now = Date.now();

    res.on('finish', () => {
      Logger.log(
        `${req.ip ? req.ip.split(`:`).pop() : ''} - ${req.method} - ${req.url} - ${res.statusCode} - ${
          Date.now() - now
        }ms`,
        'HTTP'
      );
    });

    next();
  }
}
