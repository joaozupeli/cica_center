import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";

@Injectable()
export class ValidationGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    console.log(user);
    return user;
  }
}
