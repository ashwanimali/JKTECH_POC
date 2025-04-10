import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { firstValueFrom } from "rxjs";
import { Repository } from "typeorm";
import { CreateIngestionDto } from "./dto/create-ingestion.dto";
import { Ingestion } from "./Ingestion.entity";

@Injectable()
export class IngestionService {
  constructor(
    @InjectRepository(Ingestion)
    private ingestionRepository: Repository<Ingestion>
  ) { }

  async addIngestion(data: CreateIngestionDto) {
    try {
      const newIngestion = this.ingestionRepository.create({
        documentId: data.documentId,
        createdBy: data.userId
      });
  
      await this.ingestionRepository.save(newIngestion);
  
      return newIngestion;
    } catch (error) {
      throw error
    }
  }

  getIngestion(ingestionId: string) {
    return this.ingestionRepository.findOne({ where: { id: ingestionId } });
  }
}
