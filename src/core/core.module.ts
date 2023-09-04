import { Module } from '@nestjs/common';
import { AuthUseCases } from './application/services/auth.useCases';
import { RegisterUsuarioCommand } from './application/feautures/Auth/write/register/registerUsuario.command';
import { RegisterUsuarioHandler } from './application/feautures/Auth/write/register/registerUsuario.handler';
import { CqrsModule } from '@nestjs/cqrs';
import { AUTH_REPOSITORY, AdaptersModule } from 'src/infraestructure/adapters/adapters.module';
import { PersistenceModule } from 'src/infraestructure/persistence/persistence.module';
import { AuthService } from './domain/services/auth.service';
import { AuthRepository } from './domain/ports/outbound/auth.repository';

const providers = [
    AuthUseCases,
    RegisterUsuarioCommand,
    RegisterUsuarioHandler,
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
            useFactory: (authService: AuthService) => new AuthUseCases(authService),
            inject: [
              AuthService,
            ] 
        }
    ],
    exports:[
        ...providers,
        CqrsModule,
        AdaptersModule
    ]
})
export class CoreModule {}
