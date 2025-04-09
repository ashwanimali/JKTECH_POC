import { IsString } from 'class-validator';

export class UpdatePermissionDto {
    @IsString()
    userId?: string;

    @IsString()
    role?: string;

    @IsString()
    method?: string;

    @IsString()
    url?: string;
}
