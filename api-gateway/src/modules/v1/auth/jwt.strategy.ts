import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config'; // ✅ Your custom config service
import { ClsService } from 'nestjs-cls';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly configService: ConfigService,private readonly cls: ClsService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configService.get('JWT_SECRET') || 'fallbackSecret',
        });

        if (process.env.NODE_ENV !== 'production') {
            console.log('[JwtStrategy] JWT_SECRET used:', this.configService.get('JWT_SECRET'));
        }
    }

    async validate(payload: any) {
        this.cls.set("authUser", payload);
        return { userId: payload.sub, role: payload.role };
    }
}
