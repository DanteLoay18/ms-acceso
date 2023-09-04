import { Module } from '@nestjs/common';
import { CoreModule } from './core/core.module';
import { SharedModule } from './infraestructure/shared/shared.module';
import { DatabaseModule } from './infraestructure/persistence/db/database.module';
import { AdaptersModule } from './infraestructure/adapters/adapters.module';
import { HttpServerModule } from './infraestructure/http-server/http-server.module';

@Module({
  imports: [CoreModule, SharedModule, DatabaseModule, AdaptersModule, HttpServerModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
