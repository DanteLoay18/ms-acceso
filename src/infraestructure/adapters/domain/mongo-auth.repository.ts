import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Usuario } from "src/core/domain/entity/collections/usuario.collection";

import { AuthRepository } from "src/core/domain/ports/outbound/auth.repository";

@Injectable()
export class MongoAuthRepository implements AuthRepository {
    
    constructor(@InjectModel(Usuario.name) private authRepository: Model<Usuario>) { }
    
    
    findOneByEmail(email: string): Promise<Usuario> {
        return this.authRepository.findOne({email}).populate([
            {path:'usuarioCreacion',select: 'email nombres apellidos '},
            {path:'usuarioModificacion',select: 'email nombres apellidos '}
             ]) ;
    }
    
    
   
    findOneByName(nombres: string): Promise<Usuario> {
        console.log('repository',nombres)
        return this.authRepository.findOne({nombres}).populate([
                                                                {path:'usuarioCreacion',select: 'email nombres apellidos '},
                                                                {path:'usuarioModificacion',select: 'email nombres apellidos '}
                                                                 ]) ;
    }

    
    
    register(usuario: Usuario): Promise<Usuario> {
        return this.authRepository.create(usuario);
    }

     async updatePassword(id: string, usuario: Usuario): Promise<Usuario> {
       
        return  this.authRepository.findByIdAndUpdate(id,usuario, 
                                                    { new: true });
      
      }
}