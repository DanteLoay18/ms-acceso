import { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

export function generateSwaggerDocs(app: INestApplication) {
    
    const config = new DocumentBuilder()
        .setTitle('Auth Application')
        .setDescription('Proyecto basado en la base de datos auth con arquitectura hexagonal')
        .setVersion('1.0')
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
    
}