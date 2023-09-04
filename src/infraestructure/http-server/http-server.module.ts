import { Module } from '@nestjs/common';
import { CoreModule } from 'src/core/core.module';
import { UserController } from './controllers/auth.controller';
import { UsuarioController } from './controllers/usuario.controller';

@Module({
    imports:[CoreModule],
    controllers:[
        UserController,
        UsuarioController
    ]
})
export class HttpServerModule {}
