import { Module } from '@nestjs/common';
import { MongoAuthRepository } from './domain/mongo-auth.repository';
import { PersistenceModule } from '../persistence/persistence.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt/strategies/jwt.strategy';
import { MongoUsuarioRepository } from './domain/mongo-usuario.repository';

export const AUTH_REPOSITORY = 'AUTH_REPOSITORY'
export const USUARIO_REPOSITORY = 'USUARIO_REPOSITORY'
const providers = [
    MongoAuthRepository,
    MongoUsuarioRepository,
    JwtStrategy,
    {
        provide: AUTH_REPOSITORY,
        useExisting: MongoAuthRepository,
    },
    {
        provide: USUARIO_REPOSITORY,
        useExisting: MongoUsuarioRepository,
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
