import { INestApplication, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ServerConfig } from './infraestructure/shared/config/server.config';
import { generateSwaggerDocs } from './infraestructure/http-server/utils/generate-swagger-docs';

function getServerConfig(app: INestApplication): ServerConfig {
  const config: ConfigService = app.get(ConfigService)
  return config.get<ServerConfig>('server')
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = getServerConfig(app)
  app.setGlobalPrefix('api')
  
  generateSwaggerDocs(app)

 

  app.useGlobalPipes( 
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    })
   );

  await app.listen(config.port);
}
bootstrap();
