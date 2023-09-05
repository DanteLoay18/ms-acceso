import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { AUTH_REPOSITORY, AdaptersModule, OPCION_REPOSITORY, SISTEMA_REPOSITORY, USUARIO_REPOSITORY } from 'src/infraestructure/adapters/adapters.module';
import { PersistenceModule } from 'src/infraestructure/persistence/persistence.module';

import { JwtService } from '@nestjs/jwt';
import { AuthUseCases, UsuarioUseCases } from './application/services';
import { LoginUsuarioCommand, LoginUsuarioHandler, RegisterUsuarioCommand, RegisterUsuarioHandler, UpdateUsuarioPasswordCommand, UpdateUsuarioPasswordHandler } from './application/feautures/Auth/write';
import { UsuarioByIdQuery, UsuarioByIdQueryHandler, UsuariosAllQuery, UsuariosAllQueryHandler } from './application/feautures/Usuario/read';
import { DeleteUsuarioCommand, DeleteUsuarioHandler, ResetPasswordUsuarioCommand, ResetPasswordUsuarioHandler, UpdateUsuarioCommand, UpdateUsuarioHandler } from './application/feautures/Usuario/write';
import { AuthService, UsuarioService } from './domain/services';
import { AuthRepository, OpcionRepository, UsuarioRepository } from './domain/ports/outbound';
import { OpcionUseCases } from './application/services/opcionUseCases';
import { CreateOpcionCommand, CreateOpcionHandler, DeleteOpcionCommand, DeleteOpcionHandler, UpdateOpcionCommand, UpdateOpcionHandler } from './application/feautures/Opcion/write';
import { OpcionByIdQuery, OpcionByIdQueryHandler, OpcionesAllQuery, OpcionesAllQueryHandler } from './application/feautures/Opcion/read';
import { OpcionService } from './domain/services/opcion.service';
import { SistemaUseCases } from './application/services/sistema.useCases';
import { CreateSistemaCommand, CreateSistemaHandler, DeleteSistemaCommand, DeleteSistemaHandler, UpdateSistemaCommand, UpdateSistemaHandler } from './application/feautures/Sistema/write';
import { SistemaByIdQuery, SistemaByIdQueryHandler, SistemasAllQuery, SistemasAllQueryHandler } from './application/feautures/Sistema/read';
import { SistemaService } from './domain/services/sistema.service';
import { SistemaRepository } from './domain/ports/outbound/sistema.repository';

const USER_PROVIDERS=[
    AuthUseCases,
    UsuarioUseCases,
    RegisterUsuarioCommand,
    RegisterUsuarioHandler,
    LoginUsuarioCommand,
    LoginUsuarioHandler,
    UsuarioByIdQuery,
    UsuarioByIdQueryHandler,
    UsuariosAllQuery,
    UsuariosAllQueryHandler,
    UpdateUsuarioPasswordCommand,
    UpdateUsuarioPasswordHandler,
    UpdateUsuarioCommand,
    UpdateUsuarioHandler,
    DeleteUsuarioCommand,
    DeleteUsuarioHandler,
    ResetPasswordUsuarioCommand,
    ResetPasswordUsuarioHandler
]

const OPCION_PROVIDERS=[
    OpcionUseCases,
    CreateOpcionCommand,
    CreateOpcionHandler,
    UpdateOpcionCommand,
    UpdateOpcionHandler,
    DeleteOpcionCommand,
    DeleteOpcionHandler,
    OpcionByIdQuery,
    OpcionByIdQueryHandler,
    OpcionesAllQuery,
    OpcionesAllQueryHandler
]

const SISTEMA_PROVIDERS=[
    SistemaUseCases,
    CreateSistemaCommand,
    CreateSistemaHandler,
    UpdateSistemaCommand,
    UpdateSistemaHandler,
    DeleteSistemaCommand,
    DeleteSistemaHandler,
    SistemaByIdQuery,
    SistemaByIdQueryHandler,
    SistemasAllQuery,
    SistemasAllQueryHandler
]

const providers = [
    ...USER_PROVIDERS,
    ...OPCION_PROVIDERS,
    ...SISTEMA_PROVIDERS
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
        {
            provide:OpcionService,
            useFactory:(
                opcionRepository:OpcionRepository
            )=> new OpcionService(opcionRepository),
            inject:[
                OPCION_REPOSITORY
            ]
        },
        {
            provide: OpcionUseCases,
            useFactory: (opcionService: OpcionService) => new OpcionUseCases(opcionService),
            inject: [
              OpcionService
            ] 
        },
        {
            provide:SistemaService,
            useFactory:(
                sistemaRepository:SistemaRepository
            )=> new SistemaService(sistemaRepository),
            inject:[
                SISTEMA_REPOSITORY
            ]
        },
        {
            provide: SistemaUseCases,
            useFactory: (sistemaService: SistemaService) => new SistemaUseCases(sistemaService),
            inject: [
                SistemaService
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
