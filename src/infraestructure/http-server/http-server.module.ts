import { Module } from '@nestjs/common';
import { CoreModule } from 'src/core/core.module';
import { UserController } from './controllers/auth.controller';
import { UsuarioController } from './controllers/usuario.controller';
import { OpcionController } from './controllers/opcion.controller';
import { SistemaController } from './controllers/sistema.controller';
import { MenuController } from './controllers/menu.controller';
import { PerfilController } from './controllers/perfil.controller';

@Module({
    imports:[CoreModule],
    controllers:[
        UserController,
        UsuarioController,
        OpcionController,
        SistemaController,
        PerfilController,
        MenuController
    ]
})
export class HttpServerModule {}
