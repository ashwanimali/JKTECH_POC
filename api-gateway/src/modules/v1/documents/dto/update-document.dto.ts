import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateDocumentDto {
    @IsOptional()
    @IsString()
    title?: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsString()
    fileUrl?: string;

    @IsOptional()
    @IsString()
    mimeType?: string;

    @IsOptional()
    @IsNumber()
    size?: number;

    @IsString()
    updatedBy?: string;
}
