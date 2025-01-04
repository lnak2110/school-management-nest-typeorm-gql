import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ErrorCodes } from '../exceptions/error-codes.enum';
import { CustomException } from '../exceptions/custom-exception';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', context.getClass());
    const handlerRoles = this.reflector.get<string[]>(
      'roles',
      context.getHandler(),
    );
    if (!roles && !handlerRoles) {
      return true;
    }

    const gqlContext = GqlExecutionContext.create(context);
    const authHeader = gqlContext.getContext().req?.headers?.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new CustomException(
        ErrorCodes.UNAUTHORIZED,
        'Invalid or missing Bearer Token',
      );
    }

    const token = authHeader.split(' ')[1];
    if (token === 'admin') {
      return true;
    }

    const requiredRoles = [...(roles || []), ...(handlerRoles || [])];
    if (!requiredRoles.includes(token)) {
      throw new CustomException(ErrorCodes.FORBIDDEN, 'Forbidden resources');
    }

    return true;
  }
}
