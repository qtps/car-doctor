import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  handleRequest<TUser = Record<string, unknown>>(
    _err: unknown,
    user: TUser | false | null,
    _info: unknown,
    _context: ExecutionContext,
  ): TUser | null {
    return user || null;
  }
}
