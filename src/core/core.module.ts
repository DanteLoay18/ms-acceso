import { Module } from '@nestjs/common';
import { AuthUseCases } from './application/services/auth.useCases';
import { CqrsModule } from '@nestjs/cqrs';
import { AUTH_REPOSITORY, AdaptersModule } from 'src/infraestructure/adapters/adapters.module';
import { PersistenceModule } from 'src/infraestructure/persistence/persistence.module';
import { AuthService } from './domain/services/auth.service';
import { AuthRepository } from './domain/ports/outbound/auth.repository';
import { RegisterUsuarioCommand, RegisterUsuarioHandler } from './application/feautures/Auth/write/register';
import { LoginUsuarioCommand, LoginUsuarioHandler } from './application/feautures/Auth/write/login';
import { JwtService } from '@nestjs/jwt';

const providers = [
    AuthUseCases,
    RegisterUsuarioCommand,
    RegisterUsuarioHandler,
    LoginUsuarioCommand,
    LoginUsuarioHandler
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
            useFactory: (authService: AuthService, jwtService: JwtService) => new AuthUseCases(authService,jwtService),
            inject: [
              AuthService, JwtService
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
