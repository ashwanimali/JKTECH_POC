import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { InjectRepository } from "@nestjs/typeorm";
import { firstValueFrom } from "rxjs";
import { Repository } from "typeorm";
import { CreateIngestionDto } from "./dto/create-ingestion.dto";
import { ClsService } from "nestjs-cls";
import { IngestionResponse, INGESTION_SERVICE_NAME } from "src/common/utils/constant";
import { User } from "../users/users.entity";
import { Document } from "../documents/entities/document.entity"

@Injectable()
export class IngestionService {
  constructor(
    @Inject(INGESTION_SERVICE_NAME)
    private readonly ingestionClient: ClientProxy,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Document)
    private readonly documentRepository: Repository<Document>,
    private readonly clsService: ClsService,
  ) { }

  addIngestion(createIngestionDto: CreateIngestionDto) {
    return firstValueFrom(
      this.ingestionClient.send<
        IngestionResponse,
        CreateIngestionDto & { userId: number }
      >("add.ingestion", {
        userId: this.clsService.get<number>("authUser.id"),
        ...createIngestionDto,
      }),
    );
  }

  /**
   * Get details of ingestion by id
   * @param id ingestion id
   * @returns the details of the ingestion
   */
  async findIngestionById(id: string) {
    const response = await firstValueFrom(
      this.ingestionClient.send<IngestionResponse, string>("get.ingestion", id),
    );

    const [document, user] = await Promise.all([
      this.documentRepository.findOneByOrFail({
        id: response.ingestion.documentId,
      }),
      this.userRepository.findOneByOrFail({ id: response.ingestion.userId }),
    ]);

    return {
      id: response.ingestion.id,
      document: {
        id: document.id,
        name: document.originalName,
      },
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      status: response.ingestion.status,
    };
  }
}
