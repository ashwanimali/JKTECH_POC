// src/global/factories/permission.factory.ts
import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Request } from 'express';
import { User } from 'src/modules/v1/users/users.entity';
import { Permission } from 'src/modules/v1/permission/permission.entity';

@Injectable()
export class PermissionFactory {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) {}

  async hasPermission(user: User, request: Request): Promise<boolean> {
    const { method, url } = request;

    const allPermissions = await this.permissionRepository.find({
      where: {
        userId: user.id,
        method,
        role: user.role,
      },
    });

    if (!allPermissions?.length) {
      throw new HttpException('Permissions Not Found', 403);
    }

    const matched = allPermissions.find(permission =>
      url.includes(permission.url) && permission.method === method,
    );

    if (!matched) {
      throw new HttpException('Permission Denied', 403);
    }

    return true;
  }
}
