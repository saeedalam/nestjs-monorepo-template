import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

export interface UserInfo {
  name: string;
  id: string;
  iat: number;
  exp: number;
}

export class UserInterceptor implements NestInterceptor {
  async intercept(context: ExecutionContext, next: CallHandler<any>) {
    const request = context.switchToHttp().getRequest();
    const token = request?.headers?.authorization?.split('Bearer ')[1];

    const user = await jwt.decode(token);
    request.user = user;

    //code befor this ,intercept the request
    //codes in handle function part , intercept the response
    return next.handle();
  }
}
