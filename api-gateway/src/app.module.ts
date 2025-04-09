import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClsModule } from 'nestjs-cls';
import { DbModule } from './db/db.module';
import { AuthModule } from './modules/v1/auth/auth.module';
import { DocumentsModule } from './modules/v1/documents/documents.module';
import { IngestionModule } from './modules/v1/ingestion/ingestion.module';
import { PermissionModule } from './modules/v1/permission/permission.module';
import { UsersModule } from './modules/v1/users/users.module';
import { SeederModule } from './seeder/seeder.module';

@Module({
  imports: [
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
  providers: [],
})
export class AppModule {}
