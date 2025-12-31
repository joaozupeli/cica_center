import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const Ip = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    return (request.headers["x-forwarded-for"] || request.ip).replace(
      "::ffff:",
      ""
    );
  }
);
