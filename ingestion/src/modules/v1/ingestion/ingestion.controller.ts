import {
  Controller,
} from "@nestjs/common";
import { CreateIngestionDto } from "./dto/create-ingestion.dto";
import { MessagePattern } from '@nestjs/microservices';
import { IngestionService } from "./ingestion.service";

@Controller()
export class IngestionController {
  constructor(private readonly ingestionService: IngestionService) {}

  @MessagePattern('add.ingestion')
  async addIngestion(data: CreateIngestionDto) {
    const ingestion = await this.ingestionService.addIngestion(data);

    return {
      message: 'Successfully added',
      ingestion,
    };
  }

  @MessagePattern('get.ingestion')
  async getIngestion(id: string) {
    const ingestion = await this.ingestionService.getIngestion(id);

    return {
      message: 'Successfully fetched',
      ingestion,
    };
  }
}
