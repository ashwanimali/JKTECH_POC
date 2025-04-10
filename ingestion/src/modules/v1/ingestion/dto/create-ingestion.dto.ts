import { IsDefined, IsString } from "class-validator";

export class CreateIngestionDto {
  @IsString()
  @IsDefined()
  documentId: string;

  @IsString()
  @IsDefined()
  userId: string;
}
