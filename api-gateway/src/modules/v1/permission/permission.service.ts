import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permission } from './permission.entity';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { User } from '../users/users.entity';

@Injectable()
export class PermissionService {
    constructor(
        @InjectRepository(Permission)
        private readonly permissionRepo: Repository<Permission>,
    ) { }

    create(dto: CreatePermissionDto, user: User) {
        const permission = this.permissionRepo.create({
            ...dto,
            createdBy: user,
        });
        return this.permissionRepo.save(permission);
    }

    findAll() {
        return this.permissionRepo.find();
    }

    findOne(id: string) {
        return this.permissionRepo.findOne({ where: { id } });
    }

    async update(id: string, dto: UpdatePermissionDto, user: User) {
        const permission = await this.permissionRepo.findOneOrFail({ where: { id } });
        if (!permission) {
            throw new NotFoundException(`Permission with ID ${id} not found`);
        }
        const updatedBody = {
            ...dto,
            updatedBy: user,
        }
        return this.permissionRepo.update(id, updatedBody);
    }

    async remove(id: string) {
        await this.permissionRepo.delete(id);
        return { message: 'Permission deleted successfully' };
    }
}
