import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { IngestionController } from "./ingestion.controller";
import { IngestionService } from "./ingestion.service";
import { ClientsModule } from "@nestjs/microservices";
import { INGESTION_SERVICE_NAME } from "src/common/utils/constant";
import { ClientOptionsFactory } from "src/factories/redisClient.factory";
import { User } from "../users/users.entity";
import { Document } from "../documents/entities/document.entity"
import { JwtModule } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { PermissionGuard } from "src/common/guards/permission.guard";
import { PermissionFactory } from "src/factories/permission.factory";
import { Permission } from "../permission/permission.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Document,Permission]),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET') || 'defaultSecret',
        signOptions: { expiresIn: '1h' },
      }),
    }),
    ClientsModule.registerAsync({
      clients: [
        {
          name: INGESTION_SERVICE_NAME,
          useClass: ClientOptionsFactory,
        },
      ],
    }),
  ],
  controllers: [IngestionController],
  providers: [IngestionService,PermissionGuard,PermissionFactory],
  exports:[PermissionGuard]
})
export class IngestionModule { }
