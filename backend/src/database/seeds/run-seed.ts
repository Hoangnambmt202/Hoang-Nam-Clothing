// src/database/seeds/run-seed.ts
import { NestFactory } from '@nestjs/core';
import { SeedModule } from './seed.module';
import { SeedService } from './seed.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(SeedModule);

  try {
    const seeder = app.get(SeedService);
    await seeder.seed();
  } catch (error) {
    console.error('Seed failed:', error);
  } finally {
    await app.close();
  }
}

void bootstrap();
