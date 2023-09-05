import { Module } from '@nestjs/common';
import { DatabaseModule } from './db/database.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Opcion, OpcionSchema, Usuario, UsuarioSchema } from './db/entities';
@Module({
  imports: [
    DatabaseModule,
    MongooseModule.forFeature([
      {name: Usuario.name, schema: UsuarioSchema},
      {name: Opcion.name, schema: OpcionSchema}
    ])
  ],
  exports:[
    DatabaseModule,
    MongooseModule
  ]
})
export class PersistenceModule {}
