// src/swagger/swagger.factory.ts

import { INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AuthModule } from 'src/modules/v1/auth/auth.module';


export class SwaggerFactory {
  static setup(app: INestApplication) {
    const mainOptions = new DocumentBuilder()
      .setTitle("Backend API")
      .addBearerAuth()
      .setDescription('Main API Documentation')
      .setVersion('1.0')
      .build();

    const mainDoc = SwaggerModule.createDocument(app, mainOptions);

    SwaggerModule.setup('api', app, mainDoc, {
      explorer: true,
      swaggerOptions: {
        urls: [
          { name: '1. API', url: 'api/swagger.json' },
          { name: '2. Cats API', url: 'api/cats/swagger.json' },
          { name: '3. Dogs API', url: 'api/dogs/swagger.json' },
        ],
      },
      jsonDocumentUrl: '/api/swagger.json',
    });

    // Cats API
    const catOptions = new DocumentBuilder()
      .setTitle('Cats Example')
      .setDescription('Cats API Description')
      .setVersion('1.0')
      .addTag('cats')
      .build();

    const catDoc = SwaggerModule.createDocument(app, catOptions, {
      include: [AuthModule],
    });

    SwaggerModule.setup('api/cats', app, catDoc, {
      jsonDocumentUrl: '/api/cats/swagger.json',
    });
  }
}
