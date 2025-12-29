import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { EnvironmentConfig } from './config/environment.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = app.get(EnvironmentConfig);
  const appConfig = config.app;
  const corsConfig = config.cors;

  app.enableCors({
    origin: corsConfig.origin,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  app.setGlobalPrefix('api');

  await app.listen(appConfig.port, () => {
    console.log(`Server running at http://localhost:${appConfig.port}`);
  });
}

bootstrap();
