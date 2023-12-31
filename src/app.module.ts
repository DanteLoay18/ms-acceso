import { Module } from '@nestjs/common';
import { CoreModule } from './core/core.module';
import { SharedModule } from './infraestructure/shared/shared.module';
import { HttpServerModule } from './infraestructure/http-server/http-server.module';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
  imports: [ CoreModule, 
             HttpServerModule,
              
             SharedModule,
             CqrsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
