import { Module } from '@nestjs/common';
import { DatabaseModule } from './db/database.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Menu, MenuSchema, Opcion, OpcionSchema, Usuario, UsuarioSchema } from './db/entities';
import { Sistema, SistemaSchema } from './db/entities/sistema.entity';
import { Perfil, PerfilSchema } from './db/entities/perfil.entity';
@Module({
  imports: [
    DatabaseModule,
    MongooseModule.forFeature([
      {name: Usuario.name, schema: UsuarioSchema},
      {name: Opcion.name, schema: OpcionSchema},
      {name: Sistema.name, schema: SistemaSchema},
      {name: Menu.name, schema: MenuSchema},
      {name: Perfil.name, schema: PerfilSchema}
    ])
  ],
  exports:[
    DatabaseModule,
    MongooseModule
  ]
})
export class PersistenceModule {}
