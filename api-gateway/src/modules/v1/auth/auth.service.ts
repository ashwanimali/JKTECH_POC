import { HttpException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { HashUtil } from 'src/common/utils/hash.util';
import { UsersService } from '../users/users.service';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
    ) { }

    async login(loginDto: LoginUserDto) {
        try {
            const { email, password } = loginDto
            if (!email || !password) {
                throw new HttpException('Send Email and Password', 400);
            }
            const user = await this.usersService.findByEmail(email);
            if (!user || !(await HashUtil.comparePasswords(password, user.password))) {
                throw new UnauthorizedException('Invalid credentials');
            }
            const payload = { sub: user.id, role: user.role };
            return { access_token: this.jwtService.sign(payload) };
        } catch (error) {
            throw error
        }
    }
}
