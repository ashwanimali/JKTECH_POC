import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { VersioningType } from '@nestjs/common';
import { UserSeeder } from './seeder/user.seeder';
import { SwaggerFactory } from './factories/swagger.factory';

dotenv.config();

const envFile = `config/${process.env.NODE_ENV || 'dev'}.env`;

dotenv.config({ path: envFile });

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableVersioning({
    type: VersioningType.URI,
  });

  const seeder = app.get(UserSeeder);
  await seeder.seedAdmin();
  SwaggerFactory.setup(app);
  await app.listen(process.env.PORT ?? 3000);
  console.log(`Api-Gateway is running on :` + process.env.PORT);
}
bootstrap();