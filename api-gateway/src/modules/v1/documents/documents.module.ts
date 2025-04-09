import { Module } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { DocumentsController } from './documents.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Document } from './entities/document.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { User } from '../users/users.entity';
import { Permission } from '../permission/permission.entity';
import { JwtStrategy } from '../auth/jwt.strategy';
import { MulterModule } from '@nestjs/platform-express';
import { MulterAsyncOptionsFactory } from 'src/factories/multer.factory';
import { PermissionFactory } from 'src/factories/permission.factory';

@Module({
    imports: [
        // ClientsModule.register([
        //     {
        //         name: 'Injection_Service',
        //         transport: Transport.TCP,
        //         options: { host: '192.168.2.109', port: 4002 },
        //     },
        // ]),
        TypeOrmModule.forFeature([User, Permission, Document]),
        JwtModule.registerAsync({
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get('JWT_SECRET') || 'defaultSecret',
                signOptions: { expiresIn: '1h' },
            }),
        }),
        MulterModule.registerAsync({
            useClass: MulterAsyncOptionsFactory,
        }),
    ],
    controllers: [DocumentsController],
    providers: [DocumentsService, JwtStrategy,PermissionFactory],
    exports: [DocumentsService],
})
export class DocumentsModule { }
