import { IsEmail, IsIn, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
    @ApiProperty({
        description: 'Full name of the user',
        example: 'John Doe',
    })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({
        description: 'Valid email address of the user',
        example: 'john@example.com',
    })
    @IsEmail()
    email: string;

    @ApiProperty({
        description: 'Password for the account (minimum 6 characters)',
        example: 'securePass123',
        minLength: 6,
    })
    @IsNotEmpty()
    @MinLength(6)
    password: string;

    @ApiPropertyOptional({
        description: 'Role assigned to the user (admin, editor, viewer)',
        example: 'editor',
        enum: ['admin', 'editor', 'viewer'],
    })
    @IsOptional()
    @IsString()
    @IsIn(['admin', 'editor', 'viewer'])
    role?: string;
}
