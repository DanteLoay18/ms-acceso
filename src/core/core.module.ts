import { Module } from '@nestjs/common';
import { AuthUseCases } from './application/services/auth.useCases';
import { CqrsModule } from '@nestjs/cqrs';
import { AUTH_REPOSITORY, AdaptersModule, USUARIO_REPOSITORY } from 'src/infraestructure/adapters/adapters.module';
import { PersistenceModule } from 'src/infraestructure/persistence/persistence.module';
import { AuthService } from './domain/services/auth.service';
import { AuthRepository } from './domain/ports/outbound/auth.repository';
import { RegisterUsuarioCommand, RegisterUsuarioHandler } from './application/feautures/Auth/write/register';
import { LoginUsuarioCommand, LoginUsuarioHandler } from './application/feautures/Auth/write/login';
import { JwtService } from '@nestjs/jwt';
import { UsuarioByIdQuery, UsuarioByIdQueryHandler } from './application/feautures/Usuario/read/usuarioById.query';
import { UsuariosAllQuery, UsuariosAllQueryHandler } from './application/feautures/Usuario/read/usuariosAll.query';
import { UsuarioService } from './domain/services/usuario.service';
import { UsuarioRepository } from './domain/ports/outbound/usuario.repository';
import { UsuarioUseCases } from './application/services/usuario.useCases';
import { UpdateUsuarioPasswordCommand } from './application/feautures/Auth/write/update/updatePassword.command';
import { UpdateUsuarioPasswordHandler } from './application/feautures/Auth/write/update/updatePassword.handler';

const providers = [
    AuthUseCases,
    RegisterUsuarioCommand,
    RegisterUsuarioHandler,
    LoginUsuarioCommand,
    LoginUsuarioHandler,
    UsuarioByIdQuery,
    UsuarioByIdQueryHandler,
    UsuariosAllQuery,
    UsuariosAllQueryHandler,
    UpdateUsuarioPasswordCommand,
    UpdateUsuarioPasswordHandler
  ]



@Module({
    imports:[
        PersistenceModule,
        AdaptersModule,
        CqrsModule
    ],
    providers:[
        ...providers,
        {
            provide:AuthService,
            useFactory:(
                authRepository:AuthRepository
            )=> new AuthService(authRepository),
            inject:[
                AUTH_REPOSITORY
            ]
        },
        {
            provide: AuthUseCases,
            useFactory: (authService: AuthService, jwtService: JwtService, usuarioUseCases:UsuarioUseCases) => new AuthUseCases(authService,jwtService,usuarioUseCases),
            inject: [
              AuthService, JwtService,UsuarioUseCases
            ] 
        },
        {
            provide:UsuarioService,
            useFactory:(
                usuarioRepository:UsuarioRepository
            )=> new UsuarioService(usuarioRepository),
            inject:[
                USUARIO_REPOSITORY
            ]
        },
        {
            provide: UsuarioUseCases,
            useFactory: (usuarioService: UsuarioService) => new UsuarioUseCases(usuarioService),
            inject: [
                UsuarioService
            ] 
        },
    ],
    exports:[
        ...providers,
        CqrsModule,
        AdaptersModule
    ]
})
export class CoreModule {}
