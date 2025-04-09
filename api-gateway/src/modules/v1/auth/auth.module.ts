import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { UsersModule } from '../users/users.module';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { User } from '../users/users.entity';
import { PermissionModule } from '../permission/permission.module';
import { Permission } from '../permission/permission.entity';
@Module({
    imports: [
        UsersModule,
        PermissionModule,
        TypeOrmModule.forFeature([User, Permission]),
        JwtModule.registerAsync({
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => {
                const jwtSecret = configService.get('JWT_SECRET') || 'G@9mZ#x2Tf$L7p*QvW1!nEr&Vc6HdY8o';
                return {
                    secret: jwtSecret,
                    signOptions: { expiresIn: '1h' },
                };
            },
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy, AuthGuard],
    exports: [AuthService, AuthGuard],
})
export class AuthModule { }
