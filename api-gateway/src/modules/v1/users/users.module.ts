import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config'; 
import { Permission } from '../permission/permission.entity';

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
    controllers: [UsersController],
    providers: [UsersService],
    exports: [UsersService],
})
export class UsersModule { }
