import { Module } from '@nestjs/common';
import { MongoAuthRepository } from './domain/mongo-auth.repository';
import { PersistenceModule } from '../persistence/persistence.module';

export const AUTH_REPOSITORY = 'AUTH_REPOSITORY'
const providers = [
    MongoAuthRepository,
   
    {
        provide: AUTH_REPOSITORY,
        useExisting: MongoAuthRepository,
    }
]


@Module({
    imports:[
        PersistenceModule
    ],
    providers:[
        ...providers
    ],
    exports:[
        ...providers
    ]
})
export class AdaptersModule {}
