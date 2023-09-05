import { Module } from '@nestjs/common';
import { MongoAuthRepository } from './domain/mongo-auth.repository';
import { PersistenceModule } from '../persistence/persistence.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt/strategies/jwt.strategy';
import { MongoUsuarioRepository } from './domain/mongo-usuario.repository';
import { MongoOpcionRepository } from './domain/mongo-opcion.repository';
import { MongoSistemaRepository } from './domain/mongo-sistema.repository';
import { MongoMenuRepository } from './domain/mongo-menu.repository';

export const AUTH_REPOSITORY = 'AUTH_REPOSITORY';
export const USUARIO_REPOSITORY = 'USUARIO_REPOSITORY';
export const OPCION_REPOSITORY = 'OPCION_REPOSITORY';
export const SISTEMA_REPOSITORY = 'SISTEMA_REPOSITORY';
export const MENU_REPOSITORY = 'MENU_REPOSITORY';
const providers = [
    MongoAuthRepository,
    MongoUsuarioRepository,
    MongoOpcionRepository,
    MongoSistemaRepository,
    MongoMenuRepository,
    JwtStrategy,
    {
        provide: AUTH_REPOSITORY,
        useExisting: MongoAuthRepository,
    },
    {
        provide: USUARIO_REPOSITORY,
        useExisting: MongoUsuarioRepository,
    },
    {
        provide: OPCION_REPOSITORY,
        useExisting: MongoOpcionRepository,
    },
    {
        provide: SISTEMA_REPOSITORY,
        useExisting: MongoSistemaRepository,
    },
    {
        provide: MENU_REPOSITORY,
        useExisting: MongoMenuRepository,
    }
]


@Module({
    imports:[
        ConfigModule,
        PersistenceModule,
        PassportModule.register({defaultStrategy:'jwt'}),
        JwtModule.registerAsync({
            imports:[ConfigModule],
            inject:[ConfigService],
            useFactory: (configService:ConfigService) => {

                return {
                    secret: configService.get('JWT_SECRET'),
                    signOptions:{
                        expiresIn:'2h'
                    }
                }
            }
        })
    ],
    providers:[
        ...providers
    ],
    exports:[
        ...providers,
        PassportModule,
        JwtModule
    ]
})
export class AdaptersModule {}
