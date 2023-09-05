import { Module } from '@nestjs/common';
import { DatabaseModule } from './db/database.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Opcion, OpcionSchema, Usuario, UsuarioSchema } from './db/entities';
import { Sistema, SistemaSchema } from './db/entities/sistema.entity';
@Module({
  imports: [
    DatabaseModule,
    MongooseModule.forFeature([
      {name: Usuario.name, schema: UsuarioSchema},
      {name: Opcion.name, schema: OpcionSchema},
      {name: Sistema.name, schema: SistemaSchema}
    ])
  ],
  exports:[
    DatabaseModule,
    MongooseModule
  ]
})
export class PersistenceModule {}
