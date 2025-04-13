import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { ApiTags, ApiResponse } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller({ path: 'auth', version: '1' })
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('login')
    @ApiResponse({
        status: 200,
        description: 'Successfully logged in',
        type: LoginResponseDto,
    })

    async login(@Body() loginDto: LoginUserDto): Promise<LoginResponseDto> {
        return await this.authService.login(loginDto);
    }
}
