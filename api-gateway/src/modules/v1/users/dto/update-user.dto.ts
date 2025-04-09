import { IsOptional, IsString, IsIn } from 'class-validator';

export class UpdateUserDto {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsString()
    @IsIn(['admin', 'editor', 'viewer'])
    role?: string;
}
