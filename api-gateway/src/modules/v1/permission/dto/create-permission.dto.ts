import { IsString } from 'class-validator';

export class CreatePermissionDto {
    @IsString()
    userId: string;

    @IsString()
    role: string;

    @IsString()
    method: string;

    @IsString()
    url: string;
}
