import { IsOptional, IsString, IsIn } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDto {
    @ApiPropertyOptional({
        description: 'Updated name of the user',
        example: 'Jane Doe',
    })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiPropertyOptional({
        description: 'Updated role of the user (admin, editor, viewer)',
        example: 'viewer',
        enum: ['admin', 'editor', 'viewer'],
    })
    @IsOptional()
    @IsString()
    @IsIn(['admin', 'editor', 'viewer'])
    role?: string;
}
