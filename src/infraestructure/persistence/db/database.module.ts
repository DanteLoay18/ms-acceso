import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { DatabaseConfig } from 'src/infraestructure/shared/config/database.config';

@Module({
    imports:[
        ConfigModule,
        MongooseModule.forRootAsync({
            useFactory: (config:ConfigService) => {
                const database = config.get<DatabaseConfig>('database')
                return {
                    uri: database.url,
                }
             
            },
            inject:[ConfigService]
          }
        )
    ]
})
export class DatabaseModule {}
