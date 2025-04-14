import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerService } from './common/utils/logger.service';
import { DbModule } from './db/db.module';
import { IngestionModule } from './modules/v1/ingestion/ingestion.module';
import { ScheduleModule } from '@nestjs/schedule';
import { LogCronService } from './common/services/logCron.service';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DbModule,
    IngestionModule,
  ],
  controllers: [],
  providers: [
    LoggerService,
    LogCronService
  ],
})
export class AppModule {}
