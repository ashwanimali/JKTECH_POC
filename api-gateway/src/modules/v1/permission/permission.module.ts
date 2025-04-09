import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permission } from './permission.entity';
import { PermissionController } from './permission.controller';
import { PermissionService } from './permission.service';
import { JwtModule } from '@nestjs/jwt';
import { User } from '../users/users.entity';
import { ConfigService } from '@nestjs/config'; 
import { JwtStrategy } from '../auth/jwt.strategy';
import { PermissionGuard } from 'src/common/guards/permission.guard';
import { PermissionFactory } from 'src/factories/permission.factory';

@Module({
    imports: [
        TypeOrmModule.forFeature([User, Permission]),
        JwtModule.registerAsync({
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get('JWT_SECRET') || 'defaultSecret',
                signOptions: { expiresIn: '1h' },
            }),
        }),
    ],
    controllers: [PermissionController],
    providers: [PermissionService, JwtStrategy,PermissionGuard,PermissionFactory],
    exports: [PermissionService,PermissionGuard],
})
export class PermissionModule { }
