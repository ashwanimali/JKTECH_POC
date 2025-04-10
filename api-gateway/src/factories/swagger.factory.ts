// src/swagger/swagger.factory.ts
import { INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AuthModule } from 'src/modules/v1/auth/auth.module';
import { DocumentsModule } from 'src/modules/v1/documents/documents.module';
import { IngestionModule } from 'src/modules/v1/ingestion/ingestion.module';
import { PermissionModule } from 'src/modules/v1/permission/permission.module';
import { UsersModule } from 'src/modules/v1/users/users.module';

export class SwaggerFactory {
  static setup(app: INestApplication) {
    const mainOptions = new DocumentBuilder()
      .setTitle("Backend API Documentation")
      .addBearerAuth()
      .setDescription('Main API Documentation')
      .setVersion('1.0')
      .build();

    const mainDoc = SwaggerModule.createDocument(app, mainOptions, {
      include: [
        AuthModule,
        UsersModule,
        DocumentsModule,
        PermissionModule,
        IngestionModule
      ],
    });

    SwaggerModule.setup('docs', app, mainDoc, {
      explorer: true,
      swaggerOptions: {
        urls: [
          { name: 'API V1', url: 'api/swagger.json' },
        ],
      },
      jsonDocumentUrl: '/api/swagger.json',
    });
  }
}
