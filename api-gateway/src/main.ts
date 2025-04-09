import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';

dotenv.config();

// Load env based on NODE_ENV
const envFile = `config/${process.env.NODE_ENV || 'dev'}.env`;

dotenv.config({ path: envFile });

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  await app.listen(process.env.PORT ?? 3000);
  console.log(`Api-Gateway is running on :` + process.env.PORT);
}
bootstrap();