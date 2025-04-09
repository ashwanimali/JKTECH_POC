// src/global/guards/permission.guard.ts
import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { ClsService } from 'nestjs-cls';
import { Request } from 'express';
import { User } from 'src/modules/v1/users/users.entity';
import { PermissionFactory } from 'src/factories/permission.factory';

@Injectable()
export class PermissionGuard implements CanActivate {
    constructor(
        private readonly cls: ClsService,
        private readonly permissionFactory: PermissionFactory,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest<Request>();
        const user = this.cls.get<User>('authUser');

        if (!user) {
            throw new UnauthorizedException('User not found in context');
        }

        return this.permissionFactory.hasPermission(user, request);
    }
}
