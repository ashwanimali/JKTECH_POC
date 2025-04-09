import { IsNotEmpty, IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateDocumentDto {
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsNotEmpty()
    @IsString()
    fileUrl: string;

    @IsNotEmpty()
    @IsString()
    mimeType: string;

    @IsNotEmpty()
    @IsNumber()
    size: number;

    @IsString()
    createdBy: string;
}
