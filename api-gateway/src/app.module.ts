import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { ClsModule } from 'nestjs-cls';
import { AllExceptionFilter } from './common/filters/execption-filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { LogCronService } from './common/services/logCron.service';
import { LoggerService } from './common/utils/logger.service';
import { DbModule } from './db/db.module';
import { AuthModule } from './modules/v1/auth/auth.module';
import { DocumentsModule } from './modules/v1/documents/documents.module';
import { IngestionModule } from './modules/v1/ingestion/ingestion.module';
import { PermissionModule } from './modules/v1/permission/permission.module';
import { UsersModule } from './modules/v1/users/users.module';
import { SeederModule } from './seeder/seeder.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ClsModule.forRoot({
      global: true,
      middleware: {
        mount: true,
      },
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DbModule,
    SeederModule,
    AuthModule,
    UsersModule,
    DocumentsModule,
    PermissionModule,
    IngestionModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    LoggerService,
    LogCronService
  ],
})
export class AppModule {}
