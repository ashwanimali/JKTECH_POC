import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';

dotenv.config();

// Load env based on NODE_ENV
dotenv.config({ path: `config/${process.env.NODE_ENV}.env` });

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  await app.listen(process.env.PORT ?? 3001);
  console.log(`Ingestion is running on :` + process.env.PORT );
}
bootstrap();