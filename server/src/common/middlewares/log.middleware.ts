import { Injectable, NestMiddleware } from "@nestjs/common";

@Injectable()
export class LogMiddleware implements NestMiddleware {
  async use(req: any, res: any, next: () => void) {
    // const now = Date.now();

    const originalSendFunc = res.send.bind(res);

    let _responseBody: string;

    res.send = function (body: any) {
      _responseBody = body;
      return originalSendFunc(body);
    };

    next();
  }
}
