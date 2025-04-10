import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerService } from './common/utils/logger.service';
import { DbModule } from './db/db.module';
import { IngestionModule } from './modules/v1/ingestion/ingestion.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DbModule,
    IngestionModule,
  ],
  controllers: [],
  providers: [LoggerService],
})
export class AppModule {}
