import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { IngestionController } from "./ingestion.controller";
import { IngestionService } from "./ingestion.service";
import { ClientsModule } from "@nestjs/microservices";
import { ConfigService } from "@nestjs/config";
import { Ingestion } from "./Ingestion.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([Ingestion]),
  ],
  controllers: [IngestionController],
  providers: [IngestionService],
  exports:[]
})
export class IngestionModule { }
