import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserType } from '@prisma/client';
import * as jwt from 'jsonwebtoken';

interface IJwtPayload {
  name: string;
  id: string;
  iat: number;
  exp: number;
  role: UserType;
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  async canActivate(context: ExecutionContext) {
    const validRoles = this.reflector.getAllAndOverride<UserType[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (validRoles.length) {
      const request = context.switchToHttp().getRequest();
      const token = request?.headers?.authorization?.split('Bearer ')[1];
      if (!token) return false;

      try {
        const payload = jwt.verify(
          token,
          process.env.JSON_TOKEN_KEY,
        ) as IJwtPayload;

        if (!validRoles.includes(payload.role)) {
          return false;
        }
        return true;
      } catch (err) {
        return false;
      }
    }
    return true;
  }
}
