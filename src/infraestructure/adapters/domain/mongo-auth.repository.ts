import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Usuario } from "src/core/domain/entity/collections/usuario.collection";

import { AuthRepository } from "src/core/domain/ports/outbound/auth.repository";

@Injectable()
export class MongoAuthRepository implements AuthRepository {
    
    constructor(@InjectModel(Usuario.name) private userRepository: Model<Usuario>) { }
    
    
    register(usuario: Usuario): Promise<Usuario> {
        return this.userRepository.create(usuario);
    }
    login(username: string, password: string): Promise<Usuario> {
        throw new Error("Method not implemented.");
    }

   

}